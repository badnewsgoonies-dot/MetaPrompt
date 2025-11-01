import { Element } from '../types/enemy';

/**
 * Turn-Based Battle Enemy Database for Golden Sun
 * Note: Separate from action-game enemies in enemy.ts
 */

export interface BattleEnemy {
  id: string;
  name: string;
  type: string;
  level: number;
  hp: number;
  maxHp: number;
  pp: number;
  maxPp: number;
  attack: number;
  defense: number;
  agility: number;
  luck: number;
  element: Element;
  weaknesses: Element[];
  resistances: Element[];
  immunities?: Element[];
  expReward: number;
  coinReward: number;
  itemDrops: Array<{ itemId: string; chance: number }>;
  aiPattern: 'aggressive' | 'defensive' | 'support' | 'random' | 'boss';
  abilities: string[];
  description: string;
  spriteId: string;
  isBoss?: boolean;
}

/**
 * Enemy Database
 */
export const BATTLE_ENEMY_DATABASE: Record<string, BattleEnemy> = {
  slime: {
    id: 'slime',
    name: 'Slime',
    type: 'slime',
    level: 1,
    hp: 20,
    maxHp: 20,
    pp: 0,
    maxPp: 0,
    attack: 8,
    defense: 4,
    agility: 6,
    luck: 5,
    element: 'venus',
    weaknesses: ['mars'],
    resistances: ['venus'],
    expReward: 5,
    coinReward: 8,
    itemDrops: [{ itemId: 'herb', chance: 0.1 }],
    aiPattern: 'aggressive',
    abilities: ['tackle'],
    description: 'A gelatinous creature.',
    spriteId: 'enemy_slime'
  },
  wildWolf: {
    id: 'wildWolf',
    name: 'Wild Wolf',
    type: 'beast',
    level: 3,
    hp: 40,
    maxHp: 40,
    pp: 0,
    maxPp: 0,
    attack: 15,
    defense: 8,
    agility: 18,
    luck: 8,
    element: 'mars',
    weaknesses: ['mercury'],
    resistances: ['mars'],
    expReward: 12,
    coinReward: 15,
    itemDrops: [{ itemId: 'nut', chance: 0.15 }],
    aiPattern: 'aggressive',
    abilities: ['bite', 'howl'],
    description: 'A fierce predator.',
    spriteId: 'enemy_wolf'
  }
};

/**
 * Encounter groups by location
 */
export const ENCOUNTER_GROUPS = {
  vale_grassland: [
    { enemies: ['slime'], weight: 40 },
    { enemies: ['slime', 'slime'], weight: 30 },
    { enemies: ['wildWolf'], weight: 20 }
  ]
};

/**
 * Get random encounter for a location
 */
export function getRandomEncounter(location: keyof typeof ENCOUNTER_GROUPS, rng: () => number): BattleEnemy[] {
  const groups = ENCOUNTER_GROUPS[location];
  if (!groups || groups.length === 0) {
    return [JSON.parse(JSON.stringify(BATTLE_ENEMY_DATABASE.slime))];
  }

  const totalWeight = groups.reduce((sum, group) => sum + group.weight, 0);
  let roll = rng() * totalWeight;

  for (const group of groups) {
    roll -= group.weight;
    if (roll <= 0) {
      return group.enemies.map(enemyId => JSON.parse(JSON.stringify(BATTLE_ENEMY_DATABASE[enemyId])));
    }
  }

  return [JSON.parse(JSON.stringify(BATTLE_ENEMY_DATABASE.slime))];
}
