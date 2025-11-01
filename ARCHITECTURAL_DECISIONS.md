# ARCHITECTURAL DECISION LOG — GOLDEN SUN BATTLE MIGRATION

**Status:** Complete  
**Author:** Architect Role (MetaPrompt system)  
**Last Updated:** 2025-11-01 16:32 UTC

---

## Decision Register
| ID | Date | Context | Decision | Alternatives | Impact | Follow-Up |
| --- | --- | --- | --- | --- | --- | --- |
| AD-001 | 2025-11-01 | Battle type naming alignment | Rename Ability → **Psynergy**, Gem → **Djinn** across code and UX | Keep original names for familiarity | Preserves Golden Sun lore; requires test renaming | Ensure CODER-04, CODER-07, and GRAPHICS-03 update copy |
| AD-002 | 2025-11-01 | Element system differences | Adopt 4-element model (`venus`, `mars`, `jupiter`, `mercury`) with extensibility hooks for `luna`/`sol` | Port full 6-element system immediately | Reduces initial scope; easier balancing | Document expansion path in type strategy; revisit post-MVP |
| AD-003 | 2025-11-01 | State management integration | Manage battle mode within `GoldenSunApp` using `gameMode` + `battleContext` state | Port NextEraGame `GameController` class wholesale | Simpler integration, fewer invasive changes | Verify app performance; consider dedicated controller if features grow |
| AD-004 | 2025-11-01 | UI architecture | Split `BattleScreen.tsx` into controller + presentation to enable role parallelism | Port monolithic component | Enables Graphics to focus on visuals while Coder maintains logic | Ensure shared props contract documented in CODER-14 |
| AD-005 | 2025-11-01 | Deterministic RNG | Reuse NextEraGame RNG utility unchanged with seeded context | Use browser `Math.random` or new RNG lib | Maintains deterministic tests and reproducibility | Lock dependency version (`pure-rand`) in package.json |
| AD-006 | 2025-11-01 | Reward timing | Apply rewards immediately after battle before returning to overworld | Delay reward processing to dialogue follow-up | Keeps game state consistent for quests; ensures defeat fallback manageable | Build guard rails in `battleRewardSystem` for transactional updates |
| AD-007 | 2025-11-01 | Asset management | Copy sprite assets into Golden Sun repo with registry mapping | Hot-link assets from NextEraGame build | Guarantees offline availability, simplifies bundler config | Graphics to maintain registry + documentation |
| AD-008 | 2025-11-01 | Accessibility baseline | Enforce WCAG 2.1 AA across battle UI and transitions | Postpone accessibility review until final polish | Maintains enterprise standard, reduces later rework | GRAPHICS-09 to conduct audit |
| AD-009 | 2025-11-01 | Event communication | Utilize typed `BattleEvent` stream for UI and SFX | Component-level prop drilling only | Keeps presentation decoupled from logic; supports analytics hooks | Document event schema in `TYPE_INTEGRATION_STRATEGY.md` |
| AD-010 | 2025-11-01 | Test migration approach | Port NextEraGame tests largely verbatim with path adjustments | Rewrite tests from scratch | Saves time, preserves battle behavior coverage | Create conversion scripts for import paths |

---

## Open Questions
1. **Summon Cinematics:** Determine whether full summon sequences (multi-phase animations) are required in MVP. Pending product input (see TYPE strategy).
2. **Post-Defeat Flow:** Decide on canonical defeat handling (respawn location, coin penalty). Default suggestion: return to sanctum with partial penalty.
3. **Audio Asset Licensing:** Confirm reuse rights for battle music and SFX shipped with NextEraGame.

---

## Update Process
- New decisions must append to this table with unique IDs.
- Include rationale, alternatives considered, and follow-up tasks.
- Notify downstream roles via shared summary when decisions change.

