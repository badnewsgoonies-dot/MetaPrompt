/**
 * Enemy AI and behavior system
 */

import { Enemy, EnemyType, ENEMY_STATS } from '../types/enemy';
import { Position, Vector2D, normalize } from '../types/common';
import { Player } from '../types/player';
import { STANDARD_ROOM_LAYOUT } from '../types/room';
import { clampToRectangle } from '../utils/collision';
import { SeededRNG } from '../utils/rng';
import { Result } from '../utils/result';

let enemyIdCounter = 0;

/**
 * Spawn a new enemy
 */
export function spawnEnemy(
  type: EnemyType,
  position: Position
): Enemy {
  const stats = ENEMY_STATS[type];

  return {
    id: `enemy_${enemyIdCounter++}`,
    type,
    position,
    velocity: { dx: 0, dy: 0 },
    currentHealth: stats.maxHealth,
    stats,
    lastActionTime: 0
  };
}

/**
 * Spawn multiple enemies in random positions within spawn zones
 */
export function spawnEnemiesInRoom(
  count: number,
  rng: SeededRNG
): Enemy[] {
  const enemies: Enemy[] = [];
  const spawnZone = STANDARD_ROOM_LAYOUT.spawnZones[0];

  if (!spawnZone) {
    return enemies;
  }

  for (let i = 0; i < count; i++) {
    // Random enemy type
    const types: EnemyType[] = ['fly', 'spider', 'maw'];
    const type = rng.choice(types) || 'fly';

    // Random position in spawn zone
    const x = rng.nextInt(
      spawnZone.x + 30,
      spawnZone.x + spawnZone.width - 30
    );
    const y = rng.nextInt(
      spawnZone.y + 30,
      spawnZone.y + spawnZone.height - 30
    );

    enemies.push(spawnEnemy(type, { x, y }));
  }

  return enemies;
}

/**
 * Update enemy AI and movement
 */
export function updateEnemy(
  enemy: Enemy,
  player: Player,
  deltaTime: number,
  currentTime: number,
  rng: SeededRNG
): Enemy {
  let velocity = { dx: 0, dy: 0 };

  switch (enemy.stats.behavior) {
    case 'erratic':
      velocity = updateErraticMovement(enemy, currentTime, rng);
      break;
    case 'chase':
      velocity = updateChaseMovement(enemy, player);
      break;
    case 'shoot':
      velocity = updateShootMovement(enemy, player);
      break;
  }

  // Update position
  const newX = enemy.position.x + velocity.dx * (deltaTime / 1000);
  const newY = enemy.position.y + velocity.dy * (deltaTime / 1000);

  // Clamp to room boundaries
  const roomBounds = {
    x: 50,
    y: 50,
    width: STANDARD_ROOM_LAYOUT.width - 100,
    height: STANDARD_ROOM_LAYOUT.height - 100
  };

  const clampedPosition = clampToRectangle(
    { x: newX, y: newY },
    enemy.stats.size,
    roomBounds
  );

  return {
    ...enemy,
    position: clampedPosition,
    velocity
  };
}

/**
 * Erratic movement AI (flies)
 */
function updateErraticMovement(
  enemy: Enemy,
  currentTime: number,
  rng: SeededRNG
): Vector2D {
  // Change direction every 800ms
  if (currentTime - enemy.lastActionTime > 800) {
    const angle = rng.nextInt(0, 360) * (Math.PI / 180);
    return {
      dx: Math.cos(angle) * enemy.stats.speed,
      dy: Math.sin(angle) * enemy.stats.speed
    };
  }

  return enemy.velocity;
}

/**
 * Chase movement AI (spiders)
 */
function updateChaseMovement(
  enemy: Enemy,
  player: Player
): Vector2D {
  const direction = {
    dx: player.position.x - enemy.position.x,
    dy: player.position.y - enemy.position.y
  };

  const normalized = normalize(direction);

  return {
    dx: normalized.dx * enemy.stats.speed,
    dy: normalized.dy * enemy.stats.speed
  };
}

/**
 * Shoot movement AI (maws) - move slowly, shoot periodically
 */
function updateShootMovement(
  enemy: Enemy,
  player: Player
): Vector2D {
  // Move slowly towards player
  const direction = {
    dx: player.position.x - enemy.position.x,
    dy: player.position.y - enemy.position.y
  };

  const normalized = normalize(direction);

  return {
    dx: normalized.dx * enemy.stats.speed,
    dy: normalized.dy * enemy.stats.speed
  };
}

/**
 * Check if enemy can shoot
 */
export function canEnemyShoot(enemy: Enemy, currentTime: number): boolean {
  if (enemy.stats.behavior !== 'shoot' || !enemy.stats.shootInterval) {
    return false;
  }

  return currentTime - enemy.lastActionTime >= enemy.stats.shootInterval;
}

/**
 * Get direction to shoot at player
 */
export function getShootDirection(enemy: Enemy, player: Player): Vector2D {
  const direction = {
    dx: player.position.x - enemy.position.x,
    dy: player.position.y - enemy.position.y
  };

  return normalize(direction);
}

/**
 * Update enemy last action time
 */
export function updateLastActionTime(enemy: Enemy, time: number): Enemy {
  return {
    ...enemy,
    lastActionTime: time
  };
}

/**
 * Apply damage to enemy
 */
export function damageEnemy(
  enemy: Enemy,
  damage: number
): Result<Enemy, string> {
  const newHealth = Math.max(0, enemy.currentHealth - damage);

  return {
    ok: true,
    value: {
      ...enemy,
      currentHealth: newHealth
    }
  };
}

/**
 * Check if enemy is alive
 */
export function isEnemyAlive(enemy: Enemy): boolean {
  return enemy.currentHealth > 0;
}

/**
 * Filter out dead enemies
 */
export function removeDeadEnemies(enemies: ReadonlyArray<Enemy>): Enemy[] {
  return enemies.filter(isEnemyAlive);
}
