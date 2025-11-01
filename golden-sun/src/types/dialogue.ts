/**
 * Dialogue System Types for Golden Sun Vale Village
 */

// Dialogue state
export type DialogueState = 'closed' | 'opening' | 'displaying' | 'waiting' | 'closing';

// Dialogue speaker
export interface DialogueSpeaker {
  id: string;
  name: string;
  portrait?: string; // Path to portrait image (optional)
}

// Single dialogue line
export interface DialogueLine {
  speaker: DialogueSpeaker;
  text: string;
  choices?: DialogueChoice[]; // Optional choices for player response
}

// Dialogue choice (for branching dialogue)
export interface DialogueChoice {
  id: string;
  text: string;
  next?: string; // ID of next dialogue sequence
}

// Dialogue sequence (multiple lines)
export interface DialogueSequence {
  id: string;
  lines: DialogueLine[];
  onComplete?: string; // Callback ID or next sequence
}

// Active dialogue state
export interface ActiveDialogue {
  sequence: DialogueSequence;
  currentLineIndex: number;
  currentCharIndex: number;
  isTextComplete: boolean;
  state: DialogueState;
  selectedChoice: number; // For choice navigation (0-indexed)
}

// Dialogue configuration
export interface DialogueConfig {
  textSpeed: number; // Characters per second
  autoAdvanceDelay: number; // ms to wait before allowing advance
  portraitSize: number; // px for portrait width/height
  maxTextWidth: number; // px for text wrap
}

// Default dialogue configuration
export const DEFAULT_DIALOGUE_CONFIG: DialogueConfig = {
  textSpeed: 30, // 30 characters per second (33ms per char)
  autoAdvanceDelay: 200, // 200ms delay before can advance
  portraitSize: 64, // 64×64 portrait
  maxTextWidth: 350 // Max text width in pixels
};

// Dialogue history entry
export interface DialogueHistoryEntry {
  npcId: string;
  dialogueId: string;
  timestamp: number;
  completed: boolean;
}

// Dialogue registry (maps dialogue IDs to sequences)
export interface DialogueRegistry {
  sequences: Map<string, DialogueSequence>;
  history: DialogueHistoryEntry[];
}
