# Task 2: Add All Buildings to Vale Village (20+ Buildings)

**ROLE:** Coder AI
**TYPE:** Data Creation + Integration
**TEMPLATE:** Template 3 (System Creation) + Template 2 (Type Modification)
**PRIORITY:** P0 - CRITICAL
**EST TIME:** 4-6 hours

---

## 📋 Context

- **Project:** Golden Sun - Vale Village Full Expansion
- **Pattern:** Pure functions, data-driven architecture
- **Owner:** Coder AI
- **Current State:** Vale is 1920x1280px with 7 buildings
- **Target State:** Vale has 25-28 buildings covering all areas
- **Reference:** Authentic Golden Sun Vale map (SUPER EXTENSIVE)

---

## 🎯 Objective

Add 18-21 more buildings to Vale Village to match authentic layout. Place buildings logically across all 5 areas (Northern, Central, Eastern, Western, Southern). Update collision system to include all buildings. Create enterable vs non-enterable building distinction.

---

## 📦 Requirements

### 1. Add Buildings to sprite_map.json

**File:** `public/sprite_map.json` - `buildings` array

**Current Buildings (7):**
1. Isaac's House
2. Garet's House  
3. Elder's House
4. Item Shop
5. Armor Shop
6. Inn
7. Kraden's House

**Add These Buildings (18-21):**

#### Northern Area (Sol Sanctum / Plaza):
8. **Sanctum Entrance** - Large special building
   - Position: `{x: 900, y: 120}`
   - Size: `{width: 160, height: 140}`
   - Enterable: true
   - Door: `{x: 980, y: 250}`

9. **Sanctum Guard Post** - Small guard building
   - Position: `{x: 760, y: 200}`
   - Size: `{width: 80, height: 70}`
   - Enterable: false

10. **Plaza Pavilion 1** - Open pavilion (no roof)
    - Position: `{x: 1100, y: 180}`
    - Size: `{width: 96, height: 80}`
    - Enterable: false

#### Central Area (Main Village):
11. **Jenna's House** - Medium house
    - Position: `{x: 520, y: 680}`
    - Size: `{width: 96, height: 80}`
    - Enterable: true
    - Door: `{x: 568, y: 750}`

12. **Villager House 1** - Small house
    - Position: `{x: 320, y: 600}`
    - Size: `{width: 80, height: 70}`
    - Enterable: true
    - Door: `{x: 360, y: 660}`

13. **Villager House 2** - Small house
    - Position: `{x: 600, y: 540}`
    - Size: `{width: 80, height: 70}`
    - Enterable: true
    - Door: `{x: 640, y: 600}`

14. **Blacksmith Shop** - Medium shop
    - Position: `{x: 1100, y: 600}`
    - Size: `{width: 96, height: 80}`
    - Enterable: true
    - Door: `{x: 1148, y: 670}`

15. **Well House** - Tiny structure
    - Position: `{x: 720, y: 620}`
    - Size: `{width: 48, height: 48}`
    - Enterable: false

#### Eastern Area (Residential):
16. **Villager House 3** - Medium house
    - Position: `{x: 1360, y: 400}`
    - Size: `{width: 96, height: 80}`
    - Enterable: true
    - Door: `{x: 1408, y: 470}`

17. **Villager House 4** - Small house
    - Position: `{x: 1520, y: 500}`
    - Size: `{width: 80, height: 70}`
    - Enterable: true
    - Door: `{x: 1560, y: 560}`

18. **Villager House 5** - Small house
    - Position: `{x: 1400, y: 640}`
    - Size: `{width: 80, height: 70}`
    - Enterable: true
    - Door: `{x: 1440, y: 700}`

19. **Garden Greenhouse** - Small glass structure
    - Position: `{x: 1600, y: 720}`
    - Size: `{width: 80, height: 70}`
    - Enterable: false

20. **Storage Shed 1** - Tiny shed
    - Position: `{x: 1680, y: 600}`
    - Size: `{width: 64, height: 60}`
    - Enterable: false

#### Western Area (Farmland):
21. **Villager House 6** - Medium house
    - Position: `{x: 200, y: 540}`
    - Size: `{width: 96, height: 80}`
    - Enterable: true
    - Door: `{x: 248, y: 610}`

22. **Barn** - Large farm building
    - Position: `{x: 120, y: 720}`
    - Size: `{width: 128, height: 110}`
    - Enterable: false

23. **Storage Shed 2** - Small shed
    - Position: `{x: 280, y: 800}`
    - Size: `{width: 64, height: 60}`
    - Enterable: false

