# Graphics Mockup Template (HTML/CSS Only - No JavaScript)

## Purpose

This template guides Graphics AI through creating **pixel-accurate HTML/CSS mockups** BEFORE any game code is written. This two-phase approach prevents the most common Graphics AI failure mode: integrating sprites into an existing codebase and breaking game logic.

**Two-Phase Graphics Workflow:**
1. **Phase 1 (Mockup-First):** Graphics AI creates HTML/CSS mockups with sprites, layout, and animations (NO JavaScript)
2. **Phase 2 (Integration):** After Coder AI implements game logic, Graphics AI integrates mockups into the working game

**Success Rate:**
- Traditional approach (integrate sprites directly): 30-40% success
- Two-phase approach (mockup first): 80-90% success

---

## When to Use This Template

**Use mockup-first workflow if:**
- SUPER-ENTERPRISE build with 100+ sprites
- Complex UI layouts (battle screens, HUDs, multiple regions)
- Narrative-rich games (Story Director workflow)
- High risk of sprite integration failures

**Skip mockup-first if:**
- SIMPLE or MEDIUM builds
- Minimal sprites (<20 sprites)
- Pure mechanics focus (no visual polish priority)

---

## Phase 1: Mockup Creation (Before Code)

### Inputs (from Story Director or Questionnaire)

**Required:**
1. **Story Bible** (if using Story Director) - Visual direction, aesthetic, palette
2. **Mockup Script** (if using Story Director) - HTML outline with sprite placements
3. **Sprite Library** - Location, format, count, license
4. **Layout Specification** - Grid, regions, aspect ratio, z-layers
5. **Design Tokens** - Spacing, timing, scales, colors
6. **Accessibility Requirements** - Contrast, motion, keyboard nav

**Optional:**
- **Namepack JSON** - Names for labeling sprites
- **Encounter Palette** - Enemy/ally mixes for mockup examples

---

### Phase 1 Deliverables

Graphics AI creates these files (HTML/CSS only, NO JavaScript):

