# Pokemon Battler - Architect Session Plan

## Session Goal
Build a deterministic, tested Pokemon battle simulator with type-effective combat, turn-based mechanics, and a clean React UI.

## Scope
**IN SCOPE:**
- 1v1 Pokemon battles
- 4 Pokemon (Charizard, Blastoise, Venusaur, Pikachu)
- 16 moves with type/power/PP system
- Type effectiveness (Fire/Water/Grass/Electric/Normal)
- Damage calculation with critical hits
- Turn-based combat with speed-based turn order
- HP system with KO detection
- Battle log with move results
- Pokemon/Move selection UI

**OUT OF SCOPE:**
- Status effects (paralysis, burn, etc.)
- Multiple Pokemon per trainer (no switching)
- Items or abilities
- Experience/leveling system
- AI opponent (human vs human or human vs predetermined moves)
- Multiplayer networking
- Sound effects
- Save/load functionality

## Architecture Decisions

### ADR-001: Deterministic Battle System
**Decision**: All randomness must use seeded RNG. Same seed = same battle outcome.

**Rationale**:
- Enables replay functionality
- Makes testing reliable
- Allows battle verification
- Prevents non-deterministic bugs

**Implementation**:
- Create `SeededRNG` class with `nextInt()` and `nextFloat()` methods
- Pass RNG instance to all damage/crit calculations
- FORBIDDEN: `Math.random()` in battle logic

### ADR-002: Result Type Pattern
**Decision**: Use `Result<T, E>` pattern for all fallible operations.

**Rationale**:
- Explicit error handling
- No thrown exceptions in game logic
- Type-safe error propagation
- Clear success/failure paths

**Implementation**:
```typescript
type Result<T, E> = { ok: true; value: T } | { ok: false; error: E };
```

### ADR-003: Immutable State Updates
**Decision**: All state updates return new objects, never mutate inputs.

**Rationale**:
- Prevents side effects
- Enables time-travel debugging
- React-friendly state management
- Easier to test

**Implementation**:
- Pure functions only in battle logic
- Use object spread for updates: `{...pokemon, hp: newHP}`
- TypeScript readonly modifiers where appropriate

### ADR-004: Fixed Timestep Loop (Deferred)
**Decision**: Not applicable for turn-based game. No real-time loop needed.

**Rationale**: Pokemon battles are discrete turns, not continuous simulation.

### ADR-005: Mockup-First Graphics
**Decision**: HTML/CSS mockup MUST be approved before React integration.

**Rationale**:
- Locks visual design before code
- Prevents sprite/layout rework
- Graphics gets clear acceptance criteria

## System Decomposition

### System 1: Pokemon Data Model
**Files**: `src/types/pokemon.ts`, `src/data/pokemon-data.ts`, `src/data/move-data.ts`

**Responsibilities**:
- Define Pokemon interface (id, name, type, stats, moves)
- Define Move interface (name, type, power, PP)
- Export static data for 4 Pokemon and 16 moves

**Types**:
```typescript
type PokemonType = 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Normal';

interface Move {
  readonly name: string;
  readonly type: PokemonType;
  readonly power: number;
  readonly maxPP: number;
}

interface PokemonSpecies {
  readonly id: string;
  readonly name: string;
  readonly type: PokemonType;
  readonly baseHP: number;
  readonly baseAttack: number;
  readonly baseDefense: number;
  readonly baseSpeed: number;
  readonly moveNames: readonly string[];
}

interface PokemonInstance {
  readonly species: PokemonSpecies;
  readonly currentHP: number;
  readonly moves: ReadonlyArray<{ move: Move; currentPP: number }>;
}
```

**Tests**:
- Validate all 4 Pokemon have correct stats
- Validate all 16 moves have correct type/power/PP
- Validate each Pokemon has 4 valid moves

### System 2: Type Effectiveness
**Files**: `src/systems/type-effectiveness.ts`

**Responsibilities**:
- Calculate type multiplier for move type vs Pokemon type
- Return 2.0 (super effective), 0.5 (not very effective), or 1.0 (neutral)

**Signature**:
```typescript
function getTypeMultiplier(moveType: PokemonType, targetType: PokemonType): number
```

**Tests**:
- Fire > Grass (2.0)
- Water > Fire (2.0)
- Grass > Water (2.0)
- Fire < Water (0.5)
- Normal vs all (1.0)
- Electric > Water (2.0)

### System 3: Damage Calculator
**Files**: `src/systems/damage-calculator.ts`

**Responsibilities**:
- Calculate damage from attack using Pokemon stats, move power, type effectiveness, and critical hits
- Use seeded RNG for critical hit chance (6.25%)

