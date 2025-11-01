# GRAPHICS TASK PLAYBOOK — GOLDEN SUN BATTLE MIGRATION

**Status:** Complete  
**Author:** Architect Role (MetaPrompt system)  
**Last Updated:** 2025-11-01 16:32 UTC

---

## Overview
- **Total Tasks:** 10
- **Estimated Duration:** 8–12 hours
- **Primary References:**
  - `CODEBASE_ANALYSIS.md`
  - `BATTLE_INTEGRATION_ARCHITECTURE.md`
  - `graphics-decisions-reference.md`
  - `pattern-library.md`

Graphics role focuses on presentational React components, animation timing, accessibility, and sprite integration. Logic wiring remains the Coder's responsibility.

---

### GRAPHICS-01 — Copy & Register Battle Assets
**Status:** ☐ Not Started  
**Estimate:** 1 h  
**Dependencies:** None

**Description:**
Copy sprite/animation assets from NextEraGame into the Golden Sun project and create a centralized registry.

**Steps:**
1. Copy `/workspace/nexteragame/public/sprites` → `golden-sun/public/sprites/battle`.
2. Copy `/workspace/nexteragame/public/psynergy` → `golden-sun/public/psynergy`.
3. Generate `golden-sun/src/data/battleSpriteRegistry.ts` enumerating all sprite sheets.
4. Verify asset counts (≥2,500 sprites, 19 animations) and update README if necessary.

**Acceptance Criteria:**
- [ ] No missing asset warnings when running `npm run dev`.
- [ ] Registry exports typed constants accessible to UI components.
- [ ] Sprite file paths align with mockup references.

---

### GRAPHICS-02 — Establish Battle Component Skeleton
**Status:** ☐ Not Started  
**Estimate:** 1 h  
**Dependencies:** GRAPHICS-01

**Description:**
Create directory structure and placeholder exports for battle UI components so downstream tasks can fill them in incrementally.

**Files to Create:**
- `golden-sun/src/components/battle/` (directory)
- Placeholder components: `BattleLayout.tsx`, `BattleBackground.tsx`, `BattleOverlay.tsx`, `TurnBanner.tsx`
- Barrel file `index.ts`

**Acceptance Criteria:**
- [ ] Components render minimal markup with TODO comments referencing future tasks.
- [ ] Type props align with interfaces defined in `TYPE_INTEGRATION_STRATEGY.md` (e.g., `BattleEvent`).

---

### GRAPHICS-03 — Port Core Battle Components
**Status:** ☐ Not Started  
**Estimate:** 2 h  
**Dependencies:** GRAPHICS-02, CODER-09 (hook API available)

**Description:**
Migrate layout-critical components from NextEraGame: unit slots, action menus, targeting UI.

**Files to Create/Modify:**
- `BattleUnitSlot.tsx`
- `ActionMenu.tsx`
- `TargetSelector.tsx`
- `TurnOrderTracker.tsx`

**Steps:**
1. Copy JSX structure from NextEraGame, adjusting styling tokens to Golden Sun CSS variables.
2. Replace ability terminology with Psynergy.
3. Use `BattleEvent` stream to highlight active units.
4. Add keyboard navigation parity with overworld input scheme.

**Acceptance Criteria:**
- [ ] Components responsive at 1280×720 & 1920×1080.
- [ ] Keyboard/gamepad navigation works (leveraging existing input mapping).
- [ ] Unit slot renders HP/PP bars, status icons, Djinn indicators.

---

### GRAPHICS-04 — Implement Combat Feedback Effects
**Status:** ☐ Not Started  
**Estimate:** 1.5 h  
**Dependencies:** GRAPHICS-03

**Description:**
Port damage/heal number overlays, hit flashes, and combo badges.

**Files to Create:**
- `DamageNumber.tsx`
- `HealNumber.tsx`
- `ComboBadge.tsx`
- `css/battle-effects.css`

**Acceptance Criteria:**
- [ ] Animations use NextEraGame timing constants (documented in `graphics-decisions-reference.md`).
- [ ] Supports stacking (multiple numbers concurrently).
- [ ] Accessible alternative text for screen readers (aria-live region).

---

### GRAPHICS-05 — Port Psynergy & Djinn Animations
**Status:** ☐ Not Started  
**Estimate:** 1 h  
**Dependencies:** GRAPHICS-01, GRAPHICS-03

**Description:**
Implement sprite-sheet based animation wrappers for psynergy spells and Djinn summons.

**Files to Create:**
- `PsynergyAnimation.tsx`
- `DjinnSummonAnimation.tsx`
- `hooks/useSpriteAnimation.ts`

