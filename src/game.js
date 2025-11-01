import { FARM_ORIGIN, LOGIC_HZ, MINUTES_PER_TICK, TILE_SIZE } from "./constants.js";
import { TimeManager } from "./timeManager.js";
import { InputMapper } from "./input.js";
import { Player } from "./player.js";
import { FarmGrid } from "./farmGrid.js";
import { CropGrowthSystem } from "./cropSystem.js";
import { StaminaSystem } from "./staminaSystem.js";
import { Renderer } from "./rendering.js";
import { UIOverlay } from "./ui.js";
import { AnimationSystem } from "./animationSystem.js";
import { AudioSystem } from "./audioSystem.js";
import { AnimalSystem } from "./animalSystem.js";
import { NPCSystem } from "./npcSystem.js";
import { SaveManager } from "./saveManager.js";
import { formatGold } from "./utils.js";
import { DebugOverlay } from "./debugOverlay.js";

export class Game {
  constructor(
    canvas,
    hudElement,
    menuElement,
    menuContentElement,
    menuDetailElement,
    debugElement
  ) {
    this.canvas = canvas;
    this.hudElement = hudElement;
    this.menuElement = menuElement;
    this.menuContentElement = menuContentElement;
    this.menuDetailElement = menuDetailElement;

    this.timeManager = new TimeManager();
    this.staminaSystem = new StaminaSystem();
    this.farm = new FarmGrid();
    this.cropSystem = new CropGrowthSystem();
    this.animationSystem = new AnimationSystem();
    this.animalSystem = new AnimalSystem();
    this.npcSystem = new NPCSystem();
    this.player = new Player(this.staminaSystem, this.farm, this.animationSystem);

    this.audioSystem = new AudioSystem();
    this.input = new InputMapper();
    this.renderer = new Renderer(
      canvas,
      this.farm,
      this.player,
      this.npcSystem,
      this.animalSystem,
      this.animationSystem
    );
    this.ui = new UIOverlay(
      hudElement,
      menuElement,
      menuContentElement,
      menuDetailElement
    );
    this.debugOverlay = new DebugOverlay(debugElement);

    this.saveManager = new SaveManager(
      this.timeManager,
      this.player,
      this.staminaSystem,
      this.farm,
      this.animalSystem,
      this.npcSystem
    );

    this.accumulator = 0;
    this.lastTimestamp = 0;
    this.menuLocked = false;
    this.bedArea = { x: 8 * 32, y: 5 * 32, width: 48, height: 48 };
    this.currentTargetTile = null;
    this.shippingBin = {
      position: {
        x: (FARM_ORIGIN.x - 1) * TILE_SIZE + TILE_SIZE * 0.5,
        y: (FARM_ORIGIN.y + 3) * TILE_SIZE,
      },
      radius: TILE_SIZE * 1.1,
    };

    this.renderer.setSpecialPoints({ shippingBin: this.shippingBin });
    this.renderer.setDebugOptions({ showTileIds: false });
  }

  async init() {
    this.input.init();
    this.input.onChange((key, pressed) => this.handleKeyChange(key, pressed));
    await this.audioSystem.init();
    this.saveManager.load();
    this.ui.update(
      this.player,
      this.timeManager,
      this.staminaSystem,
      this.timeManager.weather,
      this.farm,
      this.npcSystem,
      this.animalSystem,
      this.cropSystem
    );
    this.debugOverlay.update(this.buildDebugState());
    requestAnimationFrame((ts) => this.loop(ts));
  }

