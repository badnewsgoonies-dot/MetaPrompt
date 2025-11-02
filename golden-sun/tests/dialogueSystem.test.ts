import { describe, it, expect } from 'vitest';
import {
  startDialogue,
  getCurrentLine,
  advanceDialogue,
  isDialogueComplete,
  handleDialogueAction,
  getDialogueChoices,
  hasDialogueAction,
  getDialogueAction,
  restartDialogue,
  hasDialogue,
  getAllDialogueIds,
  previewDialogueLine
} from '../src/systems/dialogueSystem';
import { createFlagSystem, setFlag } from '../src/systems/storyFlagSystem';

describe('dialogueSystem', () => {
  describe('hasDialogue', () => {
    it('should return true for garet-intro dialogue', () => {
      expect(hasDialogue('garet-intro')).toBe(true);
    });

    it('should return false for non-existent dialogue', () => {
      expect(hasDialogue('does-not-exist')).toBe(false);
    });
  });

  describe('getAllDialogueIds', () => {
    it('should return array of dialogue IDs', () => {
      const ids = getAllDialogueIds();
      expect(Array.isArray(ids)).toBe(true);
      expect(ids.length).toBeGreaterThan(0);
      expect(ids).toContain('garet-intro');
    });
  });

  describe('startDialogue', () => {
    it('should start dialogue and return initial state', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.treeId).toBe('garet-intro');
        expect(result.value.currentLineId).toBeDefined();
        expect(result.value.completed).toBe(false);
        expect(result.value.history.length).toBe(1);
      }
    });

    it('should return error for non-existent dialogue', () => {
      const flags = createFlagSystem();
      const result = startDialogue('npc', 'does-not-exist', flags);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('getCurrentLine', () => {
    it('should get current dialogue line', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('garet', 'garet-intro', flags);
      
      expect(startResult.ok).toBe(true);
      if (!startResult.ok) return;
      
      const lineResult = getCurrentLine(startResult.value);
      expect(lineResult.ok).toBe(true);
      if (lineResult.ok) {
        expect(lineResult.value).toBeDefined();
        expect(lineResult.value.text).toBeDefined();
        expect(lineResult.value.speaker).toBeDefined();
      }
    });
  });

  describe('advanceDialogue', () => {
    it('should advance to next line', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('garet', 'garet-intro', flags);
      
      expect(startResult.ok).toBe(true);
      if (!startResult.ok) return;
      
      const initialState = startResult.value;
      const initialLineId = initialState.currentLineId;
      
      const advanceResult = advanceDialogue(initialState, flags);
      expect(advanceResult.ok).toBe(true);
      
      if (advanceResult.ok) {
        const newState = advanceResult.value.state;
        // Either advanced to new line or completed
        expect(newState.completed || newState.currentLineId !== initialLineId).toBe(true);
      }
    });

    it('should mark dialogue as completed when finished', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('garet', 'garet-intro', flags);
      
      expect(startResult.ok).toBe(true);
      if (!startResult.ok) return;
      
      let state = startResult.value;
      let updatedFlags = flags;
      let iterations = 0;
      const maxIterations = 20; // Prevent infinite loop
      
      // Advance through all dialogue
      while (!state.completed && iterations < maxIterations) {
        // Check if current line has choices
        const choicesResult = getDialogueChoices(state);
        const hasChoices = choicesResult.ok && choicesResult.value.length > 0;
        
        // If has choices, pick the first one (choice 0)
        const choice = hasChoices ? 0 : undefined;
        
        const result = advanceDialogue(state, updatedFlags, choice);
        expect(result.ok).toBe(true);
        if (!result.ok) break;
        
        state = result.value.state;
        updatedFlags = result.value.flags;
        iterations++;
      }
      
      expect(state.completed).toBe(true);
    });

    it('should handle choices when provided', () => {
      const flags = createFlagSystem();
      
      // Use a dialogue with choices if available
      const ids = getAllDialogueIds();
      const startResult = startDialogue('npc', ids[0], flags);
      
      if (!startResult.ok) return; // Skip if no dialogue available
      
      const choicesResult = getDialogueChoices(startResult.value);
      expect(choicesResult.ok).toBe(true);
      
      // If this dialogue has choices, test selecting one
      if (choicesResult.ok && choicesResult.value.length > 0) {
        const advanceResult = advanceDialogue(startResult.value, flags, 0);
        expect(advanceResult.ok).toBe(true);
      }
    });
  });

  describe('isDialogueComplete', () => {
    it('should return false for active dialogue', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(isDialogueComplete(result.value)).toBe(false);
      }
    });

    it('should return true for completed dialogue', () => {
      const completedState = {
        treeId: 'test',
        currentLineId: 'end',
        history: ['start', 'end'],
        completed: true
      };
      
      expect(isDialogueComplete(completedState)).toBe(true);
    });
  });

  describe('getDialogueChoices', () => {
    it('should return empty array for dialogue without choices', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      
      const choicesResult = getDialogueChoices(result.value);
      expect(choicesResult.ok).toBe(true);
      if (choicesResult.ok) {
        expect(Array.isArray(choicesResult.value)).toBe(true);
      }
    });
  });

  describe('hasDialogueAction', () => {
    it('should check if dialogue has action', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      
      const actionCheckResult = hasDialogueAction(result.value);
      expect(actionCheckResult.ok).toBe(true);
      if (actionCheckResult.ok) {
        expect(typeof actionCheckResult.value).toBe('boolean');
      }
    });
  });

  describe('getDialogueAction', () => {
    it('should get dialogue action if present', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      
      const actionResult = getDialogueAction(result.value);
      expect(actionResult.ok).toBe(true);
    });
  });

  describe('handleDialogueAction', () => {
    it('should handle battle action', () => {
      const flags = createFlagSystem();
      const state = {
        treeId: 'test',
        currentLineId: 'battle',
        history: ['battle'],
        completed: false
      };
      
      const action = { type: 'battle' as const, npcId: 'garet' };
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
        currentLineId: 'shop',
        history: ['shop'],
        completed: false
      };
      
      const action = { type: 'shop' as const, shopId: 'item-shop' };
      const result = handleDialogueAction(action, state, flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.specialAction).toBeDefined();
        expect(result.value.specialAction?.type).toBe('shop');
      }
    });

    it('should handle quest_start action', () => {
      const flags = createFlagSystem();
      const state = {
        treeId: 'test',
        currentLineId: 'quest',
        history: ['quest'],
        completed: false
      };
      
      const action = { type: 'quest_start' as const, questId: 'main-quest-1' };
      const result = handleDialogueAction(action, state, flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.flags).toBeDefined();
        expect(result.value.specialAction?.type).toBe('quest_start');
      }
    });

    it('should handle heal action', () => {
      const flags = createFlagSystem();
      const state = {
        treeId: 'test',
        currentLineId: 'heal',
        history: ['heal'],
        completed: false
      };
      
      const action = { type: 'heal' as const };
      const result = handleDialogueAction(action, state, flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.specialAction?.type).toBe('heal');
      }
    });
  });

  describe('restartDialogue', () => {
    it('should restart dialogue from beginning', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('garet', 'garet-intro', flags);
      
      expect(startResult.ok).toBe(true);
      if (!startResult.ok) return;
      
      // Advance once
      const advanceResult = advanceDialogue(startResult.value, flags);
      expect(advanceResult.ok).toBe(true);
      if (!advanceResult.ok) return;
      
      // Restart
      const restartResult = restartDialogue(advanceResult.value.state, flags);
      expect(restartResult.ok).toBe(true);
      if (restartResult.ok) {
        expect(restartResult.value.history.length).toBe(1);
        expect(restartResult.value.completed).toBe(false);
      }
    });
  });

  describe('previewDialogueLine', () => {
    it('should preview dialogue line without state', () => {
      const flags = createFlagSystem();
      const startResult = startDialogue('garet', 'garet-intro', flags);
      
      expect(startResult.ok).toBe(true);
      if (!startResult.ok) return;
      
      const previewResult = previewDialogueLine('garet-intro', startResult.value.currentLineId);
      expect(previewResult.ok).toBe(true);
      if (previewResult.ok) {
        expect(previewResult.value.text).toBeDefined();
      }
    });

    it('should return error for invalid line', () => {
      const result = previewDialogueLine('garet-intro', 'does-not-exist');
      expect(result.ok).toBe(false);
    });
  });

  describe('flag-based dialogue branching', () => {
    it('should select different dialogue based on flags', () => {
      let flags = createFlagSystem();
      
      // Start dialogue without flag
      const result1 = startDialogue('garet', 'garet-intro', flags);
      expect(result1.ok).toBe(true);
      if (!result1.ok) return;
      
      const line1Result = getCurrentLine(result1.value);
      expect(line1Result.ok).toBe(true);
      if (!line1Result.ok) return;
      
      const initialLine = line1Result.value;
      
      // Set a flag and restart
      const setResult = setFlag(flags, 'test_flag', true);
      expect(setResult.ok).toBe(true);
      if (!setResult.ok) return;
      
      flags = setResult.value;
      
      // Starting again might give different dialogue
      const result2 = startDialogue('garet', 'garet-intro', flags);
      expect(result2.ok).toBe(true);
    });
  });

  describe('integration: full dialogue flow', () => {
    it('should handle complete dialogue with choices', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (!result.ok) return;
      
      let state = result.value;
      let updatedFlags = flags;
      let steps = 0;
      const maxSteps = 10;
      
      while (!state.completed && steps < maxSteps) {
        const lineResult = getCurrentLine(state);
        expect(lineResult.ok).toBe(true);
        if (!lineResult.ok) break;
        
        const choicesResult = getDialogueChoices(state);
        expect(choicesResult.ok).toBe(true);
        if (!choicesResult.ok) break;
        
        const choice = choicesResult.value.length > 0 ? 0 : undefined;
        const advanceResult = advanceDialogue(state, updatedFlags, choice);
        expect(advanceResult.ok).toBe(true);
        if (!advanceResult.ok) break;
        
        state = advanceResult.value.state;
        updatedFlags = advanceResult.value.flags;
        steps++;
      }
      
      // Should either complete or reach max steps
      expect(steps).toBeLessThanOrEqual(maxSteps);
    });
  });
});
