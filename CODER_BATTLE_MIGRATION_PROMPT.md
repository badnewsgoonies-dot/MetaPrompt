# 🛠️ CODER AI: Battle System Migration Implementation

**ROLE:** Implementation Coder  
**PROJECT:** NextEraGame → Golden Sun Battle System Migration  
**PHASE:** System Migration and Logic Implementation  
**TIME ESTIMATE:** 25-35 hours  
**CONTEXT:** Full migration plan at `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md`

---

## 🎯 YOUR MISSION

You are the **Coder AI** responsible for:
1. **System Migration** - Port battle systems from NextEraGame to Golden Sun
2. **Logic Implementation** - Implement battle triggers, transitions, rewards
3. **Testing** - Write comprehensive tests (500+ tests)
4. **Integration** - Connect battle system to existing Golden Sun code
5. **Type Safety** - Maintain TypeScript strict mode (0 errors)

---

## 📊 PROJECT CONTEXT

### What You're Building

**Migrating FROM:** NextEraGame battle system
- Core systems: 8 files (3,439 LOC)
- Hooks: 5 files (~500 LOC)
- Data: 5 files (~800 LOC)
- Tests: 500+ tests (1,466 LOC)

**Migrating TO:** Golden Sun project
- Add battle system to existing overworld game
- Connect to dialogue system for trainer battles
- Maintain all existing functionality

### Your Workload

**15 Major Tasks:**
- Foundation: Utils, types (2-3 hours)
- Systems: Buff, Psynergy, Item, Element, Djinn (8-12 hours)
- Data: Units, enemies, spells (3-4 hours)
- Integration: Triggers, transitions, rewards (6-8 hours)
- Testing: Port all tests (6-10 hours)

**Total:** 25-35 hours

---

## 📋 YOUR TASKS (Execute in Order)

### ✅ CODER-01: Migrate Core Utilities (1-2 hours)

**Priority:** CRITICAL (Foundation for everything)

**Description:**  
Copy core utility functions from NextEraGame. These have no dependencies and are needed by all other systems.

**Files to Create:**
```bash
/workspace/golden-sun/src/utils/rng.ts      # Copy from nexteragame
/workspace/golden-sun/src/utils/id.ts       # Copy from nexteragame
/workspace/golden-sun/src/utils/rng.test.ts # Create tests
/workspace/golden-sun/src/utils/id.test.ts  # Create tests
```

**Files to Modify:**
```bash
/workspace/golden-sun/package.json  # Add pure-rand dependency
```

**Step-by-Step:**

1. **Install dependency:**
   ```bash
   cd /workspace/golden-sun
   npm install pure-rand@^6.1.0
   ```

2. **Copy `rng.ts`:**
   ```bash
   cp /workspace/nexteragame/src/utils/rng.ts /workspace/golden-sun/src/utils/rng.ts
   ```
   - No modifications needed (self-contained)
   - Uses `pure-rand` for deterministic RNG
   - Provides `makeRng(seed)` and `IRng` interface

3. **Copy `id.ts`:**
   ```bash
   cp /workspace/nexteragame/src/utils/id.ts /workspace/golden-sun/src/utils/id.ts
   ```
   - No modifications needed
   - Generates unique IDs for game entities

4. **Create tests:**
   - Port tests from `/workspace/nexteragame/tests/utils/`
   - Verify determinism (same seed = same output)
   - Test all RNG methods (int, float, bool, choose, shuffle)
   - Test ID uniqueness

5. **Verify:**
   ```bash
   npm run type-check  # Should pass
   npm run test        # Should pass
   npm run build       # Should succeed
   ```

**Acceptance Criteria:**
- [ ] `pure-rand@^6.1.0` in package.json
- [ ] `rng.ts` copied and imports work
- [ ] `id.ts` copied and imports work
- [ ] 50+ tests for `rng.ts` (all passing)
- [ ] 10+ tests for `id.ts` (all passing)
- [ ] TypeScript: 0 errors
- [ ] Existing Golden Sun game still works

**Dependencies:** None (start immediately)

---

### ✅ CODER-02: Create Battle Type Definitions (1-2 hours)

**Priority:** CRITICAL (Needed by all systems)

**Description:**  
Create comprehensive type system for battle. Keep separate from overworld types to avoid conflicts.

**Files to Create:**
```bash
/workspace/golden-sun/src/types/battle.ts
/workspace/golden-sun/src/types/psynergy.ts
/workspace/golden-sun/src/types/battleRewards.ts
```

**Source Reference:**
```bash
/workspace/nexteragame/src/types/game.ts (lines 1-400)
```

**Step-by-Step:**

1. **Create `types/battle.ts`:**
   ```typescript
   import type { Result } from '../utils/result.js';
   
   // Core battle unit type
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
     originalIndex: number; // For deterministic sorting
   }
   
   // Buff system
   export interface ActiveBuff {
     id: string;
     stat: 'attack' | 'defense' | 'speed';
     amount: number;
     duration: number; // Turns remaining
     source: string;
     sourceName: string;
   }
   
   export interface BuffState {
     readonly buffs: readonly ActiveBuff[];
   }
   
   // Battle result
   export type BattleWinner = 'player' | 'enemy' | 'draw';
   
   export interface BattleResult {
     winner: BattleWinner;
     actions: CombatAction[];
     unitsDefeated: string[];
     turnsTaken: number;
   }
   
   // Combat actions (for replay/logging)
   export type CombatAction = 
     | { type: 'attack'; actorId: string; targetId: string; damage: number; seq: number }
     | { type: 'defend'; actorId: string; seq: number }
     | { type: 'defeat'; actorId: string; targetId: string; seq: number }
     | { type: 'psynergy'; actorId: string; targetId: string; psynergyId: string; damage?: number; heal?: number; seq: number }
     | { type: 'item'; actorId: string; targetId: string; itemId: string; heal?: number; seq: number }
     | { type: 'flee'; actorId: string; seq: number };
   
   // Party member (permanent state)
   export interface PartyMember {
     id: string;
     name: string;
     hp: number;
     maxHp: number;
     mp: number;
     maxMp: number;
     atk: number;
     def: number;
     speed: number;
     level: number;
     exp: number;
     element: Element;
     portraitUrl: string;
     learnedPsynergy: string[]; // Psynergy IDs
   }
   
   // Enemy template (for spawning)
   export interface EnemyTemplate {
     id: string;
     name: string;
     baseStats: {
       hp: number;
       atk: number;
       def: number;
       speed: number;
     };
     spriteUrl: string;
     element: Element;
     tags: Tag[];
   }
   
   // Element system (4 canonical GS elements)
   export type Element = 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
   
   // Tags for type advantages
   export type Tag = 'Beast' | 'Undead' | 'Mech' | 'Holy' | 'Nature' | 'Arcane';
   
   // Role system
   export type Role = 'Tank' | 'DPS' | 'Support' | 'Specialist';
   ```

