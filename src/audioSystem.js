export class AudioSystem {
  constructor() {
    this.enabled = false;
    this.sounds = new Map();
  }

  async init() {
    if (!window.AudioContext) return;
    this.context = new AudioContext();
    this.enabled = true;
  }

  play(name) {
    if (!this.enabled) return;
    const osc = this.context.createOscillator();
    const gain = this.context.createGain();
    const now = this.context.currentTime;
    const baseFreq =
      name === "hoe"
        ? 220
        : name === "water"
        ? 440
        : name === "harvest"
        ? 660
        : name === "exhausted"
        ? 140
        : name === "plant"
        ? 520
        : 320;
    osc.type = "square";
    osc.frequency.setValueAtTime(baseFreq, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(this.context.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}
