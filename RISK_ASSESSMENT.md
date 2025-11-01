# RISK ASSESSMENT — GOLDEN SUN BATTLE MIGRATION

**Status:** Complete  
**Author:** Architect Role (MetaPrompt system)  
**Last Updated:** 2025-11-01 16:32 UTC

---

## 1. Risk Matrix
| ID | Risk | Likelihood | Impact | Owner | Mitigation | Detection |
| --- | --- | --- | --- | --- | --- | --- |
| R1 | BattleScreen complexity (1,800+ LOC) | High | High | Coder/Graphics | Split into controller + presentational layers (CODER-14); implement incremental component ports | Automated tests + manual smoke checks after each sub-component merge |
| R2 | Type mismatches between games | Medium | High | Coder | Maintain dedicated battle namespace; enforce strict TypeScript compilation (CODER-02) | `tsc --noEmit` in CI |
| R3 | Animation timing drift | Medium | Medium | Graphics | Copy constants from NextEraGame; add visual regression checklist | Manual review + FPS logging |
| R4 | Asset transfer failures | Low | Medium | Graphics | Use checksums/count verification after copy (GRAPHICS-01) | Dev server warnings, asset loader tests |
| R5 | Dialogue integration regressions | Medium | High | Coder | Add battle action tests + fallback path (CODER-10) | Automated dialogue integration tests |
| R6 | Reward misapplication (EXP/items) | Low | High | Coder | Centralize reward logic in `battleRewardSystem.ts` with exhaustive tests | Unit tests verifying each branch |
| R7 | Deterministic RNG regression | Low | Medium | Coder | Lock RNG seed handling identical to NextEraGame; add deterministic tests (CODER-01, CODER-09) | RNG snapshot tests |
| R8 | Performance drops (dual RAF loops) | Low | High | Coder | Pause overworld loop during battle (CODER-11, CODER-13) | Performance monitoring, console warnings |
| R9 | Accessibility failures in battle UI | Medium | Medium | Graphics | Conduct WCAG audit (GRAPHICS-09) | axe-core automated checks + manual QA |
| R10 | Test suite portability effort | High | Medium | Coder/QA | Port tests incrementally; create conversion scripts (CODER-15) | CI runtime metrics |

---

## 2. Contingency Plans
- **BattleScreen Overload:** If splitting controller proves insufficient, introduce domain-specific hooks (`useBattleCommandQueue`, `useBattleTimeline`) to further decompose responsibilities.
- **Dialogue Battle Action Failure:** Provide fallback dialogue lines notifying the player that the battle could not start; log to analytics for debugging.
- **Asset Copy Legal Review:** Ensure licensing for NextEraGame assets covers reuse; if not, Graphics must create temporary placeholder sprites and coordinate with art team.
- **Performance Regression:** If RAF pause/resume proves unstable, consider migrating overworld loop into custom hook with ref-counting to ensure only one active loop at a time.

---

## 3. Monitoring & Reporting
- **Daily Standup:** Architect (or lead) reviews open risks with Coder/Graphics, updating mitigation statuses.
- **CI Gates:** Add TypeScript + test steps on PRs to catch type/regression issues early.
- **QA Checkpoints:** Run smoke battles (easy encounter, boss encounter, flee scenario) after CODER-13 and GRAPHICS-07 complete.

