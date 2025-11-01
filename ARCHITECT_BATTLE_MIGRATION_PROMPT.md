# 🏛️ ARCHITECT AI: Battle System Migration Planning & Coordination

**ROLE:** Strategic Architect  
**PROJECT:** NextEraGame → Golden Sun Battle System Migration  
**PHASE:** Planning, Architecture, and Coordination  
**TIME ESTIMATE:** 6-8 hours  
**CONTEXT:** Full migration plan at `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md`

---

## 🎯 YOUR MISSION

You are the **Architect AI** responsible for:
1. **Strategic Planning** - Create detailed task prompts for Coder and Graphics AIs
2. **Architecture Design** - Design integration points between systems
3. **Coordination** - Review completed work and ensure quality
4. **Decision Making** - Make architectural decisions and resolve conflicts
5. **Quality Assurance** - Enforce standards and verify completion

---

## 📊 PROJECT CONTEXT

### What We're Building

**Migrating FROM:** NextEraGame (Production JRPG battle system)
- 24,500+ LOC, 1,029+ tests (99.6% pass)
- Complete turn-based combat with Golden Sun aesthetic
- Deterministic, tested, production-ready

**Migrating TO:** Golden Sun: Vale Village (Overworld RPG)
- Currently: Exploration + dialogue + story system only
- Goal: Add complete battle system (trainer battles + random encounters)

### Migration Scope

**Total Effort:** 48-68 hours across 3 AI roles
- **Architect (YOU):** 6-8 hours
- **Coder:** 25-35 hours  
- **Graphics:** 8-12 hours

**Files to Migrate:** ~55 files, ~8,000 lines of code
- Core systems: 8 files (3,439 LOC)
- Battle components: 20 files (2,391 LOC)
- Data files: 5 files (~800 LOC)
- Hooks: 5 files (~500 LOC)
- Tests: 500+ tests (1,466 LOC)

---

## 📋 YOUR TASKS

### TASK 1: Study the Codebase (2-3 hours)

**Read these files completely in NextEraGame:**

```bash
# Core Battle Logic (MUST READ)
/workspace/nexteragame/src/hooks/useManualBattle.ts
/workspace/nexteragame/src/screens/BattleScreen.tsx
/workspace/nexteragame/src/types/game.ts (lines 1-400)

# Supporting Systems (IMPORTANT)
/workspace/nexteragame/src/systems/AbilitySystem.ts
/workspace/nexteragame/src/systems/BuffSystem.ts
/workspace/nexteragame/src/systems/ItemSystem.ts
/workspace/nexteragame/src/systems/ElementSystem.ts
/workspace/nexteragame/src/systems/GemSuperSystem.ts

# Data Structure (REFERENCE)
/workspace/nexteragame/src/data/starterUnits.ts
/workspace/nexteragame/src/data/opponents.ts
/workspace/nexteragame/src/data/elementalSpells.ts

# Tests (BEHAVIOR)
/workspace/nexteragame/tests/screens/BattleScreen.test.tsx
/workspace/nexteragame/tests/systems/BattleSystem.test.ts

# Architecture Docs
/workspace/nexteragame/README.md
/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md (your reference guide)
```

**Read these files in Golden Sun (current state):**

```bash
# Current Architecture
/workspace/golden-sun/src/GoldenSunApp.tsx
/workspace/golden-sun/src/systems/dialogueSystem.ts
/workspace/golden-sun/src/systems/questSystem.ts
/workspace/golden-sun/src/systems/storyFlagSystem.ts

# Current Types
/workspace/golden-sun/src/types/dialogue.ts
/workspace/golden-sun/src/types/quest.ts
/workspace/golden-sun/src/types/scene.ts

# Current Data
/workspace/golden-sun/public/sprite_map.json
/workspace/golden-sun/src/data/dialogueData.ts
```

**Deliverable:** Create `CODEBASE_ANALYSIS.md` with:
- Dependency graph (what imports what)
- Integration points (where battle system connects to Golden Sun)
- Type conflicts (NextEraGame types vs Golden Sun types)
- Risk areas (complex files, potential breaking changes)

---

### TASK 2: Design Type System Integration (1-2 hours)

**Problem:** NextEraGame and Golden Sun have different type systems

