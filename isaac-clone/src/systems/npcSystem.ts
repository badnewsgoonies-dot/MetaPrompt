import { NPC, NPCRegistry, NPCFacing, NPCInteractionCheck, NPCPosition, SpriteMapData } from '../types/npc';
import { Result, Ok, Err } from '../utils/result';

/**
 * Initialize NPC registry from sprite map data
 * Loads all NPCs from the sprite_map.json file
 */
export function initializeNPCs(spriteMapData: SpriteMapData): Result<NPCRegistry, string> {
  try {
    const npcs = new Map<string, NPC>();
    const visible: string[] = [];

    for (const entity of spriteMapData.entities) {
      if (entity.type === 'npc' || entity.type === 'player') {
        const npc: NPC = {
          id: entity.id,
          name: entity.name,
          sprite: entity.sprite,
          position: { x: entity.position.x, y: entity.position.y },
          facing: entity.facing as NPCFacing,
          dialogue_id: entity.dialogue_id || 'default',
          role: entity.role as any,
          element: entity.element as any,
          visible: entity.visible !== false, // Default true if not specified
          interactionRange: 32, // 1 tile at 2× scale (16px tile × 2 = 32px)
          hasBeenTalkedTo: false
        };

        npcs.set(npc.id, npc);
        
        if (npc.visible && entity.type !== 'player') {
          visible.push(npc.id);
        }
      }
    }

    return Ok({ npcs, visible });
  } catch (error) {
    return Err(`Failed to initialize NPCs: ${error}`);
  }
}

/**
 * Check if player can interact with NPC
 * Player must be facing NPC and within interaction range
 */
export function canInteractWithNPC(
  playerPos: NPCPosition,
  playerFacing: NPCFacing,
  npc: NPC
): boolean {
  if (!npc.visible) return false;

  const dx = npc.position.x - playerPos.x;
  const dy = npc.position.y - playerPos.y;
  const distance = Math.sqrt(dx * dx + dy * dy);

  // Must be within interaction range
  if (distance > npc.interactionRange) return false;

  // Must be facing towards NPC (approximate check)
  switch (playerFacing) {
    case 'up':
      return dy < 0 && Math.abs(dx) < npc.interactionRange;
    case 'down':
      return dy > 0 && Math.abs(dx) < npc.interactionRange;
    case 'left':
      return dx < 0 && Math.abs(dy) < npc.interactionRange;
    case 'right':
      return dx > 0 && Math.abs(dy) < npc.interactionRange;
    default:
      return false;
  }
}

/**
 * Get all NPCs within radius of player
 * Used for rendering nearby NPCs and collision detection
 */
export function getNearbyNPCs(
  playerPos: NPCPosition,
  registry: NPCRegistry,
  radius: number
): NPC[] {
  const nearby: NPC[] = [];

  for (const id of registry.visible) {
    const npc = registry.npcs.get(id);
    if (!npc) continue;

    const dx = npc.position.x - playerPos.x;
    const dy = npc.position.y - playerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);

    if (distance <= radius) {
      nearby.push(npc);
    }
  }

  return nearby;
}

/**
 * Find the nearest NPC that player can interact with
 * Returns the closest interactable NPC or null
 */
export function findInteractableNPC(
  playerPos: NPCPosition,
  playerFacing: NPCFacing,
  registry: NPCRegistry
): NPCInteractionCheck {
  let nearest: NPC | null = null;
  let nearestDistance = Infinity;

  for (const id of registry.visible) {
    const npc = registry.npcs.get(id);
    if (!npc) continue;

    if (canInteractWithNPC(playerPos, playerFacing, npc)) {
      const dx = npc.position.x - playerPos.x;
      const dy = npc.position.y - playerPos.y;
      const distance = Math.sqrt(dx * dx + dy * dy);

      if (distance < nearestDistance) {
        nearest = npc;
        nearestDistance = distance;
      }
    }
  }

  return {
    canInteract: nearest !== null,
    npc: nearest,
    distance: nearest ? nearestDistance : Infinity
  };
}

/**
 * Mark NPC as talked to (state tracking)
 * Used for dialogue progression and quest states
 */
export function markNPCAsTalkedTo(registry: NPCRegistry, npcId: string): Result<NPCRegistry, string> {
  const npc = registry.npcs.get(npcId);
  if (!npc) {
    return Err(`NPC not found: ${npcId}`);
  }

  const updatedNPC = { ...npc, hasBeenTalkedTo: true };
  const updatedNPCs = new Map(registry.npcs);
  updatedNPCs.set(npcId, updatedNPC);

  return Ok({ ...registry, npcs: updatedNPCs });
}

/**
 * Show/hide NPC (for story progression)
 * Used to show Ivan, Mia, etc. when they join the story
 */
export function setNPCVisible(
  registry: NPCRegistry,
  npcId: string,
  visible: boolean
): Result<NPCRegistry, string> {
  const npc = registry.npcs.get(npcId);
  if (!npc) {
    return Err(`NPC not found: ${npcId}`);
  }

  const updatedNPC = { ...npc, visible };
  const updatedNPCs = new Map(registry.npcs);
  updatedNPCs.set(npcId, updatedNPC);

  const updatedVisible = visible
    ? Array.from(new Set([...registry.visible, npcId]))
    : registry.visible.filter(id => id !== npcId);

  return Ok({ npcs: updatedNPCs, visible: updatedVisible });
}

/**
 * Get NPC facing direction towards player (for NPCs that turn to face player)
 * Not used in MVP but useful for future enhancements
 */
export function getFacingTowardsPlayer(npcPos: NPCPosition, playerPos: NPCPosition): NPCFacing {
  const dx = playerPos.x - npcPos.x;
  const dy = playerPos.y - npcPos.y;

  // Determine primary direction based on larger delta
  if (Math.abs(dx) > Math.abs(dy)) {
    return dx > 0 ? 'right' : 'left';
  } else {
    return dy > 0 ? 'down' : 'up';
  }
}

/**
 * Update NPC position (for future movement system)
 * Currently NPCs are static, but this supports future patrol routes
 */
export function updateNPCPosition(
  registry: NPCRegistry,
  npcId: string,
  newPosition: NPCPosition
): Result<NPCRegistry, string> {
  const npc = registry.npcs.get(npcId);
  if (!npc) {
    return Err(`NPC not found: ${npcId}`);
  }

  const updatedNPC = { ...npc, position: newPosition };
  const updatedNPCs = new Map(registry.npcs);
  updatedNPCs.set(npcId, updatedNPC);

  return Ok({ ...registry, npcs: updatedNPCs });
}

/**
 * Update NPC facing direction
 * Used when NPCs turn to face player during dialogue
 */
export function updateNPCFacing(
  registry: NPCRegistry,
  npcId: string,
  facing: NPCFacing
): Result<NPCRegistry, string> {
  const npc = registry.npcs.get(npcId);
  if (!npc) {
    return Err(`NPC not found: ${npcId}`);
  }

  const updatedNPC = { ...npc, facing };
  const updatedNPCs = new Map(registry.npcs);
  updatedNPCs.set(npcId, updatedNPC);

  return Ok({ ...registry, npcs: updatedNPCs });
}
