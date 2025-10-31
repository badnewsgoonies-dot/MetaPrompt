import { POKEMON_SPECIES, getPokemonSpecies, getAllPokemonSpecies } from './pokemon-data';

describe('Pokemon Data', () => {
  describe('POKEMON_SPECIES database', () => {
    it('should contain all 4 Pokemon', () => {
      const pokemonCount = Object.keys(POKEMON_SPECIES).length;
      expect(pokemonCount).toBe(4);
    });

    it('should have Charizard with correct stats', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      expect(charizard).toBeDefined();
      expect(charizard.id).toBe('charizard');
      expect(charizard.name).toBe('Charizard');
      expect(charizard.type).toBe('Fire');
      expect(charizard.baseHP).toBe(78);
      expect(charizard.baseAttack).toBe(84);
      expect(charizard.baseDefense).toBe(78);
      expect(charizard.baseSpeed).toBe(100);
      expect(charizard.moveNames).toHaveLength(4);
    });

    it('should have Blastoise with correct stats', () => {
      const blastoise = POKEMON_SPECIES['blastoise'];
      expect(blastoise).toBeDefined();
      expect(blastoise.id).toBe('blastoise');
      expect(blastoise.name).toBe('Blastoise');
      expect(blastoise.type).toBe('Water');
      expect(blastoise.baseHP).toBe(79);
      expect(blastoise.baseAttack).toBe(83);
      expect(blastoise.baseDefense).toBe(100);
      expect(blastoise.baseSpeed).toBe(78);
      expect(blastoise.moveNames).toHaveLength(4);
    });

    it('should have Venusaur with correct stats', () => {
      const venusaur = POKEMON_SPECIES['venusaur'];
      expect(venusaur).toBeDefined();
      expect(venusaur.id).toBe('venusaur');
      expect(venusaur.name).toBe('Venusaur');
      expect(venusaur.type).toBe('Grass');
      expect(venusaur.baseHP).toBe(80);
      expect(venusaur.baseAttack).toBe(82);
      expect(venusaur.baseDefense).toBe(83);
      expect(venusaur.baseSpeed).toBe(80);
      expect(venusaur.moveNames).toHaveLength(4);
    });

    it('should have Pikachu with correct stats', () => {
      const pikachu = POKEMON_SPECIES['pikachu'];
      expect(pikachu).toBeDefined();
      expect(pikachu.id).toBe('pikachu');
      expect(pikachu.name).toBe('Pikachu');
      expect(pikachu.type).toBe('Electric');
      expect(pikachu.baseHP).toBe(35);
      expect(pikachu.baseAttack).toBe(55);
      expect(pikachu.baseDefense).toBe(40);
      expect(pikachu.baseSpeed).toBe(90);
      expect(pikachu.moveNames).toHaveLength(4);
    });
  });

  describe('getPokemonSpecies', () => {
    it('should return Pokemon by ID', () => {
      const charizard = getPokemonSpecies('charizard');
      expect(charizard).toBeDefined();
      expect(charizard?.name).toBe('Charizard');
    });

    it('should return undefined for non-existent Pokemon', () => {
      const pokemon = getPokemonSpecies('mew');
      expect(pokemon).toBeUndefined();
    });
  });

  describe('getAllPokemonSpecies', () => {
    it('should return array of all Pokemon', () => {
      const pokemon = getAllPokemonSpecies();
      expect(Array.isArray(pokemon)).toBe(true);
      expect(pokemon.length).toBe(4);
    });

    it('should contain Charizard', () => {
      const pokemon = getAllPokemonSpecies();
      const charizard = pokemon.find(p => p.id === 'charizard');
      expect(charizard).toBeDefined();
    });
  });

  describe('Move assignments', () => {
    it('Charizard should have Flamethrower', () => {
      const charizard = POKEMON_SPECIES['charizard'];
      expect(charizard.moveNames).toContain('Flamethrower');
    });

    it('Blastoise should have Hydro Pump', () => {
      const blastoise = POKEMON_SPECIES['blastoise'];
      expect(blastoise.moveNames).toContain('Hydro Pump');
    });

    it('Venusaur should have Solar Beam', () => {
      const venusaur = POKEMON_SPECIES['venusaur'];
      expect(venusaur.moveNames).toContain('Solar Beam');
    });

    it('Pikachu should have Thunderbolt', () => {
      const pikachu = POKEMON_SPECIES['pikachu'];
      expect(pikachu.moveNames).toContain('Thunderbolt');
    });

    it('All Pokemon should have exactly 4 moves', () => {
      const allPokemon = getAllPokemonSpecies();
      allPokemon.forEach(pokemon => {
        expect(pokemon.moveNames.length).toBe(4);
      });
    });
  });
});
