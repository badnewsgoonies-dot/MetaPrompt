# TYPE INTEGRATION STRATEGY — GOLDEN SUN BATTLE SYSTEM

**Status:** Complete  
**Author:** Architect Role (MetaPrompt system)  
**Last Updated:** 2025-11-01 16:32 UTC

---

## 1. Objectives
- Introduce a battle-focused type namespace inside the Golden Sun codebase without polluting existing overworld models.
- Preserve deterministic semantics established in NextEraGame while embracing Golden Sun terminology (Psynergy, Djinn, 4 classical elements).
- Provide adapter contracts for translating overworld data (NPCs, party roster, inventory) into battle runtime structures.
- Avoid circular dependencies and maintain strict TypeScript safety for downstream roles.

---

## 2. Module Layout & Naming Conventions
| Module | Purpose | Notes |
| --- | --- | --- |
| `src/types/battle.ts` | Core battle primitives (`BattleUnit`, `BattleStats`, `BattleContext`) | Single source of truth for runtime state |
| `src/types/psynergy.ts` | Psynergy spell definitions, status payloads, targeting enums | Derived from NextEraGame `Ability` definitions |
| `src/types/djinn.ts` | Djinn metadata (summon effects, stat modifications) | Port of GemSuperSystem types |
| `src/types/battle-events.ts` | Event bus payloads for UI + animation syncing | Mirrors NextEraGame event emitter contracts |
| `src/adapters/battleAdapters.ts` | Conversion utilities bridging overworld ↔ battle | Should not import React components |
| `src/utils/battleGuards.ts` | Type guards & assertions (e.g., `isBattleUnit`) | Used by tests + runtime checks |

**Naming Decisions**
- Ability → **Psynergy** (functionally identical but respects Golden Sun lore).
- Gem → **Djinn** (system-level rename; underlying data shape preserved).
- `BattleUnit` retains naming to avoid confusion with `PartyMember` (overworld representation).
- `Element` union trimmed to `'venus' | 'mars' | 'jupiter' | 'mercury'`; additional `'luna' | 'sol'` reserved for expansion (documented in decision log).

---

## 3. Core Type Definitions (Authoritative)
```ts
// src/types/battle.ts
export type BattleSide = 'party' | 'enemy';

export interface BattleStats {
  maxHp: number;
  currentHp: number;
  maxPp: number;
  currentPp: number;
  attack: number;
  defense: number;
  agility: number;
  luck: number;
  elementalPower: Partial<Record<Element, number>>;
  status?: StatusCondition[];
}

export interface BattleUnit {
  id: string;
  name: string;
  level: number;
  element: Element;
  side: BattleSide;
  stats: BattleStats;
  buffs: BuffStageState;
  equippedDjinn: DjinnAssignment[];
  inventory: BattleItemStack[];
  aiProfile?: EnemyAIProfile;
}

export interface BattleContext {
  party: BattleUnit[];
  enemies: BattleUnit[];
  turnOrder: string[];
  rngSeed: number;
  canFlee: boolean;
  battleType: 'story' | 'random' | 'boss';
  metadata?: Record<string, unknown>;
}
```

```ts
// src/types/psynergy.ts
export type TargetingMode = 'self' | 'ally-single' | 'ally-all' | 'enemy-single' | 'enemy-all';

export interface Psynergy {
  id: string;
  name: string;
  element: Element;
  ppCost: number;
  basePower: number;
  targeting: TargetingMode;
  speedModifier: number;
  effect: PsynergyEffect;
}

export type PsynergyEffect =
  | { kind: 'damage'; powerMultiplier: number; ignoresDefense?: boolean }
  | { kind: 'heal'; powerMultiplier: number; curesStatus?: StatusCondition[] }
  | { kind: 'buff'; stat: keyof BattleStats; stages: number; duration: number }
  | { kind: 'debuff'; stat: keyof BattleStats; stages: number; duration: number }
  | { kind: 'status'; applies: StatusCondition; chance: number };
```

```ts
// src/types/djinn.ts
export interface Djinn {
  id: string;
  name: string;
  element: Element;
  effect: DjinnEffect;
  recoveryTurns: number;
}

export type DjinnEffect =
  | { kind: 'stat-boost'; stat: keyof BattleStats; amount: number }
  | { kind: 'status-cleanse'; statuses: StatusCondition[] }
  | { kind: 'summon-charge'; summonId: string; power: number };
```

