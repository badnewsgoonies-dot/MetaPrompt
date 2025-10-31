import { describe, it, expect } from 'vitest';
import {
  Ok,
  Err,
  isOk,
  isErr,
  unwrap,
  unwrapOr,
  map,
  flatMap,
  mapErr,
  unwrapOrElse,
} from '../../src/utils/result';

describe('Result Type', () => {
  describe('Ok', () => {
    it('should create Ok result', () => {
      const result = Ok(42);
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value).toBe(42);
      }
    });

    it('should work with different types', () => {
      const strResult = Ok('hello');
      const objResult = Ok({ key: 'value' });
      const arrResult = Ok([1, 2, 3]);

      expect(isOk(strResult)).toBe(true);
      expect(isOk(objResult)).toBe(true);
      expect(isOk(arrResult)).toBe(true);
    });
  });

  describe('Err', () => {
    it('should create Err result', () => {
      const result = Err('error message');
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBe('error message');
      }
    });

    it('should work with Error objects', () => {
      const error = new Error('Something went wrong');
      const result = Err(error);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe(error);
      }
    });
  });

  describe('isOk', () => {
    it('should identify Ok result', () => {
      const result = Ok(100);
      expect(isOk(result)).toBe(true);
      expect(isErr(result)).toBe(false);
    });

    it('should identify Err result', () => {
      const result = Err('error');
      expect(isOk(result)).toBe(false);
      expect(isErr(result)).toBe(true);
    });
  });

  describe('unwrap', () => {
    it('should unwrap Ok value', () => {
      const result = Ok(42);
      expect(unwrap(result)).toBe(42);
    });

    it('should throw on Err', () => {
      const result = Err('error');
      expect(() => unwrap(result)).toThrow();
    });
  });

  describe('unwrapOr', () => {
    it('should return value for Ok', () => {
      const result = Ok(42);
      expect(unwrapOr(result, 0)).toBe(42);
    });

    it('should return default for Err', () => {
      const result = Err('error');
      expect(unwrapOr(result, 0)).toBe(0);
    });
  });

  describe('map', () => {
    it('should transform Ok value', () => {
      const result = Ok(10);
      const mapped = map(result, (x) => x * 2);
      expect(unwrap(mapped)).toBe(20);
    });

    it('should pass through Err', () => {
      const result = Err<number, string>('error');
      const mapped = map(result, (x) => x * 2);
      expect(isErr(mapped)).toBe(true);
      if (isErr(mapped)) {
        expect(mapped.error).toBe('error');
      }
    });
  });

  describe('flatMap', () => {
    it('should chain Ok results', () => {
      const result = Ok(10);
      const chained = flatMap(result, (x) => Ok(x * 2));
      expect(unwrap(chained)).toBe(20);
    });

    it('should propagate Err from first result', () => {
      const result = Err<number, string>('first error');
      const chained = flatMap(result, (x) => Ok(x * 2));
      expect(isErr(chained)).toBe(true);
      if (isErr(chained)) {
        expect(chained.error).toBe('first error');
      }
    });

    it('should propagate Err from flatMap function', () => {
      const result = Ok(10);
      const chained = flatMap(result, () => Err('second error'));
      expect(isErr(chained)).toBe(true);
      if (isErr(chained)) {
        expect(chained.error).toBe('second error');
      }
    });
  });

  describe('mapErr', () => {
    it('should transform Err value', () => {
      const result = Err('error');
      const mapped = mapErr(result, (e) => `Wrapped: ${e}`);
      expect(isErr(mapped)).toBe(true);
      if (isErr(mapped)) {
        expect(mapped.error).toBe('Wrapped: error');
      }
    });

    it('should pass through Ok', () => {
      const result = Ok(42);
      const mapped = mapErr(result, (e) => `Wrapped: ${e}`);
      expect(isOk(mapped)).toBe(true);
      expect(unwrap(mapped)).toBe(42);
    });
  });

  describe('unwrapOrElse', () => {
    it('should return value for Ok', () => {
      const result = Ok(42);
      const value = unwrapOrElse(result, () => 0);
      expect(value).toBe(42);
    });

    it('should call function for Err', () => {
      const result = Err('error');
      const value = unwrapOrElse(result, (e) => e.length);
      expect(value).toBe(5);
    });
  });
});
