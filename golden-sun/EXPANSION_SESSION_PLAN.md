# 🗓️ Golden Sun: Major Gameplay Expansion - Session Plan

## 🎯 Expansion Objective
Transform the Vale Village MVP into a full Chapter 1 experience with multiple locations, combat system, dungeon exploration, world map travel, and complete story progression through the prologue.

## 📊 Current State
- **Test Count:** Unknown (need to run tests)
- **Systems Complete:** Vale village exploration, NPC system, dialogue system, shop system, save system
- **Known Issues:** Limited to one location, no combat, no dungeons, no world exploration
- **Last Completed:** Vale Village MVP (NPC system, movement, shops)
- **Files:** ~50 TypeScript files
- **Sprite Assets:** 30 sprites (Vale village only)

## 🎯 Expansion Goals (Priority Order)

### Phase 1: Combat & Battle Foundation (15-20 hours)
1. **Turn-Based Combat System** - Core battle mechanics with elemental system - [Est: 8h]
2. **Enemy AI & Behaviors** - 8+ enemy types with unique patterns - [Est: 4h]
3. **Battle UI Components** - Battle screen, action menus, animations - [Est: 4h]
4. **Experience & Leveling** - Character progression system - [Est: 3h]

### Phase 2: Sol Sanctum Dungeon (12-15 hours)
1. **Dungeon System** - Multi-room dungeon navigation - [Est: 4h]
2. **Puzzle Mechanics** - Psynergy field abilities (Move, Catch, Lift) - [Est: 5h]
3. **Dungeon Encounters** - Random battles and scripted encounters - [Est: 3h]
4. **Boss Battle System** - Enhanced combat for boss encounters - [Est: 4h]

### Phase 3: World Map & Travel (8-10 hours)
1. **World Map System** - Overworld navigation between locations - [Est: 4h]
2. **Random Encounters** - World map battle triggers - [Est: 2h]
3. **Location Discovery** - Unlock new areas through progression - [Est: 2h]
4. **Travel UI** - Map interface, location markers, fast travel - [Est: 2h]

### Phase 4: New Towns & Locations (15-20 hours)
1. **Vault Town** - First town outside Vale (20+ NPCs, shops, inn) - [Est: 6h]
2. **Bilibin Town** - Second major town (25+ NPCs, palace, quests) - [Est: 7h]
3. **Kolima Village** - Small forest village with curse subplot - [Est: 4h]
4. **Additional Locations** - Crossroads, caves, shrines - [Est: 5h]

### Phase 5: Advanced Systems (10-12 hours)
1. **Djinn Collection System** - Find and collect elemental Djinn - [Est: 4h]
2. **Summon System** - Unleash powerful summon attacks - [Est: 4h]
3. **Equipment & Stats** - Enhanced equipment system with stat bonuses - [Est: 3h]
4. **Status Effects** - Combat statuses (Poison, Stun, Seal, etc.) - [Est: 2h]

### Phase 6: Story & Cutscenes (8-10 hours)
1. **Prologue Cutscenes** - Sol Sanctum tragedy (Beats 4-7) - [Est: 4h]
2. **Story Progression Flags** - Track player progress through story - [Est: 2h]
3. **NPC State Changes** - NPCs react to story events - [Est: 3h]
4. **Ending Sequence** - Chapter 1 conclusion - [Est: 2h]

### Phase 7: Polish & Graphics (12-15 hours)
1. **Battle Animations** - Attack animations, damage numbers, particles - [Est: 5h]
2. **New Location Mockups** - HTML/CSS mockups for all new areas - [Est: 6h]
3. **Sprite Integration** - 100+ new sprites (enemies, NPCs, effects) - [Est: 4h]
4. **UI Polish** - Transitions, visual effects, screen shake - [Est: 3h]

## 📋 Detailed Implementation Tasks

---

## PHASE 1: COMBAT & BATTLE FOUNDATION