24. **Farmhouse** - Medium house
    - Position: `{x: 160, y: 940}`
    - Size: `{width: 96, height: 80}`
    - Enterable: true
    - Door: `{x: 208, y: 1010}`

#### Southern Area (Gate District):
25. **Villager House 7** - Small house
    - Position: `{x: 600, y: 1040}`
    - Size: `{width: 80, height: 70}`
    - Enterable: true
    - Door: `{x: 640, y: 1100}`

26. **Villager House 8** - Small house
    - Position: `{x: 1200, y: 1060}`
    - Size: `{width: 80, height: 70}`
    - Enterable: true
    - Door: `{x: 1240, y: 1120}`

27. **Watchtower** - Tall narrow building
    - Position: `{x: 880, y: 1140}`
    - Size: `{width: 64, height: 100}`
    - Enterable: false

28. **Gate Guard Post** - Small guard building
    - Position: `{x: 1040, y: 1160}`
    - Size: `{width: 80, height: 70}`
    - Enterable: false

**JSON Structure for Each Building:**
```json
{
  "id": "building-id",
  "name": "Building Name",
  "sprite": "placeholder",
  "position": {"x": 000, "y": 000},
  "size": {"width": 00, "height": 00},
  "z_index": 5,
  "enterable": true/false,
  "door_position": {"x": 000, "y": 000},
  "interior": "interior-scene-id"
}
```

**For non-enterable buildings:**
- Omit `door_position` and `interior` fields
- Set `enterable: false`

---

### 2. Update overworldSystem.ts Obstacles

**File:** `src/systems/overworldSystem.ts` - `createValeVillageScene()` function

**Action:**
Add obstacle collision rectangles for ALL 21 new buildings in the `obstacles` array.

**Example:**
```typescript
obstacles: [
  // Existing 3 buildings (already scaled)
  { id: 'isaac-house', position: { x: 360, y: 400 }, width: 160, height: 120, type: 'building' },
  { id: 'item-shop', position: { x: 860, y: 300 }, width: 160, height: 120, type: 'building' },
  { id: 'armor-shop', position: { x: 1260, y: 500 }, width: 160, height: 120, type: 'building' },
  
  // NEW: Add 21 more buildings
  { id: 'sanctum-entrance', position: { x: 900, y: 120 }, width: 160, height: 140, type: 'building' },
  { id: 'sanctum-guard-post', position: { x: 760, y: 200 }, width: 80, height: 70, type: 'building' },
  // ... continue for all 21 buildings
],
```

**Collision Rectangles:**
- Use exact same position and size as in sprite_map.json
- Type: Always `'building'`
- ID: Match building ID from sprite_map.json

---

### 3. Add Doors for Enterable Buildings

**File:** `src/systems/overworldSystem.ts` - `createValeVillageScene()` function

**Action:**
Add door triggers for all 11 NEW enterable buildings in the `doors` array.

**Enterable Buildings (11 new):**
1. Sanctum Entrance
2. Jenna's House
3. Villager House 1
4. Villager House 2
5. Blacksmith Shop
6. Villager House 3
7. Villager House 4
8. Villager House 5
9. Villager House 6
10. Farmhouse
11. Villager House 7
12. Villager House 8

**Example Door:**
```typescript
{
  id: 'jenna-house-entrance',
  position: { x: 568, y: 750 },
  width: 32,
  height: 8,
  targetScene: 'jenna-house',
  targetPosition: { x: 240, y: 280 },
  requiresInteraction: true,
  locked: false
}
```

**Door Position Notes:**
- Door position is at building's front entrance
- Width: 32px (standard door width)
- Height: 8px (thin trigger zone)
- targetScene: `'building-id'` (will create interiors later)
- targetPosition: Standard interior spawn `{ x: 240, y: 280 }`

---

## ✅ Acceptance Criteria

### Functional Requirements:
- [ ] 21 new buildings added to sprite_map.json (28 total)
- [ ] All 21 buildings have collision obstacles in overworldSystem.ts
- [ ] 11 enterable buildings have door triggers
- [ ] 10 non-enterable buildings have no doors
- [ ] Buildings distributed across all 5 areas
- [ ] No overlapping buildings
- [ ] Player can walk between all buildings
- [ ] Collision prevents walking through any building

### Data Validation:
- [ ] All building IDs are unique
- [ ] All positions are within scene bounds (0-1920, 0-1280)
- [ ] Door positions match building positions
- [ ] Obstacle sizes match sprite_map sizes
- [ ] JSON syntax is valid (no trailing commas, proper brackets)

### Technical Requirements:
- [ ] TypeScript compiles with 0 errors
- [ ] No console errors during gameplay
- [ ] Build succeeds (`npm run build`)
- [ ] sprite_map.json is valid JSON

