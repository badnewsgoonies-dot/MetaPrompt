# Task: T-UTIL-001 - Implement Result Type and RNG Utilities

## Owner
Coder

## Objective
Create Result type for error handling and seeded RNG for determinism.

## Files to Create/Modify
- `src/utils/result.ts` - Result type implementation
- `src/utils/rng.ts` - Seeded random number generator
- `tests/utils/result.test.ts` - Result type tests
- `tests/utils/rng.test.ts` - RNG determinism tests

## Signatures

### Result Type
```typescript
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export const Ok = <T>(value: T): Result<T, never> => ({
  ok: true,
  value,
});

export const Err = <E>(error: E): Result<never, E> => ({
  ok: false,
  error,
});

export const isOk = <T, E>(result: Result<T, E>): result is { ok: true; value: T } =>
  result.ok;

export const isErr = <T, E>(result: Result<T, E>): result is { ok: false; error: E } =>
  !result.ok;

export const unwrap = <T, E>(result: Result<T, E>): T => {
  if (isOk(result)) return result.value;
  throw new Error('Called unwrap on Err result');
};

export const unwrapOr = <T, E>(result: Result<T, E>, defaultValue: T): T =>
  isOk(result) ? result.value : defaultValue;
```

### RNG
```typescript
export class SeededRNG {
  private seed: number;

  constructor(seed: number) {
    this.seed = seed;
  }

  // Linear Congruential Generator
  next(): number {
    this.seed = (this.seed * 1664525 + 1013904223) % 2**32;
    return this.seed / 2**32;
  }

  // Random integer between min (inclusive) and max (exclusive)
  nextInt(min: number, max: number): number {
    return Math.floor(this.next() * (max - min)) + min;
  }

  // Random float between min and max
  nextFloat(min: number, max: number): number {
    return this.next() * (max - min) + min;
  }

  // Random element from array
  choice<T>(array: T[]): T {
    return array[this.nextInt(0, array.length)];
  }

  // Shuffle array (Fisher-Yates)
  shuffle<T>(array: T[]): T[] {
    const result = [...array];
    for (let i = result.length - 1; i > 0; i--) {
      const j = this.nextInt(0, i + 1);
      [result[i], result[j]] = [result[j], result[i]];
    }
    return result;
  }

  // Get current seed (for replay)
  getSeed(): number {
    return this.seed;
  }

  // Reset to initial seed
  reset(seed: number): void {
    this.seed = seed;
  }
}
```

## Acceptance Criteria
- [ ] Result type compiles with no errors
- [ ] Result helpers (Ok, Err, isOk, isErr, unwrap, unwrapOr) work correctly
- [ ] RNG produces deterministic output for same seed
- [ ] RNG methods (next, nextInt, nextFloat, choice, shuffle) all tested
- [ ] Same seed produces same sequence across runs

## Tests Required
```typescript
// tests/utils/result.test.ts
describe('Result Type', () => {
  it('should create Ok result');
  it('should create Err result');
  it('should identify Ok with isOk');
  it('should identify Err with isErr');
  it('should unwrap Ok value');
  it('should throw on unwrap Err');
  it('should return default on unwrapOr for Err');
});

// tests/utils/rng.test.ts
describe('SeededRNG', () => {
  it('should produce deterministic sequence');
  it('should produce same values for same seed');
  it('should produce different values for different seeds');
  it('should generate integers in range');
  it('should generate floats in range');
  it('should select random element from array');
  it('should shuffle array deterministically');
  it('should reset seed correctly');
});
```

## Definition of Done
- Result type and helpers implemented
- RNG class with all methods implemented
- All tests passing
- Determinism verified (same seed → same output)
- No TypeScript errors
- Code follows pure function principles

## Estimated Time
45 minutes

## Dependencies
- T-TYPE-001 (types may use Result)

## Notes
- Result type pattern is from Rust
- RNG uses Linear Congruential Generator (simple, fast, deterministic)
- All game randomness MUST use SeededRNG, not Math.random()
- Keep RNG instance in GameState for reproducibility
