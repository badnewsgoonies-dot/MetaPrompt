import { describe, it, expect } from 'vitest';
import { initializeGame, updateGame, tryMoveToAdjacentRoom, enterRoom } from '../src/systems/gameEngine';
import { setPlayerVelocity, updatePlayerPosition } from '../src/systems/playerSystem';
import { placeBomb } from '../src/systems/bombSystem';
import { collectPickup } from '../src/systems/pickupSystem';
import { getCurrentRoom } from '../src/systems/roomSystem';
import { Pickup } from '../src/types/pickup';

describe('Integration Tests - Actual Gameplay', () => {
  describe('Room Transitions', () => {
    it('should allow player to move between rooms', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      let state = initResult.value;
      const startRoomId = state.currentRoomId;

      // Get current room to check available doors
      const roomResult = getCurrentRoom(state.dungeon, state.currentRoomId);
      expect(roomResult.ok).toBe(true);
      if (!roomResult.ok) return;

      const room = roomResult.value;
      expect(room.doors.length).toBeGreaterThan(0);

      // Try to move to first available door
      const firstDoor = room.doors[0];
      if (!firstDoor) return;

      const moveResult = tryMoveToAdjacentRoom(state, firstDoor.direction);
      expect(moveResult.ok).toBe(true);
      if (!moveResult.ok) return;

      state = moveResult.value;

      // Verify we're in a different room
      expect(state.currentRoomId).not.toBe(startRoomId);

      // Verify player spawned at edge corresponding to door entered
      // (position should not be in center anymore)
      expect(state.player.position.x === 400 || state.player.position.x === 80 || state.player.position.x === 720).toBe(true);
      expect(state.player.position.y === 300 || state.player.position.y === 80 || state.player.position.y === 520).toBe(true);
    });

    it('should spawn enemies when entering normal rooms', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      let state = initResult.value;

      // Move to a normal room (try north)
      const roomResult = getCurrentRoom(state.dungeon, state.currentRoomId);
      if (!roomResult.ok) return;

      const northDoor = roomResult.value.doors.find(d => d.direction === 'north');
      if (!northDoor) return;

      const moveResult = tryMoveToAdjacentRoom(state, 'north');
      if (!moveResult.ok) return;

      state = moveResult.value;
      const newRoomResult = getCurrentRoom(state.dungeon, state.currentRoomId);
      if (!newRoomResult.ok) return;

      const newRoom = newRoomResult.value;

      // Normal rooms should have enemies (unless it's treasure/shop)
      if (newRoom.type === 'normal') {
        expect(state.enemies.length).toBeGreaterThan(0);
      }
    });

    it('should lock doors when enemies are present', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      let state = initResult.value;

      // Move to a room with enemies
      const roomResult = getCurrentRoom(state.dungeon, state.currentRoomId);
      if (!roomResult.ok) return;

      const door = roomResult.value.doors[0];
      if (!door) return;

      const moveResult = tryMoveToAdjacentRoom(state, door.direction);
      if (!moveResult.ok) return;

      state = moveResult.value;

      // If room has enemies, doors should be locked
      if (state.enemies.length > 0) {
        const newRoomResult = getCurrentRoom(state.dungeon, state.currentRoomId);
        if (!newRoomResult.ok) return;

        const newRoom = newRoomResult.value;
        const hasLockedDoors = newRoom.doors.some(d => d.locked);
        expect(hasLockedDoors).toBe(true);
      }
    });
  });

  describe('Starting Resources', () => {
    it('should start player with keys, bombs, and coins', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      const state = initResult.value;

      // Player should have starting resources
      expect(state.player.resources.keys).toBeGreaterThan(0);
      expect(state.player.resources.bombs).toBeGreaterThan(0);
      expect(state.player.resources.coins).toBeGreaterThan(0);
    });
  });

  describe('Bomb Mechanics', () => {
    it('should allow player to place bombs when they have bombs', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      const state = initResult.value;
      const initialBombs = state.player.resources.bombs;

      // Place a bomb
      const bombResult = placeBomb(state.player, state.time);
      expect(bombResult.ok).toBe(true);
      if (!bombResult.ok) return;

      // Verify bomb count decreased
      expect(bombResult.value.player.resources.bombs).toBe(initialBombs - 1);

      // Verify bomb was created
      expect(bombResult.value.bomb).toBeDefined();
      expect(bombResult.value.bomb.position).toEqual(state.player.position);
    });

    it('should not allow bomb placement when no bombs available', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      let state = initResult.value;

      // Set bombs to 0
      state = {
        ...state,
        player: {
          ...state.player,
          resources: {
            ...state.player.resources,
            bombs: 0
          }
        }
      };

      // Try to place bomb
      const bombResult = placeBomb(state.player, state.time);
      expect(bombResult.ok).toBe(false);
      if (bombResult.ok) return;

      expect(bombResult.error).toContain('No bombs available');
    });
  });

  describe('Pickup Collection', () => {
    it('should collect hearts and increase player health', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      let state = initResult.value;

      // Damage player first
      state = {
        ...state,
        player: {
          ...state.player,
          stats: {
            ...state.player.stats,
            currentHealth: 4  // Down from 6
          }
        }
      };

      const pickup: Pickup = {
        id: 'test_heart',
        type: 'heart',
        position: { x: 400, y: 300 },
        collected: false
      };

      const collectResult = collectPickup(state.player, pickup);
      expect(collectResult.ok).toBe(true);
      if (!collectResult.ok) return;

      // Health should increase by 2 (one full heart)
      expect(collectResult.value.player.stats.currentHealth).toBe(6);
      expect(collectResult.value.pickup.collected).toBe(true);
    });

    it('should collect keys and increase key count', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      const state = initResult.value;
      const initialKeys = state.player.resources.keys;

      const pickup: Pickup = {
        id: 'test_key',
        type: 'key',
        position: { x: 400, y: 300 },
        collected: false
      };

      const collectResult = collectPickup(state.player, pickup);
      expect(collectResult.ok).toBe(true);
      if (!collectResult.ok) return;

      expect(collectResult.value.player.resources.keys).toBe(initialKeys + 1);
      expect(collectResult.value.pickup.collected).toBe(true);
    });

    it('should collect bombs and increase bomb count', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      const state = initResult.value;
      const initialBombs = state.player.resources.bombs;

      const pickup: Pickup = {
        id: 'test_bomb',
        type: 'bomb',
        position: { x: 400, y: 300 },
        collected: false
      };

      const collectResult = collectPickup(state.player, pickup);
      expect(collectResult.ok).toBe(true);
      if (!collectResult.ok) return;

      expect(collectResult.value.player.resources.bombs).toBe(initialBombs + 1);
    });

    it('should collect coins and increase coin count', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      const state = initResult.value;
      const initialCoins = state.player.resources.coins;

      const pickup: Pickup = {
        id: 'test_coin',
        type: 'coin',
        position: { x: 400, y: 300 },
        collected: false
      };

      const collectResult = collectPickup(state.player, pickup);
      expect(collectResult.ok).toBe(true);
      if (!collectResult.ok) return;

      expect(collectResult.value.player.resources.coins).toBe(initialCoins + 1);
    });
  });

  describe('Player Movement Bounds', () => {
    it('should allow player to reach door trigger zones', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      let state = initResult.value;

      // Move player to top edge (north door zone: y < 80)
      let player = {
        ...state.player,
        position: { x: 400, y: 300 },
        velocity: { dx: 0, dy: -200 }  // Move up
      };

      // Update position multiple times to move north
      for (let i = 0; i < 100; i++) {
        player = updatePlayerPosition(player, 16.666);
      }

      // Player should be able to reach y < 80 (clamped to minimum ~66)
      expect(player.position.y).toBeLessThan(80);

      // Move player to right edge (east door zone: x > 720)
      player = {
        ...state.player,
        position: { x: 400, y: 300 },
        velocity: { dx: 200, dy: 0 }  // Move right
      };

      for (let i = 0; i < 100; i++) {
        player = updatePlayerPosition(player, 16.666);
      }

      // Player should be able to reach x > 720 (clamped to maximum ~734)
      expect(player.position.x).toBeGreaterThan(720);
    });
  });

  describe('Game Loop', () => {
    it('should update game state over time', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      let state = initResult.value;
      const initialTime = state.time;

      // Update game for one frame
      const updateResult = updateGame(state, 16.666);
      expect(updateResult.ok).toBe(true);
      if (!updateResult.ok) return;

      state = updateResult.value;

      // Time should have advanced
      expect(state.time).toBeGreaterThan(initialTime);
    });

    it('should not update when paused', () => {
      const initResult = initializeGame(12345);
      expect(initResult.ok).toBe(true);
      if (!initResult.ok) return;

      let state = {
        ...initResult.value,
        phase: 'paused' as const
      };

      const updateResult = updateGame(state, 16.666);
      expect(updateResult.ok).toBe(true);
      if (!updateResult.ok) return;

      // Time should not advance when paused
      expect(updateResult.value.time).toBe(0);
    });
  });
});
