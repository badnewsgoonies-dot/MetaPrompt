/**
 * Dialogue System for Golden Sun Vale Village
 * Handles dialogue rendering, text reveal, choices, and progression
 */

import {
  DialogueSequence,
  DialogueLine,
  ActiveDialogue,
  DialogueState,
  DialogueConfig,
  DialogueRegistry,
  DialogueHistoryEntry,
  DEFAULT_DIALOGUE_CONFIG
} from '../types/dialogue';
import { Result, Ok, Err } from '../utils/result';

/**
 * Create a new dialogue registry
 */
export function createDialogueRegistry(): DialogueRegistry {
  return {
    sequences: new Map(),
    history: []
  };
}

/**
 * Register a dialogue sequence
 */
export function registerDialogue(
  registry: DialogueRegistry,
  sequence: DialogueSequence
): Result<DialogueRegistry, string> {
  if (registry.sequences.has(sequence.id)) {
    return Err(`Dialogue sequence already exists: ${sequence.id}`);
  }

  const updatedSequences = new Map(registry.sequences);
  updatedSequences.set(sequence.id, sequence);

  return Ok({
    ...registry,
    sequences: updatedSequences
  });
}

/**
 * Start a dialogue sequence
 */
export function startDialogue(
  dialogueId: string,
  registry: DialogueRegistry
): Result<ActiveDialogue, string> {
  const sequence = registry.sequences.get(dialogueId);
  
  if (!sequence) {
    return Err(`Dialogue sequence not found: ${dialogueId}`);
  }

  if (sequence.lines.length === 0) {
    return Err(`Dialogue sequence has no lines: ${dialogueId}`);
  }

  return Ok({
    sequence,
    currentLineIndex: 0,
    currentCharIndex: 0,
    isTextComplete: false,
    state: 'opening',
    selectedChoice: 0
  });
}

/**
 * Update dialogue text reveal animation
 * Returns updated dialogue state with next character revealed
 */
export function updateDialogueReveal(
  dialogue: ActiveDialogue,
  deltaTime: number,
  config: DialogueConfig = DEFAULT_DIALOGUE_CONFIG
): ActiveDialogue {
  if (dialogue.state !== 'displaying') {
    return dialogue;
  }

  const currentLine = dialogue.sequence.lines[dialogue.currentLineIndex];
  if (!currentLine) {
    return dialogue;
  }

  const textLength = currentLine.text.length;

  // Already finished revealing text
  if (dialogue.currentCharIndex >= textLength) {
    if (!dialogue.isTextComplete) {
      return {
        ...dialogue,
        isTextComplete: true,
        state: 'waiting'
      };
    }
    return dialogue;
  }

  // Calculate how many characters to reveal based on deltaTime and text speed
  const msPerChar = 1000 / config.textSpeed;
  const charsToReveal = Math.floor(deltaTime / msPerChar);
  const newCharIndex = Math.min(
    dialogue.currentCharIndex + Math.max(1, charsToReveal),
    textLength
  );

  const isComplete = newCharIndex >= textLength;

  return {
    ...dialogue,
    currentCharIndex: newCharIndex,
    isTextComplete: isComplete,
    state: isComplete ? 'waiting' : 'displaying'
  };
}

/**
 * Advance to next line in dialogue
 */
export function advanceDialogue(
  dialogue: ActiveDialogue
): Result<ActiveDialogue, string> {
  // If text not complete, instantly complete it
  if (!dialogue.isTextComplete && dialogue.state === 'displaying') {
    const currentLine = dialogue.sequence.lines[dialogue.currentLineIndex];
    if (!currentLine) {
      return Err('Invalid dialogue state: no current line');
    }
    return Ok({
      ...dialogue,
      currentCharIndex: currentLine.text.length,
      isTextComplete: true,
      state: 'waiting'
    });
  }

  // Check if current line has choices (must select before advancing)
  const currentLine = dialogue.sequence.lines[dialogue.currentLineIndex];
  if (currentLine && currentLine.choices && currentLine.choices.length > 0) {
    return Err('Cannot advance: must select choice first');
  }

  // Advance to next line
  const nextLineIndex = dialogue.currentLineIndex + 1;

  if (nextLineIndex >= dialogue.sequence.lines.length) {
    // Dialogue complete
    return Ok({
      ...dialogue,
      state: 'closing'
    });
  }

  // Move to next line
  return Ok({
    ...dialogue,
    currentLineIndex: nextLineIndex,
    currentCharIndex: 0,
    isTextComplete: false,
    state: 'displaying',
    selectedChoice: 0
  });
}

/**
 * Select a dialogue choice (for branching dialogues)
 */
