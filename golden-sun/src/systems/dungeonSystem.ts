import { Result, Ok, Err } from '../utils/result';
import { Position } from '../types/common';

/**
 * Dungeon System for Golden Sun
 * Handles multi-room dungeons, doors, puzzles, and progression
 */

export interface DungeonRoom {
  id: string;
  name: string;
  type: 'entrance' | 'corridor' | 'puzzle' | 'treasure' | 'boss' | 'exit';
  gridWidth: number;
  gridHeight: number;
  connections: RoomConnection[];
  enemies?: string[]; // Enemy group IDs
  treasures?: TreasureChest[];
  puzzles?: Puzzle[];
  explored: boolean;
}

export interface RoomConnection {
  direction: 'north' | 'south' | 'east' | 'west';
  targetRoomId: string;
  doorType: 'open' | 'locked' | 'key' | 'switch' | 'one-way';
  requiredKey?: string;
  isOpen: boolean;
}

export interface TreasureChest {
  id: string;
  position: Position;
  contents: ChestContents;
  isOpened: boolean;
  requiresPsynergy?: string; // Psynergy needed to reach/open
}

export interface ChestContents {
  type: 'item' | 'coins' | 'djinn';
  itemId?: string;
  coins?: number;
  djinnId?: string;
  quantity?: number;
}

export interface Puzzle {
  id: string;
  type: 'push-block' | 'switch' | 'statue' | 'ice-pillar';
  isSolved: boolean;
  requiredPsynergy?: string;
  reward?: {
    opensConnection: string; // Room connection ID
    revealsChest?: string; // Treasure chest ID
  };
}

export interface DungeonState {
  dungeonId: string;
  currentRoomId: string;
  rooms: Map<string, DungeonRoom>;
  keysCollected: Set<string>;
  switchesActivated: Set<string>;
  playerPosition: Position;
}

/**
 * Initialize a dungeon
 */
export function initializeDungeon(
  dungeonId: string,
  rooms: DungeonRoom[],
  startRoomId: string,
  startPosition: Position
): Result<DungeonState, string> {
  const roomMap = new Map<string, DungeonRoom>();
  rooms.forEach(room => roomMap.set(room.id, room));

  if (!roomMap.has(startRoomId)) {
    return Err(`Start room ${startRoomId} not found in dungeon`);
  }

  return Ok({
    dungeonId,
    currentRoomId: startRoomId,
    rooms: roomMap,
    keysCollected: new Set(),
    switchesActivated: new Set(),
    playerPosition: { ...startPosition }
  });
}

/**
 * Move to adjacent room through door
 */
export function moveToRoom(
  state: DungeonState,
  direction: 'north' | 'south' | 'east' | 'west'
): Result<DungeonState, string> {
  const currentRoom = state.rooms.get(state.currentRoomId);
  
  if (!currentRoom) {
    return Err('Current room not found');
  }

  // Find connection in specified direction
  const connection = currentRoom.connections.find(c => c.direction === direction);
  
  if (!connection) {
    return Err(`No exit to the ${direction}`);
  }

  // Check if door is open
  if (!connection.isOpen) {
    // Check door type
    if (connection.doorType === 'locked') {
      return Err('The door is locked');
    }
    
    if (connection.doorType === 'key' && connection.requiredKey) {
      if (!state.keysCollected.has(connection.requiredKey)) {
        return Err(`Need ${connection.requiredKey} to open this door`);
      }
      // Use key to open
      connection.isOpen = true;
    }
    
    if (connection.doorType === 'switch') {
      return Err('This door requires a switch to be activated');
    }
  }

  // Move to new room
  const targetRoom = state.rooms.get(connection.targetRoomId);
  if (!targetRoom) {
    return Err(`Target room ${connection.targetRoomId} not found`);
  }

  state.currentRoomId = connection.targetRoomId;
  targetRoom.explored = true;

  // Set player position at entrance of new room
  switch (direction) {
    case 'north':
      state.playerPosition = { x: Math.floor(targetRoom.gridWidth / 2), y: targetRoom.gridHeight - 2 };
      break;
    case 'south':
      state.playerPosition = { x: Math.floor(targetRoom.gridWidth / 2), y: 1 };
      break;
    case 'east':
      state.playerPosition = { x: 1, y: Math.floor(targetRoom.gridHeight / 2) };
      break;
    case 'west':
      state.playerPosition = { x: targetRoom.gridWidth - 2, y: Math.floor(targetRoom.gridHeight / 2) };
      break;
  }

  return Ok(state);
}

