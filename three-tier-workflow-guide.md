# Three-Tier AI Workflow Guide (+ Optional Story Director)

## Purpose

This document teaches the **SUPER-ENTERPRISE** approach: using three to four specialized AIs in separate chats to build production-grade games.

**Core Three-Tier:** Architect, Coder, Graphics (proven in NextEraGame: 24,500+ lines, 1029+ tests, 99.6% pass rate, 10/10 health score)

**Optional Fourth Role:** Story Director (narrative-first approach, front-loads world-building)

---

## Overview: The Workflow Approaches

### Three-Tier Approach (Core)

> **Architect AI plans → Coder AI executes → Graphics AI polishes**
>
> All three work in **separate chats** with clear role boundaries.

### Four-Role Approach (Narrative-First)

> **Story Director establishes world → Graphics creates mockup → Architect plans → Coder/Graphics execute**
>
> Front-loads narrative clarity before any code is written.

### Why This Works

**vs Traditional Single-AI Approach:**
- ❌ Single AI does strategy + implementation + polish → context overload, mixed concerns
- ✅ Three-Four AIs specialize → clearer focus, parallel work, better quality

**Benefits:**
- **Specialization** - Each AI focuses on their domain (story, strategy, logic, visuals)
- **Parallel work** - Coder and Graphics can work simultaneously
- **Quality control** - Architect reviews both streams
- **Narrative clarity** - Story Director front-loads world-building (optional)
- **Mockup-first workflow** - Graphics creates HTML/CSS mockups before code (four-role only)
- **Faster iteration** - No strategic debates during coding
- **Better outcomes** - Narrative coherence + strategic planning + reliable execution + professional aesthetics
- **30-40x faster** than solo development

---

## The Four Roles (Story Director Optional)

### 🎬 Story Director AI (Optional - Narrative-First Projects)

**Chat:** Separate chat #0 (Human + Story Director)

**When to Use:**
- Narrative-rich games (RPGs, tactical games with lore)
- You want world-building BEFORE mockups
- Clear faction/element systems
- Complex UI copy and terminology

**When to Skip:**
- Mechanics-focused games (pure action, puzzle)
- SIMPLE or MEDIUM builds
- Minimal narrative requirements

**Responsibilities:**
- Establish world, factions, tone, premise
- Define power systems (elements, statuses, resistances)
- Create naming lexicon (60+ names for units/items/abilities/locations)
- Write UI copy library (buttons, combat text, tooltips)
- Produce encounter palette (difficulty tiers with enemy mixes)
- Create mockup script for Graphics (HTML outline)
- Define accessibility notes (contrast, motion, language)

**Does NOT:**
- Write implementation code
- Create mockups (Graphics does this)
- Make architectural decisions (Architect does this)
- Touch the codebase

**Workflow:**
```
Human fills story-director-questionnaire.md
     ↓
Story Director produces:
  - Story Bible (1-2 pages)
  - Encounter Palette (JSON)
  - Mockup Script (HTML outline)
  - Namepack JSON (60+ names)
  - Accessibility Notes
     ↓
Human hands off to Graphics for mockup creation
     ↓
Graphics creates HTML/CSS mockup (no JS)
     ↓
Human hands off to Architect for planning
```

**Outputs:**
1. **Story Bible** - Premise, factions, power system, lexicon, UI copy
2. **Encounter Palette** - Difficulty tiers with enemy/element/status mixes
3. **Mockup Script** - HTML-ish outline for Graphics (sprites, regions, scales)
4. **Namepack JSON** - Structured names for all game entities
5. **Accessibility Notes** - Contrast hints, motion constraints, language guidance

**Quality Gates:**
- [ ] Story Bible fits on 1-2 pages yet covers world, factions, lexicon, statuses, rewards
- [ ] Encounter Palette defines at least 3 difficulty bands with concrete enemy mixes
- [ ] Mockup Script identifies every sprite region and UI text needed
- [ ] Namepack JSON has 60+ entries across categories
- [ ] Accessibility notes address contrast and motion

**Time Estimate:** 1-2 hours total
- Story Bible: 20-30 min
- Encounter Palette: 10-15 min
- Mockup Script: 10-15 min
- Namepack + Accessibility: 5-10 min

---

## The Three Core Roles

### 🏛️ Architect AI (Strategic)

**Chat:** Separate chat #1 (Human + Architect)

