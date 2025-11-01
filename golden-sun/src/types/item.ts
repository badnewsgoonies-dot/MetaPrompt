/**
 * Item and power-up types
 */

import { Position } from './common';
import { PlayerStats } from './player';

export type ItemType = 'speed_up' | 'damage_up' | 'fire_rate_up' | 'health_up';

export interface ItemDefinition {
  readonly type: ItemType;
  readonly name: string;
  readonly description: string;
  readonly effect: (stats: PlayerStats) => PlayerStats;
}

export interface Item {
  readonly id: string;
  readonly type: ItemType;
  readonly position: Position;
  readonly collected: boolean;
}

/**
 * Item definitions with stat modification effects
 */
export const ITEM_DEFINITIONS: Record<ItemType, ItemDefinition> = {
  speed_up: {
    type: 'speed_up',
    name: 'Speed Up',
    description: '+0.5 speed',
    effect: (stats) => ({ ...stats, speed: stats.speed + 50 })
  },
  damage_up: {
    type: 'damage_up',
    name: 'Damage Up',
    description: '+1 damage',
    effect: (stats) => ({ ...stats, damage: stats.damage + 1 })
  },
  fire_rate_up: {
    type: 'fire_rate_up',
    name: 'Fire Rate Up',
    description: '+0.2 tears/sec',
    effect: (stats) => ({ ...stats, tearRate: stats.tearRate + 0.2 })
  },
  health_up: {
    type: 'health_up',
    name: 'Health Up',
    description: '+2 max health (1 heart)',
    effect: (stats) => ({
      ...stats,
      maxHealth: stats.maxHealth + 2,
      currentHealth: stats.currentHealth + 2
    })
  }
};