2. **Create `types/psynergy.ts`:**
   ```typescript
   import type { Element } from './battle.js';
   
   export type PsynergyTargetType = 
     | 'single_enemy'
     | 'all_enemies'
     | 'single_ally'
     | 'all_allies'
     | 'self';
   
   export type PsynergyEffectType = 
     | 'damage'
     | 'heal'
     | 'buff'
     | 'debuff';
   
   export interface PsynergyEffect {
     readonly type: PsynergyEffectType;
     readonly target: PsynergyTargetType;
     readonly power: number;
     readonly element?: Element;
     readonly buffStat?: 'attack' | 'defense' | 'speed';
     readonly buffAmount?: number;
     readonly buffDuration?: number; // In turns
   }
   
   export interface Psynergy {
     readonly id: string;
     readonly name: string;
     readonly description: string;
     readonly mpCost: number;
     readonly effect: PsynergyEffect;
     readonly animationId: string; // For visual effect
   }
   ```

3. **Create `types/battleRewards.ts`:**
   ```typescript
   import type { Item } from './items.js';
   
   export interface BattleRewards {
     exp: number;
     coins: number;
     items: Item[];
     storyFlags?: Record<string, any>;
   }
   ```

4. **Verify:**
   ```bash
   npm run type-check  # Should pass
   ```

**Acceptance Criteria:**
- [ ] All types defined in separate files
- [ ] No circular dependencies
- [ ] Types compatible with existing Golden Sun types
- [ ] TypeScript strict mode: 0 errors
- [ ] Documented with JSDoc comments

**Dependencies:** CODER-01 (needs Result type)

---

### ✅ CODER-03: Migrate BuffSystem (1-2 hours)

**Priority:** HIGH (Needed by battle logic)

**Description:**  
Copy BuffSystem for tracking buffs/debuffs on units during battle.

**Files to Create:**
```bash
/workspace/golden-sun/src/systems/BuffSystem.ts
/workspace/golden-sun/src/systems/BuffSystem.test.ts
```

**Source:**
```bash
/workspace/nexteragame/src/systems/BuffSystem.ts
/workspace/nexteragame/tests/systems/BuffSystem.test.ts
```

**Step-by-Step:**

1. **Copy `BuffSystem.ts`:**
   ```bash
   cp /workspace/nexteragame/src/systems/BuffSystem.ts /workspace/golden-sun/src/systems/BuffSystem.ts
   ```

2. **Update imports:**
   ```typescript
   // Change:
   import type { BattleUnit, ActiveBuff, Ability } from '../types/game.js';
   // To:
   import type { BattleUnit, ActiveBuff } from '../types/battle.js';
   import type { Psynergy } from '../types/psynergy.js';
   ```

3. **Update function signatures if needed:**
   ```typescript
   // Change "Ability" to "Psynergy" throughout
   export function applyBuff(
     unit: BattleUnit,
     psynergy: Psynergy, // was "ability"
     duration: number
   ): BattleUnit {
     // ... implementation unchanged
   }
   ```

4. **Port tests:**
   - Copy test file
   - Update imports
   - Run tests: `npm test BuffSystem`

5. **Verify:**
   ```bash
   npm run type-check
   npm test src/systems/BuffSystem.test.ts
   ```

**Acceptance Criteria:**
- [ ] BuffSystem.ts copied and adapted
- [ ] All imports point to Golden Sun types
- [ ] 50+ tests passing
- [ ] TypeScript: 0 errors
- [ ] All functions pure (no mutations)
- [ ] Function names match: applyBuff, decayBuffs, getBuffModifier, removeAllBuffs

**Dependencies:** CODER-02 (needs BattleUnit type)

---

### ✅ CODER-04: Migrate AbilitySystem → PsynergySystem (2-3 hours)

**Priority:** HIGH (Core combat mechanic)

**Description:**  
Port ability system and rename to "Psynergy" for Golden Sun authenticity.

**Files to Create:**
```bash
/workspace/golden-sun/src/systems/PsynergySystem.ts
/workspace/golden-sun/src/systems/PsynergySystem.test.ts
```

**Source:**
```bash
/workspace/nexteragame/src/systems/AbilitySystem.ts
/workspace/nexteragame/tests/systems/AbilitySystem.test.ts
```

**Step-by-Step:**

1. **Copy and rename:**
   ```bash
   cp /workspace/nexteragame/src/systems/AbilitySystem.ts /workspace/golden-sun/src/systems/PsynergySystem.ts
   ```

2. **Global find/replace:**
   - "Ability" → "Psynergy" (type name)
   - "ability" → "psynergy" (variable names)
   - "AbilitySystem" → "PsynergySystem" (file header)

3. **Update imports:**
   ```typescript
   import type { PartyMember, Psynergy } from '../types/battle.js';
   import { Ok, Err, type Result } from '../utils/result.js';
   ```

4. **Key functions to preserve:**
   ```typescript
   export function canUsePsynergy(unit: PartyMember, psynergy: Psynergy): boolean;
   export function usePsynergy(unit: PartyMember, psynergy: Psynergy): Result<PartyMember, string>;
   export function restoreMp(unit: PartyMember, maxMp?: number): PartyMember;
   export function restoreAllMp(team: readonly PartyMember[], maxMp?: number): readonly PartyMember[];
   export function calculatePsynergyDamage(psynergy: Psynergy, casterAttack: number, rng?: IRng): number;
   export function calculatePsynergyHealing(psynergy: Psynergy, rng?: IRng): number;
   ```

5. **Port and adapt tests:**
   - Rename all "ability" to "psynergy"
   - Verify damage formula: `floor(power + (attack * 0.5)) + variance(-2, 2)`
   - Test MP cost deduction
   - Test heal calculations

