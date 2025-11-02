import { describe, it, expect } from 'vitest';
import {
  startDialogue,
  getCurrentLine,
  advanceDialogue,
  isDialogueComplete
} from '../src/systems/dialogueSystem';
import { createFlagSystem } from '../src/systems/storyFlagSystem';

describe('dialogueSystem', () => {
  describe('startDialogue', () => {
    it('should start dialogue with valid dialogue ID', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.treeId).toBe('garet-intro');
        expect(result.value.completed).toBe(false);
        expect(result.value.history.length).toBeGreaterThan(0);
      }
    });

    it('should return error for invalid dialogue ID', () => {
      const flags = createFlagSystem();
      const result = startDialogue('unknown', 'invalid-dialogue', flags);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('getCurrentLine', () => {
    it('should get current dialogue line', () => {
      const flags = createFlagSystem();
      const dialogueResult = startDialogue('garet', 'garet-intro', flags);
      
      expect(dialogueResult.ok).toBe(true);
      if (dialogueResult.ok) {
        const lineResult = getCurrentLine(dialogueResult.value);
        expect(lineResult.ok).toBe(true);
        if (lineResult.ok) {
          expect(lineResult.value.text).toBeDefined();
          expect(lineResult.value.speaker).toBeDefined();
        }
      }
    });
  });

  describe('advanceDialogue', () => {
    it('should advance dialogue to next line', () => {
      const flags = createFlagSystem();
      const dialogueResult = startDialogue('garet', 'garet-intro', flags);
      
      expect(dialogueResult.ok).toBe(true);
      if (dialogueResult.ok) {
        // Get initial line
        const line1 = getCurrentLine(dialogueResult.value);
        expect(line1.ok).toBe(true);
        
        // Advance dialogue
        const advanceResult = advanceDialogue(dialogueResult.value, flags);
        expect(advanceResult.ok).toBe(true);
        
        if (advanceResult.ok) {
          // State should be updated
          expect(advanceResult.value.state.history.length).toBeGreaterThan(
            dialogueResult.value.history.length
          );
        }
      }
    });

    it('should complete dialogue when reaching end', () => {
      const flags = createFlagSystem();
      const dialogueResult = startDialogue('elder', 'elder-warning', flags);
      
      expect(dialogueResult.ok).toBe(true);
      if (dialogueResult.ok) {
        let state = dialogueResult.value;
        let updatedFlags = flags;
        let iterations = 0;
        const maxIterations = 20;
        
        // Advance through all dialogue
        while (!state.completed && iterations < maxIterations) {
          const advanceResult = advanceDialogue(state, updatedFlags);
          expect(advanceResult.ok).toBe(true);
          
          if (advanceResult.ok) {
            state = advanceResult.value.state;
            updatedFlags = advanceResult.value.flags;
          } else {
            break;
          }
          iterations++;
        }
        
        // Should eventually complete
        expect(state.completed || iterations < maxIterations).toBe(true);
      }
    });
  });

  describe('isDialogueComplete', () => {
    it('should return false for new dialogue', () => {
      const flags = createFlagSystem();
      const result = startDialogue('garet', 'garet-intro', flags);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(isDialogueComplete(result.value)).toBe(false);
      }
    });
  });
});
