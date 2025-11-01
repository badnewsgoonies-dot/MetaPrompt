/**
 * Scene System Types for Golden Sun Vale Village
 * Handles scene management, transitions, and building interiors
 */

import { NPCPosition } from './npc';
import { CollisionObstacle } from '../systems/movementSystem';
import { Position } from './common';

// World map location (for expansion content)
export interface Location {
  id: string;
  name: string;
  type: 'town' | 'dungeon' | 'landmark' | 'poi';
  description: string;
  gridWidth: number;
  gridHeight: number;
  spawnPoint: Position;
  musicId: string;
  connections: {
    north?: string;
    south?: string;
    east?: string;
    west?: string;
  };
}

// NPC for world map/new locations (expansion content)
export interface NPC {
  id: string;
  name: string;
  spriteId: string;
  position: Position;
  facing: 'up' | 'down' | 'left' | 'right';
  dialogues: NPCDialogue[];
  canMove: boolean;
  movementPattern?: 'wander' | 'patrol' | 'static';
  interactionRadius: number;
}

export interface NPCDialogue {
  id: string;
  text: string;
  conditions?: {
    flags?: string[];
    items?: string[];
  };
  choices?: DialogueChoice[];
  actions?: DialogueAction[];
  nextDialogueId?: string;
  action?: any; // For shops, quests, etc
}

export interface DialogueChoice {
  text: string;
  action?: any;
  nextDialogueId?: string;
}

export interface DialogueAction {
  type: 'giveItem' | 'giveCoins' | 'setFlag' | 'inn' | 'shop';
  itemId?: string;
  quantity?: number;
  amount?: number;
  cost?: number;
  shopId?: string;
  shopType?: string;
  inventory?: any[];
}

// Scene types
export type SceneType = 'overworld' | 'interior' | 'dungeon' | 'menu';

// Scene ID
export type SceneId = 
  | 'vale-village'
  // Existing interiors
  | 'isaac-house'
  | 'item-shop'
  | 'armor-shop'
  | 'inn'
  | 'elder-house'
  | 'garet-house'
  | 'kraden-study'
  // NEW: Task 2 buildings
  | 'sanctum-entrance'
  | 'jenna-house'
  | 'villager-house-1'
  | 'villager-house-2'
  | 'blacksmith-shop'
  | 'villager-house-3'
  | 'villager-house-4'
  | 'villager-house-5'
  | 'villager-house-6'
  | 'farmhouse'
  | 'villager-house-7'
  | 'villager-house-8';

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
  previous?: SceneId | undefined;
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
