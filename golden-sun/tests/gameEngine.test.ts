import { describe, it, expect } from 'vitest';
import { initializeGame, updateGame } from '../src/systems/gameEngine';

describe('Game Engine', () => {
  it('should initialize a new game', () => {
    const result = initializeGame(12345);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const state = result.value;
    expect(state.phase).toBe('playing');
    expect(state.seed).toBe(12345);
    expect(state.player.stats.currentHealth).toBe(6);
    expect(state.dungeon.rooms.length).toBe(5); // 5-room linear dungeon
    expect(state.enemies.length).toBe(0); // Start room has no enemies
    expect(state.score).toBe(0);
  });

  it('should have a start room in the dungeon', () => {
    const result = initializeGame(12345);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const state = result.value;
    const startRoom = state.dungeon.rooms.find(r => r.type === 'start');

    expect(startRoom).toBeDefined();
    expect(startRoom?.cleared).toBe(true);
    expect(startRoom?.visited).toBe(true);
  });

  it('should update game time', () => {
    const initResult = initializeGame(12345);
    expect(initResult.ok).toBe(true);
    if (!initResult.ok) return;

    const state = initResult.value;
    const updateResult = updateGame(state, 16.666);

    expect(updateResult.ok).toBe(true);
    if (!updateResult.ok) return;

    expect(updateResult.value.time).toBeCloseTo(16.666, 2);
  });

  it('should not update when paused', () => {
    const initResult = initializeGame(12345);
    expect(initResult.ok).toBe(true);
    if (!initResult.ok) return;

    const state = { ...initResult.value, phase: 'paused' as const };
    const updateResult = updateGame(state, 16.666);

    expect(updateResult.ok).toBe(true);
    if (!updateResult.ok) return;

    expect(updateResult.value.time).toBe(0);
  });
});
