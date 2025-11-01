# 🎮 Harvest Moon: Friends of Mineral Town - AI Development Onboarding

**Project Goal:** Recreate a faithful-but-focused 2D farming-life simulation inspired by Harvest Moon: Friends of Mineral Town for Game Boy Advance, optimized for fast iteration by AI collaborators.

**Development Philosophy:** Prioritize a tight daily farming loop with approachable systems over exhaustive feature parity. Build core mechanics first, then layer life-sim depth once farming, time, and economy feel responsive.

---

## 🚀 Quick Reference

**Estimated Timeline:** 9 prompts total
- Architect Planning: 3 prompts
- Coder Implementation: 5 prompts
- Graphics Polish: 1 prompt

**Target Completion:** 14-18 hours total
**Complexity:** HIGH (8 core systems + integrations)

---

## 📋 Three-AI Workflow

### Architect AI (Strategic)
**Role:** Map systems, interfaces, and iteration order for the farming-life loop.
**DO:**
- Lock the game loop around days, stamina, weather, and economy before side content.
- Specify crop/livestock data tables with growth days, yields, prices, and seasonal limits.
- Define NPC schedule abstractions and narrative beats without overspecifying dialogue.
- Plan extensible save structure covering player, farm tiles, animals, town state.
- Outline performance constraints (60 FPS, <20 ms frame updates).
**DON'T:**
- Introduce full 3D rendering or physics (stick to tile-based 2D canvas/WebGL).
- Overcommit to complete console parity (focus on iconic systems that enable playability).
- Design monolithic God objects; keep data modular (tiles, entities, time, calendar).
- Mandate premature optimization (profiling-driven only after baseline works).

### Coder AI (Tactical)
**Role:** Implement the planned systems with readable TypeScript/JavaScript targeting web canvas.
**DO:**
- Use ECS-lite or modular managers (TimeManager, FarmGrid, AnimalManager) with clear contracts.
- Implement deterministic updates tied to fixed timestep (e.g., 60 updates/sec) decoupled from rendering.
- Build reusable UI widgets (dialogue windows, menus, HUD panels) with data-driven layouts.
- Provide debug toggles (show tile bounds, skip day, infinite stamina) for rapid tuning.
- Persist data via JSON serialization/localStorage with version key.
**DON'T:**
- Hard-code feature flags or constants inline; centralize in config modules.
- Block the main thread with heavy file IO or pathfinding; precompute asynchronously when needed.
- Mix rendering and logic in same modules; maintain separation for testability.
- Ignore keyboard/gamepad remapping (provide control mapping config upfront).

### Graphics AI (Visual)
**Role:** Deliver cohesive pixel-art spritesheets, UI skins, and environmental tiles that match GBA palette.
**DO:**
- Produce 16×16 tile sheets for terrain, crops, interiors; 32×48 character sprites with 4-direction frames.
- Maintain 32-color palettes with warm farm tones and readable contrast.
- Provide weather overlays (rain, snow) and lighting gradients for day phases.
- Export UI atlas (menus, buttons, icons) matching diegetic farm journal aesthetic.
- Supply layered PSD/ASE source for future recolors.
**DON'T:**
- Mix resolutions (avoid inconsistent pixel densities or smoothing filters).
- Deliver assets without transparency margins; keep consistent anchor points.
- Depend on advanced shaders; stick to sprite batching compatible with Canvas/WebGL.
- Neglect accessibility (ensure readable fonts, colorblind-friendly crop stages).

---

## 🎯 Core Harvest Moon Systems

### System 1: Time & Calendar Framework
**Purpose:** Drive real-time tick progression, day phases, weather, and seasonal calendar that orchestrate the farm loop.

**Measurable Success:**
- [ ] In-game clock advances in accelerated minutes, rolling over days, seasons, and years deterministically.
- [ ] Weather generator produces daily forecasts influencing lighting and crop hydration.
- [ ] Sleep/save transitions advance to next day, refreshing stamina and applying overnight crop growth.

**Complexity:** MEDIUM-HIGH (1.5-2 hours)
**Files:** ~3 files (TimeManager.ts, WeatherSystem.ts, CalendarConfig.ts)

