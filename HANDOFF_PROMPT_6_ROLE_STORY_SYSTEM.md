# 🎮 HANDOFF PROMPT: 6-Role Story & Progression System

**Copy this entire document to your next chat to set up the 6-role workflow.**

---

## 📋 PROJECT CONTEXT

### What We're Building
**Golden Sun: Vale Village** - A GBA-style RPG with authentic story, dialogue, and progression systems.

### Current State (What's DONE)
✅ **Phase 1: Map & Sprites Complete (Tasks 1-7)**
- Vale Village expanded to 1920x1280px (2x original)
- 28 buildings with GBA-style sprites
- 50 NPCs with authentic Golden Sun character sprites
- 5 terrain objects (trees, gate)
- Perfect collision system (33 obstacles)
- 3 sprite registries (buildings, NPCs, terrain)
- TypeScript: 0 errors, Build: Success

### What's MISSING (What We Need NOW)
❌ **Story & Dialogue System**
- NPCs have NO dialogue (placeholder IDs only)
- No story progression or quests
- No natural gameplay flow
- No character personalities or arcs
- No tutorial or onboarding

❌ **Gameplay Progression**
- No objectives or goals for player
- No quest log or tracking
- No story flags/triggers
- No cutscenes or story beats
- No dialogue choices or branching

---

## 🎯 YOUR MISSION

**Implement the 6-Role AI System to create:**
1. **Story Bible** - World, lore, plot, character arcs
2. **Dialogue System** - All 50 NPCs know their lines
3. **Quest System** - Natural progression with objectives
4. **Story Flags** - Track player progress and unlock content
5. **Cutscenes** - Key story moments (optional)
6. **Integration** - Everything works together seamlessly

---

## 👥 THE 6-ROLE AI SYSTEM

You will act as **all 6 roles** in this single chat, using clear role labels for each task:

### 🎬 Role 1: Story Director
**Responsibilities:**
- Create Story Bible (world, factions, tone, plot)
- Define character personalities and arcs for all 50 NPCs
- Write plot outline with story beats
- Design progression flow (tutorial → early game → mid game)
- Create story flags system (what unlocks what)

**Outputs:**
- `STORY_BIBLE.md` - World, lore, characters
- `PLOT_OUTLINE.md` - Story beats and progression
- `CHARACTER_PROFILES.md` - Personality for each of 50 NPCs

---

### ✍️ Role 2: Dialogue Writer
**Responsibilities:**
- Write ALL dialogue for 50 NPCs
- Create dialogue variations based on story flags
- Write tutorial/onboarding dialogue
- Ensure authentic Golden Sun tone and style
- Create dialogue trees for key conversations

**Outputs:**
- `dialogueData.ts` - All NPC dialogue with variations
- Dialogue IDs mapped to story flags
- Natural, engaging conversations

---

### 📜 Role 3: Quest Designer
**Responsibilities:**
- Design quest structure (main quests + side quests)
- Create objectives and success criteria
- Design quest rewards (items, progression)
- Create quest log UI requirements
- Define quest triggers and completion logic

**Outputs:**
- `questData.ts` - All quest definitions
- `QUEST_DESIGN.md` - Quest flow documentation

---

### 🏛️ Role 4: Architect AI
**Responsibilities:**
- Plan system architecture for dialogue/quest/story flags
- Create task prompts for Coder and Graphics
- Review implementation quality
- Ensure patterns match existing codebase

**Outputs:**
- Session plans for each implementation phase
- Task prompts for Coder/Graphics
- Architecture decisions documented

---

### 🛠️ Role 5: Coder AI
**Responsibilities:**
- Implement dialogue system (display, choices, branching)
- Implement quest system (tracking, objectives, completion)
- Implement story flags system (save/load, trigger logic)
- Create data structures for dialogue/quests
- Write comprehensive tests

**Outputs:**
- `src/systems/dialogueSystem.ts`
- `src/systems/questSystem.ts`
- `src/systems/storyFlagSystem.ts`
- `src/data/dialogueData.ts`
- `src/data/questData.ts`
- Tests for all systems

---

### 🎨 Role 6: Graphics AI
**Responsibilities:**
- Design quest log UI
- Improve dialogue box aesthetics
- Add quest markers/indicators
- Create story cutscene layouts (if needed)
- Polish all visual elements