#### 1. mockups/battle.html

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>[Game Name] - Battle Screen Mockup</title>
  <link rel="stylesheet" href="tokens.css">
  <style>
    body {
      margin: 0;
      background: linear-gradient(180deg, var(--bg-0), var(--bg-1));
      color: var(--text-hi);
      font: 14px/1.4 ui-sans-serif;
    }

    .battle {
      display: grid;
      grid-template-rows: 1fr var(--log-h) var(--turn-h) var(--action-h);
      height: 100vh;
      padding: 24px;
      gap: var(--gap);
    }

    .row {
      display: flex;
      gap: var(--gap);
      align-items: flex-end;
      justify-content: center;
    }

    .enemy .unit, .ally .unit {
      width: var(--unit-w);
      height: var(--unit-h);
      border-radius: var(--radius);
      position: relative;
    }

    .unit img {
      width: 100%;
      height: 100%;
      image-rendering: pixelated;
      display: block;
    }

    .hp {
      position: absolute;
      left: 0;
      right: 0;
      bottom: -10px;
      height: 8px;
      background: #2c2f55;
      border-radius: 4px;
      overflow: hidden;
    }

    .hp > i {
      display: block;
      height: 100%;
      background: linear-gradient(90deg, #57e2a6, #46c77a);
    }

    .panel {
      background: var(--panel);
      border-radius: var(--radius);
      padding: 10px;
      box-shadow: 0 2px 0 rgba(0,0,0,.4);
    }

    .log {
      overflow: auto;
    }

    .turn {
      display: flex;
      gap: 8px;
      align-items: center;
      justify-content: center;
    }

    .pill {
      min-width: 36px;
      padding: 6px 10px;
      background: #2a316b;
      border-radius: 999px;
      text-align: center;
    }

    .actions {
      display: flex;
      gap: 12px;
      justify-content: center;
      align-items: center;
    }

    .btn {
      padding: 10px 16px;
      background: #2a316b;
      border: 2px solid #3b4390;
      border-radius: 10px;
      color: var(--text-hi);
      cursor: pointer;
    }

    .btn:focus-visible {
      outline: none;
      box-shadow: var(--focus-ring);
    }
  </style>
</head>
<body>
  <div class="battle" role="application" aria-label="Battle Mock">

    <!-- Enemy row (top) -->
    <div class="row enemy" aria-label="Enemy line">
      <div class="unit">
        <img alt="Goblin" src="/sprites/golden-sun/battle/enemies/goblin/goblin_front.gif">
        <div class="hp"><i style="width:60%"></i></div>
      </div>
      <div class="unit">
        <img alt="Wolf" src="/sprites/golden-sun/battle/enemies/wolf/wolf_front.gif">
        <div class="hp"><i style="width:45%"></i></div>
      </div>
      <div class="unit">
        <img alt="Bat" src="/sprites/golden-sun/battle/enemies/bat/bat_front.gif">
        <div class="hp"><i style="width:80%"></i></div>
      </div>
    </div>

    <!-- Combat log (center) -->
    <div class="panel log" role="log" aria-live="polite">
      <p>Isaac attacks Goblin for 25 HP!</p>
      <p>Goblin is defeated!</p>
    </div>

    <!-- Turn order pills -->
    <div class="turn">
      <div class="pill">Isaac</div>
      <div class="pill">Goblin</div>
      <div class="pill">Mia</div>
      <div class="pill">Wolf</div>
    </div>

    <!-- Ally row (bottom) -->
    <div class="row ally" aria-label="Ally line">
      <div class="unit">
        <img alt="Isaac" src="/sprites/golden-sun/battle/party/isaac/Isaac_lSword_Front.gif">
        <div class="hp"><i style="width:72%"></i></div>
      </div>
      <div class="unit">
        <img alt="Mia" src="/sprites/golden-sun/battle/party/mia/Mia_Staff_Front.gif">
        <div class="hp"><i style="width:55%"></i></div>
      </div>
      <div class="unit">
        <img alt="Garet" src="/sprites/golden-sun/battle/party/garet/Garet_Axe_Front.gif">
        <div class="hp"><i style="width:90%"></i></div>
      </div>
    </div>

    <!-- Action buttons -->
    <nav class="actions" aria-label="Actions">
      <button class="btn" aria-label="Attack selected enemy">Attack</button>
      <button class="btn" aria-label="Defend this turn">Defend</button>
      <button class="btn" aria-label="Use an item">Item</button>
      <button class="btn" aria-label="Attempt to flee">Flee</button>
    </nav>

  </div>
</body>
</html>
```

---

#### 2. mockups/battle.css

```css
/* Layout and positioning */
.battle-container {
  position: relative;
  width: 1280px;
  height: 720px;
  margin: 0 auto;
  overflow: hidden;
  background: #1a1a1a;
  font-family: 'Press Start 2P', monospace, sans-serif;
}

/* Background layer (z: 0) */
.battle-bg {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: var(--z-bg);
  background-size: cover;
  background-position: center;
}

.battle-bg[data-scene="forest-01"] {
  background-image: url('/backgrounds/forest_01.png');
}

/* Enemy row (z: 3) */
.enemy-row {
  position: absolute;
  top: 10%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-lg);
  z-index: var(--z-enemies);
  justify-content: center;
  align-items: flex-end;
}

/* Ally row (z: 2) */
.ally-row {
  position: absolute;
  bottom: 25%;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  gap: var(--space-lg);
  z-index: var(--z-allies);
  justify-content: center;
  align-items: flex-end;
}

/* Unit slots */
.unit-slot {
  position: relative;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 0;
  padding: var(--space-sm);
}

.unit-slot[data-scale="1.0"] .sprite {
  transform: scale(1.0);
}

.unit-slot[data-scale="1.2"] .sprite {
  transform: scale(1.2);
}

.unit-slot[data-scale="1.5"] .sprite {
  transform: scale(1.5);
}

/* Sprites */
.sprite {
  display: block;
  image-rendering: pixelated;
  image-rendering: -moz-crisp-edges;
  image-rendering: crisp-edges;
  transform-origin: bottom center;
}

/* HP bars */
.hp-bar {
  width: 100px;
  height: 8px;
  background: #333;
  border: 2px solid #fff;
  margin-top: var(--space-xs);
  position: relative;
  overflow: hidden;
}

