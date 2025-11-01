/**
 * Obstacle types (rocks, spikes, pits)
 */

import { Position } from './common';

export type ObstacleType =
  | 'rock'          // Blocks movement, can be destroyed with bomb
  | 'spike'         // Damages player on contact
  | 'pit'           // Blocks movement
  | 'fire'          // Damages player on contact
  | 'poop';         // Blocks movement, can be destroyed

export interface Obstacle {
  readonly id: string;
  readonly type: ObstacleType;
  readonly position: Position;
  readonly destroyed: boolean;
  readonly size: number;  // Collision radius
}

/**
 * Check if obstacle can be destroyed by bombs
 */
export function isDestructible(type: ObstacleType): boolean {
  return type === 'rock' || type === 'poop';
}

/**
 * Check if obstacle damages player
 */
export function isDamaging(type: ObstacleType): boolean {
  return type === 'spike' || type === 'fire';
}

/**
 * Get obstacle damage amount
 */
export function getObstacleDamage(type: ObstacleType): number {
  switch (type) {
    case 'spike':
      return 5;
    case 'fire':
      return 3;
    default:
      return 0;
  }
}

/**
 * Get emoji representation
 */
export function getObstacleEmoji(type: ObstacleType): string {
  switch (type) {
    case 'rock':
      return '🪨';
    case 'spike':
      return '🔺';  // Red triangle for spikes
    case 'pit':
      return '⚫';  // Black circle for pit
    case 'fire':
      return '🔥';
    case 'poop':
      return '💩';
  }
}

export const OBSTACLE_SIZE = 20;
