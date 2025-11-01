# Golden Sun Battler

Deterministic, seed-driven battle engine inspired by the original Golden Sun series. The module models the six-role workflow's implementation deliverables with executable TypeScript logic, deterministic replays, scenario tests, and an interactive HUD that mirrors the production mockups.

## Features

- Turn order resolution with agility, guard modifiers, and deterministic randomness.
- Support for core action categories: Attack, Psynergy, Djinn set/release, Summons, Items, Defend, and Flee.
- Elemental affinity multipliers and guard status mitigation.
- Deterministic RNG for reproducible battle logs.
- Scenario-based tests demonstrating scripted encounters, reproducibility, and flee behavior.
- Queued player planners plus AI heuristics for NPC combatants.
- Interactive browser demo that renders the command grid, Psynergy/Djinn overlays, and battle log updates in real time.

## Scripts

```bash
npm install
npm run typecheck
npm test
npm run build
```

After running `npm run build`, open `mockup-examples/golden-sun-battle/app/index.html` in a static server (or your browser via `file://`) to drive the interactive battle mockup with the live engine.

## Project Structure

- `src/types.ts` – Data contracts for combatants, actions, statuses, and battle logs.
- `src/status.ts` – Utilities to manage status effects across turns.
- `src/rng.ts` – Deterministic RNG wrapper used by the battle engine.
- `src/battle.ts` – Core battle engine implementation.
- `src/planners.ts` – Queued player planner and lightweight AI strategy helpers.
- `src/ui/main.ts` – Browser demo glue connecting the engine to the command/Psynergy/Djinn screens.
- `tests/battle.test.ts` – Vitest scenarios covering battle flow plus planner/round stepping.