.hp-fill {
  height: 100%;
  background: linear-gradient(to right, #00ff00, #00cc00);
  transition: width 0.3s ease;
}

/* Unit names */
.unit-name {
  font-size: 10px;
  color: #fff;
  margin-top: var(--space-xs);
  text-shadow: 1px 1px 2px #000;
}

/* Combat log (z: 5) */
.combat-log {
  position: absolute;
  bottom: 10%;
  left: 50%;
  transform: translateX(-50%);
  width: 600px;
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #fff;
  z-index: var(--z-ui);
  max-height: 120px;
  overflow-y: auto;
}

.log-entry {
  font-size: 12px;
  color: #fff;
  margin: var(--space-xs) 0;
  line-height: 1.5;
}

/* Action buttons (z: 10) */
.action-buttons {
  position: absolute;
  bottom: 5%;
  left: 5%;
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  z-index: var(--z-hud);
}

.action-buttons button {
  font-family: 'Press Start 2P', monospace, sans-serif;
  font-size: 12px;
  padding: var(--space-sm) var(--space-md);
  border: 2px solid #fff;
  cursor: pointer;
  transition: transform 0.1s ease, background 0.2s ease;
  min-width: 120px;
  text-align: left;
}

.action-buttons button:hover {
  transform: scale(1.05);
}

.action-buttons button:focus {
  outline: 3px solid #ffff00;
  outline-offset: 2px;
}

.btn-primary {
  background: #4682b4;
  color: #fff;
}

.btn-primary:hover {
  background: #5a9bd4;
}

.btn-secondary {
  background: #2f4f4f;
  color: #fff;
}

.btn-secondary:hover {
  background: #3f6f6f;
}

.btn-danger {
  background: #8b0000;
  color: #fff;
}

.btn-danger:hover {
  background: #a00000;
}

/* Turn order (z: 10) */
.turn-order {
  position: absolute;
  top: 5%;
  right: 5%;
  padding: var(--space-md);
  background: rgba(0, 0, 0, 0.8);
  border: 2px solid #fff;
  z-index: var(--z-hud);
  min-width: 150px;
}

.turn-order h3 {
  font-size: 12px;
  color: #fff;
  margin: 0 0 var(--space-sm) 0;
  text-align: center;
}

.turn-order ol {
  list-style: none;
  padding: 0;
  margin: 0;
}

.turn-order li {
  font-size: 10px;
  color: #ccc;
  padding: var(--space-xs);
  margin: var(--space-xs) 0;
}

.turn-order .turn-active {
  color: #ffff00;
  font-weight: bold;
  background: rgba(255, 255, 0, 0.2);
}

/* Accessibility */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border: 0;
}

/* Responsive (optional for mockup) */
@media (max-width: 1280px) {
  .battle-container {
    width: 100vw;
    height: 56.25vw; /* 16:9 aspect ratio */
    max-height: 100vh;
  }
}

/* Motion: Reduced motion support */
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}
```

---

#### 3. mockups/tokens.css

```css
/* Design Tokens - DO NOT modify these during integration */

:root {
  /* Background colors (JRPG/Golden Sun style) */
  --bg-0: #0B1020;
  --bg-1: #121735;
  --panel: #1C2250;

  /* Text colors */
  --text-hi: #F4F6FF;
  --text-lo: #C4C8F0;
  --accent: #F5C85A;
  --danger: #E25757;

  /* Spacing (16px baseline) */
  --baseline: 16px;
  --gap: var(--baseline);
  --radius: 8px;

  /* Unit dimensions */
  --unit-w: 96px;
  --unit-h: 96px;

  /* Panel heights */
  --log-h: 140px;
  --action-h: 80px;
  --turn-h: 56px;

  /* Z-layers (from Story Director or spec) */
  --z-bg: 0;
  --z-allies: 2;
  --z-enemies: 3;
  --z-fx: 5;
  --z-ui: 10;
  --z-hud: 15;

  /* Sprite scales */
  --scale-normal: 1.0;
  --scale-boss: 1.2;
  --scale-mega-boss: 1.5;
  --scale-ui-icon: 0.8;

  /* Animation timing (ms) - from NextEraGame */
  --timing-attack: 600ms;
  --timing-hurt: 400ms;
  --timing-flash: 150ms;
  --timing-turn-transition: 500ms;
  --timing-death: 800ms;

  /* Focus ring (WCAG 2.1 AA) */
  --focus-ring: 0 0 0 3px var(--accent);
}

