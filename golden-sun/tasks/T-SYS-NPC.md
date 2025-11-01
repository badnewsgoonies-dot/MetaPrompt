# CODER TASK: T-SYS-NPC - NPC System

## Context
- **Session:** 1 - Vale Village MVP
- **Dependencies:** None (foundation task)
- **Onboarding reference:** CODER_ONBOARDING.md (SUPER-ENTERPRISE patterns)
- **Story reference:** Story Bible (24 NPCs documented)
- **Visual reference:** vale-village.html mockup + sprite_map.json

## Requirements

Build a complete NPC system for Vale village with:
1. **NPC Entity Type** - Position, sprite, facing direction, dialogue ID
2. **NPC Registry** - Load 16 NPCs from sprite_map.json
3. **NPC Rendering** - Render NPCs at absolute positions with idle animation
4. **Interaction Zones** - Detect when player is facing NPC (1 tile distance)
5. **NPC State** - Track which NPCs have been talked to, dialogue progression

## Acceptance Criteria

- [ ] `src/types/npc.ts` created with NPC type definitions
- [ ] `src/systems/npcSystem.ts` created with pure functions
- [ ] `src/systems/npcSystem.test.ts` created with 15+ tests
- [ ] NPCs load from `mockups/sprite_map.json` (16 visible NPCs)
- [ ] Each NPC has: id, name, position (x,y), sprite path, facing direction, dialogue_id
- [ ] `canInteractWithNPC(player, npc)` function - returns true if player facing NPC within 1 tile
- [ ] `getNearbyNPCs(player, npcs, radius)` function - returns NPCs within interaction range
- [ ] NPC idle animation (2-frame toggle, 500ms interval)
- [ ] NPC facing directions: 'up', 'down', 'left', 'right'
- [ ] TypeScript: 0 errors
- [ ] Tests: 100% pass (15+ tests minimum)
- [ ] Performance: NPC update loop < 5ms for 20 NPCs

## Deliverables

### 1. Type Definitions (`src/types/npc.ts`)

```typescript
// NPC type definitions

export type NPCFacing = 'up' | 'down' | 'left' | 'right';

export type NPCRole = 'protagonist' | 'major_npc' | 'minor_npc' | 'antagonist' | 'shopkeeper';

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
  element?: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
  visible: boolean;         // Some NPCs hidden until story triggers
  interactionRange: number; // Tiles (default: 1)
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
```

### 2. NPC System (`src/systems/npcSystem.ts`)

```typescript
import { NPC, NPCRegistry, NPCFacing, NPCInteractionCheck, NPCPosition } from '../types/npc';
import { Result, Ok, Err } from '../utils/result';

/**
 * Initialize NPC registry from sprite map data
 */
export function initializeNPCs(spriteMapData: any): Result<NPCRegistry, string> {
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
          role: entity.role,
          element: entity.element,
          visible: entity.visible !== false, // Default true if not specified
          interactionRange: 32, // 1 tile at 2× scale (16px tile × 2 = 32px)
          hasBeenTalkedTo: false
        };

        npcs.set(npc.id, npc);
        
        if (npc.visible) {
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
    ? [...registry.visible, npcId]
    : registry.visible.filter(id => id !== npcId);

  return Ok({ npcs: updatedNPCs, visible: updatedVisible });
}

/**
 * Get NPC facing direction towards player (for NPCs that turn to face player)
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
```

### 3. Tests (`src/systems/npcSystem.test.ts`)

