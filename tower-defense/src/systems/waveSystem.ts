import type { Wave, GameState } from '../types/game';
import type { Enemy } from '../types/enemy';
import { ENEMY_STATS, getEnemyTier } from '../types/enemy';
import { Ok, Err, type Result } from '../utils/result';
import { getSpawnPosition } from '../data/defaultPath';
import { WAVES } from '../data/waves';

/**
 * Get wave configuration for wave number
 */
export const getWave = (waveNumber: number): Result<Wave, string> => {
  const wave = WAVES.find((w) => w.wave === waveNumber);
  if (!wave) {
    return Err(`Wave ${waveNumber} not found`);
  }
  return Ok(wave);
};

/**
 * Spawn enemy from wave
 */
export const spawnEnemy = (
  enemyType: string,
  gameState: GameState,
  spawnTime: number
): Result<Enemy, string> => {
  const stats = ENEMY_STATS[enemyType];
  if (!stats) {
    return Err(`Unknown enemy type: ${enemyType}`);
  }

  const enemy: Enemy = {
    id: `${enemyType}-${spawnTime}-${gameState.rng.next()}`,
    type: enemyType,
    tier: getEnemyTier(enemyType),
    stats,
    currentHp: stats.maxHp,
    position: getSpawnPosition(),
    pathIndex: 0,
    statusEffects: [],
  };

  return Ok(enemy);
};

/**
 * Get total enemies for wave
 */
export const getTotalEnemiesForWave = (wave: Wave): number => {
  return wave.composition.reduce((sum, spawn) => sum + spawn.count, 0);
};

/**
 * Check if wave is complete (all enemies spawned and defeated/escaped)
 */
export const isWaveComplete = (
  gameState: GameState,
  wave: Wave,
  spawnedCount: number
): boolean => {
  const totalEnemies = getTotalEnemiesForWave(wave);
  const allSpawned = spawnedCount >= totalEnemies;
  const noEnemiesLeft = gameState.enemies.length === 0;

  return allSpawned && noEnemiesLeft;
};

/**
 * Calculate gold reward for killing enemy
 */
export const getEnemyGoldReward = (enemy: Enemy): number => {
  return enemy.stats.goldReward;
};

/**
 * Get next wave number
 */
export const getNextWaveNumber = (currentWave: number): number => {
  return currentWave + 1;
};

/**
 * Check if all waves are complete
 */
export const areAllWavesComplete = (gameState: GameState): boolean => {
  return gameState.currentWave > gameState.totalWaves;
};

/**
 * Calculate spawn schedule for wave
 * Returns array of {enemyType, spawnTime}
 */
export const calculateSpawnSchedule = (
  wave: Wave,
  startTime: number
): Array<{ enemyType: string; spawnTime: number }> => {
  const schedule: Array<{ enemyType: string; spawnTime: number }> = [];
  let currentTime = startTime;

  for (const spawn of wave.composition) {
    for (let i = 0; i < spawn.count; i++) {
      schedule.push({
        enemyType: spawn.type,
        spawnTime: currentTime,
      });
      currentTime += spawn.delay;
    }
  }

  return schedule;
};
