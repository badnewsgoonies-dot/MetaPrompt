/**
 * Projectile (tears) system
 */

import { Projectile, PLAYER_TEAR_SIZE, ENEMY_PROJECTILE_SIZE, PROJECTILE_SPEED } from '../types/projectile';
import { Vector2D, normalize } from '../types/common';
import { Player } from '../types/player';
import { Enemy } from '../types/enemy';
import { STANDARD_ROOM_LAYOUT } from '../types/room';

let projectileIdCounter = 0;

/**
 * Create a player tear
 */
export function createPlayerTear(
  player: Player,
  direction: Vector2D
): Projectile {
  const normalized = normalize(direction);

  // Spawn tear slightly in front of player
  const spawnOffset = 20;
  const position = {
    x: player.position.x + normalized.dx * spawnOffset,
    y: player.position.y + normalized.dy * spawnOffset
  };

  return {
    id: `projectile_${projectileIdCounter++}`,
    owner: 'player',
    position,
    velocity: {
      dx: normalized.dx * PROJECTILE_SPEED,
      dy: normalized.dy * PROJECTILE_SPEED
    },
    damage: player.stats.damage,
    range: player.stats.range,
    distanceTraveled: 0,
    size: PLAYER_TEAR_SIZE
  };
}

/**
 * Create an enemy projectile
 */
export function createEnemyProjectile(
  enemy: Enemy,
  direction: Vector2D
): Projectile {
  const normalized = normalize(direction);

  // Spawn projectile slightly in front of enemy
  const spawnOffset = 20;
  const position = {
    x: enemy.position.x + normalized.dx * spawnOffset,
    y: enemy.position.y + normalized.dy * spawnOffset
  };

  return {
    id: `projectile_${projectileIdCounter++}`,
    owner: 'enemy',
    position,
    velocity: {
      dx: normalized.dx * PROJECTILE_SPEED * 0.7,  // Enemy projectiles slightly slower
      dy: normalized.dy * PROJECTILE_SPEED * 0.7
    },
    damage: enemy.stats.damage,
    range: 500,  // Fixed range for enemy projectiles
    distanceTraveled: 0,
    size: ENEMY_PROJECTILE_SIZE
  };
}

/**
 * Update projectile position
 */
export function updateProjectile(
  projectile: Projectile,
  deltaTime: number
): Projectile {
  const distance = Math.sqrt(
    projectile.velocity.dx * projectile.velocity.dx +
    projectile.velocity.dy * projectile.velocity.dy
  ) * (deltaTime / 1000);

  const newPosition = {
    x: projectile.position.x + projectile.velocity.dx * (deltaTime / 1000),
    y: projectile.position.y + projectile.velocity.dy * (deltaTime / 1000)
  };

  return {
    ...projectile,
    position: newPosition,
    distanceTraveled: projectile.distanceTraveled + distance
  };
}

/**
 * Check if projectile should be removed (out of range or off screen)
 */
export function shouldRemoveProjectile(projectile: Projectile): boolean {
  // Remove if traveled beyond range
  if (projectile.distanceTraveled >= projectile.range) {
    return true;
  }

  // Remove if off screen
  const margin = 50;
  if (
    projectile.position.x < -margin ||
    projectile.position.x > STANDARD_ROOM_LAYOUT.width + margin ||
    projectile.position.y < -margin ||
    projectile.position.y > STANDARD_ROOM_LAYOUT.height + margin
  ) {
    return true;
  }

  return false;
}

/**
 * Filter projectiles to remove invalid ones
 */
export function removeInvalidProjectiles(
  projectiles: ReadonlyArray<Projectile>
): Projectile[] {
  return projectiles.filter(p => !shouldRemoveProjectile(p));
}

/**
 * Separate projectiles by owner
 */
export function separateProjectilesByOwner(
  projectiles: ReadonlyArray<Projectile>
): { player: Projectile[]; enemy: Projectile[] } {
  return {
    player: projectiles.filter(p => p.owner === 'player'),
    enemy: projectiles.filter(p => p.owner === 'enemy')
  };
}
