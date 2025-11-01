/**
 * Save System Types for Golden Sun Vale Village
 */

import { NPCPosition } from './npc';

// Save file version for migration compatibility
export const SAVE_VERSION = 1;

// Player save data
export interface PlayerSaveData {
  name: string;
  position: NPCPosition;
  facing: 'up' | 'down' | 'left' | 'right';
  health: number;
  maxHealth: number;
  psynergyPoints: number;
  maxPsynergyPoints: number;
  level: number;
  experience: number;
  coins: number;
}

// Inventory save data
export interface InventorySaveData {
  items: SavedItem[];
  maxSlots: number;
}

// Individual item in inventory
export interface SavedItem {
  id: string;
  quantity: number;
}

// World state (NPCs talked to, events completed, etc.)
export interface WorldSaveData {
  currentScene: string; // Scene ID (e.g., 'vale-village', 'isaac-house')
  npcStates: Map<string, NPCState>; // NPC ID -> state
  completedEvents: string[]; // Event IDs completed
  unlockedLocations: string[]; // Location IDs unlocked
}

// NPC state tracking
export interface NPCState {
  hasBeenTalkedTo: boolean;
  dialogueIndex: number; // Which dialogue sequence they're on
  visible: boolean;
}

// Complete save file
export interface SaveFile {
  version: number;
  timestamp: number; // When save was created
  playTime: number; // Total play time in seconds
  player: PlayerSaveData;
  inventory: InventorySaveData;
  world: WorldSaveData;
}

// Save slot (for multiple saves)
export interface SaveSlot {
  id: number; // 1-3
  exists: boolean;
  saveFile?: SaveFile;
}

// Save result
export interface SaveResult {
  success: boolean;
  error?: string;
}

// Load result
export interface LoadResult {
  success: boolean;
  saveFile?: SaveFile;
  error?: string;
}
