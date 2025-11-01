import { PLAYER_STAMINA_MAX } from "./constants.js";

export class StaminaSystem {
  constructor(state = {}) {
    this.max = PLAYER_STAMINA_MAX;
    this.current = state.current ?? this.max;
    this.infinite = state.infinite ?? false;
  }

  hasStamina(cost) {
    if (this.infinite) return true;
    return this.current >= cost;
  }

  consume(cost) {
    if (this.infinite) return;
    this.current = Math.max(0, this.current - cost);
  }

  restore(amount) {
    this.current = Math.min(this.max, this.current + amount);
  }

  resetForNewDay(weather) {
    const modifier = weather.staminaModifier ?? 1;
    this.current = Math.min(this.max, Math.floor(this.max * modifier));
    if (this.infinite) {
      this.current = this.max;
    }
  }

  setInfinite(flag) {
    this.infinite = flag;
    if (this.infinite) {
      this.current = this.max;
    }
  }

  serialize() {
    return { current: this.current, infinite: this.infinite };
  }
}
