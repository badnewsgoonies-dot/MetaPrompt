/**
 * Story Flag System
 * Manages player progress through flags that unlock content and dialogue
 */

import { Result, Ok, Err } from '../utils/result';
import { FlagSystem, FlagValue, FlagHistoryEntry, SerializedFlags } from '../types/storyFlags';

const STORAGE_KEY = 'golden_sun_story_flags';

/**
 * Create a new flag system with default flags
 */
export function createFlagSystem(): FlagSystem {
  return {
    flags: {
      // Initialize with starting flags
      game_started: false,
      battles_won: 0,
    },
    history: []
  };
}

/**
 * Get a flag value
 */
export function getFlag(
  system: FlagSystem,
  key: string
): FlagValue | undefined {
  return system.flags[key];
}

/**
 * Set a flag value
 */
export function setFlag(
  system: FlagSystem,
  key: string,
  value: FlagValue
): Result<FlagSystem, string> {
  try {
    const historyEntry: FlagHistoryEntry = {
      key,
      value,
      timestamp: Date.now()
    };

    return Ok({
      flags: {
        ...system.flags,
        [key]: value
      },
      history: [...system.history, historyEntry]
    });
  } catch (error) {
    return Err(`Failed to set flag ${key}: ${error}`);
  }
}

/**
 * Set multiple flags at once
 */
export function setFlags(
  system: FlagSystem,
  flags: Record<string, FlagValue>
): Result<FlagSystem, string> {
  let currentSystem = system;
  
  for (const [key, value] of Object.entries(flags)) {
    const result = setFlag(currentSystem, key, value);
    if (!result.ok) {
      return result;
    }
    currentSystem = result.value;
  }
  
  return Ok(currentSystem);
}

/**
 * Increment a numeric flag
 */
export function incrementFlag(
  system: FlagSystem,
  key: string,
  amount: number = 1
): Result<FlagSystem, string> {
  const currentValue = system.flags[key];
  
  if (currentValue === undefined) {
    return setFlag(system, key, amount);
  }
  
  if (typeof currentValue !== 'number') {
    return Err(`Flag ${key} is not numeric (current value: ${currentValue})`);
  }
  
  return setFlag(system, key, currentValue + amount);
}

/**
 * Check if a condition is met
 * Supports: flag_name, !flag_name, flag1 && flag2, flag1 || flag2, flag >= 3
 */
export function checkCondition(
  system: FlagSystem,
  condition: string
): boolean {
  if (!condition || condition.trim() === '') {
    return true;
  }

  // Handle negation (!flag)
  if (condition.startsWith('!')) {
    const flagName = condition.slice(1).trim();
    return !system.flags[flagName];
  }

  // Handle AND (&&)
  if (condition.includes('&&')) {
    const parts = condition.split('&&').map(s => s.trim());
    return parts.every(part => checkCondition(system, part));
  }

  // Handle OR (||)
  if (condition.includes('||')) {
    const parts = condition.split('||').map(s => s.trim());
    return parts.some(part => checkCondition(system, part));
  }

  // Handle comparisons (>=, <=, >, <, ==)
  const comparisonMatch = condition.match(/^(\w+)\s*(>=|<=|>|<|==)\s*(.+)$/);
  if (comparisonMatch) {
    const [, flagName, operator, valueStr] = comparisonMatch;
    const flagValue = system.flags[flagName];
    const compareValue = isNaN(Number(valueStr)) ? valueStr.trim() : Number(valueStr);
    
    if (flagValue === undefined) return false;

    switch (operator) {
      case '>=': return Number(flagValue) >= Number(compareValue);
      case '<=': return Number(flagValue) <= Number(compareValue);
      case '>': return Number(flagValue) > Number(compareValue);
      case '<': return Number(flagValue) < Number(compareValue);
      case '==': return flagValue == compareValue;
      default: return false;
    }
  }

  // Handle quest conditions (quest:quest_id:status)
  if (condition.startsWith('quest:')) {
    const parts = condition.split(':');
    if (parts.length === 3) {
      const [, questId, status] = parts;
      const questStatus = system.flags[`quest_${questId}_${status}`];
      return !!questStatus;
    }
  }

  // Simple flag check
  return !!system.flags[condition.trim()];
}

/**
 * Check multiple conditions (all must be true)
 */
export function checkConditions(
  system: FlagSystem,
  conditions: string[]
): boolean {
  return conditions.every(condition => checkCondition(system, condition));
}

/**
 * Get all flags matching a pattern
 */
export function getFlagsMatching(
  system: FlagSystem,
  pattern: RegExp
): Record<string, FlagValue> {
  const matches: Record<string, FlagValue> = {};
  
  for (const [key, value] of Object.entries(system.flags)) {
    if (pattern.test(key)) {
      matches[key] = value;
    }
  }
  
  return matches;
}

/**
 * Get all battle victory flags
 */
export function getBattleVictories(system: FlagSystem): string[] {
  const battleFlags = getFlagsMatching(system, /^defeated_/);
  return Object.keys(battleFlags).filter(key => battleFlags[key] === true);
}

/**
 * Get total battles won
 */
export function getTotalBattlesWon(system: FlagSystem): number {
  const battlesWon = system.flags['battles_won'];
  return typeof battlesWon === 'number' ? battlesWon : 0;
}

/**
 * Check which badge level player has earned
 */
export function getCurrentBadge(system: FlagSystem): string | null {
  if (system.flags['guardian_badge_earned']) return 'guardian';
  if (system.flags['warrior_badge_earned']) return 'warrior';
  if (system.flags['gold_badge_earned']) return 'gold';
  if (system.flags['silver_badge_earned']) return 'silver';
  if (system.flags['bronze_badge_earned']) return 'bronze';
  return null;
}

/**
 * Save flags to localStorage
 */
export function saveFlags(system: FlagSystem): Result<void, string> {
  try {
    const serialized: SerializedFlags = {
      flags: system.flags,
      lastSaved: Date.now()
    };
    
    localStorage.setItem(STORAGE_KEY, JSON.stringify(serialized));
    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to save flags: ${error}`);
  }
}

/**
 * Load flags from localStorage
 */
export function loadFlags(): Result<FlagSystem, string> {
  try {
    const stored = localStorage.getItem(STORAGE_KEY);
    
    if (!stored) {
      // No saved data, return new system
      return Ok(createFlagSystem());
    }
    
    const serialized: SerializedFlags = JSON.parse(stored);
    
    return Ok({
      flags: serialized.flags,
      history: [] // Don't persist history
    });
  } catch (error) {
    return Err(`Failed to load flags: ${error}`);
  }
}

/**
 * Clear all flags (for testing or new game)
 */
export function clearFlags(): Result<void, string> {
  try {
    localStorage.removeItem(STORAGE_KEY);
    return Ok(undefined);
  } catch (error) {
    return Err(`Failed to clear flags: ${error}`);
  }
}

/**
 * Export flags for debugging
 */
export function exportFlags(system: FlagSystem): string {
  return JSON.stringify(system.flags, null, 2);
}

/**
 * Import flags from JSON string (for debugging/testing)
 */
export function importFlags(json: string): Result<FlagSystem, string> {
  try {
    const flags = JSON.parse(json);
    return Ok({
      flags,
      history: []
    });
  } catch (error) {
    return Err(`Failed to import flags: ${error}`);
  }
}

/**
 * Get flag history for debugging
 */
export function getFlagHistory(
  system: FlagSystem,
  key?: string
): FlagHistoryEntry[] {
  if (key) {
    return system.history.filter(entry => entry.key === key);
  }
  return system.history;
}