**NextEraGame Types:**
- `BattleUnit` - In-battle state (HP, MP, buffs)
- `PlayerUnit` - Roster unit (permanent state)
- `EnemyUnitTemplate` - Enemy definition
- `Element` - 6 elements (Venus/Mars/Jupiter/Mercury/Moon/Sun)
- `Ability` - MP-based spells
- `Item` - Equipment and consumables

**Golden Sun Types:**
- `NPC` - Overworld character (dialogue, position)
- `Scene` - Overworld area (Vale Village)
- `DialogueState` - Conversation state
- No battle types yet!

**Your Design Task:**

Create `TYPE_INTEGRATION_STRATEGY.md` with:

1. **Separate Battle Types** - Keep battle types in `types/battle.ts` (don't pollute existing types)
2. **Adapter Functions** - How to convert between NPC ↔ BattleUnit
3. **Element Decision** - Use 4 canonical GS elements or keep 6?
4. **Naming Conventions** - "Ability" vs "Psynergy"? "Gem" vs "Djinn"?
5. **Import Strategy** - How to avoid circular dependencies

**Example Design:**

```typescript
// NEW FILE: types/battle.ts
export interface BattleUnit {
  id: string;
  name: string;
  currentHp: number;
  maxHp: number;
  currentMp: number;
  maxMp: number;
  atk: number;
  def: number;
  speed: number;
  isPlayer: boolean;
  buffState: BuffState;
}

// ADAPTER FILE: adapters/battleAdapters.ts
export function npcToBattleEnemy(npc: NPC, level: number): BattleUnit {
  return {
    id: npc.id,
    name: npc.name,
    currentHp: calculateHpForLevel(level),
    maxHp: calculateHpForLevel(level),
    // ... etc
  };
}

export function partyMemberToBattleUnit(member: PartyMember): BattleUnit {
  return {
    id: member.id,
    name: member.name,
    currentHp: member.hp,
    maxHp: member.maxHp,
    // ... etc
  };
}
```

**Decisions You Must Make:**

| Decision | Option A | Option B | Recommendation |
|----------|----------|----------|----------------|
| Elements | 4 (Venus/Mars/Jupiter/Mercury) | 6 (add Moon/Sun) | Start with 4, add 2 later |
| Ability Name | Keep "Ability" | Rename to "Psynergy" | Rename for GS authenticity |
| Gem System | Keep "Gem" | Rename to "Djinn" | Rename to "Djinn" |
| State Management | Add to GoldenSunApp | Port GameController | GoldenSunApp (simpler) |

---

### TASK 3: Design Integration Architecture (1-2 hours)

**Problem:** How does overworld connect to battle system?

**Create:** `BATTLE_INTEGRATION_ARCHITECTURE.md`

**Design these systems:**

#### 3.1: Battle Trigger System

```typescript
// How dialogue triggers battles
export interface DialogueAction {
  // Existing actions
  | { type: 'shop'; shopId: string }
  | { type: 'setFlag'; flagName: string; value: any }
  // NEW: Battle action
  | { type: 'battle'; 
      enemyParty: BattleEnemyParty; 
      canFlee: boolean;
      onVictory?: DialogueAction;
      onDefeat?: DialogueAction;
    }
}

// Usage in dialogue:
{
  id: "trainer_garet_challenge",
  speaker: "Garet",
  text: "Let's battle! Show me what you've got!",
  action: {
    type: 'battle',
    enemyParty: 'trainer_garet_party',
    canFlee: false,
    onVictory: { type: 'setFlag', flagName: 'defeated_garet', value: true }
  }
}
```

#### 3.2: Battle Transition Flow

```
OVERWORLD (GoldenSunApp.tsx)
     ↓ [Player triggers battle]
SET BATTLE CONTEXT (store: enemy party, can flee?, battle type)
     ↓
FADE OUT (ScreenTransition)
     ↓
UNMOUNT OVERWORLD
     ↓
MOUNT BATTLE SCREEN (BattleScreen.tsx)
     ↓ [Battle plays out]
BATTLE RESULT (BattleResult)
     ↓
AWARD REWARDS (exp, items, story flags)
     ↓
FADE OUT
     ↓
UNMOUNT BATTLE SCREEN
     ↓
MOUNT OVERWORLD
     ↓
FADE IN
     ↓
CONTINUE DIALOGUE or FREE ROAM
```

#### 3.3: Battle State Management

**Option A: Add to GoldenSunApp (Simpler)**
```typescript
// In GoldenSunApp.tsx
const [battleContext, setBattleContext] = useState<BattleContext | null>(null);
const [gameMode, setGameMode] = useState<'overworld' | 'battle'>('overworld');

function startBattle(enemyParty: BattleEnemyParty, canFlee: boolean) {
  setBattleContext({ enemyParty, canFlee });
  setGameMode('battle');
}

function endBattle(result: BattleResult) {
  // Award rewards
  applyBattleRewards(result);
  // Return to overworld
  setGameMode('overworld');
  setBattleContext(null);
}
```

**Option B: Port GameController (More Robust)**
```typescript
// Port NextEraGame's GameController
// Handles state machine (Menu → Battle → Roster → etc)
// More complex but more scalable
```

**Your Decision:** Which option? Document rationale.

#### 3.4: Reward System Integration

```typescript
// After battle victory, award rewards
export interface BattleRewards {
  exp: number;          // Award to all party members
  coins: number;        // Add to party inventory
  items: Item[];        // Add to inventory
  storyFlags?: Record<string, any>; // Update flags
}

export function applyBattleRewards(
  result: BattleResult,
  party: PartyMember[],
  storyFlags: FlagSystem
): void {
  // Award EXP (implement leveling later)
  party.forEach(member => {
    member.exp += result.rewards.exp;
    // Check for level up?
  });
  
  // Add items to inventory
  addItemsToInventory(result.rewards.items);
  
  // Update story flags
  if (result.rewards.storyFlags) {
    Object.entries(result.rewards.storyFlags).forEach(([flag, value]) => {
      storyFlags.setFlag(flag, value);
    });
  }
}
```

---

### TASK 4: Create Coder Task Prompts (2-3 hours)

**Create 15 detailed task prompts for Coder AI**

Each task should include:
1. **Task ID** (CODER-01 through CODER-15)
2. **Title** (Clear, specific)
3. **Description** (What to do)
4. **Files to Create/Modify** (Specific paths)
5. **Acceptance Criteria** (How to verify success)
6. **Test Requirements** (Minimum test coverage)
7. **Dependencies** (What tasks must complete first)
8. **Estimated Time** (Hours)

**Create file:** `CODER_TASKS.md`

**Example Task Format:**

```markdown
### CODER-01: Migrate Core Utilities

**Description:**
Copy and adapt core utility functions from NextEraGame to Golden Sun.
These are foundational and have no dependencies on other systems.

**Files to Create:**
- `src/utils/rng.ts` - Copy from `/workspace/nexteragame/src/utils/rng.ts`
- `src/utils/id.ts` - Copy from `/workspace/nexteragame/src/utils/id.ts`

**Files to Modify:**
- `package.json` - Add `pure-rand` dependency

**Steps:**
1. Install dependency: `npm install pure-rand@^6.1.0`
2. Copy `rng.ts` unchanged (it's self-contained)
3. Copy `id.ts` unchanged
4. Create test files: `rng.test.ts`, `id.test.ts`
5. Run type-check (should pass)
6. Run tests (should pass)

**Acceptance Criteria:**
- [ ] `pure-rand` installed
- [ ] `rng.ts` copied and imports work
- [ ] `id.ts` copied and imports work
- [ ] All utilities have 100% test coverage
- [ ] TypeScript: 0 errors
- [ ] Existing game still builds and runs

**Test Requirements:**
- Minimum 50+ tests for `rng.ts`
- Minimum 10+ tests for `id.ts`
- Test determinism (same seed = same output)

**Dependencies:** None (can start immediately)

**Estimated Time:** 1-2 hours
```

**Required Tasks:**

1. **CODER-01:** Migrate Core Utilities (rng, id)
2. **CODER-02:** Create Battle Type Definitions (`types/battle.ts`)
3. **CODER-03:** Migrate BuffSystem
4. **CODER-04:** Migrate AbilitySystem → PsynergySystem
5. **CODER-05:** Migrate ItemSystem (merge with existing)
6. **CODER-06:** Migrate ElementSystem (adapt to 4 elements)
7. **CODER-07:** Migrate GemSuperSystem → DjinnSystem
8. **CODER-08:** Create Golden Sun Battle Data (units, enemies, spells)
9. **CODER-09:** Migrate useManualBattle Hook
10. **CODER-10:** Create Battle Trigger System (dialogue integration)
11. **CODER-11:** Create Battle Transition System (overworld ↔ battle)
12. **CODER-12:** Create Battle Reward System
13. **CODER-13:** Integrate with GoldenSunApp (state management)
14. **CODER-14:** Port BattleScreen Logic (not UI)
15. **CODER-15:** Port All Battle Tests (500+ tests)

---

### TASK 5: Create Graphics Task Prompts (1-2 hours)

**Create 10 detailed task prompts for Graphics AI**

**Create file:** `GRAPHICS_TASKS.md`

**Required Tasks:**

1. **GRAPHICS-01:** Copy Sprite Assets (2,500+ sprites + 19 animations)
2. **GRAPHICS-02:** Create Battle Component Structure (20 files)
3. **GRAPHICS-03:** Migrate Core Battle Components (BattleUnitSlot, ActionMenu)
4. **GRAPHICS-04:** Migrate Visual Effect Components (Damage, Heal, Attack)
5. **GRAPHICS-05:** Migrate Animation Components (Psynergy, Sprite animations)
6. **GRAPHICS-06:** Migrate Status Display Components (HP bars, MP bars, Turn banner)
7. **GRAPHICS-07:** Migrate BattleScreen UI (1,828 LOC - main controller)
8. **GRAPHICS-08:** Integrate Visual Effect Hooks (useScreenShake, useFlashEffect)
9. **GRAPHICS-09:** Polish and Styling (Ensure GS aesthetic consistency)
10. **GRAPHICS-10:** Create Battle Transition Animations (Fade in/out)

**Example Task:**

```markdown
### GRAPHICS-01: Copy Sprite Assets

**Description:**
Copy all Golden Sun sprite assets from NextEraGame to Golden Sun project.
This includes character sprites, enemy sprites, and psynergy animations.

**Files to Copy:**
- `/workspace/nexteragame/public/sprites/` → `/workspace/golden-sun/public/sprites/`
- All subdirectories and files

**Steps:**
1. Use shell command to copy entire sprites directory
2. Verify all 2,500+ sprites copied successfully
3. Create sprite registry: `src/data/battleSpriteRegistry.ts`
4. Register all battle-relevant sprites
5. Test loading sprites (no 404 errors)

**Acceptance Criteria:**
- [ ] All sprites copied (verify count: 2,500+)
- [ ] No broken image links in battle components
- [ ] Sprite registry created and documented
- [ ] All 19 psynergy animations present and functional

**Dependencies:** None

**Estimated Time:** 1 hour
```

---

### TASK 6: Create Dependency Graph (30 minutes)

**Create:** `DEPENDENCY_GRAPH.md`

Map out which files depend on which:

```
LAYER 1 (No Dependencies):
├── utils/rng.ts
├── utils/id.ts
└── utils/Result.ts

LAYER 2 (Only Layer 1):
├── types/battle.ts (depends on Result)
└── types/psynergy.ts

LAYER 3 (Layers 1-2):
├── systems/BuffSystem.ts (depends on types)
├── systems/PsynergySystem.ts (depends on types, Result)
└── systems/ItemSystem.ts (depends on types, Result)

LAYER 4 (Layers 1-3):
├── systems/ElementSystem.ts (depends on all systems)
├── systems/DjinnSystem.ts (depends on PsynergySystem)
└── data/battleData.ts (depends on types)

LAYER 5 (Layers 1-4):
├── hooks/useManualBattle.ts (depends on all systems)
└── systems/BattleTriggerSystem.ts (depends on dialogueSystem)

LAYER 6 (Layers 1-5):
├── components/battle/* (depend on hooks, systems)
└── screens/BattleScreen.tsx (depends on everything)

LAYER 7 (Integration):
└── GoldenSunApp.tsx (orchestrates all)
```

**Purpose:** This tells Coder AI what order to migrate files in.

---

### TASK 7: Identify Risk Areas (30 minutes)

**Create:** `RISK_ASSESSMENT.md`

**High Risk Files:**
1. **BattleScreen.tsx (1,828 LOC)** - Massive file, complex state
   - Mitigation: Break into smaller hooks first
   - Test incrementally
   
2. **Type System Integration** - Potential conflicts
   - Mitigation: Separate `types/battle.ts` file
   - Use adapters

3. **Test Suite Migration (500+ tests)** - Time consuming
   - Mitigation: Semi-automated conversion
   - Batch testing

4. **Visual Timing (Animations)** - Hard to get right
   - Mitigation: Copy exact timing values from NextEraGame
   - Don't modify what works

**Medium Risk Files:**
- GoldenSunApp.tsx integration
- State management changes
- Dialogue system modifications

**Low Risk Files:**
- Utility files (rng, id)
- Pure systems (BuffSystem, ItemSystem)
- Data files

---

### TASK 8: Review Completed Work (Ongoing)

**Your role as work completes:**

1. **After each Coder task:**
   - Review code quality
   - Verify tests pass
   - Check TypeScript errors
   - Ensure no regressions

2. **After each Graphics task:**
   - Verify visual quality (9/10+ GS aesthetic)
   - Test animations (smooth, no jank)
   - Check accessibility

3. **Quality Gates:**
   ```bash
   # Run these checks after each task:
   npm run type-check  # 0 errors
   npm run test        # All tests pass
   npm run build       # Succeeds
   npm run dev         # Game launches
   ```

4. **Create feedback:**
   - If task incomplete: Provide specific feedback
   - If task complete: Approve and move to next
   - If issues found: Request fixes with clear guidance

---

### TASK 9: Make Architectural Decisions (Ongoing)

**Decisions You'll Need to Make:**

1. **Element System:** 4 or 6 elements?
2. **State Management:** GoldenSunApp or GameController?
3. **Naming:** "Ability" or "Psynergy"? "Gem" or "Djinn"?
4. **Battle Triggers:** Dialogue-based only or add random encounters?
5. **Leveling System:** Implement now or later?
6. **Equipment System:** Migrate now or skip?
7. **Roster Management:** Port from NextEraGame or simplified?

**Document each decision in:** `ARCHITECTURAL_DECISIONS.md`

**Format:**
```markdown
## Decision: Element System (4 vs 6 elements)

**Date:** 2025-11-01
**Status:** Decided
**Decision:** Use 4 canonical elements (Venus/Mars/Jupiter/Mercury)

**Context:**
- NextEraGame uses 6 elements (adds Moon/Sun)
- Golden Sun canon has 4 elements
- Current GS project is lore-focused

**Options Considered:**
1. Use 4 elements (authentic to GS)
2. Use 6 elements (keeps NextEraGame content)
3. Hybrid (4 main + 2 special)

**Decision:** Option 1 - Use 4 elements

**Rationale:**
- More authentic to Golden Sun lore
- Simpler for initial migration
- Can add Moon/Sun later as special elements
- Less data to adapt (fewer spells, gems)

**Impact:**
- Must adapt ElementSystem.ts to remove Moon/Sun
- Must update all spell data to use 4 elements
- Must update gem data (6 gems → 4 djinn sets)
- Estimated 2-3 hours of adaptation work

**Assigned To:** Coder AI (CODER-06)
```

---

### TASK 10: Create Final Integration Plan (1 hour)

**After all tasks complete, create:** `INTEGRATION_COMPLETE_CHECKLIST.md`

**Verification Steps:**

```markdown
## Pre-Integration Tests
- [ ] All utilities migrated and tested (CODER-01)
- [ ] All types defined (CODER-02)
- [ ] All systems migrated and tested (CODER-03 through CODER-07)
- [ ] All data created (CODER-08)
- [ ] All hooks migrated (CODER-09)
- [ ] All components migrated (GRAPHICS-01 through GRAPHICS-08)

## Integration Tests
- [ ] GoldenSunApp can start battle from dialogue
- [ ] Battle plays out to completion
- [ ] Victory returns to overworld
- [ ] Defeat handled properly
- [ ] Rewards applied correctly
- [ ] Story flags updated after battle
- [ ] Save/load preserves battle state

## Full Game Flow Test
1. Start new game
2. Walk to NPC trainer
3. Trigger dialogue
4. Start battle
5. Use Attack action
6. Use Psynergy action
7. Use Item action
8. Defend action
9. Win battle
10. Receive rewards
11. Continue dialogue
12. Save game
13. Load game
14. Verify state preserved

## Performance Tests
- [ ] Battle loads in < 2 seconds
- [ ] Battle runs at 60 FPS
- [ ] No memory leaks (test 10+ battles)
- [ ] Animations smooth
- [ ] No console errors

## Accessibility Tests
- [ ] Keyboard navigation works (full battle with only keyboard)
- [ ] Screen reader announces turns
- [ ] WCAG 2.1 AA maintained
- [ ] Color contrast sufficient

## Quality Metrics
- [ ] TypeScript: 0 errors
- [ ] Tests: 500+ passing (99%+ pass rate)
- [ ] Build: Succeeds
- [ ] Bundle size: < 500KB increase
- [ ] Visual quality: 9/10+ (GS aesthetic)
```

---

## 📦 DELIVERABLES CHECKLIST

By the end of your work, you should have created:

- [ ] **CODEBASE_ANALYSIS.md** - Dependency graph and integration points
- [ ] **TYPE_INTEGRATION_STRATEGY.md** - How types will merge
- [ ] **BATTLE_INTEGRATION_ARCHITECTURE.md** - How systems connect
- [ ] **CODER_TASKS.md** - 15 tasks for Coder AI
- [ ] **GRAPHICS_TASKS.md** - 10 tasks for Graphics AI
- [ ] **DEPENDENCY_GRAPH.md** - Migration order
- [ ] **RISK_ASSESSMENT.md** - High/medium/low risk areas
- [ ] **ARCHITECTURAL_DECISIONS.md** - All decisions documented
- [ ] **INTEGRATION_COMPLETE_CHECKLIST.md** - Final verification

**Total:** 9 documents + ongoing reviews

---

## 🎯 SUCCESS METRICS

**Your work is complete when:**

1. ✅ All 9 documents created and comprehensive
2. ✅ All architectural decisions made and documented
3. ✅ All 25 tasks (15 Coder + 10 Graphics) created with clear acceptance criteria
4. ✅ Dependency graph shows clear migration order
5. ✅ Risk areas identified with mitigation strategies
6. ✅ Integration architecture designed and documented
7. ✅ Type system strategy prevents conflicts
8. ✅ Coder AI can execute all tasks without asking clarifying questions
9. ✅ Graphics AI can execute all tasks without asking clarifying questions
10. ✅ Final checklist comprehensive enough to verify production readiness

---

## 🚀 HOW TO START

**Immediate first steps:**

1. Read `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md` completely
2. Clone or cd to `/workspace/nexteragame/` and read core files:
   - `src/hooks/useManualBattle.ts`
   - `src/screens/BattleScreen.tsx`
   - `src/types/game.ts`
3. Study `/workspace/golden-sun/src/GoldenSunApp.tsx` (current state)
4. Begin TASK 1: Create `CODEBASE_ANALYSIS.md`

**Work methodically through Tasks 1-10 in order.**

---

## 📚 REFERENCE FILES

**Main Migration Plan:**
- `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md` (1,246 lines - your bible)

**NextEraGame Source:**
- `/workspace/nexteragame/` (complete source code)

**Golden Sun Current:**
- `/workspace/golden-sun/` (target for integration)

**Git Repos:**
- NextEraGame: `https://github.com/badnewsgoonies-dot/NextEraGame.git`
- Golden Sun: Current workspace

---

## ⚠️ CRITICAL REMINDERS

1. **Don't write code yourself** - You create task prompts for Coder/Graphics
2. **Be specific** - Every task needs exact file paths and acceptance criteria
3. **Think dependencies** - Tasks must be in correct order
4. **Consider risk** - Identify potential issues before they happen
5. **Document decisions** - Every architectural choice needs rationale
6. **Quality gates** - Each task needs verification criteria
7. **Stay strategic** - Your job is planning, not execution

---

**Ready to begin! Start with TASK 1: Study the Codebase.**

Good luck, Architect! 🏛️
