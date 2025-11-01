/**
 * Bomb mechanics
 */

import { Position } from './common';

export interface Bomb {
  readonly id: string;
  readonly position: Position;
  readonly placedTime: number;
  readonly fuseTime: number;  // ms until explosion
  readonly exploded: boolean;
  readonly blastRadius: number;  // pixels
}

export const BOMB_FUSE_TIME = 3000;  // 3 seconds
export const BOMB_BLAST_RADIUS = 80;  // pixels
export const BOMB_DAMAGE = 50;
export const BOMB_COOLDOWN = 500;  // ms between placing bombs
