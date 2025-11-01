/**
 * Room types and definitions
 */

import { Position } from './common';

export type RoomType = 'start' | 'normal' | 'treasure' | 'boss' | 'shop' | 'secret';

export interface Door {
  readonly direction: 'north' | 'south' | 'east' | 'west';
  readonly locked: boolean;
}

export interface Room {
  readonly id: string;
  readonly type: RoomType;
  readonly gridX: number;  // Position in dungeon grid (0-2)
  readonly gridY: number;  // Position in dungeon grid (0-2)
  readonly doors: ReadonlyArray<Door>;
  readonly cleared: boolean;
  readonly visited: boolean;
}

export interface RoomLayout {
  readonly width: number;   // Room width in pixels
  readonly height: number;  // Room height in pixels
  readonly spawnZones: ReadonlyArray<Rectangle>; // Where enemies can spawn
  readonly doorPositions: Readonly<Record<'north' | 'south' | 'east' | 'west', Position>>;
}

export interface Rectangle {
  readonly x: number;
  readonly y: number;
  readonly width: number;
  readonly height: number;
}

/**
 * Standard room layout (all rooms use same dimensions for simplicity)
 */
export const STANDARD_ROOM_LAYOUT: RoomLayout = {
  width: 800,
  height: 600,
  spawnZones: [
    { x: 100, y: 100, width: 600, height: 400 }
  ],
  doorPositions: {
    north: { x: 400, y: 50 },
    south: { x: 400, y: 550 },
    east: { x: 750, y: 300 },
    west: { x: 50, y: 300 }
  }
};