### Testing Checklist:
- [ ] Walk to northern area, see Sanctum buildings
- [ ] Walk to eastern area, see residential houses
- [ ] Walk to western area, see farms/barns
- [ ] Walk to southern area, see gate buildings
- [ ] Collision works on all 28 buildings (can't walk through any)
- [ ] Can interact with doors on enterable buildings
- [ ] No collision bugs or clipping

---

## 🚫 Out of Scope (Do NOT do these)

- ❌ Creating building sprites (Graphics AI Task 5)
- ❌ Creating interior scenes (Future task)
- ❌ Adding NPCs to buildings (Task 3)
- ❌ Adding furniture/decorations inside buildings
- ❌ Implementing door unlock logic (keep all unlocked)
- ❌ Adding building-specific functionality

**This task ONLY:**
- ✅ Add building data to sprite_map.json
- ✅ Add collision obstacles
- ✅ Add door triggers
- ✅ Verify JSON validity
- ✅ Test collision

---

## 📊 Quality Gates (Run Before Completion Report)

```bash
# 1. Validate JSON
cd /workspace/golden-sun
node -e "JSON.parse(require('fs').readFileSync('public/sprite_map.json'))" && echo "✅ JSON valid" || echo "❌ JSON invalid"

# 2. TypeScript compilation
npm run type-check
# MUST: 0 errors

# 3. Build
npm run build
# MUST: Success

# 4. Manual Testing
npm run dev
# Test collision on all buildings
```

---

## ✅ Completion Report Template

```markdown
## ✅ COMPLETION REPORT: Add All Buildings to Vale Village (Task 2)

### Summary
[2-3 sentences]

### Files Modified
- `public/sprite_map.json` - Added 21 new buildings
- `src/systems/overworldSystem.ts` - Added 21 obstacles + 11 doors

### Buildings Added (21)
**Northern Area (3):**
- [x] Sanctum Entrance
- [x] Sanctum Guard Post
- [x] Plaza Pavilion 1

**Central Area (5):**
- [x] Jenna's House
- [x] Villager House 1
- [x] Villager House 2
- [x] Blacksmith Shop
- [x] Well House

**Eastern Area (5):**
- [x] Villager House 3
- [x] Villager House 4
- [x] Villager House 5
- [x] Garden Greenhouse
- [x] Storage Shed 1

**Western Area (4):**
- [x] Villager House 6
- [x] Barn
- [x] Storage Shed 2
- [x] Farmhouse

**Southern Area (4):**
- [x] Villager House 7
- [x] Villager House 8
- [x] Watchtower
- [x] Gate Guard Post

### Building Counts
- **Total Buildings:** 28 (7 existing + 21 new)
- **Enterable:** 18 buildings (7 existing + 11 new)
- **Non-enterable:** 10 buildings (0 existing + 10 new)
- **Doors Added:** 11 new doors
- **Collision Obstacles:** 28 total

### Quality Gates
- ✅ TypeScript: 0 errors
- ✅ JSON Valid: Yes
- ✅ Build: Success
- ✅ Manual Testing: All buildings have collision

### Area Distribution
- Northern: 3 buildings
- Central: 5 buildings  
- Eastern: 5 buildings
- Western: 4 buildings
- Southern: 4 buildings
- **Total:** 21 new buildings

### Next Steps
Ready for Task 3 (Add All NPCs) and Graphics Task 5 (Find Building Sprites)

---

**Task 2 Complete. Ready for Architect review.**
```

---

## ⏱️ Time Estimate

**4-6 hours**

**Breakdown:**
- Add 21 buildings to sprite_map.json: 1-2 hours
- Add 21 collision obstacles: 30-60 min
- Add 11 door triggers: 30-60 min
- Validate JSON + test: 1-2 hours
- Debugging: 1 hour buffer

---

## 📝 Building Placement Strategy

**Design Principles:**
1. **Logical grouping** - Houses near each other, shops in commercial area
2. **Path access** - All buildings accessible from paths
3. **Spacing** - Minimum 40px between buildings for walking
4. **Sight lines** - Don't block important buildings
5. **Area identity** - Each area feels distinct

**Area Themes:**
- **Northern:** Sacred/official (Sanctum, Elder, plaza)
- **Central:** Commercial/social (shops, gathering spots)
- **Eastern:** Residential (mostly houses)
- **Western:** Agricultural (farms, barns, storage)
- **Southern:** Gateway (gate, guards, travelers)

---

**STATUS:** Ready for Coder AI execution
**DEPENDENCIES:** Task 1 complete
**BLOCKS:** Task 3 (NPCs), Graphics Task 5 (Building sprites)
