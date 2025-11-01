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

export class Game {
  constructor(canvas, hudElement, menuElement, menuContentElement) {
    this.canvas = canvas;
    this.hudElement = hudElement;
    this.menuElement = menuElement;
    this.menuContentElement = menuContentElement;

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
    this.ui = new UIOverlay(hudElement, menuElement, menuContentElement);

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
    this.shippingBin = {
      position: {
        x: (FARM_ORIGIN.x - 1) * TILE_SIZE + TILE_SIZE * 0.5,
        y: (FARM_ORIGIN.y + 3) * TILE_SIZE,
      },
      radius: TILE_SIZE * 1.1,
    };

    this.renderer.setSpecialPoints({ shippingBin: this.shippingBin });
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
    requestAnimationFrame((ts) => this.loop(ts));
  }

  handleKeyChange(key, pressed) {
    if (!pressed) return;
    this.audioSystem.ensureContext?.();
    if (["1", "2", "3", "4"].includes(key)) {
      const index = parseInt(key, 10) - 1;
      this.player.equipTool(index);
    }
    if (key === "m") {
      this.ui.toggleMenu();
    }
    if (key === "enter") {
      if (this.isPlayerInBed()) {
        this.sleep();
      }
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
    this.animationSystem.update(delta);
    this.player.update(delta, this.input, this.farm, this.cropSystem, this.audioSystem);
    this.npcSystem.update(this.timeManager, delta);
    this.ui.tick(delta);

    this.timeManager.advance(delta * MINUTES_PER_TICK);

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
  }

  render() {
    this.renderer.render();
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
    this.farm.advanceDay(this.cropSystem, this.timeManager.weather);
    this.animalSystem.dailyTick();
    this.timeManager.advance(24 * 60); // force next day
    this.staminaSystem.resetForNewDay(this.timeManager.weather);
    this.player.sleep();
    this.saveManager.save();
    this.ui.showMessage("A new day dawns on the farm.");
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
