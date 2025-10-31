import { SeededRNG } from './seeded-rng';

describe('SeededRNG', () => {
  describe('Determinism', () => {
    it('should produce the same sequence with the same seed', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(42);

      const sequence1 = [rng1.nextFloat(), rng1.nextFloat(), rng1.nextFloat()];
      const sequence2 = [rng2.nextFloat(), rng2.nextFloat(), rng2.nextFloat()];

      expect(sequence1).toEqual(sequence2);
    });

    it('should produce different sequences with different seeds', () => {
      const rng1 = new SeededRNG(42);
      const rng2 = new SeededRNG(123);

      const value1 = rng1.nextFloat();
      const value2 = rng2.nextFloat();

      expect(value1).not.toEqual(value2);
    });
  });

  describe('nextFloat', () => {
    it('should return values between 0 and 1', () => {
      const rng = new SeededRNG(12345);

      for (let i = 0; i < 100; i++) {
        const value = rng.nextFloat();
        expect(value).toBeGreaterThanOrEqual(0);
        expect(value).toBeLessThan(1);
      }
    });
  });

  describe('nextInt', () => {
    it('should return values in specified range [min, max)', () => {
      const rng = new SeededRNG(54321);
      const min = 10;
      const max = 20;

      for (let i = 0; i < 100; i++) {
        const value = rng.nextInt(min, max);
        expect(value).toBeGreaterThanOrEqual(min);
        expect(value).toBeLessThan(max);
      }
    });

    it('should throw error if min >= max', () => {
      const rng = new SeededRNG(1);
      expect(() => rng.nextInt(10, 10)).toThrow();
      expect(() => rng.nextInt(20, 10)).toThrow();
    });
  });

  describe('clone', () => {
    it('should create independent RNG with same state', () => {
      const original = new SeededRNG(999);
      original.nextFloat(); // Advance state

      const cloned = original.clone();

      // Should produce same next values
      expect(cloned.nextFloat()).toEqual(original.nextFloat());

      // But are independent objects
      expect(cloned).not.toBe(original);
    });
  });

  describe('getState', () => {
    it('should return internal state', () => {
      const rng = new SeededRNG(42);
      const initialState = rng.getState();

      rng.nextFloat();
      const newState = rng.getState();

      expect(newState).not.toEqual(initialState);
      expect(typeof newState).toBe('number');
    });
  });
});
