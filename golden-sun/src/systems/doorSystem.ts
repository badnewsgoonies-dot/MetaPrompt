/**
 * Door unlocking system
 */

import { Player } from '../types/player';
import { Room, Door } from '../types/room';
import { Dungeon } from '../types/game';
import { Result } from '../utils/result';

/**
 * Try to unlock a door with a key
 */
export function tryUnlockDoor(
  player: Player,
  dungeon: Dungeon,
  roomId: string,
  direction: 'north' | 'south' | 'east' | 'west'
): Result<{ player: Player; dungeon: Dungeon }, string> {
  const roomIndex = dungeon.rooms.findIndex((r: Room) => r.id === roomId);
  if (roomIndex === -1) {
    return {
      ok: false,
      error: 'Room not found'
    };
  }

  const room = dungeon.rooms[roomIndex];
  if (!room) {
    return {
      ok: false,
      error: 'Room is undefined'
    };
  }

  const door = room.doors.find((d: Door) => d.direction === direction);
  if (!door) {
    return {
      ok: false,
      error: 'No door in that direction'
    };
  }

  if (!door.locked) {
    return {
      ok: false,
      error: 'Door is already unlocked'
    };
  }

  // Check if player has golden key (infinite keys)
  if (player.resources.hasGoldenKey) {
    const newDoors = room.doors.map((d: Door) =>
      d.direction === direction ? { ...d, locked: false } : d
    );

    const newRooms = [...dungeon.rooms];
    newRooms[roomIndex] = { ...room, doors: newDoors };

    return {
      ok: true,
      value: {
        player,
        dungeon: { ...dungeon, rooms: newRooms }
      }
    };
  }

  // Check if player has a key
  if (player.resources.keys <= 0) {
    return {
      ok: false,
      error: 'No keys available'
    };
  }

  // Use a key to unlock
  const newDoors = room.doors.map((d: Door) =>
    d.direction === direction ? { ...d, locked: false } : d
  );

  const newRooms = [...dungeon.rooms];
  newRooms[roomIndex] = { ...room, doors: newDoors };

  const updatedPlayer = {
    ...player,
    resources: {
      ...player.resources,
      keys: player.resources.keys - 1
    }
  };

  return {
    ok: true,
    value: {
      player: updatedPlayer,
      dungeon: { ...dungeon, rooms: newRooms }
    }
  };
}
