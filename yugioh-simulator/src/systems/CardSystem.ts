/**
 * Card System - Manages card states and operations
 * All functions are pure and use Result<T, E> for error handling
 */

import { Result, Ok, Err } from '../utils/result-type';
import {
  Card,
  Position,
  FaceState,
  isMonster,
  isSpell,
  isTrap,
} from '../utils/card-data';

/**
 * Card instance on the field
 */
export interface FieldCard {
  card: Card;
  position: Position; // Only for monsters
  faceState: FaceState;
  canAttack: boolean; // Summoning sickness
  hasAttacked: boolean; // This turn
}

/**
 * Player's card zones
 */
export interface CardZones {
  hand: Card[];
  deck: Card[];
  monsterZone: (FieldCard | null)[]; // Max 3 monsters
  spellTrapZone: (FieldCard | null)[]; // Max 3 spell/traps
  graveyard: Card[];
  banished: Card[];
}

/**
 * Initialize empty card zones
 */
export function createCardZones(): CardZones {
  return {
    hand: [],
    deck: [],
    monsterZone: [null, null, null],
    spellTrapZone: [null, null, null],
    graveyard: [],
    banished: [],
  };
}

/**
 * Draw a card from deck to hand
 */
export function drawCard(zones: CardZones): Result<CardZones, string> {
  if (zones.deck.length === 0) {
    return Err('Cannot draw: deck is empty');
  }

  const [card, ...remainingDeck] = zones.deck;

  return Ok({
    ...zones,
    hand: [...zones.hand, card],
    deck: remainingDeck,
  });
}

/**
 * Find first empty monster zone slot
 */
function findEmptyMonsterSlot(zones: CardZones): number {
  return zones.monsterZone.findIndex((slot) => slot === null);
}

/**
 * Find first empty spell/trap zone slot
 */
function findEmptySpellTrapSlot(zones: CardZones): number {
  return zones.spellTrapZone.findIndex((slot) => slot === null);
}

/**
 * Normal summon a monster from hand
 */
export function summonMonster(
  zones: CardZones,
  cardId: string,
  position: Position,
  tributes: number[]
): Result<CardZones, string> {
  // Find card in hand
  const cardIndex = zones.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return Err('Card not found in hand');
  }

  const card = zones.hand[cardIndex];
  if (!isMonster(card)) {
    return Err('Card is not a monster');
  }

  // Check tribute requirements
  const requiredTributes = getRequiredTributes(card.level);
  if (tributes.length < requiredTributes) {
    return Err(
      `Insufficient tributes: need ${requiredTributes}, got ${tributes.length}`
    );
  }

  // Validate tribute slots
  for (const slotIndex of tributes) {
    if (
      slotIndex < 0 ||
      slotIndex >= 3 ||
      zones.monsterZone[slotIndex] === null
    ) {
      return Err(`Invalid tribute slot: ${slotIndex}`);
    }
  }

  // Find empty slot
  const slotIndex = findEmptyMonsterSlot(zones);
  if (slotIndex === -1) {
    return Err('No empty monster zone slots');
  }

  // Remove card from hand
  const newHand = zones.hand.filter((_, i) => i !== cardIndex);

  // Tribute monsters (send to graveyard)
  let newMonsterZone = [...zones.monsterZone];
  const tributedCards: Card[] = [];
  for (const tIndex of tributes) {
    const tributed = newMonsterZone[tIndex];
    if (tributed) {
      tributedCards.push(tributed.card);
      newMonsterZone[tIndex] = null;
    }
  }

  // Place monster on field
  newMonsterZone[slotIndex] = {
    card,
    position,
    faceState: 'up',
    canAttack: false, // Summoning sickness
    hasAttacked: false,
  };

  return Ok({
    ...zones,
    hand: newHand,
    monsterZone: newMonsterZone,
    graveyard: [...zones.graveyard, ...tributedCards],
  });
}

/**
 * Get required tributes for monster level
 */
export function getRequiredTributes(level: number): number {
  if (level <= 4) return 0;
  if (level <= 6) return 1;
  return 2; // Level 7+
}

/**
 * Set a monster in face-down defense position
 */
export function setMonster(
  zones: CardZones,
  cardId: string,
  tributes: number[]
): Result<CardZones, string> {
  const cardIndex = zones.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return Err('Card not found in hand');
  }

  const card = zones.hand[cardIndex];
  if (!isMonster(card)) {
    return Err('Card is not a monster');
  }

  const requiredTributes = getRequiredTributes(card.level);
  if (tributes.length < requiredTributes) {
    return Err(
      `Insufficient tributes: need ${requiredTributes}, got ${tributes.length}`
    );
  }

  const slotIndex = findEmptyMonsterSlot(zones);
  if (slotIndex === -1) {
    return Err('No empty monster zone slots');
  }

  const newHand = zones.hand.filter((_, i) => i !== cardIndex);

  let newMonsterZone = [...zones.monsterZone];
  const tributedCards: Card[] = [];
  for (const tIndex of tributes) {
    const tributed = newMonsterZone[tIndex];
    if (tributed) {
      tributedCards.push(tributed.card);
      newMonsterZone[tIndex] = null;
    }
  }

  newMonsterZone[slotIndex] = {
    card,
    position: 'defense',
    faceState: 'down',
    canAttack: false,
    hasAttacked: false,
  };

  return Ok({
    ...zones,
    hand: newHand,
    monsterZone: newMonsterZone,
    graveyard: [...zones.graveyard, ...tributedCards],
  });
}

