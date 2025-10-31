import type { Position } from './grid';

export type TowerType = 'fire' | 'frost' | 'stone' | 'wind';
export type Element = 'fire' | 'water' | 'earth' | 'air';

export interface TowerStats {
  readonly damage: number;
  readonly range: number;
  readonly attackSpeed: number; // attacks per second
  readonly cost: number;
}

export interface Tower {
  readonly id: string;
  readonly type: TowerType;
  readonly element: Element;
  readonly position: Position;
  readonly stats: TowerStats;
  readonly level: number;
  readonly lastAttackTime: number;
}

// Type guards
export const isTowerType = (value: string): value is TowerType => {
  return ['fire', 'frost', 'stone', 'wind'].includes(value);
};

export const isElement = (value: string): value is Element => {
  return ['fire', 'water', 'earth', 'air'].includes(value);
};

// Tower type to element mapping
export const getTowerElement = (type: TowerType): Element => {
  const mapping: Record<TowerType, Element> = {
    fire: 'fire',
    frost: 'water',
    stone: 'earth',
    wind: 'air',
  };
  return mapping[type];
};

// Predefined tower stats
export const TOWER_STATS: Record<TowerType, TowerStats> = {
  fire: {
    damage: 50,
    range: 2.5,
    attackSpeed: 1.0, // 1 attack per second
    cost: 100,
  },
  frost: {
    damage: 20,
    range: 2.5,
    attackSpeed: 0.8,
    cost: 120,
  },
  stone: {
    damage: 35,
    range: 1.8,
    attackSpeed: 0.6,
    cost: 150,
  },
  wind: {
    damage: 10,
    range: 3.5,
    attackSpeed: 1.5,
    cost: 90,
  },
};
