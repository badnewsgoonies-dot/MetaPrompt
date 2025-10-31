/**
 * Card database for Yu-Gi-Oh simulator
 * Simplified card set with 10 monsters, 5 spells, 5 traps
 */

export type CardType = 'Monster' | 'Spell' | 'Trap';
export type Attribute = 'DARK' | 'LIGHT' | 'EARTH' | 'WATER' | 'FIRE' | 'WIND';
export type Position = 'attack' | 'defense';
export type FaceState = 'up' | 'down';

export interface MonsterCard {
  id: string;
  name: string;
  type: 'Monster';
  level: number;
  attack: number;
  defense: number;
  attribute: Attribute;
}

export interface SpellCard {
  id: string;
  name: string;
  type: 'Spell';
  effect: string;
  effectType: 'draw' | 'destroy' | 'revive';
}

export interface TrapCard {
  id: string;
  name: string;
  type: 'Trap';
  trigger: 'on_attack' | 'on_summon';
  effect: string;
  effectType: 'destroy' | 'negate' | 'damage';
}

export type Card = MonsterCard | SpellCard | TrapCard;

/**
 * Monster card database
 */
export const MONSTERS: MonsterCard[] = [
  {
    id: 'm1',
    name: 'Dark Magician',
    type: 'Monster',
    level: 7,
    attack: 2500,
    defense: 2100,
    attribute: 'DARK',
  },
  {
    id: 'm2',
    name: 'Blue-Eyes White Dragon',
    type: 'Monster',
    level: 8,
    attack: 3000,
    defense: 2500,
    attribute: 'LIGHT',
  },
  {
    id: 'm3',
    name: 'Celtic Guardian',
    type: 'Monster',
    level: 4,
    attack: 1400,
    defense: 1200,
    attribute: 'EARTH',
  },
  {
    id: 'm4',
    name: 'Summoned Skull',
    type: 'Monster',
    level: 6,
    attack: 2500,
    defense: 1200,
    attribute: 'DARK',
  },
  {
    id: 'm5',
    name: 'Gaia the Fierce Knight',
    type: 'Monster',
    level: 7,
    attack: 2300,
    defense: 2100,
    attribute: 'EARTH',
  },
  {
    id: 'm6',
    name: 'Curse of Dragon',
    type: 'Monster',
    level: 5,
    attack: 2000,
    defense: 1500,
    attribute: 'DARK',
  },
  {
    id: 'm7',
    name: 'Mystical Elf',
    type: 'Monster',
    level: 4,
    attack: 800,
    defense: 2000,
    attribute: 'LIGHT',
  },
  {
    id: 'm8',
    name: 'Beaver Warrior',
    type: 'Monster',
    level: 4,
    attack: 1200,
    defense: 1500,
    attribute: 'EARTH',
  },
  {
    id: 'm9',
    name: 'Giant Soldier of Stone',
    type: 'Monster',
    level: 3,
    attack: 1300,
    defense: 2000,
    attribute: 'EARTH',
  },
  {
    id: 'm10',
    name: 'Silver Fang',
    type: 'Monster',
    level: 3,
    attack: 1200,
    defense: 800,
    attribute: 'EARTH',
  },
];

/**
 * Spell card database
 */
export const SPELLS: SpellCard[] = [
  {
    id: 's1',
    name: 'Dark Hole',
    type: 'Spell',
    effect: 'Destroy all monsters on the field',
    effectType: 'destroy',
  },
  {
    id: 's2',
    name: 'Monster Reborn',
    type: 'Spell',
    effect: 'Revive 1 monster from your graveyard',
    effectType: 'revive',
  },
  {
    id: 's3',
    name: 'Pot of Greed',
    type: 'Spell',
    effect: 'Draw 2 cards',
    effectType: 'draw',
  },
  {
    id: 's4',
    name: 'Raigeki',
    type: 'Spell',
    effect: "Destroy all opponent's monsters",
    effectType: 'destroy',
  },
  {
    id: 's5',
    name: 'Graceful Charity',
    type: 'Spell',
    effect: 'Draw 3 cards, then discard 2 cards',
    effectType: 'draw',
  },
];

/**
 * Trap card database
 */
export const TRAPS: TrapCard[] = [
  {
    id: 't1',
    name: 'Mirror Force',
    type: 'Trap',
    trigger: 'on_attack',
    effect: 'Destroy all attacking monsters',
    effectType: 'destroy',
  },
  {
    id: 't2',
    name: 'Trap Hole',
    type: 'Trap',
    trigger: 'on_summon',
    effect: 'Destroy summoned monster if ATK >= 1000',
    effectType: 'destroy',
  },
  {
    id: 't3',
    name: 'Magic Cylinder',
    type: 'Trap',
    trigger: 'on_attack',
    effect: 'Negate attack and inflict damage equal to ATK',
    effectType: 'damage',
  },
  {
    id: 't4',
    name: 'Sakuretsu Armor',
    type: 'Trap',
    trigger: 'on_attack',
    effect: 'Destroy the attacking monster',
    effectType: 'destroy',
  },
  {
    id: 't5',
    name: 'Bottomless Trap Hole',
    type: 'Trap',
    trigger: 'on_summon',
    effect: 'Destroy and banish summoned monster if ATK >= 1500',
    effectType: 'destroy',
  },
];

/**
 * All cards combined
 */
export const ALL_CARDS: Card[] = [...MONSTERS, ...SPELLS, ...TRAPS];

/**
 * Get card by ID
 */
export function getCardById(id: string): Card | undefined {
  return ALL_CARDS.find((card) => card.id === id);
}

/**
 * Check if card is a monster
 */
export function isMonster(card: Card): card is MonsterCard {
  return card.type === 'Monster';
}

/**
 * Check if card is a spell
 */
export function isSpell(card: Card): card is SpellCard {
  return card.type === 'Spell';
}

/**
 * Check if card is a trap
 */
export function isTrap(card: Card): card is TrapCard {
  return card.type === 'Trap';
}

/**
 * Create a standard 20-card deck
 */
export function createStandardDeck(): Card[] {
  return [
    ...MONSTERS.slice(0, 10), // 10 monsters
    ...SPELLS.slice(0, 5), // 5 spells
    ...TRAPS.slice(0, 5), // 5 traps
  ];
}