**Core Implementation:**
```typescript
// Fixed timestep update ~60 ticks/sec, 1 tick = 10 in-game minutes
const TICKS_PER_DAY = 144; // 24 hours * 6 ticks per hour
const SEASON_LENGTH = 30; // days

export interface DayState {
  day: number;
  season: "spring" | "summer" | "autumn" | "winter";
  year: number;
  weather: WeatherType;
}

export class TimeManager {
  private tick = 0;
  private listeners: Array<(time: number) => void> = [];
  public currentDay: DayState = this.generateDay(1, "spring", 1);

  update(deltaTicks: number) {
    for (let i = 0; i < deltaTicks; i++) {
      this.tick = (this.tick + 1) % TICKS_PER_DAY;
      this.listeners.forEach((fn) => fn(this.tick));
      if (this.tick === 0) {
        this.advanceDay();
      }
    }
  }

  onTick(callback: (time: number) => void) {
    this.listeners.push(callback);
  }

  private advanceDay() {
    const nextDay = this.currentDay.day + 1;
    if (nextDay > SEASON_LENGTH) {
      const nextSeason = nextSeasonMap[this.currentDay.season];
      const seasonReset = nextSeason === "spring";
      this.currentDay = this.generateDay(
        seasonReset ? 1 : 1,
        nextSeason,
        seasonReset ? this.currentDay.year + 1 : this.currentDay.year
      );
    } else {
      this.currentDay = this.generateDay(
        nextDay,
        this.currentDay.season,
        this.currentDay.year
      );
    }
  }

  private generateDay(day: number, season: DayState["season"], year: number): DayState {
    const weather = rollWeather(season);
    return { day, season, year, weather };
  }
}
```
**Why This Approach:** Fixed ticks allow deterministic crop and NPC schedules, while a centralized TimeManager lets other systems subscribe without duplicating state.

### System 2: Player Controls & Interaction Layer
**Purpose:** Enable responsive movement, tool usage, and context-sensitive interactions across farm and town maps.

**Measurable Success:**
- [ ] Player avatar moves on a tile grid with sub-tile smoothing, respecting collision layers.
- [ ] Tool usage (hoe, watering can, sickle) triggers correct animations and manipulates targeted tiles.
- [ ] Context actions (talk, pick up, open door) show prompts and fire interaction handlers within 100 ms of button press.

**Complexity:** HIGH (2-2.5 hours)
**Files:** ~4 files (PlayerController.ts, InputMapper.ts, InteractionSystem.ts, ToolDefinitions.ts)

**Core Implementation:**
```typescript
const TOOL_ACTIONS: Record<ToolType, ToolDefinition> = {
  hoe: {
    staminaCost: 2,
    range: { x: 0, y: 1 },
    onUse: (ctx) => ctx.farm.till(ctx.targetTile)
  },
  wateringCan: {
    staminaCost: 1,
    range: { x: 0, y: 1 },
    onUse: (ctx) => ctx.farm.water(ctx.targetTile)
  }
};

export class PlayerController {
  constructor(private state: PlayerState, private input: InputMapper) {}

  update(dt: number) {
    const dir = this.input.getMovementVector();
    this.state.position = applyMovement(this.state.position, dir, dt);
    if (this.input.justPressed("tool")) {
      this.useEquippedTool();
    }
    if (this.input.justPressed("interact")) {
      this.tryContextInteraction();
    }
  }

  private useEquippedTool() {
    const tool = TOOL_ACTIONS[this.state.equippedTool];
    if (!tool || this.state.stamina < tool.staminaCost) return;
    const target = computeFacingTile(this.state.position, this.state.facing);
    tool.onUse({ farm: FarmGrid.instance, targetTile: target });
    this.state.stamina -= tool.staminaCost;
    AnimationSystem.playToolSwing(this.state.equippedTool);
  }
}
```
**Why This Approach:** Modular tool definitions keep interaction extensible while maintaining deterministic stamina usage and animation triggers.

### System 3: Farm Terrain & Tile State
**Purpose:** Manage the 2D tilemap representing soil, obstacles, buildings, and crop plots with seasonal visuals.

**Measurable Success:**
- [ ] Tile states persist (tilled, watered, planted, debris) across day transitions and reloads.
- [ ] Terrain rendering swaps tileset palettes based on season and weather overlays.
- [ ] Building entrances and interactions (barn door, shipping bin) link to interior scenes.

