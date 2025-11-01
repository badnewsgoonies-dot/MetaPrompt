/**
 * Damage Calculator
 *
 * Calculates battle damage using Pokemon formula with type effectiveness and critical hits
 */

import { Move, PokemonInstance } from '../types/pokemon';
import { SeededRNG } from '../utils/seeded-rng';
import { getTypeMultiplier } from './type-effectiveness';

export interface DamageResult {
  readonly damage: number;
  readonly isCritical: boolean;
  readonly effectiveness: number;
}

const LEVEL = 50; // All Pokemon are level 50
const CRIT_CHANCE = 0.0625; // 6.25% critical hit chance
const CRIT_MULTIPLIER = 1.5;

/**
 * Calculate damage from an attack
 *
 * Uses standard Pokemon damage formula:
 * damage = ((2 * Level / 5 + 2) * Power * (Attack / Defense) / 50 + 2) * Modifiers
 *
 * @param attacker The attacking Pokemon
 * @param defender The defending Pokemon
 * @param move The move being used
 * @param rng Seeded RNG for critical hit determination
 * @returns Damage result with amount, crit flag, and effectiveness
 */
export function calculateDamage(
  attacker: PokemonInstance,
  defender: PokemonInstance,
  move: Move,
  rng: SeededRNG
): DamageResult {
  // Determine critical hit
  const isCritical = rng.nextFloat() < CRIT_CHANCE;

  // Get type effectiveness
  const effectiveness = getTypeMultiplier(move.type, defender.species.type);

  // Calculate base damage using Pokemon formula
  const levelMultiplier = (2 * LEVEL) / 5 + 2;
  const attackRatio = attacker.species.baseAttack / defender.species.baseDefense;
  const baseDamage = (levelMultiplier * move.power * attackRatio) / 50 + 2;

  // Apply modifiers
  let multiplier = effectiveness;
  if (isCritical) {
    multiplier *= CRIT_MULTIPLIER;
  }

  // Calculate final damage (minimum 1)
  const finalDamage = Math.max(1, Math.floor(baseDamage * multiplier));

  return {
    damage: finalDamage,
    isCritical,
    effectiveness,
  };
}
