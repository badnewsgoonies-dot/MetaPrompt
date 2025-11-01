/**
 * Enemy types and AI definitions
 */

import { Position, Vector2D } from './common';

// Element types for turn-based battle system
export type Element = 'venus' | 'mars' | 'jupiter' | 'mercury';

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
 * BALANCE: Player has 6 health (3 hearts), damage 3.5
 * - Enemy projectiles: 2 damage (1 heart per hit)
 * - Enemy health: 7-14 (dies in 2-4 player hits)
 * - Contact damage: reduced to 0.1x per frame in combat system
 */
export const ENEMY_STATS: Record<EnemyType, EnemyStats> = {
  fly: {
    type: 'fly',
    maxHealth: 7,      // Dies in 2 hits (3.5 * 2 = 7)
    speed: 80,
    damage: 1,         // Contact damage (reduced to 0.1/frame)
    behavior: 'erratic',
    size: 12
  },
  spider: {
    type: 'spider',
    maxHealth: 10,     // Dies in 3 hits (3.5 * 3 = 10.5)
    speed: 100,
    damage: 1,         // Contact damage (reduced to 0.1/frame)
    behavior: 'chase',
    size: 14
  },
  maw: {
    type: 'maw',
    maxHealth: 14,     // Dies in 4 hits (3.5 * 4 = 14)
    speed: 40,
    damage: 2,         // Projectile damage = 1 heart
    behavior: 'shoot',
    shootInterval: 2000,  // Shoot every 2 seconds
    size: 16
  }
};
