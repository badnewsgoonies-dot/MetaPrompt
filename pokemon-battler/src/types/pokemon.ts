/**
 * Type definitions for Pokemon Battle System
 */

export type PokemonType = 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Normal';

/**
 * Represents a move that Pokemon can use in battle
 */
export interface Move {
  readonly name: string;
  readonly type: PokemonType;
  readonly power: number;
  readonly maxPP: number;
}

/**
 * Represents a Pokemon species with base stats
 */
export interface PokemonSpecies {
  readonly id: string;
  readonly name: string;
  readonly type: PokemonType;
  readonly baseHP: number;
  readonly baseAttack: number;
  readonly baseDefense: number;
  readonly baseSpeed: number;
  readonly moveNames: readonly string[];
}

/**
 * Represents a Pokemon instance in battle with current state
 */
export interface PokemonInstance {
  readonly species: PokemonSpecies;
  readonly currentHP: number;
  readonly moves: ReadonlyArray<MoveSlot>;
}

/**
 * Represents a move equipped on a Pokemon with current PP
 */
export interface MoveSlot {
  readonly move: Move;
  readonly currentPP: number;
}

/**
 * Result type for operations that can fail
 */
export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };
