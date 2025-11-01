import React, { useState, useEffect, useRef } from 'react';
import { GameState } from './types/game';
import { Vector2D } from './types/common';
import { initializeGame, updateGame, togglePause, tryMoveToAdjacentRoom } from './systems/gameEngine';
import { setPlayerVelocity, setPlayerFacing, canShoot, recordShot } from './systems/playerSystem';
import { createPlayerTear } from './systems/projectileSystem';
import { getCurrentRoom } from './systems/roomSystem';
import { getItemDefinition } from './systems/itemSystem';
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

        // Check room transitions (when player is near doors)
        const playerX = updatedState.player.position.x;
        const playerY = updatedState.player.position.y;

        if (playerY < 60 && keysPressed.has('w')) {
          const result = tryMoveToAdjacentRoom(updatedState, 'north');
          if (result.ok) {
            setGameState(result.value);
            return;
          }
        } else if (playerY > 540 && keysPressed.has('s')) {
          const result = tryMoveToAdjacentRoom(updatedState, 'south');
          if (result.ok) {
            setGameState(result.value);
            return;
          }
        } else if (playerX < 60 && keysPressed.has('a')) {
          const result = tryMoveToAdjacentRoom(updatedState, 'west');
          if (result.ok) {
            setGameState(result.value);
            return;
          }
        } else if (playerX > 740 && keysPressed.has('d')) {
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
          <span className="stat-label">Damage</span>
          <span className="stat-value">{gameState.player.stats.damage.toFixed(1)}</span>
        </div>

        <div className="stat">
          <span className="stat-label">Tears</span>
          <span className="stat-value">{gameState.player.stats.tearRate.toFixed(1)}/s</span>
        </div>

        <div className="stat">
          <span className="stat-label">Speed</span>
          <span className="stat-value">{Math.round(gameState.player.stats.speed)}</span>
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

        {/* Player */}
        <div
          className="entity player"
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