```typescript
import { describe, it, expect } from 'vitest';
import {
  initializeNPCs,
  canInteractWithNPC,
  getNearbyNPCs,
  findInteractableNPC,
  markNPCAsTalkedTo,
  setNPCVisible,
  getFacingTowardsPlayer
} from './npcSystem';

describe('npcSystem', () => {
  const mockSpriteMap = {
    entities: [
      {
        id: 'garet',
        type: 'npc',
        name: 'Garet',
        sprite: './assets/Garet.gif',
        position: { x: 340, y: 220 },
        facing: 'right',
        dialogue_id: 'garet-intro',
        role: 'protagonist',
        element: 'Mars'
      },
      {
        id: 'dora',
        type: 'npc',
        name: 'Dora',
        sprite: './assets/Dora.gif',
        position: { x: 280, y: 260 },
        facing: 'down',
        dialogue_id: 'dora-greeting',
        role: 'major_npc'
      },
      {
        id: 'ivan',
        type: 'npc',
        name: 'Ivan',
        sprite: './assets/Ivan.gif',
        position: { x: 720, y: 360 },
        facing: 'left',
        dialogue_id: 'ivan-joins',
        role: 'protagonist',
        visible: false // Hidden initially
      }
    ]
  };

  describe('initializeNPCs', () => {
    it('should initialize NPC registry from sprite map', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.isOk).toBe(true);

      const registry = result.value!;
      expect(registry.npcs.size).toBe(3);
      expect(registry.visible.length).toBe(2); // Ivan hidden
    });

    it('should set default values for NPCs', () => {
      const result = initializeNPCs(mockSpriteMap);
      const registry = result.value!;
      const garet = registry.npcs.get('garet')!;

      expect(garet.hasBeenTalkedTo).toBe(false);
      expect(garet.interactionRange).toBe(32);
      expect(garet.visible).toBe(true);
    });
  });

  describe('canInteractWithNPC', () => {
    const npc = {
      id: 'garet',
      name: 'Garet',
      sprite: './assets/Garet.gif',
      position: { x: 340, y: 220 },
      facing: 'right' as const,
      dialogue_id: 'garet-intro',
      role: 'protagonist' as const,
      visible: true,
      interactionRange: 32,
      hasBeenTalkedTo: false
    };

    it('should return true when player facing NPC within range', () => {
      const playerPos = { x: 370, y: 220 }; // 30px to right of NPC
      const playerFacing = 'left' as const;

      const canInteract = canInteractWithNPC(playerPos, playerFacing, npc);
      expect(canInteract).toBe(true);
    });

    it('should return false when player not facing NPC', () => {
      const playerPos = { x: 370, y: 220 };
      const playerFacing = 'right' as const; // Facing away

      const canInteract = canInteractWithNPC(playerPos, playerFacing, npc);
      expect(canInteract).toBe(false);
    });

    it('should return false when player too far from NPC', () => {
      const playerPos = { x: 440, y: 220 }; // 100px away
      const playerFacing = 'left' as const;

      const canInteract = canInteractWithNPC(playerPos, playerFacing, npc);
      expect(canInteract).toBe(false);
    });

    it('should return false when NPC not visible', () => {
      const invisibleNPC = { ...npc, visible: false };
      const playerPos = { x: 370, y: 220 };
      const playerFacing = 'left' as const;

      const canInteract = canInteractWithNPC(playerPos, playerFacing, invisibleNPC);
      expect(canInteract).toBe(false);
    });
  });

  describe('getNearbyNPCs', () => {
    it('should return NPCs within radius', () => {
      const result = initializeNPCs(mockSpriteMap);
      const registry = result.value!;
      const playerPos = { x: 300, y: 240 };
      const radius = 100;

      const nearby = getNearbyNPCs(playerPos, registry, radius);
      expect(nearby.length).toBe(2); // Garet and Dora
      expect(nearby.some(n => n.id === 'garet')).toBe(true);
      expect(nearby.some(n => n.id === 'dora')).toBe(true);
    });

    it('should not return hidden NPCs', () => {
      const result = initializeNPCs(mockSpriteMap);
      const registry = result.value!;
      const playerPos = { x: 720, y: 360 };
      const radius = 50;

      const nearby = getNearbyNPCs(playerPos, registry, radius);
      expect(nearby.some(n => n.id === 'ivan')).toBe(false);
    });
  });

  describe('findInteractableNPC', () => {
    it('should find nearest interactable NPC', () => {
      const result = initializeNPCs(mockSpriteMap);
      const registry = result.value!;
      const playerPos = { x: 370, y: 220 };
      const playerFacing = 'left' as const;

      const check = findInteractableNPC(playerPos, playerFacing, registry);
      expect(check.canInteract).toBe(true);
      expect(check.npc?.id).toBe('garet');
    });

    it('should return null when no NPCs in range', () => {
      const result = initializeNPCs(mockSpriteMap);
      const registry = result.value!;
      const playerPos = { x: 500, y: 500 };
      const playerFacing = 'up' as const;

      const check = findInteractableNPC(playerPos, playerFacing, registry);
      expect(check.canInteract).toBe(false);
      expect(check.npc).toBe(null);
    });
  });

  describe('markNPCAsTalkedTo', () => {
    it('should mark NPC as talked to', () => {
      const result = initializeNPCs(mockSpriteMap);
      let registry = result.value!;

      const updateResult = markNPCAsTalkedTo(registry, 'garet');
      expect(updateResult.isOk).toBe(true);

      registry = updateResult.value!;
      const garet = registry.npcs.get('garet')!;
      expect(garet.hasBeenTalkedTo).toBe(true);
    });

    it('should return error for invalid NPC ID', () => {
      const result = initializeNPCs(mockSpriteMap);
      const registry = result.value!;

      const updateResult = markNPCAsTalkedTo(registry, 'invalid-id');
      expect(updateResult.isErr).toBe(true);
    });
  });

  describe('setNPCVisible', () => {
    it('should show hidden NPC', () => {
      const result = initializeNPCs(mockSpriteMap);
      let registry = result.value!;

      expect(registry.visible.includes('ivan')).toBe(false);

      const updateResult = setNPCVisible(registry, 'ivan', true);
      expect(updateResult.isOk).toBe(true);

      registry = updateResult.value!;
      expect(registry.visible.includes('ivan')).toBe(true);
      expect(registry.npcs.get('ivan')!.visible).toBe(true);
    });

    it('should hide visible NPC', () => {
      const result = initializeNPCs(mockSpriteMap);
      let registry = result.value!;

      const updateResult = setNPCVisible(registry, 'garet', false);
      registry = updateResult.value!;

      expect(registry.visible.includes('garet')).toBe(false);
      expect(registry.npcs.get('garet')!.visible).toBe(false);
    });
  });

  describe('getFacingTowardsPlayer', () => {
    it('should return right when player is to the right', () => {
      const npcPos = { x: 100, y: 100 };
      const playerPos = { x: 200, y: 100 };

      const facing = getFacingTowardsPlayer(npcPos, playerPos);
      expect(facing).toBe('right');
    });

    it('should return up when player is above', () => {
      const npcPos = { x: 100, y: 100 };
      const playerPos = { x: 100, y: 50 };

      const facing = getFacingTowardsPlayer(npcPos, playerPos);
      expect(facing).toBe('up');
    });
  });
});
```

## Success Metrics

- **Tests:** 15+ tests, 100% pass
- **TypeScript:** 0 errors
- **Performance:** `getNearbyNPCs()` for 20 NPCs < 5ms
- **Coverage:** All functions tested (init, interact, nearby, visibility)

## Notes

- **Pure Functions:** All functions are pure (no side effects, immutable data)
- **Result Types:** Use Result<T,E> for operations that can fail
- **Collision Detection:** Use existing `collision.ts` utils if helpful
- **Sprite Map:** Load from `/mockups/sprite_map.json` at runtime
- **State Management:** NPC state (hasBeenTalkedTo) tracked in registry, persisted in save system

## Routing

**On completion:** CODER:COMPLETION → QA:VERIFY (with T-SYS-MOVEMENT)

**Next task:** T-SYS-DIALOGUE (depends on T-SYS-NPC + T-UI-DIALOGUE)
