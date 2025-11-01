# Session Plan: Golden Sun Vale Village MVP

**Project:** Golden Sun - First City (Vale Village)
**Session:** 1 (Foundation Build)
**Date:** 2025-11-01
**Architect:** Six-Role System
**Objective:** Build fully functional Vale village overworld with NPCs, dialogue, movement, and shops

---

## Current State

### Completed (Story Director + Graphics Phase 1)
✅ Story Bible - Complete world, characters, dialogue samples
✅ Beat Map - 9 story beats, MVP scope defined (Beats 1-3 + 8)
✅ Encounter Palette - Combat system deferred to Phase 2
✅ Namepack - 260+ names across all categories
✅ Mockup Script - HTML/CSS blueprint for Graphics
✅ Accessibility Notes - WCAG 2.1 AA requirements
✅ Vale Village Mockup - HTML/CSS with 16 NPCs, 7 buildings, dialogue system
✅ Sprite Map - 31 entities documented
✅ Design Tokens - 60+ CSS variables

### Existing Codebase (`/isaac-clone`)
- ✅ Vite + React + TypeScript setup
- ✅ 11 game systems (bomb, combat, door, enemy, gameEngine, item, obstacle, pickup, player, projectile, room)
- ✅ 10 type definitions
- ✅ 3 utilities (collision, result, rng)
- ✅ 5 test files
- ⚠️ **NOTE:** Existing systems are for top-down Zelda-like dungeon crawler (Isaac clone)
- ⚠️ **Decision:** Keep existing systems, add new Vale village-specific systems alongside

### Gaps (What needs to be built)
1. **NPC System** - Character entities, positioning, facing, idle animations
2. **Dialogue System** - Text rendering, portraits, choices, state management
3. **Movement System** - 8-directional grid-based movement with collision
4. **Overworld System** - Scene management, camera following, area transitions
5. **Shop System** - Buy/sell items, inventory management, UI
6. **Save System** - Progress persistence, inn rest/save functionality
7. **UI Components** - Dialogue box, shop menu, location banner (React)

---

## MVP Scope Definition

### In Scope (Session 1)
✅ Vale village overworld exploration (free movement, 8-directional)
✅ 16 NPCs with unique positions and dialogues
✅ Dialogue system (text reveal, portraits, continue prompt)
✅ Building entrances (7 buildings, door collision detection)
✅ Basic shop system (Item Shop + Armor Shop with buy functionality)
✅ Player movement with collision (walk around NPCs, buildings, scenery)
✅ Camera system (follow player, constrained to scene bounds)
✅ Scene transitions (fade in/out when entering buildings)
✅ Save system (rest at inn, save progress)
✅ Keyboard controls (Arrow keys + A/Enter + B/Escape)
✅ Accessibility (WCAG 2.1 AA: keyboard nav, ARIA, contrast)

### Out of Scope (Future Sessions)
❌ Combat system (no battles in Vale village)
❌ Psynergy abilities (Move, Catch, etc.)
❌ World map (Vale village only)
❌ Sol Sanctum dungeon (Beats 4-7)
❌ Party system (Isaac only for MVP, no Garet/Ivan/Mia in party)
❌ Equipment system (can buy items but stats not implemented)
❌ EXP/Leveling (no combat = no progression)
❌ Djinn collection
❌ Multi-room interiors (single-screen interiors only)

---

## Session Goals (Ordered by Priority)

### Goal 1: Core Movement & Collision (P0 - Must Have)
**Objective:** Player can walk around Vale village with 8-directional movement, collide with NPCs/buildings/scenery

**Acceptance Criteria:**
- [ ] Player sprite (Isaac) renders on screen
- [ ] Arrow keys move player in 8 directions (N, NE, E, SE, S, SW, W, NW)
- [ ] Player cannot walk through NPCs
- [ ] Player cannot walk through buildings/scenery
- [ ] Player can walk on paths/grass freely
- [ ] Camera follows player (centered, with scene bounds constraint)
- [ ] Smooth movement (no jittery positioning)

**Estimate:** 4-6 hours

---

### Goal 2: NPC System & Dialogue (P0 - Must Have)
**Objective:** NPCs are positioned in village, player can interact via keyboard, dialogue box displays with text reveal

**Acceptance Criteria:**
- [ ] 16 NPCs render at positions from sprite_map.json
- [ ] NPCs have idle bob animation (2 FPS)
- [ ] Press A/Enter while facing NPC → dialogue box opens
- [ ] Dialogue box shows NPC portrait + name + text
- [ ] Text reveals character-by-character (30ms per char, configurable)
- [ ] Press A/Enter → advance to next dialogue line
- [ ] Press B/Escape → close dialogue
- [ ] Dialogue content matches Story Bible samples
- [ ] ARIA live region announces dialogue for screen readers

**Estimate:** 6-8 hours

---

