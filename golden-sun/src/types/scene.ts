/**
 * Scene System Types for Golden Sun Vale Village
 * Handles scene management, transitions, and building interiors
 */

import { NPCPosition } from './npc';
import { CollisionObstacle } from '../systems/movementSystem';

// Scene types
export type SceneType = 'overworld' | 'interior' | 'dungeon' | 'menu';

// Scene ID
export type SceneId = 
  | 'vale-village'
  | 'isaac-house'
  | 'item-shop'
  | 'armor-shop'
  | 'inn'
  | 'elder-house'
  | 'garet-house'
  | 'kraden-study';

// Scene transition type
export type TransitionType = 'fade' | 'slide' | 'instant';

// Door/entrance to another scene
export interface SceneDoor {
  id: string;
  position: NPCPosition;
  width: number;
  height: number;
  targetScene: SceneId;
  targetPosition: NPCPosition; // Where player spawns in target scene
  requiresInteraction: boolean; // True for doors, false for auto-trigger zones
  locked: boolean;
  keyRequired?: string; // Item ID of key needed
}

// Scene definition
export interface Scene {
  id: SceneId;
  name: string;
  type: SceneType;
  width: number;
  height: number;
  backgroundImage?: string;
  backgroundMusic?: string;
  doors: SceneDoor[];
  obstacles: CollisionObstacle[];
  npcIds: string[]; // Which NPCs are present in this scene
  spawnPosition: NPCPosition; // Default spawn position
  cameraMode: 'follow' | 'fixed' | 'bounded';
}

// Active scene state
export interface ActiveScene {
  current: Scene;
  previous?: SceneId;
  transitionState: SceneTransitionState;
}

// Scene transition state
export interface SceneTransitionState {
  type: TransitionType;
  phase: 'idle' | 'fade-out' | 'loading' | 'fade-in';
  progress: number; // 0-1
  targetScene?: SceneId;
  targetPosition?: NPCPosition;
}

// Scene registry
export interface SceneRegistry {
  scenes: Map<SceneId, Scene>;
  currentSceneId: SceneId;
}
