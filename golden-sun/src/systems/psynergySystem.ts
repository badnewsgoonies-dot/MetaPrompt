import { Result, ok, err } from '../utils/result';
import { Position } from '../types/common';

/**
 * Psynergy Field Ability System for Golden Sun
 * Handles Move, Catch, Lift and other field abilities
 */

export type PsynergyAbility = 'move' | 'catch' | 'lift' | 'frost' | 'whirlwind' | 'growth' | 'reveal';

export interface PsynergyableObject {
  id: string;
  type: 'rock' | 'statue' | 'pillar' | 'item' | 'switch';
  position: Position;
  canMove: boolean;
  canLift: boolean;
  canCatch: boolean;
  weight: 'light' | 'medium' | 'heavy';
  state: 'idle' | 'moved' | 'lifted' | 'removed';
}

export interface PsynergyAction {
  ability: PsynergyAbility;
  targetId: string;
  direction?: 'up' | 'down' | 'left' | 'right';
  result: 'success' | 'blocked' | 'failed';
}

/**
 * Use Move Psynergy on an object
 */
export function useMovePsynergy(
  object: PsynergyableObject,
  direction: 'up' | 'down' | 'left' | 'right',
  checkCollision: (pos: Position) => boolean
): Result<PsynergyableObject, string> {
  if (!object.canMove) {
    return err('This object cannot be moved');
  }

  if (object.weight === 'heavy') {
    return err('This object is too heavy to move');
  }

  // Calculate new position
  const newPosition = { ...object.position };
  switch (direction) {
    case 'up':
      newPosition.y--;
      break;
    case 'down':
      newPosition.y++;
      break;
    case 'left':
      newPosition.x--;
      break;
    case 'right':
      newPosition.x++;
      break;
  }

  // Check if new position is blocked
  if (checkCollision(newPosition)) {
    return err('Path is blocked');
  }

  // Move object
  object.position = newPosition;
  object.state = 'moved';

  return ok(object);
}

/**
 * Use Catch Psynergy on a distant object
 */
export function useCatchPsynergy(
  object: PsynergyableObject,
  playerPosition: Position,
  maxDistance: number = 5
): Result<PsynergyableObject, string> {
  if (!object.canCatch) {
    return err('This object cannot be caught');
  }

  // Calculate distance
  const dx = object.position.x - playerPosition.x;
  const dy = object.position.y - playerPosition.y;
  const distance = Math.abs(dx) + Math.abs(dy);

  if (distance > maxDistance) {
    return err('Object is too far away');
  }

  // "Catch" the object (pull it toward player or trigger it)
  object.state = 'removed';

  return ok(object);
}

/**
 * Use Lift Psynergy on a heavy object
 */
export function useLiftPsynergy(
  object: PsynergyableObject,
  playerPosition: Position
): Result<PsynergyableObject, string> {
  if (!object.canLift) {
    return err('This object cannot be lifted');
  }

  // Check if player is adjacent
  const dx = Math.abs(object.position.x - playerPosition.x);
  const dy = Math.abs(object.position.y - playerPosition.y);
  
  if (dx + dy > 1) {
    return err('Must be next to the object to lift it');
  }

  // Lift object (removes it from play)
  object.state = 'lifted';

  return ok(object);
}

/**
 * Check if player has learned a Psynergy ability
 */
export function hasPsynergyAbility(
  learnedAbilities: Set<PsynergyAbility>,
  ability: PsynergyAbility
): boolean {
  return learnedAbilities.has(ability);
}

/**
 * Learn a new Psynergy ability
 */
export function learnPsynergy(
  learnedAbilities: Set<PsynergyAbility>,
  ability: PsynergyAbility
): Set<PsynergyAbility> {
  learnedAbilities.add(ability);
  return learnedAbilities;
}

/**
 * Get Psynergy ability info
 */
export function getPsynergyInfo(ability: PsynergyAbility): {
  name: string;
  description: string;
  ppCost: number;
  element: string;
} {
  const info = {
    move: {
      name: 'Move',
      description: 'Push objects and statues',
      ppCost: 0,
      element: 'venus'
    },
    catch: {
      name: 'Catch',
      description: 'Grab distant items with wind',
      ppCost: 2,
      element: 'jupiter'
    },
    lift: {
      name: 'Lift',
      description: 'Raise heavy rocks',
      ppCost: 3,
      element: 'venus'
    },
    frost: {
      name: 'Frost',
      description: 'Freeze puddles into ice pillars',
      ppCost: 4,
      element: 'mercury'
    },
    whirlwind: {
      name: 'Whirlwind',
      description: 'Clear obstacles with wind',
      ppCost: 3,
      element: 'jupiter'
    },
    growth: {
      name: 'Growth',
      description: 'Make plants grow',
      ppCost: 4,
      element: 'venus'
    },
    reveal: {
      name: 'Reveal',
      description: 'Show hidden paths',
      ppCost: 2,
      element: 'jupiter'
    }
  };

  return info[ability];
}