```ts
// src/types/battle-events.ts
export type BattleEvent =
  | { type: 'turn-start'; unitId: string; turn: number }
  | { type: 'psynergy-cast'; casterId: string; psynergyId: string; targets: string[] }
  | { type: 'damage-applied'; targetId: string; amount: number; isCritical: boolean }
  | { type: 'status-applied'; targetId: string; status: StatusCondition }
  | { type: 'unit-defeated'; unitId: string }
  | { type: 'battle-complete'; result: BattleResult };
```

---

## 4. Adapter Contracts
```ts
// src/adapters/battleAdapters.ts
import { NPC } from '../types/npc';
import { PartyMember } from '../types/party';
import { BattleUnit } from '../types/battle';
import { Element } from '../types/elements';

export function partyMemberToBattleUnit(member: PartyMember, overrides?: Partial<BattleUnit>): BattleUnit {
  return {
    id: member.id,
    name: member.name,
    level: member.level,
    element: member.element,
    side: 'party',
    stats: {
      maxHp: member.stats.maxHp,
      currentHp: member.stats.currentHp,
      maxPp: member.stats.maxPp,
      currentPp: member.stats.currentPp,
      attack: member.stats.attack,
      defense: member.stats.defense,
      agility: member.stats.agility,
      luck: member.stats.luck,
      elementalPower: member.stats.elementalPower,
    },
    buffs: createNeutralBuffStages(),
    equippedDjinn: member.djinnAssignments,
    inventory: member.inventory,
    ...overrides,
  };
}

export function npcToEnemyBattleUnit(npc: NPC, template: EnemyTemplate): BattleUnit {
  return {
    id: `${npc.id}-battle`,
    name: npc.name,
    level: template.level,
    element: template.element as Element,
    side: 'enemy',
    stats: deriveEnemyStats(template, npc),
    buffs: createNeutralBuffStages(),
    equippedDjinn: [],
    inventory: template.inventory,
    aiProfile: template.aiProfile,
  };
}
```

### Adapter Guidelines
- **Purity:** Adapters must remain pure functions with no React dependencies.
- **No Cross Imports:** Adapters depend on overworld types but not on battle systems; this avoids cyclical dependencies when systems reference adapters for initialization.
- **Override Support:** Allow optional overrides for scenario-specific tuning (boss encounters, story battles).

---

## 5. Import & Dependency Rules
1. **One-Way Flow:** `types/*` must never import from `systems/*` or `adapters/*`.
2. **Adapters Depend on Types Only:** `adapters/battleAdapters.ts` may import from overworld types and new battle types, but systems should not import adapters (they consume normalized `BattleUnit`s).
3. **Systems Use Utilities:** All systems can freely import from `utils` and `types`, but not from React modules.
4. **Hooks Compose Systems:** `useManualBattle` can import systems, adapters, and event types but should expose stable public APIs for UI.
5. **UI Layer Boundaries:** Components read from hook outputs and event streams only; they never mutate battle state directly.

---

## 6. Validation Strategy
| Validation Step | Owner | Description |
| --- | --- | --- |
| TypeScript strict mode | Coder | Ensure new type modules compile with `tsc --noEmit` in golden-sun project |
| Adapter unit tests | Coder | Tests for `partyMemberToBattleUnit` and `npcToEnemyBattleUnit` verifying numeric translation |
| Snapshot tests | Coder | Confirm battle context serialization remains stable for save/load pipelines |
| QA review | QA role | Validate naming consistency (Psynergy, Djinn) and element mapping |
| Lore review | Product/Story | Confirm 4-element baseline + placeholder for Luna/Sol expansion |

---

## 7. Open Questions & Follow-Ups
- **Summon Sequences:** NextEraGame's GemSuperSystem triggers cinematic supers. Need confirmation if Golden Sun will adopt identical pipeline or simplified effect. (Tracked in `ARCHITECTURAL_DECISIONS.md`).
- **Permanent HP Loss:** Determine whether post-battle HP/PP persist (classic Golden Sun) or reset (some story sequences). Architects recommends persistence with optional healing events defined in dialogue.
- **Inventory Sync:** Clarify if battle item consumption mutates overworld inventory immediately or at battle end (default: apply immediately with rollback on defeat).

