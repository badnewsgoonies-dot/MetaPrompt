import type { Grid } from './grid';
import type { Tower } from './tower';
import type { Enemy } from './enemy';
import type { SeededRNG } from '../utils/rng';

export type GamePhase = 'build' | 'wave' | 'paused' | 'victory' | 'defeat';

export interface GameState {
  readonly phase: GamePhase;
  readonly currentWave: number;
  readonly totalWaves: number;
  readonly gold: number;
  readonly lives: number;
  readonly grid: Grid;
  readonly towers: ReadonlyArray<Tower>;
  readonly enemies: ReadonlyArray<Enemy>;
  readonly time: number; // milliseconds
  readonly seed: number;
  readonly rng: SeededRNG;
}

export interface EnemySpawn {
  readonly type: string;
  readonly count: number;
  readonly delay: number; // milliseconds between spawns
}

export interface Wave {
  readonly wave: number;
  readonly difficulty: string;
  readonly enemyCount: number;
  readonly composition: ReadonlyArray<EnemySpawn>;
  readonly goldReward: number;
}

export interface GameConfig {
  readonly gridWidth: number;
  readonly gridHeight: number;
  readonly startingGold: number;
  readonly startingLives: number;
  readonly totalWaves: number;
  readonly seed: number;
}

// Type guards
export const isGamePhase = (value: string): value is GamePhase => {
  return ['build', 'wave', 'paused', 'victory', 'defeat'].includes(value);
};

// Default game config
export const DEFAULT_GAME_CONFIG: GameConfig = {
  gridWidth: 12,
  gridHeight: 6,
  startingGold: 500,
  startingLives: 10,
  totalWaves: 10,
  seed: Date.now(),
};
