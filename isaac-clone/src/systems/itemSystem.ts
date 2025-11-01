/**
 * Item and power-up system
 */

import { Item, ItemType, ITEM_DEFINITIONS } from '../types/item';
import { Position } from '../types/common';
import { Player } from '../types/player';
import { STANDARD_ROOM_LAYOUT } from '../types/room';
import { SeededRNG } from '../utils/rng';
import { applyStatModification } from './playerSystem';
import { Result } from '../utils/result';

let itemIdCounter = 0;

/**
 * Spawn an item at a position
 */
export function spawnItem(
  type: ItemType,
  position: Position
): Item {
  return {
    id: `item_${itemIdCounter++}`,
    type,
    position,
    collected: false
  };
}

/**
 * Spawn a random item in the center of the room
 */
export function spawnRandomItem(rng: SeededRNG): Item {
  const types: ItemType[] = ['speed_up', 'damage_up', 'fire_rate_up', 'health_up'];
  const type = rng.choice(types) || 'damage_up';

  // Center of room
  const position = {
    x: STANDARD_ROOM_LAYOUT.width / 2,
    y: STANDARD_ROOM_LAYOUT.height / 2
  };

  return spawnItem(type, position);
}

/**
 * Collect an item and apply its effect to the player
 */
export function collectItem(
  player: Player,
  item: Item
): Result<{ player: Player; item: Item }, string> {
  if (item.collected) {
    return {
      ok: false,
      error: 'Item already collected'
    };
  }

  const itemDef = ITEM_DEFINITIONS[item.type];
  const updatedPlayer = applyStatModification(player, itemDef.effect);
  const updatedItem = { ...item, collected: true };

  return {
    ok: true,
    value: {
      player: updatedPlayer,
      item: updatedItem
    }
  };
}

/**
 * Remove collected items from the list
 */
export function removeCollectedItems(
  items: ReadonlyArray<Item>
): Item[] {
  return items.filter(item => !item.collected);
}

/**
 * Get item definition
 */
export function getItemDefinition(type: ItemType) {
  return ITEM_DEFINITIONS[type];
}
