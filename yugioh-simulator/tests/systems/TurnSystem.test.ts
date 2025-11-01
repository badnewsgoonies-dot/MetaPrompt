/**
 * TurnSystem Tests
 * Ensures correct turn flow and phase management
 */

import { describe, it, expect } from '@jest/globals';
import {
  createTurnState,
  nextPhase,
  isMainPhase,
  isBattlePhase,
  isDrawPhase,
  canNormalSummon,
  markNormalSummon,
  canEnterBattle,
  canActivateSpell,
  canSetTrap,
  getPhaseName,
  skipToPhase,
} from '../../src/systems/TurnSystem';
import { isOk, isErr } from '../../src/utils/result-type';

describe('TurnSystem', () => {
  describe('createTurnState', () => {
    it('should initialize turn state for player 0', () => {
      const state = createTurnState(0);
      expect(state.currentPlayer).toBe(0);
      expect(state.turnCount).toBe(1);
      expect(state.phase).toBe('draw');
      expect(state.hasNormalSummoned).toBe(false);
      expect(state.canEnterBattle).toBe(false);
    });

    it('should initialize turn state for player 1', () => {
      const state = createTurnState(1);
      expect(state.currentPlayer).toBe(1);
    });
  });

  describe('nextPhase', () => {
    it('should advance through all phases', () => {
      let state = createTurnState(0);

      // Draw -> Standby
      const standby = nextPhase(state);
      expect(isOk(standby)).toBe(true);
      if (isOk(standby)) {
        expect(standby.value.phase).toBe('standby');
        state = standby.value;
      }

      // Standby -> Main1
      const main1 = nextPhase(state);
      expect(isOk(main1)).toBe(true);
      if (isOk(main1)) {
        expect(main1.value.phase).toBe('main1');
        state = main1.value;
      }

      // Main1 -> Battle
      const battle = nextPhase(state);
      expect(isOk(battle)).toBe(true);
      if (isOk(battle)) {
        expect(battle.value.phase).toBe('battle');
        state = battle.value;
      }

      // Battle -> Main2
      const main2 = nextPhase(state);
      expect(isOk(main2)).toBe(true);
      if (isOk(main2)) {
        expect(main2.value.phase).toBe('main2');
        state = main2.value;
      }

      // Main2 -> End
      const end = nextPhase(state);
      expect(isOk(end)).toBe(true);
      if (isOk(end)) {
        expect(end.value.phase).toBe('end');
        state = end.value;
      }

      // End -> Draw (next turn)
      const nextTurn = nextPhase(state);
      expect(isOk(nextTurn)).toBe(true);
      if (isOk(nextTurn)) {
        expect(nextTurn.value.phase).toBe('draw');
        expect(nextTurn.value.currentPlayer).toBe(1); // Switched player
        expect(nextTurn.value.turnCount).toBe(2);
        expect(nextTurn.value.canEnterBattle).toBe(true); // Now allowed
      }
    });
  });

  describe('isMainPhase', () => {
    it('should return true for main1', () => {
      const state = createTurnState(0);
      const main1 = skipToPhase(state, 'main1');
      if (isOk(main1)) {
        expect(isMainPhase(main1.value)).toBe(true);
      }
    });

    it('should return true for main2', () => {
      const state = createTurnState(0);
      const main2 = skipToPhase(state, 'main2');
      if (isOk(main2)) {
        expect(isMainPhase(main2.value)).toBe(true);
      }
    });

    it('should return false for battle', () => {
      const state = createTurnState(0);
      const battle = skipToPhase(state, 'battle');
      if (isOk(battle)) {
        expect(isMainPhase(battle.value)).toBe(false);
      }
    });
  });

  describe('isBattlePhase', () => {
    it('should return true during battle', () => {
      const state = createTurnState(0);
      const battle = skipToPhase(state, 'battle');
      if (isOk(battle)) {
        expect(isBattlePhase(battle.value)).toBe(true);
      }
    });

    it('should return false during main', () => {
      const state = createTurnState(0);
      const main1 = skipToPhase(state, 'main1');
      if (isOk(main1)) {
        expect(isBattlePhase(main1.value)).toBe(false);
      }
    });
  });

  describe('isDrawPhase', () => {
    it('should return true during draw', () => {
      const state = createTurnState(0);
      expect(isDrawPhase(state)).toBe(true);
    });

    it('should return false during other phases', () => {
      const state = createTurnState(0);
      const main1 = skipToPhase(state, 'main1');
      if (isOk(main1)) {
        expect(isDrawPhase(main1.value)).toBe(false);
      }
    });
  });

  describe('canNormalSummon', () => {
    it('should allow summon during main phase', () => {
      const state = createTurnState(0);
      const main1 = skipToPhase(state, 'main1');
      if (isOk(main1)) {
        const canSummon = canNormalSummon(main1.value);
        expect(isOk(canSummon)).toBe(true);
      }
    });

    it('should deny summon during battle phase', () => {
      const state = createTurnState(0);
      const battle = skipToPhase(state, 'battle');
      if (isOk(battle)) {
        const canSummon = canNormalSummon(battle.value);
        expect(isErr(canSummon)).toBe(true);
        if (isErr(canSummon)) {
          expect(canSummon.error).toBe('Can only summon during Main Phase');
        }
      }
    });

    it('should deny summon if already summoned', () => {
      const state = createTurnState(0);
      const main1 = skipToPhase(state, 'main1');
      if (isOk(main1)) {
        const marked = markNormalSummon(main1.value);
        if (isOk(marked)) {
          const canSummon = canNormalSummon(marked.value);
          expect(isErr(canSummon)).toBe(true);
          if (isErr(canSummon)) {
            expect(canSummon.error).toBe('Already normal summoned this turn');
          }
        }
      }
    });
  });

  describe('markNormalSummon', () => {
    it('should mark that a summon occurred', () => {
      const state = createTurnState(0);
      const main1 = skipToPhase(state, 'main1');
      if (isOk(main1)) {
        const marked = markNormalSummon(main1.value);
        expect(isOk(marked)).toBe(true);
        if (isOk(marked)) {
          expect(marked.value.hasNormalSummoned).toBe(true);
        }
      }
    });

    it('should fail if not in main phase', () => {
      const state = createTurnState(0);
      const marked = markNormalSummon(state);
      expect(isErr(marked)).toBe(true);
    });
  });

  describe('canEnterBattle', () => {
    it('should allow battle on second turn', () => {
      let state = createTurnState(0);
      // Go through full turn
      for (let i = 0; i < 6; i++) {
        const next = nextPhase(state);
        if (isOk(next)) state = next.value;
      }
      // Now on turn 2
      const battle = skipToPhase(state, 'battle');
      if (isOk(battle)) {
        const canBattle = canEnterBattle(battle.value);
        expect(isOk(canBattle)).toBe(true);
      }
    });

    it('should deny battle on first turn', () => {
      const state = createTurnState(0);
      const battle = skipToPhase(state, 'battle');
      if (isOk(battle)) {
        const canBattle = canEnterBattle(battle.value);
        expect(isErr(canBattle)).toBe(true);
        if (isErr(canBattle)) {
          expect(canBattle.error).toBe('Cannot attack on first turn');
        }
      }
    });
  });

  describe('canActivateSpell', () => {
    it('should allow spell during main phase', () => {
      const state = createTurnState(0);
      const main1 = skipToPhase(state, 'main1');
      if (isOk(main1)) {
        const canSpell = canActivateSpell(main1.value);
        expect(isOk(canSpell)).toBe(true);
      }
    });

    it('should deny spell during battle', () => {
      const state = createTurnState(0);
      const battle = skipToPhase(state, 'battle');
      if (isOk(battle)) {
        const canSpell = canActivateSpell(battle.value);
        expect(isErr(canSpell)).toBe(true);
      }
    });
  });

  describe('canSetTrap', () => {
    it('should allow setting trap during main phase', () => {
      const state = createTurnState(0);
      const main1 = skipToPhase(state, 'main1');
      if (isOk(main1)) {
        const canSet = canSetTrap(main1.value);
        expect(isOk(canSet)).toBe(true);
      }
    });
  });

  describe('getPhaseName', () => {
    it('should return correct phase names', () => {
      expect(getPhaseName('draw')).toBe('Draw Phase');
      expect(getPhaseName('standby')).toBe('Standby Phase');
      expect(getPhaseName('main1')).toBe('Main Phase 1');
      expect(getPhaseName('battle')).toBe('Battle Phase');
      expect(getPhaseName('main2')).toBe('Main Phase 2');
      expect(getPhaseName('end')).toBe('End Phase');
    });
  });

  describe('skipToPhase', () => {
    it('should skip to target phase', () => {
      const state = createTurnState(0);
      const battle = skipToPhase(state, 'battle');
      expect(isOk(battle)).toBe(true);
      if (isOk(battle)) {
        expect(battle.value.phase).toBe('battle');
      }
    });

    it('should fail when skipping backwards', () => {
      const state = createTurnState(0);
      const battle = skipToPhase(state, 'battle');
      if (isOk(battle)) {
        const backwards = skipToPhase(battle.value, 'main1');
        expect(isErr(backwards)).toBe(true);
      }
    });
  });
});
