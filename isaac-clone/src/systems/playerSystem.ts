/**
 * Player movement and action system
 */

import { Player, PlayerStats, DEFAULT_PLAYER_STATS, DEFAULT_PLAYER_RESOURCES, PLAYER_SIZE, INVINCIBILITY_DURATION } from '../types/player';
import { Position, Vector2D, normalize } from '../types/common';
import { STANDARD_ROOM_LAYOUT } from '../types/room';
import { clampToRectangle } from '../utils/collision';
import { Result } from '../utils/result';

/**
 * Create a new player at spawn position
 */
export function createPlayer(stats: PlayerStats = DEFAULT_PLAYER_STATS): Player {
  return {
    position: { x: 400, y: 300 },  // Center of room
    velocity: { dx: 0, dy: 0 },
    stats,
    resources: DEFAULT_PLAYER_RESOURCES,
    size: PLAYER_SIZE,
    lastTearTime: -1000,  // Allow immediate first shot
    lastBombTime: -1000,  // Allow immediate first bomb
    lastHitTime: -1000,   // Allow damage immediately (not invincible at start)
    facing: { dx: 0, dy: -1 }  // Initially facing up
  };
}

/**
 * Update player position based on velocity and delta time
 */
export function updatePlayerPosition(
  player: Player,
  deltaTime: number
): Player {
  if (player.velocity.dx === 0 && player.velocity.dy === 0) {
    return player;
  }

  // Calculate new position
  const newX = player.position.x + player.velocity.dx * (deltaTime / 1000);
  const newY = player.position.y + player.velocity.dy * (deltaTime / 1000);

  // Clamp to room boundaries
  const roomBounds = {
    x: 50,
    y: 50,
    width: STANDARD_ROOM_LAYOUT.width - 100,
    height: STANDARD_ROOM_LAYOUT.height - 100
  };

  const clampedPosition = clampToRectangle(
    { x: newX, y: newY },
    player.size,
    roomBounds
  );

  return {
    ...player,
    position: clampedPosition
  };
}

/**
 * Set player velocity based on input direction
 */
export function setPlayerVelocity(
  player: Player,
  direction: Vector2D
): Player {
  // Normalize direction and scale by player speed
  const normalized = normalize(direction);
  const velocity = {
    dx: normalized.dx * player.stats.speed,
    dy: normalized.dy * player.stats.speed
  };

  return {
    ...player,
    velocity
  };
}

/**
 * Set player facing direction (for shooting)
 */
export function setPlayerFacing(
  player: Player,
  direction: Vector2D
): Player {
  const normalized = normalize(direction);

  // Only update facing if direction is non-zero
  if (normalized.dx !== 0 || normalized.dy !== 0) {
    return {
      ...player,
      facing: normalized
    };
  }

  return player;
}

/**
 * Check if player can shoot (based on tear rate)
 */
export function canShoot(player: Player, currentTime: number): boolean {
  const tearCooldown = 1000 / player.stats.tearRate;  // ms between tears
  return currentTime - player.lastTearTime >= tearCooldown;
}

/**
 * Update last tear time when player shoots
 */
export function recordShot(player: Player, currentTime: number): Player {
  return {
    ...player,
    lastTearTime: currentTime
  };
}

/**
 * Check if player is currently invincible
 */
export function isPlayerInvincible(player: Player, currentTime: number): boolean {
  return currentTime - player.lastHitTime < INVINCIBILITY_DURATION;
}

/**
 * Apply damage to player (respects invincibility frames)
 */
export function damagePlayer(
  player: Player,
  damage: number,
  currentTime: number
): Result<Player, string> {
  // Check if player is invincible
  if (isPlayerInvincible(player, currentTime)) {
    return {
      ok: false,
      error: 'Player is invincible'
    };
  }

  const newHealth = Math.max(0, player.stats.currentHealth - damage);

  return {
    ok: true,
    value: {
      ...player,
      stats: {
        ...player.stats,
        currentHealth: newHealth
      },
      lastHitTime: currentTime  // Record hit time for i-frames
    }
  };
}

/**
 * Heal player
 */
export function healPlayer(
  player: Player,
  amount: number
): Player {
  const newHealth = Math.min(
    player.stats.maxHealth,
    player.stats.currentHealth + amount
  );

  return {
    ...player,
    stats: {
      ...player.stats,
      currentHealth: newHealth
    }
  };
}

/**
 * Apply stat modifications from items
 */
export function applyStatModification(
  player: Player,
  modifyStats: (stats: PlayerStats) => PlayerStats
): Player {
  return {
    ...player,
    stats: modifyStats(player.stats)
  };
}

/**
 * Check if player is alive
 */
export function isPlayerAlive(player: Player): boolean {
  return player.stats.currentHealth > 0;
}

/**
 * Reset player position for room transitions
 * @param player The player to reset
 * @param fromDirection The direction the player came from (which door they entered through)
 */
export function resetPlayerPosition(
  player: Player,
  fromDirection?: 'north' | 'south' | 'east' | 'west'
): Player {
  let position: Position;

  if (!fromDirection) {
    // Default to center (for game start)
    position = { x: 400, y: 300 };
  } else {
    // Position player at opposite edge of room from door they entered
    switch (fromDirection) {
      case 'north':
        // Came from north door → spawn at south edge
        position = { x: 400, y: 520 };
        break;
      case 'south':
        // Came from south door → spawn at north edge
        position = { x: 400, y: 80 };
        break;
      case 'west':
        // Came from west door → spawn at east edge
        position = { x: 720, y: 300 };
        break;
      case 'east':
        // Came from east door → spawn at west edge
        position = { x: 80, y: 300 };
        break;
    }
  }

  return {
    ...player,
    position,
    velocity: { dx: 0, dy: 0 }
  };
}
