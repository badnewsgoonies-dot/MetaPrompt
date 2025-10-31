# MetaPrompt - SUPER-ENTERPRISE Game Development System

## Overview

A **battle-tested AI workflow system** for building production-grade games with specialized AI roles, quality gates, and CI/CD pipeline. Proven with real shipped games:

- **NextEraGame** - 24,500 LOC, 1029 tests, 99.6% pass rate, 10/10 health score, deployed live
- **Backpack Battles Clone** - 10,500 LOC, 150+ tests, 16 systems, 4.5 hours build time

**Combined:** 35,000+ LOC, 1179+ tests, ~35 hours AI collaboration = **50-200x productivity multiplier**

---

## The Secret Sauce

> "Specialized AI roles working in parallel with explicit handoffs, quality gates at every step, and battle-tested patterns from shipped games."

This system enables you to:
1. Fill out expert questionnaires (50-90 min total)
2. Generate role-specific onboarding documents
3. Execute with 3-6 specialized AIs in separate chats
4. Get a production game in 30-60 hours

---

## Quick Start

### Choose Your Workflow

**Option 1: Three-Tier Workflow** (Core - No Narrative)
- 3 roles: Architect → Coder / Graphics (parallel)
- Best for: Mechanics-focused games, action games, puzzles
- Time: 30-40 hours
- Questionnaire: [three-tier-questionnaire.md](three-tier-questionnaire.md)

**Option 2: Four-Role Workflow** (Narrative-First)
- 4 roles: Story Director → Graphics Mockup → Architect → Coder/Graphics
- Best for: RPGs, tactical games, narrative-rich games
- Time: 40-60 hours
- Questionnaires: [story-director-questionnaire.md](story-director-questionnaire.md) + [three-tier-questionnaire.md](three-tier-questionnaire.md)

**Option 3: Six-Role CI/CD Workflow** (Maximum Control)
- 6 roles: Story Director → Graphics → Architect → Coder/Graphics → QA/Verifier → Automation/Release
- Best for: Full production pipeline with independent QA
- Time: 40-60 hours
- Questionnaires: See [UPDATED DOCS/README.md](UPDATED%20DOCS/README.md)

---

## File Structure

```
MetaPrompt/
├── README.md                          # You are here
│
├── QUESTIONNAIRES (For Users)
│   ├── story-director-questionnaire.md    # 30-45 min - Narrative-first approach
│   └── three-tier-questionnaire.md        # 20-30 min - Three-role approach
│
├── METHODOLOGY & PATTERNS (For AI)
│   ├── three-tier-workflow-guide.md       # Complete three/four-role methodology
│   ├── pattern-library.md                 # 50KB battle-tested code patterns
│   ├── graphics-mockup-template.md        # HTML/CSS mockup-first workflow
│   └── graphics-decisions-reference.md    # Production graphics values
│
└── UPDATED DOCS/                      # Six-role CI/CD system
    ├── README.md                      # Six-role overview
    ├── PROCESS_GUIDE.md               # End-to-end pipeline
    ├── CHAT_ORCHESTRATION_RUNBOOK.md  # Handoff templates
    │
    ├── ROLE ONBOARDING DOCS (6 files)
    │   ├── STORY_DIRECTOR_ONBOARDING.md
    │   ├── ARCHITECT_ONBOARDING.md
    │   ├── CODER_ONBOARDING.md
    │   ├── GRAPHICS_ONBOARD.md
    │   ├── QA_VERIFIER_ONBOARDER.md
    │   └── AUTOMATION_RELEASE_ONBOARDER.md
    │
    └── EXPERT QUESTIONNAIRES (3 files)
        ├── QUESTIONNAIRE_ARCHITECT_EXPERT.md
        ├── QUESTIONNAIRE_CODER_EXPERT.md
        └── QUESTIONNAIRE_GRAPHICS_EXPERT.md
```

---

## Workflow Comparison

| Aspect | Three-Tier | Four-Role | Six-Role CI/CD |
|--------|-----------|-----------|----------------|
| **Roles** | 3 | 4 | 6 |
| **Questionnaires** | 1 (three-tier) | 2 (story + three-tier) | 3 (expert) |
| **Story Front-Loading** | ❌ No | ✅ Yes | ✅ Yes |
| **Graphics Mockup-First** | ❌ No | ✅ Yes | ✅ Yes |
| **Independent QA** | ❌ No | ❌ No | ✅ Yes |
| **Automated Release** | ❌ No | ❌ No | ✅ Yes |
| **Time Investment** | 30-40 hrs | 40-60 hrs | 40-60 hrs |
| **Quality Gates** | Manual | Manual | Automated |
| **Best For** | Mechanics-focused | Narrative-rich | Full CI/CD pipeline |

---

## The Three-Tier Workflow (Recommended Start)

### Step 1: Fill Questionnaire (20-30 min)