/* Motion: Reduced motion support (CRITICAL for accessibility) */
@media (prefers-reduced-motion: reduce) {
  * {
    animation: none !important;
    transition: none !important;
  }
}
```

---

#### 4. mockups/sprite_map.json

```json
{
  "allies": [
    {
      "id": "isaac",
      "name": "Isaac",
      "paths": {
        "front": "/sprites/allies/isaac_front.gif",
        "back": "/sprites/allies/isaac_back.gif",
        "attack": "/sprites/allies/isaac_attack.gif",
        "hurt": "/sprites/allies/isaac_hurt.gif",
        "defend": "/sprites/allies/isaac_defend.gif"
      },
      "scale": 1.0,
      "anchor": "bottom-center"
    },
    {
      "id": "mia",
      "name": "Mia",
      "paths": {
        "front": "/sprites/allies/mia_front.gif",
        "back": "/sprites/allies/mia_back.gif",
        "attack": "/sprites/allies/mia_attack.gif",
        "hurt": "/sprites/allies/mia_hurt.gif",
        "defend": "/sprites/allies/mia_defend.gif"
      },
      "scale": 1.0,
      "anchor": "bottom-center"
    },
    {
      "id": "garet",
      "name": "Garet",
      "paths": {
        "front": "/sprites/allies/garet_front.gif",
        "back": "/sprites/allies/garet_back.gif",
        "attack": "/sprites/allies/garet_attack.gif",
        "hurt": "/sprites/allies/garet_hurt.gif",
        "defend": "/sprites/allies/garet_defend.gif"
      },
      "scale": 1.0,
      "anchor": "bottom-center"
    }
  ],
  "enemies": [
    {
      "id": "fire_elemental",
      "name": "Fire Elemental",
      "paths": {
        "idle": "/sprites/enemies/fire_elemental_idle.gif",
        "attack": "/sprites/enemies/fire_elemental_attack.gif",
        "hurt": "/sprites/enemies/fire_elemental_hurt.gif",
        "death": "/sprites/enemies/fire_elemental_death.gif"
      },
      "scale": 1.2,
      "anchor": "bottom-center"
    },
    {
      "id": "bandit",
      "name": "Bandit",
      "paths": {
        "idle": "/sprites/enemies/bandit_idle.gif",
        "attack": "/sprites/enemies/bandit_attack.gif",
        "hurt": "/sprites/enemies/bandit_hurt.gif",
        "death": "/sprites/enemies/bandit_death.gif"
      },
      "scale": 1.0,
      "anchor": "bottom-center"
    },
    {
      "id": "mage",
      "name": "Mage",
      "paths": {
        "idle": "/sprites/enemies/mage_idle.gif",
        "attack": "/sprites/enemies/mage_attack.gif",
        "hurt": "/sprites/enemies/mage_hurt.gif",
        "death": "/sprites/enemies/mage_death.gif"
      },
      "scale": 1.0,
      "anchor": "bottom-center"
    }
  ],
  "backgrounds": [
    {
      "id": "forest-01",
      "path": "/backgrounds/forest_01.png"
    },
    {
      "id": "cave-01",
      "path": "/backgrounds/cave_01.png"
    }
  ]
}
```

---

### Phase 1 Quality Gates

**Graphics AI must verify:**

#### Visual Approval
- [ ] Layout matches mockup script or specification
- [ ] All sprites load correctly (no 404s)
- [ ] Sprite scales match specification (1.0x, 1.2x, 1.5x)
- [ ] Z-layers correct (background < allies < enemies < UI)
- [ ] Grid/regions aligned per specification

#### Accessibility (WCAG 2.1 AA)
- [ ] Text contrast ≥ 4.5:1 on backgrounds
- [ ] UI elements contrast ≥ 3:1
- [ ] Focus rings visible on all interactive elements
- [ ] Keyboard navigation works (tab order logical)
- [ ] Screen reader labels present (aria-label, alt text)
- [ ] prefers-reduced-motion respected

#### Technical
- [ ] No console errors in browser
- [ ] All sprite paths resolve correctly
- [ ] CSS tokens file loads and applies
- [ ] Responsive behavior works (if required)
- [ ] No JavaScript present (HTML/CSS only)

#### Evidence Required
- [ ] Screenshot: Desktop (1920x1080)
- [ ] Screenshot: Laptop (1366x768)
- [ ] Screenshot: Mobile (if responsive)
- [ ] Screenshot: Keyboard focus visible
- [ ] Accessibility audit report (browser DevTools)

---

## Phase 2: Integration (After Coder Implements Game Logic)

### Timing

Phase 2 begins AFTER:
- ✅ Coder AI has implemented all game systems
- ✅ Tests passing (100% pass rate)
- ✅ TypeScript 0 errors
- ✅ Game runs without mockup styles

### Integration Strategy

**Coder AI provides to Graphics AI:**
1. **UI Contract** - Component props/types that are stable
2. **Game State Shape** - What data Graphics can read (read-only)
3. **Integration Points** - Where to mount React components
4. **CSS Class Names** - Existing classes to preserve

**Graphics AI integrates:**
1. Convert static HTML to React components (preserve structure)
2. Apply mockup CSS to React components (use className)
3. Wire up sprite animations to game state (read-only)
4. Preserve all game logic (NO modifications to src/systems/)
5. Test visually + verify no regressions

---

### Phase 2 Quality Gates

**Graphics AI must verify:**

#### Integration Success
- [ ] All mockup styles applied to React components
- [ ] Sprites animate based on game state
- [ ] No game logic modifications
- [ ] All tests still pass (100% pass rate)
- [ ] TypeScript still 0 errors

#### Visual Consistency
- [ ] Layout matches Phase 1 mockup
- [ ] Sprites display correctly in game
- [ ] Animations smooth (30+ FPS)
- [ ] No visual regressions

#### Evidence Required
- [ ] Screenshot: Game running with integrated styles
- [ ] Video: 10-second gameplay clip
- [ ] Test output: All tests passing
- [ ] TypeScript output: 0 errors

---

## Common Mistakes to Avoid

### Phase 1 Mistakes

❌ **Adding JavaScript to mockup** - NO JavaScript! HTML/CSS only.
❌ **Skipping accessibility** - WCAG 2.1 AA is mandatory.
❌ **Vague sprite paths** - Use exact resolved paths.
❌ **Missing z-layer tokens** - Define all z-indices in tokens.css.
❌ **No screenshots** - Visual evidence required for approval.

### Phase 2 Mistakes

❌ **Modifying game logic** - Graphics AI touches ONLY visual files.
❌ **Breaking tests** - Integration must preserve 100% pass rate.
❌ **Ignoring UI contract** - Coder defines props, Graphics consumes.
❌ **Recreating components** - Use existing components, apply styles.
❌ **Skipping regression checks** - Test that old features still work.

---

## Example Workflow

### User → Story Director
User fills [story-director-questionnaire.md](story-director-questionnaire.md)

### Story Director → Graphics
Story Director produces:
- Story Bible (visual direction)
- Mockup Script (HTML outline)
- Sprite paths + scales
- Design tokens

### Graphics Phase 1 (Mockup)
Graphics AI creates:
- mockups/battle.html
- mockups/battle.css
- mockups/tokens.css
- mockups/sprite_map.json

**Approval Gate:** Human reviews screenshots + accessibility audit

### Graphics → Architect
Approved mockup handed to Architect for session planning

### Architect → Coder
Coder implements game logic (no styles)

### Coder → Graphics
Coder provides UI contract + integration points

### Graphics Phase 2 (Integration)
Graphics AI integrates mockup into React app

**Final Gate:** All tests pass, TypeScript 0 errors, visuals match mockup

---

## Success Metrics

**Traditional Approach (no mockup):**
- Graphics AI success rate: 30-40%
- Common failure: Breaking game logic during sprite integration
- Recovery time: 2-4 hours of debugging

**Mockup-First Approach:**
- Graphics AI success rate: 80-90%
- Common failure: None (isolated phases prevent cross-contamination)
- Recovery time: <30 min (CSS tweaks only)

**Time Investment:**
- Phase 1 (Mockup): 1-2 hours
- Phase 2 (Integration): 1-2 hours
- Total: 2-4 hours (vs 4-8 hours with failures in traditional approach)

---

## References

- [STORY_DIRECTOR_ONBOARDING.md](UPDATED%20DOCS/STORY_DIRECTOR_ONBOARDING.md) - Story Director outputs
- [GRAPHICS_ONBOARD.md](UPDATED%20DOCS/GRAPHICS_ONBOARD.md) - Graphics role definition
- [PROCESS_GUIDE.md](UPDATED%20DOCS/PROCESS_GUIDE.md) - Two-phase graphics workflow
- [graphics-decisions-reference.md](graphics-decisions-reference.md) - Battle-tested values
