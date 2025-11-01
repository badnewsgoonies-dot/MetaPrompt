# Task 4: Perfect Collision System

**ROLE:** Coder AI
**TYPE:** System Refinement
**TEMPLATE:** Template 6 (Refactoring)
**PRIORITY:** P1 - HIGH
**EST TIME:** 2-3 hours

---

## 📋 Context

- **Project:** Golden Sun - Vale Village Full Expansion
- **Pattern:** Pure functions, efficient collision detection
- **Owner:** Coder AI
- **Current State:** Basic collision for 28 buildings, NPCs use circle collision
- **Target State:** Perfect collision with no clipping, optimized detection

---

## 🎯 Objective

Refine collision system to ensure player cannot clip through any objects. Add collision for scenery (trees, gate). Optimize collision detection for 50+ entities. Test all edges and corners.

---

## 📦 Requirements

### 1. Add Scenery Collision to Scene

**File:** `src/systems/overworldSystem.ts` - `createValeVillageScene()` obstacles array

**Current:** Only buildings have collision (28)

**Add:** Scenery collision (5 objects)

```typescript
obstacles: [
  // ... existing 28 buildings ...
  
  // Scenery collision
  { id: 'tree-nw', position: { x: 240, y: 280 }, width: 32, height: 32, type: 'scenery' },
  { id: 'tree-ne', position: { x: 1680, y: 280 }, width: 32, height: 32, type: 'scenery' },
  { id: 'tree-n1', position: { x: 720, y: 160 }, width: 32, height: 32, type: 'scenery' },
  { id: 'tree-n2', position: { x: 1200, y: 160 }, width: 32, height: 32, type: 'scenery' },
  { id: 'vale-gate', position: { x: 880, y: 1080 }, width: 80, height: 40, type: 'scenery' }
],
```

### 2. Test Collision on All Buildings

**Action:** Manually test collision on all 28 buildings

**Test each building:**
1. Walk up to each side (north, south, east, west)
2. Verify player stops at edge (no clipping)
3. Check corners (no diagonal clipping)
4. Verify door interaction zones work

**Buildings to test (28):**
- Isaac's House
- Garet's House
- Elder's House
- Item Shop
- Armor Shop
- Inn
- Kraden's House
- Sanctum Entrance
- Sanctum Guard Post
- Plaza Pavilion
- Jenna's House
- Villager Houses (1-8)
- Blacksmith Shop
- Well House
- Greenhouse
- Storage Sheds (1-2)
- Barn
- Farmhouse
- Watchtower
- Gate Guard Post

### 3. Fix Any Collision Issues

**Common issues to fix:**
1. **Gap between obstacles** - Player slips through
   - Fix: Ensure obstacles touch or overlap slightly
2. **Offset collision boxes** - Collision doesn't match visual
   - Fix: Adjust position/size to match sprite
3. **Corner clipping** - Player clips at building corners
   - Fix: Increase building size by 2-4px
4. **Door zones blocking** - Can't enter buildings
   - Fix: Adjust door position to be outside collision box

### 4. Optimize NPC Collision Detection

**File:** `src/systems/movementSystem.ts` - NPC collision functions

**Current:** Checks all NPCs every frame

**Optimize:** Only check nearby NPCs (within viewport + buffer)

```typescript
// Add spatial optimization
export function getNearbyNPCsForCollision(
  playerPos: NPCPosition,
  allNPCs: NPC[],
  checkRadius: number = 200 // Only check NPCs within 200px
): NPC[] {
  return allNPCs.filter(npc => {
    const dx = npc.position.x - playerPos.x;
    const dy = npc.position.y - playerPos.y;
    const distance = Math.sqrt(dx * dx + dy * dy);
    return distance <= checkRadius;
  });
}
```

### 5. Add Scene Bounds Collision

**File:** `src/systems/movementSystem.ts`

**Ensure:** Player cannot walk outside scene bounds (0-1920, 0-1280)

**Current:** Camera clamps but player position might exceed

**Fix:** Clamp player position in updatePlayerMovement:

```typescript
// After calculating new position, clamp to scene bounds
const clampedX = Math.max(PLAYER_COLLISION_RADIUS, Math.min(newX, SCENE_WIDTH - PLAYER_COLLISION_RADIUS));
const clampedY = Math.max(PLAYER_COLLISION_RADIUS, Math.min(newY, SCENE_HEIGHT - PLAYER_COLLISION_RADIUS));
```

---

## ✅ Acceptance Criteria

### Functional Requirements:
- [ ] All 28 buildings have perfect collision (no clipping)
- [ ] All 5 scenery objects have collision
- [ ] Player stops at scene edges (cannot walk outside)
- [ ] NPCs block player movement
- [ ] No corner clipping on any building
- [ ] All 14 doors still accessible
- [ ] Collision feels responsive (no sticky edges)

### Performance Requirements:
- [ ] Collision checks optimized (only nearby NPCs)
- [ ] 60 FPS maintained with 50 NPCs
- [ ] No lag during movement

### Testing Checklist:
- [ ] Test all 4 corners of map
- [ ] Test all 4 edges of map
- [ ] Walk around every building
- [ ] Walk through NPC crowds
- [ ] Enter all 14 doors
- [ ] No console errors

---

## 🚫 Out of Scope

- ❌ Adding visual collision debug mode (optional enhancement)
- ❌ Implementing z-layer collisions
- ❌ Adding dynamic collision for moving NPCs
- ❌ Implementing collision sounds/feedback

**This task ONLY:**
- ✅ Add scenery collision
- ✅ Fix any clipping issues
- ✅ Optimize performance
- ✅ Test thoroughly

---

## 📊 Quality Gates

```bash
# 1. TypeScript
cd /workspace/golden-sun
npm run type-check
# MUST: 0 errors

# 2. Build
npm run build
# MUST: Success

# 3. Manual Testing
npm run dev
# Test collision on all buildings + edges
```

---

## ⏱️ Time Estimate

**2-3 hours**

**Breakdown:**
- Add scenery collision: 15 min
- Test all buildings: 1 hour
- Fix collision issues: 30-60 min
- Optimize NPC collision: 30 min
- Final testing: 30 min

---

**STATUS:** Ready for Coder AI execution
**DEPENDENCIES:** Tasks 1-3 complete
