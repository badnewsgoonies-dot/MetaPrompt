import { describe, it, expect, beforeEach } from 'vitest';
import {
  saveGame,
  loadGame,
  deleteSave,
  hasSaveData,
  getAllSaveSlots,
  autoSave,
  loadAutoSave,
  hasAutoSave,
  clearAllSaves,
  exportSave,
  importSave,
  getMostRecentSave,
  createNewSave,
  updateNPCState,
  completeEvent,
  isEventCompleted,
  updatePlayTime
} from '../src/systems/saveSystem';
import { SaveFile, SAVE_VERSION } from '../src/types/save';

describe('saveSystem', () => {
  // Clear localStorage before each test
  beforeEach(() => {
    localStorage.clear();
  });

  const mockSaveFile: SaveFile = {
    version: SAVE_VERSION,
    timestamp: Date.now(),
    playTime: 3600, // 1 hour
    player: {
      name: 'Isaac',
      position: { x: 480, y: 320 },
      facing: 'down',
      health: 17,
      maxHealth: 17,
      psynergyPoints: 7,
      maxPsynergyPoints: 7,
      level: 1,
      experience: 0,
      coins: 200
    },
    inventory: {
      items: [
        { id: 'herb', quantity: 3 },
        { id: 'nut', quantity: 2 }
      ],
      maxSlots: 30
    },
    world: {
      currentScene: 'vale-village',
      npcStates: new Map([
        ['garet', { hasBeenTalkedTo: true, dialogueIndex: 1, visible: true }],
        ['dora', { hasBeenTalkedTo: false, dialogueIndex: 0, visible: true }]
      ]),
      completedEvents: ['prologue', 'talk-to-garet'],
      unlockedLocations: ['vale-village', 'isaac-house']
    }
  };

  describe('saveGame', () => {
    it('should save game to slot 1', () => {
      const result = saveGame(mockSaveFile, 1);
      
      expect(result.ok).toBe(true);
      expect(hasSaveData(1)).toBe(true);
    });

    it('should save game to slot 2', () => {
      const result = saveGame(mockSaveFile, 2);
      
      expect(result.ok).toBe(true);
      expect(hasSaveData(2)).toBe(true);
    });

    it('should save game to slot 3', () => {
      const result = saveGame(mockSaveFile, 3);
      
      expect(result.ok).toBe(true);
      expect(hasSaveData(3)).toBe(true);
    });

    it('should return error for invalid slot ID (0)', () => {
      const result = saveGame(mockSaveFile, 0);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid save slot');
      }
    });

    it('should return error for invalid slot ID (4)', () => {
      const result = saveGame(mockSaveFile, 4);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid save slot');
      }
    });

    it('should update timestamp when saving', () => {
      const oldTimestamp = mockSaveFile.timestamp;
      
      // Wait a tiny bit to ensure timestamp changes
      const result = saveGame(mockSaveFile, 1);
      expect(result.ok).toBe(true);
      
      const loadResult = loadGame(1);
      expect(loadResult.ok).toBe(true);
      
      if (loadResult.ok) {
        expect(loadResult.value.timestamp).toBeGreaterThanOrEqual(oldTimestamp);
      }
    });

    it('should overwrite existing save in same slot', () => {
      saveGame(mockSaveFile, 1);
      
      const modifiedSave: SaveFile = {
        ...mockSaveFile,
        player: {
          ...mockSaveFile.player,
          coins: 500
        }
      };
      
      saveGame(modifiedSave, 1);
      
      const loadResult = loadGame(1);
      expect(loadResult.ok).toBe(true);
      
      if (loadResult.ok) {
        expect(loadResult.value.player.coins).toBe(500);
      }
    });
  });

  describe('loadGame', () => {
    it('should load saved game', () => {
      saveGame(mockSaveFile, 1);
      const result = loadGame(1);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.player.name).toBe('Isaac');
        expect(result.value.player.coins).toBe(200);
        expect(result.value.inventory.items.length).toBe(2);
      }
    });

    it('should return error when no save exists', () => {
      const result = loadGame(1);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('No save file found');
      }
    });

    it('should return error for invalid slot ID', () => {
      const result = loadGame(5);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid save slot');
      }
    });

    it('should reconstruct NPC states Map correctly', () => {
      saveGame(mockSaveFile, 1);
      const result = loadGame(1);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.world.npcStates instanceof Map).toBe(true);
        expect(result.value.world.npcStates.size).toBe(2);
        expect(result.value.world.npcStates.get('garet')?.hasBeenTalkedTo).toBe(true);
      }
    });
  });

  describe('deleteSave', () => {
    it('should delete save from slot', () => {
      saveGame(mockSaveFile, 1);
      expect(hasSaveData(1)).toBe(true);
      
      const result = deleteSave(1);
      expect(result.ok).toBe(true);
      expect(hasSaveData(1)).toBe(false);
    });

    it('should return success even if slot is empty', () => {
      const result = deleteSave(1);
      expect(result.ok).toBe(true);
    });

    it('should return error for invalid slot ID', () => {
      const result = deleteSave(0);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid save slot');
      }
    });

    it('should only delete specified slot', () => {
      saveGame(mockSaveFile, 1);
      saveGame(mockSaveFile, 2);
      
      deleteSave(1);
      
      expect(hasSaveData(1)).toBe(false);
      expect(hasSaveData(2)).toBe(true);
    });
  });

  describe('hasSaveData', () => {
    it('should return true when save exists', () => {
      saveGame(mockSaveFile, 1);
      expect(hasSaveData(1)).toBe(true);
    });

    it('should return false when no save exists', () => {
      expect(hasSaveData(1)).toBe(false);
    });

    it('should return false for invalid slot ID', () => {
      expect(hasSaveData(0)).toBe(false);
      expect(hasSaveData(4)).toBe(false);
    });
  });

  describe('getAllSaveSlots', () => {
    it('should return empty slots when no saves', () => {
      const slots = getAllSaveSlots();
      
      expect(slots.length).toBe(3);
      expect(slots.every(slot => !slot.exists)).toBe(true);
    });

    it('should return info for all slots with saves', () => {
      saveGame(mockSaveFile, 1);
      saveGame(mockSaveFile, 3);
      
      const slots = getAllSaveSlots();
      
      expect(slots.length).toBe(3);
      expect(slots[0].exists).toBe(true);
      expect(slots[1].exists).toBe(false);
      expect(slots[2].exists).toBe(true);
    });

    it('should include save file data for valid saves', () => {
      saveGame(mockSaveFile, 1);
      
      const slots = getAllSaveSlots();
      
      expect(slots[0].saveFile).toBeDefined();
      expect(slots[0].saveFile?.player.name).toBe('Isaac');
    });
  });

  describe('autoSave', () => {
    it('should save to auto-save slot', () => {
      const result = autoSave(mockSaveFile);
      
      expect(result.ok).toBe(true);
      expect(hasAutoSave()).toBe(true);
    });

    it('should not affect manual save slots', () => {
      saveGame(mockSaveFile, 1);
      autoSave(mockSaveFile);
      
      expect(hasSaveData(1)).toBe(true);
      expect(hasAutoSave()).toBe(true);
    });
  });

  describe('loadAutoSave', () => {
    it('should load auto-save', () => {
      autoSave(mockSaveFile);
      const result = loadAutoSave();
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.player.name).toBe('Isaac');
      }
    });

    it('should return error when no auto-save exists', () => {
      const result = loadAutoSave();
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('No auto-save found');
      }
    });
  });

  describe('hasAutoSave', () => {
    it('should return true when auto-save exists', () => {
      autoSave(mockSaveFile);
      expect(hasAutoSave()).toBe(true);
    });

    it('should return false when no auto-save exists', () => {
      expect(hasAutoSave()).toBe(false);
    });
  });

  describe('clearAllSaves', () => {
    it('should clear all manual saves', () => {
      saveGame(mockSaveFile, 1);
      saveGame(mockSaveFile, 2);
      saveGame(mockSaveFile, 3);
      
      clearAllSaves();
      
      expect(hasSaveData(1)).toBe(false);
      expect(hasSaveData(2)).toBe(false);
      expect(hasSaveData(3)).toBe(false);
    });

    it('should clear auto-save', () => {
      autoSave(mockSaveFile);
      
      clearAllSaves();
      
      expect(hasAutoSave()).toBe(false);
    });
  });

  describe('exportSave', () => {
    it('should export save as JSON string', () => {
      saveGame(mockSaveFile, 1);
      const result = exportSave(1);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(typeof result.value).toBe('string');
        const parsed = JSON.parse(result.value);
        expect(parsed.player.name).toBe('Isaac');
      }
    });

    it('should return error when no save exists', () => {
      const result = exportSave(1);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('No save file found');
      }
    });
  });

  describe('importSave', () => {
    it('should import save from JSON string', () => {
      const json = JSON.stringify({
        ...mockSaveFile,
        world: {
          ...mockSaveFile.world,
          npcStates: Object.fromEntries(mockSaveFile.world.npcStates)
        }
      });
      
      const result = importSave(json, 1);
      
      expect(result.ok).toBe(true);
      expect(hasSaveData(1)).toBe(true);
    });

    it('should return error for invalid JSON', () => {
      const result = importSave('invalid json', 1);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Failed to import');
      }
    });
  });

  describe('getMostRecentSave', () => {
    it('should return most recent save', async () => {
      saveGame(mockSaveFile, 1);
      
      // Wait 10ms to ensure different timestamp
      await new Promise(resolve => setTimeout(resolve, 10));
      
      saveGame(mockSaveFile, 2);
      
      const result = getMostRecentSave();
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.slotId).toBe(2);
      }
    });

    it('should return error when no saves exist', () => {
      const result = getMostRecentSave();
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('No save files found');
      }
    });
  });

  describe('createNewSave', () => {
    it('should create new save with default values', () => {
      const newSave = createNewSave('Isaac');
      
      expect(newSave.version).toBe(SAVE_VERSION);
      expect(newSave.player.name).toBe('Isaac');
      expect(newSave.player.level).toBe(1);
      expect(newSave.player.coins).toBe(200);
      expect(newSave.inventory.items.length).toBe(0);
      expect(newSave.world.completedEvents.length).toBe(0);
    });

    it('should use default name if not provided', () => {
      const newSave = createNewSave();
      expect(newSave.player.name).toBe('Isaac');
    });
  });

  describe('updateNPCState', () => {
    it('should update existing NPC state', () => {
      const updated = updateNPCState(mockSaveFile, 'garet', { hasBeenTalkedTo: false });
      
      expect(updated.world.npcStates.get('garet')?.hasBeenTalkedTo).toBe(false);
      // Other properties preserved
      expect(updated.world.npcStates.get('garet')?.dialogueIndex).toBe(1);
    });

    it('should create new NPC state if not exists', () => {
      const updated = updateNPCState(mockSaveFile, 'ivan', { hasBeenTalkedTo: true });
      
      expect(updated.world.npcStates.get('ivan')).toBeDefined();
      expect(updated.world.npcStates.get('ivan')?.hasBeenTalkedTo).toBe(true);
    });

    it('should not modify original save file', () => {
      updateNPCState(mockSaveFile, 'garet', { hasBeenTalkedTo: false });
      
      expect(mockSaveFile.world.npcStates.get('garet')?.hasBeenTalkedTo).toBe(true);
    });
  });

  describe('completeEvent', () => {
    it('should add event to completed list', () => {
      const updated = completeEvent(mockSaveFile, 'find-lost-djinn');
      
      expect(updated.world.completedEvents).toContain('find-lost-djinn');
    });

    it('should not add duplicate events', () => {
      const updated = completeEvent(mockSaveFile, 'prologue'); // Already completed
      
      const count = updated.world.completedEvents.filter(e => e === 'prologue').length;
      expect(count).toBe(1);
    });

    it('should not modify original save file', () => {
      completeEvent(mockSaveFile, 'new-event');
      
      expect(mockSaveFile.world.completedEvents).not.toContain('new-event');
    });
  });

  describe('isEventCompleted', () => {
    it('should return true for completed event', () => {
      expect(isEventCompleted(mockSaveFile, 'prologue')).toBe(true);
    });

    it('should return false for uncompleted event', () => {
      expect(isEventCompleted(mockSaveFile, 'defeat-saturos')).toBe(false);
    });
  });

  describe('updatePlayTime', () => {
    it('should add delta to play time', () => {
      const updated = updatePlayTime(mockSaveFile, 60); // Add 1 minute
      
      expect(updated.playTime).toBe(3660); // 3600 + 60
    });

    it('should handle fractional seconds', () => {
      const updated = updatePlayTime(mockSaveFile, 0.5);
      
      expect(updated.playTime).toBe(3600.5);
    });

    it('should not modify original save file', () => {
      updatePlayTime(mockSaveFile, 100);
      
      expect(mockSaveFile.playTime).toBe(3600);
    });
  });
});
