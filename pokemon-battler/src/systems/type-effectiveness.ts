/**
 * Type Effectiveness System
 *
 * Determines damage multipliers based on move type vs Pokemon type
 */

import { PokemonType } from '../types/pokemon';

/**
 * Type effectiveness chart
 * Maps [attackType][defenseType] to multiplier
 */
const TYPE_CHART: Record<PokemonType, Record<PokemonType, number>> = {
  Fire: {
    Fire: 1.0,
    Water: 0.5,
    Grass: 2.0,
    Electric: 1.0,
    Normal: 1.0,
  },
  Water: {
    Fire: 2.0,
    Water: 1.0,
    Grass: 0.5,
    Electric: 1.0,
    Normal: 1.0,
  },
  Grass: {
    Fire: 0.5,
    Water: 2.0,
    Grass: 1.0,
    Electric: 1.0,
    Normal: 1.0,
  },
  Electric: {
    Fire: 1.0,
    Water: 2.0,
    Grass: 1.0,
    Electric: 1.0,
    Normal: 1.0,
  },
  Normal: {
    Fire: 1.0,
    Water: 1.0,
    Grass: 1.0,
    Electric: 1.0,
    Normal: 1.0,
  },
};

/**
 * Get type effectiveness multiplier
 * @param moveType The type of the attacking move
 * @param targetType The type of the defending Pokemon
 * @returns Multiplier (2.0 = super effective, 1.0 = neutral, 0.5 = not very effective)
 */
export function getTypeMultiplier(moveType: PokemonType, targetType: PokemonType): number {
  return TYPE_CHART[moveType][targetType];
}
