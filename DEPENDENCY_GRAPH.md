# DEPENDENCY GRAPH — GOLDEN SUN BATTLE MIGRATION

**Status:** Complete  
**Author:** Architect Role (MetaPrompt system)  
**Last Updated:** 2025-11-01 16:32 UTC

---

## 1. Layered Migration Order
```
Layer 0 — Utilities (standalone)
  • src/utils/rng.ts
  • src/utils/id.ts
  • src/utils/result.ts

Layer 1 — Types & Guards (depend on Layer 0)
  • src/types/battle.ts
  • src/types/psynergy.ts
  • src/types/djinn.ts
  • src/types/battle-events.ts
  • src/types/party.ts
  • src/utils/battleGuards.ts

Layer 2 — Core Systems (depend on Layers 0–1)
  • src/systems/buffSystem.ts
  • src/systems/psynergySystem.ts
  • src/systems/itemSystem.ts
  • src/systems/elementSystem.ts
  • src/systems/djinnSystem.ts

Layer 3 — Battle Data (depend on Layers 0–2)
  • src/data/partyMembers.ts
  • src/data/battleFormations.ts
  • src/data/psynergyCatalog.ts
  • src/data/battleItems.ts

Layer 4 — Battle Runtime Hooks & Helpers (depend on Layers 0–3)
  • src/hooks/useManualBattle.ts
  • src/hooks/useBattleMessages.ts
  • src/systems/battleContextFactory.ts
  • src/systems/battleRewardSystem.ts
  • src/systems/battleTriggerSystem.ts

Layer 5 — Presentation Infrastructure (depend on Layers 0–4)
  • src/hooks/useScreenShake.ts
  • src/hooks/useFlashEffect.ts
  • src/hooks/useTransitionManager.ts
  • src/components/BattleTransitionOverlay.tsx
  • src/components/battle/*.tsx (layout scaffolding)

Layer 6 — Battle Screen & Integration (depend on Layers 0–5)
  • src/screens/BattleScreen.controller.ts
  • src/screens/BattleScreen.tsx
  • src/components/BattleShell.tsx
  • src/GoldenSunApp.tsx

Layer 7 — Tests & Tooling (depend on all prior layers)
  • tests/utils/*
  • tests/systems/*
  • tests/hooks/*
  • tests/screens/*
  • tests/app/BattleIntegration.test.tsx
```

---

## 2. Cross-Project Inputs
| Source | Target | Description |
| --- | --- | --- |
| `nexteragame/src/utils/*` | Layer 0 | Seed for deterministic helpers |
| `nexteragame/src/types/game.ts` | Layer 1 | Reference for battle, ability, item shapes |
| `nexteragame/src/systems/*` | Layer 2 | Logic to port into Golden Sun systems |
| `nexteragame/src/data/*` | Layer 3 | Combat data templates |
| `nexteragame/src/hooks/useManualBattle.ts` | Layer 4 | Core runtime hook |
| `nexteragame/src/screens/BattleScreen.tsx` | Layers 5–6 | UI structure & event flows |
| `nexteragame/tests/*` | Layer 7 | Automated test coverage |

---

## 3. Parallelization Guidance
- Layers 0–2 must complete sequentially (types and systems share definitions).
- Once Layer 3 data is available, CODER-09 (`useManualBattle`) can begin while Graphics sets up skeleton components (GRAPHICS-02).
- Graphics tasks GRAPHICS-03 through GRAPHICS-06 depend on hook outputs but can mock data for early styling once Layer 3 is defined.
- Tests (Layer 7) should be ported gradually: start with utilities/systems as soon as each layer stabilizes to avoid end-loaded work.