  handleKeyChange(key, pressed) {
    if (!pressed) {
      return;
    }

    this.audioSystem.ensureContext?.();

    if (key === "escape") {
      if (this.ui.menuVisible) {
        this.ui.toggleMenu(false);
        this.debugOverlay.update(this.buildDebugState());
      }
      return;
    }

    if (key === "m") {
      this.ui.toggleMenu();
      this.debugOverlay.update(this.buildDebugState());
      return;
    }

    if (key === "f1") {
      const visible = this.debugOverlay.toggleVisibility();
      this.ui.showMessage(`Debug overlay ${visible ? "visible" : "hidden"}.`, 1.6);
      this.debugOverlay.update(this.buildDebugState());
      return;
    }

    if (key === "f2") {
      const infinite = this.debugOverlay.toggleInfiniteStamina();
      this.staminaSystem.setInfinite(infinite);
      this.ui.showMessage(
        `Debug: infinite stamina ${infinite ? "enabled" : "disabled"}.`,
        1.6
      );
      this.debugOverlay.update(this.buildDebugState());
      return;
    }

    if (key === "f3") {
      const showTiles = this.debugOverlay.toggleTileIds();
      this.renderer.setDebugOptions({ showTileIds: showTiles });
      this.ui.showMessage(`Debug: tile overlays ${showTiles ? "ON" : "OFF"}.`, 1.6);
      this.debugOverlay.update(this.buildDebugState());
      return;
    }

    if (key === "f4") {
      this.debugSkipMinutes(60);
      this.debugOverlay.update(this.buildDebugState());
      return;
    }

    if (key === "f5") {
      this.debugAdvanceDay();
      this.debugOverlay.update(this.buildDebugState());
      return;
    }

    if (this.ui.menuVisible) {
      if (key === "arrowup") {
        this.ui.moveMenuSelection(-1);
        this.debugOverlay.update(this.buildDebugState());
        return;
      }
      if (key === "arrowdown") {
        this.ui.moveMenuSelection(1);
        this.debugOverlay.update(this.buildDebugState());
        return;
      }
      // When menu is open, swallow other gameplay interactions.
      return;
    }

    if (["1", "2", "3", "4"].includes(key)) {
      const index = parseInt(key, 10) - 1;
      this.player.equipTool(index);
      return;
    }

    if (key === "q") {
      this.player.cycleTool(-1);
      return;
    }

    if (key === "r") {
      this.player.cycleTool(1);
      return;
    }

    if (key === "enter") {
      if (this.isPlayerInBed()) {
        this.sleep();
      }
      return;
    }

    if (key === "e") {
      this.handleInteract();
    }
  }

  loop(timestamp) {
    if (!this.lastTimestamp) {
      this.lastTimestamp = timestamp;
    }
    const delta = (timestamp - this.lastTimestamp) / 1000;
    this.lastTimestamp = timestamp;

    this.accumulator += delta;
    const step = 1 / LOGIC_HZ;
    while (this.accumulator >= step) {
      this.update(step);
      this.accumulator -= step;
    }

    this.render();
    requestAnimationFrame((ts) => this.loop(ts));
  }

  update(delta) {
    const paused = this.ui.menuVisible;
    this.animationSystem.update(delta);

    if (!paused) {
      this.player.update(delta, this.input, this.farm, this.cropSystem, this.audioSystem);
      const targeted = this.farm.getTileFromWorld(
        this.player.position,
        this.player.direction
      );
      this.currentTargetTile = targeted
        ? {
            tile: targeted,
            world: this.farm.tileToWorld(targeted.x, targeted.y),
          }
        : null;
      this.npcSystem.update(this.timeManager, delta);

      const previousWeather = this.timeManager.weather;
      const rolledDay = this.timeManager.advance(delta * MINUTES_PER_TICK);
      if (rolledDay) {
        this.handleDayTransition(previousWeather, {
          resetPosition: true,
          message: "You blacked out after working late."
            + " Joja can't repo your bed yet!",
        });
      }
    } else {
      this.currentTargetTile = null;
    }

    this.renderer.update(delta, this.timeManager.weather, paused);
    this.ui.tick(delta);

    this.ui.update(
      this.player,
      this.timeManager,
      this.staminaSystem,
      this.timeManager.weather,
      this.farm,
      this.npcSystem,
      this.animalSystem,
      this.cropSystem
    );
    this.debugOverlay.update(this.buildDebugState());
  }

  render() {
    this.renderer.render(this.currentTargetTile);
    if (this.ui.menuVisible) {
      this.menuElement.classList.add("active");
    } else {
      this.menuElement.classList.remove("active");
    }
  }

  handleInteract() {
    if (this.ui.menuVisible) {
      return;
    }

    const shippingMessage = this.tryUseShippingBin();
    if (shippingMessage !== null) {
      this.ui.showMessage(shippingMessage);
      if (shippingMessage.includes("Shipped")) {
        this.audioSystem.play("ship");
      }
      return;
    }

    const animalMessage = this.tryAnimalInteraction();
    if (animalMessage) {
      this.ui.showMessage(animalMessage);
      this.audioSystem.play("animal");
      return;
    }

    const npcMessage = this.tryTalkToNPC();
    if (npcMessage) {
      this.ui.showMessage(npcMessage);
      this.audioSystem.play("npc");
    }
  }

  isPlayerInBed() {
    return (
      this.player.position.x >= this.bedArea.x &&
      this.player.position.x <= this.bedArea.x + this.bedArea.width &&
      this.player.position.y >= this.bedArea.y &&
      this.player.position.y <= this.bedArea.y + this.bedArea.height
    );
  }

  sleep() {
    const previousWeather = this.timeManager.weather;
    this.timeManager.advance(24 * 60);
    this.handleDayTransition(previousWeather, {
      resetPosition: true,
      message: "A new day dawns on the farm.",
    });
  }