**Signature**:
```typescript
interface DamageResult {
  readonly damage: number;
  readonly isCritical: boolean;
  readonly effectiveness: number; // 2.0, 1.0, or 0.5
}

function calculateDamage(
  attacker: PokemonInstance,
  defender: PokemonInstance,
  move: Move,
  rng: SeededRNG
): DamageResult
```

**Formula**:
```
baseDamage = ((2 * 50 / 5 + 2) * movePower * (attackerAttack / defenderDefense) / 50 + 2)
multiplier = typeEffectiveness * critMultiplier
finalDamage = Math.floor(baseDamage * multiplier)
```

**Tests**:
- Known damage calculation with seed
- Critical hit applied correctly (1.5x)
- Type effectiveness applied correctly
- Minimum damage is 1
- Same seed = same damage (determinism test)

### System 4: Battle State Manager
**Files**: `src/systems/battle-state.ts`

**Responsibilities**:
- Manage battle state (both Pokemon, turn count, winner)
- Process move execution
- Update HP and PP
- Detect KO and battle end
- Generate battle log messages

**State**:
```typescript
interface BattleState {
  readonly player: PokemonInstance;
  readonly opponent: PokemonInstance;
  readonly turn: number;
  readonly winner: 'player' | 'opponent' | null;
  readonly log: readonly BattleLogEntry[];
  readonly rng: SeededRNG;
}

interface BattleLogEntry {
  readonly turn: number;
  readonly message: string;
}
```

**Functions**:
```typescript
function createBattle(
  playerSpecies: PokemonSpecies,
  opponentSpecies: PokemonSpecies,
  seed: number
): BattleState

function executeMove(
  state: BattleState,
  attacker: 'player' | 'opponent',
  moveIndex: number
): Result<BattleState, string>

function applyDamage(
  pokemon: PokemonInstance,
  damage: number
): PokemonInstance
```

**Tests**:
- Battle initializes with full HP
- Move execution reduces HP correctly
- PP decreases after move use
- Can't use move with 0 PP
- Battle ends when HP reaches 0
- Winner detected correctly
- Battle log records all actions
- Speed determines turn order

### System 5: Seeded RNG
**Files**: `src/utils/seeded-rng.ts`

**Responsibilities**:
- Provide deterministic random number generation
- Support integer range and float range

**Signature**:
```typescript
class SeededRNG {
  constructor(seed: number);
  nextInt(min: number, max: number): number; // [min, max) exclusive max
  nextFloat(): number; // [0, 1)
  clone(): SeededRNG; // For branching RNG state
}
```

**Tests**:
- Same seed produces same sequence
- Different seeds produce different sequences
- Numbers in correct ranges
- Clone produces independent RNG with same state

## Task Prompts

### TASK 1: Coder - Core Battle Systems
**Assignee**: Coder

**Files to Create**:
- `src/utils/seeded-rng.ts` - Seeded RNG implementation
- `src/types/pokemon.ts` - Type definitions
- `src/data/move-data.ts` - Move database
- `src/data/pokemon-data.ts` - Pokemon species database
- `src/systems/type-effectiveness.ts` - Type chart
- `src/systems/damage-calculator.ts` - Damage formula
- `src/systems/battle-state.ts` - Battle state manager

**Files to Create (Tests)**:
- `src/utils/seeded-rng.test.ts`
- `src/data/move-data.test.ts`
- `src/data/pokemon-data.test.ts`
- `src/systems/type-effectiveness.test.ts`
- `src/systems/damage-calculator.test.ts`
- `src/systems/battle-state.test.ts`

**Acceptance Criteria**:
1. `npm run type-check` → 0 errors
2. `npm test` → 100% pass
3. `npm run build` → success
4. SeededRNG produces deterministic sequences
5. All 4 Pokemon and 16 moves in database
6. Type effectiveness matches Pokemon rules
7. Damage calculation uses formula specified
8. Battle state tracks HP, PP, turn, winner
9. executeMove validates PP and updates state
10. Battle ends when HP reaches 0
11. All functions pure (no mutations)

**Quality Gates**:
- 100% test pass rate
- 0 TypeScript errors
- 0 circular dependencies
- Determinism: Same seed = same battle (prove with test)

---

### TASK 2: Graphics - Battle UI Mockup (Phase 1)
**Assignee**: Graphics

**Files to Create**:
- `mockups/battle-screen.html` - Static battle UI
- `mockups/battle-screen.css` - Styling
- `mockups/sprite-placements.json` - Sprite positions

