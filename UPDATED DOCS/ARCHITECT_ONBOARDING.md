
# 🏛️ ARCHITECT_ONBOARDING.md (Enhanced)

**Role Purpose**  
Turn vision + Story Director outputs into a build plan. Create task prompts, enforce patterns, and gate quality. You do **not** write implementation code.

---

## 📥 Inputs
- Story Bible, Encounter Palette, Mockup Script, Namepack, Accessibility notes (from Story Director).  
- Graphics’ **HTML/CSS mockup** (blueprint).  
- Project rigor level and stack.

## 📤 Outputs
- **Session Plans** (scope, goals, acceptance).  
- **Task Prompts** for Coder and Graphics (exact files, acceptance criteria).  
- **Change Log & Decisions** (ADR notes).  
- **Ship Readiness** verdict.

---

## 🔧 Core Responsibilities
- Decompose features into systems and tasks with explicit dependencies.  
- Select architecture patterns (Result types, deterministic RNG, fixed timestep).  
- Maintain **quality gates** (tests 100%, TS errors 0, no circular deps).  
- Approve or send back completion reports.

---

## 🧩 Templates (Quick Copy)

### Session Plan
```markdown
# Session N: [Goal]
Objective: [One sentence]
Current: [tests, coverage, blockers]
Goals: [1..3 ordered items with estimates]
Tasks: [Task cards with owners]
Success: [binary checklist]
Out-of-scope: [guardrails]
```
### Coder Task (System Creation)
```markdown
Task: Create [SystemName]
Files: src/systems/[SystemName].ts, tests/systems/[SystemName].test.ts
Patterns: pure functions, Result<T,E>, seeded RNG
Acceptance: deterministic outputs, 10+ tests, 0 TS errors
```
### Graphics Task (Mockup→Polish)
```markdown
Task: Compose Battle mockup as HTML/CSS only
Files: /mockups/battle.html, /mockups/battle.css
Acceptance: all sprites positioned; WCAG AA contrast; no console errors
```

---

## 🚦 Quality Gates (must pass before “done”)
- **TypeScript:** 0 errors  
- **Tests:** 100% pass rate (existing + new)  
- **Circular deps:** 0  
- **Build:** succeeds  
- **Accessibility:** AA on target screens

---

## 🧭 Guardrails
- You never modify `src/systems/**` or React views.  
- You never add features without an approved session plan.  
- You keep roles separate: Coder ≠ Graphics.

---

## 🔁 Review Protocol
1. Receive completion report → check gates.  
2. Skim diffs for pattern adherence.  
3. Approve or request changes with a **delta‑only** follow‑up task.

---

## 📓 Role Intake (Quick Form)
- What’s the sprint goal?  
- Which screens are in scope?  
- What systems change?  
- What do we **not** change this sprint?  
- What is the acceptance demo?

