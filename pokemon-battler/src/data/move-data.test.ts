import { MOVES, getMove, getAllMoves } from './move-data';

describe('Move Data', () => {
  describe('MOVES database', () => {
    it('should contain all 16 moves', () => {
      const moveCount = Object.keys(MOVES).length;
      expect(moveCount).toBe(16);
    });

    it('should have Flamethrower with correct stats', () => {
      const move = MOVES['Flamethrower'];
      expect(move).toBeDefined();
      expect(move.name).toBe('Flamethrower');
      expect(move.type).toBe('Fire');
      expect(move.power).toBe(90);
      expect(move.maxPP).toBe(15);
    });

    it('should have Hydro Pump with correct stats', () => {
      const move = MOVES['Hydro Pump'];
      expect(move).toBeDefined();
      expect(move.name).toBe('Hydro Pump');
      expect(move.type).toBe('Water');
      expect(move.power).toBe(110);
      expect(move.maxPP).toBe(5);
    });

    it('should have Solar Beam with correct stats', () => {
      const move = MOVES['Solar Beam'];
      expect(move).toBeDefined();
      expect(move.name).toBe('Solar Beam');
      expect(move.type).toBe('Grass');
      expect(move.power).toBe(120);
      expect(move.maxPP).toBe(10);
    });

    it('should have Thunderbolt with correct stats', () => {
      const move = MOVES['Thunderbolt'];
      expect(move).toBeDefined();
      expect(move.name).toBe('Thunderbolt');
      expect(move.type).toBe('Electric');
      expect(move.power).toBe(90);
      expect(move.maxPP).toBe(15);
    });

    it('should have Quick Attack as Normal type', () => {
      const move = MOVES['Quick Attack'];
      expect(move).toBeDefined();
      expect(move.type).toBe('Normal');
      expect(move.power).toBe(40);
      expect(move.maxPP).toBe(30);
    });
  });

  describe('getMove', () => {
    it('should return move by name', () => {
      const move = getMove('Flamethrower');
      expect(move).toBeDefined();
      expect(move?.name).toBe('Flamethrower');
    });

    it('should return undefined for non-existent move', () => {
      const move = getMove('NonExistentMove');
      expect(move).toBeUndefined();
    });
  });

  describe('getAllMoves', () => {
    it('should return array of all moves', () => {
      const moves = getAllMoves();
      expect(Array.isArray(moves)).toBe(true);
      expect(moves.length).toBe(16);
    });

    it('should contain Flamethrower', () => {
      const moves = getAllMoves();
      const flamethrower = moves.find(m => m.name === 'Flamethrower');
      expect(flamethrower).toBeDefined();
    });
  });

  describe('Type distribution', () => {
    it('should have Fire type moves', () => {
      const fireMoves = getAllMoves().filter(m => m.type === 'Fire');
      expect(fireMoves.length).toBeGreaterThan(0);
    });

    it('should have Water type moves', () => {
      const waterMoves = getAllMoves().filter(m => m.type === 'Water');
      expect(waterMoves.length).toBeGreaterThan(0);
    });

    it('should have Grass type moves', () => {
      const grassMoves = getAllMoves().filter(m => m.type === 'Grass');
      expect(grassMoves.length).toBeGreaterThan(0);
    });

    it('should have Electric type moves', () => {
      const electricMoves = getAllMoves().filter(m => m.type === 'Electric');
      expect(electricMoves.length).toBeGreaterThan(0);
    });

    it('should have Normal type moves', () => {
      const normalMoves = getAllMoves().filter(m => m.type === 'Normal');
      expect(normalMoves.length).toBeGreaterThan(0);
    });
  });
});
