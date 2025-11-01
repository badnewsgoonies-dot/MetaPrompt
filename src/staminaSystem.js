import { PLAYER_STAMINA_MAX } from "./constants.js";

export class StaminaSystem {
  constructor(state = {}) {
    this.max = PLAYER_STAMINA_MAX;
    this.current = state.current ?? this.max;
  }

  hasStamina(cost) {
    return this.current >= cost;
  }

  consume(cost) {
    this.current = Math.max(0, this.current - cost);
  }

  restore(amount) {
    this.current = Math.min(this.max, this.current + amount);
  }

  resetForNewDay(weather) {
    const modifier = weather.staminaModifier ?? 1;
    this.current = Math.min(this.max, Math.floor(this.max * modifier));
  }

  serialize() {
    return { current: this.current };
  }
}
