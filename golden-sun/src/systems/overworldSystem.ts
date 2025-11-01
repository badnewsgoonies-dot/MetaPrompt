/**
 * Overworld System for Golden Sun Vale Village
 * Handles scene management, transitions, and door interactions
 */

import {
  Scene,
  SceneId,
  SceneDoor,
  ActiveScene,
  TransitionType,
  SceneRegistry
} from '../types/scene';
import { NPCPosition } from '../types/npc';
import { Result, Ok, Err } from '../utils/result';
import { CollisionObstacle } from './movementSystem';

// Transition timing constants
export const FADE_DURATION = 300; // ms for fade transitions
export const SLIDE_DURATION = 500; // ms for slide transitions

/**
 * Create a new scene registry
 */
export function createSceneRegistry(): SceneRegistry {
  return {
    scenes: new Map(),
    currentSceneId: 'vale-village'
  };
}

/**
 * Register a scene in the registry
 */
export function registerScene(
  registry: SceneRegistry,
  scene: Scene
): Result<SceneRegistry, string> {
  if (registry.scenes.has(scene.id)) {
    return Err(`Scene already registered: ${scene.id}`);
  }

  const updatedScenes = new Map(registry.scenes);
  updatedScenes.set(scene.id, scene);

  return Ok({
    ...registry,
    scenes: updatedScenes
  });
}

/**
 * Get current scene from registry
 */
export function getCurrentScene(registry: SceneRegistry): Result<Scene, string> {
  const scene = registry.scenes.get(registry.currentSceneId);
  if (!scene) {
    return Err(`Current scene not found: ${registry.currentSceneId}`);
  }
  return Ok(scene);
}

/**
 * Get scene by ID
 */
export function getScene(registry: SceneRegistry, sceneId: SceneId): Result<Scene, string> {
  const scene = registry.scenes.get(sceneId);
  if (!scene) {
    return Err(`Scene not found: ${sceneId}`);
  }
  return Ok(scene);
}

/**
 * Create initial active scene
 */
export function createActiveScene(scene: Scene): ActiveScene {
  return {
    current: scene,
    transitionState: {
      type: 'instant',
      phase: 'idle',
      progress: 1
    }
  };
}

/**
 * Check if player is near a door
 */
export function checkDoorProximity(
  playerPos: NPCPosition,
  door: SceneDoor,
  proximityRadius: number = 16
): boolean {
  const doorCenterX = door.position.x + door.width / 2;
  const doorCenterY = door.position.y + door.height / 2;

  const dx = playerPos.x - doorCenterX;
  const dy = playerPos.y - doorCenterY;
  const distance = Math.sqrt(dx * dx + dy * dy);

  return distance <= proximityRadius;
}

/**
 * Find nearest door to player
 */
export function findNearestDoor(
  playerPos: NPCPosition,
  scene: Scene,
  maxDistance: number = 32
): SceneDoor | null {
  let nearest: SceneDoor | null = null;
  let nearestDistance = maxDistance;

  for (const door of scene.doors) {
    const doorCenterX = door.position.x + door.width / 2;
    const doorCenterY = door.position.y + door.height / 2;

    const dx = playerPos.x - doorCenterX;
    const dy = playerPos.y - doorCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance < nearestDistance) {
      nearest = door;
      nearestDistance = distance;
    }
  }

  return nearest;
}

/**
 * Check if door can be entered
 */
export function canEnterDoor(door: SceneDoor, playerInventory?: string[]): Result<void, string> {
  if (door.locked) {
    if (!door.keyRequired) {
      return Err('Door is locked');
    }

    if (!playerInventory || !playerInventory.includes(door.keyRequired)) {
      return Err(`Requires ${door.keyRequired} to unlock`);
    }
  }

  return Ok(undefined);
}

/**
 * Start scene transition
 */
export function startSceneTransition(
  activeScene: ActiveScene,
  targetSceneId: SceneId,
  targetPosition: NPCPosition,
  transitionType: TransitionType = 'fade'
): ActiveScene {
  return {
    ...activeScene,
    transitionState: {
      type: transitionType,
      phase: 'fade-out',
      progress: 0,
      targetScene: targetSceneId,
      targetPosition
    }
  };
}

/**
 * Update transition progress
 */
export function updateTransition(
  activeScene: ActiveScene,
  deltaTime: number
): ActiveScene {
  const { transitionState } = activeScene;

  if (transitionState.phase === 'idle') {
    return activeScene;
  }

  const duration = transitionState.type === 'fade' ? FADE_DURATION : SLIDE_DURATION;
  const progressDelta = deltaTime / duration;
  const newProgress = Math.min(1, transitionState.progress + progressDelta);

  // Determine next phase based on current phase and progress
  let newPhase = transitionState.phase;
  
  if (transitionState.phase === 'fade-out' && newProgress >= 1) {
    newPhase = 'loading';
  } else if (transitionState.phase === 'loading') {
    newPhase = 'fade-in';
  } else if (transitionState.phase === 'fade-in' && newProgress >= 1) {
    // TypeScript workaround: explicitly narrow phase type
    return {
      ...activeScene,
      transitionState: {
        ...transitionState,
        phase: 'idle',
        progress: 1
      }
    };
  }

  return {
    ...activeScene,
    transitionState: {
      ...transitionState,
      phase: newPhase,
      progress: newPhase === 'loading' ? 0 : newProgress
    }
  };
}

