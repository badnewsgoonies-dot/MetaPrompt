export class DebugOverlay {
  constructor(element) {
    this.element = element;
    this.visible = false;
    this.showTileIds = false;
    this.infiniteStamina = false;
    this.lastState = null;
    if (this.element) {
      this.element.innerHTML = "";
    }
  }

  toggleVisibility() {
    this.visible = !this.visible;
    this.render();
    return this.visible;
  }

  toggleTileIds() {
    this.showTileIds = !this.showTileIds;
    this.render();
    return this.showTileIds;
  }

  toggleInfiniteStamina() {
    this.infiniteStamina = !this.infiniteStamina;
    this.render();
    return this.infiniteStamina;
  }

  update(state) {
    this.lastState = state;
    if (state?.stamina) {
      this.infiniteStamina = Boolean(state.stamina.infinite);
    }
    if (this.visible) {
      this.render();
    }
  }

  render() {
    if (!this.element) return;
    if (!this.visible) {
      this.element.classList.remove("active");
      this.element.innerHTML = "";
      return;
    }

    this.element.classList.add("active");
    const state = this.lastState ?? {};
    const timeLabel = state.time?.label ?? "--:--";
    const dayLabel = state.time?.day ?? "Day ?";
    const seasonLabel = state.time?.season ?? "Season ?";
    const weatherLabel = state.weather?.label ?? "Unknown";
    const stamina = state.stamina ?? {};
    const staminaLine = `${stamina.current ?? "?"}/${stamina.max ?? "?"}${
      this.infiniteStamina ? " (∞)" : ""
    }`;
    const tool = state.player?.tool ?? "None";
    const gold = state.player?.gold ?? 0;
    const shipped = state.player?.shippedToday ?? 0;
    const coords = state.player?.tile;
    const onField = state.player?.tileState;
    const coordLabel = coords
      ? `${coords.x},${coords.y}${onField ? "" : " (off-field)"}`
      : "Off-plot";
    const targetCoords = state.target?.coords;
    const targetTile = state.target?.tile;
    const targetLabel = targetCoords
      ? `${targetCoords.x},${targetCoords.y}${
          targetTile ? ` · ${targetTile.type}${targetTile.crop ? ` · Crop S${targetTile.crop.stage}` : ""}` : " (off-field)"
        }`
      : "None";

    const tileOverlayState = this.showTileIds ? "ON" : "OFF";
    const pausedLabel = state.flags?.paused ? "Paused" : "Running";

    this.element.innerHTML = `
      <strong>Debug Tools</strong>
      <div style="display:flex; flex-direction:column; gap:0.15rem; font-size:0.8rem;">
        <span>Game: ${pausedLabel}</span>
        <span><code>F1</code> Toggle overlay visibility</span>
        <span><code>F2</code> Infinite stamina: ${this.infiniteStamina ? "ON" : "OFF"}</span>
        <span><code>F3</code> Tile overlay: ${tileOverlayState}</span>
        <span><code>F4</code> +1 hour · <code>F5</code> Next dawn</span>
      </div>
      <ul>
        <li>Time: ${timeLabel} (${dayLabel}, ${seasonLabel})</li>
        <li>Weather: ${weatherLabel}</li>
        <li>Stamina: ${staminaLine}</li>
        <li>Tool: ${tool}</li>
        <li>Gold: ${gold} · Shipped: ${shipped}</li>
        <li>Player tile: ${coordLabel}</li>
        <li>Target tile: ${targetLabel}</li>
      </ul>
      <p style="margin-top:0.4rem; font-size:0.75rem; color:rgba(255,255,255,0.6);">
        ↑/↓ navigate menu summaries when paused.
      </p>
    `;
  }
}
