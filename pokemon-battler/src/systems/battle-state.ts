/**
 * Battle State Manager
 *
 * Manages the state of a Pokemon battle including turn execution,
 * damage application, and win condition detection
 */

import { PokemonInstance, PokemonSpecies, MoveSlot, Result } from '../types/pokemon';
import { SeededRNG } from '../utils/seeded-rng';
import { getMove } from '../data/move-data';
import { calculateDamage } from './damage-calculator';

export interface BattleLogEntry {
  readonly turn: number;
  readonly message: string;
}

export interface BattleState {
  readonly player: PokemonInstance;
  readonly opponent: PokemonInstance;
  readonly turn: number;
  readonly winner: 'player' | 'opponent' | null;
  readonly log: readonly BattleLogEntry[];
  readonly rng: SeededRNG;
}

/**
 * Create a new battle instance
 * @param playerSpecies Player's Pokemon species
 * @param opponentSpecies Opponent's Pokemon species
 * @param seed RNG seed for deterministic battles
 */
export function createBattle(
  playerSpecies: PokemonSpecies,
  opponentSpecies: PokemonSpecies,
  seed: number
): BattleState {
  const playerInstance = createPokemonInstance(playerSpecies);
  const opponentInstance = createPokemonInstance(opponentSpecies);

  return {
    player: playerInstance,
    opponent: opponentInstance,
    turn: 1,
    winner: null,
    log: [
      { turn: 0, message: `Go! ${playerSpecies.name}!` },
      { turn: 0, message: `Opponent sent out ${opponentSpecies.name}!` },
    ],
    rng: new SeededRNG(seed),
  };
}

/**
 * Create a Pokemon instance from species data
 */
function createPokemonInstance(species: PokemonSpecies): PokemonInstance {
  const moves: MoveSlot[] = species.moveNames.map(moveName => {
    const move = getMove(moveName);
    if (!move) {
      throw new Error(`Move not found: ${moveName}`);
    }
    return {
      move,
      currentPP: move.maxPP,
    };
  });

  return {
    species,
    currentHP: species.baseHP,
    moves,
  };
}

/**
 * Execute a move in battle
 * @param state Current battle state
 * @param attacker Which Pokemon is attacking ('player' or 'opponent')
 * @param moveIndex Index of the move to use (0-3)
 */
export function executeMove(
  state: BattleState,
  attacker: 'player' | 'opponent',
  moveIndex: number
): Result<BattleState, string> {
  // Check if battle is already over
  if (state.winner !== null) {
    return { ok: false, error: 'Battle is already over' };
  }

  const attackingPokemon = attacker === 'player' ? state.player : state.opponent;
  const defendingPokemon = attacker === 'player' ? state.opponent : state.player;

  // Validate move index
  if (moveIndex < 0 || moveIndex >= attackingPokemon.moves.length) {
    return { ok: false, error: 'Invalid move index' };
  }

  const moveSlot = attackingPokemon.moves[moveIndex];

  // Check PP
  if (moveSlot.currentPP <= 0) {
    return { ok: false, error: 'Move has no PP remaining' };
  }

  // Calculate damage
  const damageResult = calculateDamage(
    attackingPokemon,
    defendingPokemon,
    moveSlot.move,
    state.rng
  );

  // Apply damage and reduce PP
  const updatedAttacker = reducePP(attackingPokemon, moveIndex);
  const updatedDefender = applyDamage(defendingPokemon, damageResult.damage);

  // Build new state
  let newState: BattleState = {
    ...state,
    player: attacker === 'player' ? updatedAttacker : updatedDefender,
    opponent: attacker === 'player' ? updatedDefender : updatedAttacker,
  };

  // Add battle log entries
  const attackerName = attackingPokemon.species.name;
  const defenderName = defendingPokemon.species.name;

  newState = addLogEntry(
    newState,
    `${attackerName} used ${moveSlot.move.name}!`
  );

  if (damageResult.isCritical) {
    newState = addLogEntry(newState, 'A critical hit!');
  }

  if (damageResult.effectiveness > 1.0) {
    newState = addLogEntry(newState, "It's super effective!");
  } else if (damageResult.effectiveness < 1.0) {
    newState = addLogEntry(newState, "It's not very effective...");
  }

  // Check for KO
  if (updatedDefender.currentHP <= 0) {
    newState = addLogEntry(newState, `${defenderName} fainted!`);
    newState = {
      ...newState,
      winner: attacker,
    };
    newState = addLogEntry(
      newState,
      `${attacker === 'player' ? 'Player' : 'Opponent'} wins!`
    );
  }

  return { ok: true, value: newState };
}

/**
 * Apply damage to a Pokemon
 */
export function applyDamage(pokemon: PokemonInstance, damage: number): PokemonInstance {
  const newHP = Math.max(0, pokemon.currentHP - damage);
  return {
    ...pokemon,
    currentHP: newHP,
  };
}

/**
 * Reduce PP for a move
 */
function reducePP(pokemon: PokemonInstance, moveIndex: number): PokemonInstance {
  const newMoves = pokemon.moves.map((slot, i) => {
    if (i === moveIndex) {
      return {
        ...slot,
        currentPP: Math.max(0, slot.currentPP - 1),
      };
    }
    return slot;
  });

  return {
    ...pokemon,
    moves: newMoves,
  };
}

/**
 * Add a log entry to battle state
 */
function addLogEntry(state: BattleState, message: string): BattleState {
  return {
    ...state,
    log: [...state.log, { turn: state.turn, message }],
  };
}

/**
 * Advance to next turn
 */
export function nextTurn(state: BattleState): BattleState {
  return {
    ...state,
    turn: state.turn + 1,
  };
}
