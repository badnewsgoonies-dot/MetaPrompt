# Task 3: Add All NPCs to Vale Village (25-30 NPCs)

**ROLE:** Coder AI
**TYPE:** Data Addition
**TEMPLATE:** Template 2 (Type Modification) + Template 1 (Simple Utility)
**PRIORITY:** P0 - CRITICAL
**EST TIME:** 3-4 hours

---

## 📋 Context

- **Project:** Golden Sun - Vale Village Full Expansion
- **Pattern:** Data-driven NPC system using sprite_map.json
- **Owner:** Coder AI
- **Current State:** Vale has 23 NPCs (16 visible, 7 hidden)
- **Target State:** Vale has 48-50 NPCs total
- **Reference:** Authentic Golden Sun Vale (every building has occupants)

---

## 🎯 Objective

Add 25-27 more NPCs to Vale Village to populate all the new buildings. Place NPCs logically in/near buildings, on paths, in plaza areas. Give each NPC a basic dialogue. Create a living, populated village.

---

## 📦 Requirements

### 1. Add NPCs to sprite_map.json

**File:** `public/sprite_map.json` - `entities` array

**Current NPCs (23 total):**
- 16 visible NPCs (garet, dora, elder, kraden, kyle, jenna, great-healer, aaron, kay, innkeeper, armor-shop-owner, scholar-1, scholar-2, villager-1, villager-2, villager-3)
- 7 hidden NPCs (ivan, mia, felix, sheba, alex, saturos, piers)

**Add These NPCs (25-27):**

#### Northern Area NPCs (5):
1. **Sanctum Guard 1** - Standing at sanctum entrance
   - Position: `{x: 940, y: 200}`
   - Sprite: `./assets/Villager1.gif` (reuse existing)
   - Dialogue: "sanctum-guard-1" - "Sol Sanctum is sacred. Only the Elder may enter."

2. **Sanctum Guard 2** - Patrolling near sanctum
   - Position: `{x: 1020, y: 240}`
   - Sprite: `./assets/Villager2.gif`
   - Dialogue: "sanctum-guard-2" - "Strange things happen near the sanctum..."

3. **Scholar 3** - Near plaza studying
   - Position: `{x: 1140, y: 240}`
   - Sprite: `./assets/Scholar-1.gif`
   - Dialogue: "scholar-3" - "I'm researching ancient Alchemy texts."

4. **Plaza Villager 1** - Sitting in pavilion
   - Position: `{x: 1120, y: 220}`
   - Sprite: `./assets/Villager3.gif`
   - Dialogue: "plaza-villager-1" - "This pavilion is a nice place to rest."

5. **Elder Assistant** - Outside Elder's house
   - Position: `{x: 880, y: 300}`
   - Sprite: `./assets/Scholar-2.gif`
   - Dialogue: "elder-assistant" - "The Elder is very wise. Seek his counsel."

#### Central Area NPCs (7):
6. **Jenna's Mother (Jasmine)** - Near Jenna's house
   - Position: `{x: 540, y: 720}`
   - Sprite: `./assets/Dora.gif` (reuse)
   - Dialogue: "jasmine" - "Have you seen Jenna? She's always running off..."

7. **Blacksmith (Ferris)** - Outside blacksmith shop
   - Position: `{x: 1140, y: 640}`
   - Sprite: `./assets/Kyle.gif` (reuse)
   - Dialogue: "blacksmith" - "Need weapons? I forge the finest blades in Vale!"

8. **Villager 4** - Walking near well
   - Position: `{x: 760, y: 640}`
   - Sprite: `./assets/Villager1.gif`
   - Dialogue: "villager-4" - "The well provides the clearest water."

9. **Villager 5** - Near house 1
   - Position: `{x: 360, y: 640}`
   - Sprite: `./assets/Villager2.gif`
   - Dialogue: "villager-5" - "Welcome to Vale! We're a peaceful village."

10. **Child 1** - Playing near paths
    - Position: `{x: 480, y: 600}`
    - Sprite: `./assets/Villager3.gif`
    - Dialogue: "child-1" - "I want to be a great warrior like Isaac's father!"

11. **Mother 1** - Watching child
    - Position: `{x: 500, y: 560}`
    - Sprite: `./assets/Dora.gif`
    - Dialogue: "mother-1" - "Be careful playing near the sanctum!"

12. **Merchant** - Near item shop
    - Position: `{x: 1180, y: 540}`
    - Sprite: `./assets/Innkeeper.gif`
    - Dialogue: "merchant" - "The item shop has the best prices!"