### Task 1.1: Create Combat System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/battleSystem.ts` (ENHANCE existing)
- **Action:** 
  - Implement turn-based combat with speed-based turn order
  - Add elemental damage calculations (Venus, Mars, Jupiter, Mercury)
  - Implement damage formulas: `damage = (ATK - DEF/2) * element_multiplier`
  - Add critical hit system (luck-based)
  - Support for 4 party members vs 1-5 enemies
- **Acceptance:** 
  - Battle system processes turns correctly
  - Elemental weaknesses/resistances work (2x damage for weaknesses, 0.5x for resistances)
  - Turn order based on agility stat
  - Party wipe = game over, enemy wipe = victory
- **Time:** 8 hours
- **Tests Required:** 25+ tests

### Task 1.2: Create Enemy Types (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/data/enemies.ts` (NEW), `src/types/enemy.ts` (ENHANCE)
- **Action:**
  - Create 8 enemy types for early game:
    - **Slime** (Venus, 20 HP, weak physical)
    - **Goblin** (Mars, 35 HP, aggressive)
    - **Spider** (Jupiter, 30 HP, poison attack)
    - **Lizard Man** (Mercury, 45 HP, water attacks)
    - **Wild Wolf** (Mars, 40 HP, fast)
    - **Ant** (Venus, 25 HP, defense up)
    - **Mole** (Venus, 50 HP, underground attack)
    - **Bat** (Jupiter, 28 HP, agility drain)
  - Define stats (HP, ATK, DEF, AGI, element, weaknesses, drops)
  - Create AI behavior patterns (aggressive, defensive, support, random)
- **Acceptance:** 
  - All 8 enemies have complete stat blocks
  - Each enemy has unique AI behavior
  - Enemies drop coins (10-100) and items (10% chance)
- **Time:** 4 hours
- **Tests Required:** 15+ tests

### Task 1.3: Battle UI Components (Graphics AI)
- **Owner:** Graphics AI
- **File(s):** 
  - `src/components/BattleScreen.tsx` (NEW)
  - `src/components/BattleScreen.css` (NEW)
  - `src/components/ActionMenu.tsx` (NEW)
  - `src/components/TurnOrderDisplay.tsx` (NEW)
  - `src/components/DamageNumber.tsx` (NEW)
- **Action:**
  - Create battle screen layout matching Golden Sun aesthetic
  - Top row: Enemy sprites (1-5 enemies, scaled 1.2x)
  - Bottom row: Party sprites (4 allies, normal scale)
  - Left side: Action menu (Attack, Psynergy, Djinn, Defend, Item, Flee)
  - Bottom: Combat log (last 3 actions)
  - Top right: Turn order indicator
  - Background: Static battle background (grassland, cave, etc.)
  - Damage numbers with animations (pop up, fade out)
- **Acceptance:**
  - Battle screen matches Golden Sun GBA aesthetic
  - All UI elements clearly visible
  - WCAG 2.1 AA contrast compliance
  - Smooth animations (30+ FPS)
- **Time:** 4 hours

### Task 1.4: Experience & Leveling System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/experienceSystem.ts` (NEW)
- **Action:**
  - Implement EXP formula: `exp_needed = 30 * level^2`
  - Level up increases: HP (+8-12), PP (+3-5), ATK (+2-4), DEF (+2-3), AGI (+1-2)
  - Learn new Psynergy at specific levels (e.g., Lvl 3: Cure, Lvl 5: Fireball)
  - Post-battle EXP distribution to all party members
  - Level-up screen with stat increases displayed
- **Acceptance:**
  - Characters level from 1 to 20 (Chapter 1 cap)
  - Stat increases balanced and fair
  - EXP gained from battles scales with enemy difficulty
  - Level-up triggers new Psynergy learning
- **Time:** 3 hours
- **Tests Required:** 10+ tests

---

## PHASE 2: SOL SANCTUM DUNGEON

### Task 2.1: Dungeon Navigation System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/dungeonSystem.ts` (NEW)
- **Action:**
  - Multi-room dungeon structure (8-12 rooms per dungeon)
  - Room types: entrance, corridor, puzzle, treasure, boss
  - Door connections between rooms
  - Locked doors requiring keys or switches
  - One-way doors and shortcuts
  - Dungeon map overlay (fog-of-war reveals explored rooms)
