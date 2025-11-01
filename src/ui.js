import { formatGold, clamp } from "./utils.js";
import { PLAYER_STAMINA_MAX, TOOLS } from "./constants.js";

export class UIOverlay {
  constructor(hudElement, menuElement, menuContentElement, menuDetailElement) {
    this.hudElement = hudElement;
    this.menuElement = menuElement;
    this.menuContentElement = menuContentElement;
    this.menuDetailElement = menuDetailElement;
    this.menuVisible = false;
    this.message = null;
    this.messageTimer = 0;
    this.menuItems = [];
    this.menuSelectionIndex = 0;
  }

  update(player, timeManager, stamina, weather, farm, npcSystem, animalSystem, cropSystem) {
    const staminaRatio = clamp(stamina.current / PLAYER_STAMINA_MAX, 0, 1);
    const tool = TOOLS[player.currentToolIndex];
    const toolbelt =
      TOOLS.map((entry, index) => {
        const active = index === player.currentToolIndex ? "active" : "";
        return `<span class="tool ${active}">${index + 1}. ${entry.label}</span>`;
      }).join("") + '<span class="tool hint">Q/R</span>';

    const messageRow = this.message
      ? `<div class="row message"><div class="panel" style="flex:1; text-align:center; background: rgba(255,255,255,0.12);">${
          this.message
        }</div></div>`
      : "";

    const staminaPanelClass = staminaRatio <= 0.2 ? "panel warning" : "panel";
    const staminaWarning =
      staminaRatio <= 0.2
        ? '<span class="warning-text">Exhausted! Eat or sleep soon.</span>'
        : "";

    this.hudElement.innerHTML = `
      ${messageRow}
      <div class="row">
        <div class="panel">${timeManager.formattedTime()} · ${timeManager.dayLabel()} (${timeManager.seasonLabel()})</div>
        <div class="panel">Weather: ${weather.label}</div>
        <div class="panel">Gold: ${formatGold(player.gold)}</div>
      </div>
      <div class="row">
        <div class="${staminaPanelClass}" style="flex:1;">
          Stamina
          <div class="progress"><span style="width:${Math.floor(staminaRatio * 100)}%"></span></div>
          ${staminaWarning}
        </div>
        <div class="panel">Tool: ${tool?.label ?? "None"}</div>
        <div class="panel">Shipped Today: ${formatGold(player.shippedToday)}</div>
      </div>
      <div class="row">
        <div class="panel" style="flex:1;">Inventory · Seeds: ${
          player.inventory.turnip_seeds ?? 0
        } · Turnips: ${player.inventory.turnips ?? 0} · Fodder: ${player.inventory.fodder ?? 0}</div>
        <div class="panel toolbelt">${toolbelt}</div>
      </div>
    `;

    const npcStatus = npcSystem.summary();
    const animalStatus = animalSystem.summary();
    const cropStats = farm.summary(cropSystem);
    this.menuItems = [
      {
        label: `<strong>Season Progress:</strong> Day ${timeManager.day} of 30`,
        detail: `${timeManager.seasonLabel()} · Year ${timeManager.year} · Weather ${weather.label}`,
      },
      {
        label: `<strong>Weather:</strong> ${weather.label}`,
        detail: `Stamina bonus ${Math.round((weather.staminaModifier ?? 1) * 100)}% · Rain bonus ${
          weather.wateringBonus ?? 0
        } tiles`,
      },
      {
        label: `<strong>NPC Bonds:</strong> ${npcStatus}`,
        detail: "Chat daily and gift turnips for faster hearts.",
      },
      {
        label: `<strong>Animals:</strong> ${animalStatus}`,
        detail: "Feed fodder once per day to gain affection.",
      },
      {
        label: `<strong>Crop Tiles:</strong> ${cropStats}`,
        detail: "Water daily; rain handles hydration automatically.",
      },
      {
        label: `<strong>Inventory:</strong> ${player.inventory.turnip_seeds ?? 0} seeds · ${
          player.inventory.turnips ?? 0
        } turnips · ${player.inventory.fodder ?? 0} fodder`,
        detail: `Ship turnips at the bin for ${formatGold(
          (player.inventory.turnips ?? 0) * (cropSystem.sellValue("turnip") ?? 0)
        )}.`,
      },
    ];

    if (this.menuSelectionIndex >= this.menuItems.length) {
      this.menuSelectionIndex = Math.max(0, this.menuItems.length - 1);
    }

    if (this.menuVisible) {
      this.renderMenu();
    }
  }

  toggleMenu(force) {
    if (typeof force === "boolean") {
      this.menuVisible = force;
    } else {
      this.menuVisible = !this.menuVisible;
    }
    if (this.menuVisible) {
      this.menuElement.classList.add("active");
      this.menuSelectionIndex = Math.min(
        this.menuSelectionIndex,
        Math.max(0, this.menuItems.length - 1)
      );
      this.renderMenu();
    } else {
      this.menuElement.classList.remove("active");
    }
  }

  moveMenuSelection(direction) {
    if (!this.menuVisible || this.menuItems.length === 0) {
      return;
    }
    const count = this.menuItems.length;
    this.menuSelectionIndex =
      (this.menuSelectionIndex + direction + count) % count;
    this.renderMenu();
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

  renderMenu() {
    if (!this.menuContentElement) return;
    if (this.menuItems.length === 0) {
      this.menuContentElement.innerHTML = "";
      if (this.menuDetailElement) {
        this.menuDetailElement.textContent = "";
      }
      return;
    }

    const markup = this.menuItems
      .map((item, index) => {
        const selected = index === this.menuSelectionIndex ? "selected" : "";
        return `<li class="${selected}">${item.label}</li>`;
      })
      .join("");
    this.menuContentElement.innerHTML = markup;
    this.renderMenuDetail();
  }

  renderMenuDetail() {
    if (!this.menuDetailElement) return;
    if (!this.menuItems.length) {
      this.menuDetailElement.textContent = "Use ↑/↓ to inspect categories.";
      return;
    }
    const current = this.menuItems[this.menuSelectionIndex];
    this.menuDetailElement.textContent =
      current?.detail ?? "Use ↑/↓ to inspect categories.";
  }
}
