# CODER TASK PLAYBOOK — GOLDEN SUN BATTLE MIGRATION

**Status:** Complete  
**Author:** Architect Role (MetaPrompt system)  
**Last Updated:** 2025-11-01 16:32 UTC

---

## Overview
- **Total Tasks:** 15
- **Estimated Duration:** 25–35 hours
- **Primary References:**
  - `CODEBASE_ANALYSIS.md`
  - `TYPE_INTEGRATION_STRATEGY.md`
  - `BATTLE_INTEGRATION_ARCHITECTURE.md`
- **Testing Baseline:** Maintain 0 TypeScript errors, port 500+ tests with deterministic seeds.

Each task below is designed to be copy-pasted into a dedicated Coder chat. Status checkboxes are for the Coder to maintain.

---

### CODER-01 — Migrate Core Utilities (rng/id/result)
**Status:** ☐ Not Started  
**Estimate:** 1.5 h  
**Dependencies:** None

**Description:**
Port deterministic helper utilities from NextEraGame to establish a consistent foundation.

**Files to Create:**
- `golden-sun/src/utils/rng.ts`
- `golden-sun/src/utils/id.ts`
- `golden-sun/src/utils/result.ts`

**Steps:**
1. Copy logic from `nexteragame/src/utils` preserving deterministic behavior.
2. Update any Node-specific imports to use ES module syntax (matching Golden Sun build).
3. Add barrel export if needed (`src/utils/index.ts`).
4. Write Vitest specs under `golden-sun/tests/utils/` verifying determinism and error cases.

**Acceptance Criteria:**
- [ ] Utilities compile with existing TypeScript config.
- [ ] RNG generates consistent sequence with identical seeds.
- [ ] Result helper enforces exhaustive checks (same API as NextEraGame).
- [ ] Tests: ≥50 RNG cases, ≥10 ID/Result cases.

---

### CODER-02 — Establish Battle Type Namespace
**Status:** ☐ Not Started  
**Estimate:** 2 h  
**Dependencies:** CODER-01

**Description:**
Create battle type modules as specified in `TYPE_INTEGRATION_STRATEGY.md`.

**Files to Create:**
- `golden-sun/src/types/battle.ts`
- `golden-sun/src/types/psynergy.ts`
- `golden-sun/src/types/djinn.ts`
- `golden-sun/src/types/battle-events.ts`
- `golden-sun/src/types/party.ts`

**Steps:**
1. Define interfaces/enums exactly as documented, adapting from NextEraGame types.
2. Introduce `PartyMember` shape for overworld roster with persistence hooks.
3. Ensure no React imports; pure TypeScript only.
4. Create targeted unit tests verifying shape conversions via TypeScript `expectTypeOf` or runtime guards.

**Acceptance Criteria:**
- [ ] All new type files compile with `tsc --noEmit`.
- [ ] Exports align with naming decisions (Psynergy, Djinn, Element).
- [ ] Type tests verify adapter compatibility.

---

### CODER-03 — Port Buff System
**Status:** ☐ Not Started  
**Estimate:** 2 h  
**Dependencies:** CODER-01, CODER-02

**Description:**
Bring over NextEraGame's `BuffSystem` to manage stat stages and durations.

**Files to Create:**
- `golden-sun/src/systems/buffSystem.ts`
- `golden-sun/tests/systems/buffSystem.test.ts`

**Steps:**
1. Copy logic, replace type imports with new namespace.
2. Adjust elemental references to 4-element union.
3. Add coverage for new statuses (if any) from Golden Sun design.
4. Ensure exported API matches hook expectations (`applyBuff`, `tickBuffs`).

**Acceptance Criteria:**
- [ ] 100% branch coverage in Vitest.
- [ ] Buff stacking behaves identical to NextEraGame baselines.
- [ ] Works with `BattleUnit` stats shape.

---

### CODER-04 — Port Ability → Psynergy System
**Status:** ☐ Not Started  
**Estimate:** 3 h  
**Dependencies:** CODER-01, CODER-02, CODER-03

