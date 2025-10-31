# UPDATED DOCS - Six-Role CI/CD System

## Purpose

This folder contains the complete **six-role AI workflow system** for production game development with full CI/CD pipeline, quality gates, and deployment automation.

**Use this system when:**
- You want maximum control over architecture, testing, and deployment
- You need quality gates enforced at every step (PASS/FAIL/WAIVER)
- You want full traceability and evidence for each phase
- You're building a production-deployed game with CI/CD pipeline

**Skip this if:**
- You're doing SIMPLE/MEDIUM builds (use standard questionnaire instead)
- Three-tier workflow is sufficient (Architect, Coder, Graphics)
- You don't need independent QA verification or automated releases

---

## The Six Roles

### 1. 🎬 Story Director (Optional - Narrative-First)
**File:** [STORY_DIRECTOR_ONBOARDING.md](STORY_DIRECTOR_ONBOARDING.md)

**Purpose:** Establish world, factions, tone, and UI copy BEFORE coding

**Outputs:**
- Story Bible (1-2 pages)
- Encounter Palette (JSON)
- Mockup Script (HTML outline)
- Namepack JSON (60+ names)
- Accessibility Notes

**When to use:** Narrative-rich games (RPGs, tactical games with lore)

**When to skip:** Mechanics-focused games (pure action, minimal narrative)

---

### 2. 🏛️ Architect
**File:** [ARCHITECT_ONBOARDING.md](ARCHITECT_ONBOARDING.md)

**Purpose:** Strategic planning, session plans, task creation

**Responsibilities:**
- Create session plans with measurable goals
- Make architectural decisions
- Create detailed task prompts for Coder and Graphics
- Review completion reports
- Enforce quality standards (100% tests, 0 TS errors)

**Does NOT:** Write implementation code, touch codebase

---

### 3. 🛠️ Coder
**File:** [CODER_ONBOARDING.md](CODER_ONBOARDING.md)

**Purpose:** Tactical implementation, game logic, testing

**Responsibilities:**
- Execute tasks from Architect
- Write clean, tested, type-safe code
- Follow patterns strictly (Result types, deterministic RNG, pure functions)
- Run verification commands (test, type-check, circular deps, build)
- Provide thorough completion reports

**Quality Gates:**
- TypeScript: 0 errors
- Tests: 100% pass rate
- Circular Deps: 0
- Build: Success

---

### 4. 🎨 Graphics (Two-Phase)
**File:** [GRAPHICS_ONBOARD.md](GRAPHICS_ONBOARD.md)

**Purpose:** Visual polish, sprite integration, UI/UX

**Phase 1 (Mockup-First):**
- Create HTML/CSS mockup (NO JavaScript)
- Integrate sprites and layout
- Verify WCAG 2.1 AA compliance
- Provide screenshots for approval

**Phase 2 (Integration):**
- Convert mockup to React components
- Wire animations to game state (read-only)
- Preserve all game logic (NO modifications to src/systems/)
- Test visually + verify no regressions

**Quality Gates:**
- No console errors
- No 404s for assets
- Animations smooth (30+ FPS)
- WCAG 2.1 AA compliant

---

### 5. 🧪 QA/Verifier (Independent Gatekeeper)
**File:** [QA_VERIFIER_ONBOARDER.md](QA_VERIFIER_ONBOARDER.md)

**Purpose:** Independent quality verification BEFORE release

**Inputs:**
- Completion reports from Coder/Graphics
- Acceptance criteria from task prompts
- Quality gate requirements

**Outputs:**
- **PASS** - All gates green, ready to ship
- **FAIL** - Defects found, route back to owner (Coder or Graphics)
- **WAIVER** - Gate failed but acceptable with expiry, requires Architect approval

**Quality Gates (Logic):**
- All tests passing; no flakiness
- TypeScript: 0 errors
- Circular dependencies: 0
- Build: succeeds with no errors
- Determinism honored (same seed → same output)

**Quality Gates (Visual):**
- No missing assets / 404s
- Animations smooth (≈30+ FPS)
- Aesthetic matches target
- Accessibility: keyboard nav, focus visible, live regions, contrast ≥ 4.5:1

---

### 6. 🚀 Automation/Release (Orchestrator)
**File:** [AUTOMATION_RELEASE_ONBOARDER.md](AUTOMATION_RELEASE_ONBOARDER.md)

**Purpose:** Packaging, versioning, deployment, handoff routing

**Responsibilities:**
- Watch for QA:PASS signals
- Run packaging/versioning (SemVer)
- Publish releases
- Post "NEXT ACTION" router message to appropriate chat
- Generate release notes

**Baton-Pass Router:**
1. If **Coder** → send to **QA** with task prompt + acceptance criteria
2. If **Graphics** → send to **QA** with screenshots and a11y checklist
3. If **QA: PASS** → package + release; notify Architect, open next task
4. If **QA: FAIL** → route back to owner (Coder or Graphics) with defect IDs
5. If **QA: WAIVER** → log waiver with expiry; proceed only if Architect approves

