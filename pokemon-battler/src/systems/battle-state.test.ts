import { createBattle, executeMove, applyDamage, nextTurn } from './battle-state';
import { POKEMON_SPECIES } from '../data/pokemon-data';

describe('Battle State', () => {
  describe('createBattle', () => {
    it('should initialize battle with both Pokemon at full HP', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);

      expect(battle.player.currentHP).toBe(charizard.baseHP);
      expect(battle.opponent.currentHP).toBe(blastoise.baseHP);
    });

    it('should start at turn 1', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);

      expect(battle.turn).toBe(1);
    });

    it('should have no winner initially', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);

      expect(battle.winner).toBeNull();
    });

    it('should initialize battle log with entry messages', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);

      expect(battle.log.length).toBeGreaterThan(0);
      expect(battle.log[0].message).toContain('Charizard');
    });

    it('should initialize all moves with full PP', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);

      battle.player.moves.forEach(moveSlot => {
        expect(moveSlot.currentPP).toBe(moveSlot.move.maxPP);
      });

      battle.opponent.moves.forEach(moveSlot => {
        expect(moveSlot.currentPP).toBe(moveSlot.move.maxPP);
      });
    });
  });

  describe('executeMove', () => {
    it('should reduce defender HP', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);
      const initialHP = battle.opponent.currentHP;

      const result = executeMove(battle, 'player', 0); // Flamethrower

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.opponent.currentHP).toBeLessThan(initialHP);
      }
    });

    it('should reduce move PP after use', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);
      const initialPP = battle.player.moves[0].currentPP;

      const result = executeMove(battle, 'player', 0);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.player.moves[0].currentPP).toBe(initialPP - 1);
      }
    });

    it('should fail if move has no PP', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      let battle = createBattle(charizard, blastoise, 12345);

      // Reduce PP to 0
      battle = {
        ...battle,
        player: {
          ...battle.player,
          moves: battle.player.moves.map((slot, i) =>
            i === 0 ? { ...slot, currentPP: 0 } : slot
          ),
        },
      };

      const result = executeMove(battle, 'player', 0);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('PP');
      }
    });

    it('should fail with invalid move index', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);

      const result = executeMove(battle, 'player', 99);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Invalid move index');
      }
    });

    it('should add log entries for move execution', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);
      const initialLogLength = battle.log.length;

      const result = executeMove(battle, 'player', 0);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.log.length).toBeGreaterThan(initialLogLength);
        const lastLog = result.value.log[result.value.log.length - 1];
        expect(lastLog.message).toBeTruthy();
      }
    });

    it('should detect KO when HP reaches 0', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const pikachu = POKEMON_SPECIES['pikachu'];
      let battle = createBattle(charizard, pikachu, 12345);

      // Reduce Pikachu HP to very low
      battle = {
        ...battle,
        opponent: {
          ...battle.opponent,
          currentHP: 1,
        },
      };

      const result = executeMove(battle, 'player', 0);

      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.opponent.currentHP).toBe(0);
        expect(result.value.winner).toBe('player');
        expect(result.value.log.some(entry => entry.message.includes('fainted'))).toBe(true);
      }
    });

    it('should fail if battle is already over', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      let battle = createBattle(charizard, blastoise, 12345);

      battle = {
        ...battle,
        winner: 'player',
      };

      const result = executeMove(battle, 'player', 0);

      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('already over');
      }
    });
  });

  describe('applyDamage', () => {
    it('should reduce HP by damage amount', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);
      const pokemon = battle.player;
      const damage = 20;

      const damaged = applyDamage(pokemon, damage);

      expect(damaged.currentHP).toBe(pokemon.currentHP - damage);
    });

    it('should not reduce HP below 0', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);
      const pokemon = battle.player;
      const damage = 9999;

      const damaged = applyDamage(pokemon, damage);

      expect(damaged.currentHP).toBe(0);
    });

    it('should not mutate original pokemon', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);
      const pokemon = battle.player;
      const originalHP = pokemon.currentHP;

      applyDamage(pokemon, 20);

      expect(pokemon.currentHP).toBe(originalHP);
    });
  });

  describe('nextTurn', () => {
    it('should increment turn counter', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);
      const initialTurn = battle.turn;

      const nextBattle = nextTurn(battle);

      expect(nextBattle.turn).toBe(initialTurn + 1);
    });

    it('should not mutate original battle', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const battle = createBattle(charizard, blastoise, 12345);
      const originalTurn = battle.turn;

      nextTurn(battle);

      expect(battle.turn).toBe(originalTurn);
    });
  });

  describe('Deterministic battle simulation', () => {
    it('should produce identical battles with same seed', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      const blastoise = POKEMON_SPECIES['blastoise'];
      const seed = 42;

      // Battle 1
      let battle1 = createBattle(charizard, blastoise, seed);
      let result1 = executeMove(battle1, 'player', 0);
      if (result1.ok) battle1 = result1.value;
      result1 = executeMove(battle1, 'opponent', 0);
      if (result1.ok) battle1 = result1.value;

      // Battle 2
      let battle2 = createBattle(charizard, blastoise, seed);
      let result2 = executeMove(battle2, 'player', 0);
      if (result2.ok) battle2 = result2.value;
      result2 = executeMove(battle2, 'opponent', 0);
      if (result2.ok) battle2 = result2.value;

      expect(battle1.player.currentHP).toBe(battle2.player.currentHP);
      expect(battle1.opponent.currentHP).toBe(battle2.opponent.currentHP);
    });
  });
});
