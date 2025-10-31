# 🔧 Chat Orchestration Runbook (Companion Process Doc)

A 1‑page sidecar you keep beside the questionnaires and onboarders. It tells *who talks next* and *what to paste* at each step.

---

## 🔀 Router Grammar (Explicit Routing)

Every handoff follows this explicit routing syntax:

```
CODER:COMPLETION → QA:VERIFY
GRAPHICS:COMPLETION → QA:VERIFY
QA:PASS → RELEASE:PACKAGE+PUBLISH
QA:FAIL → RETURNTO:[Owner=Coder|Graphics]
QA:WAIVER → RELEASE:PACKAGE+PUBLISH (with expiry logged)
RELEASE:DONE → ARCHITECT:NEXT-TASK
```

**How to read:**
- `ROLE:STATE → NEXT-ROLE:ACTION`
- Every completion report MUST include routing directive
- No implicit handoffs - always explicit
- QA is always the gatekeeper (no direct Coder→Release or Graphics→Release)

---

## ⏱️ Operating Rhythm
**Phase A — Plan (Architect)**
- Output: Session Plan + Task Prompts
- Next: Copy the Coder task to the **Coder chat** and the visual task to **Graphics**

**Phase B — Build (Coder / Graphics in parallel)**
- Output: Completion Reports (logic + visuals)

**Phase C — Verify (QA)**
- Input: both reports + onboarding criteria
- Output: **QA Decision Note**

**Phase D — Ship (Automation/Release)**
- Input: QA: PASS, build artifacts
- Output: Version, release notes, deployment, status update

---

## 📨 Paste‑This Blocks (Copy-Ready)

Below are five complete templates for every handoff in the pipeline. Copy these verbatim, fill in bracketed placeholders, and paste into the next role's chat.

---

### **Block A: Architect → Coder**
```markdown
# CODER TASK: [System/Feature Name]

## Context
- Session: [Session #]
- Dependencies: [List any systems this relies on, or "None"]
- Onboarding reference: [Section from CODER_ONBOARDING.md]

## Requirements
[Bullet list of what this system must do]

## Acceptance Criteria
- [ ] [Criterion 1 - e.g., "100% tests pass"]
- [ ] [Criterion 2 - e.g., "0 TypeScript errors"]
- [ ] [Criterion 3 - e.g., "Determinism verified with seed X"]

## Deliverables
1. Implementation code in `src/systems/[name]`
2. Test suite in `src/systems/[name].test.ts`
3. Completion Report (see CODER_ONBOARDING.md template)

## Success Metrics
- Tests: [N] new tests, 100% pass
- Performance: P95 < 16.666ms
- Build: No errors, no circular deps

## Routing
**On completion:** CODER:COMPLETION → QA:VERIFY
```

---

### **Block B: Architect → Graphics**
```markdown
# GRAPHICS TASK: [Screen/Feature Name]

## Context
- Session: [Session #]
- Phase: [1 - Mockup Only | 2 - Integration & Polish]
- Story reference: [Link to Story Bible / Mockup Script section]

## Requirements
[Bullet list of visual changes needed]

## Sprite Sources
- Registry path: [e.g., `/public/sprites/`]
- Missing assets: [List or "None"]
- Namepack: [Link to namepack JSON]

## Acceptance Criteria
- [ ] [e.g., "HTML mockup with all screens"]
- [ ] [e.g., "sprite_placements.json provided"]
- [ ] [e.g., "WCAG 2.1 AA contrast verified"]
- [ ] [e.g., "Screenshots: before/after"]

## Deliverables
1. `/mockups/[name].html` + `/mockups/[name].css` (Phase 1)
2. `sprite_placements.json` manifest
3. Screenshots (before/after)
4. Completion Report

## Quality Gates
- Accessibility: Keyboard nav, focus rings, aria-live, 4.5:1 text contrast
- Motion: prefers-reduced-motion respected
- Performance: 30+ FPS visual evidence

## Routing
**On completion:** GRAPHICS:COMPLETION → QA:VERIFY
```

---

### **Block C: Coder/Graphics → QA**
```markdown
# QA VERIFICATION REQUEST: [Feature Name]

## Scope
- Owner: [Coder | Graphics]
- Session: [Session #]
- Task reference: [Link to original task prompt]

## Artifacts
- Build link: [e.g., `http://localhost:3000` or CI artifact URL]
- Screenshots: [Links or attachments]
- Test results: [Summary or link to test output]
- Code changes: [PR link or commit hash]

