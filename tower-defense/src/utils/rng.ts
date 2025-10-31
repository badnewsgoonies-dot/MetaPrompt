/**
 * Seeded Random Number Generator
 * Uses Linear Congruential Generator for deterministic randomness
 * Same seed always produces same sequence
 */
export class SeededRNG {
  private state: number;
  private readonly initialSeed: number;

  constructor(seed: number) {
    this.state = seed >>> 0; // Ensure unsigned 32-bit integer
    this.initialSeed = this.state;
  }

  /**
   * Generate next random float between 0 (inclusive) and 1 (exclusive)
   */
  next(): number {
    // Linear Congruential Generator
    // Using parameters from Numerical Recipes
    this.state = ((this.state * 1664525 + 1013904223) >>> 0) % Math.pow(2, 32);
    return this.state / Math.pow(2, 32);
  }

  /**
   * Random integer between min (inclusive) and max (exclusive)
   */
  nextInt(min: number, max: number): number {
    if (min >= max) {
      throw new Error(`Invalid range: min (${min}) must be less than max (${max})`);
    }
    return Math.floor(this.next() * (max - min)) + min;
  }

  /**
   * Random float between min and max
   */
  nextFloat(min: number, max: number): number {
    if (min >= max) {
      throw new Error(`Invalid range: min (${min}) must be less than max (${max})`);
    }
    return this.next() * (max - min) + min;
  }

  /**
   * Random element from array
   */
  choice<T>(array: readonly T[]): T | undefined {
    if (array.length === 0) return undefined;
    return array[this.nextInt(0, array.length)];
  }

  /**
   * Shuffle array using Fisher-Yates algorithm
   */
  shuffle<T>(array: readonly T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j]!, result[i]!];
    }
    return result;
  }

  /**
   * Random boolean with given probability
   */
  chance(probability: number): boolean {
    if (probability < 0 || probability > 1) {
      throw new Error(`Invalid probability: ${probability} (must be between 0 and 1)`);
    }
    return this.next() < probability;
  }

  /**
   * Get current seed state
   */
  getSeed(): number {
    return this.state;
  }

  /**
   * Reset to a new seed
   */
  reset(seed: number): void {
    this.state = seed >>> 0;
  }

  /**
   * Reset to initial seed
   */
  resetToInitial(): void {
    this.state = this.initialSeed;
  }

  /**
   * Clone RNG with same state
   */
  clone(): SeededRNG {
    const cloned = new SeededRNG(this.initialSeed);
    cloned.state = this.state;
    return cloned;
  }
}
