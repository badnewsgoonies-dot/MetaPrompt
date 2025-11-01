# Golden Sun Battler

Deterministic, seed-driven battle engine inspired by the original Golden Sun series. The module models the six-role workflow's implementation deliverables with executable TypeScript logic, deterministic replays, and scenario tests.

## Features

- Turn order resolution with agility, guard modifiers, and deterministic randomness.
- Support for core action categories: Attack, Psynergy, Djinn set/release, Summons, Items, Defend, and Flee.
- Elemental affinity multipliers and guard status mitigation.
- Deterministic RNG for reproducible battle logs.
- Scenario-based tests demonstrating scripted encounters, reproducibility, and flee behavior.

## Scripts

```bash
npm install
npm run typecheck
npm test
```

## Project Structure

- `src/types.ts` – Data contracts for combatants, actions, statuses, and battle logs.
- `src/status.ts` – Utilities to manage status effects across turns.
- `src/rng.ts` – Deterministic RNG wrapper used by the battle engine.
- `src/battle.ts` – Core battle engine implementation.
- `tests/battle.test.ts` – Vitest scenarios covering battle flow.
