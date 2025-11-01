# Mockup Script: Golden Sun - Vale Village

**Purpose:** HTML/CSS blueprint for Graphics Phase 1 (mockup-only, no JavaScript)

---

## Screens Required

1. **Vale Village Overworld** (primary focus)
2. **Interior: Isaac's House**
3. **Interior: Item Shop**
4. **Interior: Armor Shop**
5. **Dialogue Box System** (overlay on all screens)

---

## Screen 1: Vale Village Overworld

### Layout Specifications
- **Resolution:** 480×320 (GBA 240×160 at 2× scale)
- **Background:** Grass tilemap with paths, trees, buildings
- **Grid System:** 8×8 pixel tiles (60×40 tile grid)
- **Camera:** Centered on Isaac (player character)

### Sprite Regions

#### Background Layer (z-index: 0)
```html
<div class="bg-layer" data-tilemap="vale-village-ground">
  <!-- Grass tiles, dirt paths, water edges -->
  <!-- CSS background-image with tilemap sprite sheet -->
</div>
```

#### Scenery Layer (z-index: 5)
```html
<!-- Trees (non-walkable) -->
<img class="scenery tree" src="./assets/tree1.gif" 
     style="left: 120px; top: 80px;" 
     data-collision="true">

<!-- Buildings (can enter via doors) -->
<div class="building isaac-house" 
     style="left: 200px; top: 100px;"
     data-enterable="true"
     data-door-x="224" data-door-y="150">
  <img src="./assets/isaac-house.gif" alt="Isaac's House">
</div>

<div class="building item-shop" 
     style="left: 320px; top: 100px;"
     data-enterable="true">
  <img src="./assets/item-shop.gif" alt="Item Shop">
</div>

<div class="building armor-shop" 
     style="left: 320px; top: 180px;"
     data-enterable="true">
  <img src="./assets/armor-shop.gif" alt="Weapon Shop">
</div>

<!-- Wooden gate (Vale exit) -->
<img class="scenery gate" src="./assets/vale-gate.gif" 
     style="left: 240px; bottom: 20px;">
```

#### Entity Layer (z-index: 10)
```html
<!-- Player Character (Isaac) -->
<div class="entity player" id="isaac"
     style="left: 240px; top: 160px;"
     data-facing="down">
  <img src="./assets/isaac-overworld.gif" alt="Isaac">
</div>

<!-- NPCs (24 total for full town) -->
<!-- Positioned around village -->

<!-- Garet (outside Isaac's house) -->
<div class="entity npc" data-npc-id="garet"
     style="left: 260px; top: 140px;"
     data-facing="left"
     data-dialogue="garet-intro">
  <img src="./assets/garet-overworld.gif" alt="Garet">
</div>

<!-- Dora (Isaac's mom, inside house initially) -->
<div class="entity npc" data-npc-id="dora"
     style="left: 220px; top: 120px;"
     data-facing="down"
     data-dialogue="dora-greeting">
  <img src="./assets/dora.gif" alt="Dora">
</div>

<!-- Elder (central plaza) -->
<div class="entity npc" data-npc-id="elder"
     style="left: 280px; top: 180px;"
     data-facing="down"
     data-dialogue="elder-warning">
  <img src="./assets/elder.gif" alt="Elder">
</div>

<!-- Additional 21 NPCs positioned throughout village -->
<!-- (See sprite_map.json for full coordinates) -->
```

### Camera & Viewport
```css
.viewport {
  width: 480px;
  height: 320px;
  overflow: hidden;
  position: relative;
}

.scene {
  position: relative;
  width: 960px; /* 2× village size for scrolling */
  height: 640px;
  transform-origin: top left;
  /* Camera follows player (Phase 2: JavaScript) */
}
```

---

## Screen 2: Interior - Isaac's House

### Layout Specifications
- **Size:** 240×160 (single screen, no scrolling)
- **Background:** Wooden floor tiles, stone walls
- **Features:** Bed, table, stairs, door

### Sprite Regions

