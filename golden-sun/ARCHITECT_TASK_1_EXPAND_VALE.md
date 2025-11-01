# Task 1: Expand Vale Village Scene to Authentic Size

**ROLE:** Coder AI
**TYPE:** System Modification (Integration)
**TEMPLATE:** Template 7 (Integration)
**PRIORITY:** P0 - CRITICAL
**EST TIME:** 3-4 hours

---

## 📋 Context

- **Project:** Golden Sun - Vale Village Full Expansion
- **Pattern:** Pure functions, Result types, deterministic systems
- **Owner:** Coder AI
- **Current State:** Vale is ~960x640px with 7 buildings, 16 NPCs
- **Target State:** Vale is ~1920x1280px with 25-30 buildings, 40-50 NPCs
- **Reference:** Authentic Golden Sun Vale map (SUPER EXTENSIVE)

---

## 🎯 Objective

Expand Vale Village scene to full authentic size (2-3x current), layout all 5 areas (north/central/east/west/south), enable seamless traversal from one end to the other, and prepare infrastructure for 25-30 buildings and 40-50 NPCs.

---

## 📦 Requirements

### 1. Expand Scene Dimensions

**File:** `src/systems/overworldSystem.ts` - `createValeVillageScene()` function

**Current Bounds:**
```typescript
bounds: { x: 0, y: 0, width: 960, height: 640 }
```

**New Bounds:**
```typescript
bounds: { x: 0, y: 0, width: 1920, height: 1280 }
```

**Action:**
- Increase scene width from 960 → 1920px
- Increase scene height from 640 → 1280px
- Update camera bounds to match new scene size
- Ensure camera stays within scene bounds during follow

### 2. Update Camera System

**File:** `src/systems/movementSystem.ts` - Camera functions

**Action:**
- Update `updateCamera()` to handle larger scene bounds
- Ensure camera centers on player
- Clamp camera to scene edges (no black borders)
- Keep camera smooth (no jittery movement)
- Test camera at all scene edges (north, south, east, west corners)

### 3. Layout 5 Area Zones

**File:** `src/systems/overworldSystem.ts` - Scene data

**Add area zones for organization (data structure only, not visual yet):**

```typescript
// Add to scene data:
areas: [
  {
    id: 'northern',
    name: 'Northern Vale - Sanctum Entrance',
    bounds: { x: 400, y: 0, width: 1120, height: 400 },
    description: 'Sol Sanctum entrance, Elder plaza, sacred area'
  },
  {
    id: 'central',
    name: 'Central Vale - Main Village',
    bounds: { x: 200, y: 400, width: 1520, height: 400 },
    description: 'Isaac and Garet houses, main paths, gathering spots'
  },
  {
    id: 'eastern',
    name: 'Eastern Vale - Residential',
    bounds: { x: 960, y: 200, width: 960, height: 880 },
    description: 'Houses, gardens, peaceful area'
  },
  {
    id: 'western',
    name: 'Western Vale - Farmland',
    bounds: { x: 0, y: 200, width: 480, height: 880 },
    description: 'Farms, barns, rural area'
  },
  {
    id: 'southern',
    name: 'Southern Vale - Gate District',
    bounds: { x: 400, y: 1000, width: 1120, height: 280 },
    description: 'Vale Gate exit, southern houses'
  }
]
```

### 4. Update Starting Position

**File:** `src/GoldenSunApp.tsx` or scene data

**Action:**
- Place player (Isaac) at central Vale start position
- Update starting position: `{ x: 960, y: 640 }` (center of new map)
- Ensure starting position is on walkable terrain

### 5. Expand Collision Infrastructure

**File:** `src/systems/movementSystem.ts`

**Action:**
- Increase collision obstacle capacity (current: ~20, new: ~100+)
- Update `CollisionObstacle` array to handle 25-30 buildings
- Update collision bounds for existing 7 buildings (recalculate based on new map)
- Keep NPCs in their relative positions (scale up their coordinates)

**Example scaling:**
```typescript
// Old position (960x640 map): { x: 240, y: 160 }
// New position (1920x1280 map): { x: 480, y: 320 }
// Formula: newX = oldX * 2, newY = oldY * 2
```

### 6. Update Existing Buildings & NPCs Positions

**Files:** 
- `src/systems/overworldSystem.ts` - Building positions
- `src/systems/npcSystem.ts` - NPC positions

**Action:**
- Scale ALL existing building positions by 2x
- Scale ALL existing NPC positions by 2x
- Test that existing content still works in new larger map
- Verify player can still interact with NPCs and enter buildings

**Buildings to scale (7):**
1. Isaac's House
2. Garet's House
3. Elder's House
4. Item Shop
5. Armor Shop
6. Inn
7. Sanctum Entrance

