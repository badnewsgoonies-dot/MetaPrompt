/**
 * Projectile (tears) system
 */

import { Projectile, PLAYER_TEAR_SIZE, ENEMY_PROJECTILE_SIZE, PROJECTILE_SPEED } from '../types/projectile';
import { Vector2D, normalize } from '../types/common';
import { Player } from '../types/player';
import { Enemy } from '../types/enemy';
import { STANDARD_ROOM_LAYOUT } from '../types/room';

let projectileIdCounter = 0;

// Maximum angle in radians that momentum can add (30 degrees)
const MAX_MOMENTUM_ANGLE = (30 * Math.PI) / 180;

// How much player velocity affects projectile direction (0-1)
const MOMENTUM_INFLUENCE = 0.3;

/**
 * Calculate angle between two vectors in radians
 */
function angleBetween(v1: Vector2D, v2: Vector2D): number {
  const dot = v1.dx * v2.dx + v1.dy * v2.dy;
  const mag1 = Math.sqrt(v1.dx * v1.dx + v1.dy * v1.dy);
  const mag2 = Math.sqrt(v2.dx * v2.dx + v2.dy * v2.dy);

  if (mag1 === 0 || mag2 === 0) return 0;

  const cosAngle = Math.max(-1, Math.min(1, dot / (mag1 * mag2)));
  return Math.acos(cosAngle);
}

/**
 * Blend two direction vectors with angle clamping
 */
function blendDirectionsWithMaxAngle(
  baseDirection: Vector2D,
  momentum: Vector2D,
  influence: number,
  maxAngle: number
): Vector2D {
  // If no momentum, return base direction
  const momentumMag = Math.sqrt(momentum.dx * momentum.dx + momentum.dy * momentum.dy);
  if (momentumMag === 0) {
    return baseDirection;
  }

  // Normalize both vectors
  const normBase = normalize(baseDirection);
  const normMomentum = normalize(momentum);

  // Blend the vectors
  const blended = {
    dx: normBase.dx + normMomentum.dx * influence,
    dy: normBase.dy + normMomentum.dy * influence
  };

  const normBlended = normalize(blended);

  // Check angle between base and blended
  const angle = angleBetween(normBase, normBlended);

  // If angle exceeds max, clamp it
  if (angle > maxAngle) {
    // Calculate the cross product to determine rotation direction
    const cross = normBase.dx * normMomentum.dy - normBase.dy * normMomentum.dx;
    const sign = cross >= 0 ? 1 : -1;

    // Rotate base direction by maxAngle
    const cos = Math.cos(sign * maxAngle);
    const sin = Math.sin(sign * maxAngle);

    return {
      dx: normBase.dx * cos - normBase.dy * sin,
      dy: normBase.dx * sin + normBase.dy * cos
    };
  }

  return normBlended;
}

/**
 * Create a player tear with momentum from player movement
 */
export function createPlayerTear(
  player: Player,
  direction: Vector2D
): Projectile {
  const normalized = normalize(direction);

  // Add momentum from player velocity
  const finalDirection = blendDirectionsWithMaxAngle(
    normalized,
    player.velocity,
    MOMENTUM_INFLUENCE,
    MAX_MOMENTUM_ANGLE
  );

  // Spawn tear slightly in front of player
  const spawnOffset = 20;
  const position = {
    x: player.position.x + finalDirection.dx * spawnOffset,
    y: player.position.y + finalDirection.dy * spawnOffset
  };

  return {
    id: `projectile_${projectileIdCounter++}`,
    owner: 'player',
    position,
    velocity: {
      dx: finalDirection.dx * PROJECTILE_SPEED,
      dy: finalDirection.dy * PROJECTILE_SPEED
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
