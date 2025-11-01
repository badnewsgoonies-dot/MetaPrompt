# CODEBASE ANALYSIS — GOLDEN SUN × NEXT ERAGAME BATTLE MIGRATION

**Status:** Complete  
**Author:** Architect Role (MetaPrompt system)  
**Last Updated:** 2025-11-01 16:32 UTC

---

## 1. Scope & Source Material
This analysis compares the production battle stack from **NextEraGame** with the current overworld stack in **Golden Sun: Vale Village** to identify integration points and migration requirements.

### 1.1 Primary Files Reviewed — NextEraGame
| Domain | File | Purpose |
| --- | --- | --- |
| Core Hook | `nexteragame/src/hooks/useManualBattle.ts` | Battle state machine, turn order, AI, messaging |
| Screen | `nexteragame/src/screens/BattleScreen.tsx` | Top-level battle UI controller, orchestrates components |
| Types | `nexteragame/src/types/game.ts` | Canonical definitions for units, abilities, items, effects |
| Systems | `nexteragame/src/systems/AbilitySystem.ts` | Ability execution, PP costs, targeting |
|  | `nexteragame/src/systems/BuffSystem.ts` | Timed buffs/debuffs, stat stage math |
|  | `nexteragame/src/systems/ItemSystem.ts` | Consumables + equipment handling |
|  | `nexteragame/src/systems/ElementSystem.ts` | Elemental affinities, damage multipliers |
|  | `nexteragame/src/systems/GemSuperSystem.ts` | Gem-driven limit break (to be renamed Djinn) |
| Data | `nexteragame/src/data/*.ts` | Player party templates, opponents, spell lists |
| Tests | `nexteragame/tests/screens/BattleScreen.test.tsx` | Full battle flow, UI assertions |
|  | `nexteragame/tests/systems/BattleSystem.test.ts` | Deterministic system coverage |

### 1.2 Primary Files Reviewed — Golden Sun
| Domain | File | Purpose |
| --- | --- | --- |
| App Shell | `golden-sun/src/GoldenSunApp.tsx` | Orchestrates overworld state, dialogue, shops, input |
| Dialogue | `golden-sun/src/systems/dialogueSystem.ts` | Dialogue registry, progression, actions |
| Movement | `golden-sun/src/systems/movementSystem.ts` | Player/NPC positioning, camera |
| Story & Flags | `golden-sun/src/systems/storyFlagSystem.ts`, `golden-sun/src/types/scene.ts` | Narrative flow, area transitions |
| Types | `golden-sun/src/types/dialogue.ts`, `golden-sun/src/types/npc.ts`, `golden-sun/src/types/quest.ts` | Core overworld data models |
| Data | `golden-sun/src/data/dialogueData.ts`, `golden-sun/public/sprite_map.json` | Dialogue tree definitions, sprite metadata |

---

## 2. Architectural Overview

### 2.1 NextEraGame Battle Stack
- **State Machine:** `useManualBattle` builds an explicit reducer-like loop (phases: `PlayerInput → ResolveActions → ApplyEndOfTurn → CheckOutcome`).
- **Data Flow:** Hook exposes a `BattleController` object consumed by `BattleScreen.tsx`, which renders nested UI components (action menus, target selectors, timelines, result overlays).
- **Systems Layer:** Ability/Buff/Item/Element/Gem systems are pure modules operating on `BattleUnit` structures. They rely on shared utilities (`Result`, RNG seeding, ID generation) to ensure determinism.
- **Data Layer:** `starterUnits`, `opponents`, `elementalSpells`, etc. instantiate typed battle data. Templates feed the hook via dependency injection.
- **Testing:** Comprehensive Vitest suite verifying deterministic damage, animation triggers, and UI copy. Tests stub RNG to fixed seeds and inspect DOM output.

### 2.2 Golden Sun Overworld Stack
- **Single App Shell:** `GoldenSunApp.tsx` holds React state for NPC registry, dialogue, shops, active scene, player movement, and debug overlays. It currently has no battle mode toggles.
- **Dialogue Pipeline:** `dialogueSystem.ts` handles conversation progression with action hooks (e.g., `startDialogue`, `advanceDialogue`, `selectDialogueChoice`). No battle action exists yet.
- **Story Systems:** Quest and story flag systems coordinate gating of dialogue and interactions, but outcomes are currently limited to flags and inventory operations.
- **Rendering:** Overworld uses React canvas layering + sprite atlas metadata from `sprite_map.json`. Animations rely on `requestAnimationFrame` loops inside the app component.

### 2.3 High-Level Integration Concept
- Introduce a **Battle Mode** inside `GoldenSunApp.tsx` that swaps rendering from overworld components to a new `BattleScreen` port.
- Use adapter functions to convert overworld party data (NPCs, inventory) into battle-ready structures consumed by NextEraGame systems.
- Return battle outcomes back to story/quest systems to unlock dialogue, grant rewards, and resume exploration.

---

## 3. Dependency Graph Snapshot
The table below summarizes dependency layers across both projects. Detailed per-module sequencing is captured in `DEPENDENCY_GRAPH.md`.

| Layer | Components | Notes |
| --- | --- | --- |
| 0 — Utilities | `rng.ts`, `id.ts`, `Result.ts` | Deterministic core. Must migrate first for system parity. |
| 1 — Battle Types | `types/battle.ts`, `types/ability.ts`, `types/djinn.ts` | Defines structural contracts for all downstream systems. |
| 2 — Systems | Buff, Psynergy, Item, Element, Djinn | Pure logic modules; depend only on layers 0–1. |
| 3 — Data | Party templates, enemy formations, psynergy catalog | Provide content for systems; rely on layers 0–2. |
| 4 — Hooks | `useManualBattle`, `useBattleMessages`, effect hooks | Compose systems into battle runtime. |
| 5 — UI Components | Battle menus, HUD, animations | React components that bind to hook API. |
| 6 — Screens/App | `BattleScreen.tsx`, `GoldenSunApp.tsx` integration | Swaps between overworld and battle contexts. |
| 7 — Tests & Tooling | System + UI suites, story integration tests | Validate correctness across layers. |

