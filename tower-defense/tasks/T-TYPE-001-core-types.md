# Task: T-TYPE-001 - Define Core Types

## Owner
Coder

## Objective
Define TypeScript types and interfaces for all game entities, state, and configurations.

## Files to Create/Modify
- `src/types/grid.ts` - Grid, Cell, Position types
- `src/types/tower.ts` - Tower types, stats, abilities
- `src/types/enemy.ts` - Enemy types, stats, behaviors
- `src/types/game.ts` - GameState, GameConfig, Wave types
- `src/types/combat.ts` - Damage, Element, Status types

## Type Signatures

### Grid Types
```typescript
export type Position = { x: number; y: number };
export type CellType = 'placeable' | 'path' | 'spawn' | 'portal';

export interface Cell {
  position: Position;
  type: CellType;
  tower: Tower | null;
}

export interface Grid {
  width: number;
  height: number;
  cells: Cell[][];
  path: Position[];
}
```

### Tower Types
```typescript
export type TowerType = 'fire' | 'frost' | 'stone' | 'wind';
export type Element = 'fire' | 'water' | 'earth' | 'air';

export interface TowerStats {
  damage: number;
  range: number;
  attackSpeed: number; // attacks per second
  cost: number;
}

export interface Tower {
  id: string;
  type: TowerType;
  element: Element;
  position: Position;
  stats: TowerStats;
  level: number;
  lastAttackTime: number;
}
```

### Enemy Types
```typescript
export type EnemyTier = 'lesser' | 'greater' | 'ancient';

export interface EnemyStats {
  maxHp: number;
  speed: number; // cells per second
  goldReward: number;
  element: Element;
}

export interface Enemy {
  id: string;
  type: string; // e.g., 'fire_imp', 'flame_demon'
  tier: EnemyTier;
  stats: EnemyStats;
  currentHp: number;
  position: Position;
  pathIndex: number;
  statusEffects: StatusEffect[];
}

export interface StatusEffect {
  type: 'burn' | 'slow' | 'stun';
  duration: number;
  value: number;
}
```

### Game State
```typescript
export type GamePhase = 'build' | 'wave' | 'paused' | 'victory' | 'defeat';

export interface GameState {
  phase: GamePhase;
  currentWave: number;
  totalWaves: number;
  gold: number;
  lives: number;
  grid: Grid;
  towers: Tower[];
  enemies: Enemy[];
  time: number;
  seed: number;
}

export interface Wave {
  wave: number;
  difficulty: string;
  enemyCount: number;
  composition: EnemySpawn[];
  goldReward: number;
}

export interface EnemySpawn {
  type: string;
  count: number;
  delay: number; // milliseconds between spawns
}
```

## Acceptance Criteria
- [ ] All types compile with no TypeScript errors
- [ ] Types cover all entities from story bible
- [ ] Elemental system properly typed
- [ ] GameState includes all necessary fields
- [ ] Position, Cell, Grid hierarchy is clear
- [ ] Types are exported and reusable

## Tests Required
```typescript
// tests/types/types.test.ts
describe('Type Guards', () => {
  it('should identify valid positions');
  it('should identify valid cell types');
  it('should identify valid tower types');
  it('should identify valid enemy tiers');
});
```

## Definition of Done
- All type files created
- No TypeScript errors
- Type guards implemented where needed
- Tests pass
- Types match story bible specification

## Estimated Time
30 minutes

## Dependencies
None (foundational task)

## Notes
- Follow strict TypeScript conventions
- Use readonly where appropriate
- Export all types for use in other modules
- Keep types simple and composable