- **Acceptance:**
  - Sol Sanctum has 10 rooms with clear progression
  - Doors connect rooms logically
  - Locked doors prevent sequence breaking
  - Map system tracks explored rooms
- **Time:** 4 hours
- **Tests Required:** 12+ tests

### Task 2.2: Psynergy Field Abilities (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/psynergySystem.ts` (NEW)
- **Action:**
  - **Move**: Push objects (rocks, statues) in 4 directions
  - **Catch**: Grab distant items/switches with wind
  - **Lift**: Raise heavy rocks to reveal passages
  - Field ability activation (Select button or ability menu)
  - Object state persistence (moved objects stay moved)
  - Puzzle solutions using Psynergy
- **Acceptance:**
  - All 3 Psynergy abilities functional
  - Objects interact correctly (collision, state changes)
  - Puzzles solvable using abilities
  - Visual feedback when ability used
- **Time:** 5 hours
- **Tests Required:** 15+ tests

### Task 2.3: Random Dungeon Encounters (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/encounterSystem.ts` (NEW)
- **Action:**
  - Random battle trigger every 5-10 steps (RNG-based)
  - Encounter rates vary by dungeon zone
  - Enemy group composition (1-5 enemies per battle)
  - Battle initiation transition (screen flash, fade to battle)
  - Return to dungeon after battle (restore position)
- **Acceptance:**
  - Battles trigger appropriately during dungeon exploration
  - Encounter rates feel balanced (not too frequent/rare)
  - Enemy groups scale with dungeon depth
  - Smooth transitions between dungeon and battle
- **Time:** 3 hours
- **Tests Required:** 8+ tests

### Task 2.4: Boss Battle System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/bossSystem.ts` (NEW), `src/data/bosses.ts` (NEW)
- **Action:**
  - Create 2 boss encounters:
    - **Living Statue** (Sol Sanctum mid-boss, 200 HP, Venus)
    - **Saturos** (Sol Sanctum final boss, 500 HP, Mars, multi-phase)
  - Boss-specific mechanics (healing, summons, rage mode)
  - Boss battle music and unique backgrounds
  - Victory cutscene integration
  - Guaranteed rewards (key items, rare equipment)
- **Acceptance:**
  - Boss battles more challenging than normal fights
  - Unique mechanics make bosses memorable
  - Boss HP scaled for party of level 5-8 characters
  - Victory triggers story progression
- **Time:** 4 hours
- **Tests Required:** 10+ tests

---

## PHASE 3: WORLD MAP & TRAVEL

### Task 3.1: World Map System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/worldMapSystem.ts` (NEW)
- **Action:**
  - Overworld map with player icon movement (8-directional)
  - Location markers for towns, dungeons, landmarks
  - Terrain types: grassland, forest, mountain, beach
  - Collision with mountains and water (until abilities unlocked)
  - Zoom in/out functionality (2x, 3x, 4x scale)
  - Party formation display (4 character sprites)
- **Acceptance:**
  - World map navigable with smooth scrolling
  - Locations clearly marked and interactive
  - Terrain collision prevents invalid movement
  - Minimap shows player position and nearby locations
- **Time:** 4 hours
- **Tests Required:** 10+ tests

### Task 3.2: Random World Encounters (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/worldEncounterSystem.ts` (NEW)
- **Action:**
  - Random battles on world map (every 8-15 steps)
  - Enemy types vary by terrain (wolves in forest, lizards near water)
  - Safe zones near towns (no encounters)
  - Battle background matches terrain
  - Can flee from world map battles (100% success)
- **Acceptance:**
  - World map battles trigger appropriately
  - Enemy types thematic to terrain
  - Battle frequency balanced
  - Safe zones provide relief from combat
- **Time:** 2 hours
- **Tests Required:** 6+ tests

