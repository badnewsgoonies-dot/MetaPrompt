/**
 * Common types used across the game
 */

export interface Position {
  readonly x: number;
  readonly y: number;
}

export interface Vector2D {
  readonly dx: number;
  readonly dy: number;
}

export interface Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

export type Direction = 'north' | 'south' | 'east' | 'west';

/**
 * Check if two positions are equal
 */
export function positionsEqual(a: Position, b: Position): boolean {
  return a.x === b.x && a.y === b.y;
}

/**
 * Calculate distance between two positions
 */
export function distance(a: Position, b: Position): number {
  const dx = b.x - a.x;
  const dy = b.y - a.y;
  return Math.sqrt(dx * dx + dy * dy);
}

/**
 * Normalize a vector to unit length
 */
export function normalize(v: Vector2D): Vector2D {
  const length = Math.sqrt(v.dx * v.dx + v.dy * v.dy);
  if (length === 0) return { dx: 0, dy: 0 };
  return { dx: v.dx / length, dy: v.dy / length };
}
