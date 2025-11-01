# Acceptance Criteria: Vale Village MVP

**Project:** Golden Sun - First City (Vale Village)
**Session:** 1
**Date:** 2025-11-01

---

## Functional Requirements

### 1. Player Movement ✅
- [ ] Player (Isaac) renders on screen at starting position
- [ ] Arrow keys move player in 8 directions (N, NE, E, SE, S, SW, W, NW)
- [ ] Movement speed: 4 pixels/frame (120 pixels/second at 30 FPS)
- [ ] Player sprite changes based on facing direction (4 directions: up, down, left, right)
- [ ] Idle animation (2-frame bob) when not moving
- [ ] Walk animation (4-frame cycle) when moving

### 2. Collision Detection ✅
- [ ] Player cannot walk through NPCs
- [ ] Player cannot walk through buildings
- [ ] Player cannot walk through scenery (trees, gate)
- [ ] Player can walk freely on paths and grass
- [ ] Collision uses bounding box detection (existing collision.ts utils)
- [ ] No clipping/stuck issues (tested with 20+ edge cases)

### 3. Camera System ✅
- [ ] Camera follows player (player centered on screen)
- [ ] Camera constrained to scene bounds (no black edges visible)
- [ ] Smooth camera movement (lerp/easing, not instant snap)
- [ ] Camera offset configurable (default: center player)

### 4. NPC System ✅
- [ ] 16 NPCs render at positions from sprite_map.json
- [ ] Each NPC has unique sprite, position, facing direction
- [ ] NPCs have idle animation (2-frame bob, 500ms interval)
- [ ] NPCs do not move (static positions for MVP)
- [ ] NPCs have collision (player cannot walk through)
- [ ] NPCs have interaction zones (1 tile radius)

### 5. NPC Interaction ✅
- [ ] Press A/Enter while facing NPC → dialogue box opens
- [ ] Only interact with NPC within 1 tile distance
- [ ] Only interact when player facing NPC (directional check)
- [ ] Visual feedback: NPC sparkle/highlight when interactable
- [ ] Keyboard accessible: Tab to cycle NPCs, Enter to interact

### 6. Dialogue System ✅
- [ ] Dialogue box renders at bottom of screen (fixed overlay)
- [ ] NPC portrait displays (64×64px) on left side
- [ ] NPC name displays above dialogue text
- [ ] Dialogue text reveals character-by-character (30ms/char, configurable)
- [ ] Press A/Enter → advance to next dialogue line
- [ ] Press B/Escape → close dialogue
- [ ] Dialogue content loaded from data file (JSON or inline)
- [ ] Unique dialogue for each of 16 NPCs (matches Story Bible samples)
- [ ] Dialogue box matches mockup styling (blue bg, gold border)