**Acceptance Criteria:**
- [ ] All "Ability" references renamed to "Psynergy"
- [ ] 80+ tests passing
- [ ] Damage formula verified (deterministic with RNG)
- [ ] MP system works correctly
- [ ] TypeScript: 0 errors
- [ ] Pure functions (no mutations)

**Dependencies:** CODER-02, CODER-03

---

### ✅ CODER-05: Migrate ItemSystem (2-3 hours)

**Priority:** MEDIUM (For battle items)

**Description:**  
Port item system and merge with existing Golden Sun item types.

**Files to Create:**
```bash
/workspace/golden-sun/src/systems/ItemSystem.ts
/workspace/golden-sun/src/systems/ItemSystem.test.ts
```

**Files to Modify:**
```bash
/workspace/golden-sun/src/types/items.ts  # Extend existing Item type
```

**Source:**
```bash
/workspace/nexteragame/src/systems/ItemSystem.ts
```

**Step-by-Step:**

1. **Extend Golden Sun Item type:**
   ```typescript
   // In types/items.ts
   export interface Item {
     id: string;
     name: string;
     description: string;
     type: 'consumable' | 'equipment' | 'key';
     price: number;
     sellPrice: number;
     
     // Battle item stats (NEW)
     stats?: {
       hpRestore?: number;  // Potion: 50, Elixir: 100
       mpRestore?: number;  // Nut: 30
       revive?: boolean;    // Phoenix Down: true
     };
   }
   ```

2. **Copy ItemSystem:**
   ```bash
   cp /workspace/nexteragame/src/systems/ItemSystem.ts /workspace/golden-sun/src/systems/ItemSystem.ts
   ```

3. **Adapt to Golden Sun inventory:**
   ```typescript
   // Merge with existing inventory system
   import type { InventoryData } from '../types/inventory.js';
   
   export function useConsumableItem(
     item: Item,
     target: PartyMember,
     inventory: InventoryData
   ): Result<{ unit: PartyMember; inventory: InventoryData }, string> {
     // ... existing logic
   }
   ```

