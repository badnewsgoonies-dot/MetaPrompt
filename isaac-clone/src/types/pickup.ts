/**
 * Pickup types (consumables and resources)
 */

import { Position } from './common';

export type PickupType =
  | 'heart'        // Restores 2 health
  | 'half_heart'   // Restores 1 health
  | 'key'          // Opens locked doors
  | 'bomb'         // Destroys rocks
  | 'coin'         // Currency for shops
  | 'golden_key'   // Opens any door
  | 'golden_bomb'; // Special bomb

export interface Pickup {
  readonly id: string;
  readonly type: PickupType;
  readonly position: Position;
  readonly collected: boolean;
}

/**
 * Get the value/effect of a pickup
 */
export function getPickupValue(type: PickupType): {
  hearts?: number;
  keys?: number;
  bombs?: number;
  coins?: number;
  goldenKey?: boolean;
} {
  switch (type) {
    case 'heart':
      return { hearts: 2 };
    case 'half_heart':
      return { hearts: 1 };
    case 'key':
      return { keys: 1 };
    case 'bomb':
      return { bombs: 1 };
    case 'coin':
      return { coins: 1 };
    case 'golden_key':
      return { goldenKey: true };
    case 'golden_bomb':
      return { bombs: 99 };
  }
}

/**
 * Get emoji representation
 */
export function getPickupEmoji(type: PickupType): string {
  switch (type) {
    case 'heart':
      return '❤️';
    case 'half_heart':
      return '💔';
    case 'key':
      return '🔑';
    case 'bomb':
      return '💣';
    case 'coin':
      return '🪙';
    case 'golden_key':
      return '🗝️';
    case 'golden_bomb':
      return '💥';
  }
}
