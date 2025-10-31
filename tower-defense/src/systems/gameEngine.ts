import type { GameState, GameConfig } from '../types/game';
import type { Enemy } from '../types/enemy';
import type { Tower, TowerType } from '../types/tower';
import { SeededRNG } from '../utils/rng';
import { createGrid } from './gridSystem';
import { DEFAULT_PATH } from '../data/defaultPath';
import { getWave, spawnEnemy, isWaveComplete, calculateSpawnSchedule } from './waveSystem';
import { processCombat } from './combatSystem';
import { getPathPosition } from './gridSystem';
import { Ok, Err, type Result } from '../utils/result';
import { TOWER_STATS, getTowerElement } from '../types/tower';
import { placeTower } from './gridSystem';

/**
 * Create initial game state
 */
export const createGameState = (config: GameConfig): GameState => {
  const rng = new SeededRNG(config.seed);
  const grid = createGrid(config.gridWidth, config.gridHeight, DEFAULT_PATH);

  return {
    phase: 'build',
    currentWave: 1,
    totalWaves: config.totalWaves,
    gold: config.startingGold,
    lives: config.startingLives,
    grid,
    towers: [],
    enemies: [],
    time: 0,
    seed: config.seed,
    rng,
  };
};

/**
 * Update enemy positions along path
 */
export const updateEnemyPositions = (
  gameState: GameState,
  deltaTime: number
): GameState => {
  const updatedEnemies: Enemy[] = [];
  let lostLives = 0;

  for (const enemy of gameState.enemies) {
    // Calculate how far enemy moves this frame
    const cellsPerSecond = enemy.stats.speed;
    const cellsPerMs = cellsPerSecond / 1000;
    const cellsToMove = cellsPerMs * deltaTime;

    // Simple movement: advance along path
    const newPathIndex = Math.min(
      enemy.pathIndex + cellsToMove,
      gameState.grid.path.length - 1
    );

    // Check if enemy reached the end
    if (newPathIndex >= gameState.grid.path.length - 1) {
      lostLives++;
      continue; // Don't add to updated enemies (enemy escaped)
    }

    // Get position on path
    const posResult = getPathPosition(gameState.grid, Math.floor(newPathIndex));
    if (!posResult.ok) continue;

    updatedEnemies.push({
      ...enemy,
      pathIndex: newPathIndex,
      position: posResult.value,
    });
  }

  return {
    ...gameState,
    enemies: updatedEnemies,
    lives: Math.max(0, gameState.lives - lostLives),
    phase: gameState.lives - lostLives <= 0 ? 'defeat' : gameState.phase,
  };
};

/**
 * Build a tower at position
 */
export const buildTower = (
  gameState: GameState,
  towerType: TowerType,
  position: { x: number; y: number }
): Result<GameState, string> => {
  const stats = TOWER_STATS[towerType];
  if (!stats) {
    return Err(`Unknown tower type: ${towerType}`);
  }

  if (gameState.gold < stats.cost) {
    return Err(`Insufficient gold: need ${stats.cost}, have ${gameState.gold}`);
  }

  const tower: Tower = {
    id: `tower-${gameState.time}-${gameState.rng.next()}`,
    type: towerType,
    element: getTowerElement(towerType),
    position,
    stats,
    level: 1,
    lastAttackTime: 0,
  };

  const gridResult = placeTower(gameState.grid, tower);
  if (!gridResult.ok) {
    return Err(gridResult.error);
  }

  return Ok({
    ...gameState,
    grid: gridResult.value,
    towers: [...gameState.towers, tower],
    gold: gameState.gold - stats.cost,
  });
};

/**
 * Start next wave
 */
export const startWave = (gameState: GameState): Result<GameState, string> => {
  if (gameState.phase !== 'build') {
    return Err('Can only start wave during build phase');
  }

  const waveResult = getWave(gameState.currentWave);
  if (!waveResult.ok) {
    return Err(waveResult.error);
  }

  return Ok({
    ...gameState,
    phase: 'wave',
  });
};

/**
 * Spawn enemies for current wave
 */
let spawnSchedule: Array<{ enemyType: string; spawnTime: number }> = [];
let spawnIndex = 0;
let waveStartTime = 0;

export const spawnEnemiesForWave = (gameState: GameState): Result<GameState, string> => {
  // Initialize spawn schedule if starting wave
  if (spawnSchedule.length === 0 || waveStartTime === 0) {
    const waveResult = getWave(gameState.currentWave);
    if (!waveResult.ok) return Err(waveResult.error);

    waveStartTime = gameState.time;
    spawnSchedule = calculateSpawnSchedule(waveResult.value, waveStartTime);
    spawnIndex = 0;
  }

  // Spawn enemies whose time has come
  const newEnemies = [...gameState.enemies];

  while (spawnIndex < spawnSchedule.length) {
    const spawn = spawnSchedule[spawnIndex];
    if (!spawn || gameState.time < spawn.spawnTime) break;

    const enemyResult = spawnEnemy(spawn.enemyType, gameState, gameState.time);
    if (enemyResult.ok) {
      newEnemies.push(enemyResult.value);
    }

    spawnIndex++;
  }

  return Ok({
    ...gameState,
    enemies: newEnemies,
  });
};

/**
 * Check and handle wave completion
 */
export const checkWaveCompletion = (gameState: GameState): GameState => {
  if (gameState.phase !== 'wave') return gameState;

  const waveResult = getWave(gameState.currentWave);
  if (!waveResult.ok) return gameState;

  const wave = waveResult.value;

  if (isWaveComplete(gameState, wave, spawnIndex)) {
    // Wave complete, reset spawn state
    spawnSchedule = [];
    spawnIndex = 0;
    waveStartTime = 0;

    // Check if all waves are complete
    if (gameState.currentWave >= gameState.totalWaves) {
      return {
        ...gameState,
        phase: 'victory',
        gold: gameState.gold + wave.goldReward,
      };
    }

    // Move to next wave
    return {
      ...gameState,
      phase: 'build',
      currentWave: gameState.currentWave + 1,
      gold: gameState.gold + wave.goldReward,
    };
  }

  return gameState;
};

/**
 * Main game update loop
 */
export const updateGame = (gameState: GameState, deltaTime: number): GameState => {
  // Don't update if game is over or paused
  if (gameState.phase === 'victory' || gameState.phase === 'defeat' || gameState.phase === 'paused') {
    return gameState;
  }

  let newState = {
    ...gameState,
    time: gameState.time + deltaTime,
  };

  // During wave phase
  if (newState.phase === 'wave') {
    // Spawn enemies
    const spawnResult = spawnEnemiesForWave(newState);
    if (spawnResult.ok) {
      newState = spawnResult.value;
    }

    // Move enemies
    newState = updateEnemyPositions(newState, deltaTime);

    // Process combat
    newState = processCombat(newState);

    // Check wave completion
    newState = checkWaveCompletion(newState);
  }

  return newState;
};

/**
 * Pause/unpause game
 */
export const togglePause = (gameState: GameState): GameState => {
  if (gameState.phase === 'paused') {
    return { ...gameState, phase: 'wave' };
  } else if (gameState.phase === 'wave') {
    return { ...gameState, phase: 'paused' };
  }
  return gameState;
};