**Acceptance Criteria:**
- [ ] Animations triggered via `BattleEvent` stream.
- [ ] Supports both looped (buff auras) and finite (attacks) sequences.
- [ ] 60 FPS playback on modern browsers (measure via requestAnimationFrame timestamps).

---

### GRAPHICS-06 — Build Status & HUD Widgets
**Status:** ☐ Not Started  
**Estimate:** 1 h  
**Dependencies:** GRAPHICS-03

**Description:**
Create HP/PP bars, status effect badges, Djinn charge indicators, and battle log panel.

**Files to Create:**
- `HpBar.tsx`
- `PpBar.tsx`
- `StatusBadge.tsx`
- `DjinnIndicator.tsx`
- `BattleLog.tsx`

**Acceptance Criteria:**
- [ ] Components accept data via props; no internal state aside from animations.
- [ ] Color palette matches `graphics-decisions-reference.md` (Venus green, Mars red, etc.).
- [ ] WCAG 2.1 AA contrast verified for text and bars (≥4.5:1).

---

### GRAPHICS-07 — Compose BattleScreen Layout
**Status:** ☐ Not Started  
**Estimate:** 2 h  
**Dependencies:** GRAPHICS-02 through GRAPHICS-06, CODER-14

**Description:**
Assemble all components into `BattleScreen.tsx` using controller props provided by Coder role.

**Steps:**
1. Import controller hook from `BattleScreen.controller.ts`.
2. Arrange layout: top (enemy slots), middle (background + animations), bottom (menus/logs).
3. Ensure transitions triggered by controller (phase changes) update UI correctly.
4. Provide fallback loader for asset prefetch.

**Acceptance Criteria:**
- [ ] Layout matches NextEraGame parity with Golden Sun styling tweaks.
- [ ] Screen adapts to 16:9 and 4:3 letterboxing gracefully.
- [ ] No console warnings when toggling between battle phases.

---

### GRAPHICS-08 — Integrate Visual Effect Hooks
**Status:** ☐ Not Started  
**Estimate:** 1 h  
**Dependencies:** GRAPHICS-04, CODER-09

**Description:**
Wire `useScreenShake`, `useFlashEffect`, and other presentation hooks to new battle components.

**Files to Create/Modify:**
- `hooks/useScreenShake.ts`
- `hooks/useFlashEffect.ts`
- Update `BattleLayout.tsx` to consume hooks.

**Acceptance Criteria:**
- [ ] Shake/flash intensity matches NextEraGame constants (5/10/20 px, 300ms).
- [ ] Effects triggered via `BattleEvent` payloads.
- [ ] Tests or storybook demos verifying multiple concurrent effects do not conflict.

---

### GRAPHICS-09 — Polish & Accessibility Pass
**Status:** ☐ Not Started  
**Estimate:** 1 h  
**Dependencies:** GRAPHICS-07, GRAPHICS-08

**Description:**
Finalize styling, typography, and accessibility features across battle UI.

**Steps:**
1. Audit with axe-core or similar to ensure WCAG 2.1 AA compliance.
2. Ensure keyboard focus rings visible on actionable elements.
3. Add localization-ready strings (wrap text in i18n helpers if present).
4. Document style tokens in `graphics-decisions-reference.md` if adjustments made.

**Acceptance Criteria:**
- [ ] No accessibility violations in automated scan.
- [ ] Focus order mirrors controller navigation order.
- [ ] Fonts and colors align with Golden Sun brand guidelines.

---

### GRAPHICS-10 — Implement Battle Transition Animations
**Status:** ☐ Not Started  
**Estimate:** 1 h  
**Dependencies:** GRAPHICS-07, CODER-11

**Description:**
Design fade-in/out overlays, swirling energy effects, and victory/defeat banners used during transitions.

**Files to Create:**
- `BattleTransitionOverlay.tsx` (collaborate with Coder to reuse component)
- `css/battle-transitions.css`
- Sprite-based energy effect assets as needed.

**Acceptance Criteria:**
- [ ] Entry transition (swirl + fade) ≤ 400ms, exit ≤ 400ms.
- [ ] Works seamlessly with `transitionManager` callbacks.
- [ ] Accessibility: provide reduced-motion variant honoring `prefers-reduced-motion` media query.

---

## Collaboration Notes
- Coordinate with Coder after CODER-09 to validate hook APIs and event payloads.
- Provide screenshots or GIF captures after GRAPHICS-07 and GRAPHICS-10 for QA.
- Escalate any asset gaps to Architect via `ARCHITECTURAL_DECISIONS.md`.

