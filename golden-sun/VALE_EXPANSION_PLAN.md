# Vale Village - 100% Authentic Expansion Plan

**Objective:** Expand Vale Village from simplified 7-building version to full authentic Golden Sun Vale with complete traversal, perfect collision, and REAL sprites everywhere.

**Reference:** https://www.guiasnintendo.com/1_GAMEBOY_ADVANCE/Golden_Sun/Golden_Sun_sp/imagenes/mapas/vale.jpg

---

## Authentic Vale Village Structure

Based on the authentic Golden Sun map, Vale Village consists of:

### Areas (5 distinct zones):
1. **Northern Area** - Sol Sanctum entrance, Elder's house, plaza
2. **Central Area** - Main paths, Isaac's house, shops, gathering spots
3. **Eastern Area** - More houses, gardens, paths
4. **Western Area** - Houses, farmland
5. **Southern Area** - Vale Gate (exit to world map), southern houses

### Buildings (~25-30 total):
1. ✅ Isaac's House (Northwest)
2. ✅ Garet's House (Southwest) 
3. ✅ Elder's House (North-Central) - EXPAND (bigger in authentic)
4. ✅ Item Shop (East)
5. ✅ Armor Shop (Southeast)
6. ✅ Inn (East)
7. ✅ Sanctum Shrine (North) - Entrance to Sol Sanctum
8. ❌ Jenna's House
9. ❌ Kraden's House
10. ❌ Villager House 1
11. ❌ Villager House 2
12. ❌ Villager House 3
13. ❌ Villager House 4
14. ❌ Villager House 5
15. ❌ Villager House 6
16. ❌ Villager House 7
17. ❌ Villager House 8
18. ❌ Blacksmith Shop
19. ❌ Sanctum Guard Post
20. ❌ Storage Buildings (2-3)
21. ❌ Barn/Farmhouse
22. ❌ Well House
23. ❌ Plaza Pavilions (2)
24. ❌ Watchtower (near gate)
25. ❌ Gardens/Green houses (3-4)