**Responsibilities:**
- Create session plans with measurable goals
- Make architectural decisions
- Create detailed task prompts for Coder and Graphics
- Review completion reports
- Enforce quality standards (100% tests, 0 TS errors)
- Decide when to ship

**Does NOT:**
- Write implementation code
- Touch the codebase (read-only OK)
- Make tactical coding decisions
- Create files or modify source

**Workflow:**
```
Human requests feature
     ↓
Architect creates session plan
     ↓
Architect creates task prompt for Coder
     ↓
Human copies task to Coder chat
     ↓
Coder reports completion
     ↓
Architect reviews & approves/rejects
```

---

### 🛠️ Coder AI (Tactical)

**Chat:** Separate chat #2 (Human + Coder)

**Responsibilities:**
- Execute tasks from Architect with precision
- Write clean, tested, type-safe code
- Follow architectural patterns strictly
- Run verification commands (test, type-check, circular deps)
- Provide thorough completion reports
- Ask clarifying questions if ambiguous

**Does NOT:**
- Make strategic decisions
- Choose features to build
- Decide when to ship
- Touch visual polish (Graphics AI does this)
- Deviate from task specifications

**Workflow:**
```
Receives task prompt from Human (copied from Architect)
     ↓
Execute task systematically
     ↓
Write code + tests
     ↓
Verify quality (tests, type-check, etc.)
     ↓
Create completion report
     ↓
Human copies report to Architect for review
```

---

### 🎨 Graphics AI (Visual)

**Chat:** Separate chat #3 (Human + Graphics)

**Responsibilities:**
- Execute visual tasks from Architect
- Integrate sprites and assets
- Create beautiful UI layouts and animations
- Manage sprite registry and assets
- Provide screenshots/videos as evidence
- Polish user experience

**Does NOT:**
- Change game logic (Coder AI does this)
- Make strategic decisions
- Touch src/systems/ (except sprite-related)
- Create duplicate sprite components
- Modify battle mechanics or calculations

**Workflow:**
```
Receives task prompt from Human (copied from Architect)
     ↓
Execute visual polish systematically
     ↓
Integrate sprites/UI/animations
     ↓
Verify quality (screenshots, manual testing)
     ↓
Create completion report with screenshots
     ↓
Human copies report to Architect for review
```

**Quality Gates (Graphics AI):**
```markdown
## Completion Evidence

### Screenshots
- Before: [screenshot URL/path]
- After: [screenshot URL/path]

### Manual Testing
- [ ] Tested on desktop (Chrome/Firefox)
- [ ] Tested on mobile (if applicable)
- [ ] All interactions work
- [ ] Animations smooth (30+ FPS)
- [ ] No console errors

### Technical Checks
- [ ] No 404s for assets
- [ ] Visual quality: 9/10+
- [ ] Matches target aesthetic
- [ ] WCAG 2.1 AA compliant (if applicable)
```

**Graphics Task Risk Levels:**

| Risk Level | Success Rate | Task Examples | Time Estimate |
|------------|--------------|---------------|---------------|
| LOW | 90% | Particle tuning, screen shake calibration | 15-30 min |
| MEDIUM | 70% | Animation timing, color palette swaps | 1-2 hours |
| HIGH | 60% | Sprite integration (100-500 sprites) | 2-4 hours |
| VERY HIGH | 30-40% | Sprite integration (1000+ sprites), custom shaders | 4-8 hours |

**Battle-Tested Numeric Values (from NextEraGame Production):**
- **Particles:** 8 (small hit) → 15 (medium explosion) → 20 (large explosion), 200 max total
- **Screen Shake:** 5px (light, 1-50 HP) → 10px (medium, 51-100 HP) → 20px (heavy, 100+ HP), **300ms fixed duration**
- **Animation Timing:** 50ms (psynergy delay) → 300ms (damage peak) → 2000ms (complete) → 2100ms (turn end)
- **Flash Effects:** 150ms duration, 30-50% opacity (not battle-tested, industry standard)
- **Contrast:** 4.5:1 minimum for text (WCAG 2.1 AA)

**Reference:** See [graphics-decisions-reference.md](graphics-decisions-reference.md) for complete details and rationales.

---

## Session Planning (Architect's Primary Tool)

### Why Session Planning Matters

**Without session plans:**
- ❌ Scope creep (features grow uncontrolled)
- ❌ Lost direction (forget what success looks like)
- ❌ Poor time estimates
- ❌ Hard to resume after breaks