**Outputs:**
- Quest log component
- Enhanced dialogue UI
- Visual indicators for quests/NPCs

---

## 📁 CURRENT PROJECT STRUCTURE

### Key Files That EXIST
```
golden-sun/
├── src/
│   ├── systems/
│   │   ├── overworldSystem.ts (Vale scene with 28 buildings, 50 NPCs)
│   │   ├── movementSystem.ts (Player movement, collision)
│   │   ├── npcSystem.ts (NPC management)
│   │   └── shopSystem.ts (Shop interactions)
│   ├── components/
│   │   ├── DialogueBox.tsx (EXISTS, basic implementation)
│   │   ├── ShopMenu.tsx (Shop UI)
│   │   └── OnScreenController.tsx (Mobile controls)
│   ├── data/
│   │   ├── buildingSpriteRegistry.ts (28 buildings)
│   │   ├── npcSpriteRegistry.ts (50 NPCs)
│   │   └── terrainSpriteRegistry.ts (5 terrain)
│   └── types/
│       └── scene.ts (Scene, NPC, Door types)
└── public/
    ├── sprite_map.json (ALL data for Vale Village)
    └── assets/ (All sprites)
```

### NPCs That Need Dialogue (50 total)
**Major Characters (needs rich dialogue):**
- Isaac (player)
- Garet (childhood friend, Mars adept)
- Dora (Isaac's mother)
- Elder (village leader)
- Kraden (scholar)
- Jenna (close friend)
- Kyle (Garet's father)
- Innkeeper, Armor Shop Owner, etc.

**Minor Characters (needs simple dialogue):**
- 30+ villagers, guards, farmers, children

**Current Issue:** All NPCs have placeholder `dialogue_id` like `"garet-intro"` but NO actual dialogue data exists.

---

## 🎯 STEP-BY-STEP WORKFLOW

### Phase 1: Story Foundation (Story Director)
**Time: 2-3 hours**

**As Story Director, create:**

1. **STORY_BIBLE.md**
   - World overview (Vale Village, Sol Sanctum, Alchemy)
   - Faction/element system (Venus, Mars, Jupiter, Mercury)
   - Tone and style (epic adventure, mystery, friendship)
   - Key story themes
   - Lexicon (terms, places, Psynergy powers)

2. **PLOT_OUTLINE.md**
   - Opening: Isaac wakes up, earthquake aftermath
   - Tutorial: Learn movement, talk to Dora
   - Inciting incident: Elder summons, Sol Sanctum danger
   - Rising action: Gather party (Garet, Jenna), investigate
   - Story beats: 5-7 major story moments
   - Progression gates: What unlocks next areas

3. **CHARACTER_PROFILES.md**
   - All 50 NPCs with:
     - Personality traits (3-5 keywords)
     - Role in story (major/minor/side)
     - Relationships (who they know)
     - Dialogue style (formal/casual/comic relief)
     - Character arc (if major character)

**Quality Gates:**
- [ ] Story Bible fits on 2-3 pages
- [ ] Plot has clear 5-7 story beats
- [ ] All 50 NPCs have personality defined
- [ ] Progression flow makes sense (tutorial → early → mid)

---

### Phase 2: Dialogue Writing (Dialogue Writer)
**Time: 4-6 hours**

**As Dialogue Writer, create:**

1. **dialogueData.ts** structure
   ```typescript
   export interface DialogueLine {
     id: string;
     speaker: string;
     text: string;
     next?: string | string[]; // Single next or choices
     condition?: string; // Story flag requirement
     setFlag?: string; // Flag to set after dialogue
   }

   export interface DialogueTree {
     id: string;
     start: string; // Starting dialogue line ID
     lines: Record<string, DialogueLine>;
   }

   export const DIALOGUE_DATA: Record<string, DialogueTree> = {
     "garet-intro": { /* ... */ },
     "dora-greeting": { /* ... */ },
     // ... all 50 NPCs
   };
   ```

2. **Write ALL dialogue:**
   - **Major NPCs:** 5-10 dialogue trees each (greetings, story beats, random chatter)
   - **Minor NPCs:** 1-3 dialogue variations each
   - **Tutorial NPCs:** Clear, helpful instruction dialogue
   - **Story progression:** Dialogue changes based on flags

3. **Dialogue variations by story state:**
   - Early game: "Welcome to Vale!" 
   - Mid game: "Did you hear about the Sanctum?"
   - Late game: "You saved us all!"

**Quality Gates:**
- [ ] All 50 NPCs have dialogue (no placeholders)
- [ ] Dialogue matches character personalities
- [ ] Authentic Golden Sun tone/style
- [ ] Tutorial dialogue is clear and helpful
- [ ] Story flags properly gate dialogue

---

### Phase 3: Quest System Design (Quest Designer)
**Time: 2-3 hours**

**As Quest Designer, create:**

1. **QUEST_DESIGN.md**
   - Quest structure overview
   - Main quest line (5-7 quests)
   - Side quests (5-10 optional)
   - Quest rewards and progression

2. **questData.ts** structure
   ```typescript
   export interface Quest {
     id: string;
     title: string;
     description: string;
     objectives: Objective[];
     rewards: Reward[];
     prerequisite?: string; // Required quest/flag
     startNPC?: string;
     endNPC?: string;
   }

   export interface Objective {
     id: string;
     description: string;
     type: 'talk' | 'collect' | 'visit' | 'defeat';
     target: string;
     current: number;
     required: number;
     completed: boolean;
   }
   ```

3. **Main Quest Line Example:**
   - Quest 1: "Morning in Vale" (Tutorial - talk to Dora, explore house)
   - Quest 2: "The Elder's Summons" (Go to Elder's house)
   - Quest 3: "Gather Your Friends" (Find Garet, Jenna)
   - Quest 4: "Sol Sanctum Investigation" (Enter Sanctum)
   - Quest 5+: Continue story progression

4. **Side Quests Example:**
   - "Lost Child" (Help find missing child)
   - "Farmer's Harvest" (Collect herbs for farmer)
   - "Blacksmith's Request" (Find rare metal)

**Quality Gates:**
- [ ] 5-7 main quests designed
- [ ] 5-10 side quests designed
- [ ] Clear objectives for each quest
- [ ] Progression flow makes sense
- [ ] Rewards are meaningful

---

### Phase 4: System Architecture (Architect AI)
**Time: 1-2 hours**

**As Architect AI, create:**

1. **Session Plan: Dialogue System Implementation**
   - Tasks for Coder: Implement dialogue system
   - Tasks for Graphics: Polish dialogue UI
   - Quality gates and acceptance criteria

2. **Session Plan: Quest System Implementation**
   - Tasks for Coder: Implement quest system
   - Tasks for Graphics: Create quest log UI

3. **Session Plan: Story Flags System**
   - Tasks for Coder: Implement flag tracking
   - Save/load integration

4. **Task Prompts:**
   - Task 8: Implement Dialogue System (Coder)
   - Task 9: Implement Quest System (Coder)
   - Task 10: Implement Story Flags (Coder)
   - Task 11: Create Quest Log UI (Graphics)
   - Task 12: Polish Dialogue UI (Graphics)

**Quality Gates:**
- [ ] All systems architecturally sound
- [ ] Task prompts are complete and clear
- [ ] Patterns match existing codebase
- [ ] Integration points defined

---

### Phase 5: Implementation (Coder AI)
**Time: 6-10 hours**

**As Coder AI, implement:**

1. **Dialogue System** (`src/systems/dialogueSystem.ts`)
   ```typescript
   // Key functions:
   - startDialogue(npcId: string, flags: StoryFlags): Result<DialogueState>
   - advanceDialogue(state: DialogueState, choice?: number): Result<DialogueState>
   - getCurrentLine(state: DialogueState): DialogueLine
   - isDialogueComplete(state: DialogueState): boolean
   ```

2. **Quest System** (`src/systems/questSystem.ts`)
   ```typescript
   // Key functions:
   - getActiveQuests(flags: StoryFlags): Quest[]
   - startQuest(questId: string): Result<Quest>
   - updateObjective(questId: string, objectiveId: string): Result<Quest>
   - completeQuest(questId: string): Result<Reward[]>
   ```

3. **Story Flags System** (`src/systems/storyFlagSystem.ts`)
   ```typescript
   // Key functions:
   - getFlag(key: string): boolean | number | string
   - setFlag(key: string, value: any): Result<void>
   - checkCondition(condition: string, flags: StoryFlags): boolean
   - saveFlags(): Result<void>
   - loadFlags(): Result<StoryFlags>
   ```

4. **Data Files:**
   - `src/data/dialogueData.ts` - All dialogue content
   - `src/data/questData.ts` - All quest definitions

5. **Integration:**
   - Hook dialogue system to NPC interactions
   - Update DialogueBox component to use new system
   - Add quest tracking to game state
   - Integrate story flags with save system

**Quality Gates:**
- [ ] TypeScript: 0 errors
- [ ] All systems tested (50+ tests total)
- [ ] Integration working smoothly
- [ ] Save/load preserves flags and quests
- [ ] All existing tests still pass

---

### Phase 6: Visual Polish (Graphics AI)
**Time: 2-4 hours**

**As Graphics AI, create:**

1. **Quest Log UI** (`src/components/QuestLog.tsx`)
   - Show active quests
   - Show objectives and progress
   - Show rewards
   - Beautiful GBA-style aesthetic

2. **Enhanced Dialogue UI**
   - Character portraits (if sprites available)
   - Dialogue choice buttons
   - Next indicator (▼)
   - Smooth animations

3. **Quest Indicators**
   - ! marker above NPCs with quests
   - ? marker for ongoing quest objectives
   - Visual feedback for quest completion

4. **Story Cutscenes** (optional)
   - Simple fade transitions
   - Text overlays for story moments

**Quality Gates:**
- [ ] Quest log is beautiful and functional
- [ ] Dialogue UI matches Golden Sun aesthetic
- [ ] Quest indicators are clear
- [ ] No console errors
- [ ] 60 FPS performance maintained

---

## 🎨 GOLDEN SUN STYLE GUIDE

### Dialogue Writing Style
- **Tone:** Epic but approachable, mysterious but clear
- **Vocabulary:** Simple but evocative (avoid modern slang)
- **Length:** 2-3 sentences per dialogue box (GBA constraint)
- **Personality:** Each character has distinct voice
- **Examples:**
  - Garet: "Isaac! There you are! Did you feel that earthquake last night? It was HUGE!"
  - Elder: "Young ones... The time has come to speak of Sol Sanctum. What lies within is not for the curious."
  - Dora: "Good morning, dear. I hope you slept well despite the tremors."

### Story Themes
- **Friendship and loyalty** (core theme)
- **Ancient powers and responsibility** (Alchemy)
- **Mystery and discovery** (Sol Sanctum secrets)
- **Coming of age** (heroes accepting their destiny)

### Progression Pacing
- **Tutorial:** 5-10 minutes (movement, dialogue, basics)
- **Early game:** 15-20 minutes (meet characters, learn about Sanctum)
- **Mid game:** 30+ minutes (investigate, unlock areas, build party)

---

## 📊 EXPECTED OUTPUT

### Files You Will Create
```
golden-sun/
├── STORY_BIBLE.md
├── PLOT_OUTLINE.md
├── CHARACTER_PROFILES.md
├── QUEST_DESIGN.md
├── ARCHITECT_TASK_8_DIALOGUE_SYSTEM.md
├── ARCHITECT_TASK_9_QUEST_SYSTEM.md
├── ARCHITECT_TASK_10_STORY_FLAGS.md
├── ARCHITECT_TASK_11_QUEST_LOG_UI.md
├── ARCHITECT_TASK_12_DIALOGUE_UI_POLISH.md
└── src/
    ├── systems/
    │   ├── dialogueSystem.ts (NEW)
    │   ├── questSystem.ts (NEW)
    │   └── storyFlagSystem.ts (NEW)
    ├── components/
    │   ├── DialogueBox.tsx (ENHANCED)
    │   ├── QuestLog.tsx (NEW)
    │   └── QuestIndicator.tsx (NEW)
    ├── data/
    │   ├── dialogueData.ts (NEW - 50 NPCs)
    │   └── questData.ts (NEW)
    └── types/
        ├── dialogue.ts (NEW)
        ├── quest.ts (NEW)
        └── storyFlags.ts (NEW)
```

### Metrics
- **Story Documents:** 4 documents (Bible, Plot, Characters, Quests)
- **Dialogue Lines:** 200-500 total lines (50 NPCs)
- **Quests:** 5-7 main + 5-10 side = 10-17 total
- **Systems:** 3 new systems (dialogue, quest, flags)
- **Components:** 2 new + 1 enhanced UI components
- **Tests:** 50-100 new tests
- **Time:** 15-25 hours total across all 6 roles

---

## 🚀 HOW TO START

### Immediate First Steps

1. **Read Existing Project Context**
   ```bash
   # Check current state
   cd /workspace/golden-sun
   cat TASKS_4_TO_7_COMPLETION_REPORT.md
   cat public/sprite_map.json | jq '.entities[] | {id, name, dialogue_id}'
   ```

2. **Start with Story Director Role**
   ```markdown
   ## 🎬 ACTING AS: Story Director
   
   I'll create the Story Bible first...
   ```

3. **Progress Through All 6 Roles**
   - Story Director → Dialogue Writer → Quest Designer
   - Architect AI → Coder AI → Graphics AI

4. **Use Clear Role Labels**
   ```markdown
   ## 🎬 ROLE: Story Director
   [Story Bible content...]

   ## ✍️ ROLE: Dialogue Writer
   [Dialogue data...]

   ## 🏛️ ROLE: Architect AI
   [Session plan...]

   ## 🛠️ ROLE: Coder AI
   [Implementation...]

   ## 🎨 ROLE: Graphics AI
   [UI polish...]
   ```

---

## ✅ SUCCESS CRITERIA

### Story Quality
- [ ] Story Bible is compelling and clear (2-3 pages)
- [ ] All 50 NPCs have distinct personalities
- [ ] Plot progression feels natural and engaging
- [ ] Authentic Golden Sun tone maintained

### Dialogue Quality
- [ ] All 50 NPCs have complete dialogue
- [ ] Dialogue matches character personalities
- [ ] Tutorial dialogue is clear and helpful
- [ ] Story progression feels natural through dialogue

### Quest Quality
- [ ] 10-17 quests designed and implemented
- [ ] Clear objectives and rewards
- [ ] Natural progression flow
- [ ] Side quests add depth without confusion

### Technical Quality
- [ ] TypeScript: 0 errors
- [ ] 50+ new tests (all passing)
- [ ] Systems integrate smoothly
- [ ] Save/load works perfectly
- [ ] UI is beautiful and functional

### Player Experience
- [ ] Player knows what to do next
- [ ] Story is engaging and compelling
- [ ] NPCs feel alive and distinct
- [ ] Progression feels rewarding
- [ ] Tutorial is smooth and clear

---

## 🎯 YOUR GOAL

**By the end of this session, Vale Village should be a LIVING, BREATHING world:**
- ✅ Every NPC has personality and purpose
- ✅ Story unfolds naturally through dialogue
- ✅ Player has clear quests and objectives
- ✅ Progression feels rewarding and natural
- ✅ Tutorial teaches gameplay smoothly
- ✅ World feels authentic to Golden Sun

---

## 📝 CRITICAL REMINDERS

1. **Work through all 6 roles systematically**
   - Don't skip ahead to implementation
   - Story/dialogue/quests FIRST, then code

2. **Use existing codebase patterns**
   - Result types for errors
   - Pure functions
   - TypeScript strict mode
   - Comprehensive tests

3. **Quality over quantity**
   - 50 great dialogue lines > 200 mediocre ones
   - 5 engaging quests > 20 boring ones

4. **Maintain Golden Sun authenticity**
   - Study the tone and style
   - Match character personalities from the game
   - Honor the world and lore

5. **Test everything**
   - Manual testing of dialogue flow
   - Quest progression verification
   - Save/load testing
   - UI polish testing

---

## 🚀 READY TO START?

**Copy this entire prompt to your next chat and begin with:**

"I've read the full 6-role handoff prompt. I'll now act as all 6 roles to create story, dialogue, and progression for Golden Sun: Vale Village. Starting with Story Director role to create the Story Bible..."

---

**END OF HANDOFF PROMPT**

Good luck! You're creating something amazing. 🎮✨
