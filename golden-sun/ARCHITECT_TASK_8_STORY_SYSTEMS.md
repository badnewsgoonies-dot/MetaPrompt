# 🏛️ ARCHITECT TASK 8: Story & Battle Systems Implementation

**Project:** Golden Sun: Vale Village  
**Version:** 1.0  
**Date:** 2025-11-01  
**Role:** Architect AI

---

## 📋 OVERVIEW

This task implements the three core systems that bring Vale Village to life:
1. **Dialogue System** - Handles NPC conversations, choices, and battle challenges
2. **Quest System** - Manages main/side quests, objectives, and progression
3. **Story Flag System** - Tracks player progress and unlocks content

---

## 🎯 IMPLEMENTATION PRIORITY

### Phase 1: Core Systems (Coder)
1. Story Flag System (foundation for everything)
2. Dialogue System (with battle integration)
3. Quest System (depends on dialogue and flags)

### Phase 2: Integration (Coder)
4. Integrate with existing game systems
5. Hook up DialogueBox component
6. Connect battle simulator
7. Add quest tracking UI integration points

### Phase 3: UI & Polish (Graphics)
8. Create QuestLog component
9. Enhance DialogueBox with battle challenges
10. Add visual indicators (quest markers, badges)

---

## 🛠️ CODER TASKS

### Task 8A: Implement Story Flag System

**File:** `src/systems/storyFlagSystem.ts`

**Purpose:** Track player progress through boolean and numeric flags

**Key Functions:**
```typescript
export function createFlagSystem(): FlagSystem
export function getFlag(system: FlagSystem, key: string): boolean | number | string | undefined
export function setFlag(system: FlagSystem, key: string, value: any): Result<FlagSystem, string>
export function checkCondition(system: FlagSystem, condition: string): boolean
export function incrementFlag(system: FlagSystem, key: string, amount?: number): Result<FlagSystem, string>
export function saveFlags(system: FlagSystem): Result<void, string>
export function loadFlags(): Result<FlagSystem, string>
```

**Data Structure:**
```typescript
export interface FlagSystem {
  flags: Record<string, boolean | number | string>;
  history: FlagHistoryEntry[]; // For debugging
}

export interface FlagHistoryEntry {
  key: string;
  value: any;
  timestamp: number;
}
```

**Condition Parsing:**
- Support: `flag_name`, `!flag_name`, `flag1 && flag2`, `flag1 || flag2`
- Support: `battles_won >= 3`, `silver_badge_earned`
- Support: `quest:quest_id:completed`

**Integration Points:**
- Save/load to localStorage
- Integrate with existing save system if present
- Export for use by dialogue and quest systems

**Tests:**
- Test flag getting/setting
- Test condition checking (all operators)
- Test save/load functionality
- Test flag history tracking

---

### Task 8B: Implement Dialogue System

**File:** `src/systems/dialogueSystem.ts`

**Purpose:** Manage NPC conversations with battle challenges and story variations

**Key Functions:**
```typescript
export function startDialogue(
  npcId: string,
  flags: FlagSystem
): Result<DialogueState, string>

export function advanceDialogue(
  state: DialogueState,
  choice?: number
): Result<DialogueState, string>

export function getCurrentLine(state: DialogueState): DialogueLine

export function isDialogueComplete(state: DialogueState): boolean

export function handleDialogueAction(
  action: DialogueAction,
  state: DialogueState,
  flags: FlagSystem
): Result<{ state: DialogueState; flags: FlagSystem; specialAction?: any }, string>
```

**Features:**
- Load dialogue trees from `dialogueData.ts`
- Find correct starting line based on story flags
- Handle player choices (branching dialogue)
- Handle special actions (battle, shop, quest triggers)
- Track dialogue history
- Set flags after dialogue

**Integration Points:**
- Connect to `DIALOGUE_DATA` from `data/dialogueData.ts`
- Integrate with battle simulator (trigger battles)
- Connect to shop system (existing)
- Connect to quest system (trigger quests)
- Update `DialogueBox` component to use this system

**Tests:**
- Test dialogue tree loading
- Test flag-based starting lines
- Test branching dialogue
- Test action handling
- Test flag setting after dialogue

---

### Task 8C: Implement Quest System

**File:** `src/systems/questSystem.ts`

**Purpose:** Manage quest progression, objectives, and rewards

