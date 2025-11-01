# Golden Sun Battle System Implementation Plan (Six-Role Workflow)

## Objective
Implement a production-quality Golden Sun-style turn-based battle system using the six-role CI/CD workflow. The system will evolve the existing mockups/HTML references into a playable battle module with verified logic, authentic visuals, and automated release packaging.

## Scope
- Core turn-based battle loop inspired by Golden Sun (initiative, actions, Psynergy, summons, Djinn interactions).
- Integration with existing mockups (`golden-sun-battle-pixel-perfect.html`, `mockup-examples/golden-sun-battle/`).
- Accessibility, performance, and quality gates per six-role process.
- Deliverable: tested, type-safe module ready for integration into the broader Golden Sun project.

## Shared Inputs & References
- **Design & Visual References**: `golden-sun-battle-pixel-perfect.html`, `mockup-examples/golden-sun-battle/`, `graphics-decisions-reference.md`.
- **Workflow Guidelines**: `UPDATED DOCS/PROCESS_GUIDE.md`, `UPDATED DOCS/CHAT_ORCHESTRATION_RUNBOOK.md`, role onboarding docs.
- **Patterns**: `pattern-library.md` (deterministic RNG, action queue, entity-component systems).

## Role Responsibilities & Deliverables

### 1. Story Director (Optional, enable if narrative elements required)
- Produce minimal story bible for the specific battle scenario (party composition, enemy faction, stakes).
- Deliver encounter palette JSON for battle variations (single boss, mob wave, elemental mixes).
- Provide UI copy for commands, Psynergy descriptions, and battle announcements.
- Accessibility notes for text contrast, flashing effects, and localization flags.
- **Handoff**: Story bible + encounter palette to Architect & Graphics.

### 2. Architect
- Review story & visual assets; define battle module architecture.
- Create session plan breaking the work into coder/graphics tasks (data models, turn manager, damage formulas, Djinn state machine, UI binding).
- Document technical decisions (state representation, deterministic RNG seed strategy, event bus for animations, AI scripting hooks).
- Prepare detailed task prompts with acceptance criteria, test matrix, and telemetry requirements.
- **Handoff**: Approved task prompts to Coder & Graphics.

### 3. Coder
- Implement battle core in TypeScript:
  - Entities: party members, enemies, Djinn, summons.
  - Turn order calculation with agility & status modifiers.
  - Action resolution pipeline (validate → consume resources → apply effects → emit events).
  - Psynergy & Djinn ability modules with elemental affinities.
  - Status ailments, buffs/debuffs, guard, flee, item usage.
  - Deterministic RNG + seed replay tooling.
- Create battle state machine tests (unit + scenario-based). Target 95%+ coverage on battle logic.
- Integrate with UI event emitters for Graphics layer (no direct DOM manipulation).
- Run quality gates: `npm test`, `npm run lint`, `npm run typecheck`, circular dependency check, deterministic replay verification script.
- Provide completion report with test outputs, replay hashes, and known limitations.
- **Handoff**: Code + report to QA.

### 4. Graphics (Phase 1 & 2)
- **Phase 1 (Mockup Enhancements)**:
  - Convert pixel-perfect HTML into modular design tokens and sprite atlas references.
  - Prepare animation storyboard (idle, attack, hit, summon, Psynergy effect overlays).
- **Phase 2 (Integration)**:
  - Build React (or target framework) components mirroring mockups.
  - Bind to coder event hooks for animations & state updates (read-only data props).
  - Ensure UI responsiveness at 2×/3× scaling; maintain WCAG AA compliance.
  - Deliver sprite atlas optimization, loading strategy, and accessible focus order.
- Provide performance metrics (FPS capture, GPU/CPU timing) and screenshots.
- **Handoff**: Integration branch + assets + report to QA.

### 5. QA / Verifier
- Validate coder & graphics completion reports against acceptance criteria.
- Re-run automated tests, type checks, build, and deterministic replay suite.
- Execute scripted battle scenarios (seeded) to verify expected outputs.
- Perform accessibility audit (keyboard navigation, screen reader labels, contrast measurements).
- File defects with reproduction steps; only approve when all gates green or waivers signed.
- **Output**: PASS/FAIL/WAIVER report to Automation/Release.

### 6. Automation / Release
- Upon QA PASS, bump version (likely MINOR) and package module (npm package / build artifact).
- Generate release notes summarizing features, tests, and assets.
- Publish artifact to registry or integration branch; notify Architect with "NEXT ACTION" message.
- Archive QA evidence and reports for traceability.

## Work Breakdown Structure (Example)
1. **Session 0 – Alignment (Architect)**
   - Review assets, confirm story involvement, finalize scope boundaries.
   - Output: Architecture brief, task backlog, test strategy template.
2. **Session 1 – Battle Core (Coder)**
   - Implement turn order & action resolver.
   - Tests for initiative, basic attacks, resource consumption.
3. **Session 2 – Abilities & Djinn (Coder)**
   - Add Psynergy, Djinn mechanics, status effects, summons.
   - Extend tests with elemental interactions and chained actions.
4. **Session 3 – UI Integration (Graphics)**
   - Convert mockups to live components, integrate event channels.
   - Verify responsiveness, sprite loading, and accessibility.
5. **Session 4 – Polish & QA**
   - QA executes verification checklist; coders address defects.
6. **Session 5 – Release**
   - Automation packages build, publishes release, posts next steps.

## Acceptance Criteria
- Battle module supports at least three party members and up to three enemies simultaneously.
- Supports command categories: Attack, Psynergy, Djinn, Summon, Item, Defend, Flee.
- Deterministic outcomes for identical seeds; replay log export.
- Visuals match Golden Sun aesthetic with authentic sprites and background layering.
- Full accessibility compliance (WCAG AA, keyboard navigation, focus states, alt text).
- All six-role quality gates satisfied with documented evidence.

## Risk & Mitigation
- **Sprite Licensing**: verify rights before shipping; if unavailable, use original art placeholders.
- **Performance**: large sprite sheets → use texture atlas + lazy loading.
- **Complex Mechanics**: adopt incremental feature flags (e.g., enable summons after base loop).
- **Testing Complexity**: invest in scenario DSL to describe battles declaratively.

## Evidence Checklist for QA & Release
- ✅ Test suite report (unit + scenario) with coverage.
- ✅ Type-check, lint, build logs.
- ✅ Deterministic replay hash comparisons.
- ✅ Accessibility audit results (contrast ratios, keyboard traversal video).
- ✅ Graphics performance capture (FPS report, screenshot gallery).
- ✅ Release notes + version bump confirmation.

## Implementation Snapshot (2024-05)
- **Repository Module**: `golden-sun-battler/`
- **Highlights**: Deterministic TypeScript battle engine with Psynergy, Djinn, Summon, Item, Defend, and Flee actions; Vitest scenarios covering scripted encounters, reproducible logs, and flee checks.
- **Workflow Coverage**: Architected data contracts and state machine, coded battle resolution, no-UI graphics placeholder ready for integration hooks, QA evidence via `npm run typecheck` and `npm test`, automation-ready NPM scripts.

