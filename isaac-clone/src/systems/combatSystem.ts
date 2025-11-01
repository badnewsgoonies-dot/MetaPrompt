/**
 * Combat and collision detection system
 */

import { Player } from '../types/player';
import { Enemy } from '../types/enemy';
import { Projectile } from '../types/projectile';
import { circleCollision } from '../utils/collision';
import { damagePlayer } from './playerSystem';
import { damageEnemy, isEnemyAlive } from './enemySystem';
import { Result } from '../utils/result';

export interface CombatResult {
  readonly player: Player;
  readonly enemies: ReadonlyArray<Enemy>;
  readonly projectiles: ReadonlyArray<Projectile>;
  readonly enemiesKilled: number;
  readonly score: number;
}

/**
 * Process all combat interactions
 */
export function processCombat(
  player: Player,
  enemies: ReadonlyArray<Enemy>,
  projectiles: ReadonlyArray<Projectile>,
  currentScore: number,
  currentTime: number
): Result<CombatResult, string> {
  let updatedPlayer = player;
  let updatedEnemies = [...enemies];
  let updatedProjectiles = [...projectiles];
  let enemiesKilled = 0;
  let scoreGained = 0;

  // Track which entities to remove
  const projectilesToRemove = new Set<string>();
  const enemiesToDamage = new Map<string, number>();

  // Check player projectiles vs enemies
  for (const projectile of projectiles) {
    if (projectile.owner !== 'player') continue;

    for (const enemy of updatedEnemies) {
      if (circleCollision(
        projectile.position,
        projectile.size,
        enemy.position,
        enemy.stats.size
      )) {
        // Mark projectile for removal
        projectilesToRemove.add(projectile.id);

        // Accumulate damage for this enemy
        const currentDamage = enemiesToDamage.get(enemy.id) || 0;
        enemiesToDamage.set(enemy.id, currentDamage + projectile.damage);
      }
    }
  }

  // Apply damage to enemies
  updatedEnemies = updatedEnemies.map(enemy => {
    const damage = enemiesToDamage.get(enemy.id);
    if (!damage) return enemy;

    const damageResult = damageEnemy(enemy, damage);
    if (!damageResult.ok) return enemy;

    const damagedEnemy = damageResult.value;

    // Award score for kills
    if (!isEnemyAlive(damagedEnemy)) {
      enemiesKilled++;
      scoreGained += calculateEnemyScore(enemy);
    }

    return damagedEnemy;
  });

  // Remove dead enemies
  updatedEnemies = updatedEnemies.filter(isEnemyAlive);

  // Check enemy projectiles vs player
  let playerDamage = 0;
  for (const projectile of projectiles) {
    if (projectile.owner !== 'enemy') continue;

    if (circleCollision(
      projectile.position,
      projectile.size,
      player.position,
      player.size
    )) {
      projectilesToRemove.add(projectile.id);
      playerDamage += projectile.damage;
    }
  }

  // Apply damage to player
  if (playerDamage > 0) {
    const damageResult = damagePlayer(player, playerDamage, currentTime);
    if (damageResult.ok) {
      updatedPlayer = damageResult.value;
    }
    // If not ok, player is invincible - don't apply damage
  }

  // Check enemy contact damage vs player
  let contactDamage = 0;
  for (const enemy of updatedEnemies) {
    if (circleCollision(
      enemy.position,
      enemy.stats.size,
      player.position,
      player.size
    )) {
      contactDamage += enemy.stats.damage;
    }
  }

  // Apply contact damage (reduced to prevent instant death)
  if (contactDamage > 0) {
    const damageResult = damagePlayer(updatedPlayer, contactDamage * 0.1, currentTime); // 10% of contact damage per frame
    if (damageResult.ok) {
      updatedPlayer = damageResult.value;
    }
    // If not ok, player is invincible - don't apply damage
  }

  // Remove collided projectiles
  updatedProjectiles = updatedProjectiles.filter(
    p => !projectilesToRemove.has(p.id)
  );

  return {
    ok: true,
    value: {
      player: updatedPlayer,
      enemies: updatedEnemies,
      projectiles: updatedProjectiles,
      enemiesKilled,
      score: currentScore + scoreGained
    }
  };
}

/**
 * Calculate score value for killing an enemy
 */
function calculateEnemyScore(enemy: Enemy): number {
  switch (enemy.type) {
    case 'fly':
      return 10;
    case 'spider':
      return 25;
    case 'maw':
      return 50;
    default:
      return 10;
  }
}

/**
 * Check if player can collect an item
 */
export function checkItemCollection(
  playerPos: { x: number; y: number },
  playerSize: number,
  itemPos: { x: number; y: number },
  itemSize: number = 20
): boolean {
  return circleCollision(playerPos, playerSize, itemPos, itemSize);
}
