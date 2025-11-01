import { LOGIC_HZ, MINUTES_PER_TICK } from "./constants.js";
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
      this.tryTalkToNPC();
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

    const rolledToNewDay = this.timeManager.advance(delta * MINUTES_PER_TICK);

    this.npcSystem.update(this.timeManager, delta);

    if (rolledToNewDay) {
      this.startNewDay();
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
  }

  render() {
    this.renderer.render();
    if (this.ui.menuVisible) {
      this.menuElement.classList.add("active");
    } else {
      this.menuElement.classList.remove("active");
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
    this.timeManager.advance(24 * 60); // force next day
    this.startNewDay({ refreshUI: true });
  }

  tryTalkToNPC() {
    const threshold = 40;
    const npc = this.npcSystem.npcs.find((npc) => {
      const dx = npc.position.x - this.player.position.x;
      const dy = npc.position.y - this.player.position.y;
      return Math.sqrt(dx * dx + dy * dy) <= threshold;
    });
    if (npc) {
      this.npcSystem.talkToNPC(this.player);
    }
  }

  startNewDay({ resetPlayerPosition = true, refreshUI = false } = {}) {
    this.farm.advanceDay(this.cropSystem, this.timeManager.weather);
    this.animalSystem.dailyTick();
    this.staminaSystem.resetForNewDay(this.timeManager.weather);
    this.player.sleep(resetPlayerPosition);
    this.saveManager.save();

    if (refreshUI) {
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
  }
}
