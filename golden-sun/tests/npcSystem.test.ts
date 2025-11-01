import { describe, it, expect } from 'vitest';
import {
  initializeNPCs,
  canInteractWithNPC,
  getNearbyNPCs,
  findInteractableNPC,
  markNPCAsTalkedTo,
  setNPCVisible,
  getFacingTowardsPlayer,
  updateNPCPosition,
  updateNPCFacing
} from '../src/systems/npcSystem';
import { SpriteMapData } from '../src/types/npc';

describe('npcSystem', () => {
  const mockSpriteMap: SpriteMapData = {
    entities: [
      {
        id: 'isaac',
        type: 'player',
        name: 'Isaac',
        sprite: './assets/Isaac.gif',
        position: { x: 240, y: 160 },
        facing: 'down',
        dialogue_id: 'isaac-default',
        role: 'protagonist',
        element: 'Venus'
      },
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
        element: 'Jupiter',
        visible: false // Hidden initially
      },
      {
        id: 'shopkeeper',
        type: 'npc',
        name: 'Shopkeeper',
        sprite: './assets/Shopkeeper.gif',
        position: { x: 500, y: 300 },
        facing: 'down',
        dialogue_id: 'shop-welcome',
        role: 'shopkeeper'
      }
    ]
  };

  describe('initializeNPCs', () => {
    it('should initialize NPC registry from sprite map', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        expect(registry.npcs.size).toBe(5); // isaac + 4 NPCs
        expect(registry.visible.length).toBe(3); // Ivan hidden, Isaac is player
      }
    });

    it('should set default values for NPCs', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const garet = registry.npcs.get('garet');
        
        expect(garet).toBeDefined();
        if (garet) {
          expect(garet.hasBeenTalkedTo).toBe(false);
          expect(garet.interactionRange).toBe(32);
          expect(garet.visible).toBe(true);
        }
      }
    });

    it('should handle missing dialogue_id with default', () => {
      const spriteMapNoDialogue: SpriteMapData = {
        entities: [{
          id: 'test-npc',
          type: 'npc',
          name: 'Test NPC',
          sprite: './test.gif',
          position: { x: 100, y: 100 },
          facing: 'down',
          role: 'minor_npc'
        }]
      };

      const result = initializeNPCs(spriteMapNoDialogue);
      expect(result.ok).toBe(true);
      
      if (result.ok) {
        const npc = result.value.npcs.get('test-npc');
        expect(npc?.dialogue_id).toBe('default');
      }
    });

    it('should not include player in visible NPCs', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        expect(registry.visible.includes('isaac')).toBe(false);
      }
    });

    it('should handle empty sprite map', () => {
      const emptySpriteMap: SpriteMapData = { entities: [] };
      const result = initializeNPCs(emptySpriteMap);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.npcs.size).toBe(0);
        expect(result.value.visible.length).toBe(0);
      }
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
      element: 'Mars' as const,
      visible: true,
      interactionRange: 32,
      hasBeenTalkedTo: false
    };

    it('should return true when player facing NPC within range (left)', () => {
      const playerPos = { x: 370, y: 220 }; // 30px to right of NPC
      const playerFacing = 'left' as const;

      const canInteract = canInteractWithNPC(playerPos, playerFacing, npc);
      expect(canInteract).toBe(true);
    });

    it('should return true when player facing NPC within range (right)', () => {
      const playerPos = { x: 310, y: 220 }; // 30px to left of NPC
      const playerFacing = 'right' as const;

      const canInteract = canInteractWithNPC(playerPos, playerFacing, npc);
      expect(canInteract).toBe(true);
    });

    it('should return true when player facing NPC within range (up)', () => {
      const playerPos = { x: 340, y: 250 }; // 30px below NPC
      const playerFacing = 'up' as const;

      const canInteract = canInteractWithNPC(playerPos, playerFacing, npc);
      expect(canInteract).toBe(true);
    });

    it('should return true when player facing NPC within range (down)', () => {
      const playerPos = { x: 340, y: 190 }; // 30px above NPC
      const playerFacing = 'down' as const;

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

    it('should return false at exact interaction range boundary', () => {
      const playerPos = { x: 340 + 33, y: 220 }; // Just beyond 32px
      const playerFacing = 'left' as const;

      const canInteract = canInteractWithNPC(playerPos, playerFacing, npc);
      expect(canInteract).toBe(false);
    });
  });

  describe('getNearbyNPCs', () => {
    it('should return NPCs within radius', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const playerPos = { x: 300, y: 240 };
        const radius = 100;

        const nearby = getNearbyNPCs(playerPos, registry, radius);
        expect(nearby.length).toBe(2); // Garet and Dora
        expect(nearby.some(n => n.id === 'garet')).toBe(true);
        expect(nearby.some(n => n.id === 'dora')).toBe(true);
      }
    });

    it('should not return hidden NPCs', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const playerPos = { x: 720, y: 360 }; // Same position as Ivan
        const radius = 50;

        const nearby = getNearbyNPCs(playerPos, registry, radius);
        expect(nearby.some(n => n.id === 'ivan')).toBe(false);
      }
    });

    it('should return empty array when no NPCs in range', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const playerPos = { x: 1000, y: 1000 }; // Far away
        const radius = 50;

        const nearby = getNearbyNPCs(playerPos, registry, radius);
        expect(nearby.length).toBe(0);
      }
    });

    it('should return all visible NPCs with large radius', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const playerPos = { x: 400, y: 300 };
        const radius = 1000;

        const nearby = getNearbyNPCs(playerPos, registry, radius);
        expect(nearby.length).toBe(3); // All visible NPCs (not Ivan)
      }
    });

    it('should handle exact radius boundary', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        // Garet is at 340, 220
        const playerPos = { x: 340, y: 220 + 50 }; // Exactly 50px away
        const radius = 50;

        const nearby = getNearbyNPCs(playerPos, registry, radius);
        expect(nearby.some(n => n.id === 'garet')).toBe(true);
      }
    });
  });

  describe('findInteractableNPC', () => {
    it('should find nearest interactable NPC', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const playerPos = { x: 370, y: 220 };
        const playerFacing = 'left' as const;

        const check = findInteractableNPC(playerPos, playerFacing, registry);
        expect(check.canInteract).toBe(true);
        expect(check.npc?.id).toBe('garet');
      }
    });

    it('should return null when no NPCs in range', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const playerPos = { x: 1000, y: 1000 };
        const playerFacing = 'up' as const;

        const check = findInteractableNPC(playerPos, playerFacing, registry);
        expect(check.canInteract).toBe(false);
        expect(check.npc).toBe(null);
        expect(check.distance).toBe(Infinity);
      }
    });

    it('should return closest NPC when multiple are interactable', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        // Garet at (340, 220), Dora at (280, 260)
        // Position close to both, facing left towards Dora
        const playerPos = { x: 305, y: 258 }; // Within 32px of Dora
        const playerFacing = 'left' as const;

        const check = findInteractableNPC(playerPos, playerFacing, registry);
        expect(check.canInteract).toBe(true);
        // Should be Dora since player is facing left
        expect(check.npc?.id).toBe('dora');
      }
    });

    it('should return null when facing away from all NPCs', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const playerPos = { x: 300, y: 240 };
        const playerFacing = 'up' as const; // Facing up, away from NPCs below

        const check = findInteractableNPC(playerPos, playerFacing, registry);
        expect(check.canInteract).toBe(false);
      }
    });
  });

  describe('markNPCAsTalkedTo', () => {
    it('should mark NPC as talked to', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        let registry = result.value;
        const garetBefore = registry.npcs.get('garet');
        expect(garetBefore?.hasBeenTalkedTo).toBe(false);

        const updateResult = markNPCAsTalkedTo(registry, 'garet');
        expect(updateResult.ok).toBe(true);

        if (updateResult.ok) {
          registry = updateResult.value;
          const garetAfter = registry.npcs.get('garet');
          expect(garetAfter?.hasBeenTalkedTo).toBe(true);
        }
      }
    });

    it('should return error for invalid NPC ID', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const updateResult = markNPCAsTalkedTo(registry, 'invalid-id');
        
        expect(updateResult.ok).toBe(false);
        if (!updateResult.ok) {
          expect(updateResult.error).toContain('NPC not found');
        }
      }
    });

    it('should not modify original registry', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const originalGaret = registry.npcs.get('garet');
        
        markNPCAsTalkedTo(registry, 'garet');
        
        // Original should be unchanged
        expect(registry.npcs.get('garet')?.hasBeenTalkedTo).toBe(false);
        expect(originalGaret?.hasBeenTalkedTo).toBe(false);
      }
    });
  });

  describe('setNPCVisible', () => {
    it('should show hidden NPC', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        let registry = result.value;
        expect(registry.visible.includes('ivan')).toBe(false);

        const updateResult = setNPCVisible(registry, 'ivan', true);
        expect(updateResult.ok).toBe(true);

        if (updateResult.ok) {
          registry = updateResult.value;
          expect(registry.visible.includes('ivan')).toBe(true);
          expect(registry.npcs.get('ivan')?.visible).toBe(true);
        }
      }
    });

    it('should hide visible NPC', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        let registry = result.value;
        expect(registry.visible.includes('garet')).toBe(true);

        const updateResult = setNPCVisible(registry, 'garet', false);
        expect(updateResult.ok).toBe(true);

        if (updateResult.ok) {
          registry = updateResult.value;
          expect(registry.visible.includes('garet')).toBe(false);
          expect(registry.npcs.get('garet')?.visible).toBe(false);
        }
      }
    });

    it('should return error for invalid NPC ID', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const updateResult = setNPCVisible(registry, 'invalid-id', true);
        
        expect(updateResult.ok).toBe(false);
        if (!updateResult.ok) {
          expect(updateResult.error).toContain('NPC not found');
        }
      }
    });

    it('should not create duplicate visible entries', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        let registry = result.value;
        
        // Show Ivan
        const result1 = setNPCVisible(registry, 'ivan', true);
        expect(result1.ok).toBe(true);
        if (result1.ok) registry = result1.value;
        
        // Show Ivan again
        const result2 = setNPCVisible(registry, 'ivan', true);
        expect(result2.ok).toBe(true);
        if (result2.ok) {
          registry = result2.value;
          const ivanCount = registry.visible.filter(id => id === 'ivan').length;
          expect(ivanCount).toBe(1);
        }
      }
    });
  });

  describe('getFacingTowardsPlayer', () => {
    it('should return right when player is to the right', () => {
      const npcPos = { x: 100, y: 100 };
      const playerPos = { x: 200, y: 100 };

      const facing = getFacingTowardsPlayer(npcPos, playerPos);
      expect(facing).toBe('right');
    });

    it('should return left when player is to the left', () => {
      const npcPos = { x: 200, y: 100 };
      const playerPos = { x: 100, y: 100 };

      const facing = getFacingTowardsPlayer(npcPos, playerPos);
      expect(facing).toBe('left');
    });

    it('should return up when player is above', () => {
      const npcPos = { x: 100, y: 100 };
      const playerPos = { x: 100, y: 50 };

      const facing = getFacingTowardsPlayer(npcPos, playerPos);
      expect(facing).toBe('up');
    });

    it('should return down when player is below', () => {
      const npcPos = { x: 100, y: 100 };
      const playerPos = { x: 100, y: 150 };

      const facing = getFacingTowardsPlayer(npcPos, playerPos);
      expect(facing).toBe('down');
    });

    it('should prioritize horizontal direction when diagonal', () => {
      const npcPos = { x: 100, y: 100 };
      const playerPos = { x: 200, y: 120 }; // More horizontal than vertical

      const facing = getFacingTowardsPlayer(npcPos, playerPos);
      expect(facing).toBe('right');
    });

    it('should prioritize vertical direction when diagonal (vertical dominant)', () => {
      const npcPos = { x: 100, y: 100 };
      const playerPos = { x: 120, y: 200 }; // More vertical than horizontal

      const facing = getFacingTowardsPlayer(npcPos, playerPos);
      expect(facing).toBe('down');
    });
  });

  describe('updateNPCPosition', () => {
    it('should update NPC position', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const newPosition = { x: 400, y: 300 };

        const updateResult = updateNPCPosition(registry, 'garet', newPosition);
        expect(updateResult.ok).toBe(true);

        if (updateResult.ok) {
          const updatedRegistry = updateResult.value;
          const garet = updatedRegistry.npcs.get('garet');
          expect(garet?.position).toEqual(newPosition);
        }
      }
    });

    it('should return error for invalid NPC ID', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const updateResult = updateNPCPosition(registry, 'invalid-id', { x: 0, y: 0 });
        
        expect(updateResult.ok).toBe(false);
        if (!updateResult.ok) {
          expect(updateResult.error).toContain('NPC not found');
        }
      }
    });

    it('should not modify original registry', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const originalPos = { ...registry.npcs.get('garet')!.position };
        
        updateNPCPosition(registry, 'garet', { x: 999, y: 999 });
        
        expect(registry.npcs.get('garet')?.position).toEqual(originalPos);
      }
    });
  });

  describe('updateNPCFacing', () => {
    it('should update NPC facing direction', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const updateResult = updateNPCFacing(registry, 'garet', 'left');
        
        expect(updateResult.ok).toBe(true);
        if (updateResult.ok) {
          const updatedRegistry = updateResult.value;
          const garet = updatedRegistry.npcs.get('garet');
          expect(garet?.facing).toBe('left');
        }
      }
    });

    it('should return error for invalid NPC ID', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const updateResult = updateNPCFacing(registry, 'invalid-id', 'up');
        
        expect(updateResult.ok).toBe(false);
        if (!updateResult.ok) {
          expect(updateResult.error).toContain('NPC not found');
        }
      }
    });

    it('should not modify original registry', () => {
      const result = initializeNPCs(mockSpriteMap);
      expect(result.ok).toBe(true);

      if (result.ok) {
        const registry = result.value;
        const originalFacing = registry.npcs.get('garet')!.facing;
        
        updateNPCFacing(registry, 'garet', 'up');
        
        expect(registry.npcs.get('garet')?.facing).toBe(originalFacing);
      }
    });
  });
});