**With session plans:**
- ✅ Clear scope boundaries
- ✅ Everyone knows success criteria
- ✅ Easy progress tracking
- ✅ Better time estimates
- ✅ Prevents over-engineering

### Session Plan Template

**Use this before EVERY development session:**

```markdown
# 🗓️ Session [Number/Date]: [Session Goal]

## 🎯 Session Objective
[One sentence: What we're accomplishing this session]

## 📊 Current State
- Test Count: [X tests passing]
- Coverage: [X%]
- Known Issues: [List any blockers]
- Last Completed: [Previous session's work]

## 🎯 Session Goals (Priority Order)
1. **[Goal 1]** - [Why this matters] - [Est: Xh]
2. **[Goal 2]** - [Why this matters] - [Est: Xh]
3. **[Goal 3]** - [Why this matters] - [Est: Xh]

## 📋 Implementation Tasks

### Task 1: [Title]
- **Owner:** Coder AI | Graphics AI
- **File(s):** [Path(s)]
- **Action:** [What to do]
- **Acceptance:** [How we know it's done]
- **Time:** [Estimate]

### Task 2: [Title]
- **Owner:** Coder AI | Graphics AI
- **File(s):** [Path(s)]
- **Action:** [What to do]
- **Acceptance:** [How we know it's done]
- **Time:** [Estimate]

[Repeat for all tasks]

## ✅ Session Success Criteria
- [ ] All session goals completed
- [ ] Tests passing (100% pass rate)
- [ ] TypeScript 0 errors
- [ ] No regressions introduced
- [ ] Code quality maintained

## 🚫 Out of Scope (Defer to Later)
- [Thing 1 we're NOT doing this session]
- [Thing 2 we're NOT doing this session]

## 📊 Expected End State
- Test Count: [X tests]
- New Features: [List]
- Files Modified: [Rough count]
- Ready for: [Next session's focus]
```

### Example Session Plan

```markdown
# 🗓️ Session 12: Critical Hit System

## 🎯 Session Objective
Add critical hit mechanic based on luck stat to increase combat variety.

## 📊 Current State
- Test Count: 1034 tests passing
- Coverage: 50%+
- Known Issues: None blocking
- Last Completed: Luck stat added to PlayerUnit (Session 11)

## 🎯 Session Goals (Priority Order)
1. **Create CriticalHitSystem** - Core mechanic for variable damage - [Est: 1h]
2. **Integrate with BattleSystem** - Hook into damage calculation - [Est: 1h]
3. **Add comprehensive tests** - Cover all edge cases - [Est: 1h]

## 📋 Implementation Tasks

### Task 1: Create CriticalHitSystem (Coder AI)
- **File(s):** src/systems/CriticalHitSystem.ts
- **Action:** Pure function checkCriticalHit(attacker, rng) → Result<boolean>
- **Acceptance:** Returns true/false based on attacker.luck / 100
- **Time:** 30 min

### Task 2: Add CriticalHitSystem Tests (Coder AI)
- **File(s):** tests/systems/CriticalHitSystem.test.ts
- **Action:** 10+ tests covering boundaries, determinism, errors
- **Acceptance:** All tests passing, determinism verified
- **Time:** 30 min

### Task 3: Integrate with BattleSystem (Coder AI)
- **File(s):** src/systems/BattleSystem.ts
- **Action:** Call checkCriticalHit before damage calc, double damage on crit
- **Acceptance:** Critical hits work in battle
- **Time:** 1h

### Task 4: Add Crit Visual Effects (Graphics AI)
- **File(s):** src/components/battle/DamageNumber.tsx
- **Action:** Add "CRITICAL!" text and red flash on crit
- **Acceptance:** Visible crit indicator in battle
- **Time:** 30 min

## ✅ Session Success Criteria
- [ ] CriticalHitSystem created with Result types
- [ ] 10+ new tests for crits (all passing)
- [ ] Battle system uses crits correctly
- [ ] Visual crit indicator implemented
- [ ] All existing tests still pass
- [ ] TypeScript 0 errors

## 🚫 Out of Scope (Defer to Later)
- Crit stat modifiers from equipment (Session 14)
- Special crit abilities or skills (Future)
- Crit damage multiplier customization (Future)

## 📊 Expected End State
- Test Count: ~1044 tests (10 new)
- New Features: Critical hits functional + visual
- Files Modified: ~6 files
- Ready for: Equipment stat bonuses (Session 13)
```