```html
<div class="interior isaac-house">
  <!-- Background -->
  <div class="bg-layer" data-tilemap="house-interior"></div>

  <!-- Furniture (scenery) -->
  <img class="furniture bed" src="./assets/bed.gif" 
       style="left: 160px; top: 60px;">
  <img class="furniture table" src="./assets/table.gif" 
       style="left: 80px; top: 100px;">
  <img class="furniture stairs" src="./assets/stairs-down.gif" 
       style="right: 20px; top: 40px;">

  <!-- Door (exit) -->
  <div class="door exit" 
       style="left: 120px; bottom: 10px;"
       data-exit-to="vale-overworld"
       data-exit-x="224" data-exit-y="170">
    <img src="./assets/door.gif" alt="Exit">
  </div>

  <!-- Player -->
  <div class="entity player" id="isaac"
       style="left: 120px; top: 100px;"
       data-facing="down">
    <img src="./assets/isaac-overworld.gif" alt="Isaac">
  </div>

  <!-- Dora (if at home) -->
  <div class="entity npc" data-npc-id="dora"
       style="left: 80px; top: 120px;"
       data-facing="right"
       data-dialogue="dora-home">
    <img src="./assets/dora.gif" alt="Dora">
  </div>
</div>
```

---

## Screen 3: Interior - Item Shop

### Layout Specifications
- **Size:** 240×160 (single screen)
- **Background:** Shop interior with counter, shelves
- **UI:** Shop menu overlay

### Sprite Regions

```html
<div class="interior item-shop">
  <!-- Background -->
  <div class="bg-layer" data-tilemap="shop-interior"></div>

  <!-- Counter -->
  <img class="furniture counter" src="./assets/shop-counter.gif" 
       style="left: 120px; top: 80px;">

  <!-- Shelves with items -->
  <img class="furniture shelf" src="./assets/shop-shelf.gif" 
       style="left: 40px; top: 40px;">
  <img class="furniture shelf" src="./assets/shop-shelf.gif" 
       style="right: 40px; top: 40px;">

  <!-- Shopkeeper NPC -->
  <div class="entity npc shopkeeper" data-npc-id="item-shop-owner"
       style="left: 120px; top: 100px;"
       data-facing="down"
       data-interaction="shop-menu">
    <img src="./assets/shopkeeper.gif" alt="Shop Owner">
  </div>

  <!-- Player -->
  <div class="entity player" id="isaac"
       style="left: 120px; top: 140px;"
       data-facing="up">
    <img src="./assets/isaac-overworld.gif" alt="Isaac">
  </div>

  <!-- Door exit -->
  <div class="door exit" 
       style="left: 120px; bottom: 10px;"
       data-exit-to="vale-overworld">
    <img src="./assets/door.gif" alt="Exit">
  </div>
</div>
```

---

## Screen 4: Shop Menu Overlay

### Layout Specifications
- **Type:** Modal overlay on top of shop interior
- **Size:** 400×240 (centered on 480×320 viewport)
- **Style:** Golden Sun UI aesthetic (blue gradient boxes, gold borders)

### UI Structure

```html
<div class="modal shop-menu" role="dialog" aria-label="Item Shop">
  <!-- Shop inventory panel -->
  <div class="panel inventory">
    <h2>Item Shop</h2>
    <ul class="item-list">
      <li class="item" data-item-id="herb">
        <img src="./assets/icons/herb.gif" alt="">
        <span class="name">Herb</span>
        <span class="description">Restores 50 HP</span>
        <span class="price">10 coins</span>
      </li>
      <li class="item" data-item-id="nut">
        <img src="./assets/icons/nut.gif" alt="">
        <span class="name">Nut</span>
        <span class="description">Restores 50 PP</span>
        <span class="price">20 coins</span>
      </li>
      <li class="item" data-item-id="antidote">
        <img src="./assets/icons/antidote.gif" alt="">
        <span class="name">Antidote</span>
        <span class="description">Cures poison</span>
        <span class="price">20 coins</span>
      </li>
      <li class="item" data-item-id="psy-crystal">
        <img src="./assets/icons/psy-crystal.gif" alt="">
        <span class="name">Psy Crystal</span>
        <span class="description">Restores 100 PP</span>
        <span class="price">50 coins</span>
      </li>
    </ul>
  </div>

  <!-- Player stats panel -->
  <div class="panel player-stats">
    <div class="coins">
      <img src="./assets/icons/coin.gif" alt="Coins">
      <span>156</span>
    </div>
    <div class="inventory-count">
      <span>Items: 8/30</span>
    </div>
  </div>

  <!-- Action buttons -->
  <nav class="actions">
    <button class="btn-primary">Buy</button>
    <button class="btn-secondary">Sell</button>
    <button class="btn-cancel">Exit</button>
  </nav>

  <!-- Shopkeeper dialogue -->
  <div class="dialogue-box mini">
    <p>"Welcome! What can I get for you?"</p>
  </div>
</div>
```

