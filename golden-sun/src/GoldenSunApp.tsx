/**
 * Golden Sun Vale Village - Main App Component
 * Integrates all systems into playable game
 */

import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameWorld } from './components/GameWorld';
import { DialogueBox } from './components/DialogueBox';
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
  ActiveScene
} from './types/scene';
import {
  createSceneRegistry,
  registerScene,
  createActiveScene,
  createValeVillageScene
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
  const [error, setError] = useState<string | null>(null);

  // Input state
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());

  // Refs
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

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
      if ((e.key === 'Enter' || e.key.toLowerCase() === 'a') && !isDialogueActive(activeDialogue)) {
        e.preventDefault();
        
        // Try to interact with NPC
        if (player && npcRegistry && dialogueRegistry) {
          const interactionCheck = findInteractableNPC(
            player.position,
            player.facing,
            npcRegistry
          );

          if (interactionCheck.canInteract && interactionCheck.npc) {
            // Start dialogue
            const dialogueResult = startDialogue(interactionCheck.npc.dialogue_id, dialogueRegistry);
            if (dialogueResult.ok) {
              const dialogue = setDialogueState(dialogueResult.value, 'displaying');
              setActiveDialogue(dialogue);
              
              // Mark NPC as talked to
              const updateResult = markNPCAsTalkedTo(npcRegistry, interactionCheck.npc.id);
              if (updateResult.ok) {
                setNPCRegistry(updateResult.value);
              }
            }
          }
        }
      }

      // Advance dialogue
      if ((e.key === 'Enter' || e.key.toLowerCase() === 'a') && activeDialogue && dialogueRegistry) {
        e.preventDefault();
        
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
      }

      // Close dialogue
      if (e.key === 'Escape' && activeDialogue) {
        e.preventDefault();
        setActiveDialogue(null);
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
  }, [player, npcRegistry, dialogueRegistry, activeDialogue]);

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
    </div>
  );
};

export default GoldenSunApp;
