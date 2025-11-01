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
  }

  setSpecialPoints(points) {
    this.specialPoints = points;
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
      }
    }
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

  render() {
    this.clear();
    this.drawFarm();
    this.drawStructures();
    this.drawAnimals();
    this.drawNPCs();
    this.drawPlayer();
    this.drawToolAnimation();
  }
}