#### Eastern Area NPCs (6):
13. **Villager 6** - Outside house 3
    - Position: `{x: 1400, y: 440}`
    - Sprite: `./assets/Villager1.gif`
    - Dialogue: "villager-6" - "Lovely day, isn't it?"

14. **Villager 7** - Outside house 4
    - Position: `{x: 1560, y: 540}`
    - Sprite: `./assets/Villager2.gif`
    - Dialogue: "villager-7" - "I heard strange sounds from the mountains..."

15. **Gardener** - Near greenhouse
    - Position: `{x: 1640, y: 760}`
    - Sprite: `./assets/Villager3.gif`
    - Dialogue: "gardener" - "These herbs are for healing. Very useful!"

16. **Elder Woman 1** - Near house 5
    - Position: `{x: 1440, y: 680}`
    - Sprite: `./assets/Great_Healer.gif`
    - Dialogue: "elder-woman-1" - "Vale has been peaceful for many years..."

17. **Child 2** - Playing in residential area
    - Position: `{x: 1520, y: 640}`
    - Sprite: `./assets/Villager1.gif`
    - Dialogue: "child-2" - "Let's play hide and seek!"

18. **Storage Keeper** - Near shed
    - Position: `{x: 1720, y: 640}`
    - Sprite: `./assets/Armorshop_Owner.gif`
    - Dialogue: "storage-keeper" - "We store grain and supplies here."

#### Western Area NPCs (4):
19. **Farmer 1** - Near barn
    - Position: `{x: 180, y: 760}`
    - Sprite: `./assets/Kyle.gif`
    - Dialogue: "farmer-1" - "The harvest was good this year!"

20. **Farmer 2** - Near farmhouse
    - Position: `{x: 200, y: 980}`
    - Sprite: `./assets/Villager2.gif`
    - Dialogue: "farmer-2" - "We grow crops to feed the village."

21. **Villager 8** - Outside house 6
    - Position: `{x: 240, y: 580}`
    - Sprite: `./assets/Villager3.gif`
    - Dialogue: "villager-8" - "The western side is quieter. I like it."

22. **Barn Worker** - Near storage
    - Position: `{x: 240, y: 840}`
    - Sprite: `./assets/Villager1.gif`
    - Dialogue: "barn-worker" - "These animals provide milk and wool."

#### Southern Area NPCs (3):
23. **Gate Guard 1** - Near watchtower
    - Position: `{x: 900, y: 1180}`
    - Sprite: `./assets/Villager1.gif`
    - Dialogue: "gate-guard-1" - "This gate leads to the world beyond."

24. **Gate Guard 2** - Near guard post
    - Position: `{x: 1080, y: 1200}`
    - Sprite: `./assets/Villager2.gif`
    - Dialogue: "gate-guard-2" - "Vale is protected. No monsters can enter."

25. **Villager 9** - Outside house 7
    - Position: `{x: 640, y: 1080}`
    - Sprite: `./assets/Villager3.gif`
    - Dialogue: "villager-9" - "I live near the gate. Convenient for travel!"

26. **Villager 10** - Outside house 8
    - Position: `{x: 1240, y: 1100}`
    - Sprite: `./assets/Dora.gif`
    - Dialogue: "villager-10" - "Welcome to our home!"

27. **Traveler** - Near gate (optional)
    - Position: `{x: 960, y: 1120}`
    - Sprite: `./assets/Alex.gif` (make visible: true)
    - Dialogue: "traveler" - "I'm just passing through Vale..."

**JSON Structure for Each NPC:**
```json
{
  "id": "npc-id",
  "type": "npc",
  "name": "NPC Name",
  "sprite": "./assets/SpriteName.gif",
  "position": {"x": 000, "y": 000},
  "z_index": 10,
  "facing": "down/up/left/right",
  "dialogue_id": "dialogue-id",
  "role": "minor_npc",
  "description": "Brief description"
}
```

---

### 2. Update Stats in sprite_map.json

**File:** `public/sprite_map.json` - `stats` object

**Update these fields:**
```json
"stats": {
  "total_sprites": 58,  // Was 31, now +27
  "visible_npcs": 43,   // Was 16, now +27
  "hidden_npcs": 7,     // Unchanged
  "player": 1,
  "buildings": 28,
  "scenery": 5,
  "paths": 4,
  "total_interactables": 71  // Was 23, now +27 (buildings already counted)
}
```

---

## ✅ Acceptance Criteria

