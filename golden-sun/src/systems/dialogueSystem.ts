/**
 * Dialogue System
 * Manages NPC conversations, choices, and battle challenges
 */

import { Result, Ok, Err } from '../utils/result';
import { DialogueTree, DialogueLine, DialogueState, DialogueAction } from '../types/dialogue';
import { FlagSystem } from '../types/storyFlags';
import { setFlag, checkCondition } from './storyFlagSystem';
import { DIALOGUE_DATA } from '../data/dialogueData';

/**
 * Start a dialogue with an NPC
 * Returns initial dialogue state
 */
export function startDialogue(
  _npcId: string,
  dialogueId: string,
  flags: FlagSystem
): Result<DialogueState, string> {
  // Get the dialogue tree
  const tree = DIALOGUE_DATA[dialogueId];
  
  if (!tree) {
    return Err(`Dialogue tree not found: ${dialogueId}`);
  }

  // Find the correct starting line based on flags
  const startLineId = findStartingLine(tree, flags);
  
  if (!tree.lines[startLineId]) {
    return Err(`Starting dialogue line not found: ${startLineId} in tree ${dialogueId}`);
  }

  return Ok({
    treeId: dialogueId,
    currentLineId: startLineId,
    history: [startLineId],
    completed: false
  });
}

/**
 * Find the correct starting dialogue line based on story flags
 * Checks conditions on dialogue lines to find best match
 */
function findStartingLine(tree: DialogueTree, flags: FlagSystem): string {
  // Check all lines for one with a matching condition
  for (const [lineId, line] of Object.entries(tree.lines)) {
    if (line.condition && checkCondition(flags, line.condition)) {
      return lineId;
    }
  }

  // Default to tree's start
  return tree.start;
}

/**
 * Get the current dialogue line
 */
export function getCurrentLine(
  state: DialogueState,
  dialogueId?: string
): Result<DialogueLine, string> {
  const tree = DIALOGUE_DATA[dialogueId || state.treeId];
  
  if (!tree) {
    return Err(`Dialogue tree not found: ${state.treeId}`);
  }

  const line = tree.lines[state.currentLineId];
  
  if (!line) {
    return Err(`Dialogue line not found: ${state.currentLineId}`);
  }

  return Ok(line);
}

/**
 * Advance dialogue to next line or handle player choice
 */
export function advanceDialogue(
  state: DialogueState,
  flags: FlagSystem,
  choice?: number
): Result<{ state: DialogueState; flags: FlagSystem }, string> {
  const lineResult = getCurrentLine(state);
  
  if (!lineResult.ok) {
    return Err(lineResult.error);
  }

  const currentLine = lineResult.value;
  let updatedFlags = flags;

  // Set any flags from current line
  if (currentLine.setFlag) {
    const flagsToSet = Array.isArray(currentLine.setFlag) 
      ? currentLine.setFlag 
      : [currentLine.setFlag];
    
    for (const flagName of flagsToSet) {
      const result = setFlag(updatedFlags, flagName, true);
      if (!result.ok) {
        return Err(result.error);
      }
      updatedFlags = result.value;
    }
  }

  // Determine next line
  let nextLineId: string | undefined;

  if (currentLine.next) {
    if (Array.isArray(currentLine.next)) {
      // Player made a choice
      if (choice === undefined) {
        return Err('Choice required but not provided');
      }
      
      if (choice < 0 || choice >= currentLine.next.length) {
        return Err(`Invalid choice index: ${choice}`);
      }
      
      nextLineId = currentLine.next[choice];
    } else {
      // Automatic progression
      nextLineId = currentLine.next;
    }
  }

  // Check if dialogue is complete
  if (!nextLineId) {
    return Ok({
      state: {
        ...state,
        completed: true
      },
      flags: updatedFlags
    });
  }

  // Move to next line
  return Ok({
    state: {
      ...state,
      currentLineId: nextLineId,
      history: [...state.history, nextLineId],
      completed: false
    },
    flags: updatedFlags
  });
}

/**
 * Check if dialogue is complete
 */
export function isDialogueComplete(state: DialogueState): boolean {
  return state.completed;
}