**NPCs to scale (16):**
1. Isaac
2. Garet
3. Jenna
4. Kyle
5. Dora
6. Aaron Jerra
7. Kay Jerra
8. Elder
9. Kraden
10. Innkeeper
11. Armorshop Owner
12. Great Healer
13. Scholar 1
14. Scholar 2
15-16. Villagers

---

## ✅ Acceptance Criteria

### Functional Requirements:
- [ ] Scene dimensions are 1920x1280px
- [ ] Camera follows player smoothly across entire map
- [ ] Camera clamps correctly at all edges (no black borders)
- [ ] 5 area zones defined in scene data
- [ ] All 7 existing buildings scaled to new positions
- [ ] All 16 existing NPCs scaled to new positions
- [ ] Player can walk from north (y=0) to south (y=1280)
- [ ] Player can walk from west (x=0) to east (x=1920)
- [ ] No collision bugs in scaled content
- [ ] Building interactions still work (can enter shops, houses)
- [ ] NPC interactions still work (can talk to NPCs)

### Technical Requirements:
- [ ] TypeScript compiles with 0 errors
- [ ] No console errors during gameplay
- [ ] Collision system handles larger map
- [ ] Camera system handles larger bounds
- [ ] Build succeeds (`npm run build`)

### Testing Checklist:
- [ ] Start game, player spawns at center
- [ ] Walk north to edge (sanctum area)
- [ ] Walk south to edge (gate area)
- [ ] Walk west to edge (farmland)
- [ ] Walk east to edge (residential)
- [ ] Test all 4 corners (NW, NE, SW, SE)
- [ ] Camera stays within bounds at all edges
- [ ] Enter Isaac's house (test building interaction)
- [ ] Talk to Elder (test NPC interaction)
- [ ] Open shop menu (test shop interaction)

---

## 🚫 Out of Scope (Do NOT do these)

- ❌ Adding new buildings (Task 2)
- ❌ Adding new NPCs (Task 3)
- ❌ Finding/integrating sprites (Graphics AI tasks)
- ❌ Adding terrain tiles (Graphics AI task)
- ❌ Adding decorations (Graphics AI task)
- ❌ Visual polish (Graphics AI)

**This task ONLY:**
- ✅ Expand scene size
- ✅ Scale existing content
- ✅ Enable full traversal
- ✅ Prepare infrastructure

---

## 📊 Quality Gates (Run Before Completion Report)

```bash
# 1. TypeScript compilation
cd /workspace/golden-sun
npm run type-check
# MUST: 0 errors

# 2. Build
npm run build
# MUST: Success

# 3. Manual Testing
npm run dev
# Open browser, test traversal as per checklist above
```

---

## ✅ Completion Report Template

**When task is complete, provide this report:**

```markdown
## ✅ COMPLETION REPORT: Expand Vale Village Scene

### Summary
[2-3 sentences describing what was done]

### Files Modified
- `src/systems/overworldSystem.ts` - [What changed]
- `src/systems/movementSystem.ts` - [What changed]
- `src/GoldenSunApp.tsx` - [What changed]
- [Any other files]

### Scene Dimensions
- **Before:** 960x640px
- **After:** 1920x1280px
- **Scaling Factor:** 2x

### Scaled Content
- **Buildings:** 7 buildings scaled
- **NPCs:** 16 NPCs scaled
- **Interactions:** All tested and working

### Quality Gates
- ✅ TypeScript: 0 errors
- ✅ Build: Success
- ✅ Manual Testing: Full traversal confirmed

### Traversal Testing Results
- [x] North edge: Camera clamps correctly
- [x] South edge: Camera clamps correctly
- [x] East edge: Camera clamps correctly
- [x] West edge: Camera clamps correctly
- [x] All corners: Working
- [x] Building interactions: Working
- [x] NPC interactions: Working

### Issues Encountered (if any)
[List any issues and how they were resolved]

### Next Steps
Ready for Task 2 (Add All Buildings Data)

---

**Task 1 Complete. Ready for Architect review.**
```

---

## ⏱️ Time Estimate

**3-4 hours**

**Breakdown:**
- Scene expansion: 30 min
- Camera system update: 1 hour
- Scaling existing content: 1-1.5 hours
- Testing & debugging: 30-60 min

---

## 🔄 Handoff

**Architect → Coder:**
Copy this entire task to Coder AI chat and execute.

**Coder → Architect:**
Provide completion report back to Architect for review.

---

**STATUS:** Ready for Coder AI execution
**TEMPLATE USED:** System Integration (Template 7)
**PRIORITY:** P0 - Must complete before other tasks
