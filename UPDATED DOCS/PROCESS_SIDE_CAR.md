
# 🔄 PROCESS_SIDE_CAR.md — Four‑Role Pipeline

This is the operational doc that sits **beside** all role questionnaires. It defines who starts, who hands off, and the stop/go gates.

---

## 🧭 Order of Operations
1) **Story Director** produces: Story Bible → Encounter Palette → Mockup Script → Namepack → Accessibility notes.  
2) **Graphics (Phase 1)** composes **HTML/CSS mockup(s)** from the script; exports sprite placements JSON.  
3) **Architect** locks scope with a session plan and creates **task prompts** for Coder & Graphics (phase 2).  
4) **Coder** implements logic systems with tests and determinism.  
5) **Graphics (Phase 2)** integrates sprites, animations, and UI polish.  
6) **(Optional) QA Verifier** runs the definition‑of‑done battery and accessibility checks.  
7) **Ship** after all quality gates pass.

---

## ✅ Stop/Go Gates
- Gate A: Story artifacts approved → Graphics may mock.  
- Gate B: Mockup approved → Architect plans sprint.  
- Gate C: Coder report passes gates → Graphics integrates.  
- Gate D: Final visual pass + accessibility → Ship.

---

## 📨 Copy/Paste Contracts
- Architect → Coder/Graphics: **Full task card** (files, acceptance, time).  
- Coder/Graphics → Architect: **Completion report** (gates, diffs, screenshots).  
- No paraphrasing; copy exact templates.

---

## 🧪 Quality Gates (Global)
- Tests 100% passing, TS 0 errors, circular deps 0, build success.  
- AA contrast, keyboard nav, no console errors on key screens.  
- Determinism: same seed → same outcome for core systems.

---

## 🧩 Optional Extra Roles
- **QA/Verifier AI** — plays a scripted run, checks seed determinism, verifies a11y and logs; prepares a short “release note”.  
- **Automation/Release AI** — packages artifacts, updates changelog, pushes to hosting/CDN, and posts a summary to the team channel.

---

## 📦 Automation Sketch (Form → Doc → Build)
- **Form** captures the standard or three‑tier questionnaire.  
- **Generator** converts answers to an onboarding doc using the pattern library.  
- **Builder** calls the model API with the doc to produce source.  
- **Deliverer** returns a ZIP + live preview URL.

**Data Contract** (high level):
```json
{
  "questionnaire": { /* answers */ },
  "storyArtifacts": { "bible": "...", "palette": {...}, "mockupScript": "...", "namepack": {...} },
  "tasks": [ /* architect tasks */ ],
  "assets": { "spritesRoot": "/public/sprites" }
}
```

---

## 📝 Role Questionnaires (Mini Intakes)

### Story Director — Intake
- Genre, tone, rating?  
- Elements/statuses to feature?  
- Factions & 6–12 unit archetypes?  
- Three difficulty bands themes?  
- Copy voice (formal, adventurous, dry)?

### Architect — Intake
- Sprint goal?  
- Systems to change? Not in scope?  
- Acceptance demo scenario?  
- Risk hotspots (types, data migrations)?

### Coder — Intake
- Determinism contract (seed)?  
- New types/fields?  
- Test count target?  
- Known edge cases?  
- Performance budget (P95 frame)?

### Graphics — Intake
- Screens to mock first?  
- Sprite root & missing assets?  
- Contrast/motion constraints?  
- Target resolution and scale rules?