### Task 3.3: Location Discovery System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/locationSystem.ts` (NEW)
- **Action:**
  - Locations unlocked through story flags
  - Grayed-out locations shown on map (undiscovered)
  - Discovery notification when approaching new location
  - Location info panel (name, description, level range)
  - Fast travel to discovered towns
- **Acceptance:**
  - Locations unlock as player progresses
  - Visual distinction between discovered/undiscovered
  - Fast travel available from world map menu
  - Location info helpful for navigation
- **Time:** 2 hours
- **Tests Required:** 5+ tests

### Task 3.4: Travel UI (Graphics AI)
- **Owner:** Graphics AI
- **File(s):** `src/components/WorldMap.tsx` (NEW), `src/components/WorldMap.css` (NEW)
- **Action:**
  - Create world map visual with Golden Sun aesthetic
  - Pixel art overworld sprites (trees, mountains, towns)
  - Location icons (town, dungeon, landmark)
  - Player party sprite (4 characters walking formation)
  - Minimap overlay (semi-transparent)
  - Location info panel with GBA-style UI
- **Acceptance:**
  - World map matches Golden Sun GBA quality
  - All sprites and icons clear and readable
  - Minimap doesn't obstruct gameplay
  - UI elements accessible and intuitive
- **Time:** 2 hours

---

## PHASE 4: NEW TOWNS & LOCATIONS

### Task 4.1: Vault Town (Coder AI)
- **Owner:** Coder AI
- **File(s):** 
  - `src/data/locations/vault.ts` (NEW)
  - `src/data/npcs/vault_npcs.ts` (NEW)
- **Action:**
  - Create Vault town layout (20x20 tile grid)
  - Place 20+ NPCs with unique dialogues
  - Add buildings: Item Shop, Weapon Shop, Inn, Mayor's house, 6 homes
  - Town entrance from south (world map), exit to north (Goma Range)
  - Story event: Mayor's son trapped in Goma Range cave
  - Quest reward: 500 coins + Leather Boots
- **Acceptance:**
  - Town fully explorable with no invisible walls
  - All NPCs have dialogue reflecting story context
  - Shops functional with new items (Tier 2 equipment)
  - Quest completable and rewarding
- **Time:** 6 hours
- **Tests Required:** 15+ tests

### Task 4.2: Bilibin Town (Coder AI)
- **Owner:** Coder AI
- **File(s):** 
  - `src/data/locations/bilibin.ts` (NEW)
  - `src/data/npcs/bilibin_npcs.ts` (NEW)
- **Action:**
  - Create Bilibin town layout (25x25 tile grid, larger than Vault)
  - Place 25+ NPCs including guards, merchants, scholars
  - Add buildings: Item Shop, Weapon Shop, Inn, Palace, 8 homes
  - Palace interior with throne room
  - Story event: Lord Bilibin requests help with cursed Kolima Forest
  - Special NPC: Fortune teller (hints system)
- **Acceptance:**
  - Larger town with distinct palace district
  - Palace accessible with unique interior
  - NPCs provide story hints and lore
  - Fortune teller gives player hints on next objective
- **Time:** 7 hours
- **Tests Required:** 18+ tests

### Task 4.3: Kolima Village (Coder AI)
- **Owner:** Coder AI
- **File(s):** 
  - `src/data/locations/kolima.ts` (NEW)
  - `src/data/npcs/kolima_npcs.ts` (NEW)
- **Action:**
  - Create cursed Kolima Village (12x12 tile grid, small)
  - Place 10 NPCs transformed into trees (unique mechanic)
  - Add buildings: Item Shop, Inn, 4 homes (some inaccessible)
  - Story event: Residents cursed, need to reach Kolima Forest
  - Visual distinction: darker palette, eerie atmosphere
- **Acceptance:**
  - Town has unique cursed aesthetic
  - Tree-NPCs have dialogue (can still talk!)
  - Limited services (only item shop functional)
  - Story hook clear (must solve curse)
- **Time:** 4 hours
- **Tests Required:** 10+ tests

