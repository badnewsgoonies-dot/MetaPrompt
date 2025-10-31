import { getTypeMultiplier } from './type-effectiveness';

describe('Type Effectiveness', () => {
  describe('Fire type', () => {
    it('should be super effective against Grass', () => {
      expect(getTypeMultiplier('Fire', 'Grass')).toBe(2.0);
    });

    it('should be not very effective against Water', () => {
      expect(getTypeMultiplier('Fire', 'Water')).toBe(0.5);
    });

    it('should be neutral against Fire', () => {
      expect(getTypeMultiplier('Fire', 'Fire')).toBe(1.0);
    });

    it('should be neutral against Electric', () => {
      expect(getTypeMultiplier('Fire', 'Electric')).toBe(1.0);
    });

    it('should be neutral against Normal', () => {
      expect(getTypeMultiplier('Fire', 'Normal')).toBe(1.0);
    });
  });

  describe('Water type', () => {
    it('should be super effective against Fire', () => {
      expect(getTypeMultiplier('Water', 'Fire')).toBe(2.0);
    });

    it('should be not very effective against Grass', () => {
      expect(getTypeMultiplier('Water', 'Grass')).toBe(0.5);
    });

    it('should be neutral against Water', () => {
      expect(getTypeMultiplier('Water', 'Water')).toBe(1.0);
    });

    it('should be neutral against Electric', () => {
      expect(getTypeMultiplier('Water', 'Electric')).toBe(1.0);
    });

    it('should be neutral against Normal', () => {
      expect(getTypeMultiplier('Water', 'Normal')).toBe(1.0);
    });
  });

  describe('Grass type', () => {
    it('should be super effective against Water', () => {
      expect(getTypeMultiplier('Grass', 'Water')).toBe(2.0);
    });

    it('should be not very effective against Fire', () => {
      expect(getTypeMultiplier('Grass', 'Fire')).toBe(0.5);
    });

    it('should be neutral against Grass', () => {
      expect(getTypeMultiplier('Grass', 'Grass')).toBe(1.0);
    });

    it('should be neutral against Electric', () => {
      expect(getTypeMultiplier('Grass', 'Electric')).toBe(1.0);
    });

    it('should be neutral against Normal', () => {
      expect(getTypeMultiplier('Grass', 'Normal')).toBe(1.0);
    });
  });

  describe('Electric type', () => {
    it('should be super effective against Water', () => {
      expect(getTypeMultiplier('Electric', 'Water')).toBe(2.0);
    });

    it('should be neutral against Fire', () => {
      expect(getTypeMultiplier('Electric', 'Fire')).toBe(1.0);
    });

    it('should be neutral against Grass', () => {
      expect(getTypeMultiplier('Electric', 'Grass')).toBe(1.0);
    });

    it('should be neutral against Electric', () => {
      expect(getTypeMultiplier('Electric', 'Electric')).toBe(1.0);
    });

    it('should be neutral against Normal', () => {
      expect(getTypeMultiplier('Electric', 'Normal')).toBe(1.0);
    });
  });

  describe('Normal type', () => {
    it('should be neutral against all types', () => {
      expect(getTypeMultiplier('Normal', 'Fire')).toBe(1.0);
      expect(getTypeMultiplier('Normal', 'Water')).toBe(1.0);
      expect(getTypeMultiplier('Normal', 'Grass')).toBe(1.0);
      expect(getTypeMultiplier('Normal', 'Electric')).toBe(1.0);
      expect(getTypeMultiplier('Normal', 'Normal')).toBe(1.0);
    });
  });

  describe('Type triangle', () => {
    it('should form Fire > Grass > Water > Fire triangle', () => {
      expect(getTypeMultiplier('Fire', 'Grass')).toBe(2.0);
      expect(getTypeMultiplier('Grass', 'Water')).toBe(2.0);
      expect(getTypeMultiplier('Water', 'Fire')).toBe(2.0);

      expect(getTypeMultiplier('Fire', 'Water')).toBe(0.5);
      expect(getTypeMultiplier('Water', 'Grass')).toBe(0.5);
      expect(getTypeMultiplier('Grass', 'Fire')).toBe(0.5);
    });
  });
});
