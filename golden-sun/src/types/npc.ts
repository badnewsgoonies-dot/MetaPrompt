// NPC type definitions for Golden Sun Vale Village

export type NPCFacing = 'up' | 'down' | 'left' | 'right';

export type NPCRole = 'protagonist' | 'major_npc' | 'minor_npc' | 'antagonist' | 'shopkeeper';

export type Element = 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';

export interface NPCPosition {
  x: number;
  y: number;
}

export interface NPC {
  id: string;
  name: string;
  sprite: string;           // Path to sprite GIF
  position: NPCPosition;
  facing: NPCFacing;
  dialogue_id: string;      // References dialogue content
  role: NPCRole;
  element?: Element;
  visible: boolean;         // Some NPCs hidden until story triggers
  interactionRange: number; // Pixels (default: 32 = 1 tile at 2× scale)
  hasBeenTalkedTo: boolean; // State tracking
}

export interface NPCRegistry {
  npcs: Map<string, NPC>;
  visible: string[];        // IDs of currently visible NPCs
}

export interface NPCInteractionCheck {
  canInteract: boolean;
  npc: NPC | null;
  distance: number;
}

// Sprite map entity (loaded from JSON)
export interface SpriteMapEntity {
  id: string;
  type: string;
  name: string;
  sprite: string;
  position: { x: number; y: number };
  facing: string;
  dialogue_id?: string;
  role: string;
  element?: string;
  visible?: boolean;
}

export interface SpriteMapData {
  entities: SpriteMapEntity[];
}