4. **Port tests:**
   - Test potion usage (heals HP)
   - Test Phoenix Down (revives KO'd unit)
   - Test inventory deduction
   - Test validation (can't use potion at full HP)

**Acceptance Criteria:**
- [ ] ItemSystem integrated with existing inventory
- [ ] Consumable items work in battle
- [ ] Inventory updates after item use
- [ ] 40+ tests passing
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-02

---

### ✅ CODER-06: Migrate ElementSystem (2-3 hours)

**Priority:** MEDIUM (For elemental bonuses)

**Description:**  
Port element system and adapt from 6 elements to 4 canonical GS elements.

**Files to Create:**
```bash
/workspace/golden-sun/src/systems/ElementSystem.ts
/workspace/golden-sun/src/systems/ElementSystem.test.ts
```

**Source:**
```bash
/workspace/nexteragame/src/systems/ElementSystem.ts
```

**Step-by-Step:**

1. **Copy ElementSystem:**
   ```bash
   cp /workspace/nexteragame/src/systems/ElementSystem.ts /workspace/golden-sun/src/systems/ElementSystem.ts
   ```

2. **Remove Moon/Sun elements:**
   ```typescript
   // Change from:
   export type Element = 'Venus' | 'Mars' | 'Jupiter' | 'Mercury' | 'Moon' | 'Sun';
   
   // To (already done in CODER-02):
   export type Element = 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
   ```

3. **Update element relationships:**
   ```typescript
   // Element strengths/weaknesses (Golden Sun canon)
   const ELEMENT_COUNTERS: Record<Element, Element> = {
     Venus: 'Jupiter',   // Earth weak to Wind
     Mars: 'Mercury',    // Fire weak to Water
     Jupiter: 'Venus',   // Wind weak to Earth
     Mercury: 'Mars',    // Water weak to Fire
   };
   ```

4. **Adapt affinity calculations:**
   ```typescript
   export function getElementAffinity(
     unitElement: Element,
     djinnElement: Element
   ): 'strong' | 'neutral' | 'weak' {
     if (unitElement === djinnElement) return 'strong';
     if (ELEMENT_COUNTERS[unitElement] === djinnElement) return 'weak';
     return 'neutral';
   }
   ```

5. **Port tests:**
   - Test element counter relationships
   - Test affinity calculations
   - Remove tests for Moon/Sun

**Acceptance Criteria:**
- [ ] Only 4 elements (Venus/Mars/Jupiter/Mercury)
- [ ] Element counters match GS canon
- [ ] Affinity system works (strong/neutral/weak)
- [ ] 40+ tests passing
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-02

---

### ✅ CODER-07: Migrate GemSuperSystem → DjinnSystem (2-3 hours)

**Priority:** MEDIUM (For Djinn mechanics)

**Description:**  
Port gem system and rename to "Djinn" for GS lore. Keep super spell mechanic.

**Files to Create:**
```bash
/workspace/golden-sun/src/systems/DjinnSystem.ts
/workspace/golden-sun/src/systems/DjinnSystem.test.ts
```

**Source:**
```bash
/workspace/nexteragame/src/systems/GemSuperSystem.ts
```

**Step-by-Step:**

1. **Copy and rename:**
   ```bash
   cp /workspace/nexteragame/src/systems/GemSuperSystem.ts /workspace/golden-sun/src/systems/DjinnSystem.ts
   ```

2. **Rename throughout:**
   - "Gem" → "Djinn" (singular)
   - "Gems" → "Djinn" (already plural in GS!)
   - "GemSuper" → "DjinnSummon"
   - "gem" → "djinn" (variables)

3. **Update Djinn type:**
   ```typescript
   export interface Djinn {
     id: string;
     name: string;        // e.g., "Flint", "Forge", "Granite"
     element: Element;
     description: string;
     
     // Passive bonuses when equipped
     statBonus: {
       atk: number;
       def: number;
       hp: number;
       mp: number;
       spd: number;
     };
     
     // Summon effect (once per battle)
     summon: {
       name: string;      // e.g., "Venus"
       power: number;
       effect: 'aoe_damage' | 'party_heal' | 'party_buff';
       animationId: string;
     };
   }
   ```

4. **Key functions:**
   ```typescript
   export function executeDjinnSummon(
     djinn: Djinn,
     actor: BattleUnit,
     targets: BattleUnit[],
     rng: IRng
   ): BattleUnit[];
   
   export function canUseDjinnSummon(djinn: Djinn, isActivated: boolean): boolean;
   
   export function applyDjinnStatBonus(
     unit: PartyMember,
     djinn: Djinn,
     affinity: 'strong' | 'neutral' | 'weak'
   ): PartyMember;
   ```

5. **Port tests:**
   - Test summon damage calculations
   - Test stat bonuses
   - Test once-per-battle restriction

**Acceptance Criteria:**
- [ ] All "Gem" references renamed to "Djinn"
- [ ] Summon system works (AOE damage/heal/buff)
- [ ] Once-per-battle restriction enforced
- [ ] 30+ tests passing
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-02, CODER-06

---

### ✅ CODER-08: Create Golden Sun Battle Data (3-4 hours)

**Priority:** HIGH (Required for battles)

**Description:**  
Create GS-specific battle data: party members, enemies, psynergy spells.

**Files to Create:**
```bash
/workspace/golden-sun/src/data/partyMembers.ts
/workspace/golden-sun/src/data/battleEnemies.ts
/workspace/golden-sun/src/data/psynergyData.ts
/workspace/golden-sun/src/data/battleItems.ts
/workspace/golden-sun/src/data/djinnData.ts
```

**Reference:**
```bash
/workspace/nexteragame/src/data/starterUnits.ts
/workspace/nexteragame/src/data/opponents.ts
/workspace/nexteragame/src/data/elementalSpells.ts
```

**Step-by-Step:**

1. **Create `partyMembers.ts`:**
   ```typescript
   import type { PartyMember, Element } from '../types/battle.js';
   
   export const PARTY_MEMBERS: Record<string, PartyMember> = {
     isaac: {
       id: 'isaac',
       name: 'Isaac',
       hp: 100,
       maxHp: 100,
       mp: 50,
       maxMp: 50,
       atk: 22,
       def: 18,
       speed: 40,
       level: 1,
       exp: 0,
       element: 'Venus' as Element,
       portraitUrl: '/sprites/golden-sun/icons/characters/Isaac1.gif',
       learnedPsynergy: ['quake', 'spire', 'cure'],
     },
     garet: {
       id: 'garet',
       name: 'Garet',
       hp: 110,
       maxHp: 110,
       mp: 40,
       maxMp: 40,
       atk: 24,
       def: 20,
       speed: 35,
       level: 1,
       exp: 0,
       element: 'Mars' as Element,
       portraitUrl: '/sprites/golden-sun/icons/characters/Garet1.gif',
       learnedPsynergy: ['flare', 'volcano', 'fire_blast'],
     },
     ivan: {
       id: 'ivan',
       name: 'Ivan',
       hp: 85,
       maxHp: 85,
       mp: 70,
       maxMp: 70,
       atk: 18,
       def: 14,
       speed: 50,
       level: 1,
       exp: 0,
       element: 'Jupiter' as Element,
       portraitUrl: '/sprites/golden-sun/icons/characters/Ivan1.gif',
       learnedPsynergy: ['gust', 'ray', 'plasma'],
     },
     mia: {
       id: 'mia',
       name: 'Mia',
       hp: 90,
       maxHp: 90,
       mp: 65,
       maxMp: 65,
       atk: 16,
       def: 16,
       speed: 42,
       level: 1,
       exp: 0,
       element: 'Mercury' as Element,
       portraitUrl: '/sprites/golden-sun/icons/characters/Mia1.gif',
       learnedPsynergy: ['frost', 'tonic', 'ice_missile'],
     },
   };
   ```

2. **Create `battleEnemies.ts`:**
   ```typescript
   import type { EnemyTemplate, Element } from '../types/battle.js';
   
   export const BATTLE_ENEMIES: Record<string, EnemyTemplate> = {
     slime: {
       id: 'slime',
       name: 'Slime',
       baseStats: { hp: 50, atk: 12, def: 8, speed: 25 },
       spriteUrl: '/sprites/golden-sun/enemies/slime.gif',
       element: 'Venus' as Element,
       tags: ['Beast'],
     },
     wild_wolf: {
       id: 'wild_wolf',
       name: 'Wild Wolf',
       baseStats: { hp: 65, atk: 18, def: 10, speed: 35 },
       spriteUrl: '/sprites/golden-sun/enemies/wolf.gif',
       element: 'Venus' as Element,
       tags: ['Beast'],
     },
     fire_lizard: {
       id: 'fire_lizard',
       name: 'Fire Lizard',
       baseStats: { hp: 70, atk: 20, def: 12, speed: 30 },
       spriteUrl: '/sprites/golden-sun/enemies/fire_lizard.gif',
       element: 'Mars' as Element,
       tags: ['Beast'],
     },
     // ... 10-15 more enemies
   };
   ```

3. **Create `psynergyData.ts`:**
   ```typescript
   import type { Psynergy, Element } from '../types/battle.js';
   
   export const PSYNERGY_DATA: Record<string, Psynergy> = {
     // Venus Psynergy (Earth)
     quake: {
       id: 'quake',
       name: 'Quake',
       description: 'Strike a single foe with earth power',
       mpCost: 7,
       effect: {
         type: 'damage',
         target: 'single_enemy',
         power: 25,
         element: 'Venus',
       },
       animationId: 'quake_animation',
     },
     spire: {
       id: 'spire',
       name: 'Spire',
       description: 'Attack all foes with earth spikes',
       mpCost: 12,
       effect: {
         type: 'damage',
         target: 'all_enemies',
         power: 35,
         element: 'Venus',
       },
       animationId: 'spire_animation',
     },
     cure: {
       id: 'cure',
       name: 'Cure',
       description: 'Restore HP to one ally',
       mpCost: 5,
       effect: {
         type: 'heal',
         target: 'single_ally',
         power: 40,
       },
       animationId: 'cure_animation',
     },
     
     // Mars Psynergy (Fire)
     flare: {
       id: 'flare',
       name: 'Flare',
       description: 'Attack with a burst of flame',
       mpCost: 6,
       effect: {
         type: 'damage',
         target: 'single_enemy',
         power: 30,
         element: 'Mars',
       },
       animationId: 'flare_animation',
     },
     
     // ... 15-20 more psynergy spells
   };
   ```

4. **Create `battleItems.ts`:**
   ```typescript
   import type { Item } from '../types/items.js';
   
   export const BATTLE_ITEMS: Record<string, Item> = {
     herb: {
       id: 'herb',
       name: 'Herb',
       description: 'Restores 50 HP',
       type: 'consumable',
       price: 10,
       sellPrice: 5,
       stats: { hpRestore: 50 },
     },
     nut: {
       id: 'nut',
       name: 'Nut',
       description: 'Restores 30 MP',
       type: 'consumable',
       price: 20,
       sellPrice: 10,
       stats: { mpRestore: 30 },
     },
     potion: {
       id: 'potion',
       name: 'Potion',
       description: 'Restores 100 HP',
       type: 'consumable',
       price: 50,
       sellPrice: 25,
       stats: { hpRestore: 100 },
     },
     water_of_life: {
       id: 'water_of_life',
       name: 'Water of Life',
       description: 'Revives a downed ally with 50% HP',
       type: 'consumable',
       price: 3000,
       sellPrice: 1500,
       stats: { revive: true, hpRestore: 50 },
     },
   };
   ```

5. **Create `djinnData.ts`:**
   ```typescript
   import type { Djinn, Element } from '../types/battle.js';
   
   export const DJINN_DATA: Record<string, Djinn> = {
     flint: {
       id: 'flint',
       name: 'Flint',
       element: 'Venus' as Element,
       description: 'Adds 10 to Attack',
       statBonus: { atk: 10, def: 0, hp: 5, mp: 0, spd: 0 },
       summon: {
         name: 'Venus',
         power: 60,
         effect: 'aoe_damage',
         animationId: 'venus_summon',
       },
     },
     // ... more Djinn
   };
   ```

6. **Write data validation tests:**
   - Verify no duplicate IDs
   - Verify all references exist (psynergy IDs in party members)
   - Verify stat balance (no 999 HP monsters)

**Acceptance Criteria:**
- [ ] 4 party members created (Isaac, Garet, Ivan, Mia)
- [ ] 10-15 enemies created
- [ ] 15-20 psynergy spells created
- [ ] 5-10 battle items created
- [ ] 4+ Djinn created (one per element)
- [ ] All data validated (no broken references)
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-02

---

### ✅ CODER-09: Migrate useManualBattle Hook (2-3 hours)

**Priority:** CRITICAL (Core battle engine)

**Description:**  
Port the main battle logic hook that powers manual combat.

**Files to Create:**
```bash
/workspace/golden-sun/src/hooks/useManualBattle.ts
/workspace/golden-sun/src/hooks/useManualBattle.test.ts
```

**Source:**
```bash
/workspace/nexteragame/src/hooks/useManualBattle.ts
```

**Step-by-Step:**

1. **Copy hook:**
   ```bash
   cp /workspace/nexteragame/src/hooks/useManualBattle.ts /workspace/golden-sun/src/hooks/useManualBattle.ts
   ```

2. **Update imports:**
   ```typescript
   import type { BattleUnit, BattleResult, CombatAction } from '../types/battle.js';
   import { makeRng, type IRng } from '../utils/rng.js';
   ```

3. **Keep core logic unchanged:**
   - Turn order calculation (speed → isPlayer → originalIndex)
   - Damage formula: `floor(atk - def/2) + variance(-2, 2)`, min 1
   - Defend reduces damage by 50%
   - Victory conditions (all enemies dead or all players dead)

4. **Key functions to preserve:**
   ```typescript
   function computeTurnOrder(alivePlayers: BattleUnit[], aliveEnemies: BattleUnit[]): string[];
   function computeDamage(attacker: BattleUnit, defender: BattleUnit): number;
   function applyDamage(defenderId: string, amount: number): void;
   function executeDefend(actorId: string): void;
   function executeFlee(): void;
   function advanceTurn(): void;
   ```

5. **Port tests:**
   - Test turn order (deterministic)
   - Test damage calculation (with RNG seed)
   - Test defend mechanic (50% reduction)
   - Test victory detection

**Acceptance Criteria:**
- [ ] Hook copied and adapted
- [ ] All battle logic deterministic (same seed = same result)
- [ ] 100+ tests passing
- [ ] Damage formula verified
- [ ] Turn order correct
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-01, CODER-02, CODER-03

---

### ✅ CODER-10: Create Battle Trigger System (2-3 hours)

**Priority:** HIGH (Integration with dialogue)

**Description:**  
Create system to trigger battles from NPC dialogue.

**Files to Create:**
```bash
/workspace/golden-sun/src/systems/BattleTriggerSystem.ts
/workspace/golden-sun/src/systems/BattleTriggerSystem.test.ts
```

**Files to Modify:**
```bash
/workspace/golden-sun/src/types/dialogue.ts  # Add battle action
```

**Step-by-Step:**

1. **Extend DialogueAction type:**
   ```typescript
   // In types/dialogue.ts
   export type DialogueAction = 
     | { type: 'shop'; shopId: string }
     | { type: 'setFlag'; flagName: string; value: any }
     // NEW: Battle action
     | { type: 'battle'; 
         enemyPartyId: string; 
         canFlee: boolean;
         battleType: 'trainer' | 'boss' | 'random';
         onVictory?: {
           setFlags?: Record<string, any>;
           rewards?: BattleRewards;
         };
         onDefeat?: {
           gameOver?: boolean;
           allowRetry?: boolean;
         };
       }
     | ... existing actions;
   ```

2. **Create `BattleTriggerSystem.ts`:**
   ```typescript
   import type { DialogueAction } from '../types/dialogue.js';
   import type { BattleContext } from '../types/battle.js';
   import type { EnemyTemplate } from '../types/battle.js';
   import { BATTLE_ENEMIES } from '../data/battleEnemies.js';
   
   export interface BattleContext {
     enemyParty: EnemyTemplate[];
     canFlee: boolean;
     battleType: 'trainer' | 'boss' | 'random';
     onVictory?: {
       setFlags?: Record<string, any>;
       rewards?: BattleRewards;
     };
     onDefeat?: {
       gameOver?: boolean;
       allowRetry?: boolean;
     };
   }
   
   export function createBattleContext(action: DialogueAction): BattleContext | null {
     if (action.type !== 'battle') return null;
     
     // Load enemy party
     const enemyParty = loadEnemyParty(action.enemyPartyId);
     if (!enemyParty) return null;
     
     return {
       enemyParty,
       canFlee: action.canFlee,
       battleType: action.battleType,
       onVictory: action.onVictory,
       onDefeat: action.onDefeat,
     };
   }
   
   function loadEnemyParty(partyId: string): EnemyTemplate[] | null {
     // Look up enemy party by ID
     // e.g., "trainer_garet" → [slime, wild_wolf]
     const partyDefinitions: Record<string, string[]> = {
       'trainer_garet': ['slime', 'wild_wolf'],
       'trainer_kraden': ['fire_lizard', 'fire_lizard'],
       // ... more trainers
     };
     
     const enemyIds = partyDefinitions[partyId];
     if (!enemyIds) return null;
     
     return enemyIds.map(id => BATTLE_ENEMIES[id]);
   }
   ```

3. **Write tests:**
   - Test battle context creation
   - Test enemy party loading
   - Test victory/defeat callbacks

**Acceptance Criteria:**
- [ ] DialogueAction extended with battle type
- [ ] BattleTriggerSystem creates battle contexts
- [ ] Enemy parties load correctly
- [ ] Victory/defeat callbacks stored
- [ ] 30+ tests passing
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-02, CODER-08

---

### ✅ CODER-11: Create Battle Transition System (2-3 hours)

**Priority:** HIGH (Overworld ↔ Battle)

**Description:**  
Handle transitions between overworld and battle screens.

**Files to Create:**
```bash
/workspace/golden-sun/src/systems/BattleTransitionSystem.ts
/workspace/golden-sun/src/systems/BattleTransitionSystem.test.ts
```

**Step-by-Step:**

1. **Create transition system:**
   ```typescript
   export type GameMode = 'overworld' | 'battle' | 'transition';
   
   export interface TransitionState {
     mode: GameMode;
     fadeProgress: number; // 0 to 1
     direction: 'in' | 'out';
     onComplete?: () => void;
   }
   
   export function startBattleTransition(
     setMode: (mode: GameMode) => void,
     setBattleContext: (context: BattleContext) => void,
     context: BattleContext
   ): void {
     // 1. Fade out overworld
     setMode('transition');
     fadeOut(1000); // 1 second
     
     // 2. After fade, switch to battle
     setTimeout(() => {
       setBattleContext(context);
       setMode('battle');
       fadeIn(500); // 0.5 seconds
     }, 1000);
   }
   
   export function endBattleTransition(
     setMode: (mode: GameMode) => void,
     setBattleContext: (context: BattleContext | null) => void
   ): void {
     // 1. Fade out battle
     setMode('transition');
     fadeOut(500);
     
     // 2. After fade, switch to overworld
     setTimeout(() => {
       setBattleContext(null);
       setMode('overworld');
       fadeIn(1000);
     }, 500);
   }
   
   function fadeOut(duration: number): void {
     // CSS transition or animation
     document.body.style.transition = `opacity ${duration}ms`;
     document.body.style.opacity = '0';
   }
   
   function fadeIn(duration: number): void {
     document.body.style.transition = `opacity ${duration}ms`;
     document.body.style.opacity = '1';
   }
   ```

2. **Write tests:**
   - Test transition timing
   - Test mode switching
   - Test cleanup on transition end

**Acceptance Criteria:**
- [ ] Smooth fade transitions (no jarring switches)
- [ ] Proper cleanup (unmount old screen before mounting new)
- [ ] 20+ tests passing
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-10

---

### ✅ CODER-12: Create Battle Reward System (1-2 hours)

**Priority:** MEDIUM (Post-battle)

**Description:**  
Award exp, coins, items, and update story flags after battle victory.

**Files to Create:**
```bash
/workspace/golden-sun/src/systems/BattleRewardSystem.ts
/workspace/golden-sun/src/systems/BattleRewardSystem.test.ts
```

**Step-by-Step:**

1. **Create reward system:**
   ```typescript
   import type { BattleResult, BattleRewards, PartyMember } from '../types/battle.js';
   import type { FlagSystem } from '../types/storyFlags.js';
   
   export function calculateBattleRewards(
     result: BattleResult,
     enemiesDefeated: EnemyTemplate[]
   ): BattleRewards {
     if (result.winner !== 'player') {
       return { exp: 0, coins: 0, items: [] };
     }
     
     // Calculate exp (sum of enemy levels)
     const exp = enemiesDefeated.reduce((sum, enemy) => {
       return sum + (enemy.baseStats.hp / 10); // Rough exp formula
     }, 0);
     
     // Calculate coins (random drop)
     const coins = Math.floor(exp * 1.5);
     
     // Random item drops (10% chance per enemy)
     const items: Item[] = [];
     enemiesDefeated.forEach(enemy => {
       if (Math.random() < 0.1) {
         items.push(BATTLE_ITEMS.herb);
       }
     });
     
     return { exp, coins, items };
   }
   
   export function applyBattleRewards(
     rewards: BattleRewards,
     party: PartyMember[],
     storyFlags: FlagSystem
   ): PartyMember[] {
     return party.map(member => {
       // Award exp
       const newExp = member.exp + Math.floor(rewards.exp / party.length);
       
       // Check for level up
       const newLevel = calculateLevel(newExp);
       let newStats = member;
       if (newLevel > member.level) {
         newStats = levelUpMember(member, newLevel);
       }
       
       return {
         ...newStats,
         exp: newExp,
         level: newLevel,
       };
     });
   }
   
   function calculateLevel(exp: number): number {
     // Simple level formula: level = floor(sqrt(exp / 100)) + 1
     return Math.floor(Math.sqrt(exp / 100)) + 1;
   }
   
   function levelUpMember(member: PartyMember, newLevel: number): PartyMember {
     // Increase stats on level up
     const statGain = newLevel - member.level;
     return {
       ...member,
       maxHp: member.maxHp + (statGain * 5),
       hp: member.hp + (statGain * 5),
       maxMp: member.maxMp + (statGain * 3),
       mp: member.mp + (statGain * 3),
       atk: member.atk + (statGain * 2),
       def: member.def + (statGain * 2),
       speed: member.speed + statGain,
     };
   }
   ```

2. **Write tests:**
   - Test exp calculation
   - Test level up logic
   - Test reward distribution
   - Test story flag updates

**Acceptance Criteria:**
- [ ] Exp awarded to all party members
- [ ] Level up increases stats
- [ ] Items added to inventory
- [ ] Story flags updated
- [ ] 30+ tests passing
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-02, CODER-08

---

### ✅ CODER-13: Integrate with GoldenSunApp (3-4 hours)

**Priority:** CRITICAL (Main integration)

**Description:**  
Integrate battle system into main app, connecting dialogue → battle → overworld flow.

**Files to Modify:**
```bash
/workspace/golden-sun/src/GoldenSunApp.tsx
```

**Step-by-Step:**

1. **Add battle state:**
   ```typescript
   const [gameMode, setGameMode] = useState<'overworld' | 'battle'>('overworld');
   const [battleContext, setBattleContext] = useState<BattleContext | null>(null);
   ```

2. **Handle dialogue battle actions:**
   ```typescript
   function handleDialogueAction(action: DialogueAction) {
     if (action.type === 'battle') {
       const context = createBattleContext(action);
       if (context) {
         startBattleTransition(setGameMode, setBattleContext, context);
       }
     }
     // ... existing action handlers
   }
   ```

3. **Render battle screen:**
   ```typescript
   if (gameMode === 'battle' && battleContext) {
     return (
       <BattleScreen
         playerParty={convertPartyToBattleUnits(party)}
         enemyParty={convertTemplatesToBattleUnits(battleContext.enemyParty)}
         canFlee={battleContext.canFlee}
         onComplete={(result) => handleBattleComplete(result, battleContext)}
         seed={Date.now()}
       />
     );
   }
   ```

4. **Handle battle completion:**
   ```typescript
   function handleBattleComplete(result: BattleResult, context: BattleContext) {
     if (result.winner === 'player') {
       // Award rewards
       const rewards = calculateBattleRewards(result, context.enemyParty);
       const updatedParty = applyBattleRewards(rewards, party, storyFlags);
       setParty(updatedParty);
       
       // Execute victory callbacks
       if (context.onVictory?.setFlags) {
         Object.entries(context.onVictory.setFlags).forEach(([flag, value]) => {
           storyFlags.setFlag(flag, value);
         });
       }
     } else if (result.winner === 'enemy') {
       // Handle defeat
       if (context.onDefeat?.gameOver) {
         // Game over screen
         setGameMode('game_over');
       }
     }
     
     // Return to overworld
     endBattleTransition(setGameMode, setBattleContext);
   }
   ```

5. **Write integration tests:**
   - Test dialogue → battle transition
   - Test battle → overworld transition
   - Test reward application
   - Test story flag updates

**Acceptance Criteria:**
- [ ] Can trigger battle from dialogue
- [ ] Battle plays to completion
- [ ] Victory returns to overworld with rewards
- [ ] Defeat handled properly
- [ ] Story flags update correctly
- [ ] No crashes or infinite loops
- [ ] 50+ integration tests passing
- [ ] TypeScript: 0 errors

**Dependencies:** CODER-10, CODER-11, CODER-12

---

### ✅ CODER-14: Port BattleScreen Logic (3-4 hours)

**Priority:** HIGH (Main battle controller - logic only)

**Description:**  
Port battle screen logic (state management, turn execution). Graphics AI will handle UI.

**Files to Create:**
```bash
/workspace/golden-sun/src/screens/BattleScreen.logic.ts  # NEW: Logic extracted
```

**Files to Reference:**
```bash
/workspace/nexteragame/src/screens/BattleScreen.tsx  # Source (1,828 LOC)
```

**Step-by-Step:**

1. **Extract pure logic from BattleScreen:**
   ```typescript
   // BattleScreen.logic.ts
   import { useManualBattle } from '../hooks/useManualBattle.js';
   import type { BattleUnit, BattleResult } from '../types/battle.js';
   
   export interface BattleScreenLogicProps {
     playerUnits: BattleUnit[];
     enemyUnits: BattleUnit[];
     onComplete: (result: BattleResult) => void;
     seed?: number;
   }
   
   export function useBattleScreenLogic({
     playerUnits,
     enemyUnits,
     onComplete,
     seed,
   }: BattleScreenLogicProps) {
     // Use the manual battle hook
     const battle = useManualBattle({
       playerUnits,
       enemyUnits,
       onComplete,
       seed,
     });
     
     // Enemy AI logic
     const executeEnemyTurn = (enemyId: string) => {
       const enemy = battle.findUnit(enemyId);
       if (!enemy) return;
       
       // Simple AI: Attack lowest HP player
       const target = battle.alivePlayers
         .sort((a, b) => a.currentHp - b.currentHp)[0];
       
       if (target) {
         const damage = battle.computeDamage(enemy, target);
         battle.applyDamage(target.id, damage);
         battle.pushAction({ type: 'attack', actorId: enemyId, targetId: target.id, damage });
       }
       
       battle.advanceTurn();
     };
     
     return {
       ...battle,
       executeEnemyTurn,
     };
   }
   ```

2. **Create helper functions:**
   ```typescript
   export function convertPartyToBattleUnits(party: PartyMember[]): BattleUnit[] {
     return party.map((member, index) => ({
       id: member.id,
       name: member.name,
       currentHp: member.hp,
       maxHp: member.maxHp,
       currentMp: member.mp,
       maxMp: member.maxMp,
       atk: member.atk,
       def: member.def,
       speed: member.speed,
       isPlayer: true,
       buffState: { buffs: [] },
       originalIndex: index,
     }));
   }
   
   export function convertTemplatesToBattleUnits(templates: EnemyTemplate[]): BattleUnit[] {
     return templates.map((template, index) => ({
       id: `${template.id}_${index}`,
       name: template.name,
       currentHp: template.baseStats.hp,
       maxHp: template.baseStats.hp,
       currentMp: 0,
       maxMp: 0,
       atk: template.baseStats.atk,
       def: template.baseStats.def,
       speed: template.baseStats.speed,
       isPlayer: false,
       buffState: { buffs: [] },
       originalIndex: index + 100, // Offset to avoid collision
     }));
   }
   ```

3. **Write logic tests:**
   - Test enemy AI (attacks lowest HP)
   - Test turn execution
   - Test battle end detection

**Acceptance Criteria:**
- [ ] Battle logic extracted from UI
- [ ] Enemy AI works (targets lowest HP)
- [ ] Turn system works
- [ ] 50+ logic tests passing
- [ ] TypeScript: 0 errors
- [ ] No UI dependencies in logic file

**Dependencies:** CODER-09

**Note:** Graphics AI will use this logic file to build the UI in GRAPHICS-07.

---

### ✅ CODER-15: Port All Battle Tests (6-10 hours)

**Priority:** HIGH (Quality assurance)

**Description:**  
Port all 500+ tests from NextEraGame to ensure battle system works correctly.

**Files to Create:**
```bash
/workspace/golden-sun/tests/systems/BuffSystem.test.ts
/workspace/golden-sun/tests/systems/PsynergySystem.test.ts
/workspace/golden-sun/tests/systems/ItemSystem.test.ts
/workspace/golden-sun/tests/systems/ElementSystem.test.ts
/workspace/golden-sun/tests/systems/DjinnSystem.test.ts
/workspace/golden-sun/tests/hooks/useManualBattle.test.ts
/workspace/golden-sun/tests/screens/BattleScreen.test.tsx
/workspace/golden-sun/tests/integration/battleFlow.test.ts
/workspace/golden-sun/tests/e2e/fullBattle.test.ts
```

**Source:**
```bash
/workspace/nexteragame/tests/systems/
/workspace/nexteragame/tests/screens/
/workspace/nexteragame/tests/integration/
```

**Step-by-Step:**

1. **Copy all test files:**
   ```bash
   cp -r /workspace/nexteragame/tests/systems/* /workspace/golden-sun/tests/systems/
   cp -r /workspace/nexteragame/tests/screens/BattleScreen.test.tsx /workspace/golden-sun/tests/screens/
   ```

2. **Update imports in all test files:**
   ```typescript
   // Change:
   import { BuffSystem } from '../src/systems/BuffSystem.js';
   // To:
   import { BuffSystem } from '../../src/systems/BuffSystem.js';
   ```

3. **Rename "Ability" to "Psynergy" in tests:**
   - Global find/replace across test files
   - Update test descriptions

4. **Run tests incrementally:**
   ```bash
   npm test BuffSystem.test.ts       # Should pass
   npm test PsynergySystem.test.ts   # Should pass
   npm test useManualBattle.test.ts  # Should pass
   npm test BattleScreen.test.tsx    # Should pass
   ```

5. **Fix any failures:**
   - Most should pass without changes
   - Fix any Golden Sun-specific differences
   - Document any skipped tests

6. **Write new integration tests:**
   ```typescript
   // tests/integration/battleFlow.test.ts
   describe('Battle Flow Integration', () => {
     it('should complete full battle: dialogue → battle → rewards → overworld', () => {
       // 1. Trigger battle from dialogue
       // 2. Execute battle turns
       // 3. Win battle
       // 4. Verify rewards applied
       // 5. Verify returned to overworld
     });
   });
   ```

7. **Write E2E tests:**
   ```typescript
   // tests/e2e/fullBattle.test.ts
   describe('Full Battle E2E', () => {
     it('should complete battle with player actions', () => {
       // Simulate full battle with keyboard input
     });
   });
   ```

**Acceptance Criteria:**
- [ ] 500+ tests ported
- [ ] 99%+ tests passing (allow a few skips if needed)
- [ ] All systems have test coverage
- [ ] Integration tests verify full flow
- [ ] E2E tests verify user experience
- [ ] TypeScript: 0 errors in tests
- [ ] Test run time < 30 seconds

**Dependencies:** All previous CODER tasks

---

## 🎯 SUCCESS METRICS

**Your work is complete when:**

1. ✅ All 15 tasks completed
2. ✅ TypeScript: 0 errors (strict mode)
3. ✅ 500+ tests passing (99%+ pass rate)
4. ✅ Build succeeds (`npm run build`)
5. ✅ Battle system fully functional
6. ✅ Integrated with Golden Sun dialogue system
7. ✅ No regressions in existing overworld functionality
8. ✅ All code documented with JSDoc
9. ✅ All functions pure (where applicable)
10. ✅ Deterministic RNG working (same seed = same result)

---

## 🔍 QUALITY CHECKLIST

After each task, verify:

- [ ] **TypeScript:** `npm run type-check` → 0 errors
- [ ] **Tests:** `npm test` → All passing
- [ ] **Build:** `npm run build` → Succeeds
- [ ] **Lint:** `npm run lint` → 0 errors
- [ ] **Format:** Code formatted consistently
- [ ] **Comments:** Complex logic documented
- [ ] **No TODOs:** All placeholder code removed
- [ ] **No console.logs:** Debugging statements removed
- [ ] **Imports:** All imports use `.js` extension (ES modules)
- [ ] **Pure functions:** Systems don't mutate inputs

---

## 🚀 HOW TO START

**Immediate first steps:**

1. Read `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md` completely
2. Read the Architect's documents (when available):
   - `CODEBASE_ANALYSIS.md`
   - `TYPE_INTEGRATION_STRATEGY.md`
   - `CODER_TASKS.md`
3. Set up your environment:
   ```bash
   cd /workspace/golden-sun
   npm install
   npm run type-check  # Verify current state
   npm test            # Verify current tests pass
   ```
4. Start with **CODER-01** (Migrate Core Utilities)
5. Work through tasks **in order** (they have dependencies)

**Work methodically. Test after each task. Don't skip ahead.**

---

## 📚 REFERENCE FILES

**Main Migration Plan:**
- `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md` (Your comprehensive guide)

**Architect Documents:**
- Will be created by Architect AI (wait for these)

**NextEraGame Source:**
- `/workspace/nexteragame/` (Complete battle system)

**Golden Sun Current:**
- `/workspace/golden-sun/` (Your target)

---

## ⚠️ CRITICAL REMINDERS

1. **Test constantly** - Run tests after every change
2. **Don't break overworld** - Existing game must keep working
3. **Maintain type safety** - 0 TypeScript errors at all times
4. **Pure functions** - Systems should not mutate inputs
5. **Deterministic** - Same seed must produce same results
6. **Document complex logic** - Future you will thank you
7. **Ask for help** - If stuck, refer back to Architect or original code
8. **Commit frequently** - Small commits with clear messages

---

**Ready to code! Start with CODER-01: Migrate Core Utilities.**

Good luck, Coder! 🛠️
