import { calculateDamage } from './damage-calculator';
import { PokemonInstance } from '../types/pokemon';
import { POKEMON_SPECIES } from '../data/pokemon-data';
import { MOVES } from '../data/move-data';
import { SeededRNG } from '../utils/seeded-rng';

function createTestPokemon(speciesId: string): PokemonInstance {
  const species = POKEMON_SPECIES[speciesId];
  if (!species) throw new Error(`Species not found: ${speciesId}`);

  const moves = species.moveNames.map(moveName => {
    const move = MOVES[moveName];
    if (!move) throw new Error(`Move not found: ${moveName}`);
    return { move, currentPP: move.maxPP };
  });

  return {
    species,
    currentHP: species.baseHP,
    moves,
  };
}

describe('Damage Calculator', () => {
  describe('Basic damage calculation', () => {
    it('should calculate damage correctly', () => {
      const charizard = createTestPokemon('charizard');
      const blastoise = createTestPokemon('blastoise');
      const flamethrower = MOVES['Flamethrower'];
      const rng = new SeededRNG(12345);

      const result = calculateDamage(charizard, blastoise, flamethrower, rng);

      expect(result.damage).toBeGreaterThan(0);
      expect(result.damage).toBeLessThanOrEqual(100); // Reasonable upper bound
    });

    it('should return minimum 1 damage', () => {
      const pikachu = createTestPokemon('pikachu');
      const blastoise = createTestPokemon('blastoise');
      const thunderShock = MOVES['Thunder Shock'];
      const rng = new SeededRNG(999);

      const result = calculateDamage(pikachu, blastoise, thunderShock, rng);

      expect(result.damage).toBeGreaterThanOrEqual(1);
    });
  });

  describe('Type effectiveness', () => {
    it('should apply super effective multiplier (Fire vs Grass)', () => {
      const charizard = createTestPokemon('charizard');
      const venusaur = createTestPokemon('venusaur');
      const flamethrower = MOVES['Flamethrower'];
      const rng = new SeededRNG(42);

      const result = calculateDamage(charizard, venusaur, flamethrower, rng);

      expect(result.effectiveness).toBe(2.0);
      expect(result.damage).toBeGreaterThan(30); // Should be significant
    });

    it('should apply not very effective multiplier (Fire vs Water)', () => {
      const charizard = createTestPokemon('charizard');
      const blastoise = createTestPokemon('blastoise');
      const flamethrower = MOVES['Flamethrower'];
      const rng = new SeededRNG(42);

      const result = calculateDamage(charizard, blastoise, flamethrower, rng);

      expect(result.effectiveness).toBe(0.5);
    });

    it('should apply neutral multiplier (Normal vs any)', () => {
      const charizard = createTestPokemon('charizard');
      const blastoise = createTestPokemon('blastoise');
      const airSlash = MOVES['Air Slash'];
      const rng = new SeededRNG(42);

      const result = calculateDamage(charizard, blastoise, airSlash, rng);

      expect(result.effectiveness).toBe(1.0);
    });
  });

  describe('Critical hits', () => {
    it('should sometimes land critical hits', () => {
      const charizard = createTestPokemon('charizard');
      const blastoise = createTestPokemon('blastoise');
      const flamethrower = MOVES['Flamethrower'];

      let critCount = 0;
      const trials = 1000;

      for (let i = 0; i < trials; i++) {
        const rng = new SeededRNG(i);
        const result = calculateDamage(charizard, blastoise, flamethrower, rng);
        if (result.isCritical) {
          critCount++;
        }
      }

      // Should be around 6.25% (62-63 out of 1000)
      expect(critCount).toBeGreaterThan(30); // At least 3%
      expect(critCount).toBeLessThan(125); // At most 12.5%
    });

    it('should increase damage on critical hit', () => {
      const charizard = createTestPokemon('charizard');
      const blastoise = createTestPokemon('blastoise');
      const flamethrower = MOVES['Flamethrower'];

      // Find a seed that produces crit and one that doesn't
      let critDamage = 0;
      let normalDamage = 0;

      for (let seed = 0; seed < 1000; seed++) {
        const rng = new SeededRNG(seed);
        const result = calculateDamage(charizard, blastoise, flamethrower, rng);

        if (result.isCritical && critDamage === 0) {
          critDamage = result.damage;
        }
        if (!result.isCritical && normalDamage === 0) {
          normalDamage = result.damage;
        }

        if (critDamage > 0 && normalDamage > 0) break;
      }

      expect(critDamage).toBeGreaterThan(normalDamage);
    });
  });

  describe('Determinism', () => {
    it('should produce same damage with same seed', () => {
      const charizard = createTestPokemon('charizard');
      const blastoise = createTestPokemon('blastoise');
      const flamethrower = MOVES['Flamethrower'];

      const rng1 = new SeededRNG(777);
      const rng2 = new SeededRNG(777);

      const result1 = calculateDamage(charizard, blastoise, flamethrower, rng1);
      const result2 = calculateDamage(charizard, blastoise, flamethrower, rng2);

      expect(result1.damage).toBe(result2.damage);
      expect(result1.isCritical).toBe(result2.isCritical);
      expect(result1.effectiveness).toBe(result2.effectiveness);
    });

    it('should be deterministic across multiple calculations', () => {
      const charizard = createTestPokemon('charizard');
      const venusaur = createTestPokemon('venusaur');
      const flamethrower = MOVES['Flamethrower'];

      const seed = 42;
      const rng1 = new SeededRNG(seed);
      const rng2 = new SeededRNG(seed);

      const results1 = [
        calculateDamage(charizard, venusaur, flamethrower, rng1),
        calculateDamage(charizard, venusaur, flamethrower, rng1),
        calculateDamage(charizard, venusaur, flamethrower, rng1),
      ];

      const results2 = [
        calculateDamage(charizard, venusaur, flamethrower, rng2),
        calculateDamage(charizard, venusaur, flamethrower, rng2),
        calculateDamage(charizard, venusaur, flamethrower, rng2),
      ];

      expect(results1).toEqual(results2);
    });
  });

  describe('Move power scaling', () => {
    it('should deal more damage with higher power moves', () => {
      const venusaur = createTestPokemon('venusaur');
      const blastoise = createTestPokemon('blastoise');
      const vineWhip = MOVES['Vine Whip']; // Power 45
      const solarBeam = MOVES['Solar Beam']; // Power 120
      const rng1 = new SeededRNG(123);
      const rng2 = new SeededRNG(123);

      const vineWhipDamage = calculateDamage(venusaur, blastoise, vineWhip, rng1);
      const solarBeamDamage = calculateDamage(venusaur, blastoise, solarBeam, rng2);

      expect(solarBeamDamage.damage).toBeGreaterThan(vineWhipDamage.damage);
    });
  });
});
