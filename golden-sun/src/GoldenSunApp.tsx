/**
 * Golden Sun Vale Village - Main App Component (Updated for New Dialogue System)
 * Integrates all systems into playable game with Pokemon-style trainer battles
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameWorld } from './components/GameWorld';
import { DialogueBox } from './components/DialogueBox';
import { ShopMenu } from './components/ShopMenu';
import { OnScreenController } from './components/OnScreenController';
import { NPCRegistry } from './types/npc';
import { initializeNPCs, findInteractableNPC, markNPCAsTalkedTo } from './systems/npcSystem';
import { 
  PlayerMovement, 
  Camera, 
  MovementInput,
  updatePlayerMovement, 
  updateCamera, 
  createCamera
} from './systems/movementSystem';
import { DialogueState } from './types/dialogue';
import { FlagSystem } from './types/storyFlags';
import {
  startDialogue,
  advanceDialogue
} from './systems/dialogueSystem';
import { createFlagSystem, loadFlags, saveFlags } from './systems/storyFlagSystem';
import {
  ShopState,
  Inventory,
  Shop
} from './types/shop';
import {
  createShopState,
  openShop,
  closeShop,
  buyItem,
  createInventory
} from './systems/shopSystem';
import { createValeVillageScene, findNearestDoor, canEnterDoor } from './systems/overworldSystem';
import type { ActiveScene } from './types/scene';
import './GoldenSunApp.css';

const GoldenSunApp: React.FC = () => {
  // Game state
  const [npcRegistry, setNPCRegistry] = useState<NPCRegistry | null>(null);
  const [activeScene, setActiveScene] = useState<ActiveScene | null>(null);
  const [player, setPlayer] = useState<PlayerMovement | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<DialogueState | null>(null);
  const [storyFlags, setStoryFlags] = useState<FlagSystem | null>(null);
  const [shopState, setShopState] = useState<ShopState | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [shops, setShops] = useState<Map<string, Shop>>(new Map());
  const [error, setError] = useState<string | null>(null);

  // Input state
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  // Refs
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize story flags
  useEffect(() => {
    const loadResult = loadFlags();
    if (loadResult.ok) {
      setStoryFlags(loadResult.value);
    } else {
      // Create new flag system if no saved flags
      setStoryFlags(createFlagSystem());
    }
  }, []);

  // Handle interact (talk to NPCs, enter doors)
  const handleInteract = useCallback(() => {
    if (!player || !activeScene || !storyFlags) return;
    
    // Don't interact if dialogue is active or shop is open
    if (activeDialogue || shopState?.isOpen) return;

    // Try to interact with door first
    const nearestDoor = findNearestDoor(player.position, activeScene.current, 48);
    
    if (nearestDoor) {
      const doorCheck = canEnterDoor(nearestDoor);
      
      if (doorCheck.ok) {
        // Check if it's a shop door
        const shopId = nearestDoor.id.includes('item-shop') ? 'item-shop' 
          : nearestDoor.id.includes('armor-shop') ? 'armor-shop'
          : null;

        if (shopId && shops.has(shopId) && shopState && inventory) {
          // Open shop
          const shop = shops.get(shopId)!;
          const newShopState = openShop(shopState, shop);
          setShopState(newShopState);
          return;
        }
      }
    }
    
    // Try to interact with NPC
    if (npcRegistry) {
      const interactionCheck = findInteractableNPC(
        player.position,
        player.facing,
        npcRegistry
      );

      if (interactionCheck.canInteract && interactionCheck.npc) {
        // Start dialogue with story flags
        const dialogueResult = startDialogue(
          interactionCheck.npc.id,
          interactionCheck.npc.dialogue_id,
          storyFlags
        );
        
        if (dialogueResult.ok) {
          setActiveDialogue(dialogueResult.value);
          
          // Mark NPC as talked to
          const updateResult = markNPCAsTalkedTo(npcRegistry, interactionCheck.npc.id);
          if (updateResult.ok) {
            setNPCRegistry(updateResult.value);
          }
        }
      }
    }
  }, [player, activeScene, npcRegistry, storyFlags, activeDialogue, shopState, shops, inventory]);

  // Handle dialogue advance
  const handleDialogueAdvance = useCallback(() => {
    if (!activeDialogue || !storyFlags) return;
    
    const advanceResult = advanceDialogue(activeDialogue, storyFlags);
    
    if (advanceResult.ok) {
      const { state: newState, flags: newFlags } = advanceResult.value;
      
      if (newState.completed) {
        // Dialogue completed, close it
        setActiveDialogue(null);
      } else {
        // Continue dialogue
        setActiveDialogue(newState);
      }
      
      // Update flags and save
      setStoryFlags(newFlags);
      saveFlags(newFlags);
    }
  }, [activeDialogue, storyFlags]);

  // Handle dialogue choice
  const handleDialogueChoice = useCallback((choiceIndex: number) => {
    if (!activeDialogue || !storyFlags) return;
    
    const advanceResult = advanceDialogue(activeDialogue, storyFlags, choiceIndex);
    
    if (advanceResult.ok) {
      const { state: newState, flags: newFlags } = advanceResult.value;
      
      setActiveDialogue(newState);
      setStoryFlags(newFlags);
      saveFlags(newFlags);
    }
  }, [activeDialogue, storyFlags]);

  // Keyboard input handlers
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => new Set(prev).add(e.key.toLowerCase()));
      
      // Handle interact key (Space/Enter)
      if (e.key === ' ' || e.key === 'Enter') {
        e.preventDefault();
        
        if (activeDialogue) {
          handleDialogueAdvance();
        } else {
          handleInteract();
        }
      }
      
      // Handle escape (close dialogue/shop)
      if (e.key === 'Escape') {
        if (activeDialogue) {
          setActiveDialogue(null);
        }
        if (shopState?.isOpen) {
          setShopState(closeShop(shopState));
        }
      }
    };

    const handleKeyUp = (e: KeyboardEvent) => {
      setKeysPressed(prev => {
        const next = new Set(prev);
        next.delete(e.key.toLowerCase());
        return next;
      });
    };

    window.addEventListener('keydown', handleKeyDown);
    window.addEventListener('keyup', handleKeyUp);

    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      window.removeEventListener('keyup', handleKeyUp);
    };
  }, [activeDialogue, handleInteract, handleDialogueAdvance, shopState]);

  // Initialize game
  useEffect(() => {
    try {
      // Create Vale Village scene
      const vale = createValeVillageScene();
      const scene: ActiveScene = {
        current: vale,
        previous: undefined,
        transitionState: { type: 'fade', phase: 'idle', progress: 1 }
      };
      setActiveScene(scene);

      // Initialize NPCs - need to load sprite_map.json
      fetch('/sprite_map.json')
        .then(res => res.json())
        .then(data => {
          const npcResult = initializeNPCs(data);
          if (npcResult.ok) {
            setNPCRegistry(npcResult.value);
          }
        })
        .catch(err => console.error('Failed to load NPCs:', err));

      // Create player at spawn position
      setPlayer({
        position: vale.spawnPosition,
        velocity: { dx: 0, dy: 0 },
        facing: 'down'
      });

      // Create camera
      setCamera(createCamera(vale.spawnPosition));

      // Initialize shop system
      const shops = new Map<string, Shop>();
      shops.set('item-shop', {
        id: 'item-shop',
        name: 'Vale Item Shop',
        type: 'item',
        inventory: [
          { id: 'potion', name: 'Potion', type: 'consumable', price: 50, description: 'Restores 50 HP', maxStack: 99 },
          { id: 'ether', name: 'Ether', type: 'consumable', price: 80, description: 'Restores 20 PP', maxStack: 99 },
        ],
        buybackItems: [],
        sellPriceMultiplier: 0.5
      });
      shops.set('armor-shop', {
        id: 'armor-shop',
        name: 'Vale Armor Shop',
        type: 'armor',
        inventory: [
          { id: 'leather-vest', name: 'Leather Vest', type: 'armor', price: 200, description: '+10 Defense', maxStack: 1 },
          { id: 'bronze-sword', name: 'Bronze Sword', type: 'weapon', price: 300, description: '+15 Attack', maxStack: 1 },
        ],
        buybackItems: [],
        sellPriceMultiplier: 0.5
      });
      setShops(shops);

      // Initialize inventory and shop state
      setInventory(createInventory(500)); // Start with 500 coins
      setShopState(createShopState());

    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to initialize game');
    }
  }, []);

  // Game loop
  useEffect(() => {
    if (!player || !activeScene || !camera) return;

    const gameLoop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      // Skip if delta is too large (tab was inactive)
      if (deltaTime > 100) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Don't update player if dialogue or shop is open
      if (activeDialogue || shopState?.isOpen) {
        gameLoopRef.current = requestAnimationFrame(gameLoop);
        return;
      }

      // Convert keys to movement input
      const input: MovementInput = {
        up: keysPressed.has('w') || keysPressed.has('arrowup'),
        down: keysPressed.has('s') || keysPressed.has('arrowdown'),
        left: keysPressed.has('a') || keysPressed.has('arrowleft'),
        right: keysPressed.has('d') || keysPressed.has('arrowright')
      };

      // Update player
      const bounds = {
        minX: 0,
        minY: 0,
        maxX: activeScene.current.width,
        maxY: activeScene.current.height
      };
      
      const updateResult = updatePlayerMovement(
        player,
        input,
        deltaTime,
        npcRegistry ? Array.from(npcRegistry.npcs.values()).map(npc => npc.position) : [],
        activeScene.current.obstacles,
        bounds
      );

      if (updateResult.ok) {
        setPlayer(updateResult.value);
        
        // Update camera
        const newCamera = updateCamera(camera, updateResult.value.position, deltaTime);
        setCamera(newCamera);
      }

      gameLoopRef.current = requestAnimationFrame(gameLoop);
    };

    gameLoopRef.current = requestAnimationFrame(gameLoop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [player, activeScene, camera, keysPressed, npcRegistry, activeDialogue, shopState]);

  // Error display
  if (error) {
    return (
      <div style={{ padding: '20px', color: 'red' }}>
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  // Loading display
  if (!player || !activeScene || !camera || !npcRegistry || !storyFlags) {
    return (
      <div style={{ padding: '20px' }}>
        <h1>Loading Golden Sun: Vale Village...</h1>
      </div>
    );
  }

  return (
    <div className="golden-sun-app">
      <GameWorld
        scene={activeScene.current}
        npcRegistry={npcRegistry}
        player={player}
        camera={camera}
      />

      {activeDialogue && (
        <DialogueBox
          dialogue={activeDialogue}
          onSelectChoice={handleDialogueChoice}
        />
      )}

      {shopState?.activeShop && inventory && (
        <ShopMenu
          shopState={shopState}
          playerInventory={inventory}
          shopItems={shopState.activeShop.inventory}
          onBuy={() => {
            const selectedItem = shopState.activeShop!.inventory[shopState.selectedIndex];
            if (selectedItem) {
              const result = buyItem(inventory, shopState.activeShop!, selectedItem, 1);
              if (result.ok) {
                setShopState({ ...shopState, activeShop: result.value.shop });
                setInventory(result.value.inventory);
              }
            }
          }}
          onSell={() => {
            // Selling not implemented yet
          }}
          onClose={() => setShopState(closeShop(shopState))}
          onChangeMode={(mode) => {
            setShopState({ ...shopState, mode });
          }}
        />
      )}

      <OnScreenController
        onKeyDown={(key: string) => {
          setKeysPressed(prev => new Set(prev).add(key));
          
          // Handle action key
          if (key === ' ' || key === 'Enter') {
            if (activeDialogue) {
              handleDialogueAdvance();
            } else {
              handleInteract();
            }
          }
        }}
        onKeyUp={(key: string) => {
          setKeysPressed(prev => {
            const next = new Set(prev);
            next.delete(key);
            return next;
          });
        }}
      />
    </div>
  );
};

export default GoldenSunApp;
