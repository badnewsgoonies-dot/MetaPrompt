import { Result, ok, err } from '../utils/result';
import { IRng } from '../utils/rng';
import { Enemy } from '../types/enemy';
import { getRandomEncounter } from '../data/enemies';

/**
 * Encounter System for Golden Sun
 * Handles random battle triggers and encounter generation
 */

export interface EncounterState {
  stepsSinceLastBattle: number;
  stepsUntilNextBattle: number;
  encounterZone: string;
  isInSafeZone: boolean;
  canEscape: boolean; // World map battles can always escape
}

export interface EncounterTriggerResult {
  shouldTrigger: boolean;
  encounterZone: string;
  enemies: Enemy[];
}

/**
 * Initialize encounter state for a new area
 */
export function initializeEncounterState(
  encounterZone: string,
  isInSafeZone: boolean = false,
  rng: IRng
): EncounterState {
  return {
    stepsSinceLastBattle: 0,
    stepsUntilNextBattle: calculateStepsUntilBattle(rng),
    encounterZone,
    isInSafeZone,
    canEscape: !isInSafeZone // Can escape on world map, not in dungeons
  };
}

/**
 * Calculate random steps until next battle (8-15 steps)
 */
function calculateStepsUntilBattle(rng: IRng): number {
  return Math.floor(8 + rng.next() * 8); // 8-15 steps
}

/**
 * Update encounter state after player movement
 */
export function updateEncounterState(
  state: EncounterState,
  rng: IRng
): Result<EncounterTriggerResult, string> {
  // No encounters in safe zones
  if (state.isInSafeZone) {
    return ok({
      shouldTrigger: false,
      encounterZone: state.encounterZone,
      enemies: []
    });
  }

  // Increment steps
  state.stepsSinceLastBattle++;

  // Check if battle should trigger
  if (state.stepsSinceLastBattle >= state.stepsUntilNextBattle) {
    // Generate encounter
    const enemies = getRandomEncounter(state.encounterZone as any, () => rng.next());
    
    // Reset counter
    state.stepsSinceLastBattle = 0;
    state.stepsUntilNextBattle = calculateStepsUntilBattle(rng);

    return ok({
      shouldTrigger: true,
      encounterZone: state.encounterZone,
      enemies
    });
  }

  return ok({
    shouldTrigger: false,
    encounterZone: state.encounterZone,
    enemies: []
  });
}

/**
 * Check if encounter should trigger (manual check)
 */
export function checkEncounterTrigger(
  state: EncounterState
): boolean {
  return !state.isInSafeZone && state.stepsSinceLastBattle >= state.stepsUntilNextBattle;
}

/**
 * Force an encounter (for scripted battles)
 */
export function forceEncounter(
  encounterZone: string,
  rng: IRng
): Result<Enemy[], string> {
  const enemies = getRandomEncounter(encounterZone as any, () => rng.next());
  
  if (enemies.length === 0) {
    return err(`No encounters defined for zone: ${encounterZone}`);
  }

  return ok(enemies);
}

/**
 * Set safe zone status (for towns, inns, etc.)
 */
export function setSafeZone(
  state: EncounterState,
  isSafe: boolean
): EncounterState {
  state.isInSafeZone = isSafe;
  return state;
}

/**
 * Change encounter zone (when entering new area)
 */
export function changeEncounterZone(
  state: EncounterState,
  newZone: string,
  rng: IRng
): EncounterState {
  state.encounterZone = newZone;
  state.stepsSinceLastBattle = 0;
  state.stepsUntilNextBattle = calculateStepsUntilBattle(rng);
  return state;
}
