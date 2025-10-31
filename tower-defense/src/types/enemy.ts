import type { Position } from './grid';
import type { Element } from './tower';

export type EnemyTier = 'lesser' | 'greater' | 'ancient';

export interface EnemyStats {
  readonly maxHp: number;
  readonly speed: number; // cells per second
  readonly goldReward: number;
  readonly element: Element;
}

export interface StatusEffect {
  readonly type: 'burn' | 'slow' | 'stun';
  readonly duration: number; // milliseconds
  readonly value: number;
}

export interface Enemy {
  readonly id: string;
  readonly type: string; // e.g., 'fire_imp', 'flame_demon'
  readonly tier: EnemyTier;
  readonly stats: EnemyStats;
  readonly currentHp: number;
  readonly position: Position;
  readonly pathIndex: number;
  readonly statusEffects: ReadonlyArray<StatusEffect>;
}

// Type guards
export const isEnemyTier = (value: string): value is EnemyTier => {
  return ['lesser', 'greater', 'ancient'].includes(value);
};

export const hasStatusEffect = (enemy: Enemy, effectType: StatusEffect['type']): boolean => {
  return enemy.statusEffects.some((effect) => effect.type === effectType);
};

// Predefined enemy stats
export const ENEMY_STATS: Record<string, EnemyStats> = {
  // Lesser enemies
  fire_imp: {
    maxHp: 50,
    speed: 1.0,
    goldReward: 10,
    element: 'fire',
  },
  water_wisp: {
    maxHp: 50,
    speed: 1.0,
    goldReward: 10,
    element: 'water',
  },
  stone_golem: {
    maxHp: 80,
    speed: 0.7,
    goldReward: 12,
    element: 'earth',
  },
  air_sprite: {
    maxHp: 40,
    speed: 1.3,
    goldReward: 10,
    element: 'air',
  },

  // Greater enemies
  flame_demon: {
    maxHp: 150,
    speed: 1.1,
    goldReward: 25,
    element: 'fire',
  },
  tidal_beast: {
    maxHp: 150,
    speed: 0.9,
    goldReward: 25,
    element: 'water',
  },
  earth_elemental: {
    maxHp: 200,
    speed: 0.8,
    goldReward: 30,
    element: 'earth',
  },
  storm_wraith: {
    maxHp: 120,
    speed: 1.4,
    goldReward: 25,
    element: 'air',
  },

  // Ancient enemies
  inferno_titan: {
    maxHp: 500,
    speed: 0.5,
    goldReward: 100,
    element: 'fire',
  },
  leviathan: {
    maxHp: 600,
    speed: 0.4,
    goldReward: 120,
    element: 'water',
  },
  mountain_colossus: {
    maxHp: 800,
    speed: 0.3,
    goldReward: 150,
    element: 'earth',
  },
  hurricane_lord: {
    maxHp: 400,
    speed: 0.7,
    goldReward: 100,
    element: 'air',
  },
};

// Get enemy tier from type
export const getEnemyTier = (enemyType: string): EnemyTier => {
  const lesser = ['fire_imp', 'water_wisp', 'stone_golem', 'air_sprite'];
  const greater = ['flame_demon', 'tidal_beast', 'earth_elemental', 'storm_wraith'];
  const ancient = ['inferno_titan', 'leviathan', 'mountain_colossus', 'hurricane_lord'];

  if (lesser.includes(enemyType)) return 'lesser';
  if (greater.includes(enemyType)) return 'greater';
  if (ancient.includes(enemyType)) return 'ancient';

  return 'lesser'; // default
};