**Versioning (SemVer):**
- PATCH (x.y.Z): Bug fixes, balance tweaks
- MINOR (x.Y.0): New features, systems, content
- MAJOR (X.0.0): Breaking changes, full rebalance, major rework

---

## Workflow Orchestration

**File:** [CHAT_ORCHESTRATION_RUNBOOK.md](CHAT_ORCHESTRATION_RUNBOOK.md)

**Purpose:** Copy-paste templates for handoffs between roles

**Operating Rhythm:**

**Phase A — Plan (Architect)**
- Output: Session Plan + Task Prompts
- Next: Copy Coder task to Coder chat, visual task to Graphics chat

**Phase B — Build (Coder / Graphics in parallel)**
- Output: Completion Reports (logic + visuals)

**Phase C — Verify (QA)**
- Input: Both reports + onboarding criteria
- Output: QA Decision Note (PASS/FAIL/WAIVER)

**Phase D — Ship (Automation/Release)**
- Input: QA: PASS, build artifacts
- Output: Version, release notes, deployment, status update

**Paste-This Blocks:**
- Architect → Coder handoff
- Architect → Graphics handoff
- Coder → QA handoff
- Graphics → QA handoff
- QA → Automation handoff

---

## Process Documentation

### PROCESS_GUIDE.md
**Purpose:** Single unambiguous playbook for end-to-end pipeline

**Defines:**
- Pipeline stages (Intake → Graphics Onboard → Architect → Coder/Graphics → QA → Release)
- Inputs → Outputs per stage
- Hand-off contracts (JSON schemas)
- Quality gates per role
- Directory layout

**Key Concepts:**
- Graphics Onboard is a quality gate BEFORE code
- Two-phase graphics workflow (mockup → integration)
- Mockup-first prevents sprite integration failures

---

### PROCESS_SIDE_CAR.md
**Purpose:** Sidecar process notes and conventions

**Covers:**
- Naming conventions
- File organization
- Error handling protocols
- Evidence requirements

---

## Expert Questionnaires

### QUESTIONNAIRE_ARCHITECT_EXPERT.md
**20 questions covering:**
- Scope & priorities (non-negotiables, quality/speed/breadth rankings)
- Rigor & workflow (session style, quality gates to enforce)
- Architecture decisions (determinism, error handling, game loop, RNG, state model)
- Systems & order (initial systems, parallel execution)
- Assets & platforms (sprite source, resolutions, accessibility, performance budgets)
- Reporting (completion format, evidence, definition of done)

---

### QUESTIONNAIRE_CODER_EXPERT.md
**16 questions covering:**
- Language & tooling (TypeScript strict, ESLint rules)
- Core patterns (deterministic RNG lib + policy, Result types, game loop Hz/clamp)
- Testing (unit/integration/property/determinism, coverage targets, CI commands, replay/logging)
- Performance (entity caps, pooling subsystems, P95 frame time)
- Integration contracts (UI props/types to freeze, dependencies whitelist, banned APIs)

---

### QUESTIONNAIRE_GRAPHICS_EXPERT.md
**17 questions covering:**
- Visual direction (aesthetic reference, palette HEX values, typography)
- Canvas & layout (aspect ratios, grid definition, HUD elements, Z-layer policy)
- Sprites & assets (library location, required characters, scaling policy)
- Motion & effects (animation timing tokens, prefers-reduced-motion policy, particle/shake placeholders)
- Accessibility (WCAG AA areas, keyboard focus order)
- Evidence (required screenshots, additional mockup screens)

---

## Context Files

### context 1.txt (255KB, 8,546 lines)
**Purpose:** Complete conversation history from NextEraGame build

**Contains:**
- Full three-tier workflow execution
- Session planning examples
- Task creation patterns
- Completion report templates
- Quality gate verification
- Bug fixing iterations

**Use for:** Understanding real-world three-tier workflow

---

### context 2.txt (191KB, 6,403 lines)
**Purpose:** NextEraGame project compilation

**Contains:**
- Complete TypeScript source code
- Test suite (1029 tests)
- Documentation (30+ markdown files)
- Architecture decisions
- Pattern implementations

**Use for:** Reference implementation for SUPER-ENTERPRISE patterns

---

## New Folder (Backpack Battles Clone)

**Purpose:** Second proof-of-concept using meta-onboarder

**Stats:**
- Development time: 4.5 hours
- Lines of code: 10,501 TypeScript
- Tests: 150+
- Systems: 16
- Items: 102
- Sprites: 453
- Versions: 6 (iterative improvement)
- Quality: "SHIP IT+" (itch.io ready)

**Files:**
- src/ (16 game systems, multiple versions)
- docs/ (14 planning documents)
- tests/ (150+ tests)
- 30+ summary/report documents