**Complexity:** MEDIUM-HIGH (1.5 hours)
**Files:** ~3 files (FarmGrid.ts, TileRenderer.ts, TileData.json)

**Core Implementation:**
```typescript
interface FarmTile {
  type: "soil" | "grass" | "rock" | "log" | "building";
  cropId?: string;
  wateredUntil?: number; // tick index
  tilled: boolean;
}

export class FarmGrid {
  static instance: FarmGrid;
  private tiles: FarmTile[][];

  constructor(layout: FarmTile[][]) {
    this.tiles = layout;
    FarmGrid.instance = this;
  }

  getTile(pos: GridPos) {
    return this.tiles[pos.y]?.[pos.x];
  }

  till(pos: GridPos) {
    const tile = this.getTile(pos);
    if (tile?.type === "soil" && !tile.tilled) {
      tile.tilled = true;
      EventBus.emit("tile:tilled", pos);
    }
  }

  water(pos: GridPos) {
    const tile = this.getTile(pos);
    if (tile?.tilled) {
      tile.wateredUntil = TimeManager.instance.currentTick + WATER_DURATION;
      EventBus.emit("tile:watered", pos);
    }
  }
}
```
**Why This Approach:** Tile state stored in simple structs enables fast serialization and deterministic updates for crops and tools.

### System 4: Crop Growth & Economy
**Purpose:** Simulate planting, growth stages, harvesting, and market pricing for seasonal crops.

**Measurable Success:**
- [ ] Crop definitions include seed cost, growth days per stage, regrowth behavior, and sale price.
- [ ] Overnight growth checks advance stages when watered and within season.
- [ ] Harvesting updates inventory, increments shipping totals, and triggers profit calculations.

**Complexity:** HIGH (2 hours)
**Files:** ~4 files (CropDatabase.ts, CropGrowthSystem.ts, ShippingBin.ts, EconomyBalance.json)

**Core Implementation:**
```typescript
interface CropDefinition {
  id: string;
  season: DayState["season"][];
  stageDurations: number[]; // days per stage
  regrowAfterHarvest: boolean;
  sellPrice: number;
}

export class CropGrowthSystem {
  constructor(private time: TimeManager, private farm: FarmGrid) {
    this.time.onTick((tick) => {
      if (tick === 0) this.advanceGrowth();
    });
  }

  private advanceGrowth() {
    this.farm.forEachTile((tile, pos) => {
      if (!tile.cropId) return;
      const crop = CropDatabase.get(tile.cropId);
      if (!crop.season.includes(this.time.currentDay.season)) {
        tile.cropId = undefined;
        tile.tilled = false;
        return;
      }
      if (!tile.wateredUntil || tile.wateredUntil < this.time.currentTick) return;
      const state = CropStateStore.get(pos);
      state.daysInStage++;
      if (state.daysInStage >= crop.stageDurations[state.stageIndex]) {
        state.stageIndex = Math.min(state.stageIndex + 1, crop.stageDurations.length - 1);
        state.daysInStage = 0;
        EventBus.emit("crop:stage", { pos, stage: state.stageIndex });
      }
    });
  }
}
```
**Why This Approach:** Daily batch updates keep performance predictable while aligning with Harvest Moon’s overnight growth cadence.

### System 5: Stamina, Health & Tool Upgrades
**Purpose:** Model player stamina drain, recovery sources, fatigue penalties, and tool progression.

**Measurable Success:**
- [ ] Stamina decreases based on tool staminaCost and time spent awake; hitting zero triggers exhaustion animation.
- [ ] Recovery items (food, baths) restore stamina and clear fatigue flags.
- [ ] Upgraded tools modify staminaCost, range, and charge mechanics with unlock requirements.

**Complexity:** MEDIUM (1-1.5 hours)
**Files:** ~3 files (StaminaSystem.ts, ItemDatabase.ts, UpgradeManager.ts)

