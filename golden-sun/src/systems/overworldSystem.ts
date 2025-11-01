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
 * EXPANDED: Now 1920x1280 (2x original) for full authentic Vale layout
 */
export function createValeVillageScene(): Scene {
  return {
    id: 'vale-village',
    name: 'Vale Village',
    type: 'overworld',
    width: 1920, // Expanded from 960
    height: 1280, // Expanded from 640
    doors: [
      // Existing 3 doors (from Task 1)
      { id: 'isaac-house-entrance', position: { x: 576, y: 460 }, width: 32, height: 8, targetScene: 'isaac-house', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'item-shop-entrance', position: { x: 1336, y: 620 }, width: 32, height: 8, targetScene: 'item-shop', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'armor-shop-entrance', position: { x: 1376, y: 900 }, width: 32, height: 8, targetScene: 'armor-shop', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      // NEW: 11 additional enterable buildings (Task 2)
      { id: 'sanctum-entrance', position: { x: 980, y: 250 }, width: 32, height: 8, targetScene: 'sanctum-entrance', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'jenna-house-entrance', position: { x: 568, y: 750 }, width: 32, height: 8, targetScene: 'jenna-house', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'villager-house-1-entrance', position: { x: 360, y: 660 }, width: 32, height: 8, targetScene: 'villager-house-1', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'villager-house-2-entrance', position: { x: 640, y: 600 }, width: 32, height: 8, targetScene: 'villager-house-2', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'blacksmith-shop-entrance', position: { x: 1148, y: 670 }, width: 32, height: 8, targetScene: 'blacksmith-shop', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'villager-house-3-entrance', position: { x: 1408, y: 470 }, width: 32, height: 8, targetScene: 'villager-house-3', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'villager-house-4-entrance', position: { x: 1560, y: 560 }, width: 32, height: 8, targetScene: 'villager-house-4', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'villager-house-5-entrance', position: { x: 1440, y: 700 }, width: 32, height: 8, targetScene: 'villager-house-5', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'villager-house-6-entrance', position: { x: 248, y: 610 }, width: 32, height: 8, targetScene: 'villager-house-6', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'farmhouse-entrance', position: { x: 208, y: 1010 }, width: 32, height: 8, targetScene: 'farmhouse', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'villager-house-7-entrance', position: { x: 640, y: 1100 }, width: 32, height: 8, targetScene: 'villager-house-7', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false },
      { id: 'villager-house-8-entrance', position: { x: 1240, y: 1120 }, width: 32, height: 8, targetScene: 'villager-house-8', targetPosition: { x: 240, y: 280 }, requiresInteraction: true, locked: false }
    ],
    obstacles: [
      // Existing buildings (from Task 1 - adjusted to match sprite_map.json)
      { id: 'isaac-house', position: { x: 480, y: 320 }, width: 192, height: 160, type: 'building' },
      { id: 'garet-house', position: { x: 400, y: 720 }, width: 192, height: 160, type: 'building' },
      { id: 'elder-house', position: { x: 840, y: 240 }, width: 224, height: 192, type: 'building' },
      { id: 'item-shop', position: { x: 1240, y: 480 }, width: 192, height: 160, type: 'building' },
      { id: 'armor-shop', position: { x: 1280, y: 760 }, width: 192, height: 160, type: 'building' },
      { id: 'inn', position: { x: 1520, y: 560 }, width: 192, height: 160, type: 'building' },
      { id: 'kraden-house', position: { x: 1400, y: 280 }, width: 192, height: 160, type: 'building' },
      // NEW: 21 buildings from Task 2
      // Northern Area
      { id: 'sanctum-entrance', position: { x: 900, y: 120 }, width: 160, height: 140, type: 'building' },
      { id: 'sanctum-guard-post', position: { x: 760, y: 200 }, width: 80, height: 70, type: 'building' },
      { id: 'plaza-pavilion-1', position: { x: 1100, y: 180 }, width: 96, height: 80, type: 'building' },
      // Central Area
      { id: 'jenna-house', position: { x: 520, y: 680 }, width: 96, height: 80, type: 'building' },
      { id: 'villager-house-1', position: { x: 320, y: 600 }, width: 80, height: 70, type: 'building' },
      { id: 'villager-house-2', position: { x: 600, y: 540 }, width: 80, height: 70, type: 'building' },
      { id: 'blacksmith-shop', position: { x: 1100, y: 600 }, width: 96, height: 80, type: 'building' },
      { id: 'well-house', position: { x: 720, y: 620 }, width: 48, height: 48, type: 'building' },
      // Eastern Area
      { id: 'villager-house-3', position: { x: 1360, y: 400 }, width: 96, height: 80, type: 'building' },
      { id: 'villager-house-4', position: { x: 1520, y: 500 }, width: 80, height: 70, type: 'building' },
      { id: 'villager-house-5', position: { x: 1400, y: 640 }, width: 80, height: 70, type: 'building' },
      { id: 'garden-greenhouse', position: { x: 1600, y: 720 }, width: 80, height: 70, type: 'building' },
      { id: 'storage-shed-1', position: { x: 1680, y: 600 }, width: 64, height: 60, type: 'building' },
      // Western Area
      { id: 'villager-house-6', position: { x: 200, y: 540 }, width: 96, height: 80, type: 'building' },
      { id: 'barn', position: { x: 120, y: 720 }, width: 128, height: 110, type: 'building' },
      { id: 'storage-shed-2', position: { x: 280, y: 800 }, width: 64, height: 60, type: 'building' },
      { id: 'farmhouse', position: { x: 160, y: 940 }, width: 96, height: 80, type: 'building' },
      // Southern Area
      { id: 'villager-house-7', position: { x: 600, y: 1040 }, width: 80, height: 70, type: 'building' },
      { id: 'villager-house-8', position: { x: 1200, y: 1060 }, width: 80, height: 70, type: 'building' },
      { id: 'watchtower', position: { x: 880, y: 1140 }, width: 64, height: 100, type: 'building' },
      { id: 'gate-guard-post', position: { x: 1040, y: 1160 }, width: 80, height: 70, type: 'building' },
      // Scenery collision (trees, gate)
      { id: 'tree-nw', position: { x: 240, y: 280 }, width: 32, height: 32, type: 'scenery' },
      { id: 'tree-ne', position: { x: 1680, y: 280 }, width: 32, height: 32, type: 'scenery' },
      { id: 'tree-n1', position: { x: 720, y: 160 }, width: 32, height: 32, type: 'scenery' },
      { id: 'tree-n2', position: { x: 1200, y: 160 }, width: 32, height: 32, type: 'scenery' },
      { id: 'vale-gate', position: { x: 880, y: 1080 }, width: 80, height: 40, type: 'scenery' }
    ],
    npcIds: ['garet', 'dora', 'ivan', 'mia', 'shopkeeper', 'elder'],
    spawnPosition: { x: 960, y: 640 }, // Scaled 2x from (480, 320) - center of new map
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
