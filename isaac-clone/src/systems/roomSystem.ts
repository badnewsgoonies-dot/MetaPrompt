/**
 * Room generation and dungeon creation system
 */

import { Room, RoomType, Door } from '../types/room';
import { Dungeon } from '../types/game';
import { SeededRNG } from '../utils/rng';
import { Result } from '../utils/result';

/**
 * Generate a procedural dungeon with connected rooms
 * STRUCTURE: Linear 5-room dungeon (4 normal + 1 boss)
 * Room 0 (start) -> Room 1 (normal) -> Room 2 (normal) -> Room 3 (normal) -> Room 4 (boss)
 */
export function generateDungeon(_rng: SeededRNG): Result<Dungeon, string> {
  const totalRooms = 5;
  const rooms: Room[] = [];

  // Create linear dungeon (5 rooms in a row)
  for (let i = 0; i < totalRooms; i++) {
    const roomType = determineRoomTypeLinear(i, totalRooms);
    const doors = generateDoorsLinear(i, totalRooms, roomType);

    rooms.push({
      id: `room_${i}_0`,
      type: roomType,
      gridX: i,
      gridY: 0,
      doors,
      cleared: roomType === 'start',  // Start room is pre-cleared
      visited: roomType === 'start',   // Start room is pre-visited
      bossExitUnlocked: false  // Boss exit locked until boss defeated
    });
  }

  return {
    ok: true,
    value: {
      rooms,
      gridSize: totalRooms  // Use totalRooms for compatibility
    }
  };
}

/**
 * Determine room type for linear dungeon
 */
function determineRoomTypeLinear(
  index: number,
  totalRooms: number
): RoomType {
  // First room is always start
  if (index === 0) {
    return 'start';
  }

  // Last room is always boss
  if (index === totalRooms - 1) {
    return 'boss';
  }

  // Middle rooms are normal
  return 'normal';
}

/**
 * Generate doors for linear dungeon
 */
function generateDoorsLinear(
  index: number,
  totalRooms: number,
  _roomType: RoomType
): Door[] {
  const doors: Door[] = [];

  // Add door to west (previous room) if not first room
  if (index > 0) {
    doors.push({
      direction: 'west',
      locked: false
    });
  }

  // Add door to east (next room) if not last room
  if (index < totalRooms - 1) {
    doors.push({
      direction: 'east',
      locked: false
    });
  }

  return doors;
}

/**
 * Get room by grid coordinates
 */
export function getRoomAt(
  dungeon: Dungeon,
  gridX: number,
  gridY: number
): Room | undefined {
  return dungeon.rooms.find(r => r.gridX === gridX && r.gridY === gridY);
}

/**
 * Get current room
 */
export function getCurrentRoom(
  dungeon: Dungeon,
  currentRoomId: string
): Result<Room, string> {
  const room = dungeon.rooms.find(r => r.id === currentRoomId);
  if (!room) {
    return {
      ok: false,
      error: `Room not found: ${currentRoomId}`
    };
  }
  return { ok: true, value: room };
}

/**
 * Mark a room as cleared
 */
export function clearRoom(
  dungeon: Dungeon,
  roomId: string
): Result<Dungeon, string> {
  const roomIndex = dungeon.rooms.findIndex(r => r.id === roomId);
  if (roomIndex === -1) {
    return {
      ok: false,
      error: `Room not found: ${roomId}`
    };
  }

  const newRooms = [...dungeon.rooms];
  const room = newRooms[roomIndex];
  if (!room) {
    return {
      ok: false,
      error: `Room not found at index: ${roomIndex}`
    };
  }
  newRooms[roomIndex] = {
    ...room,
    cleared: true,
    bossExitUnlocked: room.type === 'boss' ? true : room.bossExitUnlocked  // Unlock boss exit if boss room
  };

  return {
    ok: true,
    value: {
      ...dungeon,
      rooms: newRooms
    }
  };
}

/**
 * Move to adjacent room through a door
 */
export function moveToRoom(
  dungeon: Dungeon,
  currentRoomId: string,
  direction: 'north' | 'south' | 'east' | 'west'
): Result<string, string> {
  const currentRoomResult = getCurrentRoom(dungeon, currentRoomId);
  if (!currentRoomResult.ok) {
    return currentRoomResult;
  }

  const currentRoom = currentRoomResult.value;

  // Check if door exists in that direction
  const door = currentRoom.doors.find(d => d.direction === direction);
  if (!door) {
    return {
      ok: false,
      error: `No door in direction: ${direction}`
    };
  }

  if (door.locked) {
    return {
      ok: false,
      error: 'Door is locked'
    };
  }

  // Calculate new grid position
  let newX = currentRoom.gridX;
  let newY = currentRoom.gridY;

  switch (direction) {
    case 'north':
      newY -= 1;
      break;
    case 'south':
      newY += 1;
      break;
    case 'west':
      newX -= 1;
      break;
    case 'east':
      newX += 1;
      break;
  }

  const newRoom = getRoomAt(dungeon, newX, newY);
  if (!newRoom) {
    return {
      ok: false,
      error: 'No room in that direction'
    };
  }

  return { ok: true, value: newRoom.id };
}

/**
 * Lock all doors in a room (when enemies are present)
 */
export function lockRoomDoors(
  dungeon: Dungeon,
  roomId: string
): Result<Dungeon, string> {
  const roomIndex = dungeon.rooms.findIndex(r => r.id === roomId);
  if (roomIndex === -1) {
    return {
      ok: false,
      error: `Room not found: ${roomId}`
    };
  }

  const room = dungeon.rooms[roomIndex];
  if (!room) {
    return {
      ok: false,
      error: `Room not found at index: ${roomIndex}`
    };
  }
  const newDoors = room.doors.map(d => ({ ...d, locked: true }));

  const newRooms = [...dungeon.rooms];
  newRooms[roomIndex] = {
    ...room,
    doors: newDoors
  };

  return {
    ok: true,
    value: {
      ...dungeon,
      rooms: newRooms
    }
  };
}

/**
 * Unlock all doors in a room (when room is cleared)
 */
export function unlockRoomDoors(
  dungeon: Dungeon,
  roomId: string
): Result<Dungeon, string> {
  const roomIndex = dungeon.rooms.findIndex(r => r.id === roomId);
  if (roomIndex === -1) {
    return {
      ok: false,
      error: `Room not found: ${roomId}`
    };
  }

  const room = dungeon.rooms[roomIndex];
  if (!room) {
    return {
      ok: false,
      error: `Room not found at index: ${roomIndex}`
    };
  }
  const newDoors = room.doors.map(d => ({ ...d, locked: false }));

  const newRooms = [...dungeon.rooms];
  newRooms[roomIndex] = {
    ...room,
    doors: newDoors
  };

  return {
    ok: true,
    value: {
      ...dungeon,
      rooms: newRooms
    }
  };
}
