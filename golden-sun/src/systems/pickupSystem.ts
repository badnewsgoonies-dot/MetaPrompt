/**
 * Pickup collection system
 */

import { Pickup, getPickupValue } from '../types/pickup';
import { Player } from '../types/player';
import { Position } from '../types/common';
import { SeededRNG } from '../utils/rng';
import { Result } from '../utils/result';
import { healPlayer } from './playerSystem';

let pickupIdCounter = 0;

/**
 * Spawn a pickup at a position
 */
export function spawnPickup(
  type: Pickup['type'],
  position: Position
): Pickup {
  return {
    id: `pickup_${pickupIdCounter++}`,
    type,
    position,
    collected: false
  };
}

/**
 * Spawn random pickups after clearing a room
 */
export function spawnRoomClearPickups(
  rng: SeededRNG,
  roomCenter: Position
): Pickup[] {
  const pickups: Pickup[] = [];

  // 50% chance for heart
  if (rng.chance(0.5)) {
    pickups.push(spawnPickup(
      rng.chance(0.7) ? 'half_heart' : 'heart',
      { x: roomCenter.x - 30, y: roomCenter.y }
    ));
  }

  // 30% chance for key
  if (rng.chance(0.3)) {
    pickups.push(spawnPickup(
      'key',
      { x: roomCenter.x + 30, y: roomCenter.y }
    ));
  }

  // 25% chance for bomb
  if (rng.chance(0.25)) {
    pickups.push(spawnPickup(
      'bomb',
      { x: roomCenter.x, y: roomCenter.y - 30 }
    ));
  }

  // 40% chance for coin
  if (rng.chance(0.4)) {
    pickups.push(spawnPickup(
      'coin',
      { x: roomCenter.x, y: roomCenter.y + 30 }
    ));
  }

  return pickups;
}

/**
 * Collect a pickup
 */
export function collectPickup(
  player: Player,
  pickup: Pickup
): Result<{ player: Player; pickup: Pickup }, string> {
  if (pickup.collected) {
    return {
      ok: false,
      error: 'Pickup already collected'
    };
  }

  const value = getPickupValue(pickup.type);
  let updatedPlayer = player;

  // Apply effects
  if (value.hearts) {
    updatedPlayer = healPlayer(updatedPlayer, value.hearts);
  }

  if (value.keys || value.bombs || value.coins || value.goldenKey !== undefined) {
    updatedPlayer = {
      ...updatedPlayer,
      resources: {
        keys: updatedPlayer.resources.keys + (value.keys || 0),
        bombs: updatedPlayer.resources.bombs + (value.bombs || 0),
        coins: updatedPlayer.resources.coins + (value.coins || 0),
        hasGoldenKey: updatedPlayer.resources.hasGoldenKey || (value.goldenKey || false)
      }
    };
  }

  return {
    ok: true,
    value: {
      player: updatedPlayer,
      pickup: { ...pickup, collected: true }
    }
  };
}

/**
 * Remove collected pickups
 */
export function removeCollectedPickups(
  pickups: ReadonlyArray<Pickup>
): Pickup[] {
  return pickups.filter(p => !p.collected);
}