**Key Functions:**
```typescript
export function createQuestSystem(flags: FlagSystem): QuestSystem

export function getAvailableQuests(
  system: QuestSystem,
  flags: FlagSystem
): Quest[]

export function startQuest(
  system: QuestSystem,
  questId: string
): Result<QuestSystem, string>

export function updateObjective(
  system: QuestSystem,
  questId: string,
  objectiveId: string,
  progress?: number
): Result<QuestSystem, string>

export function completeQuest(
  system: QuestSystem,
  questId: string,
  flags: FlagSystem
): Result<{ system: QuestSystem; flags: FlagSystem; rewards: QuestReward[] }, string>

export function checkQuestCompletion(
  system: QuestSystem,
  questId: string
): boolean

export function getActiveQuests(system: QuestSystem): Quest[]

export function getQuestProgress(system: QuestSystem, questId: string): string
```

**Data Structure:**
```typescript
export interface QuestSystem {
  quests: Record<string, Quest>; // All quests with current state
  activeQuests: string[]; // Quest IDs
  completedQuests: string[]; // Quest IDs
}
```

**Features:**
- Load quests from `questData.ts`
- Check prerequisites before making quests available
- Track objective progress
- Auto-complete quests when objectives met
- Award rewards (items, coins, equipment, badges)
- Set flags when quests complete
- Support repeatable quests

**Integration Points:**
- Connect to `QUEST_DATA` from `data/questData.ts`
- Integrate with dialogue system (quest triggers)
- Integrate with battle system (battle objectives)
- Integrate with flag system (prerequisites, rewards)
- Provide data to QuestLog UI component

**Tests:**
- Test quest availability based on flags
- Test quest progression
- Test objective completion
- Test reward granting
- Test repeatable quests
- Test quest completion conditions

---

### Task 8D: Integration with Game

**Files:** Multiple (existing game files)

**Purpose:** Connect new systems to existing game code

**Integration Points:**

1. **Game State** (`src/types/game.ts` or similar):
```typescript
export interface GameState {
  // Existing state...
  flags: FlagSystem;
  dialogue: DialogueState | null;
  quests: QuestSystem;
  badges: string[]; // Track earned badges
}
```

2. **NPC Interactions** (`src/systems/npcSystem.ts` or similar):
- When player interacts with NPC (E key):
  - Start dialogue using `startDialogue(npcId, flags)`
  - Display DialogueBox with current line
  - Handle player choices
  - Handle special actions (battle challenges)

3. **Battle Integration**:
- When dialogue action is `{ type: 'battle', npcId: 'xyz' }`:
  - Trigger battle simulator
  - After battle, set flag `defeated_[npcId]`
  - Increment `battles_won` counter
  - Check badge eligibility
  - Return to dialogue with post-battle line

4. **Quest Tracking**:
- After NPC dialogue that mentions quest:
  - Check if quest should start
  - Update quest objectives as player progresses
  - Show quest completion notification
  - Award rewards

5. **Save/Load**:
- Save flags, dialogue state, and quest state
- Load on game start

**Tests:**
- Test full interaction flow (talk → dialogue → battle → reward)
- Test save/load with all systems
- Test quest progression through gameplay
- Test badge unlocking

---

## 🎨 GRAPHICS TASKS

### Task 8E: Create QuestLog Component

**File:** `src/components/QuestLog.tsx`

**Purpose:** Display active and completed quests with progress

**Design Requirements:**
- **GBA-style aesthetic** matching existing game
- **Scrollable list** of quests
- **Quest categories:** Main Quests, Side Quests
- **Progress indicators:** X/Y objectives complete
- **Expandable details:** Click quest to see full details
- **Rewards preview:** Show what you'll earn

**Component Structure:**
```tsx
export function QuestLog({
  quests,
  onClose
}: {
  quests: Quest[];
  onClose: () => void;
}) {
  // Render quest list
}
```

**Features:**
- Tab/filter: Active | Completed | All
- Quest cards with:
  - Title and description
  - Objective list with checkmarks
  - Rewards list
  - Quest giver info
- Highlight main quest
- Gold border for completed quests
- Smooth animations

**Styling:**
- Use existing game's color palette
- GBA font if available
- 8-bit style borders and buttons
- Responsive (works on mobile with OnScreenController)

---

