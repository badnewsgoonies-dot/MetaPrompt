/**
 * Bomb system
 */

import { Bomb, BOMB_FUSE_TIME, BOMB_BLAST_RADIUS, BOMB_COOLDOWN, BOMB_DAMAGE } from '../types/bomb';
import { Player } from '../types/player';
import { Enemy } from '../types/enemy';
import { Obstacle } from '../types/obstacle';
import { circleCollision } from '../utils/collision';
import { Result } from '../utils/result';
import { damageEnemy } from './enemySystem';
import { damagePlayer } from './playerSystem';
import { destroyObstacle, canDestroyObstacle } from './obstacleSystem';

let bombIdCounter = 0;

/**
 * Place a bomb
 */
export function placeBomb(
  player: Player,
  currentTime: number
): Result<{ player: Player; bomb: Bomb }, string> {
  // Check if player has bombs
  if (player.resources.bombs <= 0) {
    return {
      ok: false,
      error: 'No bombs available'
    };
  }

  // Check cooldown
  if (currentTime - player.lastBombTime < BOMB_COOLDOWN) {
    return {
      ok: false,
      error: 'Bomb on cooldown'
    };
  }

  const bomb: Bomb = {
    id: `bomb_${bombIdCounter++}`,
    position: { ...player.position },
    placedTime: currentTime,
    fuseTime: BOMB_FUSE_TIME,
    exploded: false,
    blastRadius: BOMB_BLAST_RADIUS
  };

  const updatedPlayer = {
    ...player,
    resources: {
      ...player.resources,
      bombs: player.resources.bombs - 1
    },
    lastBombTime: currentTime
  };

  return {
    ok: true,
    value: {
      player: updatedPlayer,
      bomb
    }
  };
}

/**
 * Update bomb state
 */
export function updateBomb(
  bomb: Bomb,
  currentTime: number
): Bomb {
  if (bomb.exploded) {
    return bomb;
  }

  // Check if bomb should explode
  if (currentTime - bomb.placedTime >= bomb.fuseTime) {
    return { ...bomb, exploded: true };
  }

  return bomb;
}

/**
 * Process bomb explosions
 */
export function processBombExplosions(
  bombs: ReadonlyArray<Bomb>,
  player: Player,
  enemies: ReadonlyArray<Enemy>,
  obstacles: ReadonlyArray<Obstacle>,
  currentTime: number
): {
  player: Player;
  enemies: ReadonlyArray<Enemy>;
  obstacles: ReadonlyArray<Obstacle>;
  bombs: ReadonlyArray<Bomb>;
} {
  let updatedPlayer = player;
  let updatedEnemies = [...enemies];
  let updatedObstacles = [...obstacles];
  const activeBombs: Bomb[] = [];

  for (const bomb of bombs) {
    const updatedBomb = updateBomb(bomb, currentTime);

    if (updatedBomb.exploded && !bomb.exploded) {
      // Just exploded! Apply damage to entities in blast radius

      // Damage player
      if (circleCollision(
        bomb.position,
        bomb.blastRadius,
        updatedPlayer.position,
        updatedPlayer.size
      )) {
        const damageResult = damagePlayer(updatedPlayer, BOMB_DAMAGE * 0.5, currentTime); // 50% damage to player
        if (damageResult.ok) {
          updatedPlayer = damageResult.value;
        }
        // If not ok, player is invincible - don't apply damage
      }

      // Damage enemies
      updatedEnemies = updatedEnemies.map(enemy => {
        if (circleCollision(
          bomb.position,
          bomb.blastRadius,
          enemy.position,
          enemy.stats.size
        )) {
          const damageResult = damageEnemy(enemy, BOMB_DAMAGE);
          return damageResult.ok ? damageResult.value : enemy;
        }
        return enemy;
      });

      // Destroy obstacles
      updatedObstacles = updatedObstacles.map(obstacle => {
        if (canDestroyObstacle(obstacle) && circleCollision(
          bomb.position,
          bomb.blastRadius,
          obstacle.position,
          obstacle.size
        )) {
          return destroyObstacle(obstacle);
        }
        return obstacle;
      });
    }

    // Keep bomb for a bit after explosion for visual effect
    if (!updatedBomb.exploded || currentTime - updatedBomb.placedTime < updatedBomb.fuseTime + 500) {
      activeBombs.push(updatedBomb);
    }
  }

  return {
    player: updatedPlayer,
    enemies: updatedEnemies,
    obstacles: updatedObstacles,
    bombs: activeBombs
  };
}