Open [three-tier-questionnaire.md](three-tier-questionnaire.md) and answer questions about:
- Game concept and loop
- Systems to implement (Combat, Inventory, Progression, etc.)
- Quality standards (tests, TypeScript, determinism)
- Graphics approach (sprites, animations, effects)

### Step 2: Create Three Chats

**Chat 1 - Architect AI** (Strategic Planning)
- Reads: [three-tier-workflow-guide.md](three-tier-workflow-guide.md)
- Creates: Session plans, task prompts, architectural decisions
- Does NOT: Write implementation code

**Chat 2 - Coder AI** (Logic Implementation)
- Reads: [three-tier-workflow-guide.md](three-tier-workflow-guide.md) + [pattern-library.md](pattern-library.md)
- Creates: Game systems, tests, TypeScript code
- Quality gates: 100% tests pass, 0 TS errors, 0 circular deps

**Chat 3 - Graphics AI** (Visual Polish)
- Reads: [graphics-mockup-template.md](graphics-mockup-template.md) + [graphics-decisions-reference.md](graphics-decisions-reference.md)
- Creates: HTML/CSS mockups (Phase 1) → React integration (Phase 2)
- Quality gates: WCAG 2.1 AA, 30+ FPS, no 404s

### Step 3: Execute

**Architect creates tasks** → **Paste to Coder/Graphics** → **They work in parallel** → **Architect reviews** → **Ship**

Time: 30-40 hours total, 30-40x faster than solo development

---

## The Four-Role Workflow (Narrative-First)

### When to Use

- RPGs with factions, elements, and complex power systems
- Tactical games with lore and world-building
- Games with significant UI copy and terminology
- You want narrative clarity BEFORE any code

### Additional Step: Story Director

**Before** the three-tier workflow, fill [story-director-questionnaire.md](story-director-questionnaire.md) to generate:

1. **Story Bible** (1-2 pages) - World, factions, power system, lexicon, UI copy
2. **Encounter Palette** (JSON) - Difficulty tiers with enemy/element/status mixes
3. **Beat Map** (6-10 beats) - Narrative progression aligned with game loop
4. **Mockup Script** (HTML outline) - Every sprite and UI element specified
5. **Namepack JSON** (60+ names) - Units, abilities, items, locations
6. **Accessibility Notes** - Contrast, motion, language constraints

**Then** hand off to Graphics for HTML/CSS mockup creation (no JavaScript), then proceed with three-tier workflow.

Time: 40-60 hours total (includes 1-2 hours Story Director phase)

---

## The Six-Role CI/CD Workflow (Full Pipeline)

### When to Use

- Maximum control over quality gates
- Independent QA verification before release
- Automated versioning and deployment
- Full traceability and evidence for each phase

### Process

See [UPDATED DOCS/README.md](UPDATED%20DOCS/README.md) for complete documentation.

**Pipeline:**
```
Story Director → Graphics (Mockup) → Architect → Coder/Graphics (parallel) → QA/Verifier → Automation/Release
```

**Quality Gates:**
- **Coder:** 100% tests, 0 TS errors, 0 circular deps, P95 < 16.666ms, determinism verified
- **Graphics:** WCAG 2.1 AA, 30+ FPS, 0 404s, screenshots provided
- **QA:** PASS/FAIL/WAIVER decision with evidence
- **Release:** SemVer, release notes, deployment, routing to next task

Time: 40-60 hours total

---

## Battle-Tested Patterns

All patterns in [pattern-library.md](pattern-library.md) are extracted from real shipped games:

### Code Patterns
- **Result Types** - Type-safe error handling (no exceptions)
- **Deterministic RNG** - Seeded random for replay capability
- **Pure Functions** - No side effects, testable systems
- **Component Architecture** - ECS-inspired entity management

### Graphics Patterns (from [graphics-decisions-reference.md](graphics-decisions-reference.md))
- **Screen Shake:** 5/10/20px, 300ms fixed (NextEraGame)
- **Animation Timing:** 50ms→300ms→2000ms sequence (idle → attack → death)
- **Color System:** Element-based palette (Mars/Mercury/Venus/Jupiter)
- **Sprite Conventions:** Lowercase folders, PascalCase files

### Workflow Patterns
- **Mockup-First Graphics:** 80-90% success rate vs 30-40% traditional
- **Explicit Router Grammar:** `ROLE:STATE → NEXT-ROLE:ACTION` (no implicit handoffs)
- **Quality Gates:** Enforced at every step (PASS/FAIL/WAIVER)

---

## Success Metrics

### NextEraGame (Three-Tier)
- **24,500 LOC** TypeScript
- **1,029 tests** (99.6% pass rate)
- **10/10 health score**
- **30-40 hours** AI collaboration
- **Deployed live** to production