---

## Task Templates (7 Types)

### Task Template Selection

**Ask yourself:**
```
What am I building?
├─ NEW CHAT continuing prior work? → Template 4 (Fresh Session)
├─ Single utility function? → Template 1 (Simple Utility)
├─ Adding/modifying a type? → Template 2 (Type Change)
├─ Creating a new system? → Template 3 (System Creation)
├─ Fixing a bug? → Template 5 (Bug Fix)
├─ Refactoring existing code? → Template 6 (Refactoring)
├─ Integrating multiple systems? → Template 7 (Integration)
└─ Complex/Unclear? → Use Architect AI to define scope first
```

### Template 1: Simple Utility Function

**Time:** 5-10 minutes
**For:** Single, isolated utility function
**Complexity:** LOW

```markdown
# Task: Add [FunctionName] Utility Function

## 📋 Context
- **Project:** [Your game name]
- **Pattern:** Pure functions, deterministic RNG (if applicable)
- **Owner:** Coder AI

## 🎯 Objective
[One sentence: What this function does and why it's needed]

## 📦 Requirements

### 1. Create Source File
- **File:** src/utils/[filename].ts (NEW file)
- **Function Signature:**
  ```typescript
  export function [functionName]<T>(
    [param1]: [Type1],
    [param2]: [Type2]
  ): [ReturnType]
  ```
- **Implementation:**
  - [Specific requirement 1]
  - [Specific requirement 2]
  - Return [specific value] for [edge case]

### 2. Pattern Requirements
- ✅ Pure function (no mutations, no side effects)
- ✅ Type-safe (proper TypeScript types)
- ✅ Deterministic (if uses RNG, use seeded RNG)
- ✅ Handle edge cases (empty inputs, null, undefined)

### 3. Create Tests
- **File:** tests/utils/[filename].test.ts (NEW file)
- **Required Tests:**
  - Test 1: [Happy path case]
  - Test 2: [Edge case 1]
  - Test 3: [Edge case 2]

## ✅ Acceptance Criteria
- [ ] TypeScript compiles with 0 errors
- [ ] 3+ tests created and passing
- [ ] Function is pure (no mutations)
- [ ] Edge cases handled correctly
- [ ] ALL existing tests still pass

## ⏱️ Time Estimate
5-10 minutes
```

### Template 2: Type Addition/Modification

**Time:** 10-20 minutes
**For:** Adding field(s) to existing type/interface
**Complexity:** MEDIUM
**Risk:** HIGH (breaking change - expect collateral damage)

```markdown
# Task: Add [FieldName] to [TypeName]

## 📋 Context
- **Project:** [Your game name]
- **Type File:** src/types/game.ts
- **Owner:** Coder AI
- **IMPORTANT:** This is a breaking change - expect collateral fixes needed

## 🎯 Objective
[One sentence: What field you're adding and why]

## 📦 Requirements

### 1. Update Type Definition
- **File:** src/types/game.ts
- **Location:** [Interface] interface (around line [X])
- **Change:** Add `[fieldName]: [type]` field

```typescript
export interface [TypeName] {
  // Existing fields...

  // New field:
  [fieldName]: [type]; // [Brief description]
}
```

### 2. Update Data Files
- **Primary File:** [path to main data file]
- **Action:** Add `[fieldName]: [defaultValue]` to ALL [N] instances
- **Keep:** All existing properties unchanged

### 3. Self-Recovery Expectations
**CRITICAL:** This type change WILL break test fixtures and mock data.

**Expected AI Behavior:**
1. Detect TypeScript compilation errors in test files
2. Search codebase for all [TypeName] instantiations
3. Fix ALL affected files autonomously
4. Report comprehensively what was fixed

**DO NOT be surprised if:**
- 10-20 test files need updates
- Mock data objects need new field
- Test fixtures require modifications

**This is NORMAL and EXPECTED. Let AI handle it.**

### 4. Create Integration Tests
- **File:** tests/integration/[fieldName].test.ts (NEW file)
- **Required Tests:**
  - Test 1: Verify [TypeName] type has [fieldName] field
  - Test 2: Verify all [N] data instances have [fieldName] = [value]
  - Test 3: Verify TypeScript compilation with new field

## ✅ Acceptance Criteria
- [ ] TypeScript compiles with 0 errors (full project)
- [ ] [TypeName] interface has [fieldName] field
- [ ] ALL [N] data instances updated
- [ ] 3+ integration tests pass
- [ ] ALL existing tests still pass
- [ ] Test fixtures updated (if needed)
- [ ] Mock data updated (if needed)

## 📊 Self-Recovery Report
**After completion, AI should report:**
- Files modified (expect more than specified)
- Test fixtures fixed (list them)
- Mock data updated (list them)
- Any other collateral fixes

## ⏱️ Time Estimate
10-20 minutes (includes collateral fixes)
```

