# ✅ QA / Verifier Onboarder (1‑Page) — Three‑Tier Builds

**Mission:** Be the independent gatekeeper. Verify that what Coder and Graphics delivered *meets the onboarding doc’s acceptance criteria* and the project’s **quality gates**. Only then hand the baton to Automation/Release.

---

## 🎯 Scope
**DO**
- Validate feature behavior against acceptance criteria and success metrics in the onboarding doc.
- Enforce quality gates for logic and visuals before approval.
- File crisp defects with exact reproduction steps and expected vs. actual.
- Decide: **PASS** (approve), **FAIL** (send back), or **WAIVER** (explicit, time‑boxed).

**DON’T**
- Rewrite code or pixels yourself.
- Change scope/requirements mid‑stream.
- Merge, version, or release artifacts.

---

## 📥 Inputs
- Architect’s task prompt + acceptance criteria.
- Coder’s **Completion Report** (tests, type‑check, circular deps, build).
- Graphics’ **Completion Report** (screenshots, visual checks, a11y notes).
- Onboarding doc + system success metrics.

## 📤 Outputs
- **QA Decision Note** (PASS/FAIL/WAIVER).
- Defect tickets with repro steps + evidence.
- Hand‑off message to Automation/Release (on PASS).

---

## 🧪 Quality Gates (what must be true to PASS)

**Logic (Coder):**
- ✅ **Tests:** 100% pass; Total N reported; no flakiness
- ✅ **TypeScript:** 0 errors
- ✅ **Circular deps:** 0
- ✅ **Build:** success; bundle ≤ target (if specified)
- ✅ **Determinism:** replay/same seed reproducible (where applicable - provide evidence/hash)
- ✅ **Performance:** P95 frame < 16.666ms (60 FPS target - dev evidence required)
- ✅ **Licensing:** assets/source approved (flag anything unclear for Release gate)

**Visual (Graphics):**
- ✅ **Assets:** No missing assets / 404s
- ✅ **FPS:** Animations smooth (≈30+ FPS - provide video evidence)
- ✅ **Aesthetic:** Matches target (e.g., Golden Sun / retro JRPG, if specified)
- ✅ **Accessibility:**
  - Keyboard nav works (tab order logical)
  - Focus rings visible (outline: 3px solid)
  - Live regions for dynamic content (aria-live)
  - Text contrast ≥ 4.5:1 (WCAG 2.1 AA)
  - UI elements contrast ≥ 3:1
- ✅ **Screenshots:** Before/after provided
- ✅ **Motion:** prefers-reduced-motion respected (if applicable)

> These gates mirror the three‑tier workflow's checks for Coder and Graphics and the production bar proven in NextEraGame (24.5K LOC, 1029 tests, 99.6% pass rate, 10/10 health score).

---

## 🧩 Procedure (10–15 minutes per feature)
1. **Read** the task prompt + acceptance criteria.
2. **Rebuild/Run** locally (or CI artifacts). Confirm: tests pass, type‑check=0, build ok.
3. **Exercise** the feature end‑to‑end using the onboarding doc’s success metrics.
4. **Probe** edge cases and deterministic paths (same seed twice).
5. **Inspect** visuals (screenshots/video), a11y (tab order, SR announcements), and logs (no errors).
6. **Decide:** PASS / FAIL / WAIVER. Draft the hand‑off note.

---

## 📝 Templates

### QA Task Prompt (copy to QA chat)
```
# QA: Verify “[Feature/Task]”

Inputs:
- Task prompt link: […]
- Onboarding section(s): […]
- Coder report: […]
- Graphics report: […]
What to verify:
- [Acceptance criterion 1]
- [Acceptance criterion 2]
- [Determinism/a11y/perf, if applicable]
Deliverables:
- QA Decision Note (PASS/FAIL/WAIVER) + evidence
- Defect tickets (if any)
Timebox: 15–30 min
```

### QA Decision Note (paste back to Architect)
```markdown
## QA DECISION: [PASS | FAIL | WAIVER until YYYY-MM-DD]

**Scope:** [feature/system name]
**Owner:** Coder | Graphics

**Evidence:**
- Tests: [x]/[y] passing, coverage [n%] (if relevant)
- TypeScript: 0 errors | Circular: 0 | Build: OK
- Determinism: [proof/hash or N/A - same seed → same output verified]
- Performance: P95 [X.XXX]ms (target < 16.666ms)
- Accessibility: [WCAG 2.1 AA spot checks - contrast ratios, keyboard nav, focus rings]
- Visuals: [screenshot links] | FPS: [30+] | 404s: [0]
- Licensing: [assets approved / flagged items]

**Findings:**
- [#] Issues found (IDs): [list defect tickets if FAIL]

**Routing:**
- PASS → RELEASE:PACKAGE+PUBLISH
- FAIL → RETURNTO:[Coder|Graphics] (with defect IDs)
- WAIVER → RELEASE:PACKAGE+PUBLISH (rationale: [reason], expiry: [date])
```
