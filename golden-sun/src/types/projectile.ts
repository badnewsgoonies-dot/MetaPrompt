/**
 * Projectile (tear) types
 */

import { Position, Vector2D } from './common';

export type ProjectileOwner = 'player' | 'enemy';

export interface Projectile {
  readonly id: string;
  readonly owner: ProjectileOwner;
  readonly position: Position;
  readonly velocity: Vector2D;
  readonly damage: number;
  readonly range: number;  // Max distance to travel
  readonly distanceTraveled: number;
  readonly size: number;  // Collision radius
}

export const PLAYER_TEAR_SIZE = 8;
export const ENEMY_PROJECTILE_SIZE = 10;
export const PROJECTILE_SPEED = 400;  // pixels/sec
