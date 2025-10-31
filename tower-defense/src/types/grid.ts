import type { Tower } from './tower';

export interface Position {
  readonly x: number;
  readonly y: number;
}

export type CellType = 'placeable' | 'path' | 'spawn' | 'portal';

export interface Cell {
  readonly position: Position;
  readonly type: CellType;
  readonly tower: Tower | null;
}

export interface Grid {
  readonly width: number;
  readonly height: number;
  readonly cells: ReadonlyArray<ReadonlyArray<Cell>>;
  readonly path: ReadonlyArray<Position>;
}

// Type guards
export const isValidPosition = (pos: Position, width: number, height: number): boolean => {
  return pos.x >= 0 && pos.x < width && pos.y >= 0 && pos.y < height;
};

export const isCellType = (value: string): value is CellType => {
  return ['placeable', 'path', 'spawn', 'portal'].includes(value);
};

export const positionsEqual = (a: Position, b: Position): boolean => {
  return a.x === b.x && a.y === b.y;
};

export const manhattanDistance = (a: Position, b: Position): number => {
  return Math.abs(a.x - b.x) + Math.abs(a.y - b.y);
};

export const euclideanDistance = (a: Position, b: Position): number => {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  return Math.sqrt(dx * dx + dy * dy);
};
