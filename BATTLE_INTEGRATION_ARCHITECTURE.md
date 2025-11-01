# BATTLE INTEGRATION ARCHITECTURE — GOLDEN SUN

**Status:** Complete  
**Author:** Architect Role (MetaPrompt system)  
**Last Updated:** 2025-11-01 16:32 UTC

---

## 1. High-Level Flow
```
Overworld Exploration (GoldenSunApp)
    │
    ├─ Player interacts with NPC / trigger
    │
    ├─ Dialogue action dispatches `{ type: 'battle', ... }`
    │
    ├─ GoldenSunApp sets `battleContext` & `gameMode = 'battle'`
    │
    ├─ Transition Controller plays fade-out / audio swap
    │
    ├─ BattleScreen mounts, bootstraps `useManualBattle`
    │
    ├─ Battle resolves (party ↔ enemies)
    │
    ├─ Hook returns `BattleResult`
    │
    ├─ Rewards applied (EXP, coins, items, flags)
    │
    ├─ Transition Controller plays fade-in
    │
    └─ GoldenSunApp restores overworld state, continues dialogue or free roam
```

---

## 2. Battle Trigger System
### 2.1 Dialogue Extension
```ts
// golden-sun/src/types/dialogue.ts
export type DialogueAction =
  | { type: 'setFlag'; flag: string; value: unknown }
  | { type: 'shop'; shopId: string }
  | { type: 'battle'; payload: BattleTriggerPayload };

export interface BattleTriggerPayload {
  encounterId: string;            // Key into enemy formation registry
  canFlee: boolean;
  enemyLevelScale?: number;       // Optional: adjust difficulty per story beat
  onVictory?: DialogueAction[];   // Post-battle actions
  onDefeat?: DialogueAction[];    // Optional fail-state actions
}
```

```ts
// golden-sun/src/systems/dialogueSystem.ts (dispatcher)
if (action.type === 'battle') {
  return {
    kind: 'battle-trigger',
    payload: action.payload,
  } satisfies DialogueTransition;
}
```

### 2.2 App-Level Handling
```ts
// golden-sun/src/GoldenSunApp.tsx
const [gameMode, setGameMode] = useState<'overworld' | 'battle'>('overworld');
const [battleContext, setBattleContext] = useState<BattleContext | null>(null);

const handleDialogueTransition = (transition: DialogueTransition) => {
  switch (transition.kind) {
    case 'battle-trigger': {
      const context = createBattleContext(transition.payload, {
        partyRoster,
        inventory,
        rngSeed: Date.now(),
      });
      pauseOverworldLoop();
      setBattleContext(context);
      setGameMode('battle');
      return;
    }
    // ... existing transitions
  }
};
```

### 2.3 Battle Context Factory
- Located at `src/systems/battleContextFactory.ts`.
- Responsibilities: look up enemy formation, map roster to `BattleUnit`s, preload assets, and return `BattleContext` + metadata for transitions.
- Dependencies: `types/battle.ts`, `adapters/battleAdapters.ts`, `data/battleFormations.ts`, `utils/rng.ts`.

---

## 3. State Management & Controllers
| Concern | Ownership | Notes |
| --- | --- | --- |
| Game Mode | `GoldenSunApp` local state | Simplest solution; avoids porting NextEraGame GameController |
| Battle Runtime | `useManualBattle` hook | Receives `BattleContext`, exposes command API for UI |
| Visual Effects | `BattlePresentationProvider` context | Wraps screen to provide shake/flash hooks |
| Audio | `AudioManager` service (new) | Fades BGM, triggers SFX per battle event |
| Dialogue Resume | `DialogueSystem` queue | Post-victory actions enqueued when returning to overworld |

**Rationale:** `GoldenSunApp` already coordinates multiple systems; adding `gameMode` + `battleContext` extends existing pattern without rewriting to controller/state machine architecture. Documented in `ARCHITECTURAL_DECISIONS.md`.

---

