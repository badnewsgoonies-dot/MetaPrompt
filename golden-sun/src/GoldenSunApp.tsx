/**
 * Golden Sun Vale Village - Main App Component
 * Integrates all systems into playable game
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
  createCamera,
  createSceneBounds,
  isPlayerMoving
} from './systems/movementSystem';
import {
  DialogueRegistry,
  ActiveDialogue
} from './types/dialogue';
import {
  createDialogueRegistry,
  registerDialogue,
  startDialogue,
  updateDialogueReveal,
  advanceDialogue,
  selectDialogueChoice,
  setDialogueState,
  createSimpleDialogue,
  isDialogueActive,
  getCurrentLine
} from './systems/dialogueSystem';
import {
  ShopState,
  Inventory,
  Shop
} from './types/shop';
import {
  createShopState,
  openShop,
  closeShop,
  navigateShop,
  buyItem,
  sellItem,
  createItemShop,
  createArmorShop,
  createInventory
} from './systems/shopSystem';
import {
  ActiveScene
} from './types/scene';
import {
  createSceneRegistry,
  registerScene,
  createActiveScene,
  createValeVillageScene,
  findNearestDoor,
  canEnterDoor
} from './systems/overworldSystem';
import './GoldenSunApp.css';

const GoldenSunApp: React.FC = () => {
  // Game state
  const [npcRegistry, setNPCRegistry] = useState<NPCRegistry | null>(null);
  const [dialogueRegistry, setDialogueRegistry] = useState<DialogueRegistry | null>(null);
  const [activeScene, setActiveScene] = useState<ActiveScene | null>(null);
  const [player, setPlayer] = useState<PlayerMovement | null>(null);
  const [camera, setCamera] = useState<Camera | null>(null);
  const [activeDialogue, setActiveDialogue] = useState<ActiveDialogue | null>(null);
  const [shopState, setShopState] = useState<ShopState | null>(null);
  const [inventory, setInventory] = useState<Inventory | null>(null);
  const [shops, setShops] = useState<Map<string, Shop>>(new Map());
  const [error, setError] = useState<string | null>(null);

  // Input state
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  
  // Debug state - shows what buttons are being pressed
  const [debugInfo, setDebugInfo] = useState<string>('No input');

  // Refs
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Extract interaction logic for reuse by both keyboard and touch
  const handleInteract = useCallback(() => {
    console.log('[handleInteract] Called!');
    console.log('[handleInteract] - Player:', player ? `(${Math.round(player.position.x)}, ${Math.round(player.position.y)})` : 'NULL');
    console.log('[handleInteract] - Active Scene:', activeScene ? 'EXISTS' : 'NULL');
    console.log('[handleInteract] - NPC Registry:', npcRegistry ? `${npcRegistry.npcs.size} NPCs` : 'NULL');
    console.log('[handleInteract] - Dialogue Active:', isDialogueActive(activeDialogue));
    console.log('[handleInteract] - Shop Open:', shopState?.isOpen);
    
    // Don't interact if dialogue is active or shop is open
    if (isDialogueActive(activeDialogue) || shopState?.isOpen) {
      console.log('[handleInteract] Blocked - dialogue or shop open');
      return;
    }

    // Try to interact with door first (shops, buildings)
    if (player && activeScene) {
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
            return; // Don't check for NPCs if entering shop
          }
        }
      }
    }
    
    // Try to interact with NPC if not entering a door
    if (player && npcRegistry && dialogueRegistry) {
      console.log('[handleInteract] Checking for interactable NPC...');
      console.log('[handleInteract] Player facing:', player.facing);
      
      const interactionCheck = findInteractableNPC(
        player.position,
        player.facing,
        npcRegistry
      );

      console.log('[handleInteract] Interaction check result:', interactionCheck);
      console.log('[handleInteract] - Can interact:', interactionCheck.canInteract);
      console.log('[handleInteract] - NPC found:', interactionCheck.npc?.name || 'none');
      console.log('[handleInteract] - Distance:', interactionCheck.distance);

      if (interactionCheck.canInteract && interactionCheck.npc) {
        console.log('[handleInteract] Starting dialogue with:', interactionCheck.npc.name);
        
        // Start dialogue
        const dialogueResult = startDialogue(interactionCheck.npc.dialogue_id, dialogueRegistry);
        console.log('[handleInteract] Dialogue result:', dialogueResult.ok ? 'SUCCESS' : `FAIL: ${dialogueResult.error}`);
        
        if (dialogueResult.ok) {
          const dialogue = setDialogueState(dialogueResult.value, 'displaying');
          setActiveDialogue(dialogue);
          console.log('[handleInteract] Dialogue set to active');
          
          // Mark NPC as talked to
          const updateResult = markNPCAsTalkedTo(npcRegistry, interactionCheck.npc.id);
          if (updateResult.ok) {
            setNPCRegistry(updateResult.value);
          }
        }
      } else {
        console.log('[handleInteract] NO interactable NPC found');
        console.log('[handleInteract] Try facing the NPC directly (press D-pad towards them)');
      }
    }
  }, [player, activeScene, npcRegistry, dialogueRegistry, activeDialogue, shopState, shops, inventory]);

  const handleAdvanceDialogue = useCallback(() => {
    if (!activeDialogue || !dialogueRegistry) return;
    
    if (activeDialogue.state === 'displaying' || activeDialogue.state === 'waiting') {
      const advanceResult = advanceDialogue(activeDialogue);
      if (advanceResult.ok) {
        if (advanceResult.value.state === 'closing') {
          setActiveDialogue(null);
        } else {
          setActiveDialogue(advanceResult.value);
        }
      }
    }
  }, [activeDialogue, dialogueRegistry]);

  const handleCancel = useCallback(() => {
    // Close dialogue
    if (activeDialogue) {
      setActiveDialogue(null);
      return;
    }
    
    // Close shop
    if (shopState?.isOpen) {
      const newState = closeShop(shopState);
      setShopState(newState);
      return;
    }
  }, [activeDialogue, shopState]);

  // On-screen controller handlers
  const handleControllerKeyDown = useCallback((key: string) => {
    const timestamp = new Date().toISOString().split('T')[1];
    console.log(`[${timestamp}] Controller Down: "${key}"`);
    
    setDebugInfo(`Pressed: ${key} at ${timestamp}`);
    
    // Only add movement keys to keysPressed (D-pad)
    if (key.startsWith('Arrow')) {
      const lowerKey = key.toLowerCase();
      setKeysPressed(prev => new Set(prev).add(lowerKey));
      console.log(`[${timestamp}] Added to keysPressed: ${lowerKey}`);
    }
    
    // Handle action buttons directly (don't add to keysPressed to avoid WASD conflicts)
    if (key === 'Enter') {
      console.log(`[${timestamp}] A/Enter button pressed!`);
      console.log(`[${timestamp}] - Active Dialogue: ${isDialogueActive(activeDialogue)}`);
      console.log(`[${timestamp}] - Shop Open: ${shopState?.isOpen}`);
      console.log(`[${timestamp}] - Player: ${player ? `(${Math.round(player.position.x)}, ${Math.round(player.position.y)})` : 'null'}`);
      console.log(`[${timestamp}] - NPC Registry: ${npcRegistry ? `${npcRegistry.npcs.size} NPCs` : 'null'}`);
      
      setDebugInfo(`A pressed - Dialogue: ${isDialogueActive(activeDialogue)}`);
      
      // If dialogue is active, advance it
      if (isDialogueActive(activeDialogue)) {
        console.log(`[${timestamp}] ? Advancing dialogue`);
        setDebugInfo('A pressed - Advancing dialogue');
        handleAdvanceDialogue();
      } else {
        console.log(`[${timestamp}] ? Attempting interaction`);
        setDebugInfo('A pressed - Trying to interact');
        // Otherwise, try to interact
        handleInteract();
      }
    } else if (key === 'Escape') {
      console.log(`[${timestamp}] B/Escape button pressed!`);
      setDebugInfo(`B pressed - Cancelling`);
      handleCancel();
    }
  }, [activeDialogue, handleInteract, handleAdvanceDialogue, handleCancel, shopState, player, npcRegistry]);

  const handleControllerKeyUp = useCallback((key: string) => {
    // Only remove movement keys from keysPressed (D-pad)
    if (key.startsWith('Arrow')) {
      setKeysPressed(prev => {
        const next = new Set(prev);
        next.delete(key.toLowerCase());
        return next;
      });
    }
  }, []);

  // Initialize game
  useEffect(() => {
    async function loadGameData() {
      try {
        // Load sprite map data
        const response = await fetch('/sprite_map.json');
        if (!response.ok) {
          throw new Error('Failed to load sprite map data');
        }
        const spriteMapData = await response.json();

        // Initialize NPCs
        const npcResult = initializeNPCs(spriteMapData);
      if (!npcResult.ok) {
        setError(`Failed to initialize NPCs: ${npcResult.error}`);
        return;
      }
      setNPCRegistry(npcResult.value);

      // Initialize dialogue registry with sample dialogues
      let dRegistry = createDialogueRegistry();
      
      // Add sample dialogues
      const garetDialogue = createSimpleDialogue(
        'garet-intro',
        'garet',
        'Garet',
        [
          'Hey Isaac! Ready for an adventure?',
          'The Elder wants to see us at the plaza.',
          "Let's not keep him waiting!"
        ]
      );
      
      const doraDialogue = createSimpleDialogue(
        'dora-greeting',
        'dora',
        'Dora',
        [
          'Good morning, Isaac!',
          'Be careful if you go near Sol Sanctum.',
          'Strange things have been happening there lately.'
        ]
      );

      let regResult = registerDialogue(dRegistry, garetDialogue);
      if (regResult.ok) dRegistry = regResult.value;
      
      regResult = registerDialogue(dRegistry, doraDialogue);
      if (regResult.ok) dRegistry = regResult.value;

      setDialogueRegistry(dRegistry);

      // Initialize scenes
      let sRegistry = createSceneRegistry();
      const valeScene = createValeVillageScene();
      
      const sceneResult = registerScene(sRegistry, valeScene);
      if (!sceneResult.ok) {
        setError(`Failed to register scene: ${sceneResult.error}`);
        return;
      }
      // Scene registry not needed in state, just use active scene

      const active = createActiveScene(valeScene);
      setActiveScene(active);

      // Initialize player
      const initialPlayer: PlayerMovement = {
        position: valeScene.spawnPosition,
        velocity: { dx: 0, dy: 0 },
        facing: 'down'
      };
      setPlayer(initialPlayer);

      // Initialize camera
      const initialCamera = createCamera(valeScene.spawnPosition, 0.15);
      setCamera(initialCamera);

      // Initialize inventory and shops
      const startingInventory = createInventory(20, 100); // 20 slots, 100 coins
      setInventory(startingInventory);

      const itemShop = createItemShop();
      const armorShop = createArmorShop();
      const shopsMap = new Map<string, Shop>();
      shopsMap.set('item-shop', itemShop);
      shopsMap.set('armor-shop', armorShop);
      setShops(shopsMap);

      const initialShopState = createShopState();
      setShopState(initialShopState);

      } catch (err) {
        setError(`Initialization failed: ${err}`);
      }
    }

    loadGameData();
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => new Set(prev).add(e.key.toLowerCase()));

      // Interaction key (Enter/A)
      if (e.key === 'Enter' || e.key.toLowerCase() === 'a') {
        e.preventDefault();
        
        // If dialogue is active, advance it
        if (isDialogueActive(activeDialogue)) {
          handleAdvanceDialogue();
        } else {
          // Otherwise, try to interact
          handleInteract();
        }
      }

      // Close dialogue or shop (Escape/B)
      if (e.key === 'Escape') {
        e.preventDefault();
        handleCancel();
      }

      // Shop navigation
      if (shopState?.isOpen && shopState.activeShop && inventory) {
        const maxIndex = shopState.mode === 'buy' 
          ? shopState.activeShop.inventory.length - 1
          : inventory.items.filter(item => item.quantity > 0).length - 1;

        if (e.key === 'ArrowUp') {
          e.preventDefault();
          const newState = navigateShop(shopState, -1, maxIndex);
          setShopState(newState);
        }
        if (e.key === 'ArrowDown') {
          e.preventDefault();
          const newState = navigateShop(shopState, 1, maxIndex);
          setShopState(newState);
        }
        if (e.key === 'Tab') {
          e.preventDefault();
          // Toggle between buy and sell modes
          const newMode = shopState.mode === 'buy' ? 'sell' : 'buy';
          setShopState({ ...shopState, mode: newMode, selectedIndex: 0 });
        }
      }

      // Navigate dialogue choices
      if (activeDialogue && activeDialogue.isTextComplete) {
        const currentLine = getCurrentLine(activeDialogue);
        if (currentLine?.choices && currentLine.choices.length > 0) {
          if (e.key === 'ArrowUp') {
            e.preventDefault();
            const newIndex = Math.max(0, activeDialogue.selectedChoice - 1);
            const selectResult = selectDialogueChoice(activeDialogue, newIndex);
            if (selectResult.ok) setActiveDialogue(selectResult.value);
          }
          if (e.key === 'ArrowDown') {
            e.preventDefault();
            const newIndex = Math.min(currentLine.choices.length - 1, activeDialogue.selectedChoice + 1);
            const selectResult = selectDialogueChoice(activeDialogue, newIndex);
            if (selectResult.ok) setActiveDialogue(selectResult.value);
          }
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
  }, [player, npcRegistry, dialogueRegistry, activeDialogue, shopState, activeScene, shops, inventory, handleInteract, handleAdvanceDialogue, handleCancel]);

  // Game loop
  useEffect(() => {
    if (!player || !camera || !activeScene || !npcRegistry) {
      return;
    }

    const loop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (deltaTime > 0 && deltaTime < 100) {
        // Don't update movement if dialogue is active
        if (!isDialogueActive(activeDialogue)) {
          // Build movement input from keyboard
          const input: MovementInput = {
            up: keysPressed.has('arrowup') || keysPressed.has('w'),
            down: keysPressed.has('arrowdown') || keysPressed.has('s'),
            left: keysPressed.has('arrowleft') || keysPressed.has('a'),
            right: keysPressed.has('arrowright') || keysPressed.has('d')
          };

          // Get NPC positions for collision
          const npcPositions = Array.from(npcRegistry.npcs.values())
            .filter(npc => npc.visible && npc.id !== 'isaac')
            .map(npc => npc.position);

          // Update player movement
          const bounds = createSceneBounds();
          const moveResult = updatePlayerMovement(
            player,
            input,
            deltaTime,
            npcPositions,
            activeScene.current.obstacles,
            bounds
          );

          if (moveResult.ok) {
            setPlayer(moveResult.value);

            // Update camera to follow player
            const updatedCamera = updateCamera(camera, moveResult.value.position, deltaTime);
            setCamera(updatedCamera);
          }
        }

        // Update dialogue reveal
        if (activeDialogue && activeDialogue.state === 'displaying') {
          const updatedDialogue = updateDialogueReveal(activeDialogue, deltaTime);
          setActiveDialogue(updatedDialogue);
        }
      }

      gameLoopRef.current = requestAnimationFrame(loop);
    };

    lastTimeRef.current = performance.now();
    gameLoopRef.current = requestAnimationFrame(loop);

    return () => {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
      }
    };
  }, [player, camera, activeScene, npcRegistry, keysPressed, activeDialogue]);

  const handleSelectChoice = useCallback((choiceIndex: number) => {
    if (!activeDialogue) return;
    
    const selectResult = selectDialogueChoice(activeDialogue, choiceIndex);
    if (selectResult.ok) {
      setActiveDialogue(selectResult.value);
    }
  }, [activeDialogue]);

  // Shop handlers
  const handleBuyItem = useCallback(() => {
    if (!shopState?.activeShop || !inventory) return;

    const itemToBuy = shopState.activeShop.inventory[shopState.selectedIndex];
    if (!itemToBuy) return;

    const buyResult = buyItem(inventory, shopState.activeShop, itemToBuy, 1);
    if (buyResult.ok) {
      setInventory(buyResult.value.inventory);
      // Update shop in map if needed
      const updatedShops = new Map(shops);
      updatedShops.set(shopState.activeShop.id, buyResult.value.shop);
      setShops(updatedShops);
    }
  }, [shopState, inventory, shops]);

  const handleSellItem = useCallback(() => {
    if (!shopState?.activeShop || !inventory) return;

    const sellableItems = inventory.items.filter(item => item.quantity > 0);
    const invItem = sellableItems[shopState.selectedIndex];
    if (!invItem) return;

    // Find the ShopItem
    const shopItem = shopState.activeShop.inventory.find(si => si.id === invItem.itemId);
    if (!shopItem) return;

    const sellResult = sellItem(inventory, shopState.activeShop, shopItem, 1);
    if (sellResult.ok) {
      setInventory(sellResult.value.inventory);
      const updatedShops = new Map(shops);
      updatedShops.set(shopState.activeShop.id, sellResult.value.shop);
      setShops(updatedShops);
    }
  }, [shopState, inventory, shops]);

  const handleCloseShop = useCallback(() => {
    if (!shopState) return;
    const newState = closeShop(shopState);
    setShopState(newState);
  }, [shopState]);

  const handleShopModeChange = useCallback((mode: 'buy' | 'sell') => {
    if (!shopState) return;
    setShopState({ ...shopState, mode, selectedIndex: 0 });
  }, [shopState]);

  // handleShopNavigate removed - navigation is handled in keyboard handler

  if (error) {
    return (
      <div className="error-screen">
        <h1>Error</h1>
        <p>{error}</p>
      </div>
    );
  }

  if (!player || !camera || !activeScene || !npcRegistry) {
    return (
      <div className="loading-screen">
        <h1>Loading Vale Village...</h1>
        <div className="loading-spinner"></div>
      </div>
    );
  }

  return (
    <div className="golden-sun-app">
      {/* Title */}
      <header className="game-header">
        <h1 className="game-title">Golden Sun: Vale Village</h1>
        <div className="game-subtitle">Mockup Integration - Phase 2</div>
      </header>

      {/* Game World */}
      <GameWorld
        scene={activeScene.current}
        npcRegistry={npcRegistry}
        player={player}
        camera={camera}
      />

      {/* Dialogue Box (when active) */}
      {activeDialogue && isDialogueActive(activeDialogue) && (
        <DialogueBox
          dialogue={activeDialogue}
          onSelectChoice={handleSelectChoice}
        />
      )}

      {/* Shop Menu (when open) */}
      {shopState?.isOpen && shopState.activeShop && inventory && (
        <ShopMenu
          shopState={shopState}
          playerInventory={inventory}
          shopItems={shopState.activeShop.inventory}
          onBuy={handleBuyItem}
          onSell={handleSellItem}
          onClose={handleCloseShop}
          onChangeMode={handleShopModeChange}
        />
      )}

      {/* HUD */}
      <div className="game-hud">
        <div className="hud-item">
          <span className="hud-label">NPCs Talked To:</span>
          <span className="hud-value">
            {Array.from(npcRegistry.npcs.values()).filter(n => n.hasBeenTalkedTo).length} / {npcRegistry.visible.length}
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Scene:</span>
          <span className="hud-value">{activeScene.current.name}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Moving:</span>
          <span className="hud-value">{isPlayerMoving(player) ? 'Yes' : 'No'}</span>
        </div>
        <div className="hud-item" style={{ borderTop: '1px solid #d4a857', marginTop: '8px', paddingTop: '8px' }}>
          <span className="hud-label">Debug:</span>
          <span className="hud-value" style={{ fontSize: '10px', wordBreak: 'break-all' }}>{debugInfo}</span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Player Pos:</span>
          <span className="hud-value" style={{ fontSize: '10px' }}>
            ({Math.round(player.position.x)}, {Math.round(player.position.y)})
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Facing:</span>
          <span className="hud-value" style={{ fontSize: '12px' }}>
            {player.facing === 'up' ? '?' : player.facing === 'down' ? '?' : player.facing === 'left' ? '?' : '?'} {player.facing}
          </span>
        </div>
        <div className="hud-item">
          <span className="hud-label">Nearby NPCs:</span>
          <span className="hud-value" style={{ fontSize: '10px' }}>
            {(() => {
              const nearby = Array.from(npcRegistry.npcs.values()).filter(npc => {
                if (!npc.visible) return false;
                if (npc.id === 'isaac') return false; // Exclude player
                const dx = npc.position.x - player.position.x;
                const dy = npc.position.y - player.position.y;
                const distance = Math.sqrt(dx * dx + dy * dy);
                return distance <= 48;
              });
              return nearby.length > 0 ? nearby.map(n => n.name).join(', ') : 'None';
            })()}
          </span>
        </div>
      </div>

      {/* Controls Guide */}
      <div className="controls-guide">
        <h3>Controls</h3>
        <div className="control-grid">
          <div className="control-item">
            <kbd>Arrow Keys / WASD</kbd>
            <span>Move</span>
          </div>
          <div className="control-item">
            <kbd>Enter / A</kbd>
            <span>Talk / Advance</span>
          </div>
          <div className="control-item">
            <kbd>Esc</kbd>
            <span>Close Dialogue</span>
          </div>
        </div>
      </div>

      {/* On-Screen Controller (Touch Devices) */}
      <OnScreenController
        onKeyDown={handleControllerKeyDown}
        onKeyUp={handleControllerKeyUp}
      />
    </div>
  );
};

export default GoldenSunApp;
