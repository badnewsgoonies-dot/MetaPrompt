/**
 * Enemy types and AI definitions
 */

import { Position, Vector2D } from './common';

export type EnemyType = 'fly' | 'spider' | 'maw';

export type AIBehavior = 'erratic' | 'chase' | 'shoot';

export interface EnemyStats {
  readonly type: EnemyType;
  readonly maxHealth: number;
  readonly speed: number;
  readonly damage: number;
  readonly behavior: AIBehavior;
  readonly shootInterval?: number;  // For shooting enemies (ms)
  readonly size: number;  // Collision radius
}

export interface Enemy {
  readonly id: string;
  readonly type: EnemyType;
  readonly position: Position;
  readonly velocity: Vector2D;
  readonly currentHealth: number;
  readonly stats: EnemyStats;
  readonly lastActionTime: number;  // For AI timing
}

/**
 * Enemy stat definitions
 */
export const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
  fly: {
    type: 'fly',
    maxHealth: 20,
    speed: 80,
    damage: 5,
    behavior: 'erratic',
    size: 12
  },
  spider: {
    type: 'spider',
    maxHealth: 40,
    speed: 100,
    damage: 10,
    behavior: 'chase',
    size: 14
  },
  maw: {
    type: 'maw',
    maxHealth: 80,
    speed: 40,
    damage: 15,
    behavior: 'shoot',
    shootInterval: 2000,  // Shoot every 2 seconds
    size: 16
  }
};