### Task 4.4: Additional Locations (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/data/locations/` (various)
- **Action:**
  - **Goma Range**: Mountain path dungeon (6 rooms, rock puzzles)
  - **Kolima Forest**: Cursed forest dungeon (8 rooms, tree enemies)
  - **Crossroads**: Small rest stop (inn, save point)
  - **Mercury Lighthouse** (exterior only, entrance for future expansion)
- **Acceptance:**
  - All locations accessible from world map
  - Dungeons have puzzles and treasures
  - Crossroads provides safe zone
  - Mercury Lighthouse visible but locked (coming soon message)
- **Time:** 5 hours
- **Tests Required:** 12+ tests

---

## PHASE 5: ADVANCED SYSTEMS

### Task 5.1: Djinn Collection System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/djinnSystem.ts` (NEW)
- **Action:**
  - Create 8 Djinn to find in Chapter 1:
    - **Flint** (Venus) - Near Vale (tutorial Djinn)
    - **Granite** (Venus) - Goma Range cave
    - **Forge** (Mars) - Sol Sanctum treasure room
    - **Fever** (Mars) - Hidden in Bilibin Palace
    - **Gust** (Jupiter) - Kolima Forest secret area
    - **Breeze** (Jupiter) - Bilibin outskirts
    - **Sleet** (Mercury) - Near Mercury Lighthouse
    - **Mist** (Mercury) - Vault town hidden area
  - Djinn battles (1v1, must weaken to recruit)
  - Set/Standby system (Set = stat boost, Standby = summon ready)
  - Djinn menu for managing Set/Standby state
- **Acceptance:**
  - All 8 Djinn findable and recruitable
  - Djinn battles challenging but fair
  - Set Djinn provide stat boosts (+5-10 HP, +2-3 ATK/DEF)
  - Standby Djinn ready for summons
- **Time:** 4 hours
- **Tests Required:** 12+ tests

### Task 5.2: Summon System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/summonSystem.ts` (NEW)
- **Action:**
  - Create 4 basic summons (1 Djinn each):
    - **Venus**: Rampart (Venus, 30 DMG, +DEF to party)
    - **Mars**: Tiamat (Mars, 40 DMG, fire AOE)
    - **Jupiter**: Atalanta (Jupiter, 35 DMG, +AGI to party)
    - **Mercury**: Nereid (Mercury, 25 DMG, heal 30 HP to party)
  - Summon activation requires Standby Djinn
  - After summon, Djinn enter Recovery state (3 turns)
  - Summon animations (flash, damage number, effects)
- **Acceptance:**
  - All 4 summons functional
  - Summons deal appropriate damage (stronger than normal attacks)
  - Djinn recovery system works correctly
  - Summons visually impressive
- **Time:** 4 hours
- **Tests Required:** 10+ tests

### Task 5.3: Enhanced Equipment System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/equipmentSystem.ts` (ENHANCE)
- **Action:**
  - Add equipment slots: Weapon, Armor, Helm, Gloves, Boots, Accessory
  - Create 30+ equipment pieces for Chapter 1:
    - Weapons: Wooden Stick, Bronze Sword, Iron Sword, Mace, Axe
    - Armor: Leather Armor, Bronze Armor, Iron Armor, Chain Mail
    - Helms: Leather Cap, Bronze Helm, Iron Helm
    - Gloves: Leather Gloves, Gauntlets
    - Boots: Leather Boots, Swift Boots
    - Accessories: Luck Ring, Defense Ring, Speed Ring
  - Equipment provides stat bonuses (ATK, DEF, AGI, luck)
  - Some equipment has elemental affinities (Fire Sword = +Mars power)
- **Acceptance:**
  - All equipment slots functional
  - 30+ items available from shops and chests
  - Equipment bonuses applied correctly to stats
  - Equipment screen shows stat changes on equip
- **Time:** 3 hours
- **Tests Required:** 8+ tests

