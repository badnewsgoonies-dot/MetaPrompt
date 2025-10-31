/**
 * Seeded Random Number Generator for deterministic gameplay
 * Uses Mulberry32 algorithm - fast and sufficient for games
 */

export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    // Ensure seed is a 32-bit integer
    this.state = seed >>> 0;
  }

  /**
   * Generate next random number [0, 1)
   */
  next(): number {
    let t = (this.state += 0x6d2b79f5);
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  }

  /**
   * Generate random integer in range [min, max)
   */
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Shuffle array deterministically (Fisher-Yates)
   */
  shuffle<T>(array: T[]): T[] {
    const copy = [...array];
    for (let i = copy.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [copy[i], copy[j]] = [copy[j], copy[i]];
    }
    return copy;
  }

  /**
   * Get current state (for debugging/testing)
   */
  getState(): number {
    return this.state;
  }

  /**
   * Clone RNG with same state
   */
  clone(): SeededRNG {
    const rng = new SeededRNG(0);
    rng.state = this.state;
    return rng;
  }
}

/**
 * Create a new seeded RNG
 */
export function createRNG(seed: number): SeededRNG {
  return new SeededRNG(seed);
}
