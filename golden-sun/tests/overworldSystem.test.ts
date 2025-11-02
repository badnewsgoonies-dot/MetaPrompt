import { describe, it, expect } from 'vitest';
import {
  createSceneRegistry,
  registerScene,
  getCurrentScene,
  getScene,
  createActiveScene,
  checkDoorProximity,
  findNearestDoor,
  canEnterDoor,
  startSceneTransition,
  updateTransition,
  completeTransition,
  isTransitioning,
  getTransitionOpacity,
  enterDoor,
  createValeVillageScene,
  createInteriorScene,
  getSceneObstacles,
  isInDoorZone,
  findDoorAtPosition,
  FADE_DURATION
} from '../src/systems/overworldSystem';
import { Scene, SceneDoor } from '../src/types/scene';

describe('overworldSystem', () => {
  const mockInteriorScene: Scene = {
    id: 'isaac-house',
    name: "Isaac's House",
    type: 'interior',
    width: 480,
    height: 320,
    doors: [
      {
        id: 'exit',
        position: { x: 240, y: 300 },
        width: 32,
        height: 8,
        targetScene: 'vale-village',
        targetPosition: { x: 200, y: 250 },
        requiresInteraction: true,
        locked: false
      }
    ],
    obstacles: [],
    npcIds: ['dora'],
    spawnPosition: { x: 240, y: 280 },
    cameraMode: 'fixed'
  };

  const mockDoor: SceneDoor = {
    id: 'test-door',
    position: { x: 200, y: 250 },
    width: 32,
    height: 8,
    targetScene: 'isaac-house',
    targetPosition: { x: 240, y: 280 },
    requiresInteraction: true,
    locked: false
  };

  describe('createSceneRegistry', () => {
    it('should create empty scene registry', () => {
      const registry = createSceneRegistry();
      
      expect(registry.scenes.size).toBe(0);
      expect(registry.currentSceneId).toBe('vale-village');
    });
  });

  describe('registerScene', () => {
    it('should register new scene', () => {
      const registry = createSceneRegistry();
      const result = registerScene(registry, mockInteriorScene);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.scenes.size).toBe(1);
        expect(result.value.scenes.get('isaac-house')).toBeDefined();
      }
    });

    it('should return error for duplicate scene ID', () => {
      let registry = createSceneRegistry();
      const result1 = registerScene(registry, mockInteriorScene);
      expect(result1.ok).toBe(true);
      
      if (result1.ok) {
        registry = result1.value;
        const result2 = registerScene(registry, mockInteriorScene);
        
        expect(result2.ok).toBe(false);
        if (!result2.ok) {
          expect(result2.error).toContain('already registered');
        }
      }
    });

    it('should not modify original registry', () => {
      const registry = createSceneRegistry();
      registerScene(registry, mockInteriorScene);
      
      expect(registry.scenes.size).toBe(0);
    });
  });

  describe('getCurrentScene', () => {
    it('should get current scene', () => {
      let registry = createSceneRegistry();
      const valeScene = createValeVillageScene();
      
      const result1 = registerScene(registry, valeScene);
      expect(result1.ok).toBe(true);
      if (!result1.ok) return;
      registry = result1.value;

      const result = getCurrentScene(registry);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.id).toBe('vale-village');
      }
    });

    it('should return error if current scene not registered', () => {
      const registry = createSceneRegistry();
      const result = getCurrentScene(registry);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('getScene', () => {
    it('should get scene by ID', () => {
      let registry = createSceneRegistry();
      const result1 = registerScene(registry, mockInteriorScene);
      expect(result1.ok).toBe(true);
      if (!result1.ok) return;
      registry = result1.value;

      const result = getScene(registry, 'isaac-house');
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.name).toBe("Isaac's House");
      }
    });

    it('should return error for non-existent scene', () => {
      const registry = createSceneRegistry();
      const result = getScene(registry, 'invalid-scene' as any);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });
  });

  describe('createActiveScene', () => {
    it('should create active scene', () => {
      const activeScene = createActiveScene(mockInteriorScene);
      
      expect(activeScene.current).toEqual(mockInteriorScene);
      expect(activeScene.previous).toBeUndefined();
      expect(activeScene.transitionState.phase).toBe('idle');
      expect(activeScene.transitionState.progress).toBe(1);
    });
  });

  describe('checkDoorProximity', () => {
    it('should detect when player is near door', () => {
      const playerPos = { x: 216, y: 254 }; // Center of door
      const isNear = checkDoorProximity(playerPos, mockDoor, 16);
      
      expect(isNear).toBe(true);
    });

    it('should return false when player is far from door', () => {
      const playerPos = { x: 300, y: 300 };
      const isNear = checkDoorProximity(playerPos, mockDoor, 16);
      
      expect(isNear).toBe(false);
    });

    it('should respect custom proximity radius', () => {
      const playerPos = { x: 250, y: 270 }; // ~30px away
      
      expect(checkDoorProximity(playerPos, mockDoor, 20)).toBe(false);
      expect(checkDoorProximity(playerPos, mockDoor, 40)).toBe(true);
    });
  });

  describe('findNearestDoor', () => {
    it('should find nearest door', () => {
      const scene = createValeVillageScene();
      const playerPos = { x: 580, y: 465 }; // Near Isaac's house door (576, 460)
      
      const door = findNearestDoor(playerPos, scene, 50);
      
      expect(door).not.toBeNull();
      expect(door?.id).toBe('isaac-house-entrance');
    });

    it('should return null when no doors in range', () => {
      const scene = createValeVillageScene();
      const playerPos = { x: 100, y: 100 }; // Far from all doors
      
      const door = findNearestDoor(playerPos, scene, 20);
      
      expect(door).toBeNull();
    });

    it('should return closest door when multiple in range', () => {
      const scene = createValeVillageScene();
      const playerPos = { x: 1340, y: 625 }; // Near item shop (1336, 620)
      
      const door = findNearestDoor(playerPos, scene, 200);
      
      expect(door).not.toBeNull();
      // Should be item shop (closest)
      expect(door?.id).toBe('item-shop-entrance');
    });
  });

  describe('canEnterDoor', () => {
    it('should allow entering unlocked door', () => {
      const result = canEnterDoor(mockDoor);
      
      expect(result.ok).toBe(true);
    });

    it('should prevent entering locked door without key', () => {
      const lockedDoor: SceneDoor = {
        ...mockDoor,
        locked: true,
        keyRequired: 'golden-key'
      };
      
      const result = canEnterDoor(lockedDoor, []);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('golden-key');
      }
    });

    it('should allow entering locked door with key', () => {
      const lockedDoor: SceneDoor = {
        ...mockDoor,
        locked: true,
        keyRequired: 'golden-key'
      };
      
      const result = canEnterDoor(lockedDoor, ['golden-key', 'herb']);
      
      expect(result.ok).toBe(true);
    });

    it('should prevent entering locked door with no key requirement specified', () => {
      const lockedDoor: SceneDoor = {
        ...mockDoor,
        locked: true
      };
      
      const result = canEnterDoor(lockedDoor);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('locked');
      }
    });
  });

  describe('startSceneTransition', () => {
    it('should start fade transition', () => {
      const activeScene = createActiveScene(mockInteriorScene);
      const transitioned = startSceneTransition(
        activeScene,
        'vale-village',
        { x: 200, y: 250 },
        'fade'
      );
      
      expect(transitioned.transitionState.phase).toBe('fade-out');
      expect(transitioned.transitionState.progress).toBe(0);
      expect(transitioned.transitionState.targetScene).toBe('vale-village');
    });

    it('should default to fade transition', () => {
      const activeScene = createActiveScene(mockInteriorScene);
      const transitioned = startSceneTransition(
        activeScene,
        'vale-village',
        { x: 200, y: 250 }
      );
      
      expect(transitioned.transitionState.type).toBe('fade');
    });
  });

  describe('updateTransition', () => {
    it('should not update when idle', () => {
      const activeScene = createActiveScene(mockInteriorScene);
      const updated = updateTransition(activeScene, 100);
      
      expect(updated.transitionState.progress).toBe(1);
      expect(updated.transitionState.phase).toBe('idle');
    });

    it('should progress fade-out', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      
      const updated = updateTransition(activeScene, 150); // Half of FADE_DURATION
      
      expect(updated.transitionState.progress).toBeGreaterThan(0);
      expect(updated.transitionState.progress).toBeLessThan(1);
      expect(updated.transitionState.phase).toBe('fade-out');
    });

    it('should move to loading phase after fade-out completes', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      
      const updated = updateTransition(activeScene, FADE_DURATION);
      
      expect(updated.transitionState.phase).toBe('loading');
    });

    it('should move to fade-in phase after loading', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      activeScene = updateTransition(activeScene, FADE_DURATION);
      
      expect(activeScene.transitionState.phase).toBe('loading');
      
      const updated = updateTransition(activeScene, 1);
      expect(updated.transitionState.phase).toBe('fade-in');
      // Progress resets to near 0 when entering fade-in
      expect(updated.transitionState.progress).toBeCloseTo(0, 2);
    });

    it('should return to idle after fade-in completes', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      activeScene = updateTransition(activeScene, FADE_DURATION);
      activeScene = updateTransition(activeScene, 1);
      
      const updated = updateTransition(activeScene, FADE_DURATION);
      
      expect(updated.transitionState.phase).toBe('idle');
    });
  });

  describe('completeTransition', () => {
    it('should load new scene', () => {
      let registry = createSceneRegistry();
      const valeScene = createValeVillageScene();
      
      let result = registerScene(registry, mockInteriorScene);
      if (!result.ok) return;
      registry = result.value;
      
      result = registerScene(registry, valeScene);
      if (!result.ok) return;
      registry = result.value;

      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      activeScene = updateTransition(activeScene, FADE_DURATION);
      
      const completeResult = completeTransition(activeScene, registry);
      
      expect(completeResult.ok).toBe(true);
      if (completeResult.ok) {
        expect(completeResult.value.activeScene.current.id).toBe('vale-village');
        expect(completeResult.value.activeScene.previous).toBe('isaac-house');
        expect(completeResult.value.registry.currentSceneId).toBe('vale-village');
      }
    });

    it('should return error when target scene not found', () => {
      const registry = createSceneRegistry();
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'invalid-scene' as any, { x: 0, y: 0 });
      
      const result = completeTransition(activeScene, registry);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    it('should return error when no target scene specified', () => {
      const registry = createSceneRegistry();
      const activeScene = createActiveScene(mockInteriorScene);
      
      const result = completeTransition(activeScene, registry);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('No target scene');
      }
    });
  });

  describe('isTransitioning', () => {
    it('should return false when idle', () => {
      const activeScene = createActiveScene(mockInteriorScene);
      expect(isTransitioning(activeScene)).toBe(false);
    });

    it('should return true during fade-out', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      
      expect(isTransitioning(activeScene)).toBe(true);
    });

    it('should return true during loading', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      activeScene = updateTransition(activeScene, FADE_DURATION);
      
      expect(isTransitioning(activeScene)).toBe(true);
    });

    it('should return true during fade-in', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      activeScene = updateTransition(activeScene, FADE_DURATION);
      activeScene = updateTransition(activeScene, 1);
      
      expect(isTransitioning(activeScene)).toBe(true);
    });
  });

  describe('getTransitionOpacity', () => {
    it('should return 0 when idle', () => {
      const activeScene = createActiveScene(mockInteriorScene);
      expect(getTransitionOpacity(activeScene)).toBe(0);
    });

    it('should increase during fade-out', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      activeScene = updateTransition(activeScene, 150);
      
      const opacity = getTransitionOpacity(activeScene);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });

    it('should be 1 during loading', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      activeScene = updateTransition(activeScene, FADE_DURATION);
      
      expect(getTransitionOpacity(activeScene)).toBe(1);
    });

    it('should decrease during fade-in', () => {
      let activeScene = createActiveScene(mockInteriorScene);
      activeScene = startSceneTransition(activeScene, 'vale-village', { x: 200, y: 250 });
      activeScene = updateTransition(activeScene, FADE_DURATION);
      activeScene = updateTransition(activeScene, 1);
      activeScene = updateTransition(activeScene, 150);
      
      const opacity = getTransitionOpacity(activeScene);
      expect(opacity).toBeGreaterThan(0);
      expect(opacity).toBeLessThan(1);
    });
  });

  describe('enterDoor', () => {
    it('should start transition when entering unlocked door', () => {
      const activeScene = createActiveScene(mockInteriorScene);
      const result = enterDoor(activeScene, mockDoor);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.transitionState.phase).toBe('fade-out');
        expect(result.value.transitionState.targetScene).toBe('isaac-house');
      }
    });

    it('should return error for locked door', () => {
      const activeScene = createActiveScene(mockInteriorScene);
      const lockedDoor: SceneDoor = { ...mockDoor, locked: true };
      
      const result = enterDoor(activeScene, lockedDoor);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('locked');
      }
    });
  });

  describe('createValeVillageScene', () => {
    it('should create vale village scene', () => {
      const scene = createValeVillageScene();
      
      expect(scene.id).toBe('vale-village');
      expect(scene.type).toBe('overworld');
      expect(scene.doors.length).toBeGreaterThan(0);
      expect(scene.obstacles.length).toBeGreaterThan(0);
      expect(scene.cameraMode).toBe('follow');
    });

    it('should include all major buildings', () => {
      const scene = createValeVillageScene();
      
      const doorIds = scene.doors.map(d => d.id);
      expect(doorIds).toContain('isaac-house-entrance');
      expect(doorIds).toContain('item-shop-entrance');
      expect(doorIds).toContain('armor-shop-entrance');
    });
  });

  describe('createInteriorScene', () => {
    it('should create interior scene with exit door', () => {
      const scene = createInteriorScene('item-shop', 'Item Shop');
      
      expect(scene.id).toBe('item-shop');
      expect(scene.name).toBe('Item Shop');
      expect(scene.type).toBe('interior');
      expect(scene.doors.length).toBe(1);
      expect(scene.doors[0].id).toBe('exit');
      expect(scene.cameraMode).toBe('fixed');
    });

    it('should use default exit position if not provided', () => {
      const scene = createInteriorScene('test-interior', 'Test');
      
      expect(scene.doors[0].position).toEqual({ x: 240, y: 300 });
    });
  });

  describe('getSceneObstacles', () => {
    it('should return scene obstacles', () => {
      const scene = createValeVillageScene();
      const obstacles = getSceneObstacles(scene);
      
      expect(obstacles.length).toBeGreaterThan(0);
      expect(obstacles[0].type).toBe('building');
    });
  });

  describe('isInDoorZone', () => {
    it('should return true when player in door zone', () => {
      const playerPos = { x: 216, y: 254 }; // Center of door
      expect(isInDoorZone(playerPos, mockDoor)).toBe(true);
    });

    it('should return false when player outside door zone', () => {
      const playerPos = { x: 300, y: 300 };
      expect(isInDoorZone(playerPos, mockDoor)).toBe(false);
    });

    it('should detect edge of door zone', () => {
      const playerPos = { x: 200, y: 250 }; // Left edge
      expect(isInDoorZone(playerPos, mockDoor)).toBe(true);
    });
  });

  describe('findDoorAtPosition', () => {
    it('should find auto-trigger door at position', () => {
      const autoTriggerDoor: SceneDoor = {
        ...mockDoor,
        requiresInteraction: false
      };
      
      const scene: Scene = {
        ...mockInteriorScene,
        doors: [autoTriggerDoor]
      };
      
      const playerPos = { x: 216, y: 254 };
      const door = findDoorAtPosition(playerPos, scene);
      
      expect(door).not.toBeNull();
      expect(door?.id).toBe('test-door');
    });

    it('should not find interaction-required doors', () => {
      const scene: Scene = {
        ...mockInteriorScene,
        doors: [mockDoor] // requiresInteraction = true
      };
      
      const playerPos = { x: 216, y: 254 };
      const door = findDoorAtPosition(playerPos, scene);
      
      expect(door).toBeNull();
    });

    it('should return null when not in any door zone', () => {
      const scene = createValeVillageScene();
      const playerPos = { x: 100, y: 100 };
      
      const door = findDoorAtPosition(playerPos, scene);
      expect(door).toBeNull();
    });
  });
});
