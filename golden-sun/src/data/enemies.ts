import { Enemy, EnemyType, Element } from '../types/enemy';

/**
 * Enemy Database for Golden Sun
 * Chapter 1: Vale Region enemies
 */

export const ENEMY_DATABASE: Record<string, Enemy> = {
  // === GRASSLAND ENEMIES ===
  slime: {
    id: 'slime',
    name: 'Slime',
    type: 'slime' as EnemyType,
    level: 1,
    hp: 20,
    maxHp: 20,
    pp: 0,
    maxPp: 0,
    attack: 8,
    defense: 4,
    agility: 6,
    luck: 5,
    element: 'venus' as Element,
    weaknesses: ['mars'],
    resistances: ['venus'],
    expReward: 5,
    coinReward: 8,
    itemDrops: [
      { itemId: 'herb', chance: 0.1 }
    ],
    aiPattern: 'aggressive',
    abilities: ['tackle'],
    description: 'A gelatinous creature that absorbs nutrients from the earth.',
    spriteId: 'enemy_slime'
  },

  wildWolf: {
    id: 'wildWolf',
    name: 'Wild Wolf',
    type: 'beast' as EnemyType,
    level: 3,
    hp: 40,
    maxHp: 40,
    pp: 0,
    maxPp: 0,
    attack: 15,
    defense: 8,
    agility: 18,
    luck: 8,
    element: 'mars' as Element,
    weaknesses: ['mercury'],
    resistances: ['mars'],
    expReward: 12,
    coinReward: 15,
    itemDrops: [
      { itemId: 'nut', chance: 0.15 }
    ],
    aiPattern: 'aggressive',
    abilities: ['bite', 'howl'],
    description: 'A fierce predator that hunts in packs across the wilderness.',
    spriteId: 'enemy_wolf'
  },

  // === FOREST ENEMIES ===
  spider: {
    id: 'spider',
    name: 'Spider',
    type: 'insect' as EnemyType,
    level: 2,
    hp: 30,
    maxHp: 30,
    pp: 5,
    maxPp: 5,
    attack: 10,
    defense: 6,
    agility: 14,
    luck: 7,
    element: 'jupiter' as Element,
    weaknesses: ['mars'],
    resistances: ['jupiter'],
    expReward: 8,
    coinReward: 12,
    itemDrops: [
      { itemId: 'antidote', chance: 0.2 }
    ],
    aiPattern: 'defensive',
    abilities: ['poisonSting', 'webShot'],
    description: 'A venomous arachnid that lurks in dark forests.',
    spriteId: 'enemy_spider'
  },

  ant: {
    id: 'ant',
    name: 'Ant',
    type: 'insect' as EnemyType,
    level: 2,
    hp: 25,
    maxHp: 25,
    pp: 0,
    maxPp: 0,
    attack: 12,
    defense: 10,
    agility: 8,
    luck: 6,
    element: 'venus' as Element,
    weaknesses: ['jupiter'],
    resistances: ['venus'],
    expReward: 7,
    coinReward: 10,
    itemDrops: [
      { itemId: 'herb', chance: 0.12 }
    ],
    aiPattern: 'support',
    abilities: ['tackle', 'guardUp'],
    description: 'A hardy insect with strong defensive capabilities.',
    spriteId: 'enemy_ant'
  },

  // === MOUNTAIN/CAVE ENEMIES ===
  goblin: {
    id: 'goblin',
    name: 'Goblin',
    type: 'humanoid' as EnemyType,
    level: 3,
    hp: 35,
    maxHp: 35,
    pp: 0,
    maxPp: 0,
    attack: 16,
    defense: 7,
    agility: 10,
    luck: 7,
    element: 'mars' as Element,
    weaknesses: ['mercury'],
    resistances: ['mars'],
    expReward: 10,
    coinReward: 18,
    itemDrops: [
      { itemId: 'coins', chance: 0.3 },
      { itemId: 'bronzeSword', chance: 0.05 }
    ],
    aiPattern: 'aggressive',
    abilities: ['slash', 'rockThrow'],
    description: 'A small but vicious creature that attacks travelers.',
    spriteId: 'enemy_goblin'
  },

  mole: {
    id: 'mole',
    name: 'Mole',
    type: 'beast' as EnemyType,
    level: 4,
    hp: 50,
    maxHp: 50,
    pp: 8,
    maxPp: 8,
    attack: 18,
    defense: 12,
    agility: 7,
    luck: 9,
    element: 'venus' as Element,
    weaknesses: ['jupiter'],
    resistances: ['venus'],
    expReward: 15,
    coinReward: 20,
    itemDrops: [
      { itemId: 'psyCrystal', chance: 0.15 }
    ],
    aiPattern: 'random',
    abilities: ['dig', 'mudslide'],
    description: 'A burrowing creature that emerges to attack unexpectedly.',
    spriteId: 'enemy_mole'
  },

  // === WATER/COAST ENEMIES ===
  lizardMan: {
    id: 'lizardMan',
    name: 'Lizard Man',
    type: 'humanoid' as EnemyType,
    level: 4,
    hp: 45,
    maxHp: 45,
    pp: 10,
    maxPp: 10,
    attack: 17,
    defense: 9,
    agility: 12,
    luck: 8,
    element: 'mercury' as Element,
    weaknesses: ['jupiter'],
    resistances: ['mercury'],
    expReward: 13,
    coinReward: 22,
    itemDrops: [
      { itemId: 'nut', chance: 0.1 },
      { itemId: 'leatherArmor', chance: 0.08 }
    ],
    aiPattern: 'aggressive',
    abilities: ['spearThrust', 'waterBlast'],
    description: 'A reptilian warrior that guards coastal territories.',
    spriteId: 'enemy_lizardman'
  },

  bat: {
    id: 'bat',
    name: 'Bat',
    type: 'flying' as EnemyType,
    level: 2,
    hp: 28,
    maxHp: 28,
    pp: 0,
    maxPp: 0,
    attack: 11,
    defense: 5,
    agility: 20,
    luck: 10,
    element: 'jupiter' as Element,
    weaknesses: ['venus'],
    resistances: ['jupiter'],
    expReward: 9,
    coinReward: 14,
    itemDrops: [
      { itemId: 'herb', chance: 0.08 }
    ],
    aiPattern: 'aggressive',
    abilities: ['diveBomb', 'screech'],
    description: 'A swift flying creature that attacks from above.',
    spriteId: 'enemy_bat'
  },

  // === SOL SANCTUM ENEMIES ===
  livingStatue: {
    id: 'livingStatue',
    name: 'Living Statue',
    type: 'construct' as EnemyType,
    level: 6,
    hp: 200,
    maxHp: 200,
    pp: 20,
    maxPp: 20,
    attack: 25,
    defense: 20,
    agility: 5,
    luck: 10,
    element: 'venus' as Element,
    weaknesses: ['jupiter'],
    resistances: ['venus', 'mars'],
    expReward: 100,
    coinReward: 150,
    itemDrops: [
      { itemId: 'psyCrystal', chance: 0.5 },
      { itemId: 'guardRing', chance: 0.3 }
    ],
    aiPattern: 'boss',
    abilities: ['heavySmash', 'stoneGaze', 'rockfall'],
    description: 'An ancient guardian brought to life by Alchemy.',
    spriteId: 'boss_living_statue',
    isBoss: true
  },

  fireElemental: {
    id: 'fireElemental',
    name: 'Fire Elemental',
    type: 'elemental' as EnemyType,
    level: 5,
    hp: 55,
    maxHp: 55,
    pp: 15,
    maxPp: 15,
    attack: 20,
    defense: 8,
    agility: 15,
    luck: 12,
    element: 'mars' as Element,
    weaknesses: ['mercury'],
    resistances: ['mars'],
    immunities: ['mars'],
    expReward: 18,
    coinReward: 25,
    itemDrops: [
      { itemId: 'psyCrystal', chance: 0.2 },
      { itemId: 'ember', chance: 0.15 }
    ],
    aiPattern: 'aggressive',
    abilities: ['fireball', 'flameWall', 'scorch'],
    description: 'A manifestation of pure fire Psynergy.',
    spriteId: 'enemy_fire_elemental'
  }
};

