# SUPER-ENTERPRISE Game Generator Questionnaire

## Purpose

This questionnaire generates onboarding documents for **three-tier AI workflows** (Architect + Coder + Graphics). Use this for production-grade games with 20,000-50,000+ lines, 500-1000+ tests, and AAA quality.

**Expected:** 30-40 hours, 40-60 prompts across 3 specialized AIs.

---

## Prerequisites

Before filling this out, understand:

- You'll coordinate **3 separate AI chats** (Architect, Coder, Graphics)
- Architect AI creates session plans and task prompts
- Coder AI implements game logic + tests
- Graphics AI polishes visuals + UI
- You copy prompts/reports between chats
- Process is slower at first, but quality is 30-40x better

**If you're building a narrative-rich game** (RPG, tactical, lore-heavy), complete [story-director-questionnaire.md](story-director-questionnaire.md) FIRST (Part 0) before this questionnaire. Story Director front-loads world-building, which eliminates rework and provides Graphics with a complete mockup script.

---

## PART 1: GAME CONCEPT (Same as Standard Questionnaire)

### Q1: What is your game concept in one sentence?
**Your answer:**
```
[e.g., "A side-scrolling helicopter shooter defending against waves of enemies"]
```

### Q2: What is the core gameplay loop?
**Your answer:**
```
[e.g., "Move around → Shoot enemies → Avoid damage → Survive waves → Get upgrades"]
```

### Q3: What is the player's primary action?

Choose ONE or describe:

- [ ] **Shooting** (aim and fire projectiles)
- [ ] **Movement** (navigate terrain/maze)
- [ ] **Survival** (dodge, collect, outlast)
- [ ] **Building** (construct, place, defend)
- [ ] **Strategy** (plan, command, manage)
- [ ] **Turn-based combat** (tactical decisions, speed-based turns)
- [ ] **Other:** _____________

### Q4: What is the main challenge/opponent?

Choose ONE or describe:

- [ ] **Waves of enemies** (increasing difficulty)
- [ ] **Another player** (PvP, competitive)
- [ ] **Environment** (obstacles, hazards)
- [ ] **Time pressure** (countdown, racing)
- [ ] **Resource management** (economy, survival)
- [ ] **Other:** _____________

### Q5: What visual style appeals to you?

Choose ONE or describe:

- [ ] **Neon/Cyberpunk** (high contrast, glowing trails, dark backgrounds)
- [ ] **Pixelated/Retro** (8-bit, chunky sprites, simple colors)
- [ ] **Golden Sun/JRPG** (retro pixel art, character sprites, battle backgrounds)
- [ ] **Military/Realistic** (grays, browns, smoke effects)
- [ ] **Colorful/Cartoony** (bright, high saturation, playful)
- [ ] **Minimalist** (geometric shapes, limited palette)
- [ ] **Other:** _____________

### Q6: What are the win/loss conditions?

**Win condition:**
```
[e.g., "Survive 10 waves" OR "Reach score 1000" OR "Outlast opponent"]
```

**Loss condition:**
```
[e.g., "Player health reaches 0" OR "Time runs out" OR "Crash into wall"]
```

### Q7: What systems does your game need?

Check ALL that apply:

- [ ] Player movement
- [ ] Shooting/weapons
- [ ] Enemy spawning
- [ ] Collision detection
- [ ] Health/damage system
- [ ] Waves/progression
- [ ] Upgrades/powerups
- [ ] Score/stats tracking
- [ ] Turn-based battle
- [ ] Equipment system
- [ ] Inventory management
- [ ] Recruitment system
- [ ] Reward system
- [ ] Save/load functionality
- [ ] Game state machine
- [ ] Audio (optional)
- [ ] Other: _____________

---

## PART 2: THREE-TIER WORKFLOW SPECIFICS

### Q8: Production Requirements

**Check ALL that apply:**

**Code Quality:**
- [ ] Must have 100% test pass rate
- [ ] Need 500+ comprehensive tests
- [ ] TypeScript strict mode required
- [ ] Need deterministic gameplay (same seed = same outcome)
- [ ] Need replay system
- [ ] Zero circular dependencies enforced

**Architectural Patterns:**
- [ ] Pure functions (no mutations)
- [ ] Result type error handling (type-safe errors)
- [ ] Deterministic RNG (seeded randomness)
- [ ] Object pooling (1000+ entities)
- [ ] Fixed-timestep game loop
- [ ] State machine for game flow

**Polish Requirements:**
- [ ] WCAG 2.1 AA accessibility
- [ ] Keyboard navigation on all screens
- [ ] Mobile responsive
- [ ] Sprite integration (2000+ sprites)
- [ ] Smooth animations (30+ FPS)
- [ ] Multiple save slots

**Scope:**
- [ ] Production deployment required
- [ ] Multi-session development (40-60 prompts)
- [ ] Need comprehensive documentation
- [ ] Portfolio quality piece

### Q9: Sprite/Asset Availability

**Do you have sprites/assets?**

- [ ] **Yes - I have a sprite library** (e.g., Golden Sun, custom assets)
  - **Location:** _____________
  - **Count:** _____________ sprites
  - **Format:** GIF / PNG / Other: _____________