  handleDayTransition(previousWeather, options = {}) {
    const { resetPosition = true, message } = options;
    this.farm.advanceDay(this.cropSystem, previousWeather);
    this.animalSystem.dailyTick();
    this.staminaSystem.resetForNewDay(this.timeManager.weather);
    this.player.sleep(resetPosition);
    this.saveManager.save();
    if (message) {
      this.ui.showMessage(message);
    }
    this.ui.update(
      this.player,
      this.timeManager,
      this.staminaSystem,
      this.timeManager.weather,
      this.farm,
      this.npcSystem,
      this.animalSystem,
      this.cropSystem
    );
    this.debugOverlay.update(this.buildDebugState());
  }

  debugSkipMinutes(minutes) {
    let remaining = Math.max(0, minutes);
    if (remaining === 0) return;

    let triggeredDay = false;
    while (remaining > 0) {
      const step = Math.min(remaining, 60);
      const previousWeather = this.timeManager.weather;
      const rolled = this.timeManager.advance(step);
      if (rolled) {
        triggeredDay = true;
        this.handleDayTransition(previousWeather, {
          resetPosition: false,
          message: "Debug: skipped ahead to a fresh dawn.",
        });
      }
      remaining -= step;
    }

    if (!triggeredDay) {
      this.ui.showMessage(
        `Debug: advanced ${minutes} minute${minutes === 1 ? "" : "s"}.`,
        1.6
      );
    }

    this.ui.update(
      this.player,
      this.timeManager,
      this.staminaSystem,
      this.timeManager.weather,
      this.farm,
      this.npcSystem,
      this.animalSystem,
      this.cropSystem
    );
    this.debugOverlay.update(this.buildDebugState());
  }

  debugAdvanceDay() {
    const previousWeather = this.timeManager.weather;
    this.timeManager.advance(24 * 60);
    this.handleDayTransition(previousWeather, {
      resetPosition: false,
      message: "Debug: jumped to the next morning.",
    });
  }

  buildDebugState() {
    const playerTile = {
      x: Math.floor(this.player.position.x / TILE_SIZE) - FARM_ORIGIN.x,
      y: Math.floor(this.player.position.y / TILE_SIZE) - FARM_ORIGIN.y,
    };
    const playerTileState = this.farm.getTile(playerTile.x, playerTile.y);
    const targetCoords = this.currentTargetTile?.tile ?? null;
    const targetTileState = targetCoords
      ? this.farm.getTile(targetCoords.x, targetCoords.y)
      : null;

    return {
      time: {
        label: this.timeManager.formattedTime(),
        minute: this.timeManager.minute,
        day: this.timeManager.dayLabel(),
        season: this.timeManager.seasonLabel(),
      },
      weather: this.timeManager.weather,
      stamina: {
        current: this.staminaSystem.current,
        max: this.staminaSystem.max,
        infinite: this.staminaSystem.infinite ?? false,
      },
      player: {
        position: { ...this.player.position },
        tile: playerTile,
        tileState: playerTileState ?? null,
        gold: this.player.gold,
        tool: this.player.currentTool()?.label ?? "None",
        shippedToday: this.player.shippedToday,
      },
      target: {
        coords: targetCoords,
        tile: targetTileState ?? null,
      },
      farm: {
        tilled: this.farm.summary(this.cropSystem),
      },
      flags: {
        showTileIds: this.renderer.getDebugOptions().showTileIds,
        paused: this.ui.menuVisible,
      },
    };
  }

  tryTalkToNPC() {
    const threshold = 40;
    const npc = this.npcSystem.npcs.find((npc) => {
      const dx = npc.position.x - this.player.position.x;
      const dy = npc.position.y - this.player.position.y;
      return Math.sqrt(dx * dx + dy * dy) <= threshold;
    });
    if (npc) {
      return this.npcSystem.talkToNPC(this.player);
    }
    return null;
  }

  tryAnimalInteraction() {
    return this.animalSystem.interact(this.player);
  }

  tryUseShippingBin() {
    const bin = this.shippingBin;
    const dist = Math.sqrt(
      (bin.position.x - this.player.position.x) ** 2 +
        (bin.position.y - this.player.position.y) ** 2
    );
    if (dist > bin.radius) {
      return null;
    }
    const result = this.player.shipHarvested(this.cropSystem);
    if (!result.shipped) {
      return "No harvested crops to ship yet.";
    }
    return `Shipped ${result.count} turnip${result.count > 1 ? "s" : ""} for ${formatGold(
      result.value
    )}!`;
  }
}
