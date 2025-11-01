export class AnimationSystem {
  constructor() {
    this.timer = 0;
    this.active = null;
  }

  playToolSwing(toolId) {
    this.active = { toolId, timer: 0.2 };
  }

  update(delta) {
    if (!this.active) return;
    this.active.timer -= delta;
    if (this.active.timer <= 0) {
      this.active = null;
    }
  }
}