## Self-Check Results
**Logic (if Coder):**
- ✅ Tests: [X]/[Y] passing (100%)
- ✅ TypeScript: 0 errors
- ✅ Circular deps: 0
- ✅ Build: Success
- ✅ Determinism: [Verified with seed X | N/A]
- ✅ Performance: P95 [X.XXX]ms (< 16.666ms target)

**Visual (if Graphics):**
- ✅ Assets: 0 missing / 404s
- ✅ FPS: [30+] (provide video evidence)
- ✅ Aesthetic: [Matches Golden Sun / target style]
- ✅ Accessibility: WCAG 2.1 AA spot checks passed
- ✅ Screenshots: [Before/after links]
- ✅ Motion: prefers-reduced-motion respected

## What to Verify
[Bullet list of specific acceptance criteria from original task]

## Expected Outcome
**PASS** → Route to RELEASE:PACKAGE+PUBLISH
**FAIL** → Route back to [Coder|Graphics] with defect IDs
**WAIVER** → Approve with time-boxed rationale

## Routing
**Current state:** [CODER|GRAPHICS]:COMPLETION → QA:VERIFY
```

---

### **Block D: QA → Automation/Release**
```markdown
# RELEASE REQUEST: [Feature/Version]

## QA Decision
**DECISION:** PASS

## Evidence Summary
**Tests:** [X]/[Y] passing (100%)
**TypeScript:** 0 errors
**Circular deps:** 0
**Build:** Success
**Determinism:** [Verified | N/A]
**Performance:** P95 [X.XXX]ms (✅ < 16.666ms)
**Accessibility:** WCAG 2.1 AA verified
**Visuals:** [Screenshot links] | FPS: [30+] | 404s: 0
**Licensing:** [All assets approved | Flagged items: None]

## Artifacts
- Build: [Link or path]
- Test results: [Link]
- Screenshots: [Links]
- Code changes: [PR/commit]

## Suggested Version
[MAJOR.MINOR.PATCH] - [e.g., "1.2.0 - Added Battle System"]

## Release Notes (Draft)
```markdown
### Added
- [Feature 1]
- [Feature 2]

### Changed
- [Change 1]

### Fixed
- [Fix 1]
```

## Routing
**Current state:** QA:PASS → RELEASE:PACKAGE+PUBLISH
```

---

### **Block E: Automation/Release → Architect**
```markdown
# RELEASE COMPLETE: v[X.Y.Z]

## Deployment Summary
**Version:** [X.Y.Z]
**Released:** [YYYY-MM-DD HH:MM UTC]
**Status:** ✅ Live

## Links
- **Live build:** [URL or path]
- **Release notes:** [Link to RELEASES.md or tag]
- **Build artifacts:** [Link to CI/deployment]
- **Git tag:** `v[X.Y.Z]`

## Quality Snapshot
- Tests: [X]/[Y] passing (100%)
- TypeScript: 0 errors
- Build size: [X.XX MB]
- Performance: P95 [X.XXX]ms

## Routing
**Current state:** RELEASE:DONE → ARCHITECT:NEXT-TASK

## Suggested Next Tasks
1. [Task 1 - e.g., "Integrate Ability System (Session 4)"]
2. [Task 2 - e.g., "Polish Battle Animations"]
3. [Task 3 - e.g., "Add Save/Load System"]

**Ready for next session planning.**
```

---

**Usage Notes:**
- Always include routing directive at the end
- Fill ALL bracketed placeholders before sending
- QA is mandatory gatekeeper (no Coder/Graphics → Release direct)
- Every handoff must be explicit (no assumptions)

---

## 🧭 Routing Rules
- If any quality gate fails → route back to the owner with the failing evidence.
- If scope changes mid‑session → stop and return to Architect.
- If assets are missing → hold Graphics task; ping Architect.
- If determinism breaks → hold release; route to Coder with failing seed log.

---

## 🧯 Escalation
- **Blocking external dependency** → mark **BLOCKED**, notify Architect.
- **Long‑running task** → split into two prompts (System Creation + Integration).
- **Visual regressions** → rollback to prior release and re‑queue Graphics.

---

## 🏁 Definition of Done (per session)
- Architect closes session goals
- QA: PASS
- Automation/Release: version tagged and published
- Next session plan stubbed
