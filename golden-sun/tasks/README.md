# Task Directory: Golden Sun Vale Village MVP

## Task Organization

All tasks follow the naming convention: `T-[TYPE]-[NAME].md`

**Types:**
- **SYS** - System implementation (game logic)
- **UI** - UI component (React)
- **INT** - Integration/testing
- **BUG** - Bug fix
- **REF** - Refactoring

## Task List (Session 1)

### Foundation (Priority 0 - Must Have)
1. ✅ **T-SYS-NPC.md** - NPC System (positioning, interaction zones, state)
2. **T-SYS-MOVEMENT.md** - Movement System (8-directional, collision, camera)
3. **T-SYS-DIALOGUE.md** - Dialogue System (text rendering, portraits, choices)
4. **T-SYS-OVERWORLD.md** - Overworld System (scene management, transitions)

### Features (Priority 1 - Should Have)
5. **T-SYS-SHOP.md** - Shop System (buy/sell, inventory, UI logic)
6. **T-SYS-SAVE.md** - Save System (localStorage persistence)

### UI (Priority 1 - Should Have)
7. **T-UI-DIALOGUE.md** - Dialogue Box Component (React)
8. **T-UI-SHOP.md** - Shop Menu Component (React)
9. **T-UI-POLISH.md** - Animations & Polish (idle bobs, walk cycles)

### Testing (Priority 0 - Must Have)
10. **T-INT-TESTS.md** - Integration Tests (movement + dialogue + shops)

## Task Dependencies

```
Foundation Layer (Parallel):
├── T-SYS-NPC (no deps)
├── T-SYS-MOVEMENT (no deps)
└── T-UI-DIALOGUE (no deps, can mock data)

Integration Layer (Sequential):
├── T-SYS-DIALOGUE (needs: T-SYS-NPC + T-UI-DIALOGUE)
├── T-SYS-OVERWORLD (needs: T-SYS-MOVEMENT)
└── T-UI-SHOP (parallel with Coder shop logic)

Feature Layer (Sequential):
├── T-SYS-SHOP (needs: T-UI-SHOP)
└── T-SYS-SAVE (can start anytime)

Polish & Test (Parallel):
├── T-INT-TESTS (needs: all SYS tasks)
└── T-UI-POLISH (needs: all UI tasks)
```

## Completion Status

- [x] T-SYS-NPC - NPC System ✅
- [ ] T-SYS-MOVEMENT - Movement System
- [ ] T-SYS-DIALOGUE - Dialogue System
- [ ] T-SYS-OVERWORLD - Overworld System
- [ ] T-SYS-SHOP - Shop System
- [ ] T-SYS-SAVE - Save System
- [ ] T-UI-DIALOGUE - Dialogue Box Component
- [ ] T-UI-SHOP - Shop Menu Component
- [ ] T-UI-POLISH - Animations & Polish
- [ ] T-INT-TESTS - Integration Tests

## Task Workflow

1. **Coder picks task** → Update status to "in_progress"
2. **Implement system** → Follow acceptance criteria
3. **Write tests** → 100% pass rate required
4. **Run verification** → `npm run type-check && npm test && npm run build`
5. **Create completion report** → Follow CODER_ONBOARDING.md template
6. **Route to QA** → QA verifies against acceptance criteria

## Quality Gates (All Tasks)

**Logic (Coder):**
- ✅ TypeScript: 0 errors
- ✅ Tests: 100% pass rate
- ✅ Circular deps: 0
- ✅ Build: Success
- ✅ Performance: P95 < 16.666ms

**Visual (Graphics):**
- ✅ Assets: 0 missing / 404s
- ✅ FPS: 30+
- ✅ Aesthetic: Matches mockup
- ✅ Accessibility: WCAG 2.1 AA
- ✅ Motion: prefers-reduced-motion support

## Architect Notes

**Out of Scope:**
- Combat system
- Party members (Garet/Ivan/Mia as followers)
- Psynergy abilities
- Equipment stats/effects
- World map
- Sol Sanctum dungeon

**MVP Focus:**
- Exploration (movement, collision, camera)
- Dialogue (NPCs, text rendering, choices)
- Economy (shops, buy/sell, inventory)
- Persistence (save/load at inn)

## Contact

**Questions about tasks?** → Ask Architect
**Blocked on dependency?** → Notify Architect
**Scope unclear?** → Reference Story Bible + Mockup
