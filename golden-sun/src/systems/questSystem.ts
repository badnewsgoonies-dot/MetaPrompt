/**
 * Quest System
 * Manages quest progression, objectives, and rewards
 */

import { Result, Ok, Err } from '../utils/result';
import { Quest, QuestObjective, QuestReward, QuestStatus, QuestState } from '../types/quest';
import { FlagSystem } from '../types/storyFlags';
import { setFlag, checkCondition } from './storyFlagSystem';
import { QUEST_DATA } from '../data/questData';

/**
 * Create a new quest system
 */
export function createQuestSystem(flags: FlagSystem): QuestState {
  // Load quests and initialize their status based on flags
  const quests: Record<string, Quest> = {};
  
  for (const [questId, questTemplate] of Object.entries(QUEST_DATA)) {
    quests[questId] = {
      ...questTemplate,
      status: determineQuestStatus(questTemplate, flags)
    };
  }

  // Determine which quests are active
  const activeQuests = Object.keys(quests).filter(
    id => quests[id]?.status === 'active'
  );

  // Determine which are completed
  const completedQuests = Object.keys(quests).filter(
    id => quests[id]?.status === 'completed'
  );

  return {
    activeQuests,
    completedQuests,
    failedQuests: [],
    questData: quests
  };
}

/**
 * Determine quest status based on flags
 */
function determineQuestStatus(quest: Quest, flags: FlagSystem): QuestStatus {
  // Check if completed
  if (flags.flags[`quest_${quest.id}_completed`]) {
    return 'completed';
  }

  // Check if failed
  if (flags.flags[`quest_${quest.id}_failed`]) {
    return 'failed';
  }

  // Check if active
  if (flags.flags[`quest_${quest.id}_active`]) {
    return 'active';
  }

  // Check if available (prerequisites met)
  if (checkPrerequisites(quest, flags)) {
    return 'available';
  }

  return 'locked';
}

/**
 * Check if quest prerequisites are met
 */
function checkPrerequisites(quest: Quest, flags: FlagSystem): boolean {
  if (!quest.prerequisite) {
    return true;
  }

  if (Array.isArray(quest.prerequisite)) {
    return quest.prerequisite.every(prereq => 
      flags.flags[prereq] || checkCondition(flags, prereq)
    );
  }

  return !!flags.flags[quest.prerequisite] || checkCondition(flags, quest.prerequisite);
}

/**
 * Get all available quests
 */
export function getAvailableQuests(system: QuestState, flags: FlagSystem): Quest[] {
  return Object.values(system.questData).filter(quest => {
    if (quest.status === 'completed' || quest.status === 'failed') {
      return false;
    }
    return checkPrerequisites(quest, flags);
  });
}

/**
 * Get active quests
 */
export function getActiveQuests(system: QuestState): Quest[] {
  return system.activeQuests
    .map(id => system.questData[id])
    .filter(quest => quest !== undefined);
}

/**
 * Get completed quests
 */
export function getCompletedQuests(system: QuestState): Quest[] {
  return system.completedQuests
    .map(id => system.questData[id])
    .filter(quest => quest !== undefined);
}

/**
 * Get a specific quest
 */
export function getQuest(system: QuestState, questId: string): Result<Quest, string> {
  const quest = system.questData[questId];
  
  if (!quest) {
    return Err(`Quest not found: ${questId}`);
  }

  return Ok(quest);
}

/**
 * Start a quest
 */
