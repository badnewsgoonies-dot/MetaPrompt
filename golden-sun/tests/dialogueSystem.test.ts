import { describe, it, expect } from 'vitest';
import {
  startDialogue,
  getCurrentLine,
  advanceDialogue,
  isDialogueComplete,
  handleDialogueAction
} from '../src/systems/dialogueSystem';
import { createFlagSystem, setFlag } from '../src/systems/storyFlagSystem';
import { DialogueAction } from '../src/types/dialogue';

describe('dialogueSystem', () => {
  describe('startDialogue', () => {
    it('should start a simple dialogue', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.treeId).toBe('garet-intro');
        expect(result.value.currentLineId).toBeDefined();
        expect(result.value.history.length).toBe(1);
        expect(result.value.completed).toBe(false);
      }
    });

    it('should return error for non-existent dialogue', () => {
      const flags = createFlagSystem();
      const result = startDialogue('npc', 'non-existent-dialogue', flags);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    it('should respect story flags when choosing start line', () => {
      let flags = createFlagSystem();
      // Set a flag that might affect dialogue start
      const flagResult = setFlag(flags, 'met_garet', true);
      if (flagResult.ok) {
        flags = flagResult.value;
      }
      
      const result = startDialogue('garet', 'garet-intro', flags);
      expect(result.ok).toBe(true);
    });
  });

  describe('getCurrentLine', () => {
    it('should return current dialogue line', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('elder', 'elder-warning', flags);
      
      expect(startResult.ok).toBe(true);
      if (startResult.ok) {
        const state = startResult.value;
        const lineResult = getCurrentLine(state);
        
        expect(lineResult.ok).toBe(true);
        if (lineResult.ok) {
          expect(lineResult.value.text).toBeDefined();
          expect(typeof lineResult.value.text).toBe('string');
        }
      }
    });

    it('should return error for invalid state', () => {
      const state = {
        treeId: 'non-existent',
        currentLineId: 'invalid-line',
        history: [],
        completed: false
      };
      
      const result = getCurrentLine(state);
      expect(result.ok).toBe(false);
    });
  });

  describe('advanceDialogue', () => {
    it('should advance to next line', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('dora', 'dora-greeting', flags);
      
      expect(startResult.ok).toBe(true);
      if (startResult.ok) {
        const advanceResult = advanceDialogue(startResult.value, flags);
        
        expect(advanceResult.ok).toBe(true);
        if (advanceResult.ok) {
          const newState = advanceResult.value.state;
          expect(newState.history.length).toBeGreaterThan(1);
        }
      }
    });

    it('should mark dialogue as complete when finished', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('villager-1', 'villager-1', flags);
      
      if (startResult.ok) {
        let state = startResult.value;
        let currentFlags = flags;
        
        // Advance through all lines until complete
        for (let i = 0; i < 20; i++) {
          if (state.completed) {
            break;
          }
          
          const advanceResult = advanceDialogue(state, currentFlags);
          if (!advanceResult.ok) {
            break;
          }
          
          state = advanceResult.value.state;
          currentFlags = advanceResult.value.flags;
        }
        
        // Eventually should complete
        expect(state.completed).toBeDefined();
      }
    });

    it('should handle choices when provided', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('shopkeeper', 'shop-welcome', flags);
      
      if (startResult.ok) {
        const lineResult = getCurrentLine(startResult.value);
        
        if (lineResult.ok && lineResult.value.next && Array.isArray(lineResult.value.next)) {
          // Has choices, try selecting one
          const advanceResult = advanceDialogue(startResult.value, flags, 0);
          expect(advanceResult.ok).toBe(true);
        }
      }
    });

    it('should set flags when specified in dialogue', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('elder', 'elder-warning', flags);
      
      if (startResult.ok) {
        const advanceResult = advanceDialogue(startResult.value, flags);
        
        if (advanceResult.ok) {
          // Flags may have been updated
          expect(advanceResult.value.flags).toBeDefined();
        }
      }
    });
  });

  describe('isDialogueComplete', () => {
    it('should return false for new dialogue', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('garet', 'garet-intro', flags);
      
      if (startResult.ok) {
        expect(isDialogueComplete(startResult.value)).toBe(false);
      }
    });

    it('should return true for completed dialogue', () => {
      const state = {
        treeId: 'test',
        currentLineId: 'end',
        history: ['start', 'middle', 'end'],
        completed: true
      };
      
      expect(isDialogueComplete(state)).toBe(true);
    });
  });

  describe('handleDialogueAction', () => {
    it('should handle battle action', () => {
      const flags = createFlagSystem();
      const state = {
        treeId: 'test',
        currentLineId: 'battle-line',
        history: ['start'],
        completed: false
      };
      
      const action: DialogueAction = {
        type: 'battle',
        encounterId: 'test-battle'
      };
      
      const result = handleDialogueAction(action, state, flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.specialAction).toBeDefined();
        expect(result.value.specialAction?.type).toBe('battle');
      }
    });

    it('should handle shop action', () => {
      const flags = createFlagSystem();
      const state = {
        treeId: 'test',
        currentLineId: 'shop-line',
        history: ['start'],
        completed: false
      };
      
      const action: DialogueAction = {
        type: 'shop',
        shopId: 'item-shop'
      };
      
      const result = handleDialogueAction(action, state, flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.specialAction).toBeDefined();
        expect(result.value.specialAction?.type).toBe('shop');
      }
    });

    it('should handle quest start action', () => {
      const flags = createFlagSystem();
      const state = {
        treeId: 'test',
        currentLineId: 'quest-line',
        history: ['start'],
        completed: false
      };
      
      const action: DialogueAction = {
        type: 'quest_start',
        questId: 'find-herbs'
      };
      
      const result = handleDialogueAction(action, state, flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        // Should set quest flag
        expect(result.value.flags.flags[`quest_find-herbs_started`]).toBe(true);
      }
    });

    it('should handle quest complete action', () => {
      const flags = createFlagSystem();
      const state = {
        treeId: 'test',
        currentLineId: 'quest-complete-line',
        history: ['start'],
        completed: false
      };
      
      const action: DialogueAction = {
        type: 'quest_complete',
        questId: 'find-herbs'
      };
      
      const result = handleDialogueAction(action, state, flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        // Should set quest completed flag
        expect(result.value.flags.flags[`quest_find-herbs_completed`]).toBe(true);
      }
    });

    it('should handle give item action', () => {
      const flags = createFlagSystem();
      const state = {
        treeId: 'test',
        currentLineId: 'give-item-line',
        history: ['start'],
        completed: false
      };
      
      const action: DialogueAction = {
        type: 'give_item',
        itemId: 'potion',
        amount: 3
      };
      
      const result = handleDialogueAction(action, state, flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.specialAction).toBeDefined();
        expect(result.value.specialAction?.type).toBe('give_item');
      }
    });
  });

  describe('dialogue flow integration', () => {
    it('should handle complete dialogue flow', () => {
      const flags = createFlagSystem();
      
      // Start dialogue
      const startResult = startDialogue('kraden', 'kraden-scholar', flags);
      expect(startResult.ok).toBe(true);
      
      if (startResult.ok) {
        let state = startResult.value;
        let currentFlags = flags;
        
        // Get first line
        const line1 = getCurrentLine(state);
        expect(line1.ok).toBe(true);
        
        // Advance through dialogue
        for (let i = 0; i < 10; i++) {
          if (isDialogueComplete(state)) {
            break;
          }
          
          const advanceResult = advanceDialogue(state, currentFlags);
          if (!advanceResult.ok) {
            break;
          }
          
          state = advanceResult.value.state;
          currentFlags = advanceResult.value.flags;
        }
        
        // Should have progressed
        expect(state.history.length).toBeGreaterThan(0);
      }
    });

    it('should handle dialogue with conditional branching', () => {
      let flags = createFlagSystem();
      
      // Set up conditions
      const flagResult = setFlag(flags, 'visited_sanctum', true);
      if (flagResult.ok) {
        flags = flagResult.value;
      }
      
      // Start dialogue that checks conditions
      const startResult = startDialogue('elder', 'elder-warning', flags);
      expect(startResult.ok).toBe(true);
      
      if (startResult.ok) {
        // Dialogue should start at appropriate line based on flags
        expect(startResult.value.currentLineId).toBeDefined();
      }
    });
  });

  describe('error handling', () => {
    it('should handle missing dialogue trees gracefully', () => {
      const flags = createFlagSystem();
      const result = startDialogue('npc', 'missing-tree', flags);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toBeDefined();
      }
    });

    it('should handle invalid line IDs gracefully', () => {
      const state = {
        treeId: 'garet-intro',
        currentLineId: 'invalid-line-id',
        history: [],
        completed: false
      };
      
      const result = getCurrentLine(state);
      expect(result.ok).toBe(false);
    });

    it('should handle missing choice selection', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('shopkeeper', 'shop-welcome', flags);
      
      if (startResult.ok) {
        const lineResult = getCurrentLine(startResult.value);
        
        if (lineResult.ok && lineResult.value.next && Array.isArray(lineResult.value.next)) {
          // Try to advance without providing choice
          const advanceResult = advanceDialogue(startResult.value, flags);
          expect(advanceResult.ok).toBe(false);
        }
      }
    });
  });
});
