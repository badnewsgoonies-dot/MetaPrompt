/**
 * Player types and stats
 */

import { Position, Vector2D } from './common';

export interface PlayerStats {
  readonly maxHealth: number;
  readonly currentHealth: number;
  readonly damage: number;
  readonly tearRate: number;  // Tears per second
  readonly speed: number;     // Pixels per second
  readonly range: number;     // Tear travel distance in pixels
}

export interface PlayerResources {
  readonly keys: number;
  readonly bombs: number;
  readonly coins: number;
  readonly hasGoldenKey: boolean;
}

export interface Player {
  readonly position: Position;
  readonly velocity: Vector2D;
  readonly stats: PlayerStats;
  readonly resources: PlayerResources;
  readonly size: number;  // Collision radius
  readonly lastTearTime: number;  // Timestamp of last tear fired
  readonly lastBombTime: number;  // Timestamp of last bomb placed
  readonly facing: Vector2D;  // Direction player is facing
}

/**
 * Default starting stats for the player
 */
export const DEFAULT_PLAYER_STATS: PlayerStats = {
  maxHealth: 6,  // 3 hearts (2 health per heart)
  currentHealth: 6,
  damage: 3.5,
  tearRate: 2.0,  // 2 tears per second
  speed: 200,     // 200 pixels/sec
  range: 400      // 400 pixels
};

export const PLAYER_SIZE = 16;  // Collision radius in pixels

export const DEFAULT_PLAYER_RESOURCES: PlayerResources = {
  keys: 0,
  bombs: 0,
  coins: 0,
  hasGoldenKey: false
};
