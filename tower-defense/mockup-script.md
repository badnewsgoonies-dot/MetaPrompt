# Mockup Script - Elemental Bastion Tower Defense

## Screen Layout

### Main Game Screen (1200x800 canvas)

**Grid Layout:** 12 columns x 8 rows (each cell 100x100px)

```
+------------------------------------------------------------------+
|  HUD Top Bar (1200x80)                                          |
|  [Wave 1/10] [Gold: 500] [Lives: 10] [Next Wave Button]        |
+------------------------------------------------------------------+
|                                                                  |
|  Game Grid (1200x600)                                           |
|  - 12x6 placeable cells                                         |
|  - Path overlay (non-placeable)                                 |
|  - Towers render on cells                                       |
|  - Enemies move along path                                      |
|                                                                  |
+------------------------------------------------------------------+
|  Tower Selection Bar (1200x120)                                 |
|  [Fire] [Frost] [Stone] [Wind] | Selected Tower Info           |
+------------------------------------------------------------------+
```

## UI Elements Required

### HUD Elements
1. **Wave Counter** - "Wave X/10" - 24px bold
2. **Gold Display** - "💰 500" - 20px (coin icon + number)
3. **Lives Display** - "❤️ 10" - 20px (heart icon + number)
4. **Next Wave Button** - 120x40px, glowing when ready
5. **Pause Button** - Top right corner, 32x32px

### Tower Selection Bar
1. **Fire Spire Icon** - 80x80px, red/orange gradient border
2. **Frost Tower Icon** - 80x80px, cyan/blue gradient border
3. **Stone Guardian Icon** - 80x80px, brown/gray gradient border
4. **Wind Shrine Icon** - 80x80px, white/silver gradient border
5. **Cost Label** - Below each icon, yellow text
6. **Selected Tower Info Panel** - 400x100px, shows stats when hovering

### Game Grid Elements
1. **Grid Cells** - 100x100px, subtle border when placeable
2. **Path Tiles** - Darker background, not placeable
3. **Tower Sprite** - 60x60px centered in cell
4. **Enemy Sprite** - 40x40px moving along path
5. **Projectile Effects** - Small particles (10x10px)
6. **Range Indicator** - Circle overlay when placing tower

## Sprite Registry

### Towers (60x60px each)
- `fire-spire.png` - Red/orange tower with flame
- `frost-tower.png` - Blue/white tower with ice crystal
- `stone-guardian.png` - Brown/gray stone statue
- `wind-shrine.png` - White/silver tower with swirl

### Enemies (40x40px each)

**Lesser (40x40px):**
- `fire-imp.png` - Small red demon
- `water-wisp.png` - Blue spirit
- `stone-golem.png` - Gray rock creature
- `air-sprite.png` - White cloud creature

**Greater (50x50px):**
- `flame-demon.png` - Large red demon
- `tidal-beast.png` - Blue water beast
- `earth-elemental.png` - Large stone creature
- `storm-wraith.png` - Dark cloud with lightning

**Ancient (80x80px):**
- `inferno-titan.png` - Massive fire boss
- `leviathan.png` - Huge water serpent
- `mountain-colossus.png` - Giant stone titan
- `hurricane-lord.png` - Massive storm entity

### UI Icons (32x32px)
- `coin-icon.png` - Gold coin
- `heart-icon.png` - Red heart for lives
- `wave-icon.png` - Flag icon

## Color Palette

### Primary Elements
- **Fire:** #FF4500 (primary), #FF6B35 (light), #8B0000 (dark)
- **Water:** #00CED1 (primary), #87CEEB (light), #003F5C (dark)
- **Earth:** #8B4513 (primary), #D2691E (light), #3E2723 (dark)
- **Air:** #F0F8FF (primary), #FFFFFF (light), #778899 (dark)

### UI Colors
- **Background:** #1a1a2e (dark blue-black)
- **Grid Cells:** #16213e (slightly lighter)
- **Path:** #0f3460 (blue-gray)
- **HUD Background:** #162447 (semi-transparent overlay)
- **Gold Text:** #FFD700
- **Button Active:** #4CAF50
- **Button Disabled:** #555555

## Typography

- **Headers:** 'Cinzel', serif - 24px bold
- **Body:** 'Roboto', sans-serif - 16px
- **Numbers:** 'Courier New', monospace - 18px bold

## Animation Timing Tokens

```css
--anim-tower-place: 300ms;
--anim-tower-attack: 600ms;
--anim-enemy-hurt: 200ms;
--anim-enemy-death: 400ms;
--anim-projectile: 300ms;
--anim-button-hover: 150ms;
--anim-wave-complete: 1000ms;
```

## Z-Index Layers

```css
--z-background: 0;
--z-grid: 1;
--z-path: 2;
--z-towers: 3;
--z-enemies: 4;
--z-projectiles: 5;
--z-effects: 6;
--z-hud: 10;
--z-modals: 20;
```

## Accessibility Notes

1. **Contrast:** All text must meet WCAG 2.1 AA (4.5:1 for small text)
2. **Keyboard Navigation:** Tab through towers, Enter to select, Arrow keys to place
3. **Screen Reader:** All buttons have aria-labels
4. **Motion:** Respect `prefers-reduced-motion` for animations
5. **Focus Indicators:** 2px solid outline on all interactive elements