**Description:**
Rename NextEraGame `AbilitySystem` to `PsynergySystem` while maintaining underlying combat math.

**Files to Create:**
- `golden-sun/src/systems/psynergySystem.ts`
- `golden-sun/tests/systems/psynergySystem.test.ts`

**Steps:**
1. Copy ability logic and refactor names (Ability → Psynergy, MP → PP if not already).
2. Integrate buff interactions referencing new `BuffSystem`.
3. Ensure elemental advantage matrix uses 4-element layout.
4. Provide API for damage calculation, PP deduction, secondary effects.

**Acceptance Criteria:**
- [ ] Elemental multipliers align with Golden Sun canon (1.5x advantage, 0.5x resistance by default).
- [ ] Tests cover damage, healing, buff/debuff, and status application.
- [ ] Deterministic results with seeded RNG.

---

### CODER-05 — Integrate Item System
**Status:** ☐ Not Started  
**Estimate:** 2 h  
**Dependencies:** CODER-01, CODER-02

**Description:**
Merge battle item handling with existing overworld inventory definitions.

**Files to Modify/Create:**
- `golden-sun/src/systems/itemSystem.ts`
- `golden-sun/tests/systems/itemSystem.test.ts`
- `golden-sun/src/types/item.ts` (extend as needed)

**Steps:**
1. Port NextEraGame `ItemSystem` functions (use, equip, apply effects).
2. Map Golden Sun shop inventory types to battle consumables.
3. Ensure items can emit `BattleEvent`s for animations where necessary.
4. Write tests for consumables, equipment buffs, and failure cases.

**Acceptance Criteria:**
- [ ] Shared item definitions compile without breaking overworld shops.
- [ ] Inventory mutations reflect in both battle and overworld contexts.
- [ ] Tests verify at least 5 consumable + 3 equipment scenarios.

---

### CODER-06 — Adapt Element System
**Status:** ☐ Not Started  
**Estimate:** 1.5 h  
**Dependencies:** CODER-04

**Description:**
Refactor NextEraGame `ElementSystem` to the 4-element Golden Sun model.

**Files to Create:**
- `golden-sun/src/systems/elementSystem.ts`
- `golden-sun/tests/systems/elementSystem.test.ts`

**Steps:**
1. Replace 6-element matrix with 4-element compatibility chart.
2. Provide helper functions for computing advantage/resistance and for UI display colors.
3. Export constants for Graphics (HP bar glows, etc.).

**Acceptance Criteria:**
- [ ] Functions produce correct multipliers for each matchup (party vs enemy).
- [ ] Tests cover all 16 combinations.
- [ ] API reused by Psynergy + Djinn systems.

---

### CODER-07 — Port GemSuperSystem → DjinnSystem
**Status:** ☐ Not Started  
**Estimate:** 2.5 h  
**Dependencies:** CODER-03, CODER-04, CODER-06

**Description:**
Bring over limited-break mechanics, renaming gems to Djinn and aligning with new type definitions.

**Files to Create:**
- `golden-sun/src/systems/djinnSystem.ts`
- `golden-sun/tests/systems/djinnSystem.test.ts`

**Steps:**
1. Copy logic for charging, releasing, and resetting Djinn.
2. Align data shape with `types/djinn.ts` and new element union.
3. Integrate with `BattleEvent` system for Graphics (cast animations).
4. Provide functions for availability gating (story progression).

**Acceptance Criteria:**
- [ ] Djinn release modifies stats and triggers summon charges as expected.
- [ ] Recovery timers persist across turns via `useManualBattle`.
- [ ] Tests cover equip, release, recovery, and failure cases.

---

### CODER-08 — Create Battle Data Sets
**Status:** ☐ Not Started  
**Estimate:** 3 h  
**Dependencies:** CODER-02 through CODER-07

**Description:**
Author canonical data for party roster, enemy formations, psynergy catalog, and items.

**Files to Create:**
- `golden-sun/src/data/partyMembers.ts`
- `golden-sun/src/data/battleFormations.ts`
- `golden-sun/src/data/psynergyCatalog.ts`
- `golden-sun/src/data/battleItems.ts`

