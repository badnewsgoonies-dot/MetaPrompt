# Task 5: Find & Integrate Building Sprites (GRAPHICS)

**ROLE:** Graphics AI
**TYPE:** Sprite Integration
**TEMPLATE:** Graphics Task (HIGH RISK - 100+ sprites)
**PRIORITY:** P0 - CRITICAL
**EST TIME:** 6-8 hours

---

## 📋 Context

- **Project:** Golden Sun - Vale Village REAL Sprites Integration
- **Owner:** Graphics AI
- **Current State:** 28 buildings use brown placeholder boxes
- **Target State:** ALL 28 buildings use authentic Golden Sun sprites
- **Quality:** 9/10+ visual, authentic GBA Golden Sun aesthetic

---

## 🎯 Objective

Find or extract authentic Golden Sun building sprites for all 28 Vale buildings. Organize sprites in proper directory structure. Integrate into game. Verify NO 404 errors. Achieve authentic Golden Sun visual quality.

---

## 📦 Requirements

### 1. Find Building Sprites

**Buildings Needed (28 total):**

**Houses (15 sprites):**
- Isaac's House - Large hero house
- Garet's House - Large hero house
- Jenna's House - Medium house
- Elder's House - Special large house (ornate)
- Kraden's House - Scholar house (books visible)
- Villager Houses (8) - Small/medium generic houses (need 3-4 variants)
- Farmhouse - Rural house style

**Shops (4 sprites):**
- Item Shop - Shop with item sign/symbol
- Armor Shop - Shop with weapon/armor symbol
- Blacksmith Shop - Forge/anvil visible
- Inn - House with rest symbol

**Special Buildings (9 sprites):**
- Sol Sanctum Entrance - Large ornate temple entrance
- Sanctum Guard Post - Small guard building
- Plaza Pavilion - Open pavilion (columns, no roof)
- Well House - Small well structure
- Greenhouse - Glass/garden structure
- Storage Sheds (2) - Small wooden sheds (can use same sprite)
- Barn - Large farm building
- Watchtower - Tall narrow tower
- Gate Guard Post - Small guard post

**Sprite Requirements:**
- Format: GIF or PNG with transparency
- Size: 48x48 to 192x192px (varies by building)
- Style: Authentic Golden Sun GBA aesthetic
- Quality: Clear, no artifacts, proper transparency

**Where to Find:**
1. **Spriters Resource:** https://www.spriters-resource.com/game_boy_advance/goldensun/
2. **Existing mockups:** Check `/workspace/mockup-examples/overworld-village/`
3. **ROM extraction:** Extract from Golden Sun GBA ROM if available
4. **Similar games:** Golden Sun: The Lost Age, other GBA RPGs

### 2. Organize Sprites

**Create Directory Structure:**
```
/workspace/golden-sun/public/assets/buildings/
  ├── houses/
  │   ├── isaac-house.gif
  │   ├── garet-house.gif
  │   ├── jenna-house.gif
  │   ├── elder-house.gif
  │   ├── kraden-house.gif
  │   ├── villager-house-1.gif
  │   ├── villager-house-2.gif
  │   ├── villager-house-3.gif
  │   └── farmhouse.gif
  ├── shops/
  │   ├── item-shop.gif
  │   ├── armor-shop.gif
  │   ├── blacksmith.gif
  │   └── inn.gif
  └── special/
      ├── sanctum-entrance.gif
      ├── sanctum-guard-post.gif
      ├── plaza-pavilion.gif
      ├── well.gif
      ├── greenhouse.gif
      ├── storage-shed.gif
      ├── barn.gif
      ├── watchtower.gif
      └── gate-guard-post.gif
```

### 3. Update sprite_map.json

**File:** `public/sprite_map.json` - Update `sprite` field for all 28 buildings

**Change from:**
```json
"sprite": "placeholder"
```

**To:**
```json
"sprite": "./assets/buildings/houses/isaac-house.gif"
```

**For ALL 28 buildings** - update each sprite path to point to actual sprite file.

### 4. Verify Sprites Load

**Action:**
1. Open game in browser
2. Check console for 404 errors
3. Verify all 28 buildings display sprites
4. Check that sprites match building purposes (shop looks like shop, house looks like house)
5. Verify sprites are sized correctly

### 5. Create Building Sprite Registry

