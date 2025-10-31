/**
 * Move Database
 *
 * Contains all available moves in the Pokemon battler
 */

import { Move, PokemonType } from '../types/pokemon';

export const MOVES: Record<string, Move> = {
  // Fire moves
  'Flamethrower': {
    name: 'Flamethrower',
    type: 'Fire' as PokemonType,
    power: 90,
    maxPP: 15,
  },
  'Fire Spin': {
    name: 'Fire Spin',
    type: 'Fire' as PokemonType,
    power: 35,
    maxPP: 15,
  },

  // Water moves
  'Hydro Pump': {
    name: 'Hydro Pump',
    type: 'Water' as PokemonType,
    power: 110,
    maxPP: 5,
  },
  'Water Gun': {
    name: 'Water Gun',
    type: 'Water' as PokemonType,
    power: 40,
    maxPP: 25,
  },
  'Ice Beam': {
    name: 'Ice Beam',
    type: 'Water' as PokemonType,
    power: 90,
    maxPP: 10,
  },

  // Grass moves
  'Solar Beam': {
    name: 'Solar Beam',
    type: 'Grass' as PokemonType,
    power: 120,
    maxPP: 10,
  },
  'Vine Whip': {
    name: 'Vine Whip',
    type: 'Grass' as PokemonType,
    power: 45,
    maxPP: 25,
  },
  'Razor Leaf': {
    name: 'Razor Leaf',
    type: 'Grass' as PokemonType,
    power: 55,
    maxPP: 25,
  },

  // Electric moves
  'Thunderbolt': {
    name: 'Thunderbolt',
    type: 'Electric' as PokemonType,
    power: 90,
    maxPP: 15,
  },
  'Thunder Shock': {
    name: 'Thunder Shock',
    type: 'Electric' as PokemonType,
    power: 40,
    maxPP: 30,
  },

  // Normal moves
  'Quick Attack': {
    name: 'Quick Attack',
    type: 'Normal' as PokemonType,
    power: 40,
    maxPP: 30,
  },
  'Bite': {
    name: 'Bite',
    type: 'Normal' as PokemonType,
    power: 60,
    maxPP: 25,
  },
  'Air Slash': {
    name: 'Air Slash',
    type: 'Normal' as PokemonType,
    power: 75,
    maxPP: 15,
  },
  'Dragon Claw': {
    name: 'Dragon Claw',
    type: 'Normal' as PokemonType,
    power: 80,
    maxPP: 15,
  },
  'Sludge Bomb': {
    name: 'Sludge Bomb',
    type: 'Normal' as PokemonType,
    power: 90,
    maxPP: 10,
  },
  'Iron Tail': {
    name: 'Iron Tail',
    type: 'Normal' as PokemonType,
    power: 100,
    maxPP: 15,
  },
};

/**
 * Get a move by name
 * @param name Move name
 * @returns Move data or undefined if not found
 */
export function getMove(name: string): Move | undefined {
  return MOVES[name];
}

/**
 * Get all available moves
 */
export function getAllMoves(): Move[] {
  return Object.values(MOVES);
}