**Proof:** 200x productivity (4.5 hours vs 900+ hours manual)

---

## How to Use This System

### Option 1: Full Six-Role Workflow

**Steps:**
1. Fill out all three expert questionnaires (50-90 min total)
2. (Optional) Fill story-director-questionnaire.md if narrative-rich (30-45 min)
3. Create 6 separate AI chats (or 4 if skipping Story + QA/Automation)
4. Give each AI their onboarding doc
5. Follow CHAT_ORCHESTRATION_RUNBOOK.md for handoffs
6. Use PROCESS_GUIDE.md as reference for quality gates

**Time:** 40-60 hours total (30-40x faster than solo)

**Output:** Production-deployed game with full CI/CD pipeline

---

### Option 2: Simplified Four-Role Workflow

**Steps:**
1. Fill story-director-questionnaire.md (if narrative-rich)
2. Use Graphics Onboard for mockup creation (Phase 1)
3. Use Architect for session planning
4. Use Coder + Graphics (Phase 2) for implementation

**Time:** 40-60 hours total

**Output:** Production-ready game with approved mockups

**Skip:** QA/Verifier and Automation/Release (manual verification instead)

---

## Integration with Main System

The UPDATED DOCS system integrates with the main MetaPrompt system:

**Standard System (Root Folder):**
- game-generator-questionnaire.md → Standard onboarding doc
- three-tier-questionnaire.md → Three-role onboarding docs
- story-director-questionnaire.md → Story Director outputs

**UPDATED DOCS (This Folder):**
- Expert questionnaires → Fine-grained control
- Six-role onboarding docs → Full CI/CD pipeline
- Process guides → Quality gates and handoffs

**Use Standard System if:**
- SIMPLE, MEDIUM, or ENTERPRISE builds
- Three-role workflow sufficient
- Don't need independent QA or automated releases

**Use UPDATED DOCS if:**
- Maximum control required
- Six-role workflow desired
- Production deployment with CI/CD
- Quality gates enforced at every step

---

## Quick Reference

| Role | File | Purpose | Output |
|------|------|---------|--------|
| **Story Director** | STORY_DIRECTOR_ONBOARDING.md | World-building | Story Bible, Encounter Palette, Mockup Script, Namepack, A11y Notes |
| **Architect** | ARCHITECT_ONBOARDING.md | Strategic planning | Session Plans, Task Prompts |
| **Coder** | CODER_ONBOARDING.md | Game logic | Tested TypeScript code (100% pass, 0 errors) |
| **Graphics** | GRAPHICS_ONBOARD.md | Visual polish | Mockup (Phase 1) → Integration (Phase 2) |
| **QA/Verifier** | QA_VERIFIER_ONBOARDER.md | Quality gates | PASS/FAIL/WAIVER decision |
| **Automation/Release** | AUTOMATION_RELEASE_ONBOARDER.md | Deployment | Versioned release + deployment |

---

## Success Metrics

**NextEraGame (Three-Tier):**
- 24,500 LOC
- 1029 tests (99.6% pass rate)
- 10/10 health score
- 30-40 hours (30-40x faster than solo)

**Backpack Battles Clone (Meta-Onboarder):**
- 10,501 LOC
- 150+ tests
- 16 systems, 102 items, 453 sprites
- 4.5 hours (200x faster than solo!)

**Combined:**
- 35,000+ LOC
- 1179+ tests
- Two production games
- ~35 hours total AI collaboration
- Equivalent to 1800+ hours manual work

---

## References

- [../README.md](../README.md) - Main system overview
- [../questionnaire-guide.md](../questionnaire-guide.md) - Questionnaire decision tree
- [../three-tier-workflow-guide.md](../three-tier-workflow-guide.md) - Three-tier + Story Director methodology
- [../graphics-mockup-template.md](../graphics-mockup-template.md) - Two-phase graphics templates
- [../pattern-library.md](../pattern-library.md) - Battle-tested patterns (Section 16 for mockup-first)

---

## License

Use freely for game development, AI training, and learning.

---

**Ready to use the six-role system?**

1. Read [PROCESS_GUIDE.md](PROCESS_GUIDE.md) - Understand the full pipeline
2. Fill out expert questionnaires - Get fine-grained control
3. Use [CHAT_ORCHESTRATION_RUNBOOK.md](CHAT_ORCHESTRATION_RUNBOOK.md) - Copy-paste handoff templates
4. Enforce quality gates - Use [QA_VERIFIER_ONBOARDER.md](QA_VERIFIER_ONBOARDER.md) for verification

**Or start simpler:**

- [../game-generator-questionnaire.md](../game-generator-questionnaire.md) - Quick prototype (2-7 hours)
- [../three-tier-questionnaire.md](../three-tier-questionnaire.md) - Production build (30-40 hours)
- [../story-director-questionnaire.md](../story-director-questionnaire.md) - Narrative-first (40-60 hours)
