import { useState, useEffect, useCallback } from 'react';
import { createGameState, updateGame, buildTower, startWave, togglePause } from './systems/gameEngine';
import { DEFAULT_GAME_CONFIG } from './types/game';
import type { GameState } from './types/game';
import type { TowerType } from './types/tower';
import './App.css';

const TICK_RATE = 16.666; // 60 FPS

function App() {
  const [gameState, setGameState] = useState<GameState>(() =>
    createGameState(DEFAULT_GAME_CONFIG)
  );
  const [selectedTower, setSelectedTower] = useState<TowerType | null>(null);

  // Game loop
  useEffect(() => {
    if (gameState.phase === 'victory' || gameState.phase === 'defeat') {
      return;
    }

    const interval = setInterval(() => {
      setGameState((prev) => updateGame(prev, TICK_RATE));
    }, TICK_RATE);

    return () => clearInterval(interval);
  }, [gameState.phase]);

  const handleCellClick = useCallback(
    (x: number, y: number) => {
      if (!selectedTower || gameState.phase !== 'build') return;

      const result = buildTower(gameState, selectedTower, { x, y });
      if (result.ok) {
        setGameState(result.value);
        setSelectedTower(null);
      } else {
        console.error('Failed to build tower:', result.error);
      }
    },
    [selectedTower, gameState]
  );

  const handleStartWave = () => {
    const result = startWave(gameState);
    if (result.ok) {
      setGameState(result.value);
    }
  };

  const handlePause = () => {
    setGameState(togglePause(gameState));
  };

  const getTowerIcon = (type: TowerType): string => {
    const icons = { fire: '🔥', frost: '❄️', stone: '🗿', wind: '💨' };
    return icons[type];
  };

  const getEnemyIcon = (type: string): string => {
    if (type.includes('fire') || type.includes('flame') || type.includes('inferno')) return '👹';
    if (type.includes('water') || type.includes('tidal') || type.includes('leviathan')) return '💧';
    if (type.includes('stone') || type.includes('earth') || type.includes('mountain')) return '🗿';
    if (type.includes('air') || type.includes('storm') || type.includes('hurricane')) return '💨';
    return '👾';
  };

  return (
    <div className="game-container">
      {/* HUD */}
      <div className="hud-bar">
        <div className="hud-section hud-left">
          <div className="wave-display">
            <span className="label">Wave</span>
            <span className="value">
              {gameState.currentWave}/{gameState.totalWaves}
            </span>
          </div>
        </div>

        <div className="hud-section hud-center">
          <div className="resource-display gold">
            <span className="icon">💰</span>
            <span className="value">{gameState.gold}</span>
          </div>
          <div className="resource-display lives">
            <span className="icon">❤️</span>
            <span className="value">{gameState.lives}</span>
          </div>
        </div>

        <div className="hud-section hud-right">
          {gameState.phase === 'build' && (
            <button className="btn-next-wave" onClick={handleStartWave}>
              Start Wave {gameState.currentWave}
            </button>
          )}
          {gameState.phase === 'wave' && (
            <button className="btn-pause" onClick={handlePause}>
              ⏸
            </button>
          )}
        </div>
      </div>

      {/* Game Grid */}
      <div className="game-grid">
        {gameState.grid.cells.map((row, y) =>
          row.map((cell, x) => {
            const cellKey = `${x}-${y}`;

            return (
              <div
                key={cellKey}
                className={`grid-cell ${cell.type}${selectedTower && cell.type === 'placeable' && !cell.tower ? ' hoverable' : ''}`}
                onClick={() => handleCellClick(x, y)}
                style={{
                  gridColumn: x + 1,
                  gridRow: y + 1,
                }}
              >
                {cell.type === 'spawn' && <div className="spawn-indicator">RIFT</div>}
                {cell.type === 'portal' && <div className="portal-indicator">BASTION</div>}

                {/* Render tower */}
                {cell.tower && (
                  <div className="tower">
                    <div className="tower-sprite">{getTowerIcon(cell.tower.type)}</div>
                  </div>
                )}

                {/* Render enemies at this position */}
                {gameState.enemies
                  .filter((e) => Math.floor(e.position.x) === x && Math.floor(e.position.y) === y)
                  .map((enemy) => (
                    <div key={enemy.id} className="enemy">
                      <div className="enemy-sprite">{getEnemyIcon(enemy.type)}</div>
                      <div className="health-bar">
                        <div
                          className="health-fill"
                          style={{ width: `${(enemy.currentHp / enemy.stats.maxHp) * 100}%` }}
                        />
                      </div>
                    </div>
                  ))}
              </div>
            );
          })
        )}
      </div>

      {/* Tower Selection */}
      <div className="tower-selection-bar">
        <div className="tower-buttons">
          {(['fire', 'frost', 'stone', 'wind'] as TowerType[]).map((type) => {
            const stats = { fire: 100, frost: 120, stone: 150, wind: 90 }[type];
            const canAfford = gameState.gold >= stats;
            const isSelected = selectedTower === type;

            return (
              <button
                key={type}
                className={`tower-btn ${isSelected ? 'selected' : ''}`}
                disabled={!canAfford || gameState.phase !== 'build'}
                onClick={() => setSelectedTower(type)}
              >
                <div className="tower-icon">{getTowerIcon(type)}</div>
                <div className="tower-name">{type.charAt(0).toUpperCase() + type.slice(1)}</div>
                <div className="tower-cost">💰 {stats}</div>
              </button>
            );
          })}
        </div>

        <div className="tower-info-panel">
          {gameState.phase === 'victory' && (
            <div className="game-message victory">🎉 VICTORY! All waves defeated!</div>
          )}
          {gameState.phase === 'defeat' && (
            <div className="game-message defeat">💀 DEFEAT! The bastion has fallen.</div>
          )}
          {gameState.phase !== 'victory' && gameState.phase !== 'defeat' && (
            <>
              <h3>Status</h3>
              <div className="stat-row">
                <span className="stat-label">Phase:</span>
                <span className="stat-value">{gameState.phase.toUpperCase()}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Towers:</span>
                <span className="stat-value">{gameState.towers.length}</span>
              </div>
              <div className="stat-row">
                <span className="stat-label">Enemies:</span>
                <span className="stat-value">{gameState.enemies.length}</span>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default App;
