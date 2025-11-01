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
import { collectPickup, removeCollectedPickups, spawnRoomClearPickups } from './pickupSystem';
import { generateRoomObstacles, removeDestroyedObstacles } from './obstacleSystem';
import { processBombExplosions } from './bombSystem';

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

  // Create player with starting resources for testing
  const player = {
    ...createPlayer(DEFAULT_PLAYER_STATS),
    resources: {
      keys: 2,       // Start with 2 keys to test locked doors
      bombs: 3,      // Start with 3 bombs to test bomb mechanics
      coins: 5,      // Start with 5 coins
      hasGoldenKey: false
    }
  };

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
      pickups: [],
      obstacles: [],
      bombs: [],
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
    updatedState.score,
    updatedState.time
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

  // Check pickup collection
  for (const pickup of updatedState.pickups) {
    if (pickup.collected) continue;

    if (checkItemCollection(
      updatedState.player.position,
      updatedState.player.size,
      pickup.position
    )) {
      const collectionResult = collectPickup(updatedState.player, pickup);
      if (collectionResult.ok) {
        updatedState = {
          ...updatedState,
          player: collectionResult.value.player,
          pickups: updatedState.pickups.map(p =>
            p.id === pickup.id ? collectionResult.value.pickup : p
          )
        };
      }
    }
  }

  // Process bomb explosions
  const bombResult = processBombExplosions(
    updatedState.bombs,
    updatedState.player,
    updatedState.enemies,
    updatedState.obstacles,
    updatedState.time
  );

  updatedState = {
    ...updatedState,
    player: bombResult.player,
    enemies: bombResult.enemies,
    obstacles: bombResult.obstacles,
    bombs: bombResult.bombs
  };

  // Remove collected items and pickups
  updatedState = {
    ...updatedState,
    items: removeCollectedItems(updatedState.items),
    pickups: removeCollectedPickups(updatedState.pickups),
    obstacles: removeDestroyedObstacles(updatedState.obstacles)
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

        // Spawn pickups when room is cleared
        const roomCenter = { x: 400, y: 300 };
        const pickups = spawnRoomClearPickups(rng, roomCenter);
        updatedState = {
          ...updatedState,
          pickups: [...updatedState.pickups, ...pickups]
        };
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
 * @param fromDirection The direction the player came from (which door they entered through)
 */
export function enterRoom(
  state: GameState,
  newRoomId: string,
  fromDirection?: 'north' | 'south' | 'east' | 'west'
): Result<GameState, string> {
  const rng = new SeededRNG(state.seed + state.time);

  // Get new room
  const roomResult = getCurrentRoom(state.dungeon, newRoomId);
  if (!roomResult.ok) {
    return roomResult;
  }

  const room = roomResult.value;

  // Reset player position based on door direction
  const player = resetPlayerPosition(state.player, fromDirection);

  // Spawn enemies if room not cleared
  const enemies = (!room.cleared && room.type !== 'start' && room.type !== 'treasure' && room.type !== 'shop')
    ? spawnEnemiesInRoom(room.type === 'boss' ? 5 : rng.nextInt(3, 7), rng)
    : [];

  // Spawn item if treasure room and not visited
  let items = [...state.items];
  if (room.type === 'treasure' && !room.visited) {
    items.push(spawnRandomItem(rng));
  }

  // Spawn shop items if shop room
  if (room.type === 'shop' && !room.visited) {
    items.push(spawnRandomItem(rng));
    // Could add more shop items here
  }

  // Generate obstacles for the room
  const obstacles = generateRoomObstacles(rng, room.type);

  // Spawn pickups for rooms
  let pickups = [...state.pickups];
  if (room.type === 'treasure' && !room.visited) {
    // Treasure rooms have guaranteed pickups
    pickups.push(...spawnRoomClearPickups(rng, { x: 400, y: 450 }));
  } else if (room.type === 'normal' && !room.visited && rng.chance(0.6)) {
    // 60% chance for pickups in normal rooms
    pickups.push(...spawnRoomClearPickups(rng, { x: 400, y: 450 }));
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
      pickups,
      obstacles,
      bombs: [],  // Clear bombs on room transition
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

  return enterRoom(state, moveResult.value, direction);
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
