# Graphics Mockup Examples

Production-ready HTML/CSS mockup examples demonstrating the mockup-first workflow from [GRAPHICS_ONBOARD.md](../UPDATED%20DOCS/GRAPHICS_ONBOARD.md).

---

## Golden Sun Djinn Menu Mockup 🆕

**Location:** [djinn-menu/](djinn-menu/)

A pixel-perfect menu UI mockup demonstrating:
- ✅ CSS Grid multi-panel layout (character portraits + Djinn roster + footer)
- ✅ Element color coding (Venus/Mercury/Mars/Jupiter)
- ✅ 3D panel borders (light/dark edges for depth)
- ✅ Overworld character sprites (4 party members)
- ✅ Djinn sprites with Psynergy ability lists
- ✅ GBA scaling (480×320 → 720×480 → 960×640)

### Files

```
djinn-menu/
├── djinn-menu.html            # Main mockup (Djinn roster screen)
├── djinn-menu-tokens.css      # Design tokens (element colors, panel system)
├── djinn-menu.css             # Layout styles (Grid, panels, typography)
├── sprite_map.json            # Sprite manifest (8 sprites + 23 Psynergy abilities)
├── MOCKUP_APPROVED.md         # Phase 1 gate documentation
└── assets/                    # 8 sprite assets
    ├── Venus_Djinn.gif        # Flint (Earth element)
    ├── Mercury_Djinn.gif      # Fizz (Water element)
    ├── Mars_Djinn.gif         # Forge (Fire element)
    ├── Jupiter_Djinn.gif      # Gust (Wind element)
    ├── Isaac_Overworld.gif    # Party member 1
    ├── Garet_Overworld.gif    # Party member 2
    ├── Ivan_Overworld.gif     # Party member 3
    └── Mia_Overworld.gif      # Party member 4
```

### Key Patterns

**1. CSS Grid Multi-Panel Layout**
```css
.scene{
  display: grid;
  grid-template-areas:
    "chars return"
    "djinn djinn"
    "footer footer";
  grid-template-columns: 120px 1fr;
  grid-template-rows: 80px 1fr 24px;
  gap: 8px;
}
```

**2. Element Color System**
```css
--venus-color: #E8A050;   /* Earth/Ground - orange-brown */
--mercury-color: #5090D8; /* Water/Ice - blue */
--mars-color: #E05050;    /* Fire - red */
--jupiter-color: #A858D8; /* Wind/Lightning - purple */
```

**3. 3D Panel Borders**
```css
border: 2px solid var(--panel-border);        /* Light (#4A7AB8) */
border-bottom-color: var(--panel-border-dark); /* Dark (#0F2550) */
border-right-color: var(--panel-border-dark);
```

**Why This Mockup is Important:**
- Proves mockup-first works for **menu UI**, not just battle screens
- Demonstrates **CSS Grid for complex layouts** (vs absolute positioning)
- Shows **element-based theming** (reusable color system)
- **23 Psynergy abilities** documented in sprite_map.json

---

## Golden Sun Battle Mockup

**Location:** [golden-sun-battle/](golden-sun-battle/)

A pixel-perfect battle screen mockup with:
- ✅ Real Golden Sun cave background
- ✅ Authentic GBA scaling (480×320 → 720×480 → 960×640)
- ✅ Complete sprite manifest (sprite_map.json)
- ✅ WCAG 2.1 AA accessibility
- ✅ MOCKUP_APPROVED.md gate documentation
- ✅ Semi-transparent panels matching GBA aesthetic

### Files

```
golden-sun-battle/
├── golden-sun-battle.html    # Main mockup (with <div class="stage"> wrapper)
├── tokens.css                 # Design tokens (responsive scaling, colors, spacing)
├── battle.css                 # Layout styles (rows, panels, buttons)
├── sprite_map.json            # Sprite manifest for Phase 2 integration
├── MOCKUP_APPROVED.md         # Phase 1 gate documentation
└── assets/                    # 8 sprite assets
    ├── cave.gif               # Background (Golden Sun asset)
    ├── goblin.gif             # Enemy 1
    ├── Wolfkin.gif            # Enemy 2
    ├── Battle.gif             # Enemy 3 (icon)
    ├── Isaac_Axe_Front.gif    # Ally 1
    ├── Garet_Axe_Front.gif    # Ally 2
    ├── Mia_Mace_Front.gif     # Ally 3
    └── Ivan_Staff_Front.gif   # Ally 4
```

### Key Features

**1. Integer Scaling (No Blur)**
```css
/* Base 2× (480×320) */
--scale: 1;

/* 3× on 1440p */
@media (min-width: 1440px) and (min-height: 960px){
  :root{ --scale: 1.5; }
}

/* 4× on 1080p+ */
@media (min-width: 1920px) and (min-height: 1080px){
  :root{ --scale: 2; }
}
```

**2. Sprite Stance Polish**
```css
/* Enemies slightly larger, floating */
.row.enemies .entity{
  transform: translateY(2px) scale(1.08);
}

/* Allies grounded */
.row.allies .entity{
  transform: translateY(4px) scale(1.00);
}
```

**3. Vignette Overlay for Legibility**
```css
.bg::after{
  background: linear-gradient(
    to bottom,
    rgba(0,0,0,0.10) 0%,
    rgba(0,0,0,0.35) 60%,
    rgba(0,0,0,0.55) 100%
  );
}
```

**4. Button Hover/Active States**
```css
.btn:hover{ background: #242860; }
.btn:active{ transform: translateY(1px); }
.btn:focus-visible{ outline: 3px solid var(--accent); }
```

### Why This Mockup Sets the Standard

From MOCKUP_APPROVED.md:

> **80-90% Success Rate Proven:**
> - Real asset integration (cave.gif) validates sprite registry workflow
> - Integer scaling (no blur) ensures pixel-perfect rendering at all sizes
> - Design token separation (tokens.css) prevents drift during Phase 2
> - Semi-transparent panels match authentic Golden Sun UI aesthetic
> - Sprite stance polish (scale + translateY) matches GBA reference frames

### How to Use

**As Graphics AI:**
1. Review this mockup as Phase 1 reference
2. Copy the structure for your game's mockup
3. Replace assets with your sprite paths
4. Update sprite_map.json manifest
5. Fill out MOCKUP_APPROVED.md
6. Get Architect approval before Phase 2

**As Architect AI:**
1. Use this as acceptance criteria for Phase 1 deliverables
2. Verify all checklist items in MOCKUP_APPROVED.md
3. Approve or request changes
4. Hand off to Coder for Phase 2 React integration

### Battle-Tested Patterns

All techniques from NextEraGame (24.5K LOC, 1029 tests, 10/10 health):
- WCAG 2.1 AA accessibility
- Responsive CSS variables (no JavaScript)
- Drop shadows for sprite depth
- Vignette overlays for complex backgrounds
- Semi-transparent panels (rgba)
- Focus rings for keyboard navigation

---

## Creating Your Own Mockup

1. **Start with tokens.css** - Define your design system
2. **Create single-file HTML** - All sprites visible, no JavaScript
3. **Add sprite_map.json** - Document all asset paths
4. **Fill MOCKUP_APPROVED.md** - Complete the Phase 1 gate checklist
5. **Get approval** - Architect reviews before Phase 2

See [graphics-mockup-template.md](../graphics-mockup-template.md) for the complete workflow guide.