**Requirements**:
- Two Pokemon status panels (player bottom, opponent top)
- Each status panel shows:
  - Pokemon sprite (96x96px placeholder)
  - Name and level (e.g., "CHARIZARD Lv.50")
  - HP bar (colored: green/yellow/red based on %)
  - HP text (e.g., "78/78")
- Battle arena background (CSS gradient or image)
- Move selection panel (4 buttons in 2x2 grid)
- Battle log (scrolling text area, last 5 messages visible)
- All text high contrast (4.5:1 minimum)
- Focus indicators for keyboard nav (3px border)

**Acceptance Criteria**:
1. HTML renders in browser with no console errors
2. All layout matches Story Bible mockup specification
3. HP bar changes color at 50% and 25% thresholds
4. Move buttons clearly labeled
5. Keyboard tab order: Move1 → Move2 → Move3 → Move4
6. No JavaScript (HTML/CSS only)
7. Responsive layout (works at 1024x768 minimum)
8. WCAG 2.1 AA compliant

**Delivery**:
- Screenshot of mockup
- Confirmation of WCAG compliance
- Sprite placement JSON

---

### TASK 3: Graphics - React Integration (Phase 2)
**Assignee**: Graphics (after Phase 1 approval)

**Files to Create**:
- `src/components/BattleScreen.tsx` - Main battle component
- `src/components/PokemonStatus.tsx` - Status panel component
- `src/components/MoveButton.tsx` - Move selection button
- `src/components/BattleLog.tsx` - Battle log component
- `src/components/HPBar.tsx` - Animated HP bar

**Requirements**:
- Convert approved mockup to React components
- Wire components to battle state (read-only, no logic changes)
- Animate HP bar changes (300ms transition)
- Update battle log with aria-live="polite"
- Preserve all game logic from Coder's implementation
- NO modifications to `src/systems/` or `src/data/`

**Acceptance Criteria**:
1. Visual matches approved mockup exactly
2. HP bar animates smoothly on damage
3. Battle log updates with each action
4. Move buttons show PP remaining
5. Keyboard navigation works (tab, enter, arrows)
6. No console errors
7. WCAG 2.1 AA compliant
8. 30+ FPS during animations

**Quality Gates**:
- No 404s for assets
- No console errors
- Animations smooth
- Focus rings visible
- Text contrast ≥ 4.5:1

## Quality Gates Summary

### Coder Gates
- [ ] Tests: 100% pass
- [ ] TypeScript: 0 errors
- [ ] Build: success
- [ ] Circular deps: 0
- [ ] Determinism: Same seed = same output (with test proof)

### Graphics Gates
- [ ] No console errors
- [ ] No 404s
- [ ] Animations: 30+ FPS
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard nav works
- [ ] Focus visible
- [ ] Contrast ≥ 4.5:1

### QA Gates (Before Release)
- [ ] All Coder gates verified
- [ ] All Graphics gates verified
- [ ] Feature matches Story Bible
- [ ] Battle mechanics correct (type effectiveness, damage, turn order)
- [ ] UI/UX smooth and accessible

## Acceptance Criteria (Session Success)

1. **Functional Battle**: Can select Pokemon, use moves, deal damage, win/lose
2. **Type System Works**: Fire beats Grass, Water beats Fire, etc.
3. **Deterministic**: Same seed produces same battle
4. **Tested**: All systems have passing tests
5. **Accessible**: WCAG 2.1 AA compliant, keyboard navigable
6. **Visual Polish**: HP bars animate, battle log updates, sprites display
7. **Quality Gates**: All green (0 errors, 100% tests, build success)

## Dependencies

```
Story Director → Architect → Coder ─┐
                           ↓         ↓
                      Graphics (Phase 1 → Approval → Phase 2)
                           ↓
                          QA
                           ↓
                        Release
```

## Routing Directives

1. **Architect → Coder**: Execute TASK 1, deliver Completion Report
2. **Architect → Graphics**: Execute TASK 2 (Phase 1), deliver mockup screenshot
3. **Graphics (Phase 1) → Architect**: Review mockup, approve or request changes
4. **Architect (Approval) → Graphics**: Execute TASK 3 (Phase 2), deliver Completion Report
5. **Coder + Graphics → QA**: Verify all quality gates, deliver QA Decision Note
6. **QA:PASS → Release**: Package, version, deploy
7. **QA:FAIL → [Owner]**: Route defects back to Coder or Graphics
8. **Release → Architect**: Next task planning

## Version Planning
- **v1.0.0**: Initial release with 1v1 battles, 4 Pokemon, type system
- **v1.1.0** (Future): Add 4 more Pokemon, status effects
- **v1.2.0** (Future): AI opponent with difficulty levels
- **v2.0.0** (Future): Team battles (6v6 with switching)
