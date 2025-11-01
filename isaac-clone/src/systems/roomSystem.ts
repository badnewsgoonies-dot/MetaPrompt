/**
 * Room generation and dungeon creation system
 */

import { Room, RoomType, Door } from '../types/room';
import { Dungeon } from '../types/game';
import { SeededRNG } from '../utils/rng';
import { Result } from '../utils/result';

/**
 * Generate a procedural dungeon with connected rooms
 */
export function generateDungeon(rng: SeededRNG): Result<Dungeon, string> {
  const gridSize = 3;
  const rooms: Room[] = [];

  // Create 3x3 grid of rooms
  for (let y = 0; y < gridSize; y++) {
    for (let x = 0; x < gridSize; x++) {
      const roomType = determineRoomType(x, y, gridSize, rng);
      const doors = generateDoors(x, y, gridSize, roomType, rng);

      rooms.push({
        id: `room_${x}_${y}`,
        type: roomType,
        gridX: x,
        gridY: y,
        doors,
        cleared: roomType === 'start',  // Start room is pre-cleared
        visited: roomType === 'start'   // Start room is pre-visited
      });
    }
  }

  return {
    ok: true,
    value: {
      rooms,
      gridSize
    }
  };
}

/**
 * Determine room type based on position in grid
 */
function determineRoomType(
  x: number,
  y: number,
  gridSize: number,
  rng: SeededRNG
): RoomType {
  // Center room is always start
  const center = Math.floor(gridSize / 2);
  if (x === center && y === center) {
    return 'start';
  }

  // Boss room in one of the corners
  if ((x === 0 || x === gridSize - 1) && (y === 0 || y === gridSize - 1)) {
    if (rng.chance(0.4)) {  // 40% chance for corner to be boss
      return 'boss';
    }
  }

  // Shop room - guaranteed one per floor
  if (x === 0 && y === center) {
    return 'shop';
  }

  // Secret room - hidden, accessed from edges
  if (x === gridSize - 1 && y === center) {
    if (rng.chance(0.3)) {
      return 'secret';
    }
  }

  // Treasure rooms randomly placed
  if (rng.chance(0.2)) {  // 20% chance
    return 'treasure';
  }

  return 'normal';
}

/**
 * Generate doors for a room based on its grid position and type
 */
function generateDoors(
  x: number,
  y: number,
  gridSize: number,
  roomType: RoomType,
  rng: SeededRNG
): Door[] {
  const doors: Door[] = [];

  // Add door to north if not at top edge
  if (y > 0) {
    doors.push({
      direction: 'north',
      locked: false
    });
  }

  // Add door to south if not at bottom edge
  if (y < gridSize - 1) {
    doors.push({
      direction: 'south',
      locked: false
    });
  }

  // Add door to west if not at left edge
  if (x > 0) {
    doors.push({
      direction: 'west',
      locked: false
    });
  }

  // Add door to east if not at right edge
  if (x < gridSize - 1) {
    doors.push({
      direction: 'east',
      locked: false
    });
  }

  // Treasure rooms and shops have one locked door
  if (roomType === 'treasure' || roomType === 'shop') {
    if (doors.length > 0) {
      const doorToLock = rng.nextInt(0, doors.length);
      const door = doors[doorToLock];
      if (door) {
        doors[doorToLock] = { ...door, locked: true };
      }
    }
  }

  // Secret rooms have all doors initially locked
  if (roomType === 'secret') {
    return doors.map((d: Door) => ({ ...d, locked: true }));
  }

  // Randomly remove some doors from normal rooms
  if (roomType === 'normal' && doors.length > 1) {
    const doorsToKeep = Math.max(1, rng.nextInt(1, doors.length + 1));
    while (doors.length > doorsToKeep) {
      const indexToRemove = rng.nextInt(0, doors.length);
      doors.splice(indexToRemove, 1);
    }
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
    cleared: true
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