/**
 * Enemy encounter groups by location
 */
export const ENCOUNTER_GROUPS = {
  // World map encounters
  vale_grassland: [
    { enemies: ['slime'], weight: 40 },
    { enemies: ['slime', 'slime'], weight: 30 },
    { enemies: ['wildWolf'], weight: 20 },
    { enemies: ['ant'], weight: 10 }
  ],

  vale_forest: [
    { enemies: ['spider'], weight: 35 },
    { enemies: ['ant', 'ant'], weight: 30 },
    { enemies: ['bat'], weight: 25 },
    { enemies: ['spider', 'ant'], weight: 10 }
  ],

  goma_range: [
    { enemies: ['goblin'], weight: 40 },
    { enemies: ['mole'], weight: 30 },
    { enemies: ['goblin', 'goblin'], weight: 20 },
    { enemies: ['wildWolf', 'goblin'], weight: 10 }
  ],

  kolima_forest: [
    { enemies: ['spider', 'spider'], weight: 35 },
    { enemies: ['bat', 'spider'], weight: 30 },
    { enemies: ['mole'], weight: 20 },
    { enemies: ['ant', 'ant', 'spider'], weight: 15 }
  ],

  // Dungeon encounters
  sol_sanctum: [
    { enemies: ['goblin', 'goblin'], weight: 40 },
    { enemies: ['fireElemental'], weight: 25 },
    { enemies: ['mole', 'goblin'], weight: 20 },
    { enemies: ['fireElemental', 'goblin'], weight: 15 }
  ]
};

/**
 * Get random enemy encounter for a location
 */
export function getRandomEncounter(location: keyof typeof ENCOUNTER_GROUPS, rng: () => number): Enemy[] {
  const groups = ENCOUNTER_GROUPS[location];
  if (!groups || groups.length === 0) {
    return [{ ...ENEMY_DATABASE.slime }]; // Fallback
  }

  const totalWeight = groups.reduce((sum, group) => sum + group.weight, 0);
  let roll = rng() * totalWeight;

  for (const group of groups) {
    roll -= group.weight;
    if (roll <= 0) {
      return group.enemies.map(enemyId => ({ ...ENEMY_DATABASE[enemyId] }));
    }
  }

  return [{ ...ENEMY_DATABASE.slime }]; // Fallback
}
