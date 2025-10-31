# Session Plan - Elemental Bastion Tower Defense

## Session Goals

Build a fully functional tower defense game with:
1. ✅ Grid-based tower placement system
2. ✅ Wave-based enemy spawning with pathfinding
3. ✅ Combat system with elemental weaknesses
4. ✅ Resource management (gold, lives)
5. ✅ 4 tower types with unique abilities
6. ✅ 10 waves with increasing difficulty
7. ✅ Game state management (play, pause, victory, defeat)

## Quality Gates

**Coder (Logic):**
- [ ] TypeScript: 0 errors
- [ ] Tests: 100% pass rate
- [ ] Circular dependencies: 0
- [ ] Build: Success
- [ ] Deterministic RNG: Seeded and verified

**Graphics (Visual):**
- [ ] No 404s for assets
- [ ] Animations: 30+ FPS
- [ ] WCAG 2.1 AA compliance
- [ ] No console errors

## Architecture Decisions

### 1. Deterministic RNG
- Use seeded RNG for enemy spawning
- Same seed → same wave composition
- Enables replay and testing

### 2. Result Types
- All functions return `Result<T, E>` for error handling
- No exceptions thrown
- Type-safe error propagation

### 3. Pure Functions
- Game logic is pure (input → output)
- No side effects in system functions
- State transformations are explicit

### 4. Entity Component System (Simplified)
- Entities: Towers, Enemies
- Components: Position, Health, Damage, Element
- Systems: Combat, Pathfinding, Wave Management

### 5. Fixed Timestep Game Loop
- 60Hz tick rate (16.666ms per frame)
- Deterministic physics
- Separates update from render

## Task Breakdown

### Phase 1: Core Systems (Coder)
- **T-TYPE-001**: Define core types (Grid, Tower, Enemy, GameState)
- **T-UTIL-001**: Implement Result type and RNG utilities
- **T-SYS-001**: Build grid system with pathfinding
- **T-SYS-002**: Implement tower placement system
- **T-SYS-003**: Create wave spawning system

### Phase 2: Combat & Logic (Coder)
- **T-SYS-004**: Implement combat system with elemental damage
- **T-SYS-005**: Build resource management (gold, lives)
- **T-SYS-006**: Create game state machine (play, pause, win, lose)
- **T-SYS-007**: Add tower upgrade system

### Phase 3: Integration (Graphics)
- **T-INT-001**: Integrate React components with game state
- **T-INT-002**: Wire animations to combat events
- **T-INT-003**: Add visual effects (projectiles, explosions)
- **T-INT-004**: Polish UI/UX interactions

## Acceptance Criteria

### Must Have
- 12x6 grid with defined path
- 4 tower types with unique stats
- 12 enemy types (4 lesser, 4 greater, 4 ancient)
- 10 waves with JSON-defined composition
- Elemental weakness system working
- Gold economy balanced
- Victory/defeat conditions enforced

### Should Have
- Tower range indicators
- Enemy health bars
- Wave preview
- Pause functionality
- Sound effects (optional)

### Out of Scope (V2)
- Tower selling
- Multiple maps
- Difficulty modes
- Leaderboards
- Persistent save system

## Time Estimates

- **Phase 1 (Core):** 3-4 hours
- **Phase 2 (Combat):** 2-3 hours
- **Phase 3 (Integration):** 2-3 hours
- **Testing & Polish:** 1-2 hours

**Total:** 8-12 hours

## Dependencies

- React 18+
- TypeScript 5+
- Vitest (testing)
- CSS Modules or styled-components

## Handoff Protocol

**Architect → Coder:**
- Provide task prompt with files, signatures, acceptance criteria
- Coder implements and returns completion report

**Architect → Graphics:**
- Provide UI contract and animation specifications
- Graphics integrates without modifying game logic

**Coder/Graphics → QA:**
- Submit completion reports with evidence
- QA verifies quality gates

**QA → Release:**
- QA:PASS triggers packaging and deployment
- QA:FAIL routes back to owner with defect list
