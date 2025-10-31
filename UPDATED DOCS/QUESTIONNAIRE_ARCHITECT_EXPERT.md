# QUESTIONNAIRE_ARCHITECT_EXPERT.md

Goal: Capture constraints that drive system decomposition, planning, and gates.

A. Scope & Priorities
1) One-sentence vision of the game:
2) Absolute non-negotiables (list 3):
3) Rank (1-5): Code quality / Visual polish / Speed / Feature breadth / Production readiness

B. Rigor & Workflow
4) Rigor level: SIMPLE | MEDIUM | ENTERPRISE | SUPER-ENTERPRISE
5) Session style: System-by-system | Vertical slices | Parallel tracks
6) Quality gates to enforce (check all): TS 0 errors | Tests 100% pass | 0 circular deps | Build success | WCAG AA

C. Architecture Decisions
7) Determinism required? Yes/No
8) Error handling pattern: Result types | Exceptions
9) Game loop: setInterval | rAF | Fixed-timestep (accumulator)
10) RNG: Math.random | Deterministic (seeded) | Forkable streams
11) State model: Mutable | Immutable | Immutable + reducers

D. Systems & Order
12) List initial systems (3–12) in dependency order:
13) Which systems can run in parallel?

E. Assets & Target Platforms
14) Sprite/asset source and license notes:
15) Target resolutions/aspect ratios:
16) Accessibility promises to uphold (WCAG AA items):
17) Performance budgets (FPS, memory rough targets):

F. Reporting
18) Completion report format requirements (extra fields if any):
19) Evidence required (screenshots, logs, hashes, etc.):
20) Definition of done for MVP vs ship:
