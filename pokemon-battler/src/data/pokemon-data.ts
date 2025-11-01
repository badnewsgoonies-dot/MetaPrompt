/**
 * Pokemon Species Database
 *
 * Contains all available Pokemon species in the battler
 */

import { PokemonSpecies, PokemonType } from '../types/pokemon';

export const POKEMON_SPECIES: Record<string, PokemonSpecies> = {
  'charizard': {
    id: 'charizard',
    name: 'Charizard',
    type: 'Fire' as PokemonType,
    baseHP: 78,
    baseAttack: 84,
    baseDefense: 78,
    baseSpeed: 100,
    moveNames: ['Flamethrower', 'Air Slash', 'Dragon Claw', 'Fire Spin'],
  },
  'blastoise': {
    id: 'blastoise',
    name: 'Blastoise',
    type: 'Water' as PokemonType,
    baseHP: 79,
    baseAttack: 83,
    baseDefense: 100,
    baseSpeed: 78,
    moveNames: ['Hydro Pump', 'Ice Beam', 'Bite', 'Water Gun'],
  },
  'venusaur': {
    id: 'venusaur',
    name: 'Venusaur',
    type: 'Grass' as PokemonType,
    baseHP: 80,
    baseAttack: 82,
    baseDefense: 83,
    baseSpeed: 80,
    moveNames: ['Solar Beam', 'Sludge Bomb', 'Vine Whip', 'Razor Leaf'],
  },
  'pikachu': {
    id: 'pikachu',
    name: 'Pikachu',
    type: 'Electric' as PokemonType,
    baseHP: 35,
    baseAttack: 55,
    baseDefense: 40,
    baseSpeed: 90,
    moveNames: ['Thunderbolt', 'Quick Attack', 'Iron Tail', 'Thunder Shock'],
  },
};

/**
 * Get a Pokemon species by ID
 * @param id Pokemon species ID
 * @returns Pokemon species data or undefined if not found
 */
export function getPokemonSpecies(id: string): PokemonSpecies | undefined {
  return POKEMON_SPECIES[id];
}

/**
 * Get all available Pokemon species
 */
export function getAllPokemonSpecies(): PokemonSpecies[] {
  return Object.values(POKEMON_SPECIES);
}
