/**
 * Terrain Sprite Registry
 * Central repository for all terrain/scenery sprite metadata
 */

export interface TerrainSprite {
  id: string;
  type: 'tree' | 'gate' | 'decoration' | 'path' | 'water';
  path: string;
  width: number;
  height: number;
  collision: boolean;
  description?: string;
}

export const TERRAIN_SPRITES: Record<string, TerrainSprite> = {
  // Trees
  'tree-1': {
    id: 'tree-1',
    type: 'tree',
    path: '/assets/Tree1.gif',
    width: 32,
    height: 32,
    collision: true,
    description: 'Standard Vale tree variant 1'
  },
  'tree-2': {
    id: 'tree-2',
    type: 'tree',
    path: '/assets/Tree2.gif',
    width: 32,
    height: 32,
    collision: true,
    description: 'Standard Vale tree variant 2'
  },

  // Gates
  'vale-gate': {
    id: 'vale-gate',
    type: 'gate',
    path: '/assets/Vale_Gate.gif',
    width: 80,
    height: 40,
    collision: false,
    description: 'Southern gate to world map'
  }
};

/**
 * Get terrain sprite by ID
 */
export function getTerrainSprite(id: string): TerrainSprite | undefined {
  return TERRAIN_SPRITES[id];
}

/**
 * Get all terrain sprites by type
 */
export function getTerrainSpritesByType(type: TerrainSprite['type']): TerrainSprite[] {
  return Object.values(TERRAIN_SPRITES).filter(sprite => sprite.type === type);
}

/**
 * Get all collidable terrain sprites
 */
export function getCollidableTerrainSprites(): TerrainSprite[] {
  return Object.values(TERRAIN_SPRITES).filter(sprite => sprite.collision);
}

/**
 * Get all non-collidable terrain sprites
 */
export function getNonCollidableTerrainSprites(): TerrainSprite[] {
  return Object.values(TERRAIN_SPRITES).filter(sprite => !sprite.collision);
}
