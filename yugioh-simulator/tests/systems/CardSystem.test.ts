/**
 * CardSystem Tests
 * Ensures 100% test pass rate with deterministic behavior
 */

import { describe, it, expect } from '@jest/globals';
import {
  createCardZones,
  drawCard,
  summonMonster,
  setMonster,
  activateSpell,
  setTrap,
  activateTrap,
  destroyMonster,
  changePosition,
  removeSummoningSickness,
  markAttacked,
  countMonsters,
  getRequiredTributes,
} from '../../src/systems/CardSystem';
import { createStandardDeck } from '../../src/utils/card-data';
import { isOk, isErr } from '../../src/utils/result-type';

describe('CardSystem', () => {
  describe('createCardZones', () => {
    it('should initialize empty zones', () => {
      const zones = createCardZones();
      expect(zones.hand).toEqual([]);
      expect(zones.deck).toEqual([]);
      expect(zones.graveyard).toEqual([]);
      expect(zones.monsterZone).toHaveLength(3);
      expect(zones.spellTrapZone).toHaveLength(3);
    });
  });

  describe('drawCard', () => {
    it('should draw a card from deck to hand', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.deck = deck;

      const result = drawCard(zones);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.hand).toHaveLength(1);
        expect(result.value.deck).toHaveLength(19);
        expect(result.value.hand[0]).toBe(deck[0]);
      }
    });

    it('should fail when deck is empty', () => {
      const zones = createCardZones();
      const result = drawCard(zones);

      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Cannot draw: deck is empty');
      }
    });

    it('should maintain deck order', () => {
      const zones = createCardZones();
      zones.deck = createStandardDeck().slice(0, 3);

      const firstDraw = drawCard(zones);
      expect(isOk(firstDraw)).toBe(true);
      if (isOk(firstDraw)) {
        const secondDraw = drawCard(firstDraw.value);
        expect(isOk(secondDraw)).toBe(true);
        if (isOk(secondDraw)) {
          expect(secondDraw.value.hand).toHaveLength(2);
          expect(secondDraw.value.deck).toHaveLength(1);
        }
      }
    });
  });

  describe('getRequiredTributes', () => {
    it('should require 0 tributes for level 1-4', () => {
      expect(getRequiredTributes(1)).toBe(0);
      expect(getRequiredTributes(3)).toBe(0);
      expect(getRequiredTributes(4)).toBe(0);
    });

    it('should require 1 tribute for level 5-6', () => {
      expect(getRequiredTributes(5)).toBe(1);
      expect(getRequiredTributes(6)).toBe(1);
    });

    it('should require 2 tributes for level 7+', () => {
      expect(getRequiredTributes(7)).toBe(2);
      expect(getRequiredTributes(8)).toBe(2);
      expect(getRequiredTributes(12)).toBe(2);
    });
  });

  describe('summonMonster', () => {
    it('should summon level 4 monster with no tributes', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[2]]; // Celtic Guardian (level 4)

      const result = summonMonster(zones, 'm3', 'attack', []);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.hand).toHaveLength(0);
        expect(result.value.monsterZone[0]).not.toBeNull();
        expect(result.value.monsterZone[0]?.card.id).toBe('m3');
        expect(result.value.monsterZone[0]?.position).toBe('attack');
        expect(result.value.monsterZone[0]?.faceState).toBe('up');
        expect(result.value.monsterZone[0]?.canAttack).toBe(false);
      }
    });

    it('should fail when card not in hand', () => {
      const zones = createCardZones();
      const result = summonMonster(zones, 'm1', 'attack', []);

      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Card not found in hand');
      }
    });

    it('should fail when summoning non-monster card', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[10]]; // Spell card

      const result = summonMonster(zones, 's1', 'attack', []);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('Card is not a monster');
      }
    });

    it('should fail when insufficient tributes', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[0]]; // Dark Magician (level 7, needs 2 tributes)

      const result = summonMonster(zones, 'm1', 'attack', []);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toContain('Insufficient tributes');
      }
    });

    it('should summon with correct tributes', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[0]]; // Dark Magician (level 7)
      zones.monsterZone[0] = {
        card: deck[2],
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };
      zones.monsterZone[1] = {
        card: deck[3],
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      const result = summonMonster(zones, 'm1', 'attack', [0, 1]);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.monsterZone[0]).toBeNull();
        expect(result.value.monsterZone[1]).toBeNull();
        expect(result.value.monsterZone[2]?.card.id).toBe('m1');
        expect(result.value.graveyard).toHaveLength(2);
      }
    });

    it('should fail when no empty slots', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[2]];
      zones.monsterZone = [
        { card: deck[3], position: 'attack', faceState: 'up', canAttack: true, hasAttacked: false },
        { card: deck[4], position: 'attack', faceState: 'up', canAttack: true, hasAttacked: false },
        { card: deck[5], position: 'attack', faceState: 'up', canAttack: true, hasAttacked: false },
      ];

      const result = summonMonster(zones, 'm3', 'attack', []);
      expect(isErr(result)).toBe(true);
      if (isErr(result)) {
        expect(result.error).toBe('No empty monster zone slots');
      }
    });
  });

  describe('setMonster', () => {
    it('should set monster face-down in defense', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[2]];

      const result = setMonster(zones, 'm3', []);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.monsterZone[0]?.faceState).toBe('down');
        expect(result.value.monsterZone[0]?.position).toBe('defense');
      }
    });
  });

  describe('activateSpell', () => {
    it('should activate spell from hand to graveyard', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[10]]; // Spell card

      const result = activateSpell(zones, 's1');
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.hand).toHaveLength(0);
        expect(result.value.graveyard).toHaveLength(1);
        expect(result.value.graveyard[0].id).toBe('s1');
      }
    });

    it('should fail when activating non-spell', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[0]]; // Monster

      const result = activateSpell(zones, 'm1');
      expect(isErr(result)).toBe(true);
    });
  });

  describe('setTrap', () => {
    it('should set trap face-down', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.hand = [deck[15]]; // Trap card

      const result = setTrap(zones, 't1');
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.hand).toHaveLength(0);
        expect(result.value.spellTrapZone[0]).not.toBeNull();
        expect(result.value.spellTrapZone[0]?.faceState).toBe('down');
      }
    });
  });

  describe('activateTrap', () => {
    it('should activate set trap', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.spellTrapZone[0] = {
        card: deck[15],
        position: 'defense',
        faceState: 'down',
        canAttack: false,
        hasAttacked: false,
      };

      const result = activateTrap(zones, 0);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.spellTrapZone[0]).toBeNull();
        expect(result.value.graveyard).toHaveLength(1);
      }
    });

    it('should fail when no trap in slot', () => {
      const zones = createCardZones();
      const result = activateTrap(zones, 0);

      expect(isErr(result)).toBe(true);
    });
  });

  describe('destroyMonster', () => {
    it('should destroy monster and send to graveyard', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.monsterZone[0] = {
        card: deck[2],
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      const result = destroyMonster(zones, 0);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.monsterZone[0]).toBeNull();
        expect(result.value.graveyard).toHaveLength(1);
      }
    });
  });

  describe('changePosition', () => {
    it('should change monster position', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.monsterZone[0] = {
        card: deck[2],
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      const result = changePosition(zones, 0, 'defense');
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.monsterZone[0]?.position).toBe('defense');
      }
    });
  });

  describe('removeSummoningSickness', () => {
    it('should enable monsters to attack', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.monsterZone[0] = {
        card: deck[2],
        position: 'attack',
        faceState: 'up',
        canAttack: false,
        hasAttacked: true,
      };

      const result = removeSummoningSickness(zones);
      expect(result.monsterZone[0]?.canAttack).toBe(true);
      expect(result.monsterZone[0]?.hasAttacked).toBe(false);
    });
  });

  describe('markAttacked', () => {
    it('should mark monster as attacked', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.monsterZone[0] = {
        card: deck[2],
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      const result = markAttacked(zones, 0);
      expect(isOk(result)).toBe(true);

      if (isOk(result)) {
        expect(result.value.monsterZone[0]?.hasAttacked).toBe(true);
      }
    });
  });

  describe('countMonsters', () => {
    it('should count monsters on field', () => {
      const zones = createCardZones();
      const deck = createStandardDeck();
      zones.monsterZone[0] = {
        card: deck[2],
        position: 'attack',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };
      zones.monsterZone[2] = {
        card: deck[3],
        position: 'defense',
        faceState: 'up',
        canAttack: true,
        hasAttacked: false,
      };

      expect(countMonsters(zones)).toBe(2);
    });
  });
});