/**
 * Open a treasure chest
 */
export function openTreasureChest(
  state: DungeonState,
  chestId: string
): Result<{ state: DungeonState; contents: ChestContents }, string> {
  const currentRoom = state.rooms.get(state.currentRoomId);
  
  if (!currentRoom) {
    return Err('Current room not found');
  }

  const chest = currentRoom.treasures?.find(t => t.id === chestId);
  
  if (!chest) {
    return Err('Chest not found in current room');
  }

  if (chest.isOpened) {
    return Err('Chest is already opened');
  }

  // Check if player is near chest
  const distance = Math.abs(chest.position.x - state.playerPosition.x) + 
                   Math.abs(chest.position.y - state.playerPosition.y);
  
  if (distance > 1) {
    return Err('Too far from chest');
  }

  // Open chest
  chest.isOpened = true;

  return Ok({
    state,
    contents: chest.contents
  });
}

/**
 * Solve a puzzle
 */
export function solvePuzzle(
  state: DungeonState,
  puzzleId: string
): Result<DungeonState, string> {
  const currentRoom = state.rooms.get(state.currentRoomId);
  
  if (!currentRoom) {
    return Err('Current room not found');
  }

  const puzzle = currentRoom.puzzles?.find(p => p.id === puzzleId);
  
  if (!puzzle) {
    return Err('Puzzle not found in current room');
  }

  if (puzzle.isSolved) {
    return Err('Puzzle already solved');
  }

  // Mark puzzle as solved
  puzzle.isSolved = true;

  // Apply puzzle reward
  if (puzzle.reward) {
    if (puzzle.reward.opensConnection) {
      // Open a door
      const connection = currentRoom.connections.find(
        c => `${c.direction}_door` === puzzle.reward!.opensConnection
      );
      if (connection) {
        connection.isOpen = true;
      }
    }

    if (puzzle.reward.revealsChest) {
      // Reveal a hidden chest (implementation specific)
      const chest = currentRoom.treasures?.find(t => t.id === puzzle.reward!.revealsChest);
      if (chest) {
        // Mark chest as visible/accessible
      }
    }
  }

  return Ok(state);
}

/**
 * Collect a key
 */
export function collectKey(
  state: DungeonState,
  keyId: string
): DungeonState {
  state.keysCollected.add(keyId);
  return state;
}

/**
 * Activate a switch
 */
export function activateSwitch(
  state: DungeonState,
  switchId: string
): Result<DungeonState, string> {
  const currentRoom = state.rooms.get(state.currentRoomId);
  
  if (!currentRoom) {
    return Err('Current room not found');
  }

  state.switchesActivated.add(switchId);

  // Open all switch-type doors in this room
  currentRoom.connections.forEach(connection => {
    if (connection.doorType === 'switch') {
      connection.isOpen = true;
    }
  });

  return Ok(state);
}

/**
 * Get current room
 */
export function getCurrentRoom(
  state: DungeonState
): Result<DungeonRoom, string> {
  const room = state.rooms.get(state.currentRoomId);
  
  if (!room) {
    return Err('Current room not found');
  }

  return Ok(room);
}

/**
 * Check if dungeon is complete
 */
export function isDungeonComplete(
  state: DungeonState
): boolean {
  const currentRoom = state.rooms.get(state.currentRoomId);
  return currentRoom?.type === 'exit' || false;
}

/**
 * Get explored rooms count
 */
export function getExploredRoomsCount(
  state: DungeonState
): { explored: number; total: number } {
  const total = state.rooms.size;
  const explored = Array.from(state.rooms.values()).filter(r => r.explored).length;
  
  return { explored, total };
}