/**
 * Activate a spell card from hand
 */
export function activateSpell(
  zones: CardZones,
  cardId: string
): Result<CardZones, string> {
  const cardIndex = zones.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return Err('Card not found in hand');
  }

  const card = zones.hand[cardIndex];
  if (!isSpell(card)) {
    return Err('Card is not a spell');
  }

  const newHand = zones.hand.filter((_, i) => i !== cardIndex);

  return Ok({
    ...zones,
    hand: newHand,
    graveyard: [...zones.graveyard, card],
  });
}

/**
 * Set a trap card face-down
 */
export function setTrap(
  zones: CardZones,
  cardId: string
): Result<CardZones, string> {
  const cardIndex = zones.hand.findIndex((c) => c.id === cardId);
  if (cardIndex === -1) {
    return Err('Card not found in hand');
  }

  const card = zones.hand[cardIndex];
  if (!isTrap(card)) {
    return Err('Card is not a trap');
  }

  const slotIndex = findEmptySpellTrapSlot(zones);
  if (slotIndex === -1) {
    return Err('No empty spell/trap zone slots');
  }

  const newHand = zones.hand.filter((_, i) => i !== cardIndex);

  const newSpellTrapZone = [...zones.spellTrapZone];
  newSpellTrapZone[slotIndex] = {
    card,
    position: 'defense', // Not used for traps
    faceState: 'down',
    canAttack: false,
    hasAttacked: false,
  };

  return Ok({
    ...zones,
    hand: newHand,
    spellTrapZone: newSpellTrapZone,
  });
}

/**
 * Activate a set trap card
 */
export function activateTrap(
  zones: CardZones,
  slotIndex: number
): Result<CardZones, string> {
  if (slotIndex < 0 || slotIndex >= 3) {
    return Err('Invalid trap slot index');
  }

  const trap = zones.spellTrapZone[slotIndex];
  if (!trap) {
    return Err('No trap in slot');
  }

  if (!isTrap(trap.card)) {
    return Err('Card in slot is not a trap');
  }

  const newSpellTrapZone = [...zones.spellTrapZone];
  newSpellTrapZone[slotIndex] = null;

  return Ok({
    ...zones,
    spellTrapZone: newSpellTrapZone,
    graveyard: [...zones.graveyard, trap.card],
  });
}

/**
 * Destroy a monster and send to graveyard
 */
export function destroyMonster(
  zones: CardZones,
  slotIndex: number
): Result<CardZones, string> {
  if (slotIndex < 0 || slotIndex >= 3) {
    return Err('Invalid monster slot index');
  }

  const monster = zones.monsterZone[slotIndex];
  if (!monster) {
    return Err('No monster in slot');
  }

  const newMonsterZone = [...zones.monsterZone];
  newMonsterZone[slotIndex] = null;

  return Ok({
    ...zones,
    monsterZone: newMonsterZone,
    graveyard: [...zones.graveyard, monster.card],
  });
}

/**
 * Change monster battle position
 */
export function changePosition(
  zones: CardZones,
  slotIndex: number,
  newPosition: Position
): Result<CardZones, string> {
  if (slotIndex < 0 || slotIndex >= 3) {
    return Err('Invalid monster slot index');
  }

  const monster = zones.monsterZone[slotIndex];
  if (!monster) {
    return Err('No monster in slot');
  }

  const newMonsterZone = [...zones.monsterZone];
  newMonsterZone[slotIndex] = {
    ...monster,
    position: newPosition,
    faceState: 'up', // Flip face-up when changing position
  };

  return Ok({
    ...zones,
    monsterZone: newMonsterZone,
  });
}

/**
 * Remove summoning sickness from all monsters
 */
export function removeSummoningSickness(zones: CardZones): CardZones {
  const newMonsterZone = zones.monsterZone.map((monster) => {
    if (monster) {
      return { ...monster, canAttack: true, hasAttacked: false };
    }
    return null;
  });

  return {
    ...zones,
    monsterZone: newMonsterZone,
  };
}

/**
 * Mark monster as having attacked
 */
export function markAttacked(
  zones: CardZones,
  slotIndex: number
): Result<CardZones, string> {
  if (slotIndex < 0 || slotIndex >= 3) {
    return Err('Invalid monster slot index');
  }

  const monster = zones.monsterZone[slotIndex];
  if (!monster) {
    return Err('No monster in slot');
  }

  const newMonsterZone = [...zones.monsterZone];
  newMonsterZone[slotIndex] = {
    ...monster,
    hasAttacked: true,
  };

  return Ok({
    ...zones,
    monsterZone: newMonsterZone,
  });
}

/**
 * Count monsters on field
 */
export function countMonsters(zones: CardZones): number {
  return zones.monsterZone.filter((m) => m !== null).length;
}