### Template 3: System Creation

**Time:** 20-30 minutes
**For:** New game system (battle, rewards, equipment, etc.)
**Complexity:** HIGH

```markdown
# Task: Create [SystemName] System

## 📋 Context
- **Project:** [Your game name]
- **Pattern:** Pure functions, Result types, deterministic RNG
- **Owner:** Coder AI

## 🎯 Objective
[One sentence: What this system does and why it's needed]

## 📦 Requirements

### 1. Create System File
- **File:** src/systems/[SystemName].ts (NEW file)
- **Exports:**
  ```typescript
  // Main function
  export function [mainFunction](
    [param1]: [Type1],
    [param2]: [Type2],
    rng: IRng
  ): Result<[ReturnType], string>

  // Helper functions
  export function [helper1](...): [ReturnType]
  export function [helper2](...): [ReturnType]
  ```

### 2. System Behavior
- **Input:** [Describe inputs]
- **Processing:** [Describe algorithm/logic]
- **Output:** [Describe return value]
- **Edge Cases:** [List edge cases to handle]
- **Error Cases:** [List error conditions]

### 3. Pattern Requirements
- ✅ All functions are pure (no mutations)
- ✅ Uses Result<T, E> for error handling
- ✅ Uses deterministic RNG (if random)
- ✅ Type-safe with strict TypeScript
- ✅ Handles all edge cases gracefully

### 4. Create Comprehensive Tests
- **File:** tests/systems/[SystemName].test.ts (NEW file)
- **Required Tests:**
  - Test 1: [Happy path]
  - Test 2: [Edge case 1]
  - Test 3: [Edge case 2]
  - Test 4: [Error case 1]
  - Test 5: [Error case 2]
  - Test 6: [Determinism test] (if uses RNG)
  - Test 7+: [Additional coverage]

**Minimum:** 10+ tests

## ✅ Acceptance Criteria
- [ ] System file created with all exports
- [ ] All functions are pure
- [ ] Uses Result types for errors
- [ ] Deterministic (same inputs = same outputs)
- [ ] 10+ tests created and passing
- [ ] TypeScript compiles with 0 errors
- [ ] ALL existing tests still pass
- [ ] Edge cases and error cases covered

## ⏱️ Time Estimate
20-30 minutes
```

### Template 4: Fresh Session (Continuing Prior Work)

**For:** Starting a NEW CHAT that continues prior work
**CRITICAL:** Use this FIRST in any new session

```markdown
# Task: [Feature Name] (Fresh Session)

## 🔄 Fresh Session Context

**This is a NEW session continuing prior work.**

### Prior Work Completed:
- Session 1: [What was done]
- Session 2: [What was done]
- [List all relevant prior work]

### Expected Existing Files:
- `path/to/file1.ts` - [What it contains]
- `path/to/file2.ts` - [What it contains]
- [List all files that SHOULD exist]

### Branch Information:
- **Correct Branch:** `[exact-branch-name]`
- **DO NOT use:** main, master, or other branches
- **Switch BEFORE starting:** `git checkout [branch-name]`

---

## 🚀 Fresh Session Setup (DO THIS FIRST!)

### Step 1: Branch Setup
**CRITICAL: Run these commands BEFORE any code work:**

```bash
# 1. Check current branch
git branch --show-current

# 2. If not on correct branch, switch to it
git checkout [exact-branch-name-from-task]

# 3. Verify branch state
git status

# 4. Pull latest changes (if applicable)
git pull origin [branch-name]
```

### Step 2: Context Validation
**Verify these dependencies exist:**

```bash
# List expected files
ls -la [path/to/expected/file1.ts]
ls -la [path/to/expected/file2.ts]

# Check for expected code patterns
grep "[expected-pattern]" [file-path]

