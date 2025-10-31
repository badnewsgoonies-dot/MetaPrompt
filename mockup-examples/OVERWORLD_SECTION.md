## Golden Sun Overworld Scenes 🆕🆕

**Four production-ready overworld mockups** demonstrating sprite positioning, layering, and environmental design:

### 1. Village Gathering ([overworld-village/](overworld-village/))
- ✅ **24 character sprites** in gathering formation
- ✅ Grass gradient background with tile pattern
- ✅ 3 scenery elements (2 trees + wooden gate)
- ✅ Absolute positioning system
- ✅ Z-index layering (bg → scenery → entities)

**Files:**
```
overworld-village/
├── overworld-village.html     # Main mockup (24 NPCs + scenery)
├── overworld-tokens.css       # Design tokens (grass colors, spacing)
├── overworld.css              # Layout styles (absolute positioning)
├── sprite_map.json            # Sprite manifest (27 total sprites)
├── MOCKUP_APPROVED.md         # Phase 1 gate documentation
└── assets/                    # 27 sprite assets
    ├── Tree1.gif              # Left tree
    ├── Tree2.gif              # Right tree
    ├── Vale_Gate.gif          # Wooden arch
    ├── Isaac.gif              # Protagonist 1
    ├── Garet.gif              # Protagonist 2
    ├── Ivan.gif               # Protagonist 3
    ├── Mia.gif                # Protagonist 4
    ├── Felix.gif              # Protagonist 5
    ├── Jenna.gif              # Protagonist 6
    ├── Sheba.gif              # Protagonist 7
    ├── Piers.gif              # Protagonist 8
    ├── Alex.gif               # Antagonist 1
    ├── Saturos.gif            # Antagonist 2
    └── [15 more NPC sprites]
```

### 2. Temple Interior ([overworld-temple/](overworld-temple/))
- ✅ **Sol Sanctum background** (authentic Golden Sun asset)
- ✅ Central white statue focal point
- ✅ 3 protagonists exploring temple
- ✅ Drop shadows for depth on stone floor

**Files:**
```
overworld-temple/
├── overworld-temple.html      # Main mockup (temple + statue + 3 chars)
├── overworld-tokens.css       # Design tokens (stone colors, shadow)
├── overworld.css              # Layout styles (absolute positioning)
├── sprite_map.json            # Sprite manifest (4 total sprites)
├── MOCKUP_APPROVED.md         # Phase 1 gate documentation
└── assets/                    # 4 sprite assets
    ├── Sol_Sanctum.gif        # Background (temple interior)
    ├── Sol_Sanctum_Statue.gif # Central statue
    ├── Isaac.gif              # Protagonist 1
    ├── Garet.gif              # Protagonist 2
    └── Ivan.gif               # Protagonist 3
```

### 3. Palace Interior ([overworld-palace/](overworld-palace/))
- ✅ **Anemos Inner Sanctum background** (ornate pillars)
- ✅ Circular decorative rug (floor scenery layer)
- ✅ 3 protagonists on rug
- ✅ Demonstrates floor decoration layering

**Files:**
```
overworld-palace/
├── overworld-palace.html      # Main mockup (palace + rug + 3 chars)
├── overworld-tokens.css       # Design tokens (palace colors)
├── overworld.css              # Layout styles (absolute positioning)
├── sprite_map.json            # Sprite manifest (4 total sprites)
├── MOCKUP_APPROVED.md         # Phase 1 gate documentation
└── assets/                    # 4 sprite assets
    ├── Anemos_Inner_Sanctum.gif # Background (palace interior)
    ├── Round_Rug.gif          # Decorative floor rug
    ├── Isaac.gif              # Protagonist 1
    ├── Garet.gif              # Protagonist 2
    └── Sheba.gif              # Protagonist 3
```

### 4. Ice Cave with Psynergy ([overworld-ice-cave/](overworld-ice-cave/))
- ✅ **Icy cave background** (teal/cyan aesthetic)
- ✅ **Psynergy wings effect** (CSS animation with glow)
- ✅ 2 ladders for vertical navigation
- ✅ 4-layer z-index (bg → scenery → entities → effects)
- ✅ `prefers-reduced-motion` support

**Files:**
```
overworld-ice-cave/
├── overworld-ice-cave.html    # Main mockup (cave + Psynergy effect)
├── overworld-tokens.css       # Design tokens (ice colors, effects)
├── overworld.css              # Layout styles (absolute positioning + animation)
├── sprite_map.json            # Sprite manifest (5 total sprites)
├── MOCKUP_APPROVED.md         # Phase 1 gate documentation
└── assets/                    # 5 sprite assets
    ├── Cave.gif               # Background (icy cave)
    ├── ladder2.gif            # Ladder (left)
    ├── ladder3.gif            # Ladder (right)
    ├── Isaac.gif              # Protagonist 1 (with Psynergy)
    ├── Garet.gif              # Protagonist 2
    └── Wing_LM_Back.gif       # Psynergy wings effect
```

**Key Patterns:**
- Same integer scaling system (480×320 → 720×480 → 960×640)
- Sprite drop shadows for depth
- Real Golden Sun backgrounds
- Absolute positioning with inline styles
- Z-index layering for proper sprite ordering
- CSS animations for Psynergy effects

**CSS Animation Example (Ice Cave):**
```css
.effect{
  z-index: var(--z-effects);
  opacity: 0.9;
  filter: drop-shadow(0 0 8px var(--psynergy-glow));
  animation: psynergy-pulse 2s ease-in-out infinite;
}

@keyframes psynergy-pulse {
  0%, 100% { opacity: 0.9; filter: drop-shadow(0 0 8px var(--psynergy-glow)); }
  50% { opacity: 1.0; filter: drop-shadow(0 0 12px var(--psynergy-glow)); }
}

@media (prefers-reduced-motion: reduce){
  .effect{ animation: none !important; opacity: 0.9; }
}
```

**Why These Mockups Matter:**
- Prove mockup-first works for **open-world environments**, not just UI
- Demonstrate **sprite positioning** (absolute coordinates) vs UI layout (Grid/Flexbox)
- Show **effect layering** (Psynergy, status effects) with z-index system
- Provide **4 environment types** (outdoor, temple, palace, cave)
- **27 total sprites** (village) proves scalability
- **CSS animations** with accessibility support

**All mockups include:**
- sprite_map.json manifest
- MOCKUP_APPROVED.md gate documentation
- Same integer scaling system
- Design token separation
- Drop shadows for depth
- Real Golden Sun backgrounds

---

*This section should be inserted at the top of README.md, before the Djinn Menu section*
