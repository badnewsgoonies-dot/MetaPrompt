import { Element } from '../types/enemy';

/**
 * Djinn - Elemental spirits that boost stats and enable summons
 */

export interface Djinn {
  id: string;
  name: string;
  element: Element;
  description: string;
  location: string;
  battleStats: {
    hp: number;
    attack: number;
    defense: number;
    agility: number;
  };
  setBonus: {
    hp: number;
    pp: number;
    attack: number;
    defense: number;
    agility: number;
  };
  ability?: {
    name: string;
    description: string;
    ppCost: number;
    power: number;
    effect: string;
  };
  spriteId: string;
}

/**
 * Chapter 1 Djinn (8 total)
 */
export const CHAPTER_1_DJINN: Record<string, Djinn> = {
  // === VENUS DJINN ===
  flint: {
    id: 'flint',
    name: 'Flint',
    element: 'venus',
    description: 'A Venus Djinni found near Vale. Boosts earth power.',
    location: 'vale_outskirts',
    battleStats: {
      hp: 50,
      attack: 15,
      defense: 12,
      agility: 10
    },
    setBonus: {
      hp: 8,
      pp: 3,
      attack: 3,
      defense: 2,
      agility: 1
    },
    ability: {
      name: 'Flint',
      description: 'Attack with earth power and boost party defense.',
      ppCost: 0,
      power: 30,
      effect: 'Damage + DEF up to party'
    },
    spriteId: 'djinn_flint'
  },

  granite: {
    id: 'granite',
    name: 'Granite',
    element: 'venus',
    description: 'Found in Goma Range. Hardens defenses like stone.',
    location: 'goma_range_cave',
    battleStats: {
      hp: 60,
      attack: 18,
      defense: 15,
      agility: 8
    },
    setBonus: {
      hp: 10,
      pp: 4,
      attack: 2,
      defense: 4,
      agility: 0
    },
    ability: {
      name: 'Granite',
      description: 'Greatly boost party defense for 3 turns.',
      ppCost: 0,
      power: 0,
      effect: 'DEF +50% to party (3 turns)'
    },
    spriteId: 'djinn_granite'
  },

  // === MARS DJINN ===
  forge: {
    id: 'forge',
    name: 'Forge',
    element: 'mars',
    description: 'Found in Sol Sanctum. Burns with intense heat.',
    location: 'sol_sanctum_treasure_room',
    battleStats: {
      hp: 55,
      attack: 20,
      defense: 10,
      agility: 12
    },
    setBonus: {
      hp: 9,
      pp: 5,
      attack: 4,
      defense: 1,
      agility: 2
    },
    ability: {
      name: 'Forge',
      description: 'Attack with intense fire and boost party attack.',
      ppCost: 0,
      power: 40,
      effect: 'Fire damage + ATK up to party'
    },
    spriteId: 'djinn_forge'
  },

  fever: {
    id: 'fever',
    name: 'Fever',
    element: 'mars',
    description: 'Hidden in Bilibin Palace. Inflicts burning status.',
    location: 'bilibin_palace_secret',
    battleStats: {
      hp: 58,
      attack: 22,
      defense: 9,
      agility: 15
    },
    setBonus: {
      hp: 8,
      pp: 6,
      attack: 5,
      defense: 0,
      agility: 3
    },
    ability: {
      name: 'Fever',
      description: 'Attack and may inflict Delusion status.',
      ppCost: 0,
      power: 35,
      effect: 'Fire damage + 40% Delusion chance'
    },
    spriteId: 'djinn_fever'
  },

  // === JUPITER DJINN ===
  gust: {
    id: 'gust',
    name: 'Gust',
    element: 'jupiter',
    description: 'Found in Kolima Forest. Commands swift winds.',
    location: 'kolima_forest_depths',
    battleStats: {
      hp: 52,
      attack: 16,
      defense: 8,
      agility: 20
    },
    setBonus: {
      hp: 7,
      pp: 4,
      attack: 2,
      defense: 1,
      agility: 5
    },
    ability: {
      name: 'Gust',
      description: 'Attack with wind and boost party agility.',
      ppCost: 0,
      power: 30,
      effect: 'Wind damage + AGI up to party'
    },
    spriteId: 'djinn_gust'
  },

  breeze: {
    id: 'breeze',
    name: 'Breeze',
    element: 'jupiter',
    description: 'Roams near Bilibin. Restores vitality with gentle wind.',
    location: 'bilibin_outskirts',
    battleStats: {
      hp: 50,
      attack: 14,
      defense: 10,
      agility: 18
    },
    setBonus: {
      hp: 8,
      pp: 5,
      attack: 1,
      defense: 2,
      agility: 4
    },
    ability: {
      name: 'Breeze',
      description: 'Restore HP to entire party.',
      ppCost: 0,
      power: 0,
      effect: 'Heal 60 HP to all allies'
    },
    spriteId: 'djinn_breeze'
  },

  // === MERCURY DJINN ===
  sleet: {
    id: 'sleet',
    name: 'Sleet',
    element: 'mercury',
    description: 'Near Mercury Lighthouse. Freezes enemies solid.',
    location: 'mercury_lighthouse_exterior',
    battleStats: {
      hp: 54,
      attack: 17,
      defense: 11,
      agility: 13
    },
    setBonus: {
      hp: 9,
      pp: 6,
      attack: 2,
      defense: 3,
      agility: 1
    },
    ability: {
      name: 'Sleet',
      description: 'Attack with ice and may freeze the enemy.',
      ppCost: 0,
      power: 35,
      effect: 'Ice damage + 30% Stun chance'
    },
    spriteId: 'djinn_sleet'
  },

  mist: {
    id: 'mist',
    name: 'Mist',
    element: 'mercury',
    description: 'Hidden in Vault. Obscures vision and confuses foes.',
    location: 'vault_hidden_area',
    battleStats: {
      hp: 56,
      attack: 15,
      defense: 13,
      agility: 14
    },
    setBonus: {
      hp: 10,
      pp: 5,
      attack: 1,
      defense: 4,
      agility: 2
    },
    ability: {
      name: 'Mist',
      description: 'Reduce enemy accuracy and evasion.',
      ppCost: 0,
      power: 25,
      effect: 'Water damage + -30% accuracy to all enemies'
    },
    spriteId: 'djinn_mist'
  }
};