**Steps:**
1. Translate NextEraGame starter units and enemies into Golden Sun lore.
2. Balance stats according to 4-element system.
3. Assign animation keys referencing Graphics sprite registry.
4. Provide tests verifying data integrity (e.g., no missing PP costs).

**Acceptance Criteria:**
- [ ] Data validated via schema or Zod parser.
- [ ] At least 4 party members and 10 enemy formations defined.
- [ ] Data coverage tests ensure IDs are unique and referential integrity holds.

---

### CODER-09 — Port `useManualBattle` Hook
**Status:** ☐ Not Started  
**Estimate:** 4 h  
**Dependencies:** CODER-03 through CODER-08

**Description:**
Migrate the core battle runtime hook, adapting to new types and 4-element rules.

**Files to Create:**
- `golden-sun/src/hooks/useManualBattle.ts`
- `golden-sun/tests/hooks/useManualBattle.test.ts`

**Steps:**
1. Copy NextEraGame implementation; replace imports with migrated systems.
2. Integrate `BattleEvent` emitter for Graphics to subscribe.
3. Ensure hook exposes commands: `selectCommand`, `confirmAction`, `confirmTarget`, `advanceDialogue`, etc.
4. Maintain deterministic RNG with seeded context.

**Acceptance Criteria:**
- [ ] Hook compiles and passes ported Vitest suite (≥200 tests).
- [ ] Supports player and AI turns, flee attempts, Djinn release, and summons.
- [ ] Emits events for Graphics timeline at each stage.

---

### CODER-10 — Implement Battle Trigger System
**Status:** ☐ Not Started  
**Estimate:** 2 h  
**Dependencies:** CODER-08, CODER-09; architecture document section 2

**Description:**
Extend dialogue + quest systems to initiate battles based on new dialogue action.

**Files to Modify/Create:**
- `golden-sun/src/types/dialogue.ts`
- `golden-sun/src/systems/dialogueSystem.ts`
- `golden-sun/src/systems/battleTriggerSystem.ts`
- `golden-sun/tests/systems/battleTriggerSystem.test.ts`

**Steps:**
1. Add `battle` action type and transition payload handling.
2. Create `battleTriggerSystem` to fetch formations and instantiate `BattleContext` via adapters.
3. Update dialogue tests verifying actions queue correctly.
4. Provide fallback logging if formation ID not found.

**Acceptance Criteria:**
- [ ] Dialogue sequences can include battle actions without breaking existing flows.
- [ ] Tests cover success, missing formation, repeated triggers, and queue chaining.
- [ ] System integrates with `BattleContextFactory` utility.

---

### CODER-11 — Build Battle Transition Controller
**Status:** ☐ Not Started  
**Estimate:** 2.5 h  
**Dependencies:** CODER-09, CODER-10; architecture section 4

**Description:**
Create a reusable transition manager that handles fade-in/out, audio, and loop pausing.

**Files to Create/Modify:**
- `golden-sun/src/components/BattleTransitionOverlay.tsx`
- `golden-sun/src/systems/transitionManager.ts`
- `golden-sun/src/hooks/useTransitionManager.ts`
- `golden-sun/tests/systems/transitionManager.test.ts`

**Steps:**
1. Implement manager storing current transition state.
2. Expose hooks to trigger transitions from `GoldenSunApp` and `BattleScreen`.
3. Provide overlay component for Graphics to style.
4. Ensure transitions pause/resume overworld update loop (expose callbacks).

**Acceptance Criteria:**
- [ ] Transition durations match architecture doc (400ms default).
- [ ] Tests verify state machine for enter/exit/failure cases.
- [ ] Hooks safe to call multiple times (idempotent).

---

### CODER-12 — Implement Battle Reward Pipeline
**Status:** ☐ Not Started  
**Estimate:** 2 h  
**Dependencies:** CODER-08, CODER-09

**Description:**
Create reward processing functions bridging battle results to overworld systems.

**Files to Create:**
- `golden-sun/src/systems/battleRewardSystem.ts`
- `golden-sun/tests/systems/battleRewardSystem.test.ts`

