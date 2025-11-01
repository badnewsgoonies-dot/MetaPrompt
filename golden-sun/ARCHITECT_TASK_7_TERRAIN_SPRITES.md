# Task 7: Verify & Enhance Terrain Sprites (GRAPHICS)

**ROLE:** Graphics AI
**TYPE:** Sprite Verification + Enhancement
**PRIORITY:** P2 - MEDIUM
**EST TIME:** 2-3 hours

---

## 📋 Context

- **Project:** Golden Sun - Vale Village Terrain/Scenery Sprites
- **Current State:** Trees and gate sprites exist
- **Target State:** Verify terrain sprites, add grass/path textures if needed

---

## 🎯 Objective

Verify existing terrain sprites (trees, gate). Check if additional terrain decoration needed. Create terrain sprite registry.

---

## 📦 Requirements

### 1. Verify Existing Terrain Sprites

**Current terrain objects (5):**
- tree-nw: Tree1.gif
- tree-ne: Tree2.gif
- tree-n1: Tree1.gif
- tree-n2: Tree2.gif
- vale-gate: Vale_Gate.gif

**Action:** Verify all 5 files exist and display correctly

### 2. Assess Additional Terrain Needs

**Consider adding:**
- Grass decoration sprites (flowers, bushes)
- Path/road textures (dirt paths)
- Water features (if any)
- Rocks/stones decoration
- Fences/barriers

**Note:** Keep minimal if existing looks good

### 3. Create Terrain Sprite Registry

**File:** `src/data/terrainSpriteRegistry.ts` (NEW)

```typescript
export interface TerrainSprite {
  id: string;
  type: 'tree' | 'gate' | 'decoration' | 'path';
  path: string;
  width: number;
  height: number;
  collision: boolean;
}

export const TERRAIN_SPRITES: Record<string, TerrainSprite> = {
  // All terrain objects
};
```

### 4. Verify in Browser

**Action:**
1. Check that all terrain sprites display correctly
2. Verify collision on trees and gate
3. Check for visual quality issues

---

## ✅ Acceptance Criteria

- [ ] All 5 terrain sprites verified
- [ ] Terrain sprite registry created
- [ ] Zero 404 errors
- [ ] Terrain displays correctly in game
- [ ] TypeScript compiles with 0 errors
- [ ] Build succeeds

---

**STATUS:** Ready for Graphics AI execution
**EST TIME:** 2-3 hours (mostly verification, minimal additions)