/**
 * Summon requirements (Chapter 1 summons use 1 Djinn each)
 */
export interface Summon {
  id: string;
  name: string;
  element: Element;
  djinnRequired: number;
  description: string;
  power: number;
  effect: string;
  spriteId: string;
}

export const CHAPTER_1_SUMMONS: Record<string, Summon> = {
  // 1-Djinn summons
  venus: {
    id: 'rampart',
    name: 'Rampart',
    element: 'venus',
    djinnRequired: 1,
    description: 'Venus summon. Damage and boost party defense.',
    power: 30,
    effect: 'Venus damage to all enemies + DEF +25% to party (3 turns)',
    spriteId: 'summon_rampart'
  },

  mars: {
    id: 'tiamat',
    name: 'Tiamat',
    element: 'mars',
    djinnRequired: 1,
    description: 'Mars summon. Powerful fire damage to all enemies.',
    power: 40,
    effect: 'Fire damage to all enemies',
    spriteId: 'summon_tiamat'
  },

  jupiter: {
    id: 'atalanta',
    name: 'Atalanta',
    element: 'jupiter',
    djinnRequired: 1,
    description: 'Jupiter summon. Damage and boost party agility.',
    power: 35,
    effect: 'Wind damage to all enemies + AGI +30% to party (3 turns)',
    spriteId: 'summon_atalanta'
  },

  mercury: {
    id: 'nereid',
    name: 'Nereid',
    element: 'mercury',
    djinnRequired: 1,
    description: 'Mercury summon. Damage and heal party.',
    power: 25,
    effect: 'Water damage to all enemies + Heal 30 HP to all allies',
    spriteId: 'summon_nereid'
  }
};

/**
 * Djinn states
 */
export type DjinnState = 'set' | 'standby' | 'recovery';

export interface DjinnInstance {
  djinnId: string;
  state: DjinnState;
  recoveryTurns: number; // Turns until back to Set from Recovery
  equippedTo?: string; // Character ID
}