### Backpack Battles Clone (Meta-Onboarder)
- **10,500 LOC** TypeScript
- **150+ tests**
- **16 systems**, 102 items, 453 sprites
- **4.5 hours** total build time
- **200x productivity** (4.5 hours vs 900+ hours manual)

### Combined Results
- **35,000+ LOC** production code
- **1,179+ tests**
- **~35 hours** AI collaboration
- **Equivalent to 1,800+ hours** manual work
- **50-200x productivity multiplier**

---

## Key Innovations

### 1. Story Director Role (Narrative Front-Loading)
- World-building BEFORE code eliminates rework
- Graphics gets complete mockup script with all sprites/UI specified
- Architect locks scope from clear requirements
- Coder knows exact flow from Beat Map

### 2. Mockup-First Graphics Workflow
- HTML/CSS blueprint before React integration
- 80-90% success rate vs 30-40% traditional approach
- Clear handoff between visual design and code integration
- Design tokens prevent drift during implementation

### 3. Explicit Router Grammar
- Every handoff has routing directive: `ROLE:STATE → NEXT-ROLE:ACTION`
- No implicit handoffs
- QA is mandatory gatekeeper (no direct Coder→Release)
- Traceability for every decision

### 4. Quality Gates at Every Step
- **Coder:** 100% tests, 0 TS errors, 0 circular deps, build success
- **Graphics:** WCAG 2.1 AA, 30+ FPS, 0 404s, contrast verified
- **QA:** Independent verification with evidence
- **Release:** Versioning, deployment, release notes

### 5. Battle-Tested Patterns
- All values from real shipped games (not theoretical)
- Rationales documented for every decision
- Copy-paste ready with real numbers
- Anti-patterns library (5 common mistakes + fixes)

---

## Getting Started Checklist

**For Three-Tier Workflow:**
- [ ] Read [three-tier-workflow-guide.md](three-tier-workflow-guide.md) (30 min)
- [ ] Fill [three-tier-questionnaire.md](three-tier-questionnaire.md) (20-30 min)
- [ ] Create 3 separate AI chats (Architect, Coder, Graphics)
- [ ] Give each AI their section from workflow guide
- [ ] Architect creates first session plan
- [ ] Copy tasks to Coder/Graphics chats
- [ ] Build in parallel

**For Narrative-First (Four-Role):**
- [ ] Fill [story-director-questionnaire.md](story-director-questionnaire.md) (30-45 min)
- [ ] Story Director produces 5 outputs (1-2 hours)
- [ ] Graphics creates HTML/CSS mockup (2-3 hours)
- [ ] Then follow three-tier workflow above

**For Six-Role CI/CD:**
- [ ] Read [UPDATED DOCS/README.md](UPDATED%20DOCS/README.md)
- [ ] Read [UPDATED DOCS/PROCESS_GUIDE.md](UPDATED%20DOCS/PROCESS_GUIDE.md)
- [ ] Fill all 3 expert questionnaires (50-90 min)
- [ ] Create 6 separate AI chats
- [ ] Give each AI their onboarding doc
- [ ] Follow [UPDATED DOCS/CHAT_ORCHESTRATION_RUNBOOK.md](UPDATED%20DOCS/CHAT_ORCHESTRATION_RUNBOOK.md)

---

## FAQ

**Q: Why SUPER-ENTERPRISE only?**
A: This system is built for production games. The patterns, quality gates, and workflows are proven with real shipped games (24.5K+ LOC). If you need quick prototypes, this is overkill.

**Q: Do I need all 6 roles?**
A: No. Start with three-tier (Architect/Coder/Graphics). Add Story Director if narrative-rich. Add QA/Automation for full CI/CD pipeline.

**Q: How long does it take?**
A: 30-40 hours for three-tier, 40-60 hours for four/six-role. This is 30-200x faster than solo development.

**Q: Can I use this with other AI models?**
A: Yes. The system is model-agnostic. The onboarding docs work with Claude, ChatGPT, or any AI that can follow detailed instructions.

**Q: What if I don't know TypeScript?**
A: The Coder AI handles all implementation. You just fill questionnaires and coordinate between AIs.

**Q: Do I need to know the patterns?**
A: No. The pattern library is for the Coder AI. You just specify what systems you want, and Coder applies the patterns.

---

## License

Use freely for game development, AI training, and learning.

---

## Ready to Build?

1. **Three-tier (mechanics-focused)?** → Start with [three-tier-questionnaire.md](three-tier-questionnaire.md)
2. **Narrative-first RPG/tactical?** → Start with [story-director-questionnaire.md](story-director-questionnaire.md)
3. **Full CI/CD pipeline?** → Start with [UPDATED DOCS/README.md](UPDATED%20DOCS/README.md)

**The system that built NextEraGame (24.5K LOC, 1029 tests, 10/10 health) in 30-40 hours is ready for your game.**
