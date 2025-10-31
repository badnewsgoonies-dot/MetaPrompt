# PROCESS_GUIDE.md — Meta-Onboarder Pipeline (Process Doc)

Purpose: Be the single, unambiguous playbook that sits beside all questionnaires (Architect, Coder, Graphics Onboard) and explains how information flows end-to-end, which artifacts are produced at each step, and which quality gates must pass before moving on.

Note on prompting style: The system supports both one-shot and short iterative execution. One prompt is not required. This doc standardizes the pipeline so you can finish in one pass or a few focused passes without ambiguity.

---

## Pipeline at a Glance

Two equivalent ways to run the same pipeline:

A) Manual (Three Chats, highly controllable)
1) Questionnaire Intake -> 2) (Optional) Story Director -> 3) Graphics Onboard (Mockup-first) -> 4) Architect -> 5) Coder + Graphics (in parallel) -> 6) Review & Ship

B) Automated Web App (Two API calls)
1) Form Input -> 2) Auto-generate Onboarding Doc -> 3) Call LLM for Graphics Onboard mockup blueprint -> 4) Approval -> 5) Call LLM for implementation (Coder + Graphics) -> 6) Bundle/Deploy

The Graphics Onboard phase is a quality gate before any code is written. It produces a CSS/HTML blueprint mockup — pixel-accurate layout, sprite placements, UI hierarchy, and animation timing tokens.

---

## Inputs -> Outputs per Stage

0) Intake (Forms / Questionnaires)
- Inputs: Game concept, rigor, visuals, assets, constraints.
- Outputs: Normalized JSON spec (/artifacts/intake.json) plus three role-specific briefs:
  - architect_brief.md
  - coder_brief.md
  - graphics_brief.md

1) Graphics Onboard (Mockup-First, No JS)
- Inputs: graphics_brief.md, sprite registry/paths, aspect ratio, layout sketch.
- Outputs (Blueprints):
  - mockups/battle.html + mockups/battle.css (HTML/CSS only)
  - mockups/tokens.css (design tokens: spacing, z-layers, timing, scales)
  - sprite_map.json (final resolved paths, scales, anchors)
- Gate: Visual Approval (meets palette, layout, accessibility, and motion rules)

2) Architect (Plans & Prompts)
- Inputs: architect_brief.md, approved mockup outputs.
- Outputs:
  - session_plan.md (goals, timeboxes, out-of-scope)
  - tasks/... (templated prompts for Coder/Graphics)
  - acceptance_criteria.md (measurable, binary)
- Gate: Plan Completeness (all tasks have owners, files, criteria)

3) Coder (Systems & Tests)
- Inputs: coder_brief.md, session_plan.md, approved mockups (for UI contracts).
- Outputs:
  - src/systems/*, src/utils/*, tests/**/*
  - Deterministic RNG, Result types, fixed-timestep loop
- Gates:
  - TypeScript 0 errors
  - Tests 100% pass (target per rigor level)
  - 0 circular deps
  - Build success

4) Graphics (Integration & Polish)
- Inputs: Approved mockups, graphics_brief.md, sprite_map.json.
- Outputs:
  - src/components/ui/*, src/components/battle/*
  - Updated spriteRegistry.ts (no logic changes)
  - Screenshots/video evidence
- Gates:
  - No 404s, no console errors
  - 30+ FPS animations (or respects reduced motion)
  - WCAG 2.1 AA checks pass

5) Review & Ship
- Inputs: Completion reports from Coder & Graphics; all gates green.
- Outputs: Tagged release, changelog, deploy URL

---

## Hand-Off Contracts (Minimalist Data Contracts)

Graphics Onboard -> Architect (example JSON)
{
  "screens": ["battle", "menu", "equipment"],
  "layout": { "battle": { "grid": "12x8", "regions": ["enemyRow","log","playerRow","hud"] }},
  "tokens": { "baseline": 4, "space": { "xs":4,"sm":8,"md":12,"lg":16 }, "z":{ "bg":0,"fx":5,"hud":10 } },
  "sprites": [{ "id": "isaac.front", "path": "/sprites/.../Isaac_lSword_Front.gif", "scale": 0.9, "anchor": "bottom-center" }],
  "timing": { "attackMs": 600, "hurtMs": 400, "flashMs": 150 }
}

Architect -> Coder (Task Template IDs)
- T-UTIL-xxx (utility), T-TYPE-xxx (type change), T-SYS-xxx (system), T-BUG-xxx, T-REF-xxx, T-INT-xxx
- Each task includes: files, signatures, acceptance, tests, estimate, out-of-scope.

Coder -> Graphics (UI Contract)
- Component props/types are stable and documented (ui_contract.md).
- Graphics may add CSS/DOM but must not change props or game logic.

---

## Quality Gates (per Role)

- Graphics Onboard: Approved layout, tokens, sprite paths resolved, accessibility checks.
- Coder: TypeScript 0 errors; tests pass; deterministic RNG enforced; build OK.
- Graphics: No 404s; 30+ FPS; WCAG 2.1 AA; screenshots attached.
- Release: All completion reports attached; session goals met; regressions none.

---

## Directory Layout (suggested)

/artifacts/
  intake.json
  architect_brief.md
  coder_brief.md
  graphics_brief.md
  session_plan.md
  acceptance_criteria.md
/mockups/
  battle.html
  battle.css
  tokens.css
  sprite_map.json
/tasks/
  T-SYS-battle-system.md
  T-UTIL-result-type.md
  T-INT-integrate-animations.md

---

## Modes & Prompting

- One-shot mode: Provide all briefs and run: "Build per session_plan.md, honor all acceptance criteria."
- Short-iteration mode: Execute in 2-3 passes (mockup -> plan -> code/polish). The docs and gates keep each pass deterministic.

---

## Conventions

- Name the visual gate doc "Graphics Onboard" (official). No JS in this phase - HTML/CSS only.
- Coder never edits sprite assets or UI animation timing. Graphics never edits src/systems/*.
- Architect writes plans & prompts only - no code.

---

## Measuring Success

- Mockups approved before code.
- Fewer than 3 clarifying prompts per feature.
- Zero rework from invisible assumptions.
- Build & tests green on first integration.
