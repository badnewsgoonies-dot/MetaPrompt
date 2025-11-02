# 🔧 Type Integration Strategy - Battle System Migration

**Author:** Architect AI  
**Date:** 2025-11-01  
**Purpose:** Design type system integration between pokemon-battler and golden-sun

---

## 📋 OVERVIEW

This document defines how we'll integrate pokemon-battler's type system into Golden Sun without breaking existing code or creating circular dependencies.

**Key Principles:**
1. **Separation of Concerns** - Battle types separate from overworld types
2. **Adapter Pattern** - Convert between NPC ↔ BattleUnit
3. **Zero Breaking Changes** - Don't modify existing Golden Sun types
4. **Type Safety** - Maintain strict TypeScript throughout

---

## 🎯 TYPE SYSTEM COMPARISON

### pokemon-battler Types (Source)

```typescript
// pokemon-battler/src/types/pokemon.ts

export type PokemonType = 'Fire' | 'Water' | 'Grass' | 'Electric' | 'Normal';

export interface Move {
  readonly name: string;
  readonly type: PokemonType;
  readonly power: number;
  readonly maxPP: number;
}

export interface PokemonSpecies {
  readonly id: string;
  readonly name: string;
  readonly type: PokemonType;
  readonly baseHP: number;
  readonly baseAttack: number;
  readonly baseDefense: number;
  readonly baseSpeed: number;
  readonly moveNames: readonly string[];
}

export interface PokemonInstance {
  readonly species: PokemonSpecies;
  readonly currentHP: number;
  readonly moves: ReadonlyArray<MoveSlot>;
}

export interface MoveSlot {
  readonly move: Move;
  readonly currentPP: number;
}

export type Result<T, E> =
  | { readonly ok: true; readonly value: T }
  | { readonly ok: false; readonly error: E };
```

### Golden Sun Types (Target - Existing)

```typescript
// golden-sun/src/types/npc.ts
export interface NPC {
  id: string;
  name: string;
  sprite_id: string;
  position: NPCPosition;
  facing: Direction;
  dialogue_id: string;
  // ... other overworld properties
}

// golden-sun/src/utils/result.ts
export type Result<T, E> = 
  | { ok: true; value: T }
  | { ok: false; error: E };
```

**Analysis:**
- ✅ Result types are compatible (minor readonly difference)
- ❌ No battle-specific types exist in Golden Sun
- ✅ No naming conflicts (NPC vs PokemonInstance)

---

## 🏗️ NEW TYPE ARCHITECTURE

### File Structure

```
golden-sun/src/types/
├── battle.ts          # NEW: Core battle types
├── psynergy.ts        # NEW: Golden Sun abilities
├── battleUnit.ts      # NEW: In-battle character state
├── dialogue.ts        # EXISTING: Update with battle action
├── npc.ts             # EXISTING: No changes needed
└── ...                # Other existing types
```

---

## 📦 NEW FILE: types/battle.ts

