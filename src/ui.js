import { formatGold, clamp } from "./utils.js";
import { PLAYER_STAMINA_MAX, TOOLS } from "./constants.js";

export class UIOverlay {
  constructor(hudElement, menuElement, menuContentElement) {
    this.hudElement = hudElement;
    this.menuElement = menuElement;
    this.menuContentElement = menuContentElement;
    this.menuVisible = false;
    this.message = null;
    this.messageTimer = 0;
  }

  update(player, timeManager, stamina, weather, farm, npcSystem, animalSystem, cropSystem) {
    const staminaRatio = clamp(stamina.current / PLAYER_STAMINA_MAX, 0, 1);
    const tool = TOOLS[player.currentToolIndex];

    const messageRow = this.message
      ? `<div class="row message"><div class="panel" style="flex:1; text-align:center; background: rgba(255,255,255,0.12);">${
          this.message
        }</div></div>`
      : "";

    this.hudElement.innerHTML = `
      ${messageRow}
      <div class="row">
        <div class="panel">${timeManager.formattedTime()} · ${timeManager.dayLabel()} (${timeManager.seasonLabel()})</div>
        <div class="panel">Weather: ${weather.label}</div>
        <div class="panel">Gold: ${formatGold(player.gold)}</div>
      </div>
      <div class="row">
        <div class="panel" style="flex:1;">
          Stamina
          <div class="progress"><span style="width:${Math.floor(staminaRatio * 100)}%"></span></div>
        </div>
        <div class="panel">Tool: ${tool?.label ?? "None"}</div>
        <div class="panel">Shipped Today: ${formatGold(player.shippedToday)}</div>
      </div>
      <div class="row">
        <div class="panel" style="flex:1;">Inventory · Seeds: ${
          player.inventory.turnip_seeds ?? 0
        } · Turnips: ${player.inventory.turnips ?? 0} · Fodder: ${player.inventory.fodder ?? 0}</div>
      </div>
    `;

    if (this.menuVisible) {
      const npcStatus = npcSystem.summary();
      const animalStatus = animalSystem.summary();
      const cropStats = farm.summary(cropSystem);
      this.menuContentElement.innerHTML = `
        <li><strong>Season Progress:</strong> Day ${timeManager.day} of 30</li>
        <li><strong>Weather:</strong> ${weather.label}</li>
        <li><strong>NPC Bonds:</strong> ${npcStatus}</li>
        <li><strong>Animals:</strong> ${animalStatus}</li>
        <li><strong>Crop Tiles:</strong> ${cropStats}</li>
        <li><strong>Inventory:</strong> ${player.inventory.turnip_seeds ?? 0} seeds · ${
          player.inventory.turnips ?? 0
        } turnips · ${player.inventory.fodder ?? 0} fodder</li>
      `;
    }
  }

  toggleMenu() {
    this.menuVisible = !this.menuVisible;
    if (this.menuVisible) {
      this.menuElement.classList.add("active");
    } else {
      this.menuElement.classList.remove("active");
    }
  }

  showMessage(text, duration = 2.5) {
    this.message = text;
    this.messageTimer = duration;
  }

  tick(delta) {
    if (this.messageTimer > 0) {
      this.messageTimer -= delta;
      if (this.messageTimer <= 0) {
        this.message = null;
      }
    }
  }
}