# Read key files to confirm changes
cat [key-file-path]
```

**Checklist:**
- [ ] All expected files exist
- [ ] Key patterns/code present
- [ ] No missing dependencies

### Step 3: Start Implementation
**ONLY NOW can you begin coding!**

---

## 🎯 Your Task
[Normal task description continues here...]

---

## ⚠️ CRITICAL INSTRUCTIONS

### BEFORE Writing Any Code:
1. ✅ Switch to correct branch
2. ✅ Verify expected files exist
3. ✅ Read key files for context
4. ✅ Confirm dependencies present

### If Files Missing:
- STOP and report: "Expected file X not found"
- DON'T recreate work from prior sessions
- ASK for clarification on branch/state

## ⏱️ Time Estimate
[Your estimate]
```

### Templates 5-7: Bug Fix, Refactoring, Integration

**Template 5: Bug Fix** - Fix broken behavior
**Template 6: Refactoring** - Improve code without changing behavior
**Template 7: Integration** - Connect multiple systems

*(See NextEraGame docs/ai/COMPREHENSIVE_TEMPLATE_SYSTEM.md for full templates)*

---

## Quality Gates (Mandatory)

### For Coder AI - Every Task Completion

**Run these commands BEFORE reporting completion:**

```bash
# 1. TypeScript compilation
npm run type-check
# MUST: 0 errors

# 2. All tests
npm test
# MUST: 100% pass rate

# 3. Circular dependencies
npm run circular
# MUST: 0 circular dependencies

# 4. Build
npm run build
# MUST: No build errors
```

**If ANY fail:**
- Fix issues before reporting
- DO NOT report completion with failing gates
- Keep iterating until ALL pass

### For Graphics AI - Every Task Completion

**Provide these artifacts:**

```markdown
## Completion Evidence

### Screenshots
- Before: [screenshot of before state]
- After: [screenshot of after state]

### Manual Testing
- [ ] Tested on desktop
- [ ] Tested on mobile (if applicable)
- [ ] All interactions work
- [ ] Visual quality matches Golden Sun aesthetic

### Quality Checks
- [ ] No console errors
- [ ] Assets load correctly
- [ ] No 404s for sprites
- [ ] Animations smooth (30+ FPS)
```

---

## Handoff Protocol

### Architect → Coder Task Handoff

**Template:**

```markdown
## 🛠️ TASK FOR CODER AI

**Copy this to Coder chat:**

[Full task from Template 1-7]

---

**Instructions for Human:**
1. Copy everything above
2. Paste into Coder AI chat
3. Let Coder execute
4. Copy completion report back to Architect
```

### Architect → Graphics Task Handoff

**Template:**

```markdown
## 🎨 TASK FOR GRAPHICS AI

**Copy this to Graphics chat:**

[Full visual task]

---

**Instructions for Human:**
1. Copy everything above
2. Paste into Graphics AI chat
3. Let Graphics execute
4. Copy completion report + screenshots back to Architect
```

### Completion Report (Coder → Architect)

**Template:**

```markdown
## ✅ COMPLETION REPORT: [Task Name]

### Summary
[2-3 sentence summary of what was done]

### Files Created
- `path/to/file1.ts` - [Purpose]
- `path/to/file2.test.ts` - [Purpose]

### Files Modified
- `path/to/existing.ts` - [What changed]

### Quality Gates
- ✅ TypeScript: 0 errors
- ✅ Tests: [N]/[N] passing (100%)
- ✅ Circular Deps: 0
- ✅ Build: Success

### Test Coverage
- New tests: [N] tests
- Total tests: [N] tests
- All passing: ✅

### Changes Summary
[Bullet list of key changes]

### Edge Cases Handled
- [Edge case 1]
- [Edge case 2]

### Next Steps (Recommended)
[Optional suggestions for Architect]

---

**Ready for Architect review.**
```

### Completion Report (Graphics → Architect)

**Template:**

```markdown
## ✅ COMPLETION REPORT: [Task Name]

### Summary
[2-3 sentence summary of what was done]

### Visual Changes
**Before:**
[Screenshot before]

**After:**
[Screenshot after]

### Files Modified
- `path/to/component.tsx` - [What changed]
- `path/to/sprite-registry.ts` - [What added]

### Assets Added
- [Asset 1] - [Purpose]
- [Asset 2] - [Purpose]

### Manual Testing
- ✅ Desktop: Works perfectly
- ✅ Mobile: Responsive and functional
- ✅ Animations: Smooth 30+ FPS
- ✅ No console errors

### Quality Checks
- ✅ No 404s for sprites
- ✅ Visual quality: [9/10, 10/10, etc.]
- ✅ Matches Golden Sun aesthetic
- ✅ Accessibility: WCAG compliant

### Next Steps (Recommended)
[Optional suggestions for Architect]

---

**Ready for Architect review.**
```