### Task 5.4: Status Effect System (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/statusEffectSystem.ts` (NEW)
- **Action:**
  - Implement 6 status effects:
    - **Poison**: 5% max HP damage per turn, 5 turns
    - **Stun**: Skip 1 turn
    - **Sleep**: Skip turns until hit
    - **Seal**: Cannot use Psynergy
    - **Haunt**: -25% to all stats, 3 turns
    - **Delusion**: 50% chance to attack ally, 2 turns
  - Status icons appear above character sprites
  - Cure items and Psynergy can remove statuses
  - Status immunity for some enemies/equipment
- **Acceptance:**
  - All 6 statuses work as described
  - Status icons clear and readable
  - Cure mechanics functional
  - Status effects impact battle strategy
- **Time:** 2 hours
- **Tests Required:** 10+ tests

---

## PHASE 6: STORY & CUTSCENES

### Task 6.1: Prologue Cutscenes (Graphics AI + Coder AI)
- **Owner:** Both (coordinated effort)
- **File(s):** 
  - `src/systems/cutsceneSystem.ts` (NEW - Coder)
  - `src/components/CutscenePlayer.tsx` (NEW - Graphics)
- **Action:**
  - **Cutscene 1**: Isaac wakes up (Beat 1)
  - **Cutscene 2**: Meet Garet (Beat 2)
  - **Cutscene 3**: Kraden's request (Beat 4)
  - **Cutscene 4**: Sol Sanctum tragedy (Beat 7)
  - **Cutscene 5**: Elder's quest (Beat 8)
  - Cutscene engine: timed dialogue, character animations, camera pans
  - Skippable cutscenes (hold B button)
- **Acceptance:**
  - All 5 cutscenes playable
  - Cutscenes match Golden Sun's dramatic style
  - Story clearly communicated
  - Skippable without breaking game state
- **Time:** 4 hours (2h Coder, 2h Graphics)
- **Tests Required:** 8+ tests

### Task 6.2: Story Progression Flags (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/storyFlagSystem.ts` (NEW)
- **Action:**
  - Track 20+ story flags (booleans):
    - `mt_aleph_tragedy`: Prologue cutscene completed
    - `elder_quest_given`: Main quest started
    - `vault_mayor_quest_complete`: Goma Range quest done
    - `bilibin_lord_met`: Spoke with Lord Bilibin
    - `kolima_curse_seen`: Witnessed Kolima curse
    - etc.
  - Flags gate content (NPCs, locations, quests)
  - Flags saved in save data
  - Debug menu to view/modify flags (dev tool)
- **Acceptance:**
  - Story flags prevent sequence breaking
  - NPCs dialogue changes based on flags
  - Flags persist across save/load
  - Debug menu helps testing
- **Time:** 2 hours
- **Tests Required:** 5+ tests

### Task 6.3: Dynamic NPC Dialogues (Coder AI)
- **Owner:** Coder AI
- **File(s):** `src/systems/npcSystem.ts` (ENHANCE)
- **Action:**
  - NPCs have multiple dialogue branches based on story flags
  - Before tragedy: Peaceful dialogue
  - After tragedy: Concerned dialogue
  - After quests: Grateful/changed dialogue
  - 3-5 dialogue variants per major NPC
  - Randomized greetings for minor NPCs
- **Acceptance:**
  - NPCs feel alive and responsive to player actions
  - Dialogue changes logically with story
  - No stale/repetitive dialogue
  - Major NPCs have depth
- **Time:** 3 hours
- **Tests Required:** 10+ tests

### Task 6.4: Chapter 1 Ending Sequence (Graphics AI + Coder AI)
- **Owner:** Both
- **File(s):** 
  - `src/systems/endingSystem.ts` (NEW - Coder)
  - `src/components/EndingCutscene.tsx` (NEW - Graphics)
- **Action:**
  - Ending cutscene: Party reaches Mercury Lighthouse exterior
  - Isaac's monologue: "The journey has just begun..."
  - Credits roll (dev team, story director, testers)
  - "To Be Continued" screen
  - Option to save and continue (post-game exploration)
