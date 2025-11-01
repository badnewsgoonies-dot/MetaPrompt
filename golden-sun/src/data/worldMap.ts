/**
 * World Map Data for Golden Sun Chapter 1
 * Defines overworld locations, connections, and encounter zones
 */

export interface WorldMapLocation {
  id: string;
  name: string;
  type: 'town' | 'dungeon' | 'landmark' | 'poi';
  position: { x: number; y: number }; // Pixel coordinates on world map
  unlocked: boolean; // Initially unlocked or requires story flag
  unlockFlag?: string;
  description: string;
  levelRange: string;
  sceneId: string; // Scene to load when entering
  iconSprite: string;
}

export interface WorldMapConnection {
  from: string;
  to: string;
  terrainType: 'grassland' | 'forest' | 'mountain' | 'beach' | 'bridge';
  encounterZone: string;
}

/**
 * Chapter 1 World Map Locations
 */
export const WORLD_MAP_LOCATIONS: WorldMapLocation[] = [
  // === TOWNS ===
  {
    id: 'vale',
    name: 'Vale',
    type: 'town',
    position: { x: 100, y: 80 },
    unlocked: true,
    description: 'Your peaceful mountain village home.',
    levelRange: 'Safe',
    sceneId: 'vale_village',
    iconSprite: 'map_icon_town'
  },

  {
    id: 'vault',
    name: 'Vault',
    type: 'town',
    position: { x: 150, y: 120 },
    unlocked: false,
    unlockFlag: 'left_vale',
    description: 'A town at the foot of Goma Range.',
    levelRange: 'Level 2-4',
    sceneId: 'vault_town',
    iconSprite: 'map_icon_town'
  },

  {
    id: 'bilibin',
    name: 'Bilibin',
    type: 'town',
    position: { x: 220, y: 140 },
    unlocked: false,
    unlockFlag: 'goma_range_complete',
    description: 'A prosperous town ruled by Lord Bilibin.',
    levelRange: 'Level 4-6',
    sceneId: 'bilibin_town',
    iconSprite: 'map_icon_palace'
  },

  {
    id: 'kolima',
    name: 'Kolima Village',
    type: 'town',
    position: { x: 240, y: 100 },
    unlocked: false,
    unlockFlag: 'bilibin_quest_started',
    description: 'A cursed village where residents became trees.',
    levelRange: 'Level 5-7',
    sceneId: 'kolima_village',
    iconSprite: 'map_icon_town_cursed'
  },

  // === DUNGEONS ===
  {
    id: 'sol_sanctum',
    name: 'Sol Sanctum',
    type: 'dungeon',
    position: { x: 90, y: 60 },
    unlocked: false,
    unlockFlag: 'kraden_quest_accepted',
    description: 'Ancient temple on Mt. Aleph.',
    levelRange: 'Level 1-3',
    sceneId: 'sol_sanctum',
    iconSprite: 'map_icon_temple'
  },

  {
    id: 'goma_range',
    name: 'Goma Range',
    type: 'dungeon',
    position: { x: 180, y: 110 },
    unlocked: false,
    unlockFlag: 'vault_quest_started',
    description: 'Mountain pass with rocky caves.',
    levelRange: 'Level 3-5',
    sceneId: 'goma_range_dungeon',
    iconSprite: 'map_icon_cave'
  },

  {
    id: 'kolima_forest',
    name: 'Kolima Forest',
    type: 'dungeon',
    position: { x: 250, y: 90 },
    unlocked: false,
    unlockFlag: 'bilibin_quest_started',
    description: 'Cursed forest inhabited by Tret.',
    levelRange: 'Level 5-8',
    sceneId: 'kolima_forest_dungeon',
    iconSprite: 'map_icon_forest'
  },

  // === LANDMARKS ===
  {
    id: 'crossroads',
    name: 'Crossroads',
    type: 'landmark',
    position: { x: 200, y: 130 },
    unlocked: false,
    unlockFlag: 'vault_visited',
    description: 'A rest stop between regions.',
    levelRange: 'Safe',
    sceneId: 'crossroads',
    iconSprite: 'map_icon_inn'
  },

  {
    id: 'mercury_lighthouse',
    name: 'Mercury Lighthouse',
    type: 'landmark',
    position: { x: 280, y: 60 },
    unlocked: false,
    unlockFlag: 'kolima_curse_broken',
    description: 'A towering lighthouse to the north. (Chapter 2)',
    levelRange: 'Level 10+',
    sceneId: 'mercury_lighthouse_exterior',
    iconSprite: 'map_icon_lighthouse'
  },

  // === POINTS OF INTEREST ===
  {
    id: 'vale_cave',
    name: 'Vale Cave',
    type: 'poi',
    position: { x: 110, y: 90 },
    unlocked: true,
    description: 'A small cave near Vale. First Djinn found here.',
    levelRange: 'Level 1',
    sceneId: 'vale_cave',
    iconSprite: 'map_icon_cave_small'
  },

  {
    id: 'bilibin_barricade',
    name: 'Barricade',
    type: 'poi',
    position: { x: 260, y: 120 },
    unlocked: false,
    unlockFlag: 'kolima_curse_broken',
    description: 'Blocked path. Opens after Kolima quest.',
    levelRange: 'N/A',
    sceneId: 'barricade_north',
    iconSprite: 'map_icon_barricade'
  }
];