### Goal 3: Building Entrances & Scene Transitions (P1 - Should Have)
**Objective:** Player can enter buildings, scene fades out/in, interior loads

**Acceptance Criteria:**
- [ ] 7 buildings have collision zones (can't walk through walls)
- [ ] Door sparkle animation on enterable buildings
- [ ] Walk to door + press A/Enter → enter building
- [ ] Screen fades to black (300ms)
- [ ] Interior scene loads (single-screen room)
- [ ] Player positioned at interior spawn point
- [ ] Press A/Enter at exit door → return to overworld
- [ ] Player positioned at building exterior (door location)

**Interiors Required (Simplified):**
- Isaac's House: Dora inside, bed, table, stairs (no upstairs for MVP)
- Item Shop: Shopkeeper, counter, shelves → triggers shop menu
- Armor Shop: Shopkeeper, counter, weapon displays → triggers shop menu
- (Others: empty rooms with "Under construction" message)

**Estimate:** 4-6 hours

---

### Goal 4: Shop System (P1 - Should Have)
**Objective:** Enter Item/Armor shop, buy items with coins, items added to inventory

**Acceptance Criteria:**
- [ ] Interact with shopkeeper → shop menu opens (modal overlay)
- [ ] Shop menu shows 4-6 items with icons, names, descriptions, prices
- [ ] Player's coin count displayed
- [ ] Arrow keys navigate items
- [ ] Press A/Enter → purchase item (if sufficient coins)
- [ ] Coins deducted, item added to inventory
- [ ] "Not enough coins" message if insufficient funds
- [ ] Press B/Escape → close shop menu
- [ ] Shop inventory matches Story Bible (Herbs, Nuts, Antidotes, etc.)

**Item Shop Inventory:**
- Herb (10 coins) - Restores 50 HP
- Nut (20 coins) - Restores 50 PP
- Antidote (20 coins) - Cures poison
- Psy Crystal (50 coins) - Restores 100 PP

**Armor Shop Inventory:**
- Wooden Stick (20 coins) - Basic weapon
- Leather Armor (40 coins) - Basic armor
- Leather Cap (30 coins) - Basic headgear
- Leather Gloves (15 coins) - Basic accessory

**Estimate:** 4-6 hours

---

### Goal 5: Inn & Save System (P2 - Nice to Have)
**Objective:** Player can rest at inn (restore HP/PP), save progress

**Acceptance Criteria:**
- [ ] Enter inn, talk to innkeeper
- [ ] "Rest for 30 coins?" → Yes/No choice
- [ ] Select Yes → coins deducted, HP/PP restored
- [ ] "Save your progress?" prompt
- [ ] Select Yes → game saved to localStorage
- [ ] Load game → player position, inventory, coins restored

**Estimate:** 2-3 hours

---

### Goal 6: Graphics Integration & Polish (P1 - Should Have)
**Objective:** Convert HTML/CSS mockup to React components with animations and styling

**Acceptance Criteria:**
- [ ] All mockup styles ported to React (CSS modules or styled-components)
- [ ] Dialogue box matches mockup exactly (portrait, text, border)
- [ ] Location banner appears on scene entry ("Vale Village")
- [ ] Idle animations smooth (2 FPS bob for NPCs, player)
- [ ] Walk animations (4-frame cycle, 8 FPS) if sprite sheets available
- [ ] Reduced motion support (prefers-reduced-motion query)
- [ ] No visual regressions from mockup
- [ ] 30 FPS minimum (performance target)

**Estimate:** 4-5 hours

---

### Goal 7: Accessibility & Testing (P0 - Must Have)
**Objective:** Full keyboard navigation, screen reader support, WCAG 2.1 AA compliance

**Acceptance Criteria:**
- [ ] All NPCs keyboard accessible (Tab to cycle, Enter to interact)
- [ ] Focus indicators visible (3px gold outline)
- [ ] ARIA labels on all interactive elements
- [ ] Dialogue announced via aria-live regions
- [ ] Keyboard shortcuts documented (in-game help or README)
- [ ] Text contrast ≥ 4.5:1 (dialogue, menus)
- [ ] UI contrast ≥ 3:1 (buttons, borders)
- [ ] No keyboard traps (can exit all modals with Escape)

**Estimate:** 2-3 hours

---

## Total Estimates

**Coder Tasks:** 20-28 hours
**Graphics Tasks:** 4-5 hours
**QA/Testing:** 3-4 hours
**Buffer (20%):** 6 hours

**Total:** ~35-45 hours

---

## Success Criteria (Session Complete When...)

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

---

## Out of Scope Guardrails

**Do NOT implement:**
- Combat system
- Party members (Garet/Ivan/Mia as followers)
- Psynergy abilities
- Equipment stats/effects (buy items but no stat changes)
- World map
- Sol Sanctum dungeon
- Multiple towns
- Quests/objectives (exploration only)

**If Coder asks about these, respond:** "Out of scope for MVP. Focus on movement, dialogue, shops, and save system only."

---

## Quality Gates (Must Pass Before Ship)

### Logic (Coder)
- ✅ TypeScript: 0 errors
- ✅ Tests: 100% pass rate (50+ new tests minimum)
- ✅ Circular deps: 0
- ✅ Build: Success
- ✅ Determinism: Not applicable (no RNG in MVP)
- ✅ Performance: P95 < 16.666ms (60 FPS target)

### Visual (Graphics)
- ✅ Assets: 0 missing / 404s
- ✅ FPS: 30+ (provide video evidence)
- ✅ Aesthetic: Matches Golden Sun / GBA mockup
- ✅ Accessibility: WCAG 2.1 AA spot checks passed
- ✅ Screenshots: Before/after provided
- ✅ Motion: prefers-reduced-motion respected

---

## Task Assignment

### Coder Tasks (7 tasks)
1. **T-SYS-NPC** - NPC System (positioning, idle animation, interaction zones)
2. **T-SYS-DIALOGUE** - Dialogue System (text rendering, portraits, choices)
3. **T-SYS-MOVEMENT** - Movement System (8-directional, collision, camera)
4. **T-SYS-OVERWORLD** - Overworld System (scene management, transitions)
5. **T-SYS-SHOP** - Shop System (inventory, buy/sell, UI logic)
6. **T-SYS-SAVE** - Save System (localStorage persistence)
7. **T-INT-TESTS** - Integration Tests (movement + dialogue + shops)

### Graphics Tasks (3 tasks)
1. **T-UI-DIALOGUE** - Dialogue Box Component (React, styled per mockup)
2. **T-UI-SHOP** - Shop Menu Component (React, item list + actions)
3. **T-UI-POLISH** - Animations & Polish (idle bobs, walk cycles, transitions)

---

## Dependencies & Order

**Phase A - Foundation (Parallel):**
- Coder: T-SYS-NPC (start)
- Coder: T-SYS-MOVEMENT (start)
- Graphics: T-UI-DIALOGUE (start, can mock data)

**Phase B - Integration (Sequential):**
- Coder: T-SYS-DIALOGUE (requires T-SYS-NPC + T-UI-DIALOGUE)
- Coder: T-SYS-OVERWORLD (requires T-SYS-MOVEMENT)
- Graphics: T-UI-SHOP (parallel with Coder shop logic)

**Phase C - Features (Sequential):**
- Coder: T-SYS-SHOP (requires T-UI-SHOP)
- Coder: T-SYS-SAVE (can start anytime)

**Phase D - Polish & Test (Parallel):**
- Coder: T-INT-TESTS
- Graphics: T-UI-POLISH

---

## Risk Mitigation

**Risk 1:** Building sprite assets missing
**Mitigation:** Use CSS placeholders (already in mockup), Graphics can add authentic sprites in Phase 2

**Risk 2:** Dialogue system too complex (multiple choices, branching)
**Mitigation:** Start with linear dialogues only, add choices in iteration 2

**Risk 3:** Performance issues with 16 NPCs + animations
**Mitigation:** Profile early, use sprite atlases, limit animation frames to 2-4

**Risk 4:** Collision detection bugs (player stuck on NPCs)
**Mitigation:** Existing collision utils in codebase, thorough testing required

**Risk 5:** Scope creep (Coder adds combat/Psynergy)
**Mitigation:** Explicit out-of-scope list, Architect reviews all commits

---

## Next Steps

1. **Architect → Coder:** Copy Task Prompts (T-SYS-NPC, T-SYS-MOVEMENT, T-SYS-DIALOGUE, etc.) to Coder chat
2. **Architect → Graphics:** Copy Task Prompts (T-UI-DIALOGUE, T-UI-SHOP, T-UI-POLISH) to Graphics chat
3. **Coder:** Begin with T-SYS-NPC and T-SYS-MOVEMENT in parallel
4. **Graphics:** Begin with T-UI-DIALOGUE (can use mock NPC data initially)
5. **Integration:** After foundation tasks complete, integrate dialogue + movement + NPCs
6. **QA:** Verify against acceptance criteria, run accessibility audit
7. **Ship:** Package release, deploy to Netlify/Vercel

---

## Routing

**Current State:** ARCHITECT:PLANNING-COMPLETE

**Next Actions:**
- ARCHITECT → CODER (T-SYS-* tasks)
- ARCHITECT → GRAPHICS (T-UI-* tasks)
- CODER:COMPLETION → QA:VERIFY
- GRAPHICS:COMPLETION → QA:VERIFY
- QA:PASS → RELEASE:PACKAGE+PUBLISH

---

## Approval

**Session Plan Status:** ✅ **APPROVED** (self-approved by Architect)

**Proceed to task creation:** ✅

**Estimated completion:** 35-45 hours (1-2 weeks at 20 hours/week pace)

---

**Session Plan Complete. Creating individual task prompts next...**
