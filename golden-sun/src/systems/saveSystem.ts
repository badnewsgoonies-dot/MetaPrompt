/**
 * Save System for Golden Sun Vale Village
 * Handles saving/loading game state to localStorage
 */

import {
  SaveFile,
  SaveSlot,
  SAVE_VERSION,
  NPCState
} from '../types/save';
import { Result, Ok, Err } from '../utils/result';

// LocalStorage keys
const SAVE_KEY_PREFIX = 'golden-sun-save';
const AUTOSAVE_KEY = 'golden-sun-autosave';

/**
 * Get save slot key for localStorage
 */
function getSaveSlotKey(slotId: number): string {
  return `${SAVE_KEY_PREFIX}-slot-${slotId}`;
}

/**
 * Save game to localStorage slot
 */
export function saveGame(
  saveFile: SaveFile,
  slotId: number = 1
): Result<void, string> {
  try {
    // Validate slot ID
    if (slotId < 1 || slotId > 3) {
      return Err('Invalid save slot: must be 1-3');
    }

    // Update timestamp
    const updatedSave: SaveFile = {
      ...saveFile,
      timestamp: Date.now(),
      version: SAVE_VERSION
    };

    // Convert Map to object for JSON serialization
    const serializedSave = {
      ...updatedSave,
      world: {
        ...updatedSave.world,
        npcStates: Object.fromEntries(updatedSave.world.npcStates)
      }
    };

    // Save to localStorage
    const key = getSaveSlotKey(slotId);
    localStorage.setItem(key, JSON.stringify(serializedSave));

    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to save game: ${error}`);
  }
}

/**
 * Load game from localStorage slot
 */
export function loadGame(slotId: number = 1): Result<SaveFile, string> {
  try {
    // Validate slot ID
    if (slotId < 1 || slotId > 3) {
      return Err('Invalid save slot: must be 1-3');
    }

    // Load from localStorage
    const key = getSaveSlotKey(slotId);
    const savedData = localStorage.getItem(key);

    if (!savedData) {
      return Err('No save file found in this slot');
    }

    // Parse save file
    const parsed = JSON.parse(savedData);

    // Reconstruct Map from object
    const saveFile: SaveFile = {
      ...parsed,
      world: {
        ...parsed.world,
        npcStates: new Map(Object.entries(parsed.world.npcStates))
      }
    };

    // Validate version
    if (saveFile.version !== SAVE_VERSION) {
      // In future, handle migration here
      return Err(`Incompatible save version: ${saveFile.version}`);
    }

    return Ok(saveFile);
  } catch (error) {
    return Err(`Failed to load game: ${error}`);
  }
}

/**
 * Delete save file from slot
 */
export function deleteSave(slotId: number): Result<void, string> {
  try {
    if (slotId < 1 || slotId > 3) {
      return Err('Invalid save slot: must be 1-3');
    }

    const key = getSaveSlotKey(slotId);
    localStorage.removeItem(key);

    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to delete save: ${error}`);
  }
}

/**
 * Check if save slot has data
 */