/**
 * Encounter zones define which enemies appear in which terrain
 */
export interface EncounterZone {
  id: string;
  name: string;
  encounterTable: string; // Key from enemies.ts ENCOUNTER_GROUPS
  encounterRate: number; // Steps between battles (average)
  levelRange: string;
}

export const ENCOUNTER_ZONES: Record<string, EncounterZone> = {
  vale_grassland: {
    id: 'vale_grassland',
    name: 'Vale Grasslands',
    encounterTable: 'vale_grassland',
    encounterRate: 10, // Battle every ~10 steps
    levelRange: 'Level 1-3'
  },

  vale_forest: {
    id: 'vale_forest',
    name: 'Vale Forest',
    encounterTable: 'vale_forest',
    encounterRate: 8,
    levelRange: 'Level 2-4'
  },

  goma_mountains: {
    id: 'goma_mountains',
    name: 'Goma Range Mountains',
    encounterTable: 'goma_range',
    encounterRate: 9,
    levelRange: 'Level 3-5'
  },

  kolima_forest_zone: {
    id: 'kolima_forest_zone',
    name: 'Kolima Forest Paths',
    encounterTable: 'kolima_forest',
    encounterRate: 7,
    levelRange: 'Level 5-7'
  },

  eastern_road: {
    id: 'eastern_road',
    name: 'Eastern Road',
    encounterTable: 'vale_grassland',
    encounterRate: 12, // Less frequent on roads
    levelRange: 'Level 3-6'
  }
};

/**
 * World map terrain types and movement rules
 */
export interface TerrainType {
  id: string;
  name: string;
  passable: boolean;
  requiresAbility?: string; // Psynergy required (e.g., 'whirlwind', 'frost')
  encounterZone?: string;
  movementSpeed: number; // Multiplier (1.0 = normal)
}

export const TERRAIN_TYPES: Record<string, TerrainType> = {
  grassland: {
    id: 'grassland',
    name: 'Grassland',
    passable: true,
    encounterZone: 'vale_grassland',
    movementSpeed: 1.0
  },

  forest: {
    id: 'forest',
    name: 'Forest',
    passable: true,
    encounterZone: 'vale_forest',
    movementSpeed: 0.8
  },

  mountain: {
    id: 'mountain',
    name: 'Mountain',
    passable: false, // Blocked until specific paths/dungeons
    movementSpeed: 0.0
  },

  water: {
    id: 'water',
    name: 'Water',
    passable: false, // Requires boat (Chapter 2+)
    movementSpeed: 0.0
  },

  road: {
    id: 'road',
    name: 'Road',
    passable: true,
    encounterZone: 'eastern_road',
    movementSpeed: 1.2 // Faster on roads
  },

  bridge: {
    id: 'bridge',
    name: 'Bridge',
    passable: true,
    movementSpeed: 1.0
  },

  sand: {
    id: 'sand',
    name: 'Sand',
    passable: true,
    movementSpeed: 0.7
  }
};

/**
 * World map grid size
 */
export const WORLD_MAP_CONFIG = {
  width: 400, // Tiles
  height: 300, // Tiles
  tileSize: 8, // Pixels per tile
  viewportWidth: 240, // GBA screen width
  viewportHeight: 160, // GBA screen height
  scrollSpeed: 2 // Pixels per frame
};