```typescript
/**
 * Battle System Types for Golden Sun: Vale Village
 * Adapted from pokemon-battler
 */

// ============================================================================
// CORE BATTLE TYPES
// ============================================================================

/**
 * Golden Sun Elements (4 canonical)
 * Venus = Earth, Mars = Fire, Jupiter = Wind, Mercury = Water
 */
export type Element = 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';

/**
 * Battle unit type (player party member or enemy)
 */
export type BattleUnitType = 'player' | 'enemy';

/**
 * Battle action types
 */
export type BattleActionType = 
  | 'attack'      // Physical attack
  | 'psynergy'    // Use Psynergy ability
  | 'item'        // Use item
  | 'defend'      // Defend (reduces damage)
  | 'flee';       // Attempt to flee

// ============================================================================
// BATTLE UNIT (In-battle state)
// ============================================================================

/**
 * A character/enemy in battle (runtime state)
 * Adapted from PokemonInstance
 */
export interface BattleUnit {
  readonly id: string;
  readonly name: string;
  readonly unitType: BattleUnitType;
  readonly element: Element;
  
  // Current battle stats
  readonly currentHP: number;
  readonly maxHP: number;
  readonly currentPP: number;  // Psynergy Points (renamed from MP/MP)
  readonly maxPP: number;
  
  // Base stats
  readonly attack: number;
  readonly defense: number;
  readonly agility: number;      // Speed renamed to agility (GS term)
  
  // Abilities
  readonly psynergySlots: readonly PsynergySlot[];
  
  // Visual
  readonly spriteId: string;
  
  // Battle state
  readonly isDefending: boolean;
  readonly statusEffects: readonly StatusEffect[];
}

/**
 * Base stats for a battle unit (species/template)
 * Adapted from PokemonSpecies
 */
export interface BattleUnitTemplate {
  readonly id: string;
  readonly name: string;
  readonly element: Element;
  readonly baseHP: number;
  readonly basePP: number;
  readonly baseAttack: number;
  readonly baseDefense: number;
  readonly baseAgility: number;
  readonly psynergyNames: readonly string[];  // Psynergy IDs
  readonly spriteId: string;
}

// ============================================================================
// PSYNERGY (Golden Sun abilities)
// ============================================================================

/**
 * Psynergy power class
 */
export type PsynergyClass = 'utility' | 'damage' | 'healing' | 'support';

/**
 * Psynergy target type
 */
export type PsynergyTarget = 'single-enemy' | 'all-enemies' | 'single-ally' | 'all-allies' | 'self';

/**
 * A Psynergy ability (adapted from Move)
 */
export interface Psynergy {
  readonly id: string;
  readonly name: string;
  readonly element: Element;
  readonly powerClass: PsynergyClass;
  readonly basePower: number;     // 0 for utility/healing
  readonly ppCost: number;        // Renamed from maxPP
  readonly target: PsynergyTarget;
  readonly description: string;
  readonly animationId?: string;  // For future animation system
}

/**
 * Psynergy slot on a battle unit (adapted from MoveSlot)
 */
export interface PsynergySlot {
  readonly psynergy: Psynergy;
  readonly currentPP: number;  // PP remaining for this psynergy
}

// ============================================================================
// STATUS EFFECTS
// ============================================================================

/**
 * Status effect type
 */
export type StatusEffectType = 
  | 'poison'
  | 'sleep'
  | 'stun'
  | 'attack-up'
  | 'defense-up'
  | 'agility-up'
  | 'attack-down'
  | 'defense-down'
  | 'agility-down';

/**
 * Status effect on a battle unit
 */
export interface StatusEffect {
  readonly type: StatusEffectType;
  readonly turnsRemaining: number;
  readonly value?: number;  // For stat modifiers
}

// ============================================================================
// BATTLE STATE
// ============================================================================

/**
 * Battle side
 */
export type BattleSide = 'player' | 'enemy';

/**
 * Battle victory condition
 */
export type BattleWinner = BattleSide | null;

/**
 * Battle log entry
 */
export interface BattleLogEntry {
  readonly turn: number;
  readonly message: string;
  readonly type?: 'action' | 'damage' | 'heal' | 'status' | 'victory';
}

/**
 * Complete battle state (adapted from pokemon-battler BattleState)
 */
export interface BattleState {
  readonly battleId: string;
  readonly playerUnits: readonly BattleUnit[];
  readonly enemyUnits: readonly BattleUnit[];
  readonly turn: number;
  readonly currentSide: BattleSide;
  readonly winner: BattleWinner;
  readonly canFlee: boolean;
  readonly log: readonly BattleLogEntry[];
  readonly rngSeed: number;
}

/**
 * Battle action to execute
 */
export interface BattleAction {
  readonly actorId: string;       // Unit performing action
  readonly actionType: BattleActionType;
  readonly targetId?: string;     // Target unit ID (if applicable)
  readonly psynergyId?: string;   // Psynergy to use (if applicable)
  readonly itemId?: string;       // Item to use (if applicable)
}

/**
 * Battle action result
 */
export interface BattleActionResult {
  readonly success: boolean;
  readonly damage?: number;
  readonly healing?: number;
  readonly isCritical?: boolean;
  readonly effectiveness?: number;  // Type effectiveness multiplier
  readonly statusApplied?: StatusEffectType;
  readonly message: string;
}

// ============================================================================
// BATTLE CONTEXT (Connection to game)
// ============================================================================

/**
 * Battle context - connects battle to overworld game
 */
export interface BattleContext {
  readonly battleId: string;
  readonly battleType: 'trainer' | 'wild' | 'boss';
  readonly enemyPartyId: string;
  readonly canFlee: boolean;
  readonly onVictory?: BattleRewards;
  readonly onDefeat?: 'game-over' | 'retry' | 'continue';
  readonly bgMusic?: string;
  readonly bgImage?: string;
}

/**
 * Battle rewards (post-victory)
 */
export interface BattleRewards {
  readonly experience: number;
  readonly coins: number;
  readonly items?: readonly { itemId: string; quantity: number }[];
  readonly storyFlags?: Record<string, boolean | number | string>;
}

/**
 * Battle result (final outcome)
 */
export interface BattleResult {
  readonly victory: boolean;
  readonly turns: number;
  readonly rewards?: BattleRewards;
  readonly finalState: BattleState;
}
```