/**
 * Complete scene transition (load new scene)
 */
export function completeTransition(
  activeScene: ActiveScene,
  registry: SceneRegistry
): Result<{ activeScene: ActiveScene; registry: SceneRegistry }, string> {
  if (!activeScene.transitionState.targetScene) {
    return Err('No target scene specified');
  }

  const sceneResult = getScene(registry, activeScene.transitionState.targetScene);
  if (!sceneResult.ok) {
    return Err(sceneResult.error);
  }

  const newScene = sceneResult.value;

  return Ok({
    activeScene: {
      current: newScene,
      previous: activeScene.current.id,
      transitionState: {
        type: activeScene.transitionState.type,
        phase: 'fade-in',
        progress: 0
      }
    },
    registry: {
      ...registry,
      currentSceneId: newScene.id
    }
  });
}

/**
 * Check if transition is in progress
 */
export function isTransitioning(activeScene: ActiveScene): boolean {
  return activeScene.transitionState.phase !== 'idle';
}

/**
 * Get transition opacity (for rendering)
 */
export function getTransitionOpacity(activeScene: ActiveScene): number {
  const { phase, progress } = activeScene.transitionState;

  switch (phase) {
    case 'fade-out':
      return progress; // 0 → 1 (transparent → black)
    case 'loading':
      return 1; // Fully black
    case 'fade-in':
      return 1 - progress; // 1 → 0 (black → transparent)
    case 'idle':
    default:
      return 0; // Transparent
  }
}

/**
 * Enter door (start transition to target scene)
 */
export function enterDoor(
  activeScene: ActiveScene,
  door: SceneDoor,
  playerInventory?: string[]
): Result<ActiveScene, string> {
  // Check if door can be entered
  const canEnterResult = canEnterDoor(door, playerInventory);
  if (!canEnterResult.ok) {
    return Err(canEnterResult.error);
  }

  // Start transition
  return Ok(startSceneTransition(
    activeScene,
    door.targetScene,
    door.targetPosition,
    'fade'
  ));
}

/**
 * Create Vale Village scene (main overworld)
 */
export function createValeVillageScene(): Scene {
  return {
    id: 'vale-village',
    name: 'Vale Village',
    type: 'overworld',
    width: 960,
    height: 640,
    doors: [
      {
        id: 'isaac-house-entrance',
        position: { x: 200, y: 250 },
        width: 32,
        height: 8,
        targetScene: 'isaac-house',
        targetPosition: { x: 240, y: 280 },
        requiresInteraction: true,
        locked: false
      },
      {
        id: 'item-shop-entrance',
        position: { x: 450, y: 200 },
        width: 32,
        height: 8,
        targetScene: 'item-shop',
        targetPosition: { x: 240, y: 280 },
        requiresInteraction: true,
        locked: false
      },
      {
        id: 'armor-shop-entrance',
        position: { x: 650, y: 300 },
        width: 32,
        height: 8,
        targetScene: 'armor-shop',
        targetPosition: { x: 240, y: 280 },
        requiresInteraction: true,
        locked: false
      }
    ],
    obstacles: [
      // Buildings (placeholder sizes)
      { id: 'isaac-house', position: { x: 180, y: 200 }, width: 80, height: 60, type: 'building' },
      { id: 'item-shop', position: { x: 430, y: 150 }, width: 80, height: 60, type: 'building' },
      { id: 'armor-shop', position: { x: 630, y: 250 }, width: 80, height: 60, type: 'building' }
    ],
    npcIds: ['garet', 'dora', 'ivan', 'mia', 'shopkeeper', 'elder'],
    spawnPosition: { x: 480, y: 320 },
    cameraMode: 'follow'
  };
}

/**
 * Create interior scene template
 */
export function createInteriorScene(
  id: SceneId,
  name: string,
  exitDoorPosition: NPCPosition = { x: 240, y: 300 }
): Scene {
  return {
    id,
    name,
    type: 'interior',
    width: 480,
    height: 320,
    doors: [
      {
        id: 'exit',
        position: exitDoorPosition,
        width: 32,
        height: 8,
        targetScene: 'vale-village',
        targetPosition: { x: 480, y: 320 }, // Will be overridden by entry door
        requiresInteraction: true,
        locked: false
      }
    ],
    obstacles: [],
    npcIds: [],
    spawnPosition: { x: 240, y: 280 },
    cameraMode: 'fixed'
  };
}

/**
 * Get all obstacles in current scene (including door collision zones)
 */
export function getSceneObstacles(scene: Scene): CollisionObstacle[] {
  return scene.obstacles;
}

/**
 * Check if position is inside any door trigger zone
 */
export function isInDoorZone(playerPos: NPCPosition, door: SceneDoor): boolean {
  return (
    playerPos.x >= door.position.x &&
    playerPos.x <= door.position.x + door.width &&
    playerPos.y >= door.position.y &&
    playerPos.y <= door.position.y + door.height
  );
}

/**
 * Find door at player position (auto-trigger zones)
 */
export function findDoorAtPosition(
  playerPos: NPCPosition,
  scene: Scene
): SceneDoor | null {
  for (const door of scene.doors) {
    if (!door.requiresInteraction && isInDoorZone(playerPos, door)) {
      return door;
    }
  }
  return null;
}
