export class AudioSystem {
  constructor() {
    this.enabled = typeof window !== "undefined" && !!window.AudioContext;
    this.context = null;
  }

  async init() {
    this.enabled = typeof window !== "undefined" && !!window.AudioContext;
  }

  async ensureContext() {
    if (!this.enabled) {
      return null;
    }
    if (!this.context) {
      try {
        this.context = new AudioContext();
      } catch (err) {
        console.warn("Unable to create audio context", err);
        this.enabled = false;
        return null;
      }
    }
    if (this.context.state === "suspended") {
      try {
        await this.context.resume();
      } catch (err) {
        console.warn("Failed to resume audio context", err);
        return null;
      }
    }
    return this.context;
  }

  async play(name) {
    const context = await this.ensureContext();
    if (!context) return;
    const osc = context.createOscillator();
    const gain = context.createGain();
    const now = context.currentTime;
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
        : name === "ship"
        ? 360
        : name === "animal"
        ? 300
        : name === "npc"
        ? 420
        : 320;
    osc.type = "square";
    osc.frequency.setValueAtTime(baseFreq, now);
    gain.gain.setValueAtTime(0.15, now);
    gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
    osc.connect(gain);
    gain.connect(context.destination);
    osc.start(now);
    osc.stop(now + 0.25);
  }
}