- **Acceptance:**
  - Ending feels satisfying and complete for Chapter 1
  - Credits formatted properly
  - Save after ending preserves all progress
  - Chapter 2 teased
- **Time:** 2 hours
- **Tests Required:** 3+ tests

---

## PHASE 7: POLISH & GRAPHICS

### Task 7.1: Battle Animations (Graphics AI)
- **Owner:** Graphics AI
- **File(s):** 
  - `src/components/BattleAnimations.tsx` (NEW)
  - `src/components/BattleAnimations.css` (NEW)
- **Action:**
  - Attack animations: Weapon swings, projectile trails
  - Psynergy animations: Elemental effects (fire, water, wind, earth)
  - Damage numbers: Pop up, arc, fade out
  - Hit flash: White flash on damage taken
  - KO animation: Enemy fades out, party member falls
  - Victory pose: Party members celebrate
  - Summon animations: Screen flash, summon sprite appears, attack effect
- **Acceptance:**
  - All animations smooth (30+ FPS)
  - Animations match Golden Sun style
  - Timing coordinated with damage application
  - No animation lag or stuttering
- **Time:** 5 hours

### Task 7.2: New Location Mockups (Graphics AI)
- **Owner:** Graphics AI
- **File(s):** `mockups/` directory (NEW files)
- **Action:**
  - Create HTML/CSS mockups for:
    - Sol Sanctum dungeon (10 room layouts)
    - World map (full overworld view)
    - Vault town (town layout)
    - Bilibin town (town + palace layout)
    - Kolima village (cursed aesthetic)
    - Goma Range (mountain path)
    - Kolima Forest (forest dungeon)
  - Include sprite placement, collision boundaries
  - Design tokens for each location theme
- **Acceptance:**
  - All mockups match Golden Sun GBA aesthetic
  - Mockups approved before React implementation
  - Sprite maps documented
  - Accessible design (WCAG 2.1 AA)
- **Time:** 6 hours

### Task 7.3: Sprite Integration (Graphics AI)
- **Owner:** Graphics AI
- **File(s):** `public/sprites/` (NEW sprites)
- **Action:**
  - Source/create 100+ new sprites:
    - 8 enemy sprites (battle poses)
    - 2 boss sprites (Living Statue, Saturos)
    - 20 world map sprites (trees, mountains, buildings)
    - 40 town NPC sprites (Vault, Bilibin, Kolima residents)
    - 20 dungeon sprites (rocks, statues, switches, chests)
    - 8 Djinn sprites (battle and overworld forms)
    - 4 summon sprites (Rampart, Tiamat, Atalanta, Nereid)
  - Integrate sprites into sprite registry
  - Test loading and rendering
- **Acceptance:**
  - All sprites load without 404 errors
  - Sprites scaled appropriately
  - Sprites match Golden Sun pixel art style
  - Sprite registry updated
- **Time:** 4 hours

### Task 7.4: UI Polish & Effects (Graphics AI)
- **Owner:** Graphics AI
- **File(s):** Various component CSS files
- **Action:**
  - Screen transitions: Fade in/out between areas (300ms)
  - Battle transitions: Flash effect entering battle (150ms white flash)
  - Menu animations: Slide in/out (200ms)
  - Text reveal: Character-by-character (50ms per character)
  - Particle effects: Sparkles on treasure chests, Psynergy activation glow
  - Screen shake: On critical hits (5-10px, 200ms)
  - Sound effect placeholders: Text beep, menu select, attack hit
- **Acceptance:**
  - All transitions smooth and polished
  - Effects enhance experience without overwhelming
  - Performance maintained (30+ FPS)
  - Effects respect prefers-reduced-motion
- **Time:** 3 hours

---

## ✅ Expansion Success Criteria

### Functional Completeness
- [ ] Turn-based combat system fully functional
- [ ] 8+ enemy types with unique AI
- [ ] Sol Sanctum dungeon explorable with puzzles
- [ ] World map with 4+ locations
- [ ] Vault, Bilibin, Kolima towns complete
- [ ] Djinn collection (8 Djinn findable)
- [ ] Summon system (4 summons usable)
- [ ] Equipment system (30+ items)
- [ ] Status effects (6 types implemented)
- [ ] Story progression (Prologue complete)

