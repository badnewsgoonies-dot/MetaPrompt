import { FARM_ORIGIN, FARM_SIZE, TILE_SIZE } from "./constants.js";
import { TileState } from "./farmGrid.js";

const COLORS = {
  grass: "#3f704d",
  tilled: "#5e3c23",
  watered: "#3c4c8a",
  weed: "#2d823c",
  rock: "#8b8b8b",
};

export class Renderer {
  constructor(canvas, farm, player, npcSystem, animalSystem, animationSystem) {
    this.canvas = canvas;
    this.ctx = canvas.getContext("2d");
    this.farm = farm;
    this.player = player;
    this.npcSystem = npcSystem;
    this.animalSystem = animalSystem;
    this.animationSystem = animationSystem;
    this.specialPoints = {};
    this.targetTile = null;
    this.debugOptions = { showTileIds: false };
    this.weatherEffect = { currentId: null, raindrops: [] };
    this.currentWeather = null;
    this.paused = false;
  }

  setSpecialPoints(points) {
    this.specialPoints = points;
  }

  setDebugOptions(options) {
    this.debugOptions = { ...this.debugOptions, ...options };
  }

  getDebugOptions() {
    return { ...this.debugOptions };
  }

  update(delta, weather, paused = false) {
    this.paused = paused;
    this.currentWeather = weather;
    if (!weather) {
      this.weatherEffect.currentId = null;
      this.weatherEffect.raindrops = [];
      return;
    }

    if (this.weatherEffect.currentId !== weather.id) {
      this.weatherEffect.currentId = weather.id;
      this.initializeWeatherEffect(weather.id);
    }

    if (paused) {
      return;
    }

    if (weather.id === "rain") {
      const drops = this.weatherEffect.raindrops;
      for (const drop of drops) {
        drop.x += drop.drift * delta;
        drop.y += drop.speed * delta;
        if (drop.y > this.canvas.height) {
          drop.y = -Math.random() * 50;
          drop.x = Math.random() * this.canvas.width;
        }
      }
    }
  }

  initializeWeatherEffect(weatherId) {
    if (weatherId === "rain") {
      const count = 120;
      this.weatherEffect.raindrops = Array.from({ length: count }, () => ({
        x: Math.random() * this.canvas.width,
        y: Math.random() * this.canvas.height,
        length: 18 + Math.random() * 10,
        speed: 420 + Math.random() * 120,
        drift: -80 - Math.random() * 60,
      }));
    } else {
      this.weatherEffect.raindrops = [];
    }
  }

  clear() {
    this.ctx.fillStyle = "#283044";
    this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
  }

  drawStructures() {
    const ctx = this.ctx;
    ctx.save();

    // farmhouse
    ctx.fillStyle = "#8d5524";
    ctx.fillRect(6 * TILE_SIZE, 2 * TILE_SIZE, TILE_SIZE * 3, TILE_SIZE * 3);
    ctx.fillStyle = "#c97b2a";
    ctx.beginPath();
    ctx.moveTo(6 * TILE_SIZE, 2 * TILE_SIZE);
    ctx.lineTo(7.5 * TILE_SIZE, TILE_SIZE);
    ctx.lineTo(9 * TILE_SIZE, 2 * TILE_SIZE);
    ctx.closePath();
    ctx.fill();

    // barn
    ctx.fillStyle = "#914c3f";
    ctx.fillRect((FARM_ORIGIN.x - 4) * TILE_SIZE, (FARM_ORIGIN.y + 4) * TILE_SIZE, TILE_SIZE * 2, TILE_SIZE * 3);
    ctx.fillStyle = "#d2896a";
    ctx.fillRect((FARM_ORIGIN.x - 3.7) * TILE_SIZE, (FARM_ORIGIN.y + 4.4) * TILE_SIZE, TILE_SIZE * 1.4, TILE_SIZE * 0.4);

    // pathway tiles
    ctx.fillStyle = "#c9b79c";
    ctx.fillRect(7 * TILE_SIZE, 5 * TILE_SIZE, TILE_SIZE * 8, TILE_SIZE * 0.5);
    ctx.fillRect(7.25 * TILE_SIZE, 5.5 * TILE_SIZE, TILE_SIZE * 0.5, TILE_SIZE * 4);

    // shipping bin
    const shipping = this.specialPoints.shippingBin;
    if (shipping) {
      const size = TILE_SIZE * 1.4;
      const x = shipping.position.x - size / 2;
      const y = shipping.position.y - size / 2;
      const dist = Math.hypot(
        this.player.position.x - shipping.position.x,
        this.player.position.y - shipping.position.y
      );
      ctx.fillStyle = dist <= shipping.radius ? "#f0c75e" : "#c97b2a";
      ctx.fillRect(x, y, size, size);
      ctx.strokeStyle = "rgba(0,0,0,0.4)";
      ctx.strokeRect(x, y, size, size);
      ctx.fillStyle = "#182033";
      ctx.font = "bold 14px Nunito";
      ctx.fillText("Ship", x + 12, y + size / 2 + 4);
    }

    ctx.restore();
  }

