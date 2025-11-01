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
          {scene.doors.map(door => (
            <div
              key={door.id}
              className={`door ${door.locked ? 'locked' : ''}`}
              style={{
                left: `${door.position.x}px`,
                top: `${door.position.y}px`,
                width: `${door.width}px`,
                height: `${door.height}px`
              }}
              aria-label={`Door to ${door.targetScene}${door.locked ? ' (locked)' : ''}`}
            >
              {!door.locked && <span className="door-sparkle">✨</span>}
            </div>
          ))}

          {/* NPCs */}
          {visibleNPCs.map(npc => (
            <div
              key={npc.id}
              className={`entity npc facing-${npc.facing}`}
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
              {npc.hasBeenTalkedTo && (
                <div className="npc-indicator talked" aria-label="Already talked to">!</div>
              )}
            </div>
          ))}

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