**Core Implementation:**
```typescript
export class StaminaSystem {
  constructor(private player: PlayerState, private time: TimeManager) {
    this.time.onTick((tick) => {
      if (tick % 12 === 0) this.applyAwakeDrain();
    });
  }

  spend(cost: number) {
    this.player.stamina = Math.max(0, this.player.stamina - cost);
    if (this.player.stamina === 0) {
      this.player.fatigue = true;
      EventBus.emit("player:exhausted");
    }
  }

  recover(amount: number) {
    this.player.stamina = Math.min(this.player.maxStamina, this.player.stamina + amount);
    if (this.player.stamina > 0) this.player.fatigue = false;
  }

  private applyAwakeDrain() {
    if (this.player.isSleeping) return;
    this.spend(0.5);
  }
}
```
**Why This Approach:** Centralizing stamina logic prevents scattered cost handling and aligns tool use with fatigue events.

### System 6: Animal Husbandry & Barn Management
**Purpose:** Manage livestock states (cows, chickens), affection, produce schedules, and barn environment.

**Measurable Success:**
- [ ] Animals have affection, hunger, cleanliness stats updated daily.
- [ ] Feeding and brushing increase affection; neglect reduces produce quality.
- [ ] Produce collection generates inventory items with quality tiers based on affection.

**Complexity:** HIGH (2 hours)
**Files:** ~4 files (AnimalManager.ts, BarnScene.ts, ProduceSystem.ts, AnimalData.json)

**Core Implementation:**
```typescript
interface AnimalState {
  id: string;
  type: "cow" | "chicken" | "sheep";
  affection: number; // 0-10 hearts
  hunger: number; // 0-100
  cleanliness: number; // 0-100
  lastProduceDay: number;
}

export class AnimalManager {
  constructor(private time: TimeManager) {
    this.time.onTick((tick) => {
      if (tick === 0) this.processDaily();
    });
  }

  feed(animal: AnimalState, feedValue: number) {
    animal.hunger = Math.min(100, animal.hunger + feedValue);
  }

  processDaily() {
    animals.forEach((animal) => {
      animal.hunger = Math.max(0, animal.hunger - 20);
      animal.cleanliness = Math.max(0, animal.cleanliness - 10);
      if (animal.hunger > 50 && animal.cleanliness > 30) {
        if (this.time.currentDay.day - animal.lastProduceDay >= produceInterval(animal.type)) {
          spawnProduce(animal);
          animal.lastProduceDay = this.time.currentDay.day;
        }
      }
    });
  }
}
```
**Why This Approach:** Daily processing mirrors the GBA loop while keeping affection/hunger simple enough for fast iteration.

### System 7: NPC Schedules & Relationship Tracking
**Purpose:** Simulate townsfolk routines, dialogue, gifting, and heart events that impact narrative progression.

**Measurable Success:**
- [ ] NPCs follow schedule tables keyed by season/day/weather/time slot with path nodes.
- [ ] Dialogue variations surface based on affection thresholds and festival flags.
- [ ] Gifting increments relationship meters with diminishing returns per day.

**Complexity:** HIGH (2 hours)
**Files:** ~4 files (NPCScheduleSystem.ts, DialogueManager.ts, RelationshipState.ts, NPCData.json)

**Core Implementation:**
```typescript
interface ScheduleEntry {
  startTick: number;
  endTick: number;
  location: string;
  weather?: WeatherType;
  condition?: (state: GameState) => boolean;
}

export class NPCScheduleSystem {
  constructor(private time: TimeManager) {}

  getNpcLocation(npcId: string) {
    const schedule = SCHEDULES[npcId];
    const tick = this.time.currentTick;
    return schedule.find((entry) =>
      tick >= entry.startTick &&
      tick < entry.endTick &&
      (!entry.weather || entry.weather === this.time.currentDay.weather) &&
      (!entry.condition || entry.condition(GameState.instance))
    )?.location;
  }
}
```
**Why This Approach:** Data-driven schedules keep logic declarative, enabling easy iteration on daily routines and festival overrides.

### System 8: UI, Menus & Save System
**Purpose:** Provide HUD (clock, stamina, gold), menus (inventory, relationships), and reliable save/load persistence.

**Measurable Success:**
- [ ] HUD updates within 1 frame when stamina/gold/time changes; alerts trigger when stamina low or weather changes.
- [ ] Menus pause core simulation, support navigation via keyboard/controller, and display contextual info (crop stages, animal stats).
- [ ] Save/Load serializes player, farm, animals, relationships, and calendar state with schema versioning.

**Complexity:** HIGH (2 hours)
**Files:** ~5 files (HUDRenderer.ts, MenuSystem.ts, SaveManager.ts, SchemaVersion.ts, UIStyles.json)