- [ ] **No - Use simple colored shapes** (circles, squares, etc.)
  - **Style:** Neon / Minimalist / Other: _____________

- [ ] **Hybrid - Mix sprites for characters, shapes for effects**

### Q10: Time Budget

**How much time can you dedicate?**

Choose ONE:

- [ ] **30-40 hours** (Full SUPER-ENTERPRISE, 40-60 prompts)
- [ ] **20-30 hours** (Abbreviated, focus on core systems)
- [ ] **40+ hours** (Extended polish, advanced features)

**Sessions per week:**
- [ ] 1-2 sessions/week (slow, steady progress)
- [ ] 3-5 sessions/week (moderate pace)
- [ ] 5-7 sessions/week (rapid development)

### Q11: Three-Tier AI Comfort Level

**Rate your comfort with coordinating 3 AI chats:**

- [ ] **Beginner** (First time, need detailed handoff instructions)
- [ ] **Intermediate** (Done this 1-2 times, comfortable with basics)
- [ ] **Advanced** (Done this 3+ times, very comfortable)

**This determines how detailed the handoff protocols will be in your onboarding doc.**

---

## PART 3: PRIORITIZATION

### Q12: What matters MOST to you?

Rank 1-5 (1 = highest priority, leave blank if not important):

- [ ] **Code quality** (tests, determinism, architecture)
- [ ] **Visual polish** (sprites, animations, effects)
- [ ] **Speed of development** (get it done fast)
- [ ] **Feature completeness** (all systems implemented)
- [ ] **Production readiness** (deployable, documented)

### Q13: Visual effects priority

Rank 1-5 (1 = most important):

- [ ] **Sprite integration** (character sprites, enemy sprites)
- [ ] **Animations** (attack, hit, death animations)
- [ ] **Particle effects** (explosions, impacts, trails)
- [ ] **Screen effects** (shake, flash, transitions)
- [ ] **UI polish** (menus, HUD, notifications)

---

## PART 4: SESSION STRUCTURE

### Q14: How do you want sessions organized?

Choose ONE:

- [ ] **System-by-system** (Complete System 1, then System 2, etc.)
  - **Pro:** Clear progress, easy to track
  - **Con:** Graphics comes late

- [ ] **Vertical slices** (Core loop first, then add features)
  - **Pro:** Playable early, iterative
  - **Con:** Requires more planning

- [ ] **Parallel tracks** (Coder builds logic, Graphics polishes simultaneously)
  - **Pro:** Fastest overall
  - **Con:** Requires coordination

**Selected:** _____________

### Q15: Testing Strategy

Choose ONE:

- [ ] **Test-driven** (Write tests first, then implementation)
  - **Pro:** Forces clarity, better coverage
  - **Con:** Slower initially

- [ ] **Test-after** (Implement first, tests immediately after)
  - **Pro:** Faster feeling, flexible
  - **Con:** May skip edge cases

- [ ] **Test-concurrent** (Tests and implementation together)
  - **Pro:** Balanced approach
  - **Con:** Requires discipline

**Selected:** _____________

---

## EXAMPLE: NextEraGame (Reference)

**For comparison, here's how NextEraGame filled this out:**

- Q1: Turn-based tactical roguelike with equipment progression
- Q2: Battle → Rewards → Equipment → Gems → Recruit → Repeat
- Q3: Turn-based combat
- Q4: Waves of enemies
- Q5: Golden Sun/JRPG
- Q6: Win = Survive 30 min, Lose = HP reaches 0
- Q7: 12 systems (battle, rewards, equipment, gems, recruitment, etc.)
- Q8: ALL production requirements checked
- Q9: Yes - 2,500+ Golden Sun sprites
- Q10: 30-40 hours, 3-5 sessions/week
- Q11: Advanced (iterated hundreds of times)
- Q12: Code quality (1), Production readiness (2), Visual polish (3)
- Q13: Sprite integration (1), Animations (2), UI polish (3)
- Q14: Vertical slices
- Q15: Test-concurrent

**Results:**
- 24,500+ lines
- 1029+ tests (99.6% pass rate)
- 10/10 health score
- Production deployed
- 30+ hours AI collaboration

---

## NEXT STEP

Once you've filled this out, copy the entire questionnaire (with your answers) and paste it into an AI assistant with:

**"Generate my SUPER-ENTERPRISE game onboarding document based on this three-tier questionnaire"**

The AI will produce a comprehensive onboarding document with:
- Three-tier role definitions (Architect, Coder, Graphics)
- Session plan template
- 10-15 system breakdowns
- Task templates for each system
- Handoff protocols
- Quality gates
- Time estimates (40-60 prompts)
- Expected output (20,000-50,000 LOC)

Then coordinate three separate AI chats:

**Chat 1: Architect AI**
- Give: [three-tier-workflow-guide.md](three-tier-workflow-guide.md)
- Role: Strategic planning, session plans, task creation

**Chat 2: Coder AI**
- Give: Generated onboarding doc
- Role: Execute tasks, write code, create tests

**Chat 3: Graphics AI**
- Give: Generated onboarding doc
- Role: Integrate sprites, polish UI, create animations

**And watch your production-grade game come to life!**