---

## Numbers & Expectations

### Expected Scope (from NextEraGame)

**SUPER-ENTERPRISE Build:**
- **Prompts:** 40-60 total (across 3 AIs)
  - Architect: 10-15 prompts (planning)
  - Coder: 25-40 prompts (implementation)
  - Graphics: 5-10 prompts (polish)
- **Time:** 30-40 hours AI collaboration
- **Output:** 20,000-50,000 lines
- **Tests:** 500-1000+ tests
- **Pass Rate:** 99%+ (aim for 100%)
- **Files:** 50-100+ source files
- **Systems:** 10-15 game systems
- **Visual Quality:** AAA retro (9-10/10)

**vs Other Rigor Levels:**
- SIMPLE: 1 AI, 1 prompt, 20-30 min, 400-1200 LOC
- MEDIUM: 1 AI, 2-3 prompts, 8-12 hours, 1200-2500 LOC
- ENTERPRISE: 1 AI, 4-8 prompts, 15-30 hours, 2000-5000 LOC
- **SUPER-ENTERPRISE**: 3 AIs, 40-60 prompts, 30-40 hours, 20,000-50,000 LOC

---

## Tips for Success

### For Humans (Coordinating 3 AIs)

1. **Keep sessions organized:**
   - Use session plans religiously
   - Track which AI is working on what
   - Don't mix strategic/tactical conversations

2. **Copy task prompts exactly:**
   - Copy full task from Architect
   - Paste to appropriate AI (Coder or Graphics)
   - Don't paraphrase or summarize

3. **Copy completion reports back:**
   - Get full report from Coder/Graphics
   - Paste back to Architect for review
   - Let Architect decide next steps

4. **Separate concerns:**
   - Coder never touches visuals
   - Graphics never touches game logic
   - Architect never writes code

5. **Trust the process:**
   - It feels slower at first (3 chats)
   - Becomes MUCH faster with practice
   - Quality is dramatically higher

### For Architect AI

1. **Session plans are mandatory:**
   - Create BEFORE every feature
   - Include clear success criteria
   - List out-of-scope items

2. **Task prompts must be complete:**
   - No ambiguity
   - Specific file paths
   - Exact acceptance criteria
   - Time estimates

3. **Review thoroughly:**
   - Check completion reports
   - Verify quality gates passed
   - Approve or request changes

4. **Prevent scope creep:**
   - Defer non-essential features
   - Stay focused on session goals
   - Say "out of scope" liberally

### For Coder AI

1. **Follow patterns strictly:**
   - Result types for errors
   - Pure functions always
   - Deterministic RNG
   - No mutations

2. **Quality gates are mandatory:**
   - ALL must pass before reporting
   - Fix issues, don't skip
   - 100% test pass rate required

3. **Autonomous recovery:**
   - Type changes break fixtures? Fix them
   - Tests fail? Debug and fix
   - Don't ask permission, just fix

4. **Completion reports must be thorough:**
   - List ALL files changed
   - Show test counts
   - Explain what was done

### For Graphics AI

**Full Reference:** See [graphics-decisions-reference.md](graphics-decisions-reference.md) for complete numeric values and decision rationales.

1. **Visual quality matters:**
   - Match the aesthetic (Golden Sun, neon, etc.)
   - Smooth animations (30+ FPS)
   - No 404s for assets
   - Visual score 9-10/10

2. **Screenshots are required:**
   - Before/after comparisons
   - Show all major changes
   - Prove it works
   - Document visual evidence

3. **Don't touch game logic:**
   - Only visual files (src/components/, src/ui/)
   - Only sprite registry
   - Don't modify systems/ or game logic
   - Leave calculations to Coder AI

4. **Accessibility counts:**
   - WCAG 2.1 AA compliance (4.5:1 contrast minimum)
   - Keyboard navigation
   - Screen reader support
   - Mobile responsive

5. **Use battle-tested numeric values (from NextEraGame):**
   - Particles: 8-20 per effect (see reference doc)
   - Screen shake: 5px/10px/20px intensity, **300ms fixed duration** (tested in production)
   - Animation timing: 50ms delay → 300ms impact → 2000ms complete (combat sequence)
   - Flash duration: 150ms suggested (not battle-tested)
   - Entity caps: 200 particles max (SIMPLE), 1500 with pooling (ENTERPRISE)