---

## 🔄 ADAPTER FUNCTIONS

### NEW FILE: adapters/battleAdapters.ts

```typescript
/**
 * Battle Adapters - Convert between overworld and battle types
 */

import { NPC } from '../types/npc';
import { BattleUnit, BattleUnitTemplate, BattleUnitType } from '../types/battle';
import { Result, Ok, Err } from '../utils/result';

/**
 * Convert NPC to enemy battle unit (for trainer battles)
 */
export function npcToEnemyUnit(
  npc: NPC,
  template: BattleUnitTemplate,
  level: number = 1
): Result<BattleUnit, string> {
  try {
    // Scale stats based on level
    const hpMultiplier = 1 + (level - 1) * 0.15;
    const statMultiplier = 1 + (level - 1) * 0.10;
    
    const battleUnit: BattleUnit = {
      id: `enemy_${npc.id}`,
      name: npc.name,
      unitType: 'enemy',
      element: template.element,
      
      currentHP: Math.floor(template.baseHP * hpMultiplier),
      maxHP: Math.floor(template.baseHP * hpMultiplier),
      currentPP: Math.floor(template.basePP * hpMultiplier),
      maxPP: Math.floor(template.basePP * hpMultiplier),
      
      attack: Math.floor(template.baseAttack * statMultiplier),
      defense: Math.floor(template.baseDefense * statMultiplier),
      agility: Math.floor(template.baseAgility * statMultiplier),
      
      psynergySlots: [], // Will be populated by battle system
      spriteId: template.spriteId,
      
      isDefending: false,
      statusEffects: [],
    };
    
    return Ok(battleUnit);
  } catch (error) {
    return Err(`Failed to convert NPC to battle unit: ${error}`);
  }
}

/**
 * Convert party member to player battle unit
 * (Placeholder - will be implemented when party system exists)
 */
export function partyMemberToBattleUnit(
  memberId: string,
  template: BattleUnitTemplate
): Result<BattleUnit, string> {
  try {
    const battleUnit: BattleUnit = {
      id: memberId,
      name: template.name,
      unitType: 'player',
      element: template.element,
      
      currentHP: template.baseHP,
      maxHP: template.baseHP,
      currentPP: template.basePP,
      maxPP: template.basePP,
      
      attack: template.baseAttack,
      defense: template.baseDefense,
      agility: template.baseAgility,
      
      psynergySlots: [], // Will be populated by battle system
      spriteId: template.spriteId,
      
      isDefending: false,
      statusEffects: [],
    };
    
    return Ok(battleUnit);
  } catch (error) {
    return Err(`Failed to convert party member to battle unit: ${error}`);
  }
}

/**
 * Create battle unit from template
 */
export function createBattleUnitFromTemplate(
  template: BattleUnitTemplate,
  unitType: BattleUnitType,
  level: number = 1
): Result<BattleUnit, string> {
  try {
    const hpMultiplier = 1 + (level - 1) * 0.15;
    const statMultiplier = 1 + (level - 1) * 0.10;
    
    const battleUnit: BattleUnit = {
      id: `${unitType}_${template.id}_${Date.now()}`,
      name: template.name,
      unitType,
      element: template.element,
      
      currentHP: Math.floor(template.baseHP * hpMultiplier),
      maxHP: Math.floor(template.baseHP * hpMultiplier),
      currentPP: Math.floor(template.basePP * hpMultiplier),
      maxPP: Math.floor(template.basePP * hpMultiplier),
      
      attack: Math.floor(template.baseAttack * statMultiplier),
      defense: Math.floor(template.baseDefense * statMultiplier),
      agility: Math.floor(template.baseAgility * statMultiplier),
      
      psynergySlots: [], // Will be populated by battle system
      spriteId: template.spriteId,
      
      isDefending: false,
      statusEffects: [],
    };
    
    return Ok(battleUnit);
  } catch (error) {
    return Err(`Failed to create battle unit from template: ${error}`);
  }
}
```

