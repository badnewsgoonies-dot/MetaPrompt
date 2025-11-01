import { describe, it, expect } from 'vitest';
import {
  createPlayer,
  updatePlayerPosition,
  setPlayerVelocity,
  damagePlayer,
  healPlayer,
  isPlayerAlive,
  canShoot
} from '../src/systems/playerSystem';
import { DEFAULT_PLAYER_STATS } from '../src/types/player';

describe('Player System', () => {
  it('should create a player with default stats', () => {
    const player = createPlayer();

    expect(player.stats).toEqual(DEFAULT_PLAYER_STATS);
    expect(player.position).toEqual({ x: 400, y: 300 });
    expect(player.velocity).toEqual({ dx: 0, dy: 0 });
  });

  it('should update player position based on velocity', () => {
    const player = createPlayer();
    const movingPlayer = setPlayerVelocity(player, { dx: 1, dy: 0 });
    const updatedPlayer = updatePlayerPosition(movingPlayer, 100); // 100ms

    expect(updatedPlayer.position.x).toBeGreaterThan(400);
    expect(updatedPlayer.position.y).toBe(300);
  });

  it('should clamp player to room boundaries', () => {
    const player = createPlayer();
    const movingPlayer = {
      ...player,
      position: { x: 10, y: 300 },
      velocity: { dx: -1000, dy: 0 }
    };

    const updatedPlayer = updatePlayerPosition(movingPlayer, 100);

    // Should be clamped to left boundary
    expect(updatedPlayer.position.x).toBeGreaterThanOrEqual(50);
  });

  it('should apply damage to player', () => {
    const player = createPlayer();
    const result = damagePlayer(player, 2);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    expect(result.value.stats.currentHealth).toBe(4);
  });

  it('should not heal beyond max health', () => {
    const player = createPlayer();
    const healedPlayer = healPlayer(player, 10);

    expect(healedPlayer.stats.currentHealth).toBe(DEFAULT_PLAYER_STATS.maxHealth);
  });

  it('should check if player is alive', () => {
    const player = createPlayer();
    expect(isPlayerAlive(player)).toBe(true);

    const deadPlayerResult = damagePlayer(player, 100);
    expect(deadPlayerResult.ok).toBe(true);
    if (!deadPlayerResult.ok) return;

    expect(isPlayerAlive(deadPlayerResult.value)).toBe(false);
  });

  it('should respect tear rate cooldown', () => {
    const player = createPlayer();

    expect(canShoot(player, 0)).toBe(true);
    expect(canShoot(player, 100)).toBe(true);

    const shotPlayer = { ...player, lastTearTime: 0 };
    expect(canShoot(shotPlayer, 400)).toBe(false); // 2 tears/sec = 500ms cooldown
    expect(canShoot(shotPlayer, 600)).toBe(true);
  });
});