**Steps:**
1. Implement `applyBattleRewards` as per architecture document.
2. Integrate with `inventorySystem`, `storyFlagSystem`, and future leveling placeholders.
3. Provide failure handling (e.g., missing party member) with descriptive errors.
4. Write tests for victory, defeat, flee, and mixed reward cases.

**Acceptance Criteria:**
- [ ] Rewards update party stats and inventory correctly.
- [ ] Story flags modifications propagate to dialogue tests.
- [ ] Tests cover all outcome branches.

---

### CODER-13 — Integrate Battle Mode into `GoldenSunApp`
**Status:** ☐ Not Started  
**Estimate:** 3 h  
**Dependencies:** CODER-10, CODER-11, CODER-12

**Description:**
Modify `GoldenSunApp.tsx` to manage `gameMode`, render battle screen, and resume overworld state.

**Files to Modify/Create:**
- `golden-sun/src/GoldenSunApp.tsx`
- `golden-sun/src/components/BattleShell.tsx`
- `golden-sun/tests/app/BattleIntegration.test.tsx`

**Steps:**
1. Introduce `gameMode` + `battleContext` state.
2. Render `<BattleShell>` when mode is `'battle'`; otherwise show overworld.
3. Wire in transition manager + reward pipeline.
4. Ensure keyboard/controller input is routed to battle hook while active.

**Acceptance Criteria:**
- [ ] App toggles cleanly between overworld and battle without React warnings.
- [ ] Tests cover start battle → victory → resume dialogue and defeat path.
- [ ] Performance: verify 60 FPS by ensuring only one RAF loop runs at a time.

---

### CODER-14 — Port BattleScreen Logic (Non-Visual)
**Status:** ☐ Not Started  
**Estimate:** 4 h  
**Dependencies:** CODER-09, CODER-11, CODER-13

**Description:**
Bring over container logic from `BattleScreen.tsx` but leave component rendering to Graphics role.

**Files to Create:**
- `golden-sun/src/screens/BattleScreen.tsx`
- `golden-sun/src/screens/BattleScreen.controller.ts`
- `golden-sun/tests/screens/BattleScreen.controller.test.tsx`

**Steps:**
1. Split NextEraGame `BattleScreen` into logic (controller hook) and presentational skeleton.
2. Expose props for Graphics to plug in components (menus, HUD, etc.).
3. Ensure event bus + transition manager are consumed correctly.
4. Add tests verifying state machine transitions across phases.

**Acceptance Criteria:**
- [ ] Controller handles command selection, queue processing, and result callbacks.
- [ ] Tests replicate NextEraGame battle scenario outcomes using stub components.
- [ ] Graphics can render via dependency injection without rewriting logic.

---

### CODER-15 — Port Battle Test Suite
**Status:** ☐ Not Started  
**Estimate:** 6 h  
**Dependencies:** All prior tasks

**Description:**
Migrate NextEraGame battle tests (≈500) ensuring deterministic behavior and compatibility with Golden Sun code.

**Files to Create/Modify:**
- `golden-sun/tests/screens/BattleScreen.test.tsx`
- `golden-sun/tests/systems/BattleSystem.test.ts`
- Additional helper fixtures under `golden-sun/tests/fixtures/battle/`

**Steps:**
1. Script-assisted path updates for imports and asset references.
2. Adjust assertions for renamed terminology (Psynergy, Djinn).
3. Update snapshots to reflect Golden Sun UI where necessary.
4. Ensure tests seed RNG and stub timers identical to NextEraGame suite.

**Acceptance Criteria:**
- [ ] All ported tests pass locally (≥500 specs).
- [ ] Coverage parity with NextEraGame baseline (99%+ on battle modules).
- [ ] Test runtime remains under 90 seconds on CI hardware (optimize mocks if needed).

---

## Hand-Off Notes
- Execute tasks sequentially unless dependencies explicitly satisfied.
- Keep `ARCHITECTURAL_DECISIONS.md` updated if deviations are required.
- Coordinate with Graphics once CODER-09 is complete so UI work can begin in parallel.

