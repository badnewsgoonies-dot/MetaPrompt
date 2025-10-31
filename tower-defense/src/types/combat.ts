import type { Element } from './tower';

export interface DamageCalculation {
  readonly baseDamage: number;
  readonly finalDamage: number;
  readonly multiplier: number;
  readonly isCritical: boolean;
}

export type DamageMultiplier = 0.5 | 1.0 | 1.5;

// Elemental weakness system
// Fire → Strong vs Earth | Weak vs Water
// Water → Strong vs Fire | Weak vs Earth
// Earth → Strong vs Air | Weak vs Fire
// Air → Strong vs Water | Weak vs Earth

export const getElementalMultiplier = (
  attackElement: Element,
  defenseElement: Element
): DamageMultiplier => {
  const weaknesses: Record<Element, Element> = {
    fire: 'water',
    water: 'earth',
    earth: 'fire',
    air: 'water',
  };

  const strengths: Record<Element, Element> = {
    fire: 'earth',
    water: 'fire',
    earth: 'air',
    air: 'water',
  };

  if (strengths[attackElement] === defenseElement) {
    return 1.5; // Strong against
  }

  if (weaknesses[attackElement] === defenseElement) {
    return 0.5; // Weak against
  }

  return 1.0; // Neutral
};

export const calculateDamage = (
  baseDamage: number,
  attackElement: Element,
  defenseElement: Element
): DamageCalculation => {
  const multiplier = getElementalMultiplier(attackElement, defenseElement);
  const finalDamage = Math.floor(baseDamage * multiplier);

  return {
    baseDamage,
    finalDamage,
    multiplier,
    isCritical: multiplier > 1.0,
  };
};