**Core Implementation:**
```typescript
export class SaveManager {
  static SAVE_KEY = "hm_fmt_save_v1";

  static save(state: GameState) {
    const snapshot = serializeState(state);
    snapshot.schemaVersion = 1;
    localStorage.setItem(this.SAVE_KEY, JSON.stringify(snapshot));
  }

  static load(): GameState | null {
    const raw = localStorage.getItem(this.SAVE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (parsed.schemaVersion !== 1) {
      return migrateSave(parsed);
    }
    return deserializeState(parsed);
  }
}
```
**Why This Approach:** Explicit schema versioning prevents breaking old saves when systems evolve.

---

## 📝 Task Prompt Template
```
System [#]: [System Name]
Goal: [One-sentence purpose reminder]
Key Files: [List or create files]
Deliverables:
1. [Specific feature]
2. [Specific feature]
3. [Tests/Debug commands]
Constraints:
- Maintain 60 FPS (requestAnimationFrame + fixed logic updates).
- Follow existing interfaces from [dependency].
- Update docs/config where needed.
```

---

## 🎮 Harvest Moon Implementation Guidance

### Time-Driven Game Loop Pattern
Use a fixed-step logic loop decoupled from rendering for deterministic schedules.
```typescript
const LOGIC_HZ = 60;
let accumulator = 0;

function gameLoop(timestamp: number) {
  accumulator += timestamp - lastTimestamp;
  while (accumulator >= 1000 / LOGIC_HZ) {
    timeManager.update(1);
    playerController.update(1 / LOGIC_HZ);
    npcSystem.update(1 / LOGIC_HZ);
    accumulator -= 1000 / LOGIC_HZ;
  }
  renderer.draw();
  lastTimestamp = timestamp;
  requestAnimationFrame(gameLoop);
}
```
**Why This Works:** Keeps crop growth, NPC schedules, and stamina ticks in sync regardless of rendering hiccups.

### Data-Driven Definition Tables
Centralize crop, animal, and NPC data in JSON for balance changes without code edits.
```json
{
  "turnip": {
    "season": ["spring"],
    "stageDurations": [1, 2, 2, 2],
    "regrowAfterHarvest": false,
    "sellPrice": 60,
    "seedCost": 120
  }
}
```
**Why This Works:** Designers can tweak economy numbers quickly; coder only parses/validates.

### Context Interaction Routing
```typescript
const INTERACTIONS = new Map<string, InteractionHandler>();
INTERACTIONS.set("shippingBin", (ctx) => ctx.economy.ship(ctx.player.inventory));
INTERACTIONS.set("barnDoor", (ctx) => SceneManager.load("barn"));

export function handleInteraction(targetId: string, ctx: InteractionContext) {
  const handler = INTERACTIONS.get(targetId);
  if (handler) handler(ctx);
  else UI.showMessage("Nothing to do here.");
}
```
**Why This Works:** Prevents giant switch statements and makes adding new interactables trivial.

### Menu Pause State Management
```typescript
export class GameStateMachine {
  private stack: GameStateId[] = ["explore"];

  push(state: GameStateId) {
    this.stack.push(state);
    if (state !== "explore") timeManager.pause();
  }

  pop() {
    this.stack.pop();
    if (this.stack[this.stack.length - 1] === "explore") {
      timeManager.resume();
    }
  }
}
```
**Why This Works:** Ensures menus pause simulation while gameplay resumes seamlessly when closed.

---

## 🔥 Anti-Patterns to AVOID

### ❌ Don't Use:
- **Real-time physics engines** - Adds unnecessary overhead; tile-based movement suffices.
- **Per-frame crop updates** - Wasteful; crops only need daily checks triggered at tick rollover.
- **Hard-coded dialogue in code** - Blocks localization and iteration; keep dialogues in data files.
- **Mixed state ownership** - Avoid storing tile data partly in renderer and partly in logic; single source of truth.
- **Blocking save writes** - Use async/localStorage; never stall the frame loop.

### ✅ Do Use:
- **Event bus for cross-system notifications** - Decouples systems like crops and HUD.
- **Data tables for economy/NPC** - Enables quick balancing without redeploying code.
- **Deterministic tick scheduling** - Keeps farming and social systems aligned.
- **Modular scenes** - Farm, town, interiors as separate scene configs for streaming.
- **Debug overlays** - Toggle tile IDs, path nodes, stamina drain visualization for tuning.

