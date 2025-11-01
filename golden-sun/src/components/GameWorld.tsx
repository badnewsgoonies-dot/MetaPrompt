/**
 * Game World Component - Renders the overworld scene with NPCs, buildings, and player
 */

import React from 'react';
import { Scene } from '../types/scene';
import { NPC, NPCRegistry } from '../types/npc';
import { PlayerMovement, Camera } from '../systems/movementSystem';
import './GameWorld.css';

interface GameWorldProps {
  scene: Scene;
  npcRegistry: NPCRegistry;
  player: PlayerMovement;
  camera: Camera;
}

export const GameWorld: React.FC<GameWorldProps> = ({
  scene,
  npcRegistry,
  player,
  camera
}) => {
  // Get visible NPCs for current scene
  const visibleNPCs: NPC[] = [];
  for (const npcId of scene.npcIds) {
    const npc = npcRegistry.npcs.get(npcId);
    if (npc && npc.visible) {
      visibleNPCs.push(npc);
    }
  }

  return (
    <div className="game-world-container">
      {/* Viewport (visible area) */}
      <div className="game-viewport">
        {/* Scene (scrollable area) */}
        <div 
          className="game-scene"
          style={{
            transform: `translate(${-camera.position.x}px, ${-camera.position.y}px)`,
            width: `${scene.width}px`,
            height: `${scene.height}px`
          }}
        >
          {/* Background */}
          <div className="scene-background" />

          {/* Obstacles (Buildings, Scenery) */}
          {scene.obstacles.map(obstacle => (
            <div
              key={obstacle.id}
              className={`obstacle ${obstacle.type}`}
              style={{
                left: `${obstacle.position.x}px`,
                top: `${obstacle.position.y}px`,
                width: `${obstacle.width}px`,
                height: `${obstacle.height}px`
              }}
              aria-label={`${obstacle.type}: ${obstacle.id}`}
            >
              <span className="building-label">{obstacle.id.replace(/-/g, ' ')}</span>
            </div>
          ))}

          {/* Doors */}
          {scene.doors.map(door => {
            // Check if player is near this door
            const isNearDoor = player && (() => {
              const doorCenterX = door.position.x + door.width / 2;
              const doorCenterY = door.position.y + door.height / 2;
              const dx = player.position.x - doorCenterX;
              const dy = player.position.y - doorCenterY;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance <= 48; // Same as NPC interaction range
            })();

            const isShopDoor = door.id.includes('shop');

            return (
              <div
                key={door.id}
                className={`door ${door.locked ? 'locked' : ''} ${isNearDoor ? 'near' : ''} ${isShopDoor ? 'shop-door' : ''}`}
                style={{
                  left: `${door.position.x}px`,
                  top: `${door.position.y}px`,
                  width: `${door.width}px`,
                  height: `${door.height}px`
                }}
                aria-label={`Door to ${door.targetScene}${door.locked ? ' (locked)' : ''}`}
              >
                {!door.locked && <span className="door-sparkle">✨</span>}
                {isNearDoor && !door.locked && (
                  <div className="door-indicator">
                    {isShopDoor ? '💰' : '🚪'}
                  </div>
                )}
              </div>
            );
          })}

          {/* NPCs */}
          {visibleNPCs.map(npc => {
            // Check if NPC is interactable with current player state
            const isInteractable = player && npc.visible && (() => {
              const dx = npc.position.x - player.position.x;
              const dy = npc.position.y - player.position.y;
              const distance = Math.sqrt(dx * dx + dy * dy);
              return distance <= npc.interactionRange;
            })();

            return (
              <div
                key={npc.id}
                className={`entity npc facing-${npc.facing} ${isInteractable ? 'interactable' : ''}`}
                style={{
                  left: `${npc.position.x}px`,
                  top: `${npc.position.y}px`
                }}
                role="button"
                aria-label={`Talk to ${npc.name}`}
                tabIndex={0}
              >
                {npc.sprite ? (
                  <img 
                    src={npc.sprite} 
                    alt={npc.name}
                    className="npc-sprite"
                  />
                ) : (
                  <div className="npc-placeholder">{npc.name[0]}</div>
                )}
                {isInteractable && !npc.hasBeenTalkedTo && (
                  <div className="npc-indicator interact" aria-label="Press Enter to talk">💬</div>
                )}
                {npc.hasBeenTalkedTo && (
                  <div className="npc-indicator talked" aria-label="Already talked to">✓</div>
                )}
              </div>
            );
          })}

          {/* Player */}
          <div
            className={`entity player facing-${player.facing}`}
            style={{
              left: `${player.position.x}px`,
              top: `${player.position.y}px`
            }}
            aria-label="Player (Isaac)"
          >
            <div className="player-sprite">👤</div>
          </div>
        </div>
      </div>

      {/* Scene Info */}
      <div className="scene-info" aria-live="polite">
        <span className="scene-name">{scene.name}</span>
        <span className="scene-coords">
          ({Math.round(player.position.x)}, {Math.round(player.position.y)})
        </span>
      </div>
    </div>
  );
};
