/**
 * Compatibility layer for old dialogue system API
 * Temporary bridge until GoldenSunApp.tsx is refactored
 */

import { DialogueState, DialogueTree, DialogueLine } from '../types/dialogue';
import { Result, Ok } from '../utils/result';

// Legacy types
export type DialogueRegistry = Record<string, DialogueTree>;
export type ActiveDialogue = DialogueState | null;

// Legacy functions
export function createDialogueRegistry(): DialogueRegistry {
  return {};
}

export function registerDialogue(
  registry: DialogueRegistry,
  id: string,
  tree: DialogueTree
): Result<DialogueRegistry, string> {
  return Ok({ ...registry, [id]: tree });
}

export function setDialogueState(
  state: DialogueState,
  _status: string
): DialogueState {
  return state;
}

export function createSimpleDialogue(
  id: string,
  speaker: string,
  text: string
): DialogueTree {
  const line: DialogueLine = {
    id: 'line1',
    speaker,
    text,
    next: undefined
  };
  
  return {
    id,
    npcId: id, // Use id as npcId for simple dialogues
    start: 'line1',
    lines: {
      'line1': line
    }
  };
}

export function isDialogueActive(dialogue: ActiveDialogue): boolean {
  return dialogue !== null;
}

export function updateDialogueReveal(state: DialogueState): DialogueState {
  return state;
}

export function selectDialogueChoice(state: DialogueState, _choice: number): DialogueState {
  return state;
}