export function startQuest(
  system: QuestState,
  questId: string,
  flags: FlagSystem
): Result<{ system: QuestState; flags: FlagSystem }, string> {
  const questResult = getQuest(system, questId);
  
  if (!questResult.ok) {
    return Err(questResult.error);
  }

  const quest = questResult.value;

  // Check if already active or completed
  if (quest.status === 'active') {
    return Err(`Quest already active: ${questId}`);
  }
  
  if (quest.status === 'completed') {
    if (!quest.repeatable) {
      return Err(`Quest already completed and not repeatable: ${questId}`);
    }
  }

  // Check prerequisites
  if (!checkPrerequisites(quest, flags)) {
    return Err(`Quest prerequisites not met: ${questId}`);
  }

  // Update quest status
  const updatedQuest: Quest = {
    ...quest,
    status: 'active',
    startedAt: Date.now()
  };

  // Set flag
  const flagResult = setFlag(flags, `quest_${questId}_active`, true);
  if (!flagResult.ok) {
    return Err(flagResult.error);
  }

  return Ok({
    system: {
      ...system,
      activeQuests: [...system.activeQuests, questId],
      questData: {
        ...system.questData,
        [questId]: updatedQuest
      }
    },
    flags: flagResult.value
  });
}

/**
 * Update a quest objective
 */
export function updateObjective(
  system: QuestState,
  questId: string,
  objectiveId: string,
  progress?: number
): Result<QuestState, string> {
  const questResult = getQuest(system, questId);
  
  if (!questResult.ok) {
    return Err(questResult.error);
  }

  const quest = questResult.value;

  if (quest.status !== 'active') {
    return Err(`Quest not active: ${questId}`);
  }

  // Find objective
  const objective = quest.objectives.find(obj => obj.id === objectiveId);
  
  if (!objective) {
    return Err(`Objective not found: ${objectiveId} in quest ${questId}`);
  }

  // Update progress
  const newProgress = progress !== undefined ? progress : objective.current + 1;
  const updatedObjective: QuestObjective = {
    ...objective,
    current: Math.min(newProgress, objective.required),
    completed: newProgress >= objective.required
  };

  // Update quest with new objective
  const updatedObjectives = quest.objectives.map(obj =>
    obj.id === objectiveId ? updatedObjective : obj
  );

  const updatedQuest: Quest = {
    ...quest,
    objectives: updatedObjectives
  };

  return Ok({
    ...system,
    questData: {
      ...system.questData,
      [questId]: updatedQuest
    }
  });
}

/**
 * Check if quest is complete (all required objectives met)
 */
export function isQuestComplete(quest: Quest): boolean {
  return quest.objectives
    .filter(obj => !obj.optional)
    .every(obj => obj.completed);
}

/**
 * Complete a quest and grant rewards
 */
export function completeQuest(
  system: QuestState,
  questId: string,
  flags: FlagSystem
): Result<{
  system: QuestState;
  flags: FlagSystem;
  rewards: QuestReward[];
}, string> {
  const questResult = getQuest(system, questId);
  
  if (!questResult.ok) {
    return Err(questResult.error);
  }

  const quest = questResult.value;

  // Check if all required objectives are complete
  if (!isQuestComplete(quest)) {
    return Err(`Quest objectives not complete: ${questId}`);
  }

  // Update quest status
  const updatedQuest: Quest = {
    ...quest,
    status: 'completed',
    completedAt: Date.now(),
    timesCompleted: (quest.timesCompleted || 0) + 1
  };

  // Set completion flag
  let updatedFlags = flags;
  const completeFlagResult = setFlag(updatedFlags, `quest_${questId}_completed`, true);
  if (!completeFlagResult.ok) {
    return Err(completeFlagResult.error);
  }
  updatedFlags = completeFlagResult.value;

  // Remove active flag
  const activeFlagResult = setFlag(updatedFlags, `quest_${questId}_active`, false);
  if (!activeFlagResult.ok) {
    return Err(activeFlagResult.error);
  }
  updatedFlags = activeFlagResult.value;

  // Set any unlock flags from quest
  if (quest.unlocks) {
    const unlocks = Array.isArray(quest.unlocks) ? quest.unlocks : [quest.unlocks];
    
    for (const unlockFlag of unlocks) {
      const result = setFlag(updatedFlags, unlockFlag, true);
      if (!result.ok) {
        return Err(result.error);
      }
      updatedFlags = result.value;
    }
  }

  // Process reward flags
  for (const reward of quest.rewards) {
    if (reward.type === 'flag') {
      const result = setFlag(updatedFlags, reward.id, true);
      if (!result.ok) {
        return Err(result.error);
      }
      updatedFlags = result.value;
    }
  }

  // Remove from active, add to completed
  const newActiveQuests = system.activeQuests.filter(id => id !== questId);
  const newCompletedQuests = [...system.completedQuests, questId];

  return Ok({
    system: {
      ...system,
      activeQuests: newActiveQuests,
      completedQuests: newCompletedQuests,
      questData: {
        ...system.questData,
        [questId]: updatedQuest
      }
    },
    flags: updatedFlags,
    rewards: quest.rewards
  });
}