### 7. Building Entrances ✅
- [ ] 7 buildings have collision zones (can't walk through walls)
- [ ] Buildings have door zones (enterable areas)
- [ ] Door sparkle animation indicates enterable buildings
- [ ] Walk to door + press A/Enter → enter building
- [ ] Screen fades to black (300ms transition)
- [ ] Interior scene loads (single-screen room)
- [ ] Player positioned at interior spawn point (near door)

### 8. Building Interiors ✅
**Required Interiors (Minimum 3):**
- [ ] **Isaac's House** - Dora inside, bed, table, exit door
- [ ] **Item Shop** - Shopkeeper, counter, shelves → triggers shop menu
- [ ] **Armor Shop** - Shopkeeper, counter, displays → triggers shop menu

**Optional Interiors (Nice to Have):**
- [ ] Elder's House - Empty room with "Under construction" message
- [ ] Inn - Innkeeper, beds → rest/save functionality
- [ ] Garet's House - Kyle inside, furniture
- [ ] Kraden's Study - Kraden inside, bookshelves

### 9. Scene Transitions ✅
- [ ] Fade out when entering building (300ms black fade)
- [ ] Fade in when interior loaded (300ms fade from black)
- [ ] Fade out when exiting building
- [ ] Fade in when returning to overworld
- [ ] Player positioned correctly on return (at building door)
- [ ] No loading delays >500ms

### 10. Shop System ✅
- [ ] Interact with shopkeeper → shop menu opens (modal overlay)
- [ ] Shop menu shows 4-6 items per shop
- [ ] Each item displays: icon, name, description, price
- [ ] Player's coin count displayed prominently
- [ ] Arrow keys navigate items (up/down)
- [ ] Press A/Enter → purchase item (if sufficient coins)
- [ ] Coins deducted immediately, item added to inventory
- [ ] "Not enough coins" message if insufficient funds (audio + visual)
- [ ] Press B/Escape → close shop menu
- [ ] Inventory management (max 30 items, notify when full)

**Item Shop Inventory:**
- [ ] Herb (10 coins) - Restores 50 HP
- [ ] Nut (20 coins) - Restores 50 PP
- [ ] Antidote (20 coins) - Cures poison
- [ ] Psy Crystal (50 coins) - Restores 100 PP

**Armor Shop Inventory:**
- [ ] Wooden Stick (20 coins) - Basic weapon
- [ ] Leather Armor (40 coins) - Basic armor
- [ ] Leather Cap (30 coins) - Basic headgear
- [ ] Leather Gloves (15 coins) - Basic accessory

### 11. Inventory System ✅
- [ ] Player has inventory array (max 30 items)
- [ ] Items stored with: id, name, description, quantity
- [ ] Add item to inventory on purchase
- [ ] Stack consumables (Herb ×5, not 5 separate slots)
- [ ] "Inventory full" message when at capacity
- [ ] Inventory persists on save/load

### 12. Economy System ✅
- [ ] Player starts with 100 coins (configurable)
- [ ] Coins deducted on shop purchase
- [ ] Coins displayed in shop UI
- [ ] Coins persist on save/load
- [ ] No negative coins (validation before purchase)

### 13. Inn & Save System ✅
- [ ] Enter inn, talk to innkeeper
- [ ] "Rest for 30 coins?" → Yes/No choice dialogue
- [ ] Select Yes → coins deducted, HP/PP restored
- [ ] "Save your progress?" prompt after rest
- [ ] Select Yes → game saved to localStorage
- [ ] Save includes: player position, inventory, coins, NPC dialogue states
- [ ] Load game on page refresh → restore saved state
- [ ] "Continue" option on title screen (if save exists)

### 14. UI Components ✅
**Dialogue Box:**
- [ ] Matches mockup styling (dark blue bg, gold border)
- [ ] Portrait on left (64×64px)
- [ ] Speaker name (yellow text)
- [ ] Dialogue text (white, readable font)
- [ ] Continue indicator (▼ with pulse animation)

**Shop Menu:**
- [ ] Modal overlay (darkened background)
- [ ] Item list (scrollable if >6 items)
- [ ] Coin display
- [ ] Inventory count (8/30)
- [ ] Action buttons (Buy, Sell, Exit)
- [ ] Matches Golden Sun aesthetic

**Location Banner:**
- [ ] Appears on scene entry ("Vale Village")
- [ ] Fades in/out (3s duration)
- [ ] Gold border, dark bg
- [ ] Centered at top of screen

### 15. Animations & Polish ✅
- [ ] Player idle animation (2 FPS bob)
- [ ] Player walk animation (4-frame cycle, 8 FPS)
- [ ] NPC idle animation (2 FPS bob)
- [ ] Building door sparkle (pulse animation)
- [ ] Dialogue continue indicator pulse
- [ ] Scene fade transitions (300ms)
- [ ] Location banner fade in/out
- [ ] All animations smooth (30+ FPS)
- [ ] prefers-reduced-motion support (disable decorative animations)

---

## Accessibility Requirements (WCAG 2.1 AA)

### 16. Keyboard Navigation ✅
- [ ] All NPCs keyboard accessible (Tab to cycle, Enter to interact)
- [ ] All menus keyboard accessible (Arrow keys + Enter/Escape)
- [ ] Player movement via Arrow keys (no mouse required)
- [ ] Dialogue advance via A/Enter key
- [ ] Shop navigation via Arrow keys
- [ ] No keyboard traps (can exit all modals with Escape)
- [ ] Logical tab order (top-to-bottom, left-to-right)

### 17. Focus Indicators ✅
- [ ] Visible focus rings on all interactive elements (3px solid gold)
- [ ] Focus ring offset: 4px for visibility
- [ ] Focus ring contrast: 4.5:1 against background
- [ ] Focus visible on Tab navigation (not on mouse click)

### 18. ARIA Labels ✅
- [ ] role="button" on all NPCs
- [ ] aria-label on all NPCs ("Talk to [Name]")
- [ ] role="region" + aria-live="polite" on dialogue box
- [ ] aria-labelledby on shop menu
- [ ] aria-atomic on dialogue (announce full text)
- [ ] .sr-only descriptions for context ("Garet is waiting near Isaac's house")

### 19. Contrast Requirements ✅
**Text Contrast (4.5:1 minimum):**
- [ ] Dialogue text: white (#f8f8f0) on dark blue (#1a2838) = 12.6:1 ✅
- [ ] Speaker name: yellow (#ffd87f) on dark blue = 8.2:1 ✅
- [ ] Shop menu text: white on dark blue = 12.6:1 ✅

**UI Element Contrast (3:1 minimum):**
- [ ] Dialogue border: gold (#d4a857) on dark blue = 4.8:1 ✅
- [ ] Focus rings: gold (#d4a857) = 4.8:1 ✅
- [ ] Button borders: gold = 4.8:1 ✅

### 20. Screen Reader Support ✅
- [ ] Dialogue announced via aria-live region
- [ ] NPC names announced on focus
- [ ] Shop items announced with price and description
- [ ] Coin changes announced ("Spent 10 coins. 90 remaining.")
- [ ] Error messages announced ("Not enough coins!")
- [ ] Scene changes announced ("Entered Isaac's House")

### 21. Motion Sensitivity ✅
- [ ] prefers-reduced-motion media query implemented
- [ ] Decorative animations disabled (sparkles, pulses, bobs)
- [ ] Essential animations slowed (walk cycles from 8 FPS → 4 FPS)
- [ ] Scene transitions reduced (300ms → 100ms)
- [ ] No auto-play animations faster than 5 seconds

---

## Performance Requirements

### 22. Frame Rate ✅
- [ ] Consistent 30 FPS minimum (60 FPS target)
- [ ] No frame drops during movement
- [ ] No frame drops during scene transitions
- [ ] No frame drops with all 16 NPCs visible
- [ ] Profiled with browser DevTools (Performance tab)

### 23. Load Times ✅
- [ ] Initial page load: <3 seconds
- [ ] Scene transitions: <500ms
- [ ] Save game: <200ms
- [ ] Load game: <500ms
- [ ] Shop menu open: <200ms

### 24. Input Latency ✅
- [ ] Keyboard input to player movement: <100ms
- [ ] Dialogue advance: <50ms
- [ ] Shop purchase: <100ms
- [ ] Menu navigation: <50ms

---

## Technical Requirements

### 25. TypeScript ✅
- [ ] 0 TypeScript errors (`npm run type-check`)
- [ ] Strict mode enabled
- [ ] All types defined (no `any` in new code)
- [ ] Enums for constants (facing directions, item types)

### 26. Testing ✅
- [ ] 100% test pass rate (`npm test`)
- [ ] 50+ new tests minimum
- [ ] Unit tests for all systems (npcSystem, dialogueSystem, shopSystem, etc.)
- [ ] Integration tests (movement + collision, dialogue + NPCs, shop + inventory)
- [ ] Edge case coverage (boundary conditions, error states)

### 27. Build ✅
- [ ] Build succeeds (`npm run build`)
- [ ] No circular dependencies (`npm run circular`)
- [ ] Bundle size <2MB (optimized assets)
- [ ] No console errors in production build

### 28. Code Quality ✅
- [ ] Pure functions (no side effects)
- [ ] Result<T,E> types for error handling (no throws in game logic)
- [ ] Immutable data structures (no mutating inputs)
- [ ] Clear function names (verb + noun: `canInteractWithNPC`)
- [ ] Comments on complex logic (JSDoc for public APIs)

---

## Visual Requirements

### 29. Aesthetic ✅
- [ ] Matches Golden Sun GBA aesthetic (mockup reference)
- [ ] Pixel-perfect rendering (image-rendering: pixelated)
- [ ] GBA resolution: 240×160 at 2× scale (480×320 viewport)
- [ ] Grass gradient background (light → dark green)
- [ ] Sprite drop shadows for depth
- [ ] Z-index layering correct (bg < scenery < entities < UI)

### 30. Assets ✅
- [ ] All 27 character sprites loaded (0 missing / 404s)
- [ ] 3 scenery sprites loaded (trees, gate)
- [ ] Building placeholders or authentic sprites
- [ ] Portrait images for all NPCs (dialogue system)
- [ ] Item icons for shop menu
- [ ] Sprite map loaded from sprite_map.json

### 31. Responsive Design ✅
- [ ] 2× scale (480×320) - Mobile/Base
- [ ] 3× scale (720×480) - Tablet
- [ ] 4× scale (960×640) - Desktop
- [ ] Maintains 3:2 aspect ratio (GBA native)
- [ ] Integer scaling (no blurry sprites)

---

## Definition of Done (MVP Complete)

✅ Player can explore Vale village freely (movement + collision)
✅ Player can talk to 16 NPCs with unique dialogues
✅ Player can enter 3 buildings (Isaac's house, Item Shop, Armor Shop)
✅ Player can buy items from shops (functional economy)
✅ Player can save game at inn
✅ All interactions keyboard accessible
✅ 0 TypeScript errors
✅ All tests passing (100%)
✅ No console errors
✅ Performance: 30+ FPS, <100ms input latency
✅ Accessibility: WCAG 2.1 AA compliant
✅ Visual: Matches Golden Sun mockup aesthetic

---

## Out of Scope (Explicitly NOT Required)

❌ Combat system
❌ Party members (Garet/Ivan/Mia as followers)
❌ Psynergy abilities (Move, Catch, Lift)
❌ Equipment stats/effects (can buy items but no stat changes)
❌ EXP/Leveling (no progression system)
❌ World map (Vale village only)
❌ Sol Sanctum dungeon
❌ Multiple towns
❌ Quests/objectives (exploration only)
❌ Audio/Music (visual-only MVP)

---

## Verification Commands

```bash
# Type check
npm run type-check
# Expected: 0 errors

# Run tests
npm test
# Expected: 50+ tests, 100% pass

# Check circular dependencies
npm run circular
# Expected: 0 cycles

# Build
npm run build
# Expected: Success, dist/ folder created

# Dev server
npm run dev
# Expected: http://localhost:5173, no console errors

# Accessibility audit
# (Use browser DevTools: Lighthouse Accessibility tab)
# Expected: 90+ score
```

---

## Approval Checklist (QA Verifier)

- [ ] All 31 functional requirements met
- [ ] All 6 accessibility requirements met (WCAG 2.1 AA)
- [ ] All 4 performance requirements met
- [ ] All 4 technical requirements met (TypeScript, tests, build)
- [ ] All 3 visual requirements met (aesthetic, assets, responsive)
- [ ] Definition of done satisfied (11/11 criteria)
- [ ] Manual testing passed (keyboard-only, screen reader)
- [ ] Screenshots/video provided (before/after)
- [ ] Completion report submitted (CODER_ONBOARDING.md format)

**QA Decision:** [ ] PASS | [ ] FAIL | [ ] WAIVER

---

**Acceptance Criteria Complete. Ready for QA verification.**