**Reason:** Maintaining a deterministic, data-driven architecture preserves Harvest Moon’s daily rhythm while keeping the codebase manageable for multiple AI contributors.

**Remember:** Focus on the daily farm loop first. Social and festival depth only shines when farming, stamina, and economy are rock solid.

---

## 📊 Success Metrics (Definition of Done)

### Minimal Viable Harvest Moon Clone:
- [ ] Player can move, till, plant, water, and harvest crops over multiple days.
- [ ] Time, weather, and stamina systems interact correctly with overnight growth.
- [ ] Basic animal care (feed, collect produce) works with affection feedback.
- [ ] NPCs follow daily paths and respond to interaction prompts.
- [ ] Saving and loading preserves farm, inventory, animals, and relationships.

### "It Works" Checklist:
- [ ] Stable 60 FPS across farm/town scenes with <50 ms input latency.
- [ ] No softlocks when stamina hits zero or when day transitions occur.
- [ ] Weather effects visually reflect forecasts and adjust crop hydration.
- [ ] Menu navigation works with keyboard/gamepad, pausing simulation reliably.
- [ ] Debug overlay toggles exist for time skip, infinite stamina, and tile IDs.

### "Ship It" Checklist:
- [ ] Festivals and heart events trigger on schedule with cutscenes.
- [ ] Audio mix balanced (BGM, SFX) with seasonal variations.
- [ ] Save slots (3+) with thumbnails and playtime tracking.
- [ ] Tutorials/journal entries guide new players through first season.
- [ ] QA pass ensures no console errors or asset loading issues across browsers.

---

## 🎯 Estimated Prompt Breakdown

1. Architect: Finalize system architecture & data schemas (1.5h)
2. Architect: Define crop/animal/NPC tables & tuning targets (1.5h)
3. Architect: UX flow for menus, HUD, and save pipeline (1h)
4. Coder: Implement TimeManager + FarmGrid foundation (2h)
5. Coder: Player controls, tools, and stamina integration (2.5h)
6. Coder: Crop growth, shipping bin, and economy calculations (2h)
7. Coder: Animal manager + barn scene interactions (2h)
8. Coder: NPC schedules, dialogue, and gifting (2.5h)
9. Graphics: Deliver base tileset, character sprites, UI atlas (1.5h)

---

## 🚨 Common Pitfalls

### Pitfall 1: Over-scoping Festivals Early
**Problem:** Implementing full festival minigames before core loop leads to blocked progress.
**Solution:** Stub festival days as cutscenes until farming/animals solid, then expand.

### Pitfall 2: Unbounded Tile Iteration
**Problem:** Iterating entire farm grid every frame for effects causes frame drops.
**Solution:** Schedule tile checks on daily tick or when events occur; use dirty flag arrays.

### Pitfall 3: NPC Pathfinding Drift
**Problem:** Floating point drift desyncs NPC positions from tiles.
**Solution:** Snap NPC positions to tile centers at schedule transitions; use integer grid coordinates.

---

## 📚 Reference Resources
- Official Harvest Moon FOMT mechanics summaries (crop growth charts, affection guides).
- GBA palette references for accurate color reproduction.
- Prior Harvest Moon fan projects (open-source) for data inspiration.
- Input accessibility guidelines for controller remapping.

---

## 🎓 Learning Goals
- Practice architecting a multi-system life-sim with deterministic time loops.
- Learn to balance stamina/economy tuning using data tables.
- Apply data-driven NPC scheduling with conditional dialogue.
- Implement robust save systems with schema migrations.

---

## 🚀 V2 Features (Next Steps)
- Marriage system with rival events and home upgrades.
- Expanded mining/foraging maps with procedural ore placement.
- Cooking system with recipe discovery and stamina buffs.
- Advanced tool charging minigames and power berry collectibles.
- Local co-op farmhand mode with split-screen UI adjustments.

---

## ✨ Final Reminder
The daily rhythm is the heart of Harvest Moon. Nail the time, stamina, and crop economy first, and every additional system will slot cleanly into place. Keep systems data-driven, deterministic, and debuggable so AI collaborators can build rich seasonal content with tiny prompts.
