/**
 * Dialogue System Types for Golden Sun: Vale Village
 */

/**
 * A single line of dialogue
 */
export interface DialogueLine {
  id: string;
  speaker: string;
  text: string;
  next?: string | string[]; // Next dialogue ID, or array of choice IDs
  choices?: DialogueChoice[]; // If next is array, these are the choice texts
  condition?: string; // Story flag condition (e.g., "bronze_badge_earned")
  setFlag?: string | string[]; // Flag(s) to set after this dialogue
  action?: DialogueAction; // Special action (battle, shop, etc.)
}

/**
 * Player dialogue choice
 */
export interface DialogueChoice {
  text: string;
  next: string; // Which dialogue line this choice leads to
}

/**
 * Special actions that can occur during dialogue
 */
export type DialogueAction = 
  | { type: 'battle'; npcId: string }
  | { type: 'shop'; shopId: string }
  | { type: 'quest_start'; questId: string }
  | { type: 'quest_complete'; questId: string }
  | { type: 'give_item'; itemId: string; amount: number }
  | { type: 'heal' }
  | { type: 'save' };

/**
 * A complete dialogue tree for an NPC
 */
export interface DialogueTree {
  id: string;
  npcId: string;
  start: string; // Starting dialogue line ID
  lines: Record<string, DialogueLine>;
}

/**
 * Current state of an active dialogue
 */
export interface DialogueState {
  treeId: string;
  currentLineId: string;
  history: string[]; // Line IDs visited
  completed: boolean;
}

/**
 * Dialogue registry - all dialogue trees
 */
export type DialogueRegistry = Record<string, DialogueTree>;