### Functional Requirements:
- [ ] 25-27 new NPCs added to sprite_map.json (48-50 total)
- [ ] NPCs distributed across all 5 areas
- [ ] Each NPC has unique ID, name, position, sprite, dialogue_id
- [ ] NPCs placed logically (near buildings they occupy)
- [ ] No overlapping NPC positions
- [ ] All NPCs visible by default (except story NPCs like Ivan/Mia)
- [ ] Stats updated correctly

### Data Validation:
- [ ] All NPC IDs are unique
- [ ] All positions are within scene bounds (0-1920, 0-1280)
- [ ] All sprite paths reference existing sprites
- [ ] All dialogue_ids are lowercase-with-hyphens
- [ ] JSON syntax is valid

### Distribution Check:
- [ ] Northern area: 5 NPCs
- [ ] Central area: 7 NPCs
- [ ] Eastern area: 6 NPCs
- [ ] Western area: 4 NPCs
- [ ] Southern area: 3 NPCs
- **Total new:** 25 NPCs

### Technical Requirements:
- [ ] JSON is valid (no syntax errors)
- [ ] TypeScript compiles with 0 errors
- [ ] Build succeeds

---

## 🚫 Out of Scope (Do NOT do these)

- ❌ Creating NPC sprites (Graphics AI Task 6)
- ❌ Creating dialogue content (use simple placeholders)
- ❌ Implementing NPC movement/patrol routes
- ❌ Adding quest logic
- ❌ Creating NPC interactions beyond dialogue

**This task ONLY:**
- ✅ Add NPC data to sprite_map.json
- ✅ Update stats
- ✅ Validate JSON
- ✅ Test that NPCs load

---

## 📊 Quality Gates

```bash
# 1. Validate JSON
cd /workspace/golden-sun
node -e "JSON.parse(require('fs').readFileSync('public/sprite_map.json'))" && echo "✅ JSON valid"

# 2. Count NPCs
cd /workspace/golden-sun
node -e "const d = JSON.parse(require('fs').readFileSync('public/sprite_map.json')); console.log('Total NPCs:', d.entities.filter(e => e.type === 'npc').length)"

# 3. TypeScript compilation
npm run type-check
# MUST: 0 errors

# 4. Build
npm run build
# MUST: Success
```

---

## ✅ Completion Report Template

```markdown
## ✅ COMPLETION REPORT: Add All NPCs to Vale Village (Task 3)

### Summary
[2-3 sentences]

### Files Modified
- `public/sprite_map.json` - Added 27 new NPCs

### NPCs Added (27)
**Northern Area (5):**
- [x] Sanctum Guard 1
- [x] Sanctum Guard 2
- [x] Scholar 3
- [x] Plaza Villager 1
- [x] Elder Assistant

**Central Area (7):**
- [x] Jasmine (Jenna's Mother)
- [x] Ferris (Blacksmith)
- [x] Villager 4-5
- [x] Child 1
- [x] Mother 1
- [x] Merchant

**Eastern Area (6):**
- [x] Villager 6-7
- [x] Gardener
- [x] Elder Woman 1
- [x] Child 2
- [x] Storage Keeper

**Western Area (4):**
- [x] Farmer 1-2
- [x] Villager 8
- [x] Barn Worker

**Southern Area (3):**
- [x] Gate Guard 1-2
- [x] Villager 9-10
- [x] Traveler (optional)

### NPC Counts
- **Before:** 23 NPCs (16 visible)
- **After:** 50 NPCs (43 visible)
- **Added:** 27 NPCs

### Quality Gates
- ✅ JSON Valid: Yes
- ✅ TypeScript: 0 errors
- ✅ Build: Success
- ✅ All NPCs positioned correctly

### Area Distribution
- Northern: 5 NPCs
- Central: 7 NPCs
- Eastern: 6 NPCs
- Western: 4 NPCs
- Southern: 3 NPCs
- **Total:** 25 new NPCs

### Next Steps
Ready for Graphics Task 6 (Find/integrate NPC sprites)

---

**Task 3 Complete. Ready for Architect review.**
```

---

## ⏱️ Time Estimate

**3-4 hours**

**Breakdown:**
- Add 27 NPCs to JSON: 1.5-2 hours
- Update stats: 10 min
- Validate JSON: 10 min
- Test + verify: 1-1.5 hours

---

**STATUS:** Ready for Coder AI execution
**DEPENDENCIES:** Task 2 complete
**BLOCKS:** Graphics Task 6 (NPC sprites)
