/**
 * Obstacle system
 */

import { Obstacle, ObstacleType, OBSTACLE_SIZE, isDestructible } from '../types/obstacle';
import { Position } from '../types/common';
import { SeededRNG } from '../utils/rng';

let obstacleIdCounter = 0;

/**
 * Spawn an obstacle
 */
export function spawnObstacle(
  type: ObstacleType,
  position: Position
): Obstacle {
  return {
    id: `obstacle_${obstacleIdCounter++}`,
    type,
    position,
    destroyed: false,
    size: OBSTACLE_SIZE
  };
}

/**
 * Generate obstacles for a room
 */
export function generateRoomObstacles(
  rng: SeededRNG,
  roomType: 'start' | 'normal' | 'treasure' | 'boss' | 'shop' | 'secret'
): Obstacle[] {
  const obstacles: Obstacle[] = [];

  // Start room has no obstacles
  if (roomType === 'start') {
    return obstacles;
  }

  // Treasure and shop rooms have minimal obstacles
  if (roomType === 'treasure' || roomType === 'shop') {
    // Just some decorative rocks in corners
    obstacles.push(spawnObstacle('rock', { x: 150, y: 150 }));
    obstacles.push(spawnObstacle('rock', { x: 650, y: 150 }));
    obstacles.push(spawnObstacle('rock', { x: 150, y: 450 }));
    obstacles.push(spawnObstacle('rock', { x: 650, y: 450 }));
    return obstacles;
  }

  // Normal rooms have various obstacles
  const obstacleCount = rng.nextInt(3, 8);
  for (let i = 0; i < obstacleCount; i++) {
    const type = rng.choice<ObstacleType>(['rock', 'rock', 'rock', 'spike', 'poop']) || 'rock';
    const x = rng.nextInt(150, 650);
    const y = rng.nextInt(150, 450);

    // Don't place obstacles too close to center
    if (Math.abs(x - 400) < 100 && Math.abs(y - 300) < 100) {
      continue;
    }

    obstacles.push(spawnObstacle(type, { x, y }));
  }

  return obstacles;
}

/**
 * Destroy an obstacle
 */
export function destroyObstacle(obstacle: Obstacle): Obstacle {
  return { ...obstacle, destroyed: true };
}

/**
 * Check if obstacle can be destroyed
 */
export function canDestroyObstacle(obstacle: Obstacle): boolean {
  return isDestructible(obstacle.type) && !obstacle.destroyed;
}

/**
 * Remove destroyed obstacles
 */
export function removeDestroyedObstacles(
  obstacles: ReadonlyArray<Obstacle>
): Obstacle[] {
  return obstacles.filter(o => !o.destroyed);
}
