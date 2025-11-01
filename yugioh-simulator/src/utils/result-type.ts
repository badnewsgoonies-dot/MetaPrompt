/**
 * Result<T, E> type for type-safe error handling
 * Replaces throwing exceptions with explicit error values
 */

export type Result<T, E> = Ok<T> | Err<E>;

export interface Ok<T> {
  readonly kind: 'ok';
  readonly value: T;
}

export interface Err<E> {
  readonly kind: 'err';
  readonly error: E;
}

/**
 * Create a successful Result
 */
export function Ok<T>(value: T): Ok<T> {
  return { kind: 'ok', value };
}

/**
 * Create a failed Result
 */
export function Err<E>(error: E): Err<E> {
  return { kind: 'err', error };
}

/**
 * Check if Result is Ok
 */
export function isOk<T, E>(result: Result<T, E>): result is Ok<T> {
  return result.kind === 'ok';
}

/**
 * Check if Result is Err
 */
export function isErr<T, E>(result: Result<T, E>): result is Err<E> {
  return result.kind === 'err';
}

/**
 * Unwrap Ok value or throw if Err
 * Use only in tests or after isOk check
 */
export function unwrap<T, E>(result: Result<T, E>): T {
  if (isOk(result)) {
    return result.value;
  }
  throw new Error(`Unwrap failed: ${result.error}`);
}

/**
 * Map Ok value to new value
 */
export function map<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => U
): Result<U, E> {
  if (isOk(result)) {
    return Ok(fn(result.value));
  }
  return result;
}

/**
 * Chain multiple Result-returning operations
 */
export function andThen<T, U, E>(
  result: Result<T, E>,
  fn: (value: T) => Result<U, E>
): Result<U, E> {
  if (isOk(result)) {
    return fn(result.value);
  }
  return result;
}

/**
 * Get Ok value or default
 */
export function unwrapOr<T, E>(result: Result<T, E>, defaultValue: T): T {
  if (isOk(result)) {
    return result.value;
  }
  return defaultValue;
}
