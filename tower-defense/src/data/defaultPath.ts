import type { Position } from '../types/grid';

/**
 * Default path for 12x6 grid
 * Path goes: Right edge → across middle → left edge
 */
export const DEFAULT_PATH: readonly Position[] = [
  // Spawn at top right
  { x: 11, y: 0 },

  // Down right side
  { x: 11, y: 1 },
  { x: 11, y: 2 },

  // Across top portion
  { x: 10, y: 2 },
  { x: 9, y: 2 },
  { x: 8, y: 2 },
  { x: 7, y: 2 },
  { x: 6, y: 2 },
  { x: 5, y: 2 },
  { x: 4, y: 2 },
  { x: 3, y: 2 },
  { x: 2, y: 2 },
  { x: 1, y: 2 },
  { x: 0, y: 2 },

  // Down left side
  { x: 0, y: 3 },

  // Across bottom
  { x: 1, y: 3 },
  { x: 2, y: 3 },
  { x: 3, y: 3 },
  { x: 4, y: 3 },
  { x: 5, y: 3 },
  { x: 6, y: 3 },
  { x: 7, y: 3 },
  { x: 8, y: 3 },
  { x: 9, y: 3 },
  { x: 10, y: 3 },

  // Down to portal
  { x: 10, y: 4 },
  { x: 10, y: 5 },

  // Portal at bottom
  { x: 0, y: 5 }, // Portal
] as const;

/**
 * Calculate path length in cells
 */
export const getPathLength = (): number => DEFAULT_PATH.length;

/**
 * Get spawn position (first position)
 */
export const getSpawnPosition = (): Position => DEFAULT_PATH[0]!;

/**
 * Get portal position (last position)
 */
export const getPortalPosition = (): Position => DEFAULT_PATH[DEFAULT_PATH.length - 1]!;
