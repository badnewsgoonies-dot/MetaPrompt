import { describe, it, expect } from 'vitest';
import { SeededRNG } from '../../src/utils/rng';

describe('SeededRNG', () => {
  describe('Determinism', () => {
    it('should produce same sequence for same seed', () => {
      const rng1 = new SeededRNG(12345);
      const rng2 = new SeededRNG(12345);

      const sequence1 = Array.from({ length: 10 }, () => rng1.next());
      const sequence2 = Array.from({ length: 10 }, () => rng2.next());

      expect(sequence1).toEqual(sequence2);
    });

    it('should produce different sequences for different seeds', () => {
      const rng1 = new SeededRNG(12345);
      const rng2 = new SeededRNG(54321);

      const sequence1 = Array.from({ length: 10 }, () => rng1.next());
      const sequence2 = Array.from({ length: 10 }, () => rng2.next());

      expect(sequence1).not.toEqual(sequence2);
    });

    it('should reset to produce same sequence again', () => {
      const rng = new SeededRNG(12345);

      const sequence1 = Array.from({ length: 10 }, () => rng.next());
      rng.resetToInitial();
      const sequence2 = Array.from({ length: 10 }, () => rng.next());

      expect(sequence1).toEqual(sequence2);
    });
  });

  describe('next()', () => {
    it('should generate numbers between 0 and 1', () => {
      const rng = new SeededRNG(42);
      for (let i = 0; i < 100; i++) {
        const value = rng.next();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });

    it('should generate different values', () => {
      const rng = new SeededRNG(42);
      const values = Array.from({ length: 100 }, () => rng.next());
      const uniqueValues = new Set(values);
      expect(uniqueValues.size).toBeGreaterThan(90); // Most should be unique
    });
  });

  describe('nextInt()', () => {
    it('should generate integers in range', () => {
      const rng = new SeededRNG(42);
      const min = 1;
      const max = 10;

      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(min, max);
        expect(Number.isInteger(value)).toBe(true);
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThan(max);
      }
    });

    it('should generate all values in range', () => {
      const rng = new SeededRNG(42);
      const min = 0;
      const max = 5;
      const values = new Set<number>();

      for (let i = 0; i < 1000; i++) {
        values.add(rng.nextInt(min, max));
      }

      expect(values.size).toBe(5); // 0, 1, 2, 3, 4
    });

    it('should throw on invalid range', () => {
      const rng = new SeededRNG(42);
      expect(() => rng.nextInt(10, 10)).toThrow();
      expect(() => rng.nextInt(10, 5)).toThrow();
    });
  });

  describe('nextFloat()', () => {
    it('should generate floats in range', () => {
      const rng = new SeededRNG(42);
      const min = 1.5;
      const max = 5.5;

      for (let i = 0; i < 100; i++) {
        const value = rng.nextFloat(min, max);
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThan(max);
      }
    });

    it('should throw on invalid range', () => {
      const rng = new SeededRNG(42);
      expect(() => rng.nextFloat(5.0, 5.0)).toThrow();
      expect(() => rng.nextFloat(10.0, 5.0)).toThrow();
    });
  });

  describe('choice()', () => {
    it('should select random element from array', () => {
      const rng = new SeededRNG(42);
      const array = ['a', 'b', 'c', 'd', 'e'];

      for (let i = 0; i < 100; i++) {
        const value = rng.choice(array);
        expect(array).toContain(value);
      }
    });

    it('should select all elements over time', () => {
      const rng = new SeededRNG(42);
      const array = ['a', 'b', 'c'];
      const selected = new Set<string>();

      for (let i = 0; i < 100; i++) {
        const value = rng.choice(array);
        if (value !== undefined) {
          selected.add(value);
        }
      }

      expect(selected.size).toBe(3);
    });

    it('should return undefined for empty array', () => {
      const rng = new SeededRNG(42);
      expect(rng.choice([])).toBeUndefined();
    });
  });

  describe('shuffle()', () => {
    it('should shuffle array deterministically', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);
      const array = [1, 2, 3, 4, 5];

      const shuffled1 = rng1.shuffle(array);
      const shuffled2 = rng2.shuffle(array);

      expect(shuffled1).toEqual(shuffled2);
    });

    it('should contain all original elements', () => {
      const rng = new SeededRNG(42);
      const array = [1, 2, 3, 4, 5];
      const shuffled = rng.shuffle(array);

      expect(shuffled).toHaveLength(array.length);
      expect(shuffled.sort()).toEqual([1, 2, 3, 4, 5]);
    });

    it('should not modify original array', () => {
      const rng = new SeededRNG(42);
      const original = [1, 2, 3, 4, 5];
      const shuffled = rng.shuffle(original);

      expect(original).toEqual([1, 2, 3, 4, 5]);
      expect(shuffled).not.toBe(original);
    });

    it('should produce different order', () => {
      const rng = new SeededRNG(42);
      const array = Array.from({ length: 10 }, (_, i) => i);
      const shuffled = rng.shuffle(array);

      // Very unlikely to be in same order
      expect(shuffled).not.toEqual(array);
    });
  });

  describe('chance()', () => {
    it('should respect probability', () => {
      const rng = new SeededRNG(42);
      const probability = 0.7;
      let trueCount = 0;

      for (let i = 0; i < 1000; i++) {
        if (rng.chance(probability)) {
          trueCount++;
        }
      }

      // Should be roughly 70% (with some variance)
      expect(trueCount).toBeGreaterThan(600);
      expect(trueCount).toBeLessThan(800);
    });

    it('should handle edge cases', () => {
      const rng = new SeededRNG(42);

      // Always true
      expect(rng.chance(1.0)).toBe(true);

      // Always false
      for (let i = 0; i < 10; i++) {
        expect(rng.chance(0.0)).toBe(false);
      }
    });

    it('should throw on invalid probability', () => {
      const rng = new SeededRNG(42);
      expect(() => rng.chance(-0.1)).toThrow();
      expect(() => rng.chance(1.1)).toThrow();
    });
  });

  describe('getSeed() and reset()', () => {
    it('should get current seed state', () => {
      const rng = new SeededRNG(12345);
      const initialSeed = rng.getSeed();
      rng.next();
      const nextSeed = rng.getSeed();

      expect(nextSeed).not.toBe(initialSeed);
    });

    it('should reset to new seed', () => {
      const rng = new SeededRNG(12345);
      rng.next();
      rng.next();

      rng.reset(54321);
      const value = rng.next();

      const rng2 = new SeededRNG(54321);
      const value2 = rng2.next();

      expect(value).toBe(value2);
    });
  });

  describe('clone()', () => {
    it('should clone RNG with same state', () => {
      const rng1 = new SeededRNG(42);
      rng1.next();
      rng1.next();

      const rng2 = rng1.clone();

      const value1 = rng1.next();
      const value2 = rng2.next();

      expect(value1).toBe(value2);
    });

    it('should not share state', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = rng1.clone();

      rng1.next();
      const value1 = rng1.next();
      const value2 = rng2.next(); // Should be first next() from cloned state

      expect(value1).not.toBe(value2);
    });
  });
});
