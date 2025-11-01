import { describe, it, expect } from 'vitest';
import { generateDungeon, getRoomAt, clearRoom, moveToRoom } from '../src/systems/roomSystem';
import { SeededRNG } from '../src/utils/rng';

describe('Room System', () => {
  it('should generate a 5-room linear dungeon', () => {
    const rng = new SeededRNG(12345);
    const result = generateDungeon(rng);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const dungeon = result.value;
    expect(dungeon.rooms.length).toBe(5);
    expect(dungeon.gridSize).toBe(5);
  });

  it('should have a start room at the beginning', () => {
    const rng = new SeededRNG(12345);
    const result = generateDungeon(rng);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const dungeon = result.value;
    const startRoom = dungeon.rooms.find(r => r.type === 'start');

    expect(startRoom).toBeDefined();
    expect(startRoom?.gridX).toBe(0);
    expect(startRoom?.gridY).toBe(0);
  });

  it('should get room by grid coordinates', () => {
    const rng = new SeededRNG(12345);
    const result = generateDungeon(rng);

    expect(result.ok).toBe(true);
    if (!result.ok) return;

    const dungeon = result.value;
    const room = getRoomAt(dungeon, 0, 0);

    expect(room).toBeDefined();
    expect(room?.type).toBe('start');
  });

  it('should clear a room', () => {
    const rng = new SeededRNG(12345);
    const dungeonResult = generateDungeon(rng);

    expect(dungeonResult.ok).toBe(true);
    if (!dungeonResult.ok) return;

    const dungeon = dungeonResult.value;
    const normalRoom = dungeon.rooms.find(r => r.type === 'normal');

    expect(normalRoom).toBeDefined();
    if (!normalRoom) return;

    const clearResult = clearRoom(dungeon, normalRoom.id);

    expect(clearResult.ok).toBe(true);
    if (!clearResult.ok) return;

    const clearedRoom = clearResult.value.rooms.find(r => r.id === normalRoom.id);
    expect(clearedRoom?.cleared).toBe(true);
  });

  it('should move to adjacent room', () => {
    const rng = new SeededRNG(12345);
    const dungeonResult = generateDungeon(rng);

    expect(dungeonResult.ok).toBe(true);
    if (!dungeonResult.ok) return;

    const dungeon = dungeonResult.value;
    const startRoom = dungeon.rooms.find(r => r.type === 'start');

    expect(startRoom).toBeDefined();
    if (!startRoom) return;

    // Try to move east (linear dungeon goes east)
    const eastDoor = startRoom.doors.find(d => d.direction === 'east');
    expect(eastDoor).toBeDefined();

    if (eastDoor) {
      const moveResult = moveToRoom(dungeon, startRoom.id, 'east');
      expect(moveResult.ok).toBe(true);

      if (moveResult.ok) {
        const newRoom = dungeon.rooms.find(r => r.id === moveResult.value);
        expect(newRoom?.gridX).toBe(startRoom.gridX + 1);
      }
    }
  });
});
