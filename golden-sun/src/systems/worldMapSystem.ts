import { Result, Ok, Err } from '../utils/result';
import { Position } from '../types/common';
import { SeededRNG } from '../utils/rng';
import { EncounterState, updateEncounterState } from './encounterSystem';

/**
 * World Map System for Golden Sun
 * Handles overworld navigation, location discovery, and fast travel
 */

export interface WorldMapState {
  playerPosition: Position;
  currentTerrainType: string;
  discoveredLocations: Set<string>;
  unlockedLocations: Set<string>;
  encounterState: EncounterState;
  partyVisible: boolean;
}

export interface WorldLocation {
  id: string;
  name: string;
  position: Position;
  type: 'town' | 'dungeon' | 'landmark' | 'poi';
  discovered: boolean;
  unlocked: boolean;
  unlockFlag?: string;
  description: string;
  levelRange: string;
  sceneId: string;
}

export interface TerrainInfo {
  id: string;
  passable: boolean;
  encounterZone?: string;
  movementSpeed: number;
}

const TERRAIN_TYPES: Record<string, TerrainInfo> = {
  grassland: {
    id: 'grassland',
    passable: true,
    encounterZone: 'vale_grassland',
    movementSpeed: 1.0
  },
  forest: {
    id: 'forest',
    passable: true,
    encounterZone: 'vale_forest',
    movementSpeed: 0.8
  },
  mountain: {
    id: 'mountain',
    passable: false,
    movementSpeed: 0.0
  },
  water: {
    id: 'water',
    passable: false,
    movementSpeed: 0.0
  },
  road: {
    id: 'road',
    passable: true,
    encounterZone: 'eastern_road',
    movementSpeed: 1.2
  },
  bridge: {
    id: 'bridge',
    passable: true,
    movementSpeed: 1.0
  }
};

/**
 * Initialize world map state
 */
export function initializeWorldMap(
  startPosition: Position,
  startTerrain: string,
  encounterState: EncounterState
): WorldMapState {
  return {
    playerPosition: { ...startPosition },
    currentTerrainType: startTerrain,
    discoveredLocations: new Set(['vale']), // Vale starts discovered
    unlockedLocations: new Set(['vale']),
    encounterState,
    partyVisible: true
  };
}

/**
 * Move player on world map
 */
export function movePlayerOnWorldMap(
  state: WorldMapState,
  direction: 'up' | 'down' | 'left' | 'right' | 'up-left' | 'up-right' | 'down-left' | 'down-right',
  getTerrainAt: (pos: Position) => string,
  rng: SeededRNG
): Result<WorldMapState, string> {
  const newPosition = { ...state.playerPosition };

  // Calculate new position based on direction
  switch (direction) {
    case 'up':
      newPosition.y--;
      break;
    case 'down':
      newPosition.y++;
      break;
    case 'left':
      newPosition.x--;
      break;
    case 'right':
      newPosition.x++;
      break;
    case 'up-left':
      newPosition.x--;
      newPosition.y--;
      break;
    case 'up-right':
      newPosition.x++;
      newPosition.y--;
      break;
    case 'down-left':
      newPosition.x--;
      newPosition.y++;
      break;
    case 'down-right':
      newPosition.x++;
      newPosition.y++;
      break;
  }

  // Check terrain at new position
  const terrainType = getTerrainAt(newPosition);
  const terrain = TERRAIN_TYPES[terrainType];

  if (!terrain) {
    return Err(`Invalid terrain type: ${terrainType}`);
  }

  if (!terrain.passable) {
    return Err(`Cannot move: ${terrainType} is not passable`);
  }

  // Update position
  state.playerPosition = newPosition;
  state.currentTerrainType = terrainType;

  // Update encounter state if terrain has encounters
  if (terrain.encounterZone) {
    if (state.encounterState.encounterZone !== terrain.encounterZone) {
      state.encounterState.encounterZone = terrain.encounterZone;
    }
    
    const encounterResult = updateEncounterState(state.encounterState, rng);
    if (!encounterResult.ok) {
      return Err(encounterResult.error);
    }
  }

  return Ok(state);
}

/**
 * Discover a location
 */
export function discoverLocation(
  state: WorldMapState,
  locationId: string
): WorldMapState {
  state.discoveredLocations.add(locationId);
  return state;
}

/**
 * Unlock a location (for story progression)
 */
export function unlockLocation(
  state: WorldMapState,
  locationId: string
): WorldMapState {
  state.unlockedLocations.add(locationId);
  state.discoveredLocations.add(locationId);
  return state;
}

/**
 * Check if player is near a location
 */
export function checkNearbyLocations(
  playerPosition: Position,
  locations: WorldLocation[],
  discoveryRadius: number = 20
): WorldLocation[] {
  return locations.filter(loc => {
    const dx = loc.position.x - playerPosition.x;
    const dy = loc.position.y - playerPosition.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= discoveryRadius;
  });
}

/**
 * Enter a location from world map
 */
export function enterLocation(
  state: WorldMapState,
  locationId: string,
  locations: WorldLocation[]
): Result<string, string> {
  const location = locations.find(l => l.id === locationId);
  
  if (!location) {
    return Err(`Location not found: ${locationId}`);
  }

  if (!location.unlocked) {
    return Err(`Location is locked: ${location.name}`);
  }

  // Hide party sprite when entering location
  state.partyVisible = false;

  return Ok(location.sceneId);
}

/**
 * Exit location back to world map
 */
export function exitToWorldMap(
  state: WorldMapState,
  exitPosition?: Position
): WorldMapState {
  if (exitPosition) {
    state.playerPosition = { ...exitPosition };
  }
  state.partyVisible = true;
  return state;
}

/**
 * Fast travel to discovered town
 */
export function fastTravel(
  state: WorldMapState,
  destinationId: string,
  locations: WorldLocation[]
): Result<WorldMapState, string> {
  const destination = locations.find(l => l.id === destinationId);

  if (!destination) {
    return Err(`Location not found: ${destinationId}`);
  }

  if (!state.discoveredLocations.has(destinationId)) {
    return Err(`Location not discovered: ${destination.name}`);
  }

  if (destination.type !== 'town') {
    return Err('Can only fast travel to towns');
  }

  // Teleport to destination
  state.playerPosition = { ...destination.position };
  state.encounterState.stepsSinceLastBattle = 0;

  return Ok(state);
}

/**
 * Get terrain info at position
 */
export function getTerrainInfo(terrainType: string): Result<TerrainInfo, string> {
  const terrain = TERRAIN_TYPES[terrainType];
  
  if (!terrain) {
    return Err(`Unknown terrain type: ${terrainType}`);
  }

  return Ok(terrain);
}

/**
 * Calculate distance between two positions
 */
export function calculateDistance(pos1: Position, pos2: Position): number {
  const dx = pos2.x - pos1.x;
  const dy = pos2.y - pos1.y;
  return Math.sqrt(dx * dx + dy * dy);
}
