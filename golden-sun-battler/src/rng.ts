import seedrandom, { type PRNG } from 'seedrandom';

export class DeterministicRng {
  private rng: PRNG;

  constructor(public readonly seed: string) {
    this.rng = seedrandom(seed, { state: true });
  }

  next(): number {
    return this.rng();
  }
}
