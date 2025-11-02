/**
 * Movement System for Golden Sun Vale Village
 * Handles 8-directional player movement, collision detection, and camera following
 */

import { NPCPosition } from '../types/npc';
import { Result, Ok, Err } from '../utils/result';
import { circleCollision } from '../utils/collision';

// Movement constants
export const MOVEMENT_SPEED = 120; // pixels per second (4 pixels per frame at 30 FPS)
export const DIAGONAL_FACTOR = 0.707; // 1/sqrt(2) for normalized diagonal movement
export const PLAYER_COLLISION_RADIUS = 12; // pixels
export const NPC_COLLISION_RADIUS = 12; // pixels
export const BUILDING_COLLISION_PADDING = 8; // extra padding for building collision

// Scene constants - EXPANDED for full authentic Vale
export const SCENE_WIDTH = 1920; // Total scene width (expanded 2x for full Vale)
export const SCENE_HEIGHT = 1280; // Total scene height (expanded 2x for full Vale)
export const VIEWPORT_WIDTH = 480; // Visible viewport width (GBA 2×)
export const VIEWPORT_HEIGHT = 320; // Visible viewport height

// 8-directional input
export interface MovementInput {
  up: boolean;
  down: boolean;
  left: boolean;
  right: boolean;
}

// Player state for movement
export interface PlayerMovement {
  position: NPCPosition;
  velocity: { dx: number; dy: number };
  facing: 'up' | 'down' | 'left' | 'right';
}

// Camera state
export interface Camera {
  position: NPCPosition;
  target: NPCPosition;
  smoothing: number; // 0-1, higher = smoother (slower to catch up)
}

// Collision obstacle (buildings, scenery, etc.)
export interface CollisionObstacle {
  id: string;
  position: NPCPosition;
  width: number;
  height: number;
  type: 'building' | 'scenery' | 'boundary';
}

// Scene bounds
export interface SceneBounds {
  minX: number;
  minY: number;
  maxX: number;
  maxY: number;
}

/**
 * Calculate velocity from 8-directional input
 * Handles diagonal movement normalization
 */
export function calculateVelocity(input: MovementInput): { dx: number; dy: number } {
  let dx = 0;
  let dy = 0;

  if (input.right) dx += 1;
  if (input.left) dx -= 1;
  if (input.down) dy += 1;
  if (input.up) dy -= 1;

  // If moving diagonally, normalize to prevent faster diagonal movement
  if (dx !== 0 && dy !== 0) {
    dx *= DIAGONAL_FACTOR;
    dy *= DIAGONAL_FACTOR;
  }

  // Scale by movement speed
  return {
    dx: dx * MOVEMENT_SPEED,
    dy: dy * MOVEMENT_SPEED
  };
}

/**
 * Determine facing direction from input
 * Priority: vertical > horizontal (Golden Sun style)
 */
export function calculateFacing(input: MovementInput, currentFacing: 'up' | 'down' | 'left' | 'right'): 'up' | 'down' | 'left' | 'right' {
  // Prioritize vertical direction
  if (input.up) return 'up';
  if (input.down) return 'down';
  if (input.left) return 'left';
  if (input.right) return 'right';
  
  // No input, keep current facing
  return currentFacing;
}

/**
 * Check collision with circular obstacles (NPCs)
 */
export function checkNPCCollision(
  newPosition: NPCPosition,
  npcPositions: NPCPosition[]
): boolean {
  for (const npcPos of npcPositions) {
    if (circleCollision(newPosition, PLAYER_COLLISION_RADIUS, npcPos, NPC_COLLISION_RADIUS)) {
      return true; // Collision detected
    }
  }
  return false;
}

/**
 * Check collision with rectangular obstacles (buildings, scenery)
 */
export function checkObstacleCollision(
  newPosition: NPCPosition,
  obstacles: CollisionObstacle[]
): boolean {
  const playerLeft = newPosition.x - PLAYER_COLLISION_RADIUS;
  const playerRight = newPosition.x + PLAYER_COLLISION_RADIUS;
  const playerTop = newPosition.y - PLAYER_COLLISION_RADIUS;
  const playerBottom = newPosition.y + PLAYER_COLLISION_RADIUS;

  for (const obstacle of obstacles) {
    const obstacleLeft = obstacle.position.x - BUILDING_COLLISION_PADDING;
    const obstacleRight = obstacle.position.x + obstacle.width + BUILDING_COLLISION_PADDING;
    const obstacleTop = obstacle.position.y - BUILDING_COLLISION_PADDING;
    const obstacleBottom = obstacle.position.y + obstacle.height + BUILDING_COLLISION_PADDING;

    // AABB collision detection
    if (
      playerRight > obstacleLeft &&
      playerLeft < obstacleRight &&
      playerBottom > obstacleTop &&
      playerTop < obstacleBottom
    ) {
      return true; // Collision detected
    }
  }
  return false;
}

/**
 * Check if position is within scene bounds
 */
export function checkBoundsCollision(
  position: NPCPosition,
  bounds: SceneBounds
): boolean {
  return (
    position.x - PLAYER_COLLISION_RADIUS < bounds.minX ||
    position.x + PLAYER_COLLISION_RADIUS > bounds.maxX ||
    position.y - PLAYER_COLLISION_RADIUS < bounds.minY ||
    position.y + PLAYER_COLLISION_RADIUS > bounds.maxY
  );
}

/**
 * Get NPCs within collision check radius (optimization for large scenes)
 * Only checks NPCs within a certain distance to improve performance
 */
