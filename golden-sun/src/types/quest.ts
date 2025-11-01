/**
 * Quest System Types for Golden Sun: Vale Village
 */

/**
 * Quest objective types
 */
export type ObjectiveType =
  | 'talk' // Talk to an NPC
  | 'battle' // Defeat an NPC in battle
  | 'collect' // Collect items
  | 'visit' // Visit a location
  | 'deliver' // Deliver an item to NPC
  | 'explore' // Find something hidden
  | 'count'; // Counter-based (e.g., defeat X enemies)

/**
 * A single quest objective
 */
export interface QuestObjective {
  id: string;
  description: string;
  type: ObjectiveType;
  target?: string; // NPC ID, item ID, or location ID
  current: number; // Current progress
  required: number; // Required amount
  completed: boolean;
  optional?: boolean; // If true, not required to complete quest
}

/**
 * Quest reward
 */
export interface QuestReward {
  type: 'item' | 'coins' | 'equipment' | 'badge' | 'title' | 'flag';
  id: string; // Item ID, equipment ID, badge name, etc.
  amount?: number; // For items/coins
  name?: string; // Display name
}

/**
 * Quest status
 */
export type QuestStatus = 'locked' | 'available' | 'active' | 'completed' | 'failed';

/**
 * A complete quest definition
 */
export interface Quest {
  id: string;
  title: string;
  description: string;
  questGiver?: string; // NPC ID
  questGiverLocation?: string; // Where to find them
  
  type: 'main' | 'side' | 'repeatable';
  difficulty: 'tutorial' | 'easy' | 'moderate' | 'hard' | 'boss';
  
  objectives: QuestObjective[];
  rewards: QuestReward[];
  
  prerequisite?: string | string[]; // Quest ID(s) or story flag(s)
  unlocks?: string | string[]; // Quest ID(s) or story flag(s) this quest unlocks
  
  status: QuestStatus;
  startedAt?: number; // Timestamp
  completedAt?: number; // Timestamp
  
  repeatable?: boolean; // Can be done multiple times
  timesCompleted?: number; // For repeatable quests
}

/**
 * Quest registry - all quests
 */
export type QuestRegistry = Record<string, Quest>;

/**
 * Active quest state
 */
export interface QuestState {
  activeQuests: string[]; // Quest IDs
  completedQuests: string[]; // Quest IDs
  failedQuests: string[]; // Quest IDs
  questData: Record<string, Quest>; // Current state of all quests
}