---

## Component: Dialogue Box System

### Layout Specifications
- **Position:** Bottom of screen (fixed overlay)
- **Size:** 460×100 (20px margin from edges)
- **Style:** Golden Sun dialogue box (dark blue, gold border, character portrait)

### Structure

```html
<div class="dialogue-box" role="region" aria-live="polite">
  <!-- Portrait (left side) -->
  <div class="portrait">
    <img src="./assets/portraits/garet.gif" alt="Garet">
  </div>

  <!-- Text content -->
  <div class="dialogue-content">
    <!-- NPC name -->
    <div class="speaker-name">Garet</div>
    
    <!-- Dialogue text -->
    <div class="dialogue-text">
      <p>Hey Isaac! Ready for an adventure? Kraden wants to see us at his place.</p>
    </div>

    <!-- Continue indicator (animated) -->
    <div class="continue-indicator" aria-label="Press A to continue">
      ▼
    </div>
  </div>
</div>
```

### Dialogue Box States

```css
/* Default state: hidden */
.dialogue-box {
  opacity: 0;
  transform: translateY(20px);
  transition: opacity 0.2s, transform 0.2s;
}

/* Active state: visible */
.dialogue-box.active {
  opacity: 1;
  transform: translateY(0);
}

/* Text reveal animation (Phase 2) */
.dialogue-text {
  /* Text appears character-by-character */
  /* Mockup shows fully revealed state */
}

/* Continue indicator pulse */
@keyframes pulse {
  0%, 100% { opacity: 1; transform: translateY(0); }
  50% { opacity: 0.5; transform: translateY(2px); }
}

.continue-indicator {
  animation: pulse 1s infinite;
}
```

---

## Design Tokens (CSS Variables)

```css
:root {
  /* Layout */
  --tile-size: 8px;
  --tile-2x: 16px;
  --viewport-width: 480px;
  --viewport-height: 320px;

  /* Z-layers */
  --z-bg: 0;
  --z-ground: 1;
  --z-scenery: 5;
  --z-entity: 10;
  --z-entity-shadow: 9;
  --z-ui: 50;
  --z-dialogue: 60;
  --z-modal: 100;

  /* Colors (Golden Sun palette) */
  --color-bg-grass: #88C070;
  --color-bg-grass-dark: #48A038;
  --color-path: #D8C870;
  --color-water: #4080C0;
  
  --color-ui-bg: #1a2838;
  --color-ui-border: #d4a857;
  --color-ui-text: #f8f8f0;
  --color-ui-text-dim: #b8b8a8;
  
  --color-dialogue-bg: rgba(26, 40, 56, 0.95);
  --color-dialogue-border: #d4a857;
  
  /* Typography */
  --font-dialogue: 'Press Start 2P', 'Courier New', monospace;
  --font-size-base: 12px;
  --font-size-dialogue: 10px;
  --line-height: 1.4;

  /* Spacing */
  --space-xs: 4px;
  --space-sm: 8px;
  --space-md: 12px;
  --space-lg: 16px;
  --space-xl: 24px;

  /* Timing */
  --anim-text-reveal: 30ms; /* per character */
  --anim-fade: 200ms;
  --anim-slide: 300ms;

  /* Shadows */
  --shadow-entity: 0 2px 4px rgba(0, 0, 0, 0.3);
  --shadow-dialogue: 0 4px 12px rgba(0, 0, 0, 0.6);
}
```

---

## Accessibility Requirements

### Keyboard Navigation
- **Tab:** Cycle through interactive elements (NPCs, doors, menu items)
- **Arrow Keys:** Move player character
- **A/Enter:** Interact/Confirm
- **B/Escape:** Cancel/Back
- **Start:** Open main menu

### ARIA Labels
```html
<!-- All interactive elements need labels -->
<div class="entity npc" 
     role="button" 
     aria-label="Talk to Garet"
     tabindex="0">
  ...
</div>

<!-- Dialogue uses live region -->
<div class="dialogue-box" 
     role="region" 
     aria-live="polite" 
     aria-atomic="true">
  ...
</div>

<!-- Menus are modal dialogs -->
<div class="modal shop-menu" 
     role="dialog" 
     aria-labelledby="shop-title"
     aria-modal="true">
  <h2 id="shop-title">Item Shop</h2>
  ...
</div>
```

