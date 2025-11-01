import { PLAYER_SPEED, TILE_SIZE, TOOLS, TOOL_STAMINA_COST } from "./constants.js";
import { clamp } from "./utils.js";

export class Player {
  constructor(staminaSystem, farmGrid, animationSystem) {
    this.position = { x: 10 * TILE_SIZE, y: 8 * TILE_SIZE };
    this.velocity = { x: 0, y: 0 };
    this.direction = "down";
    this.currentToolIndex = 0;
    this.staminaSystem = staminaSystem;
    this.farmGrid = farmGrid;
    this.animationSystem = animationSystem;
    this.gold = 500;
    this.shippedToday = 0;
    this.inventory = {
      turnip_seeds: 9,
      turnips: 0,
      fodder: 10,
    };
    this.relationships = { popuri: 10 };
  }

  equipTool(index) {
    this.currentToolIndex = clamp(index, 0, TOOLS.length - 1);
  }

  currentTool() {
    return TOOLS[this.currentToolIndex];
  }

  update(delta, input, farm, cropSystem, audio) {
    this.velocity.x = 0;
    this.velocity.y = 0;

    if (input.isDown("arrowup")) {
      this.velocity.y = -1;
      this.direction = "up";
    }
    if (input.isDown("arrowdown")) {
      this.velocity.y = 1;
      this.direction = "down";
    }
    if (input.isDown("arrowleft")) {
      this.velocity.x = -1;
      this.direction = "left";
    }
    if (input.isDown("arrowright")) {
      this.velocity.x = 1;
      this.direction = "right";
    }

    if (this.velocity.x !== 0 && this.velocity.y !== 0) {
      this.velocity.x *= Math.SQRT1_2;
      this.velocity.y *= Math.SQRT1_2;
    }

    this.position.x += this.velocity.x * PLAYER_SPEED * delta;
    this.position.y += this.velocity.y * PLAYER_SPEED * delta;

    this.position.x = clamp(this.position.x, TILE_SIZE * 2, TILE_SIZE * 22);
    this.position.y = clamp(this.position.y, TILE_SIZE * 3, TILE_SIZE * 16);

    if (input.isDown(" ")) {
      this.useTool(farm, cropSystem, audio);
    }
  }

  useTool(farm, cropSystem, audio) {
    const tool = this.currentTool();
    if (!tool) return;

    if (!this.staminaSystem.hasStamina(TOOL_STAMINA_COST[tool.id] ?? 5)) {
      audio.play("exhausted");
      return;
    }

    const target = farm.getTileFromWorld(this.position, this.direction);
    if (!target) return;

    switch (tool.id) {
      case "hoe":
        if (farm.tillTile(target.x, target.y)) {
          this.staminaSystem.consume(TOOL_STAMINA_COST.hoe);
          audio.play("hoe");
          this.animationSystem.playToolSwing(tool.id);
        }
        break;
      case "turnip_seeds":
        if ((this.inventory.turnip_seeds ?? 0) > 0 && farm.plantCrop(target.x, target.y, "turnip")) {
          this.inventory.turnip_seeds -= 1;
          this.staminaSystem.consume(TOOL_STAMINA_COST.turnip_seeds);
          audio.play("plant");
          this.animationSystem.playToolSwing(tool.id);
        }
        break;
      case "watering_can":
        if (farm.waterTile(target.x, target.y)) {
          this.staminaSystem.consume(TOOL_STAMINA_COST.watering_can);
          audio.play("water");
          this.animationSystem.playToolSwing(tool.id);
        }
        break;
      case "sickle":
        if (farm.clearWeeds(target.x, target.y)) {
          this.staminaSystem.consume(TOOL_STAMINA_COST.sickle);
          audio.play("sickle");
          this.animationSystem.playToolSwing(tool.id);
        } else if (farm.harvestCrop(target.x, target.y, cropSystem)) {
          this.staminaSystem.consume(TOOL_STAMINA_COST.sickle);
          this.inventory.turnips = (this.inventory.turnips ?? 0) + 1;
          audio.play("harvest");
          this.animationSystem.playToolSwing(tool.id);
        }
        break;
    }
  }

  shipHarvested(cropSystem) {
    const turnips = this.inventory.turnips ?? 0;
    if (turnips <= 0) {
      return { shipped: false };
    }
    const value = turnips * cropSystem.sellValue("turnip");
    this.gold += value;
    this.shippedToday += value;
    this.inventory.turnips = 0;
    return { shipped: true, cropId: "turnip", count: turnips, value };
  }

  sleep(resetPosition = true) {
    if (resetPosition) {
      this.position.x = 10 * TILE_SIZE;
      this.position.y = 8 * TILE_SIZE;
    }
    this.shippedToday = 0;
  }

  serialize() {
    return {
      position: this.position,
      currentToolIndex: this.currentToolIndex,
      gold: this.gold,
      inventory: this.inventory,
      relationships: this.relationships,
    };
  }

  hydrate(data) {
    this.position = data.position ?? this.position;
    this.currentToolIndex = data.currentToolIndex ?? this.currentToolIndex;
    this.gold = data.gold ?? this.gold;
    this.inventory = {
      ...this.inventory,
      ...(data.inventory ?? {}),
    };
    this.relationships = data.relationships ?? this.relationships;
  }
}