export function hasSaveData(slotId: number): boolean {
  try {
    if (slotId < 1 || slotId > 3) {
      return false;
    }

    const key = getSaveSlotKey(slotId);
    return localStorage.getItem(key) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Get all save slots info
 */
export function getAllSaveSlots(): SaveSlot[] {
  const slots: SaveSlot[] = [];

  for (let i = 1; i <= 3; i++) {
    const exists = hasSaveData(i);
    
    if (exists) {
      const result = loadGame(i);
      if (result.ok) {
        slots.push({
          id: i,
          exists: true,
          saveFile: result.value
        });
      } else {
        slots.push({
          id: i,
          exists: false // Treat corrupted save as non-existent
        });
      }
    } else {
      slots.push({
        id: i,
        exists: false
      });
    }
  }

  return slots;
}

/**
 * Auto-save game (separate from manual saves)
 */
export function autoSave(saveFile: SaveFile): Result<void, string> {
  try {
    const updatedSave: SaveFile = {
      ...saveFile,
      timestamp: Date.now(),
      version: SAVE_VERSION
    };

    const serializedSave = {
      ...updatedSave,
      world: {
        ...updatedSave.world,
        npcStates: Object.fromEntries(updatedSave.world.npcStates)
      }
    };

    localStorage.setItem(AUTOSAVE_KEY, JSON.stringify(serializedSave));

    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to auto-save: ${error}`);
  }
}

/**
 * Load auto-save
 */
export function loadAutoSave(): Result<SaveFile, string> {
  try {
    const savedData = localStorage.getItem(AUTOSAVE_KEY);

    if (!savedData) {
      return Err('No auto-save found');
    }

    const parsed = JSON.parse(savedData);

    const saveFile: SaveFile = {
      ...parsed,
      world: {
        ...parsed.world,
        npcStates: new Map(Object.entries(parsed.world.npcStates))
      }
    };

    if (saveFile.version !== SAVE_VERSION) {
      return Err(`Incompatible auto-save version: ${saveFile.version}`);
    }

    return Ok(saveFile);
  } catch (error) {
    return Err(`Failed to load auto-save: ${error}`);
  }
}

/**
 * Check if auto-save exists
 */
export function hasAutoSave(): boolean {
  try {
    return localStorage.getItem(AUTOSAVE_KEY) !== null;
  } catch (error) {
    return false;
  }
}

/**
 * Clear all saves (for testing or reset)
 */
export function clearAllSaves(): Result<void, string> {
  try {
    // Clear all slots
    for (let i = 1; i <= 3; i++) {
      const key = getSaveSlotKey(i);
      localStorage.removeItem(key);
    }

    // Clear auto-save
    localStorage.removeItem(AUTOSAVE_KEY);

    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to clear saves: ${error}`);
  }
}

/**
 * Export save as JSON string (for backup)
 */
export function exportSave(slotId: number): Result<string, string> {
  const result = loadGame(slotId);
  if (!result.ok) {
    return Err(result.error);
  }

  try {
    const serialized = {
      ...result.value,
      world: {
        ...result.value.world,
        npcStates: Object.fromEntries(result.value.world.npcStates)
      }
    };

    return Ok(JSON.stringify(serialized, null, 2));
  } catch (error) {
    return Err(`Failed to export save: ${error}`);
  }
}

/**
 * Import save from JSON string
 */
export function importSave(jsonString: string, slotId: number): Result<void, string> {
  try {
    const parsed = JSON.parse(jsonString);

    const saveFile: SaveFile = {
      ...parsed,
      world: {
        ...parsed.world,
        npcStates: new Map(Object.entries(parsed.world.npcStates))
      }
    };

    return saveGame(saveFile, slotId);
  } catch (error) {
    return Err(`Failed to import save: ${error}`);
  }
}

/**
 * Get most recent save slot
 */
export function getMostRecentSave(): Result<{ slotId: number; saveFile: SaveFile }, string> {
  const slots = getAllSaveSlots();
  
  let mostRecent: { slotId: number; saveFile: SaveFile } | null = null;
  let latestTimestamp = 0;

  for (const slot of slots) {
    if (slot.exists && slot.saveFile && slot.saveFile.timestamp > latestTimestamp) {
      mostRecent = { slotId: slot.id, saveFile: slot.saveFile };
      latestTimestamp = slot.saveFile.timestamp;
    }
  }

  if (!mostRecent) {
    return Err('No save files found');
  }

  return Ok(mostRecent);
}

/**
 * Create new save file with default values
 */
export function createNewSave(playerName: string = 'Isaac'): SaveFile {
  return {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    playTime: 0,
    player: {
      name: playerName,
      position: { x: 240, y: 160 }, // Vale village starting position
      facing: 'down',
      health: 17, // Starting HP
      maxHealth: 17,
      psynergyPoints: 7, // Starting PP
      maxPsynergyPoints: 7,
      level: 1,
      experience: 0,
      coins: 200 // Starting coins
    },
    inventory: {
      items: [],
      maxSlots: 30
    },
    world: {
      currentScene: 'vale-village',
      npcStates: new Map(),
      completedEvents: [],
      unlockedLocations: ['vale-village']
    }
  };
}

/**
 * Update NPC state in save file
 */
export function updateNPCState(
  saveFile: SaveFile,
  npcId: string,
  state: Partial<NPCState>
): SaveFile {
  const currentState = saveFile.world.npcStates.get(npcId) || {
    hasBeenTalkedTo: false,
    dialogueIndex: 0,
    visible: true
  };

  const updatedState: NPCState = {
    ...currentState,
    ...state
  };

  const updatedNPCStates = new Map(saveFile.world.npcStates);
  updatedNPCStates.set(npcId, updatedState);

  return {
    ...saveFile,
    world: {
      ...saveFile.world,
      npcStates: updatedNPCStates
    }
  };
}

/**
 * Mark event as completed
 */
export function completeEvent(saveFile: SaveFile, eventId: string): SaveFile {
  if (saveFile.world.completedEvents.includes(eventId)) {
    return saveFile;
  }

  return {
    ...saveFile,
    world: {
      ...saveFile.world,
      completedEvents: [...saveFile.world.completedEvents, eventId]
    }
  };
}

/**
 * Check if event is completed
 */
export function isEventCompleted(saveFile: SaveFile, eventId: string): boolean {
  return saveFile.world.completedEvents.includes(eventId);
}

/**
 * Update play time
 */
export function updatePlayTime(saveFile: SaveFile, deltaSeconds: number): SaveFile {
  return {
    ...saveFile,
    playTime: saveFile.playTime + deltaSeconds
  };
}