### Technical Quality
- [ ] TypeScript: 0 errors
- [ ] Tests: 200+ tests, 100% pass rate
- [ ] Build: Success, no warnings
- [ ] Performance: 30+ FPS in all areas
- [ ] No circular dependencies
- [ ] Code quality: Maintainable, documented

### Visual Quality
- [ ] All new locations have HTML/CSS mockups
- [ ] 100+ sprites integrated
- [ ] Battle animations smooth and impactful
- [ ] UI polish complete (transitions, effects)
- [ ] Matches Golden Sun GBA aesthetic (9/10 quality)
- [ ] WCAG 2.1 AA compliant

### Gameplay Experience
- [ ] 5-8 hours of gameplay content
- [ ] Combat engaging and strategic
- [ ] Dungeons challenging with satisfying puzzles
- [ ] Story compelling and well-paced
- [ ] NPCs feel alive and responsive
- [ ] Progression feels rewarding

---

## 🚫 Out of Scope (Defer to Chapter 2+)

- Mercury Lighthouse dungeon (interior)
- Fuchin Temple and eastern regions
- Imil town and northern areas
- Colosso tournament
- Late-game Djinn and summons
- Advanced Psynergy abilities
- Multiplayer or PvP features
- Voice acting or full audio
- Level cap beyond 20
- Party members beyond Isaac and Garet (Ivan/Mia join in Chapter 2)

---

## 📊 Expected End State

- **Total Systems:** 20+ game systems
- **Total Tests:** 200+ tests (from current ~20)
- **Total Files:** 120+ TypeScript files (from current ~50)
- **Total Sprites:** 130+ sprites (from current 30)
- **Total NPCs:** 70+ NPCs (from current 16)
- **Total Locations:** 10+ locations (from current 1)
- **Lines of Code:** 15,000-20,000 LOC
- **Gameplay Time:** 5-8 hours (Chapter 1 complete)

---

## ⏱️ Time Estimates

- **Phase 1 (Combat):** 15-20 hours
- **Phase 2 (Sol Sanctum):** 12-15 hours
- **Phase 3 (World Map):** 8-10 hours
- **Phase 4 (New Towns):** 15-20 hours
- **Phase 5 (Advanced Systems):** 10-12 hours
- **Phase 6 (Story):** 8-10 hours
- **Phase 7 (Polish):** 12-15 hours

**Total Estimated Time:** 80-100 hours

**Prompts Across 3 AIs:**
- Architect: 15-20 prompts (planning, review, coordination)
- Coder: 50-70 prompts (implementation, testing)
- Graphics: 20-30 prompts (mockups, sprites, polish)

**Total Prompts:** 85-120 prompts

---

## 🎯 Next Immediate Steps

1. **Architect:** Review and approve this expansion plan
2. **Coder:** Begin Phase 1, Task 1.1 (Combat System)
3. **Graphics:** Create battle screen mockup (Phase 1, Task 1.3)
4. **Parallel Work:** Coder implements combat logic while Graphics creates battle UI mockup
5. **Integration:** Combine logic and visuals after both complete their tasks

---

## 📞 Coordination Protocol

**Handoff Between Roles:**
```
Architect creates task prompt
  → Human copies to Coder/Graphics chat
  → Coder/Graphics executes task
  → Coder/Graphics reports completion
  → Human copies report back to Architect
  → Architect reviews and approves/requests changes
  → Repeat for next task
```

**Quality Gate Enforcement:**
- Coder must run `npm run type-check && npm test && npm run build` before every completion report
- Graphics must provide screenshots for every visual task
- Architect rejects incomplete work (no exceptions)

---

**Status:** 🎯 **READY TO BEGIN** - Expansion plan complete, awaiting Architect approval

**Created:** 2025-11-01

**Next Milestone:** Complete Phase 1 (Combat System) within 15-20 hours