## 4. Transition Choreography
| Phase | Implementation | Duration | Notes |
| --- | --- | --- | --- |
| Pre-Battle Fade Out | `TransitionManager.start('battle-enter')` | 400ms | Blocks input; triggers audio fade |
| Overworld Pause | `pauseOverworldLoop()` | Instant | Cancels `requestAnimationFrame` and clears input queue |
| Battle Mount | `<BattleScreen context={battleContext} onComplete={handleBattleComplete} />` | React mount | Provide suspense fallback for asset preloading |
| Post-Battle Fade Out | `TransitionManager.start('battle-exit')` | 400ms | Occurs after `BattleResult` is computed |
| Reward Application | `applyBattleRewards(result, services)` | ~50ms | Synchronous, but wrap in `try/catch` for analytics |
| Overworld Resume | `resumeOverworldLoop()` + `setGameMode('overworld')` | Instant | Rehydrate NPC/story state |

Implementation detail: `TransitionManager` can be a simple context built atop CSS transitions or existing overlay component from Golden Sun (check `components/ScreenTransition.tsx` if available).

---

## 5. Reward & Failure Handling
```ts
function handleBattleComplete(result: BattleResult) {
  setPendingReward(result.rewards);
  TransitionManager.start('battle-exit');

  applyBattleRewards(result, {
    partyRoster,
    inventory,
    storyFlags,
    questSystem,
  });

  if (result.outcome === 'victory') {
    enqueueDialogueActions(result.followUpActions?.onVictory ?? []);
  } else {
    enqueueDialogueActions(result.followUpActions?.onDefeat ?? []);
  }

  setGameMode('overworld');
  setBattleContext(null);
  resumeOverworldLoop();
}
```

### Reward Application Rules
1. **EXP Distribution:** Even split across surviving party members; track overflow for level-up handling (future feature noted in decision log).
2. **Item Drops:** Immediately added to inventory; duplicate detection handled by `inventorySystem`.
3. **Coins:** Add to `Inventory.gold` (existing structure already present).
4. **Story Flags:** Use `storyFlagSystem.setFlag(flag, value)` to unlock new dialogue.
5. **Defeat Case:** Trigger defeat dialogue/actions; optionally teleport player to sanctum with HP/PP restored (requires extra task if chosen).

---

## 6. Error Recovery & Edge Cases
| Scenario | Expected Behavior | Mitigation |
| --- | --- | --- |
| Missing formation ID | Log error, cancel battle trigger, resume dialogue with fallback line | `createBattleContext` throws typed error captured by handler |
| Asset preload failure | Display loading overlay with retry/cancel option | Provide `BattleAssetLoader` promise with timeout |
| Player flees successfully | `BattleResult.outcome = 'flee'`; skip reward application; resume overworld at same location | Documented in coder tasks |
| Player defeat | `onDefeat` actions executed; default fallback: reload party with 1 HP, deduct coins | Configurable per dialogue |
| Concurrent triggers | Ignore additional battle actions while `gameMode === 'battle'`; log warning | Guard in dialogue dispatcher |

---

## 7. Data & Asset Dependencies
- **Battle Formations:** `src/data/battleFormations.ts` storing enemy parties, reward tables, flee rules.
- **Party Roster:** `src/data/partyMembers.ts` representing Isaac & allies with base stats.
- **Psynergy Catalog:** `src/data/psynergyCatalog.ts` enumerating spells, PP costs, animation keys.
- **Sprite Registry:** `src/data/battleSpriteRegistry.ts` to be produced by Graphics role for quick lookup.
- **Audio:** Optional but recommended to define `src/data/battleAudio.ts` for BGM + SFX keys.

---

## 8. Coordination Notes
- **Coder Dependency:** CODER-10 through CODER-13 rely on this architecture document to wire triggers, transitions, and app integration.
- **Graphics Dependency:** GRAPHICS-07 and GRAPHICS-10 require knowledge of transition choreography and event payloads.
- **QA Dependency:** QA battle scenarios should reference the flow here to script integration tests (dialogue → battle → reward).

