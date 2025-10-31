import type { Tower } from '../types/tower';
import type { Enemy } from '../types/enemy';
import type { GameState } from '../types/game';
import { calculateDamage } from '../types/combat';
import { distance } from './gridSystem';
import { Ok, type Result } from '../utils/result';

/**
 * Check if tower can attack enemy (in range and cooldown ready)
 */
export const canTowerAttack = (
  tower: Tower,
  enemy: Enemy,
  currentTime: number
): boolean => {
  const dist = distance(tower.position, enemy.position);
  const inRange = dist <= tower.stats.range;

  const timeSinceLastAttack = currentTime - tower.lastAttackTime;
  const cooldown = 1000 / tower.stats.attackSpeed; // Convert attacks/sec to ms
  const cooldownReady = timeSinceLastAttack >= cooldown;

  return inRange && cooldownReady;
};

/**
 * Find target for tower (closest enemy in range)
 */
export const findTarget = (
  tower: Tower,
  enemies: readonly Enemy[]
): Enemy | null => {
  let closest: Enemy | null = null;
  let closestDist = Infinity;

  for (const enemy of enemies) {
    const dist = distance(tower.position, enemy.position);
    if (dist <= tower.stats.range && dist < closestDist) {
      closest = enemy;
      closestDist = dist;
    }
  }

  return closest;
};

/**
 * Attack enemy with tower
 * Returns updated enemy with reduced HP
 */
export const attackEnemy = (
  tower: Tower,
  enemy: Enemy
): Result<Enemy, string> => {
  const damageCalc = calculateDamage(
    tower.stats.damage,
    tower.element,
    enemy.stats.element
  );

  const newHp = Math.max(0, enemy.currentHp - damageCalc.finalDamage);

  return Ok({
    ...enemy,
    currentHp: newHp,
  });
};

/**
 * Update tower cooldown after attack
 */
export const updateTowerCooldown = (
  tower: Tower,
  currentTime: number
): Tower => {
  return {
    ...tower,
    lastAttackTime: currentTime,
  };
};

/**
 * Check if enemy is dead
 */
export const isEnemyDead = (enemy: Enemy): boolean => {
  return enemy.currentHp <= 0;
};

/**
 * Process combat for all towers
 * Returns updated game state
 */
export const processCombat = (gameState: GameState): GameState => {
  let updatedEnemies = [...gameState.enemies];
  let updatedTowers = [...gameState.towers];
  let goldEarned = 0;

  // Each tower finds a target and attacks if possible
  for (let i = 0; i < updatedTowers.length; i++) {
    const tower = updatedTowers[i];
    if (!tower) continue;

    const target = findTarget(tower, updatedEnemies);
    if (!target) continue;

    if (canTowerAttack(tower, target, gameState.time)) {
      // Attack the enemy
      const attackResult = attackEnemy(tower, target);
      if (attackResult.ok) {
        const damagedEnemy = attackResult.value;

        // Update enemy in list
        const enemyIndex = updatedEnemies.findIndex((e) => e.id === target.id);
        if (enemyIndex !== -1) {
          if (isEnemyDead(damagedEnemy)) {
            // Remove dead enemy and award gold
            updatedEnemies.splice(enemyIndex, 1);
            goldEarned += damagedEnemy.stats.goldReward;
          } else {
            updatedEnemies[enemyIndex] = damagedEnemy;
          }
        }

        // Update tower cooldown
        updatedTowers[i] = updateTowerCooldown(tower, gameState.time);
      }
    }
  }

  return {
    ...gameState,
    enemies: updatedEnemies,
    towers: updatedTowers,
    gold: gameState.gold + goldEarned,
  };
};

/**
 * Get all towers that can attack a specific position
 */
export const getTowersInRange = (
  towers: readonly Tower[],
  position: { x: number; y: number },
  range?: number
): Tower[] => {
  return towers.filter((tower) => {
    const dist = distance(tower.position, position);
    return range !== undefined ? dist <= range : dist <= tower.stats.range;
  });
};
