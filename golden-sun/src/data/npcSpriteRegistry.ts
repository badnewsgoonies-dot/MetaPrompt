/**
 * NPC Sprite Registry
 * Central repository for all NPC sprite metadata
 */

export interface NPCSprite {
  id: string;
  name: string;
  path: string;
  role: 'protagonist' | 'major_npc' | 'minor_npc' | 'antagonist';
  element?: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
  description?: string;
}

export const NPC_SPRITES: Record<string, NPCSprite> = {
  // Player
  'isaac': {
    id: 'isaac',
    name: 'Isaac',
    path: '/assets/Isaac.gif',
    role: 'protagonist',
    element: 'Venus',
    description: 'Main protagonist, Venus Adept'
  },

  // Protagonists
  'garet': {
    id: 'garet',
    name: 'Garet',
    path: '/assets/Garet.gif',
    role: 'protagonist',
    element: 'Mars',
    description: 'Isaac\'s childhood friend, Mars Adept'
  },
  'ivan': {
    id: 'ivan',
    name: 'Ivan',
    path: '/assets/Ivan.gif',
    role: 'protagonist',
    element: 'Jupiter',
    description: 'Wind adept, joins party later'
  },
  'mia': {
    id: 'mia',
    name: 'Mia',
    path: '/assets/Mia.gif',
    role: 'protagonist',
    element: 'Mercury',
    description: 'Mercury adept from Imil, healer'
  },
  'felix': {
    id: 'felix',
    name: 'Felix',
    path: '/assets/Felix.gif',
    role: 'protagonist',
    element: 'Venus',
    description: 'Jenna\'s brother, presumed lost'
  },
  'sheba': {
    id: 'sheba',
    name: 'Sheba',
    path: '/assets/Sheba.gif',
    role: 'protagonist',
    element: 'Jupiter',
    description: 'Mysterious girl with Kraden'
  },
  'piers': {
    id: 'piers',
    name: 'Piers',
    path: '/assets/Piers.gif',
    role: 'protagonist',
    element: 'Mercury',
    description: 'Lemurian sailor'
  },

  // Major NPCs
  'dora': {
    id: 'dora',
    name: 'Dora',
    path: '/assets/Dora.gif',
    role: 'major_npc',
    description: 'Isaac\'s mother'
  },
  'elder': {
    id: 'elder',
    name: 'Elder',
    path: '/assets/Elder.gif',
    role: 'major_npc',
    description: 'Village leader'
  },
  'kraden': {
    id: 'kraden',
    name: 'Kraden',
    path: '/assets/Kraden.gif',
    role: 'major_npc',
    description: 'Scholar studying Alchemy'
  },
  'kyle': {
    id: 'kyle',
    name: 'Kyle',
    path: '/assets/Kyle.gif',
    role: 'major_npc',
    description: 'Garet\'s father'
  },
  'jenna': {
    id: 'jenna',
    name: 'Jenna',
    path: '/assets/Jenna.gif',
    role: 'major_npc',
    description: 'Felix\'s sister, Isaac\'s close friend'
  },
  'great-healer': {
    id: 'great-healer',
    name: 'Great Healer',
    path: '/assets/Great_Healer.gif',
    role: 'major_npc',
    description: 'Village healer'
  },
  'aaron': {
    id: 'aaron',
    name: 'Aaron',
    path: '/assets/Aaron_Jerra.gif',
    role: 'major_npc',
    description: 'Jenna\'s father'
  },
  'kay': {
    id: 'kay',
    name: 'Kay',
    path: '/assets/Kay_Jerra.gif',
    role: 'major_npc',
    description: 'Jenna\'s mother'
  },
  'innkeeper': {
    id: 'innkeeper',
    name: 'Innkeeper',
    path: '/assets/Innkeeper.gif',
    role: 'major_npc',
    description: 'Runs the village inn'
  },
  'armor-shop-owner': {
    id: 'armor-shop-owner',
    name: 'Armor Shop Owner',
    path: '/assets/Armorshop_Owner.gif',
    role: 'major_npc',
    description: 'Sells weapons and armor'
  },

  // Antagonists
  'alex': {
    id: 'alex',
    name: 'Alex',
    path: '/assets/Alex.gif',
    role: 'antagonist',
    element: 'Mercury',
    description: 'Mysterious Mercury adept'
  },
  'saturos': {
    id: 'saturos',
    name: 'Saturos',
    path: '/assets/Saturos.gif',
    role: 'antagonist',
    element: 'Mars',
    description: 'Mars Clan leader'
  },

  // Minor NPCs (generic sprites, reused)
  'scholar-1': {
    id: 'scholar-1',
    name: 'Scholar',
    path: '/assets/Scholar-1.gif',
    role: 'minor_npc',
    description: 'Studies ancient texts'
  },
  'scholar-2': {
    id: 'scholar-2',
    name: 'Scholar',
    path: '/assets/Scholar-2.gif',
    role: 'minor_npc',
    description: 'Researches Alchemy'
  },
  'villager-1': {
    id: 'villager-1',
    name: 'Villager',
    path: '/assets/Villager1.gif',
    role: 'minor_npc',
    description: 'Generic townsperson (male)'
  },
  'villager-2': {
    id: 'villager-2',
    name: 'Villager',
    path: '/assets/Villager2.gif',
    role: 'minor_npc',
    description: 'Generic townsperson (female)'
  },
  'villager-3': {
    id: 'villager-3',
    name: 'Villager',
    path: '/assets/Villager3.gif',
    role: 'minor_npc',
    description: 'Generic townsperson (child)'
  }
};

/**
 * Get NPC sprite by ID
 */
export function getNPCSprite(id: string): NPCSprite | undefined {
  return NPC_SPRITES[id];
}

/**
 * Get all NPC sprites by role
 */
export function getNPCSpritesByRole(role: NPCSprite['role']): NPCSprite[] {
  return Object.values(NPC_SPRITES).filter(sprite => sprite.role === role);
}

/**
 * Get all NPC sprites by element
 */
export function getNPCSpritesByElement(element: NPCSprite['element']): NPCSprite[] {
  return Object.values(NPC_SPRITES).filter(sprite => sprite.element === element);
}

/**
 * Get all protagonist sprites
 */
export function getProtagonistSprites(): NPCSprite[] {
  return getNPCSpritesByRole('protagonist');
}

/**
 * Get all antagonist sprites
 */
export function getAntagonistSprites(): NPCSprite[] {
  return getNPCSpritesByRole('antagonist');
}
