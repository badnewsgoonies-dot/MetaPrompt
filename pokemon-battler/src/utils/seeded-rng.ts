/**
 * Seeded Random Number Generator
 *
 * Provides deterministic random number generation using a simple LCG (Linear Congruential Generator).
 * Same seed always produces the same sequence of random numbers.
 */

export class SeededRNG {
  private state: number;

  constructor(seed: number) {
    // Ensure seed is a positive integer
    this.state = Math.abs(Math.floor(seed)) || 1;
  }

  /**
   * Generate next random integer in range [min, max)
   * @param min Minimum value (inclusive)
   * @param max Maximum value (exclusive)
   */
  nextInt(min: number, max: number): number {
    if (min >= max) {
      throw new Error('min must be less than max');
    }
    const range = max - min;
    return min + Math.floor(this.nextFloat() * range);
  }

  /**
   * Generate next random float in range [0, 1)
   */
  nextFloat(): number {
    // LCG parameters (same as java.util.Random)
    const a = 1103515245;
    const c = 12345;
    const m = 2 ** 31;

    this.state = (a * this.state + c) % m;
    return this.state / m;
  }

  /**
   * Create a clone of this RNG with the same state
   * Useful for branching RNG without affecting original
   */
  clone(): SeededRNG {
    const cloned = new SeededRNG(this.state);
    return cloned;
  }

  /**
   * Get current internal state (for debugging/testing)
   */
  getState(): number {
    return this.state;
  }
}