export function selectDialogueChoice(
  dialogue: ActiveDialogue,
  choiceIndex: number
): Result<ActiveDialogue, string> {
  const currentLine = dialogue.sequence.lines[dialogue.currentLineIndex];

  if (!currentLine || !currentLine.choices || currentLine.choices.length === 0) {
    return Err('Current line has no choices');
  }

  if (choiceIndex < 0 || choiceIndex >= currentLine.choices.length) {
    return Err(`Invalid choice index: ${choiceIndex}`);
  }

  return Ok({
    ...dialogue,
    selectedChoice: choiceIndex
  });
}

/**
 * Confirm selected choice and branch dialogue
 */
export function confirmDialogueChoice(
  dialogue: ActiveDialogue,
  registry: DialogueRegistry
): Result<ActiveDialogue, string> {
  const currentLine = dialogue.sequence.lines[dialogue.currentLineIndex];

  if (!currentLine || !currentLine.choices || currentLine.choices.length === 0) {
    return Err('Current line has no choices');
  }

  const selectedChoice = currentLine.choices[dialogue.selectedChoice];
  if (!selectedChoice) {
    return Err('Invalid selected choice');
  }

  // If choice has next dialogue sequence, start it
  if (selectedChoice.next) {
    return startDialogue(selectedChoice.next, registry);
  }

  // Otherwise, close dialogue
  return Ok({
    ...dialogue,
    state: 'closing'
  });
}

/**
 * Skip text reveal and show full text immediately
 */
export function skipTextReveal(dialogue: ActiveDialogue): ActiveDialogue {
  if (dialogue.state !== 'displaying') {
    return dialogue;
  }

  const currentLine = dialogue.sequence.lines[dialogue.currentLineIndex];
  if (!currentLine) {
    return dialogue;
  }
  
  return {
    ...dialogue,
    currentCharIndex: currentLine.text.length,
    isTextComplete: true,
    state: 'waiting'
  };
}

/**
 * Close dialogue
 */
export function closeDialogue(dialogue: ActiveDialogue): ActiveDialogue {
  return {
    ...dialogue,
    state: 'closing'
  };
}

/**
 * Check if dialogue is active (not closed)
 */
export function isDialogueActive(dialogue: ActiveDialogue | null): boolean {
  return dialogue !== null && dialogue.state !== 'closed';
}

/**
 * Get visible text for current line (based on reveal progress)
 */
export function getVisibleText(dialogue: ActiveDialogue): string {
  const currentLine = dialogue.sequence.lines[dialogue.currentLineIndex];
  if (!currentLine) return '';

  return currentLine.text.substring(0, dialogue.currentCharIndex);
}

/**
 * Get current dialogue line
 */
export function getCurrentLine(dialogue: ActiveDialogue): DialogueLine | null {
  const line = dialogue.sequence.lines[dialogue.currentLineIndex];
  return line || null;
}

/**
 * Add dialogue to history
 */
export function addDialogueHistory(
  registry: DialogueRegistry,
  npcId: string,
  dialogueId: string,
  completed: boolean
): DialogueRegistry {
  const entry: DialogueHistoryEntry = {
    npcId,
    dialogueId,
    timestamp: Date.now(),
    completed
  };

  return {
    ...registry,
    history: [...registry.history, entry]
  };
}

/**
 * Check if dialogue has been completed before
 */
export function hasCompletedDialogue(
  registry: DialogueRegistry,
  npcId: string,
  dialogueId: string
): boolean {
  return registry.history.some(
    entry => entry.npcId === npcId && entry.dialogueId === dialogueId && entry.completed
  );
}

/**
 * Get progress through dialogue sequence (0-1)
 */
export function getDialogueProgress(dialogue: ActiveDialogue): number {
  const totalLines = dialogue.sequence.lines.length;
  if (totalLines === 0) return 1;

  const completedLines = dialogue.currentLineIndex;
  const currentLineProgress = dialogue.isTextComplete ? 1 : 0;

  return (completedLines + currentLineProgress) / totalLines;
}

/**
 * Update dialogue state (for state machine transitions)
 */
export function setDialogueState(
  dialogue: ActiveDialogue,
  state: DialogueState
): ActiveDialogue {
  return {
    ...dialogue,
    state
  };
}

/**
 * Create a simple dialogue sequence (single speaker, no choices)
 */
export function createSimpleDialogue(
  id: string,
  speakerId: string,
  speakerName: string,
  texts: string[],
  portrait?: string
): DialogueSequence {
  const speaker = {
    id: speakerId,
    name: speakerName,
    ...(portrait ? { portrait } : {})
  };

  const lines: DialogueLine[] = texts.map(text => ({
    speaker,
    text
  }));

  return {
    id,
    lines
  };
}