---

## 📝 TYPE MODIFICATIONS

### UPDATE: types/dialogue.ts

```typescript
// BEFORE (line 30):
export type DialogueAction = 
  | { type: 'battle'; npcId: string }
  | { type: 'shop'; shopId: string }
  // ... other actions

// AFTER:
export type DialogueAction = 
  | { 
      type: 'battle'; 
      enemyPartyId: string;          // Which enemy party to fight
      canFlee: boolean;               // Can player flee?
      onVictory?: string;             // Next dialogue ID on victory
      onDefeat?: 'game-over' | 'retry'; // What happens on defeat
    }
  | { type: 'shop'; shopId: string }
  // ... other actions
```

---

## 🎨 ELEMENT SYSTEM DESIGN

### Golden Sun Canonical Elements

```typescript
export type Element = 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
```

**Mappings:**
- **Venus** (🪨 Earth) - Strong vs Mars, weak vs Jupiter
- **Mars** (🔥 Fire) - Strong vs Jupiter, weak vs Mercury
- **Jupiter** (💨 Wind) - Strong vs Mercury, weak vs Venus
- **Mercury** (💧 Water) - Strong vs Venus, weak vs Mars

### Type Effectiveness Chart

```typescript
// NEW FILE: systems/elementSystem.ts

export const ELEMENT_EFFECTIVENESS: Record<Element, Partial<Record<Element, number>>> = {
  'Venus': {
    'Mars': 1.5,      // Earth beats Fire
    'Jupiter': 0.67,  // Earth weak to Wind
  },
  'Mars': {
    'Jupiter': 1.5,   // Fire beats Wind
    'Mercury': 0.67,  // Fire weak to Water
  },
  'Jupiter': {
    'Mercury': 1.5,   // Wind beats Water
    'Venus': 0.67,    // Wind weak to Earth
  },
  'Mercury': {
    'Venus': 1.5,     // Water beats Earth
    'Mars': 0.67,     // Water weak to Fire
  },
};

/**
 * Get type effectiveness multiplier
 */
export function getEffectiveness(attackElement: Element, defenderElement: Element): number {
  return ELEMENT_EFFECTIVENESS[attackElement]?.[defenderElement] ?? 1.0;
}
```

---

## 🚫 WHAT NOT TO CHANGE

### DO NOT MODIFY These Files:

1. ✅ `types/npc.ts` - Keep as-is
2. ✅ `types/scene.ts` - Keep as-is
3. ✅ `types/quest.ts` - Keep as-is
4. ✅ `types/shop.ts` - Keep as-is
5. ✅ `types/storyFlags.ts` - Keep as-is
6. ✅ `utils/result.ts` - Keep as-is (maybe add Ok/Err helpers)
7. ✅ `systems/npcSystem.ts` - Keep as-is
8. ✅ `systems/movementSystem.ts` - Keep as-is

**Why:** Minimize risk of breaking existing functionality

---

## 📊 IMPORT STRATEGY

### Clean Import Paths