6. **Risk assessment before starting:**
   - LOW risk (90% success): Particle tuning, screen shake
   - MEDIUM risk (70% success): Animation timing, color palettes
   - HIGH risk (60% success): Sprite integration 100-500 sprites
   - VERY HIGH risk (30-40% success): 1000+ sprites, custom shaders
   - Start with LOW risk tasks, build confidence

7. **Session structure (recommended 50-75 min):**
   - Phase 1: Context (5-10 min) - Screenshots, check console errors
   - Phase 2: Priority (5 min) - Pick 2-3 tasks
   - Phase 3: Implementation (30-45 min) - Execute + test visually
   - Phase 4: Manual Testing (5-10 min) - Play game, verify smooth
   - Phase 5: Documentation (5 min) - Screenshot, report values

8. **Anti-patterns to avoid (Real Failures from NextEraGame):**
   - ❌ **Wrong branch:** Always run `git branch --show-current` FIRST
   - ❌ **Missing context:** Read existing code before adding (check for duplicates)
   - ❌ **Path case sensitivity:** Lowercase folders, PascalCase filenames (Linux != Windows)
   - ❌ **CSS overwriting:** Read file before editing, use targeted edits
   - ❌ **Registry duplication:** Grep for existing exports before adding
   - ❌ **Particle counts >25:** Diminishing returns, causes lag
   - ❌ **Screen shake >20px or >300ms:** Motion sickness risk
   - ❌ **Low contrast text:** Fails WCAG 2.1 AA (4.5:1 minimum)
   - ❌ **Missing screenshots:** Completion reports must have visual evidence
   - ❌ **Modifying game logic:** Graphics AI touches ONLY visual files

---

## Common Pitfalls

### Pitfall 1: Mixing Roles

**Wrong:**
```
Architect: "Add luck stat to PlayerUnit"
[Architect writes the code themselves]
```

**Right:**
```
Architect: Creates task prompt for Coder
Human: Copies task to Coder chat
Coder: Executes task
Human: Copies report to Architect
Architect: Reviews and approves
```

### Pitfall 2: Skipping Session Plans

**Wrong:**
```
Architect: "Build critical hit system"
[No plan, scope creeps, takes 3x longer]
```

**Right:**
```
Architect: Creates session plan
- Goal: Critical hits
- 4 tasks broken down
- 3 hours estimated
- Out of scope listed
[Executes systematically, finishes on time]
```

### Pitfall 3: Incomplete Task Prompts

**Wrong:**
```
Architect: "Add luck stat"
[Coder confused: where? what type? what value?]
```

**Right:**
```
Architect: Uses Template 2
- Exact file: src/types/game.ts
- Exact field: luck: number
- Exact values: 10-30 range
- Exact tests: 3 integration tests
[Coder executes perfectly first time]
```

### Pitfall 4: Forgetting Fresh Session Protocol

**Wrong:**
```
[New chat session]
Coder: Starts coding immediately
[Overwrites prior work, creates conflicts]
```

**Right:**
```
[New chat session]
Task: Uses Template 4 (Fresh Session)
Coder: Checks branch, verifies files, THEN codes
[Clean continuation, no conflicts]
```

### Pitfall 5: Skipping Quality Gates

**Wrong:**
```
Coder: "Done! Here's the code."
[Didn't run tests, 15 tests failing]
```

**Right:**
```
Coder: Implements feature
Coder: Runs type-check (0 errors)
Coder: Runs tests (100% pass)
Coder: Runs circular (0 deps)
Coder: Runs build (success)
Coder: "Done! All quality gates pass."
```

---

## Summary

**Three-Tier Workflow = SUPER-ENTERPRISE builds**

**Key Success Factors:**
1. Use session plans religiously
2. Keep roles separate (3 chats)
3. Use task templates for everything
4. Enforce quality gates strictly
5. Copy prompts/reports exactly
6. Trust the process

**Results:**
- 30-40x faster than solo
- 99%+ test pass rate
- 10/10 health scores
- Production-ready quality
- 20,000-50,000+ LOC games

**Ready to build?**
→ See [three-tier-questionnaire.md](three-tier-questionnaire.md) for SUPER-ENTERPRISE questionnaire
