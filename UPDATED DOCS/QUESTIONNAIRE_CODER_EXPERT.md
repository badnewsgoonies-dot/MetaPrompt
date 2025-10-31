# QUESTIONNAIRE_CODER_EXPERT.md

Goal: Lock technical contracts the implementation must honor.

A. Language & Tooling
1) Language + runtime: (e.g., TypeScript + Vite + Vitest)
2) Strictness: TS strict | No implicit any | ESLint rules (list special ones)

B. Core Patterns
3) Deterministic RNG: lib + seeding policy + fork labels:
4) Error handling: Result<T,E> | Other:
5) Game loop: Fixed-timestep (Hz), clamp (ms), interpolation (Y/N):
6) Immutability rules: Readonly types | No mutation in systems

C. Testing
7) Test types required: Unit | Integration | Property | Determinism
8) Coverage targets (overall / critical):
9) CI commands to run (exact scripts):
10) Replay/logging needs (hashing, export/import):

D. Performance
11) Entity caps (players, enemies, projectiles, particles):
12) Object pooling? Which subsystems?
13) P95 frame time target (ms):

E. Integration Contracts
14) UI contracts to honor (props/types to freeze):
15) File/storyboard the mockups establish (HTML regions, tokens to consume):
16) Allowed dependencies (whitelist) and banned APIs (e.g., no Math.random):