### Contrast Requirements
- **Text on dialogue boxes:** 4.5:1 minimum (white on dark blue)
- **UI elements:** 3:1 minimum (gold borders on dark blue)
- **Focus indicators:** 3px solid outline with 4.5:1 contrast

### Motion Sensitivity
```css
@media (prefers-reduced-motion: reduce) {
  * {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
  
  /* Keep gameplay animations but reduce UI flourishes */
  .continue-indicator {
    animation: none;
  }
}
```

---

## Sprite Map Schema

**File:** `/mockups/sprite_map.json`

```json
{
  "screen": "vale-village-overworld",
  "resolution": "480x320",
  "tile_size": 8,
  "background": {
    "tilemap": "./assets/tilemaps/vale-village.png",
    "palette": ["#88C070", "#48A038", "#D8C870"]
  },
  "scenery": [
    {
      "id": "tree-1",
      "sprite": "./assets/scenery/tree1.gif",
      "position": {"x": 120, "y": 80},
      "z_index": 5,
      "collision": true
    },
    {
      "id": "isaac-house",
      "sprite": "./assets/buildings/isaac-house.gif",
      "position": {"x": 200, "y": 100},
      "z_index": 5,
      "collision": true,
      "door": {"x": 224, "y": 150, "target": "isaac-house-interior"}
    }
  ],
  "entities": [
    {
      "id": "isaac",
      "type": "player",
      "sprite": "./assets/characters/isaac-overworld.gif",
      "position": {"x": 240, "y": 160},
      "z_index": 10,
      "facing": "down",
      "animations": {
        "idle": {"frames": 2, "fps": 2},
        "walk": {"frames": 4, "fps": 8}
      }
    },
    {
      "id": "garet",
      "type": "npc",
      "sprite": "./assets/characters/garet-overworld.gif",
      "position": {"x": 260, "y": 140},
      "z_index": 10,
      "facing": "left",
      "dialogue": "garet-intro",
      "animations": {
        "idle": {"frames": 2, "fps": 2}
      }
    }
  ],
  "stats": {
    "total_scenery": 15,
    "total_buildings": 7,
    "total_npcs": 24,
    "total_sprites": 46
  }
}
```

---

## Mockup Completion Checklist

### Phase 1 (HTML/CSS Only)
- [ ] **vale-overworld.html** - Village exterior with all NPCs
- [ ] **isaac-house.html** - Interior of Isaac's home
- [ ] **item-shop.html** - Shop interior with UI overlay
- [ ] **armor-shop.html** - Weapon shop interior
- [ ] **dialogue-box.html** - Dialogue component showcase
- [ ] **tokens.css** - All design tokens (colors, spacing, z-index)
- [ ] **overworld.css** - Overworld-specific styles
- [ ] **interior.css** - Interior screen styles
- [ ] **ui.css** - UI components (dialogue, menus)
- [ ] **sprite_map.json** - Complete sprite manifest
- [ ] **MOCKUP_APPROVED.md** - Approval request document

### Quality Gates
- [ ] All layouts pixel-perfect (match GBA Golden Sun aesthetic)
- [ ] No JavaScript (HTML/CSS only)
- [ ] All sprites positioned with inline styles
- [ ] Z-index layering correct (bg < scenery < entities < UI)
- [ ] Accessibility: ARIA labels, keyboard focus, contrast 4.5:1
- [ ] Motion: prefers-reduced-motion support
- [ ] Design tokens documented in CSS variables
- [ ] Screenshots provided for all screens
- [ ] Sprite paths validated (no 404s)

---

## Next Steps After Approval

**Phase 2 (Integration):**
1. Convert HTML mockups to React components
2. Implement movement system (grid-based, 8-directional)
3. Add collision detection (walk around buildings, talk to NPCs)
4. Wire dialogue system (text reveal, portraits, choices)
5. Implement shop system (buy/sell, inventory management)
6. Add camera following player
7. Implement screen transitions (fade in/out between areas)
8. Add sprite animations (idle, walk cycles)

**Routing:** GRAPHICS:MOCKUP-COMPLETE → ARCHITECT:REVIEW → CODER:IMPLEMENTATION
