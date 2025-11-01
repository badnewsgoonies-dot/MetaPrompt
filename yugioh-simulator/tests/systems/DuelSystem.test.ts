/**
 * DuelSystem Tests
 * Full integration tests for duel mechanics
 */

import { describe, it, expect } from '@jest/globals';
import {
  initializeDuel,
  getCurrentPlayer,
  getOpponent,
  advancePhase,
  performSummon,
  performSet,
  attack,
  calculateBattle,
  isDuelOver,
  getWinner,
} from '../../src/systems/DuelSystem';
import { MonsterCard, Card } from '../../src/utils/card-data';
import { FieldCard } from '../../src/systems/CardSystem';
import { isOk, isErr, unwrap } from '../../src/utils/result-type';
import { skipToPhase } from '../../src/systems/TurnSystem';

describe('DuelSystem', () => {
  describe('initializeDuel', () => {
    it('should initialize duel with correct starting state', () => {
      const state = initializeDuel(12345);

      expect(state.player1.lifePoints).toBe(8000);
      expect(state.player2.lifePoints).toBe(8000);
      expect(state.player1.zones.hand).toHaveLength(5);
      expect(state.player2.zones.hand).toHaveLength(5);
      expect(state.player1.zones.deck).toHaveLength(15);
      expect(state.player2.zones.deck).toHaveLength(15);
      expect(state.turnState.currentPlayer).toBe(0);
      expect(state.turnState.turnCount).toBe(1);
      expect(state.winner).toBeNull();
    });

    it('should shuffle deck deterministically', () => {
      const state1 = initializeDuel(12345);
      const state2 = initializeDuel(12345);

      // Same seed = same shuffle
      expect(state1.player1.zones.deck[0].id).toBe(
        state2.player1.zones.deck[0].id
      );
      expect(state1.player1.zones.hand[0].id).toBe(
        state2.player1.zones.hand[0].id
      );
    });

    it('should shuffle differently with different seeds', () => {
      const state1 = initializeDuel(12345);
      const state2 = initializeDuel(67890);

      // Different seeds = different shuffles
      const deck1Order = state1.player1.zones.deck.map((c: { id: string }) => c.id).join(',');
      const deck2Order = state2.player1.zones.deck.map((c: { id: string }) => c.id).join(',');

      expect(deck1Order).not.toBe(deck2Order);
    });
  });

  describe('getCurrentPlayer and getOpponent', () => {
    it('should get current player and opponent', () => {
      const state = initializeDuel(12345);

      const current = getCurrentPlayer(state);
      const opponent = getOpponent(state);

      expect(current.id).toBe(0);
      expect(opponent.id).toBe(1);
    });

    it('should swap after turn ends', () => {
      let state = initializeDuel(12345);

      // Advance through all phases to end turn
      for (let i = 0; i < 6; i++) {
        const result = advancePhase(state);
        if (isOk(result)) state = result.value;
      }

      const current = getCurrentPlayer(state);
      expect(current.id).toBe(1);
    });
  });

  describe('advancePhase', () => {
    it('should draw card on draw phase', () => {
      let state = initializeDuel(12345);

      // Go to next turn's draw phase (6 advances = end of turn 1 + draw phase of turn 2)
      for (let i = 0; i < 6; i++) {
        const result = advancePhase(state);
        if (isOk(result)) state = result.value;
      }

      // Current player is now player 2 (after turn switch)
      const player2 = getCurrentPlayer(state);
      expect(player2.zones.hand).toHaveLength(6); // 5 starting + 1 drawn
    });

    it('should end duel when deck runs out', () => {
      let state = initializeDuel(12345);
      // Empty player 1's deck
      state.player1.zones.deck = [];

      // Advance through turn 1 to get to turn 2's draw phase (when player 1 draws again)
      for (let i = 0; i < 6; i++) {
        const result = advancePhase(state);
        if (isOk(result)) state = result.value;
      }

      // Now advance through player 2's turn to get back to player 1
      for (let i = 0; i < 6; i++) {
        const result = advancePhase(state);
        if (isOk(result)) state = result.value;
      }

      // Player 1 tries to draw with empty deck - should lose
      expect(state.winner).toBe(1); // Player 2 wins
    });

    it('should remove summoning sickness on new turn', () => {
      let state = initializeDuel(12345);

      // Place a monster on field
      state.player1.zones.monsterZone[0] = {
        card: state.player1.zones.hand[0],
        position: 'attack',
        faceState: 'up',
        canAttack: false,
        hasAttacked: false,
      };

      // Advance to next turn
      for (let i = 0; i < 6; i++) {
        const result = advancePhase(state);
        if (isOk(result)) state = result.value;
      }

      // Monster should no longer have summoning sickness (after turn passed)
      expect(state.player1.zones.monsterZone[0]?.hasAttacked).toBe(false);
    });
  });

  describe('performSummon', () => {
    it('should summon level 4 monster', () => {
      let state = initializeDuel(12345);

      // Skip to main phase
      state.turnState = unwrap(skipToPhase(state.turnState, 'main1'));

      // Find a level 4 monster in hand
      const level4 = state.player1.zones.hand.find(
        (c: Card) => c.type === 'Monster' && (c as MonsterCard).level === 4
      );

      if (level4) {
        const result = performSummon(state, level4.id, 'attack', []);
        expect(isOk(result)).toBe(true);

        if (isOk(result)) {
          expect(result.value.player1.zones.monsterZone[0]).not.toBeNull();
          expect(result.value.turnState.hasNormalSummoned).toBe(true);
        }
      }
    });

    it('should fail when not in main phase', () => {
      const state = initializeDuel(12345);

      const result = performSummon(state, 'm3', 'attack', []);
      expect(isErr(result)).toBe(true);
    });

    it('should fail when already summoned', () => {
      let state = initializeDuel(12345);
      state.turnState = unwrap(skipToPhase(state.turnState, 'main1'));
      state.turnState.hasNormalSummoned = true;

      const result = performSummon(state, 'm3', 'attack', []);
      expect(isErr(result)).toBe(true);
    });
  });

  describe('performSet', () => {
    it('should set monster face-down', () => {
      let state = initializeDuel(12345);
      state.turnState = unwrap(skipToPhase(state.turnState, 'main1'));

      const level4 = state.player1.zones.hand.find(
        (c: Card) => c.type === 'Monster' && (c as MonsterCard).level === 4
      );

      if (level4) {
        const result = performSet(state, level4.id, []);
        expect(isOk(result)).toBe(true);

        if (isOk(result)) {
          expect(result.value.player1.zones.monsterZone[0]?.faceState).toBe(
            'down'
          );
          expect(result.value.turnState.hasNormalSummoned).toBe(true);
        }
      }
    });
  });

  describe('calculateBattle', () => {
    const createMonster = (attack: number, defense: number): MonsterCard => ({
      id: 'test',
      name: 'Test Monster',
      type: 'Monster',
      level: 4,
      attack,
      defense,
      attribute: 'DARK',
    });

    const createFieldCard = (
      monster: MonsterCard,
      position: 'attack' | 'defense'
    ): FieldCard => ({
      card: monster,
      position,
      faceState: 'up',
      canAttack: true,
      hasAttacked: false,
    });

    it('should destroy weaker monster in attack position', () => {
      const attacker = createMonster(2000, 1000);
      const defender = createFieldCard(createMonster(1500, 1000), 'attack');

      const result = calculateBattle(attacker, defender);

      expect(result.attackerDestroyed).toBe(false);
      expect(result.defenderDestroyed).toBe(true);
      expect(result.damageToDefender).toBe(500);
      expect(result.damageToAttacker).toBe(0);
    });

    it('should destroy attacker when defender is stronger', () => {
      const attacker = createMonster(1500, 1000);
      const defender = createFieldCard(createMonster(2000, 1000), 'attack');

      const result = calculateBattle(attacker, defender);

      expect(result.attackerDestroyed).toBe(true);
      expect(result.defenderDestroyed).toBe(false);
      expect(result.damageToAttacker).toBe(500);
      expect(result.damageToDefender).toBe(0);
    });

    it('should destroy both when attack is equal', () => {
      const attacker = createMonster(2000, 1000);
      const defender = createFieldCard(createMonster(2000, 1000), 'attack');

      const result = calculateBattle(attacker, defender);

      expect(result.attackerDestroyed).toBe(true);
      expect(result.defenderDestroyed).toBe(true);
      expect(result.damageToAttacker).toBe(0);
      expect(result.damageToDefender).toBe(0);
    });

    it('should destroy defender in defense if attack > defense', () => {
      const attacker = createMonster(2000, 1000);
      const defender = createFieldCard(createMonster(1500, 1500), 'defense');

      const result = calculateBattle(attacker, defender);

      expect(result.attackerDestroyed).toBe(false);
      expect(result.defenderDestroyed).toBe(true);
      expect(result.damageToAttacker).toBe(0);
      expect(result.damageToDefender).toBe(0); // No damage when attacking defense
    });

    it('should damage attacker if defense > attack', () => {
      const attacker = createMonster(1500, 1000);
      const defender = createFieldCard(createMonster(1000, 2000), 'defense');

      const result = calculateBattle(attacker, defender);

      expect(result.attackerDestroyed).toBe(false);
      expect(result.defenderDestroyed).toBe(false);
      expect(result.damageToAttacker).toBe(500);
      expect(result.damageToDefender).toBe(0);
    });
  });

  describe('attack', () => {
    it('should perform direct attack when no monsters', () => {
      let state = initializeDuel(12345);
      state.turnState = unwrap(skipToPhase(state.turnState, 'battle'));
      state.turnState.canEnterBattle = true;

      // Give player 1 a monster
      state.player1.zones.monsterZone[0] = {
        card: { id: 'm1', name: 'Test', type: 'Monster', level: 4, attack: 2000, defense: 1000, attribute: 'DARK' },
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      const result = attack(state, 0, null);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.player2.lifePoints).toBe(6000); // 8000 - 2000
        expect(result.value.player1.zones.monsterZone[0]?.hasAttacked).toBe(
          true
        );
      }
    });

    it('should fail direct attack when opponent has monsters', () => {
      let state = initializeDuel(12345);
      state.turnState = unwrap(skipToPhase(state.turnState, 'battle'));
      state.turnState.canEnterBattle = true;

      state.player1.zones.monsterZone[0] = {
        card: { id: 'm1', name: 'Test', type: 'Monster', level: 4, attack: 2000, defense: 1000, attribute: 'DARK' },
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      state.player2.zones.monsterZone[0] = {
        card: { id: 'm2', name: 'Test2', type: 'Monster', level: 4, attack: 1500, defense: 1000, attribute: 'DARK' },
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      const result = attack(state, 0, null);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Cannot direct attack while opponent has monsters');
      }
    });

    it('should battle monsters and deal damage', () => {
      let state = initializeDuel(12345);
      state.turnState = unwrap(skipToPhase(state.turnState, 'battle'));
      state.turnState.canEnterBattle = true;

      state.player1.zones.monsterZone[0] = {
        card: { id: 'm1', name: 'Attacker', type: 'Monster', level: 4, attack: 2000, defense: 1000, attribute: 'DARK' },
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      state.player2.zones.monsterZone[0] = {
        card: { id: 'm2', name: 'Defender', type: 'Monster', level: 4, attack: 1500, defense: 1000, attribute: 'DARK' },
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      const result = attack(state, 0, 0);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.player2.zones.monsterZone[0]).toBeNull(); // Destroyed
        expect(result.value.player2.lifePoints).toBe(7500); // 8000 - 500
      }
    });

    it('should trigger win condition when LP reaches 0', () => {
      let state = initializeDuel(12345);
      state.turnState = unwrap(skipToPhase(state.turnState, 'battle'));
      state.turnState.canEnterBattle = true;

      state.player1.zones.monsterZone[0] = {
        card: { id: 'm1', name: 'Strong', type: 'Monster', level: 8, attack: 9000, defense: 1000, attribute: 'DARK' },
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      const result = attack(state, 0, null);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.winner).toBe(0); // Player 1 wins
        expect(isDuelOver(result.value)).toBe(true);
        expect(getWinner(result.value)).toBe(0);
      }
    });

    it('should fail when monster has summoning sickness', () => {
      let state = initializeDuel(12345);
      state.turnState = unwrap(skipToPhase(state.turnState, 'battle'));
      state.turnState.canEnterBattle = true;

      state.player1.zones.monsterZone[0] = {
        card: { id: 'm1', name: 'Test', type: 'Monster', level: 4, attack: 2000, defense: 1000, attribute: 'DARK' },
        position: 'attack',
        faceState: 'up',
        canAttack: false, // Summoning sickness
        hasAttacked: false,
      };

      const result = attack(state, 0, null);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Monster has summoning sickness');
      }
    });

    it('should fail when monster already attacked', () => {
      let state = initializeDuel(12345);
      state.turnState = unwrap(skipToPhase(state.turnState, 'battle'));
      state.turnState.canEnterBattle = true;

      state.player1.zones.monsterZone[0] = {
        card: { id: 'm1', name: 'Test', type: 'Monster', level: 4, attack: 2000, defense: 1000, attribute: 'DARK' },
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: true, // Already attacked
      };

      const result = attack(state, 0, null);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Monster already attacked this turn');
      }
    });

    it('should fail when not in battle phase', () => {
      const state = initializeDuel(12345);
      const result = attack(state, 0, null);

      expect(isErr(result)).toBe(true);
    });
  });

  describe('isDuelOver and getWinner', () => {
    it('should return false when duel ongoing', () => {
      const state = initializeDuel(12345);
      expect(isDuelOver(state)).toBe(false);
      expect(getWinner(state)).toBeNull();
    });

    it('should return true when winner declared', () => {
      const state = initializeDuel(12345);
      state.winner = 0;
      expect(isDuelOver(state)).toBe(true);
      expect(getWinner(state)).toBe(0);
    });
  });
});
