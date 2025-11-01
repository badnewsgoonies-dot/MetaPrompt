/**
 * Main game engine - orchestrates all systems
 */

import { GameState } from '../types/game';
import { DEFAULT_PLAYER_STATS } from '../types/player';
import { SeededRNG } from '../utils/rng';
import { Result } from '../utils/result';

import { generateDungeon, getCurrentRoom, clearRoom, unlockRoomDoors, lockRoomDoors, moveToRoom } from './roomSystem';
import { createPlayer, updatePlayerPosition, isPlayerAlive, resetPlayerPosition } from './playerSystem';
import { spawnEnemiesInRoom, updateEnemy, canEnemyShoot, getShootDirection, updateLastActionTime } from './enemySystem';
import { updateProjectile, removeInvalidProjectiles, createEnemyProjectile } from './projectileSystem';
import { processCombat, checkItemCollection } from './combatSystem';
import { collectItem, removeCollectedItems, spawnRandomItem } from './itemSystem';

/**
 * Initialize a new game
 */
export function initializeGame(seed: number = Date.now()): Result<GameState, string> {
  const rng = new SeededRNG(seed);

  // Generate dungeon
  const dungeonResult = generateDungeon(rng);
  if (!dungeonResult.ok) {
    return dungeonResult;
  }

  const dungeon = dungeonResult.value;

  // Find start room (center of grid)
  const startRoom = dungeon.rooms.find(r => r.type === 'start');
  if (!startRoom) {
    return {
      ok: false,
      error: 'No start room found in dungeon'
    };
  }

  // Create player
  const player = createPlayer(DEFAULT_PLAYER_STATS);

  return {
    ok: true,
    value: {
      phase: 'playing',
      time: 0,
      seed,
      dungeon,
      currentRoomId: startRoom.id,
      player,
      enemies: [],
      projectiles: [],
      items: [],
      score: 0
    }
  };
}

/**
 * Main game update loop
 */
export function updateGame(
  state: GameState,
  deltaTime: number
): Result<GameState, string> {
  if (state.phase !== 'playing') {
    return { ok: true, value: state };
  }

  const rng = new SeededRNG(state.seed + state.time);

  let updatedState = {
    ...state,
    time: state.time + deltaTime
  };

  // Update player position
  updatedState = {
    ...updatedState,
    player: updatePlayerPosition(updatedState.player, deltaTime)
  };

  // Update enemies
  updatedState = {
    ...updatedState,
    enemies: updatedState.enemies.map(enemy =>
      updateEnemy(enemy, updatedState.player, deltaTime, updatedState.time, rng)
    )
  };

  // Enemy shooting
  const newEnemyProjectiles = [];
  for (const enemy of updatedState.enemies) {
    if (canEnemyShoot(enemy, updatedState.time)) {
      const direction = getShootDirection(enemy, updatedState.player);
      newEnemyProjectiles.push(createEnemyProjectile(enemy, direction));

      // Update enemy's last action time
      const enemyIndex = updatedState.enemies.findIndex(e => e.id === enemy.id);
      if (enemyIndex >= 0) {
        const enemies = [...updatedState.enemies];
        enemies[enemyIndex] = updateLastActionTime(enemy, updatedState.time);
        updatedState = { ...updatedState, enemies };
      }
    }
  }

  // Add new enemy projectiles
  updatedState = {
    ...updatedState,
    projectiles: [...updatedState.projectiles, ...newEnemyProjectiles]
  };

  // Update projectiles
  updatedState = {
    ...updatedState,
    projectiles: updatedState.projectiles.map(p =>
      updateProjectile(p, deltaTime)
    )
  };

  // Remove invalid projectiles
  updatedState = {
    ...updatedState,
    projectiles: removeInvalidProjectiles(updatedState.projectiles)
  };

  // Process combat
  const combatResult = processCombat(
    updatedState.player,
    updatedState.enemies,
    updatedState.projectiles,
    updatedState.score
  );

  if (!combatResult.ok) {
    return combatResult;
  }

  updatedState = {
    ...updatedState,
    player: combatResult.value.player,
    enemies: combatResult.value.enemies,
    projectiles: combatResult.value.projectiles,
    score: combatResult.value.score
  };

  // Check item collection
  for (const item of updatedState.items) {
    if (item.collected) continue;

    if (checkItemCollection(
      updatedState.player.position,
      updatedState.player.size,
      item.position
    )) {
      const collectionResult = collectItem(updatedState.player, item);
      if (collectionResult.ok) {
        updatedState = {
          ...updatedState,
          player: collectionResult.value.player,
          items: updatedState.items.map(i =>
            i.id === item.id ? collectionResult.value.item : i
          )
        };
      }
    }
  }

  // Remove collected items
  updatedState = {
    ...updatedState,
    items: removeCollectedItems(updatedState.items)
  };

  // Check if room is cleared
  const currentRoomResult = getCurrentRoom(updatedState.dungeon, updatedState.currentRoomId);
  if (currentRoomResult.ok) {
    const currentRoom = currentRoomResult.value;

    if (!currentRoom.cleared && updatedState.enemies.length === 0) {
      // Room cleared!
      const clearResult = clearRoom(updatedState.dungeon, updatedState.currentRoomId);
      if (clearResult.ok) {
        updatedState = {
          ...updatedState,
          dungeon: clearResult.value
        };

        // Unlock doors
        const unlockResult = unlockRoomDoors(updatedState.dungeon, updatedState.currentRoomId);
        if (unlockResult.ok) {
          updatedState = {
            ...updatedState,
            dungeon: unlockResult.value
          };
        }

        // Spawn item if treasure room
        if (currentRoom.type === 'treasure') {
          const item = spawnRandomItem(rng);
          updatedState = {
            ...updatedState,
            items: [...updatedState.items, item]
          };
        }
      }
    }
  }

  // Check game over conditions
  if (!isPlayerAlive(updatedState.player)) {
    updatedState = {
      ...updatedState,
      phase: 'defeat'
    };
  }

  // Check victory (all rooms cleared)
  const allRoomsCleared = updatedState.dungeon.rooms.every(r => r.cleared);
  if (allRoomsCleared) {
    updatedState = {
      ...updatedState,
      phase: 'victory'
    };
  }

  return {
    ok: true,
    value: updatedState
  };
}