  drawFarm() {
    const ctx = this.ctx;
    ctx.save();
    ctx.translate(FARM_ORIGIN.x * TILE_SIZE, FARM_ORIGIN.y * TILE_SIZE);
    for (let y = 0; y < FARM_SIZE.height; y++) {
      for (let x = 0; x < FARM_SIZE.width; x++) {
        const tile = this.farm.getTile(x, y);
        ctx.fillStyle = COLORS[tile.type] ?? COLORS.grass;
        ctx.fillRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);
        ctx.strokeStyle = "rgba(0,0,0,0.2)";
        ctx.strokeRect(x * TILE_SIZE, y * TILE_SIZE, TILE_SIZE, TILE_SIZE);

        if (tile.crop) {
          const stageColor = ["#9be564", "#74c365", "#509c47", "#bad420", "#ffe680"][
            Math.min(tile.crop.stage, 4)
          ];
          ctx.fillStyle = stageColor;
          ctx.fillRect(
            x * TILE_SIZE + 6,
            y * TILE_SIZE + 6,
            TILE_SIZE - 12,
            TILE_SIZE - 12
          );
        }

        if (this.debugOptions.showTileIds) {
          ctx.fillStyle = "rgba(0, 0, 0, 0.55)";
          ctx.font = "10px Nunito";
          ctx.fillText(`${x},${y}`, x * TILE_SIZE + 2, y * TILE_SIZE + 12);
          ctx.fillStyle = "rgba(255, 255, 255, 0.55)";
          ctx.fillText(
            tile.type.slice(0, 3).toUpperCase(),
            x * TILE_SIZE + 2,
            y * TILE_SIZE + TILE_SIZE - 6
          );
          if (tile.crop) {
            ctx.fillText(
              `S${tile.crop.stage}`,
              x * TILE_SIZE + TILE_SIZE - 22,
              y * TILE_SIZE + 12
            );
          }
        }
      }
    }
    ctx.restore();
  }

  drawToolTarget() {
    if (!this.targetTile || !this.targetTile.world) return;
    const ctx = this.ctx;
    const size = TILE_SIZE;
    const originX = this.targetTile.world.x - size / 2;
    const originY = this.targetTile.world.y - size / 2;
    ctx.save();
    ctx.strokeStyle = "rgba(255, 255, 255, 0.8)";
    ctx.lineWidth = 2;
    ctx.setLineDash([6, 6]);
    ctx.strokeRect(originX, originY, size, size);
    ctx.restore();
  }

  drawPlayer() {
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "#f2a65a";
    ctx.fillRect(this.player.position.x - 12, this.player.position.y - 16, 24, 24);
    ctx.restore();
  }

  drawNPCs() {
    const ctx = this.ctx;
    ctx.save();
    this.npcSystem.npcs.forEach((npc) => {
      ctx.fillStyle = "#f5b7f2";
      ctx.fillRect(npc.position.x - 12, npc.position.y - 16, 24, 24);
      ctx.fillStyle = "#fff";
      ctx.font = "12px Nunito";
      ctx.fillText(npc.name, npc.position.x - 16, npc.position.y - 20);
    });
    ctx.restore();
  }

  drawAnimals() {
    const ctx = this.ctx;
    ctx.save();
    this.animalSystem.animals.forEach((animal) => {
      const pos = animal.position ?? { x: 3 * TILE_SIZE, y: 12 * TILE_SIZE };
      ctx.fillStyle = "#d7c59a";
      ctx.fillRect(pos.x - TILE_SIZE / 2, pos.y - TILE_SIZE / 2, TILE_SIZE, TILE_SIZE);
      ctx.fillStyle = "#000";
      ctx.fillText(animal.name, pos.x - TILE_SIZE / 2, pos.y - TILE_SIZE / 2 - 4);
    });
    ctx.restore();
  }

  drawToolAnimation() {
    if (!this.animationSystem.active) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.strokeStyle = "rgba(255,255,255,0.6)";
    ctx.lineWidth = 3;
    const radius = 22;
    ctx.beginPath();
    ctx.arc(this.player.position.x, this.player.position.y, radius, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }

  drawWeatherOverlay() {
    if (!this.currentWeather) return;
    const ctx = this.ctx;
    if (this.currentWeather.id === "rain") {
      ctx.save();
      ctx.strokeStyle = "rgba(180, 220, 255, 0.55)";
      ctx.lineWidth = 1;
      for (const drop of this.weatherEffect.raindrops) {
        ctx.beginPath();
        ctx.moveTo(drop.x, drop.y);
        ctx.lineTo(drop.x + drop.drift * 0.08, drop.y + drop.length);
        ctx.stroke();
      }
      ctx.restore();
    } else if (this.currentWeather.id === "cloudy") {
      ctx.save();
      const gradient = ctx.createLinearGradient(0, 0, 0, this.canvas.height);
      gradient.addColorStop(0, "rgba(120, 132, 161, 0.18)");
      gradient.addColorStop(1, "rgba(46, 52, 78, 0.22)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
    } else if (this.currentWeather.id === "sunny") {
      ctx.save();
      const gradient = ctx.createRadialGradient(
        this.canvas.width * 0.8,
        this.canvas.height * 0.2,
        0,
        this.canvas.width * 0.8,
        this.canvas.height * 0.2,
        this.canvas.width * 0.65
      );
      gradient.addColorStop(0, "rgba(255, 242, 176, 0.3)");
      gradient.addColorStop(1, "rgba(255, 242, 176, 0)");
      ctx.fillStyle = gradient;
      ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
      ctx.restore();
    }
  }

  drawPauseOverlay() {
    if (!this.paused) return;
    const ctx = this.ctx;
    ctx.save();
    ctx.fillStyle = "rgba(0, 0, 0, 0.35)";
    ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
    ctx.fillStyle = "rgba(255, 255, 255, 0.85)";
    ctx.font = "bold 22px Nunito";
    ctx.textAlign = "center";
    ctx.fillText("Paused", this.canvas.width / 2, 48);
    ctx.restore();
  }

  render(targetTile) {
    this.targetTile = targetTile;
    this.clear();
    this.drawFarm();
    this.drawToolTarget();
    this.drawStructures();
    this.drawAnimals();
    this.drawNPCs();
    this.drawPlayer();
    this.drawToolAnimation();
    this.drawWeatherOverlay();
    this.drawPauseOverlay();
  }
}
