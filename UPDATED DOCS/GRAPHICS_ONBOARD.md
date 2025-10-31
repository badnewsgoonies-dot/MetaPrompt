
# 🎨 GRAPHICS_ONBOARD.md (Official)

**Role Purpose**  
Deliver two phases: (1) **HTML/CSS mockup** (no game code) to lock composition and copy; (2) integrate sprites and polish UI once Coder has systems. Mockup is a **blueprint**, not an implementation.

---

## 📥 Inputs
- Story Bible + Mockup Script + Namepack.  
- Sprite registry or asset folder root.  
- Accessibility notes.

## 📤 Outputs
- `/mockups/*.html` + `/mockups/*.css` (phase 1)  
- Sprite placements manifest: `/mockups/sprite_placements.json`  
- Polished React/CSS changes (phase 2, post‑approval)

---

## 🎯 Phase 1 — Mockup‑Only Protocol
- **Stack:** Plain HTML + CSS. No JS, no React, no game logic.  
- **Goal:** Show exact layout, sizes, positions, copy, and interaction states.  
- **Artifacts:** 1 HTML + 1 CSS per screen + a `sprite_placements.json` with IDs and positions.

### Starter Structure
```html
<!-- /mockups/battle.html -->
<main class="battle" aria-label="Battle Screen">
  <div class="bg" data-bg="forest-01"></div>

  <section class="row enemies" aria-label="Enemy Team">
    <figure class="sprite" data-slot="e1" data-sprite="enemy:bandit" aria-label="Bandit"></figure>
    <figure class="sprite" data-slot="e2" data-sprite="enemy:mage" aria-label="Mage"></figure>
    <figure class="sprite" data-slot="e3" data-sprite="enemy:elemental_fire" aria-label="Fire Elemental"></figure>
  </section>

  <section class="row allies" aria-label="Allied Team">
    <figure class="sprite" data-slot="a1" data-sprite="ally:isaac"></figure>
    <figure class="sprite" data-slot="a2" data-sprite="ally:mia"></figure>
    <figure class="sprite" data-slot="a3" data-sprite="ally:garet"></figure>
  </section>

  <div class="log" role="log" aria-live="polite">Isaac strikes Bandit for 25!</div>
  <nav class="actions" aria-label="Actions">
    <button>Attack</button><button>Defend</button><button>Item</button><button>Flee</button>
  </nav>
</main>
```

```css
/* /mockups/battle.css */
:root{ --w:1280px; --h:720px; }
.battle{ width:var(--w); height:var(--h); position:relative; overflow:hidden; }
.bg{ position:absolute; inset:0; background:#0b1130; }
.row{ position:absolute; left:0; right:0; display:flex; justify-content:center; gap:48px; }
.enemies{ top:8%; }
.allies{ bottom:12%; }
.sprite{ width:128px; height:128px; background:rgba(255,255,255,.08); outline:2px solid rgba(255,255,255,.15) }
.log{ position:absolute; left:6%; right:6%; top:46%; min-height:64px; background:rgba(0,0,0,.35); padding:12px; color:#fff }
.actions{ position:absolute; left:6%; right:6%; bottom:4%; display:flex; gap:12px; }
.actions button{ padding:10px 16px; font-weight:700; }
@media (prefers-reduced-motion: reduce){ *{ animation:none !important; transition:none !important; } }
```

### `sprite_placements.json` (example)
```json
{
  "screen": "battle",
  "bg": "forest-01",
  "placements": [
    {"slot":"e1","sprite":"enemy:bandit","x":"center-200","y":"10%","scale":1.0,"z":3},
    {"slot":"e2","sprite":"enemy:mage","x":"center","y":"10%","scale":1.0,"z":3},
    {"slot":"e3","sprite":"enemy:elemental_fire","x":"center+200","y":"10%","scale":1.2,"z":3},
    {"slot":"a1","sprite":"ally:isaac","x":"center-220","y":"88%","scale":1.0,"z":2},
    {"slot":"a2","sprite":"ally:mia","x":"center","y":"88%","scale":1.0,"z":2},
    {"slot":"a3","sprite":"ally:garet","x":"center+220","y":"88%","scale":1.0,"z":2}
  ]
}
```

**Accessibility:** Ensure labels, role=log, focus states, 4.5:1 contrast for text.

---

## ✅ Phase 1 Gate: MOCKUP_APPROVED.md

**Before proceeding to Phase 2**, Graphics must produce a `MOCKUP_APPROVED.md` artifact and get explicit approval from Architect.

### MOCKUP_APPROVED.md Template
```markdown
# MOCKUP APPROVAL REQUEST

## Screens Delivered
- [ ] [Screen 1 - e.g., "battle.html"]
- [ ] [Screen 2 - e.g., "menu.html"]
- [ ] [Screen 3 - e.g., "reward.html"]

## Artifacts
- **Mockup files:** `/mockups/[name].html` + `/mockups/[name].css`
- **Sprite manifest:** `/mockups/sprite_placements.json`
- **Screenshots:** [Links or attachments]

## Checklist (All MUST pass before Phase 2)
- [ ] **Layout matches Story Bible / Mockup Script** (all elements present)
- [ ] **All copy is final** (no placeholders like "Lorem Ipsum")
- [ ] **Sprite slots identified** (data-sprite attributes in HTML)
- [ ] **Accessibility verified:**
  - [ ] Keyboard navigation works (tab order logical)
  - [ ] Focus rings visible (outline: 3px solid)
  - [ ] ARIA labels present (role="log", aria-live, aria-label)
  - [ ] Text contrast ≥ 4.5:1 (WCAG 2.1 AA)
  - [ ] UI element contrast ≥ 3:1
- [ ] **Motion support:** prefers-reduced-motion media query present
- [ ] **No JavaScript** in mockup files (HTML + CSS only)
- [ ] **Design tokens documented** (CSS variables in `:root`)

## Screenshots
[Paste or link screenshots of each screen here]

## Known Issues / Deviations
[List any deviations from Mockup Script or missing assets - or write "None"]

## Approval Request
**Graphics → Architect:** Please review mockups and approve for Phase 2 integration.

**Routing:** GRAPHICS:MOCKUP-COMPLETE → ARCHITECT:REVIEW
**Next step on approval:** ARCHITECT:APPROVED → GRAPHICS:PHASE-2
```

**Why This Gate?**
- Prevents rework: Once Coder starts integrating, changing layout is expensive
- Ensures copy is final: No "fix text later" surprises
- Locks visual contract: Architect and Graphics agree on what "done" looks like
- **80-90% success rate** when mockup is approved before React integration vs. 30-40% when skipped

---

## 🎯 Phase 2 — Integration & Polish (post‑Coder and post-approval)
- Port approved layout into components.  
- Hook sprite registry; **no changes to core logic**.  
- Add animations (idle 2–4 FPS, attack 8–12 FPS, hurt 6–8 FPS).  
- Respect `prefers-reduced-motion` and avoid long flashes.

---

## 🙅 Don’t
- Ship JS in mockup phase.  
- Modify `src/systems/**`.  
- Introduce motion beyond 300ms heavy shake or 20px amplitude without approval.

---

## 📓 Role Intake (Quick Form)
- Which screens to mock first?  
- Sprite root path(s)? Any missing assets?  
- Copy source of truth (Story Bible / Namepack)?  
- Accessibility constraints?  
- Visual rating goal (0–10)? Target is ≥9.
