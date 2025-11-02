import { describe, it, expect } from 'vitest';
import {
  calculateVelocity,
  calculateFacing,
  checkNPCCollision,
  checkObstacleCollision,
  checkBoundsCollision,
  updatePlayerMovement,
  updateCamera,
  createCamera,
  createSceneBounds,
  isPlayerMoving,
  getScreenPosition,
  getWorldPosition,
  MOVEMENT_SPEED,
  DIAGONAL_FACTOR,
  SCENE_WIDTH,
  SCENE_HEIGHT,
  VIEWPORT_WIDTH,
  VIEWPORT_HEIGHT,
  type MovementInput,
  type PlayerMovement,
  type CollisionObstacle,
  type Camera
} from '../src/systems/movementSystem';

describe('movementSystem', () => {
  describe('calculateVelocity', () => {
    it('should return zero velocity when no input', () => {
      const input: MovementInput = { up: false, down: false, left: false, right: false };
      const velocity = calculateVelocity(input);
      
      expect(velocity.dx).toBe(0);
      expect(velocity.dy).toBe(0);
    });

    it('should move right at full speed', () => {
      const input: MovementInput = { up: false, down: false, left: false, right: true };
      const velocity = calculateVelocity(input);
      
      expect(velocity.dx).toBe(MOVEMENT_SPEED);
      expect(velocity.dy).toBe(0);
    });

    it('should move left at full speed', () => {
      const input: MovementInput = { up: false, down: false, left: true, right: false };
      const velocity = calculateVelocity(input);
      
      expect(velocity.dx).toBe(-MOVEMENT_SPEED);
      expect(velocity.dy).toBe(0);
    });

    it('should move up at full speed', () => {
      const input: MovementInput = { up: true, down: false, left: false, right: false };
      const velocity = calculateVelocity(input);
      
      expect(velocity.dx).toBe(0);
      expect(velocity.dy).toBe(-MOVEMENT_SPEED);
    });

    it('should move down at full speed', () => {
      const input: MovementInput = { up: false, down: true, left: false, right: false };
      const velocity = calculateVelocity(input);
      
      expect(velocity.dx).toBe(0);
      expect(velocity.dy).toBe(MOVEMENT_SPEED);
    });

    it('should normalize diagonal movement (up-right)', () => {
      const input: MovementInput = { up: true, down: false, left: false, right: true };
      const velocity = calculateVelocity(input);
      
      const expected = MOVEMENT_SPEED * DIAGONAL_FACTOR;
      expect(velocity.dx).toBeCloseTo(expected, 1);
      expect(velocity.dy).toBeCloseTo(-expected, 1);
    });

    it('should normalize diagonal movement (down-left)', () => {
      const input: MovementInput = { up: false, down: true, left: true, right: false };
      const velocity = calculateVelocity(input);
      
      const expected = MOVEMENT_SPEED * DIAGONAL_FACTOR;
      expect(velocity.dx).toBeCloseTo(-expected, 1);
      expect(velocity.dy).toBeCloseTo(expected, 1);
    });

    it('should cancel opposite directions (up + down = 0)', () => {
      const input: MovementInput = { up: true, down: true, left: false, right: false };
      const velocity = calculateVelocity(input);
      
      expect(velocity.dx).toBe(0);
      expect(velocity.dy).toBe(0);
    });

    it('should cancel opposite directions (left + right = 0)', () => {
      const input: MovementInput = { up: false, down: false, left: true, right: true };
      const velocity = calculateVelocity(input);
      
      expect(velocity.dx).toBe(0);
      expect(velocity.dy).toBe(0);
    });
  });

  describe('calculateFacing', () => {
    it('should prioritize up direction', () => {
      const input: MovementInput = { up: true, down: false, left: true, right: false };
      const facing = calculateFacing(input, 'down');
      
      expect(facing).toBe('up');
    });

    it('should prioritize down direction over horizontal', () => {
      const input: MovementInput = { up: false, down: true, left: true, right: false };
      const facing = calculateFacing(input, 'right');
      
      expect(facing).toBe('down');
    });

    it('should use left when no vertical input', () => {
      const input: MovementInput = { up: false, down: false, left: true, right: false };
      const facing = calculateFacing(input, 'up');
      
      expect(facing).toBe('left');
    });

    it('should use right when no vertical input', () => {
      const input: MovementInput = { up: false, down: false, left: false, right: true };
      const facing = calculateFacing(input, 'down');
      
      expect(facing).toBe('right');
    });

    it('should maintain current facing when no input', () => {
      const input: MovementInput = { up: false, down: false, left: false, right: false };
      const facing = calculateFacing(input, 'left');
      
      expect(facing).toBe('left');
    });
  });

  describe('checkNPCCollision', () => {
    it('should detect collision when touching NPC', () => {
      const playerPos = { x: 100, y: 100 };
      const npcPositions = [{ x: 115, y: 100 }]; // 15px apart (within collision range)
      
      const collision = checkNPCCollision(playerPos, npcPositions);
      expect(collision).toBe(true);
    });

    it('should not detect collision when far from NPC', () => {
      const playerPos = { x: 100, y: 100 };
      const npcPositions = [{ x: 200, y: 200 }]; // Far away
      
      const collision = checkNPCCollision(playerPos, npcPositions);
      expect(collision).toBe(false);
    });

    it('should detect collision with closest NPC in array', () => {
      const playerPos = { x: 100, y: 100 };
      const npcPositions = [
        { x: 200, y: 200 }, // Far
        { x: 115, y: 100 }, // Close (collision)
        { x: 300, y: 300 }  // Far
      ];
      
      const collision = checkNPCCollision(playerPos, npcPositions);
      expect(collision).toBe(true);
    });

    it('should handle empty NPC array', () => {
      const playerPos = { x: 100, y: 100 };
      const npcPositions: { x: number; y: number }[] = [];
      
      const collision = checkNPCCollision(playerPos, npcPositions);
      expect(collision).toBe(false);
    });

    it('should detect collision just inside boundary', () => {
      const playerPos = { x: 100, y: 100 };
      const npcPositions = [{ x: 123, y: 100 }]; // Just inside collision boundary (23px < 24px)
      
      const collision = checkNPCCollision(playerPos, npcPositions);
      expect(collision).toBe(true);
    });

    it('should not detect collision just outside boundary', () => {
      const playerPos = { x: 100, y: 100 };
      const npcPositions = [{ x: 125, y: 100 }]; // Just outside collision boundary (25px > 24px)
      
      const collision = checkNPCCollision(playerPos, npcPositions);
      expect(collision).toBe(false);
    });
  });

  describe('checkObstacleCollision', () => {
    const buildingObstacle: CollisionObstacle = {
      id: 'building-1',
      position: { x: 200, y: 200 },
      width: 64,
      height: 64,
      type: 'building'
    };

    it('should detect collision with building center', () => {
      const playerPos = { x: 232, y: 232 }; // Inside building
      const collision = checkObstacleCollision(playerPos, [buildingObstacle]);
      
      expect(collision).toBe(true);
    });

    it('should not detect collision when far from building', () => {
      const playerPos = { x: 100, y: 100 }; // Outside building
      const collision = checkObstacleCollision(playerPos, [buildingObstacle]);
      
      expect(collision).toBe(false);
    });

    it('should detect collision at building edge', () => {
      const playerPos = { x: 190, y: 232 }; // At left edge (with padding)
      const collision = checkObstacleCollision(playerPos, [buildingObstacle]);
      
      expect(collision).toBe(true);
    });

    it('should handle multiple obstacles', () => {
      const obstacles: CollisionObstacle[] = [
        { id: 'b1', position: { x: 100, y: 100 }, width: 32, height: 32, type: 'building' },
        { id: 'b2', position: { x: 200, y: 200 }, width: 32, height: 32, type: 'scenery' },
        { id: 'b3', position: { x: 300, y: 300 }, width: 32, height: 32, type: 'boundary' }
      ];
      
      const playerPos = { x: 216, y: 216 }; // Colliding with b2
      const collision = checkObstacleCollision(playerPos, obstacles);
      
      expect(collision).toBe(true);
    });

    it('should handle empty obstacle array', () => {
      const playerPos = { x: 100, y: 100 };
      const collision = checkObstacleCollision(playerPos, []);
      
      expect(collision).toBe(false);
    });
  });

  describe('checkBoundsCollision', () => {
    const bounds = {
      minX: 0,
      minY: 0,
      maxX: 960,
      maxY: 640
    };

    it('should detect collision at left boundary', () => {
      const playerPos = { x: 5, y: 320 }; // Near left edge
      const collision = checkBoundsCollision(playerPos, bounds);
      
      expect(collision).toBe(true);
    });

    it('should detect collision at right boundary', () => {
      const playerPos = { x: 955, y: 320 }; // Near right edge
      const collision = checkBoundsCollision(playerPos, bounds);
      
      expect(collision).toBe(true);
    });

    it('should detect collision at top boundary', () => {
      const playerPos = { x: 480, y: 5 }; // Near top edge
      const collision = checkBoundsCollision(playerPos, bounds);
      
      expect(collision).toBe(true);
    });

    it('should detect collision at bottom boundary', () => {
      const playerPos = { x: 480, y: 635 }; // Near bottom edge
      const collision = checkBoundsCollision(playerPos, bounds);
      
      expect(collision).toBe(true);
    });

    it('should not detect collision in center', () => {
      const playerPos = { x: 480, y: 320 }; // Center of scene
      const collision = checkBoundsCollision(playerPos, bounds);
      
      expect(collision).toBe(false);
    });
  });

  describe('updatePlayerMovement', () => {
    const initialPlayer: PlayerMovement = {
      position: { x: 480, y: 320 },
      velocity: { dx: 0, dy: 0 },
      facing: 'down'
    };

    const bounds = createSceneBounds();

    it('should update position when moving right', () => {
      const input: MovementInput = { up: false, down: false, left: false, right: true };
      const result = updatePlayerMovement(initialPlayer, input, 16.666, [], [], bounds);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.position.x).toBeGreaterThan(initialPlayer.position.x);
        expect(result.value.facing).toBe('right');
      }
    });

    it('should update position when moving up', () => {
      const input: MovementInput = { up: true, down: false, left: false, right: false };
      const result = updatePlayerMovement(initialPlayer, input, 16.666, [], [], bounds);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.position.y).toBeLessThan(initialPlayer.position.y);
        expect(result.value.facing).toBe('up');
      }
    });

    it('should not move when colliding with NPC', () => {
      const input: MovementInput = { up: false, down: false, left: false, right: true };
      const npcPositions = [{ x: 492, y: 320 }]; // Directly in front
      
      const result = updatePlayerMovement(initialPlayer, input, 16.666, npcPositions, [], bounds);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.position.x).toBe(initialPlayer.position.x);
        expect(result.value.velocity.dx).toBe(0);
      }
    });

    it('should not move when colliding with obstacle', () => {
      const input: MovementInput = { up: false, down: false, left: false, right: true };
      const obstacles: CollisionObstacle[] = [
        { id: 'wall', position: { x: 490, y: 310 }, width: 32, height: 32, type: 'building' }
      ];
      
      const result = updatePlayerMovement(initialPlayer, input, 16.666, [], obstacles, bounds);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.position.x).toBe(initialPlayer.position.x);
      }
    });

    it('should clamp position to bounds', () => {
      const edgePlayer: PlayerMovement = {
        position: { x: 10, y: 320 },
        velocity: { dx: 0, dy: 0 },
        facing: 'left'
      };
      const input: MovementInput = { up: false, down: false, left: true, right: false };
      
      const result = updatePlayerMovement(edgePlayer, input, 16.666, [], [], bounds);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.position.x).toBeGreaterThanOrEqual(12); // Clamped to min + radius
      }
    });

    it('should keep facing when not moving', () => {
      const input: MovementInput = { up: false, down: false, left: false, right: false };
      const result = updatePlayerMovement(initialPlayer, input, 16.666, [], [], bounds);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.position).toEqual(initialPlayer.position);
        expect(result.value.facing).toBe(initialPlayer.facing);
        expect(result.value.velocity.dx).toBe(0);
        expect(result.value.velocity.dy).toBe(0);
      }
    });
  });

  describe('updateCamera', () => {
    it('should center camera on player when in middle of scene', () => {
      const camera: Camera = {
        position: { x: 240, y: 160 },
        target: { x: 240, y: 160 },
        smoothing: 0
      };
      const playerPos = { x: 480, y: 320 };
      
      const updated = updateCamera(camera, playerPos, 16.666);
      
      expect(updated.position.x).toBeCloseTo(240, 0); // Centered on player
      expect(updated.position.y).toBeCloseTo(160, 0);
    });

    it('should clamp camera at left edge of scene', () => {
      const camera: Camera = {
        position: { x: 50, y: 160 },
        target: { x: 50, y: 160 },
        smoothing: 0
      };
      const playerPos = { x: 100, y: 320 }; // Near left edge
      
      const updated = updateCamera(camera, playerPos, 16.666);
      
      expect(updated.position.x).toBe(0); // Clamped to 0
    });

    it('should clamp camera at right edge of scene', () => {
      const camera: Camera = {
        position: { x: 800, y: 320 },
        target: { x: 800, y: 320 },
        smoothing: 0
      };
      const playerPos = { x: 1800, y: 640 }; // Near right edge (scaled 2x for expanded scene)
      
      const updated = updateCamera(camera, playerPos, 16.666);
      
      const maxX = SCENE_WIDTH - VIEWPORT_WIDTH;
      expect(updated.position.x).toBe(maxX); // Clamped to max
    });

    it('should smooth camera movement with lerp', () => {
      const camera: Camera = {
        position: { x: 100, y: 100 },
        target: { x: 100, y: 100 },
        smoothing: 0.5 // High smoothing
      };
      const playerPos = { x: 480, y: 320 };
      
      const updated = updateCamera(camera, playerPos, 16.666);
      
      // Should move towards target but not reach it immediately
      expect(updated.position.x).toBeGreaterThan(100);
      expect(updated.position.x).toBeLessThan(240); // Target is 240
    });

    it('should move camera instantly with zero smoothing', () => {
      const camera: Camera = {
        position: { x: 100, y: 100 },
        target: { x: 100, y: 100 },
        smoothing: 0
      };
      const playerPos = { x: 480, y: 320 };
      
      const updated = updateCamera(camera, playerPos, 16.666);
      
      // Should reach target immediately
      expect(updated.position.x).toBeCloseTo(240, 0);
      expect(updated.position.y).toBeCloseTo(160, 0);
    });
  });

  describe('createCamera', () => {
    it('should create camera centered on player', () => {
      const playerPos = { x: 480, y: 320 };
      const camera = createCamera(playerPos, 0.15);
      
      expect(camera.position.x).toBe(240); // Centered
      expect(camera.position.y).toBe(160);
      expect(camera.smoothing).toBe(0.15);
    });

    it('should clamp camera at scene edges', () => {
      const playerPos = { x: 100, y: 100 }; // Near top-left corner
      const camera = createCamera(playerPos, 0.15);
      
      expect(camera.position.x).toBe(0); // Clamped to min
      expect(camera.position.y).toBe(0);
    });

    it('should use default smoothing if not provided', () => {
      const playerPos = { x: 480, y: 320 };
      const camera = createCamera(playerPos);
      
      expect(camera.smoothing).toBe(0.15);
    });
  });

  describe('isPlayerMoving', () => {
    it('should return true when player has velocity', () => {
      const player: PlayerMovement = {
        position: { x: 100, y: 100 },
        velocity: { dx: 120, dy: 0 },
        facing: 'right'
      };
      
      expect(isPlayerMoving(player)).toBe(true);
    });

    it('should return false when player has zero velocity', () => {
      const player: PlayerMovement = {
        position: { x: 100, y: 100 },
        velocity: { dx: 0, dy: 0 },
        facing: 'right'
      };
      
      expect(isPlayerMoving(player)).toBe(false);
    });
  });

  describe('getScreenPosition', () => {
    it('should convert world position to screen position', () => {
      const worldPos = { x: 500, y: 400 };
      const camera: Camera = {
        position: { x: 240, y: 160 },
        target: { x: 240, y: 160 },
        smoothing: 0.15
      };
      
      const screenPos = getScreenPosition(worldPos, camera);
      
      expect(screenPos.x).toBe(260); // 500 - 240
      expect(screenPos.y).toBe(240); // 400 - 160
    });
  });

  describe('getWorldPosition', () => {
    it('should convert screen position to world position', () => {
      const screenPos = { x: 100, y: 50 };
      const camera: Camera = {
        position: { x: 240, y: 160 },
        target: { x: 240, y: 160 },
        smoothing: 0.15
      };
      
      const worldPos = getWorldPosition(screenPos, camera);
      
      expect(worldPos.x).toBe(340); // 100 + 240
      expect(worldPos.y).toBe(210); // 50 + 160
    });
  });

  describe('createSceneBounds', () => {
    it('should create default Vale village bounds', () => {
      const bounds = createSceneBounds();
      
      expect(bounds.minX).toBe(0);
      expect(bounds.minY).toBe(0);
      expect(bounds.maxX).toBe(SCENE_WIDTH);
      expect(bounds.maxY).toBe(SCENE_HEIGHT);
    });
  });
});
