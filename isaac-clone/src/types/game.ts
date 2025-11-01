/**
 * Main game state types
 */

import { Player } from './player';
import { Enemy } from './enemy';
import { Projectile } from './projectile';
import { Item } from './item';
import { Room } from './room';
import { Pickup } from './pickup';
import { Obstacle } from './obstacle';
import { Bomb } from './bomb';

export type GamePhase = 'playing' | 'paused' | 'victory' | 'defeat' | 'room_transition';

export interface Dungeon {
  readonly rooms: ReadonlyArray<Room>;
  readonly gridSize: number;  // 3x3 grid = 3
}

export interface GameState {
  readonly phase: GamePhase;
  readonly time: number;  // Elapsed game time in ms
  readonly seed: number;  // RNG seed for reproducibility
  readonly dungeon: Dungeon;
  readonly currentRoomId: string;
  readonly player: Player;
  readonly enemies: ReadonlyArray<Enemy>;
  readonly projectiles: ReadonlyArray<Projectile>;
  readonly items: ReadonlyArray<Item>;
  readonly pickups: ReadonlyArray<Pickup>;
  readonly obstacles: ReadonlyArray<Obstacle>;
  readonly bombs: ReadonlyArray<Bomb>;
  readonly score: number;
}

export interface GameConfig {
  readonly targetFPS: number;
  readonly fixedTimeStep: number;  // ms per frame (16.666ms for 60 FPS)
}

export const DEFAULT_GAME_CONFIG: GameConfig = {
  targetFPS: 60,
  fixedTimeStep: 1000 / 60  // 16.666ms
};