/**
 * Enter a new room
 */
export function enterRoom(
  state: GameState,
  newRoomId: string
): Result<GameState, string> {
  const rng = new SeededRNG(state.seed + state.time);

  // Get new room
  const roomResult = getCurrentRoom(state.dungeon, newRoomId);
  if (!roomResult.ok) {
    return roomResult;
  }

  const room = roomResult.value;

  // Reset player position to center
  const player = resetPlayerPosition(state.player);

  // Spawn enemies if room not cleared
  const enemies = (!room.cleared && room.type !== 'start')
    ? spawnEnemiesInRoom(room.type === 'boss' ? 5 : rng.nextInt(3, 7), rng)
    : [];

  // Spawn item if treasure room and not visited
  let items = [...state.items];
  if (room.type === 'treasure' && !room.visited) {
    items.push(spawnRandomItem(rng));
  }

  // Lock doors if enemies present
  let dungeon = state.dungeon;
  if (enemies.length > 0) {
    const lockResult = lockRoomDoors(dungeon, newRoomId);
    if (lockResult.ok) {
      dungeon = lockResult.value;
    }
  }

  // Mark room as visited
  const roomIndex = dungeon.rooms.findIndex(r => r.id === newRoomId);
  if (roomIndex >= 0) {
    const rooms = [...dungeon.rooms];
    const currentRoom = rooms[roomIndex];
    if (currentRoom) {
      rooms[roomIndex] = { ...currentRoom, visited: true };
      dungeon = { ...dungeon, rooms };
    }
  }

  return {
    ok: true,
    value: {
      ...state,
      currentRoomId: newRoomId,
      player,
      enemies,
      projectiles: [],  // Clear projectiles on room transition
      items,
      dungeon
    }
  };
}

/**
 * Attempt to move to adjacent room
 */
export function tryMoveToAdjacentRoom(
  state: GameState,
  direction: 'north' | 'south' | 'east' | 'west'
): Result<GameState, string> {
  const moveResult = moveToRoom(state.dungeon, state.currentRoomId, direction);
  if (!moveResult.ok) {
    return moveResult;
  }

  return enterRoom(state, moveResult.value);
}

/**
 * Pause/unpause game
 */
export function togglePause(state: GameState): GameState {
  if (state.phase === 'playing') {
    return { ...state, phase: 'paused' };
  } else if (state.phase === 'paused') {
    return { ...state, phase: 'playing' };
  }
  return state;
}