### NPCs (~40-50 total):
**Currently Have (16):**
- Isaac, Garet, Jenna (party members)
- Elder, Kraden (story NPCs)
- Kyle, Dora (Isaac's parents)
- Aaron & Kay Jerra (Jenna's parents)
- Innkeeper, Armorshop Owner (merchants)
- Great Healer (special NPC)
- Scholars (2)
- Generic Villagers (3)

**Need to Add (~25-30 more):**
- Villagers in each house
- Farmers
- Children playing
- Guards at gates/sanctum
- Shopkeepers
- Blacksmith
- Town folk walking paths
- Elderly villagers
- Women, men, children variants

### Terrain Features:
**Currently Have:**
- Basic grass background
- Simple dirt paths (4 paths)
- Trees (4 trees)
- Vale Gate

**Need to Add:**
- Fences (LOTS - surround houses, gardens, paths)
- Gardens/Flowers
- Water features (wells, ponds)
- Rocks/Boulders
- Bridges (if water)
- Grass variations (darker/lighter)
- Cobblestone paths
- Steps/Stairs (for elevation indicators)
- Signs
- Street lamps/Torches
- Barrels, Crates

---

## Phase 1: Expand Map Size & Core Layout

### Task 1.1: Increase Scene Bounds (Coder)
**Current:** ~960x640px (small)
**Target:** ~1920x1280px (2-3x bigger for full traversal)

**Files:**
- `src/systems/overworldSystem.ts` - Update `createValeVillageScene()`
- `src/systems/movementSystem.ts` - Update camera bounds

**Action:**
1. Expand scene dimensions to 1920x1280px
2. Update camera bounds to allow full traversal
3. Keep player movement smooth (no jittery camera)

### Task 1.2: Layout All 5 Areas (Coder)
**Action:**
1. Northern Area (0-400px Y): Sol Sanctum, Elder's house, plaza
2. Central Area (400-800px Y): Isaac/Garet houses, main paths
3. Eastern Area (960-1920px X): Houses, gardens
4. Western Area (0-480px X): Houses, farmland
5. Southern Area (1000-1280px Y): Vale Gate, southern houses

---

## Phase 2: Add ALL Buildings (Coder + Graphics)

### Task 2.1: Place All Buildings (Coder)
**File:** `src/systems/overworldSystem.ts`

**Action:**
1. Add 20-25 more buildings to scene data
2. Position based on authentic map layout
3. Define collision rectangles for each
4. Mark enterable vs non-enterable

### Task 2.2: Find/Create Building Sprites (Graphics)
**Needed:**
- Generic house sprites (small, medium, large) - 3 variants
- Shop sprites (item shop, armor shop, blacksmith) - 3 sprites
- Special buildings (Elder's house, Sanctum, Inn) - 3 sprites
- Storage buildings (barn, shed) - 2 sprites
- Garden structures - 2 sprites

**Sources:**
- Check if sprites exist in mockup assets
- Search "Golden Sun building sprites" online
- Spriters Resource (spriters-resource.com)
- Extract from GBA ROM if needed

### Task 2.3: Integrate Building Sprites (Graphics)
**Files:**
- `public/assets/buildings/` (NEW directory)
- `src/data/valeBuildingSpriteRegistry.ts` (NEW)
- Update scene rendering to use building sprites

---

## Phase 3: Add ALL NPCs (Coder + Graphics)

### Task 3.1: Place All NPCs (Coder)
**File:** `src/systems/npcSystem.ts`, scene data

**Action:**
1. Add 25-30 more NPCs to Vale scene
2. Position NPCs logically (in/near houses, on paths, in plaza)
3. Assign dialogues (simple greetings if not story-related)
4. Set facing directions based on activity

### Task 3.2: Find/Create NPC Sprites (Graphics)
**Needed:**
- Generic villagers (men, women, children) - 10+ variants
- Farmers - 2-3 sprites
- Guards - 2 sprites
- Elderly - 2 sprites
- Children - 3-4 sprites
- Special NPCs (blacksmith, etc.) - 3 sprites

**Sources:**
- Check existing mockup assets (we have some)
- Search "Golden Sun NPC sprites"
- Reuse party member sprites for background NPCs if needed

### Task 3.3: Integrate NPC Sprites (Graphics)
**Files:**
- Copy sprites to `public/assets/npcs/` or use existing
- Update NPC registry with sprite paths
- Verify all load correctly

---

## Phase 4: Add Terrain & Decorations (Graphics Heavy)

### Task 4.1: Terrain Tiles (Graphics)
**Needed:**
- Grass tiles (light, dark, variations) - tileable 16x16px
- Path tiles (dirt, cobblestone) - tileable 16x16px
- Water tiles (if ponds) - animated 16x16px

**Action:**
1. Find Golden Sun terrain tilesets
2. Create tilemap system for terrain
3. Paint full map with varied terrain

### Task 4.2: Fences & Borders (Graphics)
**Needed:**
- Wooden fence sprites (horizontal, vertical, corners)
- Stone wall sprites
- Hedge sprites

**Action:**
1. Find fence sprites
2. Add fences around:
   - All houses
   - Gardens
   - Path edges
   - Plaza borders
3. Update collision to include fences

### Task 4.3: Decorations (Graphics)
**Needed:**
- Trees (have Tree1, Tree2 - need more)
- Flowers/Gardens
- Rocks
- Wells
- Barrels/Crates
- Signs
- Lamps

**Action:**
1. Find decoration sprites
2. Scatter throughout Vale
3. Add collision for solid objects (rocks, barrels)

---

## Phase 5: Perfect Collision System (Coder)

### Task 5.1: Comprehensive Collision Data
**File:** `src/systems/movementSystem.ts`

**Action:**
1. Define collision rectangles for:
   - ALL buildings
   - ALL fences
   - ALL solid decorations (trees, rocks, etc.)
   - Water features
   - Non-walkable terrain
2. Organize by collision layers (buildings, objects, terrain)

### Task 5.2: Collision Testing & Refinement
**Action:**
1. Test player movement in all areas
2. Ensure NO clipping through objects
3. Adjust collision boundaries for smooth movement
4. Add collision debug mode (show boundaries)

---

## Phase 6: Movement Polish & Fun Factor (Coder)

### Task 6.1: Smooth Movement
**Action:**
1. Ensure 60 FPS movement
2. No camera jitter
3. Smooth acceleration/deceleration
4. Responsive controls

### Task 6.2: Interactive Elements
**Action:**
1. Add sparkles/indicators for:
   - Enterable doors
   - Interactable NPCs
   - Items on ground
2. Add footstep sounds (optional)
3. Add visual feedback for interactions

### Task 6.3: Shortcuts & Quality of Life
**Action:**
1. Fast travel points (if player has been there)
2. Minimap in corner
3. Location labels when entering areas

---

## Phase 7: Testing & Screenshots

### Task 7.1: Full Traversal Test
**Action:**
1. Walk from north (Sanctum) to south (Gate)
2. Walk from west to east
3. Enter every building
4. Talk to every NPC
5. Verify no collision bugs

### Task 7.2: Screenshot Documentation
**Action:**
1. Northern area screenshot
2. Central area screenshot
3. Eastern area screenshot
4. Western area screenshot
5. Southern area screenshot
6. Full map overview (zoomed out if possible)

---

## Current Assets Inventory

### ✅ Sprites We Have:
**Characters (27):**
- Isaac.gif
- Garet.gif
- Jenna.gif
- Ivan.gif
- Mia.gif
- Felix.gif
- Piers.gif
- Sheba.gif
- Saturos.gif
- Alex.gif
- Kraden.gif
- Elder.gif
- Dora.gif
- Kyle.gif
- Aaron_Jerra.gif
- Kay_Jerra.gif
- Innkeeper.gif
- Armorshop_Owner.gif
- Great_Healer.gif
- Scholar-1.gif
- Scholar-2.gif
- Villager1.gif
- Villager2.gif
- Villager3.gif

**Terrain/Objects (3):**
- Tree1.gif
- Tree2.gif
- Vale_Gate.gif

### ❌ Sprites We Need:
**Buildings (~10-15 sprites):**
- House sprites (small, medium, large variants)
- Shop sprites
- Inn sprite
- Elder's house (larger)
- Sanctum entrance
- Barn/Storage
- Guards posts

**NPCs (~10-15 more sprites):**
- More generic villagers
- Farmers
- Guards
- Children
- Elderly
- Blacksmith

**Terrain/Decorations (~20-30 sprites):**
- Grass tiles
- Path tiles
- Fence sprites (many)
- Flower/Garden sprites
- Well sprite
- Rock sprites
- Barrel/Crate sprites
- Sign sprites
- Lamp sprites
- Water tiles

---

## Time Estimates

**Phase 1 (Map Expansion):** 2-3 hours
**Phase 2 (Buildings):** 6-8 hours
**Phase 3 (NPCs):** 4-6 hours
**Phase 4 (Terrain):** 8-12 hours
**Phase 5 (Collision):** 3-4 hours
**Phase 6 (Polish):** 2-3 hours
**Phase 7 (Testing):** 2-3 hours

**Total:** 27-39 hours for 100% authentic Vale

---

## Success Criteria

### Functional:
- [ ] Can walk from north (Sanctum) to south (Gate) seamlessly
- [ ] Can walk from west edge to east edge seamlessly
- [ ] ALL buildings have sprites (no placeholder boxes)
- [ ] ALL NPCs have sprites (no colored circles)
- [ ] Perfect collision (no clipping)
- [ ] Smooth camera follow
- [ ] 25-30 buildings total
- [ ] 40-50 NPCs total

### Visual:
- [ ] REAL Golden Sun sprites everywhere
- [ ] Authentic Vale atmosphere
- [ ] Varied terrain (not flat green)
- [ ] Fences around houses/gardens
- [ ] Decorations add life to town
- [ ] Visual quality: 9/10+

### Gameplay:
- [ ] Fun to explore (interesting paths, discoveries)
- [ ] Clear navigation (not confusing)
- [ ] NPCs give town personality
- [ ] Feels like a living village

---

**STATUS:** Ready to begin Phase 1
**NEXT:** Expand map size and layout all 5 areas