### Task 8F: Enhance DialogueBox Component

**File:** `src/components/DialogueBox.tsx` (modify existing)

**Purpose:** Add battle challenge support and improved styling

**Enhancements:**

1. **Battle Challenge UI:**
- When dialogue offers battle challenge:
  - Show "Battle" button prominently
  - Different styling for challenge vs. normal dialogue
  - Battle icon or indicator

2. **Choice Buttons:**
- Display multiple choice options
- Highlight selected choice
- Keyboard navigation (arrow keys + Enter)

3. **Visual Improvements:**
- Character name label
- Portrait space (if sprites available)
- Next indicator (▼) when more dialogue
- Smooth text reveal animation (optional)
- Better button styling

4. **Flag-based Variations:**
- Show badge earned notifications
- Display quest started/completed notifications
- Visual feedback for story progression

**Example Enhanced Layout:**
```
┌─────────────────────────────────────┐
│ [NPC Portrait]  Garet               │
├─────────────────────────────────────┤
│                                     │
│  "Isaac! Want to battle?"           │
│                                     │
│  [⚔️ Accept Battle]  [Maybe Later] │
│                                     │
└─────────────────────────────────────┘
```

---

## 📊 SUCCESS CRITERIA

### Coder Deliverables
- ✅ `storyFlagSystem.ts` implemented with tests
- ✅ `dialogueSystem.ts` implemented with tests
- ✅ `questSystem.ts` implemented with tests
- ✅ All systems integrated with game
- ✅ Battle challenges work end-to-end
- ✅ Quest progression functional
- ✅ Save/load preserves all progress
- ✅ TypeScript: 0 errors
- ✅ All tests passing (50+ tests)

### Graphics Deliverables
- ✅ QuestLog component created and styled
- ✅ DialogueBox enhanced with battle challenges
- ✅ Quest markers/indicators (optional but nice)
- ✅ Badge display UI (optional)
- ✅ GBA aesthetic maintained
- ✅ Responsive design works

### Integration Quality
- ✅ Player can complete full quest cycle
- ✅ Battle progression unlocks content
- ✅ Dialogue changes based on progress
- ✅ No console errors
- ✅ 60 FPS maintained
- ✅ Save/load works perfectly

---

## 🚀 IMPLEMENTATION ORDER

### Day 1: Core Systems (Coder)
1. Implement Story Flag System (2-3 hours)
2. Implement Dialogue System (3-4 hours)
3. Write tests for both (2 hours)

### Day 2: Quest System (Coder)
4. Implement Quest System (4-5 hours)
5. Write quest tests (2 hours)

### Day 3: Integration (Coder)
6. Integrate with game state (2 hours)
7. Hook up NPC interactions (2 hours)
8. Connect battle simulator (2 hours)
9. Test full gameplay loop (2 hours)

### Day 4: UI (Graphics)
10. Create QuestLog component (3-4 hours)
11. Enhance DialogueBox (2-3 hours)
12. Add visual polish (2 hours)

### Day 5: Testing & Polish
13. End-to-end testing (3 hours)
14. Bug fixes (2 hours)
15. Performance optimization (1 hour)
16. Final QA (2 hours)

**Total Estimated Time:** 35-45 hours

---

## 📝 NOTES FOR CODER

### Pattern Matching
- Use existing codebase patterns (Result types, pure functions)
- Follow TypeScript strict mode
- Write comprehensive tests
- Document complex logic

### Performance Considerations
- Cache dialogue trees (don't parse every time)
- Optimize quest checking (only check active quests)
- Debounce flag updates if needed

### Error Handling
- Use Result<T, E> for all fallible operations
- Provide clear error messages
- Log errors for debugging
- Never crash the game

---

## 📝 NOTES FOR GRAPHICS

### Design Consistency
- Match existing game aesthetic exactly
- Use same fonts, colors, button styles
- Maintain GBA pixel-art feel
- Test on multiple screen sizes

### User Experience
- Quest log should be easy to navigate
- Battle challenges should be obvious
- Dialogue should feel responsive
- No jarring transitions

---

**ARCHITECT TASK 8 COMPLETE**

*This document provides complete specifications for implementing the story, dialogue, and quest systems. Coder and Graphics roles can now execute independently with clear requirements.*

---

**Next:** Coder AI begins implementation of systems.
