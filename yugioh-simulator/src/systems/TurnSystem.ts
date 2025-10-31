/**
 * Turn System - Manages turn flow and phases
 * All functions are pure and deterministic
 */

import { Result, Ok, Err } from '../utils/result-type';

/**
 * Turn phases in Yu-Gi-Oh
 */
export type Phase =
  | 'draw'
  | 'standby'
  | 'main1'
  | 'battle'
  | 'main2'
  | 'end';

/**
 * Turn state
 */
export interface TurnState {
  currentPlayer: number; // 0 or 1
  turnCount: number;
  phase: Phase;
  hasNormalSummoned: boolean; // Only 1 normal summon per turn
  canEnterBattle: boolean; // Can't attack on first turn
}

/**
 * Initialize turn state
 */
export function createTurnState(startingPlayer: number): TurnState {
  return {
    currentPlayer: startingPlayer,
    turnCount: 1,
    phase: 'draw',
    hasNormalSummoned: false,
    canEnterBattle: false, // First turn, no attacks
  };
}

/**
 * Advance to next phase
 */
export function nextPhase(state: TurnState): Result<TurnState, string> {
  const phaseOrder: Phase[] = ['draw', 'standby', 'main1', 'battle', 'main2', 'end'];
  const currentIndex = phaseOrder.indexOf(state.phase);

  if (currentIndex === -1) {
    return Err('Invalid phase');
  }

  // If at end phase, move to next player's turn
  if (state.phase === 'end') {
    return Ok({
      currentPlayer: state.currentPlayer === 0 ? 1 : 0,
      turnCount: state.turnCount + 1,
      phase: 'draw',
      hasNormalSummoned: false,
      canEnterBattle: true, // After first turn, battles are allowed
    });
  }

  return Ok({
    ...state,
    phase: phaseOrder[currentIndex + 1],
  });
}

/**
 * Check if currently in Main Phase (1 or 2)
 */
export function isMainPhase(state: TurnState): boolean {
  return state.phase === 'main1' || state.phase === 'main2';
}

/**
 * Check if currently in Battle Phase
 */
export function isBattlePhase(state: TurnState): boolean {
  return state.phase === 'battle';
}

/**
 * Check if currently in Draw Phase
 */
export function isDrawPhase(state: TurnState): boolean {
  return state.phase === 'draw';
}

/**
 * Check if can normal summon
 */
export function canNormalSummon(state: TurnState): Result<void, string> {
  if (!isMainPhase(state)) {
    return Err('Can only summon during Main Phase');
  }

  if (state.hasNormalSummoned) {
    return Err('Already normal summoned this turn');
  }

  return Ok(undefined);
}

/**
 * Mark that a normal summon occurred
 */
export function markNormalSummon(state: TurnState): Result<TurnState, string> {
  const canSummon = canNormalSummon(state);
  if (canSummon.kind === 'err') {
    return Err(canSummon.error);
  }

  return Ok({
    ...state,
    hasNormalSummoned: true,
  });
}

/**
 * Check if can enter battle phase
 */
export function canEnterBattle(state: TurnState): Result<void, string> {
  if (state.phase !== 'battle') {
    return Err('Not in Battle Phase');
  }

  if (!state.canEnterBattle) {
    return Err('Cannot attack on first turn');
  }

  return Ok(undefined);
}

/**
 * Check if can activate spell
 */
export function canActivateSpell(state: TurnState): Result<void, string> {
  if (!isMainPhase(state)) {
    return Err('Can only activate spells during Main Phase');
  }

  return Ok(undefined);
}

/**
 * Check if can set trap
 */
export function canSetTrap(state: TurnState): Result<void, string> {
  if (!isMainPhase(state)) {
    return Err('Can only set traps during Main Phase');
  }

  return Ok(undefined);
}

/**
 * Get phase name for display
 */
export function getPhaseName(phase: Phase): string {
  const names: Record<Phase, string> = {
    draw: 'Draw Phase',
    standby: 'Standby Phase',
    main1: 'Main Phase 1',
    battle: 'Battle Phase',
    main2: 'Main Phase 2',
    end: 'End Phase',
  };

  return names[phase];
}

/**
 * Skip to a specific phase (for testing)
 */
export function skipToPhase(
  state: TurnState,
  targetPhase: Phase
): Result<TurnState, string> {
  const phaseOrder: Phase[] = ['draw', 'standby', 'main1', 'battle', 'main2', 'end'];
  const currentIndex = phaseOrder.indexOf(state.phase);
  const targetIndex = phaseOrder.indexOf(targetPhase);

  if (targetIndex < currentIndex) {
    return Err('Cannot skip backwards to earlier phase');
  }

  return Ok({
    ...state,
    phase: targetPhase,
  });
}