**File:** `src/data/buildingSpriteRegistry.ts` (NEW)

```typescript
export interface BuildingSprite {
  id: string;
  path: string;
  width: number;
  height: number;
  type: 'house' | 'shop' | 'special';
}

export const BUILDING_SPRITES: Record<string, BuildingSprite> = {
  'isaac-house': {
    id: 'isaac-house',
    path: '/assets/buildings/houses/isaac-house.gif',
    width: 192,
    height: 160,
    type: 'house'
  },
  // ... all 28 buildings
};
```

---

## ✅ Acceptance Criteria

### Sprite Requirements:
- [ ] Found authentic Golden Sun sprites for all 28 buildings
- [ ] All sprites saved to proper directories
- [ ] All sprites are GIF or PNG with transparency
- [ ] Sprite sizes appropriate (48-192px)
- [ ] Visual quality: 9/10+ authentic GBA style

### Integration Requirements:
- [ ] All 28 building sprites referenced in sprite_map.json
- [ ] Building sprite registry created
- [ ] Zero 404 errors in console
- [ ] All buildings display correctly in game
- [ ] Sprites match building purposes (shop = shop, house = house)

### Visual Quality:
- [ ] Buildings look authentic to Golden Sun
- [ ] Sprites scaled appropriately
- [ ] No pixelation issues
- [ ] Transparency works correctly
- [ ] Buildings distinct and recognizable

### Manual Testing:
- [ ] Open game on desktop
- [ ] Walk to all 5 areas of Vale
- [ ] Visually inspect all 28 buildings
- [ ] Verify sprites load (no missing images)
- [ ] Screenshot each area for documentation

---

## 🚫 Out of Scope

- ❌ Modifying game logic (Coder's job)
- ❌ Changing collision boxes (already done in Task 4)
- ❌ Creating custom sprites from scratch (use authentic sprites)
- ❌ Adding building interiors (future task)
- ❌ Implementing door animations

**This task ONLY:**
- ✅ Find sprites
- ✅ Organize sprites
- ✅ Update sprite paths
- ✅ Create registry
- ✅ Verify loading

---

## 📊 Quality Gates

```bash
# 1. Check for 404 errors
# Open browser console, look for failed image loads

# 2. Visual inspection
# Walk through all 5 areas, verify all buildings visible

# 3. Screenshot documentation
# Capture each area showing real sprites
```

---

## ✅ Completion Report Template

```markdown
## ✅ COMPLETION REPORT: Building Sprite Integration (Task 5)

### Summary
[2-3 sentences about sprite sourcing and integration]

### Sprites Found & Integrated
**Houses (15):**
- [x] Isaac's House - [source]
- [x] Garet's House - [source]
- [... list all 15]

**Shops (4):**
- [x] Item Shop - [source]
- [... list all 4]

**Special (9):**
- [x] Sanctum Entrance - [source]
- [... list all 9]

### Files Created
- `public/assets/buildings/houses/` - 15 house sprites
- `public/assets/buildings/shops/` - 4 shop sprites
- `public/assets/buildings/special/` - 9 special building sprites
- `src/data/buildingSpriteRegistry.ts` - Sprite registry

### Files Modified
- `public/sprite_map.json` - Updated 28 sprite paths

### Screenshots
- Northern area: [screenshot path]
- Central area: [screenshot path]
- Eastern area: [screenshot path]
- Western area: [screenshot path]
- Southern area: [screenshot path]

### Quality Checks
- ✅ No 404 errors
- ✅ All 28 buildings display sprites
- ✅ Visual quality: [9/10 or 10/10]
- ✅ Authentic Golden Sun aesthetic
- ✅ Sprites sized correctly

### Issues Encountered
[List any sprite sourcing challenges and solutions]

### Next Steps
Ready for Task 6 (NPC Sprites)

---

**Task 5 Complete. Ready for Architect review.**
```

---

## ⏱️ Time Estimate

**6-8 hours**

**Breakdown:**
- Find/extract sprites: 3-4 hours
- Organize and prepare: 1 hour
- Integrate into sprite_map.json: 1 hour
- Create registry: 30 min
- Test and verify: 1-1.5 hours

---

**STATUS:** Ready for Graphics AI execution
**RISK LEVEL:** HIGH (100+ sprites)
**SUCCESS RATE:** 60-70%