```typescript
// ✅ GOOD: Clear, specific imports
import { BattleUnit, BattleState, BattleContext } from '../types/battle';
import { Psynergy, PsynergySlot } from '../types/battle';
import { NPC } from '../types/npc';
import { Result, Ok, Err } from '../utils/result';

// ❌ BAD: Barrel exports (can cause circular deps)
import * as Types from '../types';

// ❌ BAD: Mixing concerns
import { BattleUnit, NPC } from '../types'; // Don't mix
```

### Dependency Order (Avoid Circular Dependencies)

```
Level 1: Utils (no dependencies)
  └── result.ts
  └── seeded-rng.ts

Level 2: Base Types (only utils)
  └── common.ts (Position, Direction, etc.)
  └── battle.ts (BattleUnit, Psynergy, etc.)
  └── npc.ts
  └── dialogue.ts

Level 3: Adapters (types + utils)
  └── battleAdapters.ts

Level 4: Systems (types + utils + adapters)
  └── battleSystem.ts
  └── damageSystem.ts
  └── elementSystem.ts

Level 5: Components (everything)
  └── BattleScreen.tsx
  └── GoldenSunApp.tsx
```

---

## ✅ TYPE SAFETY CHECKLIST

- [ ] All battle types in separate `types/battle.ts` file
- [ ] No modifications to existing type files (except dialogue.ts action)
- [ ] Adapter functions in separate `adapters/` directory
- [ ] Element system matches Golden Sun canonical (4 elements)
- [ ] Result<T, E> uses existing `utils/result.ts`
- [ ] No circular dependencies (check with TypeScript)
- [ ] All types are readonly where appropriate
- [ ] No `any` types used
- [ ] Strict TypeScript mode maintained
- [ ] All types documented with JSDoc comments

---

## 🎯 IMPLEMENTATION ORDER

### Phase 1: Create Base Types (30 mins)
1. Create `types/battle.ts` with all interfaces
2. Run `tsc --noEmit` to verify no errors
3. No game integration yet - just types

### Phase 2: Create Adapters (1 hour)
1. Create `adapters/battleAdapters.ts`
2. Write unit tests for adapters
3. Verify conversions work correctly

### Phase 3: Update Dialogue Types (15 mins)
1. Update `DialogueAction` in `types/dialogue.ts`
2. Update dialogue system to handle new action structure
3. Run type-check

### Phase 4: Create Element System (1 hour)
1. Create `systems/elementSystem.ts`
2. Implement type effectiveness chart
3. Write comprehensive tests

### Phase 5: Integration Testing (30 mins)
1. Test type imports work correctly
2. Test no circular dependencies
3. Test all type checks pass
4. Test existing game still works

---

## 📚 REFERENCE EXAMPLES

### Creating a Battle from NPC Dialogue

```typescript
// In dialogueSystem.ts
import { BattleContext } from '../types/battle';
import { npcToEnemyUnit } from '../adapters/battleAdapters';

function handleBattleAction(action: DialogueAction & { type: 'battle' }): BattleContext {
  return {
    battleId: `battle_${Date.now()}`,
    battleType: 'trainer',
    enemyPartyId: action.enemyPartyId,
    canFlee: action.canFlee,
    onVictory: {
      experience: 50,
      coins: 100,
      storyFlags: { [`defeated_${action.enemyPartyId}`]: true }
    },
    onDefeat: action.onDefeat || 'game-over'
  };
}
```

### Using Adapters

```typescript
// Convert NPC to battle enemy
import { npcToEnemyUnit } from '../adapters/battleAdapters';
import { getBattleUnitTemplate } from '../data/battleUnits';

const npc = getNPCById('trainer_garet');
const template = getBattleUnitTemplate('garet_template');
const enemyResult = npcToEnemyUnit(npc, template, 5); // level 5

if (enemyResult.ok) {
  const enemy: BattleUnit = enemyResult.value;
  // Use in battle
}
```

---

**END OF TYPE INTEGRATION STRATEGY**

**Status:** Complete and ready for implementation  
**Risk Level:** LOW (clean separation, no conflicts)  
**Dependencies:** None (can start immediately)
