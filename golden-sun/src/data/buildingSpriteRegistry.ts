/**
 * Building Sprite Registry
 * Central repository for all building sprite metadata
 */

export interface BuildingSprite {
  id: string;
  path: string;
  width: number;
  height: number;
  type: 'house' | 'shop' | 'special';
  category: string;
}

export const BUILDING_SPRITES: Record<string, BuildingSprite> = {
  // Houses
  'isaac-house': {
    id: 'isaac-house',
    path: '/assets/buildings/houses/isaac-house.png',
    width: 96,
    height: 80,
    type: 'house',
    category: 'hero-house'
  },
  'garet-house': {
    id: 'garet-house',
    path: '/assets/buildings/houses/garet-house.png',
    width: 96,
    height: 80,
    type: 'house',
    category: 'hero-house'
  },
  'jenna-house': {
    id: 'jenna-house',
    path: '/assets/buildings/houses/jenna-house.png',
    width: 96,
    height: 80,
    type: 'house',
    category: 'hero-house'
  },
  'elder-house': {
    id: 'elder-house',
    path: '/assets/buildings/houses/elder-house.png',
    width: 112,
    height: 96,
    type: 'house',
    category: 'special-house'
  },
  'kraden-house': {
    id: 'kraden-house',
    path: '/assets/buildings/houses/kraden-house.png',
    width: 96,
    height: 80,
    type: 'house',
    category: 'scholar-house'
  },
  'villager-house-1': {
    id: 'villager-house-1',
    path: '/assets/buildings/houses/villager-house-1.png',
    width: 80,
    height: 70,
    type: 'house',
    category: 'villager-house'
  },
  'villager-house-2': {
    id: 'villager-house-2',
    path: '/assets/buildings/houses/villager-house-2.png',
    width: 80,
    height: 70,
    type: 'house',
    category: 'villager-house'
  },
  'villager-house-3': {
    id: 'villager-house-3',
    path: '/assets/buildings/houses/villager-house-3.png',
    width: 96,
    height: 80,
    type: 'house',
    category: 'villager-house'
  },
  'farmhouse': {
    id: 'farmhouse',
    path: '/assets/buildings/houses/farmhouse.png',
    width: 96,
    height: 80,
    type: 'house',
    category: 'farm-house'
  },

  // Shops
  'item-shop': {
    id: 'item-shop',
    path: '/assets/buildings/shops/item-shop.png',
    width: 96,
    height: 80,
    type: 'shop',
    category: 'shop'
  },
  'armor-shop': {
    id: 'armor-shop',
    path: '/assets/buildings/shops/armor-shop.png',
    width: 96,
    height: 80,
    type: 'shop',
    category: 'shop'
  },
  'blacksmith': {
    id: 'blacksmith',
    path: '/assets/buildings/shops/blacksmith.png',
    width: 96,
    height: 80,
    type: 'shop',
    category: 'shop'
  },
  'inn': {
    id: 'inn',
    path: '/assets/buildings/shops/inn.png',
    width: 96,
    height: 80,
    type: 'shop',
    category: 'shop'
  },

  // Special Buildings
  'sanctum-entrance': {
    id: 'sanctum-entrance',
    path: '/assets/buildings/special/sanctum-entrance.png',
    width: 160,
    height: 140,
    type: 'special',
    category: 'temple'
  },
  'sanctum-guard-post': {
    id: 'sanctum-guard-post',
    path: '/assets/buildings/special/sanctum-guard-post.png',
    width: 80,
    height: 70,
    type: 'special',
    category: 'guard-post'
  },
  'plaza-pavilion': {
    id: 'plaza-pavilion',
    path: '/assets/buildings/special/plaza-pavilion.png',
    width: 96,
    height: 80,
    type: 'special',
    category: 'pavilion'
  },
  'well': {
    id: 'well',
    path: '/assets/buildings/special/well.png',
    width: 48,
    height: 48,
    type: 'special',
    category: 'well'
  },
  'greenhouse': {
    id: 'greenhouse',
    path: '/assets/buildings/special/greenhouse.png',
    width: 80,
    height: 70,
    type: 'special',
    category: 'greenhouse'
  },
  'storage-shed': {
    id: 'storage-shed',
    path: '/assets/buildings/special/storage-shed.png',
    width: 64,
    height: 60,
    type: 'special',
    category: 'storage'
  },
  'barn': {
    id: 'barn',
    path: '/assets/buildings/special/barn.png',
    width: 128,
    height: 110,
    type: 'special',
    category: 'farm-building'
  },
  'watchtower': {
    id: 'watchtower',
    path: '/assets/buildings/special/watchtower.png',
    width: 64,
    height: 100,
    type: 'special',
    category: 'tower'
  },
  'gate-guard-post': {
    id: 'gate-guard-post',
    path: '/assets/buildings/special/gate-guard-post.png',
    width: 80,
    height: 70,
    type: 'special',
    category: 'guard-post'
  }
};

/**
 * Get building sprite by ID
 */
export function getBuildingSprite(id: string): BuildingSprite | undefined {
  return BUILDING_SPRITES[id];
}

/**
 * Get all building sprites by type
 */
export function getBuildingSpritesByType(type: BuildingSprite['type']): BuildingSprite[] {
  return Object.values(BUILDING_SPRITES).filter(sprite => sprite.type === type);
}

/**
 * Get all building sprites by category
 */
export function getBuildingSpritesByCategory(category: string): BuildingSprite[] {
  return Object.values(BUILDING_SPRITES).filter(sprite => sprite.category === category);
}
