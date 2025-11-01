import { describe, it, expect } from 'vitest';
import {
  createDialogueRegistry,
  registerDialogue,
  startDialogue,
  updateDialogueReveal,
  advanceDialogue,
  selectDialogueChoice,
  confirmDialogueChoice,
  skipTextReveal,
  closeDialogue,
  isDialogueActive,
  getVisibleText,
  getCurrentLine,
  addDialogueHistory,
  hasCompletedDialogue,
  getDialogueProgress,
  setDialogueState,
  createSimpleDialogue
} from '../src/systems/dialogueSystem';
import { DialogueSequence, DialogueConfig, DEFAULT_DIALOGUE_CONFIG } from '../src/types/dialogue';

describe('dialogueSystem', () => {
  const mockDialogue: DialogueSequence = {
    id: 'garet-intro',
    lines: [
      {
        speaker: { id: 'garet', name: 'Garet' },
        text: 'Hey Isaac! Ready for an adventure?'
      },
      {
        speaker: { id: 'garet', name: 'Garet' },
        text: 'The Elder wants to see us at the plaza.'
      },
      {
        speaker: { id: 'isaac', name: 'Isaac' },
        text: "Let's go then!"
      }
    ]
  };

  const mockChoiceDialogue: DialogueSequence = {
    id: 'shop-welcome',
    lines: [
      {
        speaker: { id: 'shopkeeper', name: 'Shopkeeper' },
        text: 'Welcome to my shop! What can I do for you?',
        choices: [
          { id: 'buy', text: 'Buy items', next: 'shop-buy' },
          { id: 'sell', text: 'Sell items', next: 'shop-sell' },
          { id: 'leave', text: 'Nothing, thanks' }
        ]
      }
    ]
  };

  describe('createDialogueRegistry', () => {
    it('should create empty dialogue registry', () => {
      const registry = createDialogueRegistry();
      
      expect(registry.sequences.size).toBe(0);
      expect(registry.history.length).toBe(0);
    });
  });

  describe('registerDialogue', () => {
    it('should register new dialogue sequence', () => {
      const registry = createDialogueRegistry();
      const result = registerDialogue(registry, mockDialogue);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.sequences.size).toBe(1);
        expect(result.value.sequences.get('garet-intro')).toBeDefined();
      }
    });

    it('should return error when registering duplicate dialogue ID', () => {
      let registry = createDialogueRegistry();
      const result1 = registerDialogue(registry, mockDialogue);
      expect(result1.ok).toBe(true);
      
      if (result1.ok) {
        registry = result1.value;
        const result2 = registerDialogue(registry, mockDialogue);
        expect(result2.ok).toBe(false);
        
        if (!result2.ok) {
          expect(result2.error).toContain('already exists');
        }
      }
    });

    it('should not modify original registry', () => {
      const registry = createDialogueRegistry();
      registerDialogue(registry, mockDialogue);
      
      expect(registry.sequences.size).toBe(0);
    });
  });

  describe('startDialogue', () => {
    it('should start dialogue sequence', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      expect(regResult.ok).toBe(true);
      if (!regResult.ok) return;
      registry = regResult.value;

      const result = startDialogue('garet-intro', registry);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.sequence.id).toBe('garet-intro');
        expect(result.value.currentLineIndex).toBe(0);
        expect(result.value.currentCharIndex).toBe(0);
        expect(result.value.isTextComplete).toBe(false);
        expect(result.value.state).toBe('opening');
      }
    });

    it('should return error for non-existent dialogue', () => {
      const registry = createDialogueRegistry();
      const result = startDialogue('invalid-id', registry);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    it('should return error for empty dialogue', () => {
      let registry = createDialogueRegistry();
      const emptyDialogue: DialogueSequence = {
        id: 'empty',
        lines: []
      };
      
      const regResult = registerDialogue(registry, emptyDialogue);
      expect(regResult.ok).toBe(true);
      if (!regResult.ok) return;
      registry = regResult.value;

      const result = startDialogue('empty', registry);
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('no lines');
      }
    });
  });

  describe('updateDialogueReveal', () => {
    it('should reveal characters over time', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      let dialogue = { ...startResult.value, state: 'displaying' as const };
      
      // Reveal text over multiple frames
      dialogue = updateDialogueReveal(dialogue, 100, DEFAULT_DIALOGUE_CONFIG);
      
      expect(dialogue.currentCharIndex).toBeGreaterThan(0);
      expect(dialogue.isTextComplete).toBe(false);
    });

    it('should complete text when all characters revealed', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      let dialogue = { ...startResult.value, state: 'displaying' as const };
      const textLength = mockDialogue.lines[0].text.length;
      
      // Reveal all text
      dialogue = updateDialogueReveal(dialogue, 10000, DEFAULT_DIALOGUE_CONFIG);
      
      expect(dialogue.currentCharIndex).toBe(textLength);
      expect(dialogue.isTextComplete).toBe(true);
      expect(dialogue.state).toBe('waiting');
    });

    it('should not update when not in displaying state', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = startResult.value; // State is 'opening'
      const updated = updateDialogueReveal(dialogue, 100, DEFAULT_DIALOGUE_CONFIG);
      
      expect(updated.currentCharIndex).toBe(0);
    });

    it('should reveal at least 1 character per frame', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      let dialogue = { ...startResult.value, state: 'displaying' as const };
      
      // Very small deltaTime
      dialogue = updateDialogueReveal(dialogue, 1, DEFAULT_DIALOGUE_CONFIG);
      
      expect(dialogue.currentCharIndex).toBeGreaterThanOrEqual(1);
    });
  });

  describe('advanceDialogue', () => {
    it('should complete text instantly if not complete', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      let dialogue = { ...startResult.value, state: 'displaying' as const, currentCharIndex: 5 };
      
      const result = advanceDialogue(dialogue);
      expect(result.ok).toBe(true);
      
      if (result.ok) {
        expect(result.value.isTextComplete).toBe(true);
        expect(result.value.currentCharIndex).toBe(mockDialogue.lines[0].text.length);
      }
    });

    it('should advance to next line when text complete', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      let dialogue = { 
        ...startResult.value, 
        currentCharIndex: mockDialogue.lines[0].text.length,
        isTextComplete: true,
        state: 'waiting' as const
      };
      
      const result = advanceDialogue(dialogue);
      expect(result.ok).toBe(true);
      
      if (result.ok) {
        expect(result.value.currentLineIndex).toBe(1);
        expect(result.value.currentCharIndex).toBe(0);
        expect(result.value.isTextComplete).toBe(false);
        expect(result.value.state).toBe('displaying');
      }
    });

    it('should close dialogue when on last line', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      let dialogue = {
        ...startResult.value,
        currentLineIndex: 2, // Last line
        currentCharIndex: mockDialogue.lines[2].text.length,
        isTextComplete: true,
        state: 'waiting' as const
      };
      
      const result = advanceDialogue(dialogue);
      expect(result.ok).toBe(true);
      
      if (result.ok) {
        expect(result.value.state).toBe('closing');
      }
    });

    it('should return error when line has choices', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockChoiceDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('shop-welcome', registry);
      if (!startResult.ok) return;
      
      let dialogue = {
        ...startResult.value,
        currentCharIndex: mockChoiceDialogue.lines[0].text.length,
        isTextComplete: true,
        state: 'waiting' as const
      };
      
      const result = advanceDialogue(dialogue);
      expect(result.ok).toBe(false);
      
      if (!result.ok) {
        expect(result.error).toContain('must select choice');
      }
    });
  });

  describe('selectDialogueChoice', () => {
    it('should select valid choice', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockChoiceDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('shop-welcome', registry);
      if (!startResult.ok) return;
      
      const dialogue = startResult.value;
      const result = selectDialogueChoice(dialogue, 1);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.selectedChoice).toBe(1);
      }
    });

    it('should return error for invalid choice index', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockChoiceDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('shop-welcome', registry);
      if (!startResult.ok) return;
      
      const dialogue = startResult.value;
      const result = selectDialogueChoice(dialogue, 5);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid choice');
      }
    });

    it('should return error when line has no choices', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = startResult.value;
      const result = selectDialogueChoice(dialogue, 0);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('no choices');
      }
    });
  });

  describe('confirmDialogueChoice', () => {
    it('should branch to next dialogue when choice has next', () => {
      let registry = createDialogueRegistry();
      let regResult = registerDialogue(registry, mockChoiceDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      // Register the "next" dialogue
      const nextDialogue: DialogueSequence = {
        id: 'shop-buy',
        lines: [
          { speaker: { id: 'shopkeeper', name: 'Shopkeeper' }, text: 'Here are my wares!' }
        ]
      };
      regResult = registerDialogue(registry, nextDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('shop-welcome', registry);
      if (!startResult.ok) return;
      
      let dialogue = startResult.value;
      
      // Select first choice (Buy items -> shop-buy)
      const selectResult = selectDialogueChoice(dialogue, 0);
      if (!selectResult.ok) return;
      dialogue = selectResult.value;

      const confirmResult = confirmDialogueChoice(dialogue, registry);
      expect(confirmResult.ok).toBe(true);
      
      if (confirmResult.ok) {
        expect(confirmResult.value.sequence.id).toBe('shop-buy');
      }
    });

    it('should close dialogue when choice has no next', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockChoiceDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('shop-welcome', registry);
      if (!startResult.ok) return;
      
      let dialogue = startResult.value;
      
      // Select last choice (Nothing, thanks - no next)
      const selectResult = selectDialogueChoice(dialogue, 2);
      if (!selectResult.ok) return;
      dialogue = selectResult.value;

      const confirmResult = confirmDialogueChoice(dialogue, registry);
      expect(confirmResult.ok).toBe(true);
      
      if (confirmResult.ok) {
        expect(confirmResult.value.state).toBe('closing');
      }
    });

    it('should return error when line has no choices', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = startResult.value;
      const result = confirmDialogueChoice(dialogue, registry);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('no choices');
      }
    });
  });

  describe('skipTextReveal', () => {
    it('should complete text instantly', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = { ...startResult.value, state: 'displaying' as const, currentCharIndex: 5 };
      const skipped = skipTextReveal(dialogue);
      
      expect(skipped.currentCharIndex).toBe(mockDialogue.lines[0].text.length);
      expect(skipped.isTextComplete).toBe(true);
      expect(skipped.state).toBe('waiting');
    });

    it('should not change state when not displaying', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = startResult.value; // State is 'opening'
      const skipped = skipTextReveal(dialogue);
      
      expect(skipped.currentCharIndex).toBe(0);
      expect(skipped.state).toBe('opening');
    });
  });

  describe('closeDialogue', () => {
    it('should set state to closing', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = startResult.value;
      const closed = closeDialogue(dialogue);
      
      expect(closed.state).toBe('closing');
    });
  });

  describe('isDialogueActive', () => {
    it('should return true when dialogue is active', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      expect(isDialogueActive(startResult.value)).toBe(true);
    });

    it('should return false when dialogue is closed', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const closed = { ...startResult.value, state: 'closed' as const };
      expect(isDialogueActive(closed)).toBe(false);
    });

    it('should return false when dialogue is null', () => {
      expect(isDialogueActive(null)).toBe(false);
    });
  });

  describe('getVisibleText', () => {
    it('should return partial text based on current char index', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = { ...startResult.value, currentCharIndex: 10 };
      const visibleText = getVisibleText(dialogue);
      
      expect(visibleText).toBe('Hey Isaac!');
    });

    it('should return empty string when char index is 0', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const visibleText = getVisibleText(startResult.value);
      expect(visibleText).toBe('');
    });
  });

  describe('getCurrentLine', () => {
    it('should return current dialogue line', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const line = getCurrentLine(startResult.value);
      expect(line).toBeDefined();
      expect(line?.speaker.name).toBe('Garet');
    });
  });

  describe('addDialogueHistory', () => {
    it('should add dialogue to history', () => {
      let registry = createDialogueRegistry();
      registry = addDialogueHistory(registry, 'garet', 'garet-intro', true);
      
      expect(registry.history.length).toBe(1);
      expect(registry.history[0].npcId).toBe('garet');
      expect(registry.history[0].completed).toBe(true);
    });

    it('should not modify original registry', () => {
      const registry = createDialogueRegistry();
      addDialogueHistory(registry, 'garet', 'garet-intro', true);
      
      expect(registry.history.length).toBe(0);
    });
  });

  describe('hasCompletedDialogue', () => {
    it('should return true when dialogue completed', () => {
      let registry = createDialogueRegistry();
      registry = addDialogueHistory(registry, 'garet', 'garet-intro', true);
      
      expect(hasCompletedDialogue(registry, 'garet', 'garet-intro')).toBe(true);
    });

    it('should return false when dialogue not completed', () => {
      let registry = createDialogueRegistry();
      registry = addDialogueHistory(registry, 'garet', 'garet-intro', false);
      
      expect(hasCompletedDialogue(registry, 'garet', 'garet-intro')).toBe(false);
    });

    it('should return false when dialogue not in history', () => {
      const registry = createDialogueRegistry();
      expect(hasCompletedDialogue(registry, 'garet', 'garet-intro')).toBe(false);
    });
  });

  describe('getDialogueProgress', () => {
    it('should return 0 at start', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const progress = getDialogueProgress(startResult.value);
      expect(progress).toBe(0);
    });

    it('should return 1 at end', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = {
        ...startResult.value,
        currentLineIndex: 2,
        isTextComplete: true
      };
      
      const progress = getDialogueProgress(dialogue);
      expect(progress).toBe(1);
    });

    it('should return fractional progress in middle', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const dialogue = {
        ...startResult.value,
        currentLineIndex: 1,
        isTextComplete: true
      };
      
      const progress = getDialogueProgress(dialogue);
      expect(progress).toBeCloseTo(0.666, 2); // 2/3 complete
    });
  });

  describe('setDialogueState', () => {
    it('should update dialogue state', () => {
      let registry = createDialogueRegistry();
      const regResult = registerDialogue(registry, mockDialogue);
      if (!regResult.ok) return;
      registry = regResult.value;

      const startResult = startDialogue('garet-intro', registry);
      if (!startResult.ok) return;
      
      const updated = setDialogueState(startResult.value, 'displaying');
      expect(updated.state).toBe('displaying');
    });
  });

  describe('createSimpleDialogue', () => {
    it('should create dialogue with multiple lines', () => {
      const dialogue = createSimpleDialogue(
        'test-dialogue',
        'npc-1',
        'Test NPC',
        ['Line 1', 'Line 2', 'Line 3'],
        './portrait.png'
      );
      
      expect(dialogue.id).toBe('test-dialogue');
      expect(dialogue.lines.length).toBe(3);
      expect(dialogue.lines[0].speaker.name).toBe('Test NPC');
      expect(dialogue.lines[0].speaker.portrait).toBe('./portrait.png');
      expect(dialogue.lines[1].text).toBe('Line 2');
    });

    it('should create dialogue without portrait', () => {
      const dialogue = createSimpleDialogue(
        'test-dialogue',
        'npc-1',
        'Test NPC',
        ['Line 1']
      );
      
      expect(dialogue.lines[0].speaker.portrait).toBeUndefined();
    });
  });
});