---

## 4. Integration Points
1. **Dialogue Actions → Battle Trigger:** Extend `DialogueAction` union to support `{ type: 'battle', ... }`. When invoked, GoldenSunApp must set battle context and transition to battle mode.
2. **Party Data:** Map overworld `PartyMember` (to be introduced) and NPC enemy definitions to battle `BattleUnit` using adapter helpers. Persist HP/PP back post-battle when appropriate.
3. **Reward Pipeline:** After `BattleResult` returns from the hook, update inventory, experience, coins, and story flags using existing systems (`questSystem`, `storyFlagSystem`).
4. **Screen Lifecycle:** Overworld `requestAnimationFrame` loop should pause while in battle to avoid double-updating the world.
5. **Audio/Visual Hooks:** Reuse NextEraGame's screen shake/flash hooks by wiring them into Golden Sun's component tree and ensuring effect CSS classes align with existing styling tokens.
6. **Saving/State Persistence:** Ensure story flags updated from victory propagate to existing save/load path once implemented (future expansion noted in decision log).

---

## 5. Type Mismatch Inventory
| Concept | NextEraGame Type | Golden Sun Equivalent | Action |
| --- | --- | --- | --- |
| Battle Unit | `BattleUnit` (dynamic stats, buffs) | *No equivalent yet* | Introduce `BattleUnit` in `types/battle.ts` + adapters |
| Party Member | `PlayerUnit` (roster) | `NPC` for allies not modeled, `Inventory` for items | Create `PartyMember` type under battle namespace |
| Ability | `Ability` with PP cost, elements | No direct analog | Rename to `Psynergy`, adjust element enum |
| Element | 6-element enum | Only implicit elemental flavor in dialogue | Define `Element` union for 4 canonical GS elements now |
| Items | `BattleItem` supporting usage contexts | `ShopItem` types for overworld | Build bridging module that maps shop inventory to battle consumables |
| Rewards | `BattleRewards` object (exp, loot) | `StoryFlagSystem` & inventory functions | Introduce `applyBattleRewards` helper referencing existing systems |
| Game Mode | `GameControllerState` (battle, roster, etc.) | `GoldenSunApp` booleans | Add `gameMode` + `battleContext` state to app component |

---

## 6. Migration Checklist (Battle-Specific Scope)
1. **Utilities & Types**
   - [ ] `src/utils/rng.ts`
   - [ ] `src/utils/id.ts`
   - [ ] `src/utils/result.ts`
   - [ ] `src/types/battle.ts`
   - [ ] `src/types/psynergy.ts`
   - [ ] `src/types/djinn.ts`
2. **Systems**
   - [ ] `BuffSystem`
   - [ ] `PsynergySystem` (AbilitySystem port)
   - [ ] `ItemSystem`
   - [ ] `ElementSystem`
   - [ ] `DjinnSystem` (GemSuperSystem port)
3. **Hooks**
   - [ ] `useManualBattle`
   - [ ] `useBattleMessaging`
   - [ ] Visual effect hooks (`useScreenShake`, `useFlashEffect`)
4. **Data**
   - [ ] Player roster templates
   - [ ] Enemy formations (trainers, random encounters)
   - [ ] Psynergy catalog + PP costs
   - [ ] Item definitions (battle-usable)
5. **UI Components**
   - [ ] Layout container + background renderer
   - [ ] Player/enemy slots, HP/PP bars, status icons
   - [ ] Action menu, target selector, turn order tracker
   - [ ] Damage/heal number overlays, animation wrappers
6. **Screens/App Integration**
   - [ ] `BattleScreen.tsx`
   - [ ] Updates to `GoldenSunApp.tsx`
   - [ ] `DialogueSystem` extensions for battle actions
7. **Tests & QA**
   - [ ] Ported system/unit tests
   - [ ] UI/battle flow tests
   - [ ] Integration tests tying dialogue → battle → rewards
8. **Assets**
   - [ ] Sprite atlas copy (2,500+ entries)
   - [ ] Psynergy animation spritesheets (19 sequences)
   - [ ] Sound effects (if available — verify licensing)

---

## 7. Risk Zones & Mitigations (Summary)
| Risk | Details | Mitigation |
| --- | --- | --- |
| `BattleScreen.tsx` size | 1,800+ LOC with nested state | Break into hooks & context modules; port incrementally aligned with dependency graph |
| Type coupling | Mixed naming between games | Keep battle types in dedicated namespace, use adapters for conversions |
| Animation timing drift | Screen shake/flash rely on tuned constants | Copy timing constants verbatim; validate via Graphics acceptance tests |
| Test volume | 500+ specs require adaptation | Automate path rewrites, port tests in batches, run CI frequently |
| Dialogue integration | New battle action must not regress existing flows | Introduce exhaustive tests for dialogue actions, add fallback to avoid deadlocks |

---

## 8. Key Observations & Recommendations
- Prioritize **type-first migration**; once battle types compile inside Golden Sun, downstream systems port more smoothly.
- Build a **BattleContext provider** early so that both Coder and Graphics roles can rely on a common interface.
- Maintain deterministic RNG seeding identical to NextEraGame to preserve test reproducibility.
- Keep asset copying and registry creation decoupled from UI port so Graphics can begin without waiting on full logic migration.
- Document every divergence from NextEraGame semantics inside `ARCHITECTURAL_DECISIONS.md` for QA visibility.