export function getNearbyNPCsForCollision(
  playerPos: NPCPosition,
  allNPCs: NPCPosition[],
  checkRadius: number = 200 // Only check NPCs within 200px
): NPCPosition[] {
  return allNPCs.filter(npc => {
    const dx = npc.x - playerPos.x;
    const dy = npc.y - playerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= checkRadius;
  });
}

/**
 * Update player position with collision detection
 * Returns new position or original if collision detected
 */
export function updatePlayerMovement(
  player: PlayerMovement,
  input: MovementInput,
  deltaTime: number,
  npcPositions: NPCPosition[],
  obstacles: CollisionObstacle[],
  bounds: SceneBounds
): Result<PlayerMovement, string> {
  try {
    // Calculate velocity from input
    const velocity = calculateVelocity(input);

    // Calculate facing direction
    const facing = calculateFacing(input, player.facing);

    // If not moving, just update facing
    if (velocity.dx === 0 && velocity.dy === 0) {
      return Ok({
        ...player,
        velocity,
        facing
      });
    }

    // Calculate new position
    const newPosition: NPCPosition = {
      x: player.position.x + velocity.dx * (deltaTime / 1000),
      y: player.position.y + velocity.dy * (deltaTime / 1000)
    };

    // Check collisions
    if (checkBoundsCollision(newPosition, bounds)) {
      // Clamp to bounds
      newPosition.x = Math.max(
        bounds.minX + PLAYER_COLLISION_RADIUS,
        Math.min(newPosition.x, bounds.maxX - PLAYER_COLLISION_RADIUS)
      );
      newPosition.y = Math.max(
        bounds.minY + PLAYER_COLLISION_RADIUS,
        Math.min(newPosition.y, bounds.maxY - PLAYER_COLLISION_RADIUS)
      );
    }

    if (checkNPCCollision(newPosition, npcPositions)) {
      // Collision with NPC, keep original position
      return Ok({
        ...player,
        velocity: { dx: 0, dy: 0 },
        facing
      });
    }

    if (checkObstacleCollision(newPosition, obstacles)) {
      // Collision with obstacle, keep original position
      return Ok({
        ...player,
        velocity: { dx: 0, dy: 0 },
        facing
      });
    }

    // No collision, update position
    return Ok({
      position: newPosition,
      velocity,
      facing
    });
  } catch (error) {
    return Err(`Movement update failed: ${error}`);
  }
}

/**
 * Update camera to follow player with smooth lerp
 * Camera keeps player centered unless near edge of scene
 */
export function updateCamera(
  camera: Camera,
  playerPosition: NPCPosition,
  deltaTime: number
): Camera {
  // Calculate target camera position (centered on player)
  const targetX = playerPosition.x - VIEWPORT_WIDTH / 2;
  const targetY = playerPosition.y - VIEWPORT_HEIGHT / 2;

  // Clamp camera to scene bounds
  const minCameraX = 0;
  const minCameraY = 0;
  const maxCameraX = SCENE_WIDTH - VIEWPORT_WIDTH;
  const maxCameraY = SCENE_HEIGHT - VIEWPORT_HEIGHT;

  const clampedTargetX = Math.max(minCameraX, Math.min(targetX, maxCameraX));
  const clampedTargetY = Math.max(minCameraY, Math.min(targetY, maxCameraY));

  // Lerp camera position for smooth following
  const lerpFactor = 1 - Math.pow(camera.smoothing, deltaTime / 16.666); // 60 FPS baseline
  const newX = camera.position.x + (clampedTargetX - camera.position.x) * lerpFactor;
  const newY = camera.position.y + (clampedTargetY - camera.position.y) * lerpFactor;

  return {
    position: { x: newX, y: newY },
    target: { x: clampedTargetX, y: clampedTargetY },
    smoothing: camera.smoothing
  };
}

/**
 * Create initial camera centered on player
 */
export function createCamera(playerPosition: NPCPosition, smoothing: number = 0.15): Camera {
  const cameraX = Math.max(
    0,
    Math.min(playerPosition.x - VIEWPORT_WIDTH / 2, SCENE_WIDTH - VIEWPORT_WIDTH)
  );
  const cameraY = Math.max(
    0,
    Math.min(playerPosition.y - VIEWPORT_HEIGHT / 2, SCENE_HEIGHT - VIEWPORT_HEIGHT)
  );

  return {
    position: { x: cameraX, y: cameraY },
    target: { x: cameraX, y: cameraY },
    smoothing
  };
}

/**
 * Create default scene bounds for Vale village
 */
export function createSceneBounds(): SceneBounds {
  return {
    minX: 0,
    minY: 0,
    maxX: SCENE_WIDTH,
    maxY: SCENE_HEIGHT
  };
}

/**
 * Check if player is moving (has non-zero velocity)
 */
export function isPlayerMoving(player: PlayerMovement): boolean {
  return player.velocity.dx !== 0 || player.velocity.dy !== 0;
}

/**
 * Get player position in screen coordinates (relative to camera)
 */
export function getScreenPosition(
  worldPosition: NPCPosition,
  camera: Camera
): NPCPosition {
  return {
    x: worldPosition.x - camera.position.x,
    y: worldPosition.y - camera.position.y
  };
}

/**
 * Get world position from screen coordinates
 */
export function getWorldPosition(
  screenPosition: NPCPosition,
  camera: Camera
): NPCPosition {
  return {
    x: screenPosition.x + camera.position.x,
    y: screenPosition.y + camera.position.y
  };
}