/**
 * Fail a quest
 */
export function failQuest(
  system: QuestState,
  questId: string,
  flags: FlagSystem
): Result<{ system: QuestState; flags: FlagSystem }, string> {
  const questResult = getQuest(system, questId);
  
  if (!questResult.ok) {
    return Err(questResult.error);
  }

  const quest = questResult.value;

  const updatedQuest: Quest = {
    ...quest,
    status: 'failed'
  };

  const flagResult = setFlag(flags, `quest_${questId}_failed`, true);
  if (!flagResult.ok) {
    return Err(flagResult.error);
  }

  return Ok({
    system: {
      ...system,
      activeQuests: system.activeQuests.filter(id => id !== questId),
      failedQuests: [...system.failedQuests, questId],
      questData: {
        ...system.questData,
        [questId]: updatedQuest
      }
    },
    flags: flagResult.value
  });
}

/**
 * Get quest progress as percentage
 */
export function getQuestProgress(quest: Quest): number {
  if (quest.status === 'completed') return 100;
  if (quest.status === 'failed') return 0;

  const requiredObjectives = quest.objectives.filter(obj => !obj.optional);
  if (requiredObjectives.length === 0) return 0;

  const totalRequired = requiredObjectives.reduce((sum, obj) => sum + obj.required, 0);
  const totalCurrent = requiredObjectives.reduce((sum, obj) => sum + obj.current, 0);

  return Math.floor((totalCurrent / totalRequired) * 100);
}

/**
 * Get quest progress as string (e.g., "2/3 objectives")
 */
export function getQuestProgressString(quest: Quest): string {
  const requiredObjectives = quest.objectives.filter(obj => !obj.optional);
  const completedCount = requiredObjectives.filter(obj => obj.completed).length;
  
  return `${completedCount}/${requiredObjectives.length} objectives`;
}

/**
 * Auto-check all active quests for completion
 */
export function checkQuestCompletions(
  system: QuestState,
  flags: FlagSystem
): Result<{
  system: QuestState;
  flags: FlagSystem;
  completed: string[];
}, string> {
  let currentSystem = system;
  let currentFlags = flags;
  const completed: string[] = [];

  for (const questId of system.activeQuests) {
    const quest = currentSystem.questData[questId];
    
    if (quest && isQuestComplete(quest)) {
      const result = completeQuest(currentSystem, questId, currentFlags);
      
      if (result.ok) {
        currentSystem = result.value.system;
        currentFlags = result.value.flags;
        completed.push(questId);
      }
    }
  }

  return Ok({
    system: currentSystem,
    flags: currentFlags,
    completed
  });
}

/**
 * Get main quests
 */
export function getMainQuests(system: QuestState): Quest[] {
  return Object.values(system.questData).filter(q => q.type === 'main');
}

/**
 * Get side quests
 */
export function getSideQuests(system: QuestState): Quest[] {
  return Object.values(system.questData).filter(q => q.type === 'side');
}

/**
 * Get current main quest (highest priority active main quest)
 */
export function getCurrentMainQuest(system: QuestState): Quest | null {
  const activeMainQuests = system.activeQuests
    .map(id => system.questData[id])
    .filter(q => q && q.type === 'main');

  // Return first active main quest (they should be sequential)
  return activeMainQuests[0] || null;
}
