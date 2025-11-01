import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types/game';
import { Vector2D } from './types/common';
import { initializeGame, updateGame, togglePause, tryMoveToAdjacentRoom, enterNextFloor } from './systems/gameEngine';
import { setPlayerVelocity, setPlayerFacing, canShoot, recordShot, isPlayerInvincible } from './systems/playerSystem';
import { createPlayerTear } from './systems/projectileSystem';
import { getCurrentRoom } from './systems/roomSystem';
import { getItemDefinition } from './systems/itemSystem';
import { getPickupEmoji } from './types/pickup';
import { getObstacleEmoji } from './types/obstacle';
import { placeBomb } from './systems/bombSystem';
import { tryUnlockDoor } from './systems/doorSystem';
import './App.css';

const App: React.FC = () => {
  const [gameState, setGameState] = useState<GameState | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());
  const gameLoopRef = useRef<number | null>(null);
  const lastTimeRef = useRef<number>(0);

  // Initialize game
  useEffect(() => {
    const result = initializeGame();
    if (result.ok) {
      setGameState(result.value);
    } else {
      setError(result.error);
    }
  }, []);

  // Handle keyboard input
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      setKeysPressed(prev => new Set(prev).add(e.key.toLowerCase()));

      // Pause/Restart
      if (e.key === ' ') {
        e.preventDefault();
        setGameState(prev => prev ? togglePause(prev) : prev);
      }

      if (e.key.toLowerCase() === 'r') {
        e.preventDefault();
        const result = initializeGame();
        if (result.ok) {
          setGameState(result.value);
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
  }, []);

  // Game loop
  useEffect(() => {
    if (!gameState || gameState.phase !== 'playing') {
      if (gameLoopRef.current) {
        cancelAnimationFrame(gameLoopRef.current);
        gameLoopRef.current = null;
      }
      return;
    }

    const loop = (currentTime: number) => {
      const deltaTime = currentTime - lastTimeRef.current;
      lastTimeRef.current = currentTime;

      if (deltaTime > 0 && deltaTime < 100) {  // Cap at 100ms to prevent huge jumps
        // Process input
        let updatedState = gameState;

        // Movement (WASD)
        let moveDx = 0;
        let moveDy = 0;
        if (keysPressed.has('w')) moveDy -= 1;
        if (keysPressed.has('s')) moveDy += 1;
        if (keysPressed.has('a')) moveDx -= 1;
        if (keysPressed.has('d')) moveDx += 1;
        const moveDir: Vector2D = { dx: moveDx, dy: moveDy };

        updatedState = {
          ...updatedState,
          player: setPlayerVelocity(updatedState.player, moveDir)
        };

        // Shooting (Arrow keys)
        let shootDx = 0;
        let shootDy = 0;
        if (keysPressed.has('arrowup')) shootDy -= 1;
        if (keysPressed.has('arrowdown')) shootDy += 1;
        if (keysPressed.has('arrowleft')) shootDx -= 1;
        if (keysPressed.has('arrowright')) shootDx += 1;
        const shootDir: Vector2D = { dx: shootDx, dy: shootDy };

        if (shootDir.dx !== 0 || shootDir.dy !== 0) {
          updatedState = {
            ...updatedState,
            player: setPlayerFacing(updatedState.player, shootDir)
          };

          if (canShoot(updatedState.player, updatedState.time)) {
            const tear = createPlayerTear(updatedState.player, shootDir);
            updatedState = {
              ...updatedState,
              projectiles: [...updatedState.projectiles, tear],
              player: recordShot(updatedState.player, updatedState.time)
            };
          }
        }

        // Place bomb with 'e' key
        if (keysPressed.has('e')) {
          const bombResult = placeBomb(updatedState.player, updatedState.time);
          if (bombResult.ok) {
            updatedState = {
              ...updatedState,
              player: bombResult.value.player,
              bombs: [...updatedState.bombs, bombResult.value.bomb]
            };
          }
        }

        // Check room transitions (when player is near doors)
        const playerX = updatedState.player.position.x;
        const playerY = updatedState.player.position.y;

        // Check if there are enemies in the current room (doors should be locked)
        const hasEnemies = updatedState.enemies.length > 0;

        if (playerY < 80 && keysPressed.has('w')) {
          // Block movement if enemies are present
          if (hasEnemies) {
            // Don't allow any door interaction while enemies are alive
            return;
          }

          // Try to unlock door if locked (for key doors in empty rooms)
          const currentRoomResult = getCurrentRoom(updatedState.dungeon, updatedState.currentRoomId);
          if (currentRoomResult.ok) {
            const door = currentRoomResult.value.doors.find(d => d.direction === 'north');
            if (door?.locked) {
              const unlockResult = tryUnlockDoor(updatedState.player, updatedState.dungeon, updatedState.currentRoomId, 'north');
              if (unlockResult.ok) {
                setGameState({
                  ...updatedState,
                  player: unlockResult.value.player,
                  dungeon: unlockResult.value.dungeon
                });
                return;
              }
              // Door is locked and we couldn't unlock it - don't try to move
              return;
            }
          }

          const result = tryMoveToAdjacentRoom(updatedState, 'north');
          if (result.ok) {
            setGameState(result.value);
            return;
          }
        } else if (playerY > 520 && keysPressed.has('s')) {
          // Block movement if enemies are present
          if (hasEnemies) {
            return;
          }

          const currentRoomResult = getCurrentRoom(updatedState.dungeon, updatedState.currentRoomId);
          if (currentRoomResult.ok) {
            const currentRoom = currentRoomResult.value;

            // Check if this is a boss room with unlocked exit (floor transition)
            if (currentRoom.type === 'boss' && currentRoom.bossExitUnlocked) {
              const nextFloorResult = enterNextFloor(updatedState);
              if (nextFloorResult.ok) {
                setGameState(nextFloorResult.value);
                return;
              }
            }

            const door = currentRoom.doors.find(d => d.direction === 'south');
            if (door?.locked) {
              const unlockResult = tryUnlockDoor(updatedState.player, updatedState.dungeon, updatedState.currentRoomId, 'south');
              if (unlockResult.ok) {
                setGameState({
                  ...updatedState,
                  player: unlockResult.value.player,
                  dungeon: unlockResult.value.dungeon
                });
                return;
              }
              return;
            }
          }

          const result = tryMoveToAdjacentRoom(updatedState, 'south');
          if (result.ok) {
            setGameState(result.value);
            return;
          }
        } else if (playerX < 80 && keysPressed.has('a')) {
          // Block movement if enemies are present
          if (hasEnemies) {
            return;
          }

          const currentRoomResult = getCurrentRoom(updatedState.dungeon, updatedState.currentRoomId);
          if (currentRoomResult.ok) {
            const door = currentRoomResult.value.doors.find(d => d.direction === 'west');
            if (door?.locked) {
              const unlockResult = tryUnlockDoor(updatedState.player, updatedState.dungeon, updatedState.currentRoomId, 'west');
              if (unlockResult.ok) {
                setGameState({
                  ...updatedState,
                  player: unlockResult.value.player,
                  dungeon: unlockResult.value.dungeon
                });
                return;
              }
              return;
            }
          }

          const result = tryMoveToAdjacentRoom(updatedState, 'west');
          if (result.ok) {
            setGameState(result.value);
            return;
          }
        } else if (playerX > 720 && keysPressed.has('d')) {
          // Block movement if enemies are present
          if (hasEnemies) {
            return;
          }

          const currentRoomResult = getCurrentRoom(updatedState.dungeon, updatedState.currentRoomId);
          if (currentRoomResult.ok) {
            const door = currentRoomResult.value.doors.find(d => d.direction === 'east');
            if (door?.locked) {
              const unlockResult = tryUnlockDoor(updatedState.player, updatedState.dungeon, updatedState.currentRoomId, 'east');
              if (unlockResult.ok) {
                setGameState({
                  ...updatedState,
                  player: unlockResult.value.player,
                  dungeon: unlockResult.value.dungeon
                });
                return;
              }
              return;
            }
          }

          const result = tryMoveToAdjacentRoom(updatedState, 'east');
          if (result.ok) {
            setGameState(result.value);
            return;
          }
        }

        // Update game state
        const updateResult = updateGame(updatedState, deltaTime);
        if (updateResult.ok) {
          setGameState(updateResult.value);
        } else {
          setError(updateResult.error);
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
  }, [gameState, keysPressed]);

  if (error) {
    return <div className="error">Error: {error}</div>;
  }

  if (!gameState) {
    return <div className="loading">Loading...</div>;
  }

  const currentRoomResult = getCurrentRoom(gameState.dungeon, gameState.currentRoomId);
  const currentRoom = currentRoomResult.ok ? currentRoomResult.value : null;

  const hearts = [];
  const maxHearts = Math.ceil(gameState.player.stats.maxHealth / 2);
  const fullHearts = Math.floor(gameState.player.stats.currentHealth / 2);
  const hasHalfHeart = gameState.player.stats.currentHealth % 2 === 1;

  for (let i = 0; i < maxHearts; i++) {
    if (i < fullHearts) {
      hearts.push(<span key={i} className="heart">♥</span>);
    } else if (i === fullHearts && hasHalfHeart) {
      hearts.push(<span key={i} className="heart half">♥</span>);
    } else {
      hearts.push(<span key={i} className="heart empty">♥</span>);
    }
  }

  const visitedRooms = gameState.dungeon.rooms.filter(r => r.visited).length;
  const totalRooms = gameState.dungeon.rooms.length;

  return (
    <div className="game-container">
      <h1 className="game-title">Descent of Tears</h1>

      {/* HUD */}
      <div className="hud">
        <div className="hearts-container">{hearts}</div>

        <div className="stat">
          <span className="stat-label">🏆 Floor</span>
          <span className="stat-value">{gameState.floor}</span>
        </div>

        <div className="stat">
          <span className="stat-label">💰 Coins</span>
          <span className="stat-value">{gameState.player.resources.coins}</span>
        </div>

        <div className="stat">
          <span className="stat-label">🔑 Keys</span>
          <span className="stat-value">{gameState.player.resources.hasGoldenKey ? '∞' : gameState.player.resources.keys}</span>
        </div>

        <div className="stat">
          <span className="stat-label">💣 Bombs</span>
          <span className="stat-value">{gameState.player.resources.bombs}</span>
        </div>

        <div className="stat">
          <span className="stat-label">Damage</span>
          <span className="stat-value">{gameState.player.stats.damage.toFixed(1)}</span>
        </div>

        <div className="stat">
          <span className="stat-label">Score</span>
          <span className="stat-value">{gameState.score}</span>
        </div>
      </div>

      {/* Game Room */}
      <div className="game-room">
        {/* Doors */}
        {currentRoom?.doors.map(door => (
          <div
            key={door.direction}
            className={`door ${door.direction} ${door.locked ? 'locked' : ''}`}
          />
        ))}

        {/* Boss Exit Door (appears when boss defeated) */}
        {currentRoom?.type === 'boss' && currentRoom.bossExitUnlocked && (
          <div className="door south boss-exit">
            <span className="boss-exit-label">↓ Next Floor</span>
          </div>
        )}

        {/* Player */}
        <div
          className={`entity player ${isPlayerInvincible(gameState.player, gameState.time) ? 'invincible' : ''}`}
          style={{
            left: `${gameState.player.position.x}px`,
            top: `${gameState.player.position.y}px`
          }}
        >
          👶
        </div>

        {/* Enemies */}
        {gameState.enemies.map(enemy => {
          const healthPercent = (enemy.currentHealth / enemy.stats.maxHealth) * 100;
          const emoji = enemy.type === 'fly' ? '🪰' : enemy.type === 'spider' ? '🕷️' : '👹';

          return (
            <div
              key={enemy.id}
              className="entity enemy"
              style={{
                left: `${enemy.position.x}px`,
                top: `${enemy.position.y}px`
              }}
            >
              {emoji}
              <div className="health-bar">
                <div className="health-bar-fill" style={{ width: `${healthPercent}%` }} />
              </div>
            </div>
          );
        })}

        {/* Projectiles */}
        {gameState.projectiles.map(proj => (
          <div
            key={proj.id}
            className={`entity projectile ${proj.owner}`}
            style={{
              left: `${proj.position.x}px`,
              top: `${proj.position.y}px`
            }}
          />
        ))}

        {/* Obstacles */}
        {gameState.obstacles.map(obstacle => (
          <div
            key={obstacle.id}
            className="entity obstacle"
            style={{
              left: `${obstacle.position.x}px`,
              top: `${obstacle.position.y}px`
            }}
          >
            {getObstacleEmoji(obstacle.type)}
          </div>
        ))}

        {/* Items */}
        {gameState.items.map(item => {
          const emoji = item.type === 'health_up' ? '♥️' :
                       item.type === 'damage_up' ? '⚔️' :
                       item.type === 'speed_up' ? '👟' : '🔥';

          return (
            <div
              key={item.id}
              className="entity item"
              style={{
                left: `${item.position.x}px`,
                top: `${item.position.y}px`
              }}
              title={getItemDefinition(item.type).name}
            >
              {emoji}
            </div>
          );
        })}

        {/* Pickups */}
        {gameState.pickups.map(pickup => (
          <div
            key={pickup.id}
            className="entity pickup"
            style={{
              left: `${pickup.position.x}px`,
              top: `${pickup.position.y}px`
            }}
          >
            {getPickupEmoji(pickup.type)}
          </div>
        ))}

        {/* Bombs */}
        {gameState.bombs.map(bomb => {
          const timeLeft = bomb.fuseTime - (gameState.time - bomb.placedTime);
          const isExploding = bomb.exploded;

          return (
            <div
              key={bomb.id}
              className={`entity bomb ${isExploding ? 'exploding' : ''}`}
              style={{
                left: `${bomb.position.x}px`,
                top: `${bomb.position.y}px`
              }}
            >
              {isExploding ? '💥' : '💣'}
              {!isExploding && (
                <div className="bomb-timer">{Math.ceil(timeLeft / 1000)}</div>
              )}
            </div>
          );
        })}

        {/* Game Over Messages */}
        {gameState.phase === 'victory' && (
          <div className="game-message">
            Victory!
            <div style={{ fontSize: '16px', marginTop: '20px' }}>
              Press R to restart
            </div>
          </div>
        )}

        {gameState.phase === 'defeat' && (
          <div className="game-message">
            Defeated
            <div style={{ fontSize: '16px', marginTop: '20px' }}>
              Press R to restart
            </div>
          </div>
        )}

        {gameState.phase === 'paused' && (
          <div className="game-message">
            Paused
            <div style={{ fontSize: '16px', marginTop: '20px' }}>
              Press SPACE to continue
            </div>
          </div>
        )}
      </div>

      {/* Status Panel */}
      <div className="status-panel">
        <div className="room-info">
          <strong>Current Room:</strong> {currentRoom?.type || 'Unknown'} ({visitedRooms}/{totalRooms} explored) |
          <strong> Enemies:</strong> {gameState.enemies.length} remaining
          {currentRoom?.cleared && ' | ✓ Cleared'}
        </div>

        <div className="controls">
          <div className="control-item">
            <span className="key">WASD</span>
            <span>Move</span>
          </div>
          <div className="control-item">
            <span className="key">Arrow Keys</span>
            <span>Shoot Tears</span>
          </div>
          <div className="control-item">
            <span className="key">E</span>
            <span>Place Bomb</span>
          </div>
          <div className="control-item">
            <span className="key">SPACE</span>
            <span>Pause</span>
          </div>
          <div className="control-item">
            <span className="key">R</span>
            <span>Restart</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default App;