/**
 * Handle special dialogue actions (battle, shop, quest, etc.)
 */
export function handleDialogueAction(
  action: DialogueAction,
  state: DialogueState,
  flags: FlagSystem
): Result<{
  state: DialogueState;
  flags: FlagSystem;
  specialAction?: DialogueAction;
}, string> {
  switch (action.type) {
    case 'battle':
      // Return the action for the game to handle
      // Game will trigger battle, then resume dialogue
      return Ok({
        state,
        flags,
        specialAction: action
      });

    case 'shop':
      // Return the action for the game to handle
      return Ok({
        state,
        flags,
        specialAction: action
      });

    case 'quest_start':
      // Set flag that quest has started
      const startResult = setFlag(flags, `quest_${action.questId}_started`, true);
      if (!startResult.ok) {
        return Err(startResult.error);
      }
      return Ok({
        state,
        flags: startResult.value,
        specialAction: action
      });

    case 'quest_complete':
      // Set flag that quest is completed
      const completeResult = setFlag(flags, `quest_${action.questId}_completed`, true);
      if (!completeResult.ok) {
        return Err(completeResult.error);
      }
      return Ok({
        state,
        flags: completeResult.value,
        specialAction: action
      });

    case 'give_item':
      // Flag for inventory system to handle
      return Ok({
        state,
        flags,
        specialAction: action
      });

    case 'heal':
      // Flag for game to heal player
      return Ok({
        state,
        flags,
        specialAction: action
      });

    case 'save':
      // Flag for game to save
      return Ok({
        state,
        flags,
        specialAction: action
      });

    default:
      return Err(`Unknown action type: ${(action as any).type}`);
  }
}

/**
 * Get available dialogue choices for current line
 */
export function getDialogueChoices(
  state: DialogueState
): Result<{ text: string; index: number }[], string> {
  const lineResult = getCurrentLine(state);
  
  if (!lineResult.ok) {
    return Err(lineResult.error);
  }

  const line = lineResult.value;

  if (!line.choices || !Array.isArray(line.next)) {
    return Ok([]);
  }

  return Ok(
    line.choices.map((choice, index) => ({
      text: choice.text,
      index
    }))
  );
}

/**
 * Check if current dialogue line has an action
 */
export function hasDialogueAction(state: DialogueState): Result<boolean, string> {
  const lineResult = getCurrentLine(state);
  
  if (!lineResult.ok) {
    return Err(lineResult.error);
  }

  return Ok(!!lineResult.value.action);
}

/**
 * Get the action from current dialogue line
 */
export function getDialogueAction(state: DialogueState): Result<DialogueAction | undefined, string> {
  const lineResult = getCurrentLine(state);
  
  if (!lineResult.ok) {
    return Err(lineResult.error);
  }

  return Ok(lineResult.value.action);
}

/**
 * Restart dialogue from the beginning
 */
export function restartDialogue(
  state: DialogueState,
  flags: FlagSystem
): Result<DialogueState, string> {
  const tree = DIALOGUE_DATA[state.treeId];
  
  if (!tree) {
    return Err(`Dialogue tree not found: ${state.treeId}`);
  }

  const startLineId = findStartingLine(tree, flags);
  
  return Ok({
    treeId: state.treeId,
    currentLineId: startLineId,
    history: [startLineId],
    completed: false
  });
}

/**
 * Check if an NPC has dialogue available
 */
export function hasDialogue(dialogueId: string): boolean {
  return !!DIALOGUE_DATA[dialogueId];
}

/**
 * Get all available dialogue trees
 */
export function getAllDialogueIds(): string[] {
  return Object.keys(DIALOGUE_DATA);
}

/**
 * Preview dialogue line without advancing state (for debugging)
 */
export function previewDialogueLine(
  dialogueId: string,
  lineId: string
): Result<DialogueLine, string> {
  const tree = DIALOGUE_DATA[dialogueId];
  
  if (!tree) {
    return Err(`Dialogue tree not found: ${dialogueId}`);
  }

  const line = tree.lines[lineId];
  
  if (!line) {
    return Err(`Dialogue line not found: ${lineId}`);
  }

  return Ok(line);
}
