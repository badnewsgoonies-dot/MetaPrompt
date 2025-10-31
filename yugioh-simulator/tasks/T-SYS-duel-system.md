# 🛠️ CODER TASK: Yu-Gi-Oh Duel System

**Task ID:** T-SYS-duel-system
**Session:** 1
**Priority:** P0 (Blocking)
**Dependencies:** None
**Owner:** Coder
**Onboarding:** Reference CODER_ONBOARDING.md Section 2

---

## 📋 Context

Create the core Yu-Gi-Oh duel mechanics including card management, monster battles, spell/trap activation, and win conditions. This system must be deterministic, fully tested, and follow all mandatory patterns (pure functions, Result<T,E> types, seeded RNG).

---

## 🎯 Requirements

### 1. Duel System (`src/systems/DuelSystem.ts`)
- Initialize duel with 2 players (8000 LP each)
- Manage game state: current phase, active player, turn count
- Handle card drawing (deterministic shuffle with seed)
- Enforce summon rules (1 normal summon per turn, tribute requirements)
- Process monster attacks (direct and vs monsters)
- Apply damage and check win conditions
- **Must be pure functions with immutable state**

### 2. Card System (`src/systems/CardSystem.ts`)
- Define card types: Monster, Spell, Trap
- Card state management: hand, field, graveyard
- Monster positions: Attack/Defense, Face-up/Face-down
- Spell activation logic
- Trap setting and activation
- **Must use Result<T,E> for all operations**

### 3. Turn System (`src/systems/TurnSystem.ts`)
- Turn phases: Draw, Standby, Main1, Battle, Main2, End
- Phase transitions with validation
- Turn player switching
- Phase-specific actions (e.g., can't attack on first turn)
- **Must be deterministic (same inputs = same outputs)**

### 4. Utils
- `result-type.ts` - Implement Result<T,E> type for error handling
- `deterministic-rng.ts` - Seeded RNG for deck shuffling
- `card-data.ts` - Card database with 10 monsters, 5 spells, 5 traps

---

## ✅ Acceptance Criteria

### Functional
- [ ] Initialize duel with 2 players, 8000 LP, shuffled decks
- [ ] Draw 5 cards for starting hand
- [ ] Normal summon monsters (check tribute requirements)
- [ ] Attack with monsters (damage calculation correct)
- [ ] Activate spell cards from hand
- [ ] Set trap cards face-down, activate on trigger
- [ ] Win condition: opponent LP reaches 0
- [ ] Turn phases execute in correct order
- [ ] Deterministic: same seed = same shuffle

### Quality Gates (MANDATORY)
- [ ] Tests: 40+ tests, 100% pass rate
- [ ] TypeScript: 0 errors
- [ ] Circular dependencies: 0
- [ ] Build: Success
- [ ] Determinism: Verified with seed values (12345, 67890)
- [ ] Performance: P95 frame time < 16.666ms
- [ ] Patterns: Pure functions, Result<T,E>, no Math.random()

### Test Coverage Requirements
- [ ] DuelSystem: 20+ tests
  - Initialization
  - Card drawing
  - Damage calculation
  - Win conditions
  - Edge cases (empty deck, 0 LP)
- [ ] CardSystem: 15+ tests
  - Card state transitions
  - Summon validation
  - Spell/trap activation
  - Zone management
- [ ] TurnSystem: 10+ tests
  - Phase transitions
  - Turn switching
  - Action validation per phase

---

## 📦 Deliverables

1. **Implementation Files:**
   - `src/systems/DuelSystem.ts`
   - `src/systems/CardSystem.ts`
   - `src/systems/TurnSystem.ts`
   - `src/utils/result-type.ts`
   - `src/utils/deterministic-rng.ts`
   - `src/utils/card-data.ts`

2. **Test Files:**
   - `tests/systems/DuelSystem.test.ts`
   - `tests/systems/CardSystem.test.ts`
   - `tests/systems/TurnSystem.test.ts`

3. **Completion Report:**
   - Use template from CODER_ONBOARDING.md
   - Include self-check results for all quality gates
   - Provide test output, build output, determinism verification

---

## 🎲 Game Rules Reference

### Card Types
```typescript
type CardType = 'Monster' | 'Spell' | 'Trap';

interface MonsterCard {
  id: string;
  name: string;
  type: 'Monster';
  level: number;        // Stars (1-12)
  attack: number;
  defense: number;
  attribute: string;    // DARK, LIGHT, EARTH, etc.
}

interface SpellCard {
  id: string;
  name: string;
  type: 'Spell';
  effect: SpellEffect;
}

interface TrapCard {
  id: string;
  name: string;
  type: 'Trap';
  trigger: TrapTrigger; // e.g., 'on_attack', 'on_summon'
  effect: TrapEffect;
}
```

### Battle Damage Rules
```typescript
// Direct Attack
if (opponent has no monsters) {
  opponentLP -= attackingMonster.attack;
}

// Monster vs Monster (Attack Position)
if (attacker.attack > defender.attack) {
  destroyMonster(defender);
  defenderLP -= (attacker.attack - defender.attack);
} else if (attacker.attack < defender.attack) {
  destroyMonster(attacker);
  attackerLP -= (defender.attack - attacker.attack);
} else {
  destroyMonster(attacker);
  destroyMonster(defender);
  // No damage
}

// Monster vs Monster (Defense Position)
if (attacker.attack > defender.defense) {
  destroyMonster(defender);
  // No damage to players
} else if (attacker.attack < defender.defense) {
  attackerLP -= (defender.defense - attacker.attack);
  // Defender survives
} else {
  // No destruction, no damage
}
```

### Summon Rules
```typescript
// Normal Summon (once per turn)
if (monster.level <= 4) {
  // No tributes required
  summon(monster);
} else if (monster.level <= 6) {
  // Require 1 tribute
  if (tributes.length >= 1) summon(monster);
} else {
  // Require 2 tributes
  if (tributes.length >= 2) summon(monster);
}
```

### Sample Cards (from card-data.ts)
```typescript
// Monsters
{ id: 'm1', name: 'Dark Magician', level: 7, attack: 2500, defense: 2100 }
{ id: 'm2', name: 'Blue-Eyes White Dragon', level: 8, attack: 3000, defense: 2500 }
{ id: 'm3', name: 'Celtic Guardian', level: 4, attack: 1400, defense: 1200 }

// Spells
{ id: 's1', name: 'Dark Hole', effect: 'Destroy all monsters on field' }
{ id: 's2', name: 'Monster Reborn', effect: 'Revive 1 monster from graveyard' }
{ id: 's3', name: 'Pot of Greed', effect: 'Draw 2 cards' }

// Traps
{ id: 't1', name: 'Mirror Force', trigger: 'on_attack', effect: 'Destroy all attacking monsters' }
{ id: 't2', name: 'Trap Hole', trigger: 'on_summon', effect: 'Destroy summoned monster if ATK ≥ 1000' }
{ id: 't3', name: 'Magic Cylinder', trigger: 'on_attack', effect: 'Negate attack and inflict damage' }
```

---

## 🔍 Mandatory Patterns

### 1. Pure Functions
```typescript
// ❌ BAD - Mutates state
function drawCard(player: Player): void {
  player.hand.push(player.deck.pop()!);
}

// ✅ GOOD - Returns new state
function drawCard(player: Player): Result<Player, string> {
  if (player.deck.length === 0) {
    return Err('Deck is empty');
  }
  const [card, ...newDeck] = player.deck;
  return Ok({
    ...player,
    hand: [...player.hand, card],
    deck: newDeck,
  });
}
```

### 2. Result<T,E> Type
```typescript
// ❌ BAD - Throws exceptions
function summonMonster(state: DuelState, cardId: string): DuelState {
  if (!canSummon(state)) throw new Error('Cannot summon');
  // ...
}

// ✅ GOOD - Returns Result
function summonMonster(
  state: DuelState,
  cardId: string
): Result<DuelState, string> {
  if (!canSummon(state)) {
    return Err('Cannot summon: already summoned this turn');
  }
  // ... return Ok(newState)
}
```

### 3. Seeded RNG
```typescript
// ❌ BAD - Non-deterministic
function shuffleDeck(cards: Card[]): Card[] {
  return cards.sort(() => Math.random() - 0.5);
}

// ✅ GOOD - Deterministic with seed
function shuffleDeck(cards: Card[], rng: SeededRNG): Card[] {
  const copy = [...cards];
  for (let i = copy.length - 1; i > 0; i--) {
    const j = rng.nextInt(0, i + 1);
    [copy[i], copy[j]] = [copy[j], copy[i]];
  }
  return copy;
}
```

---

## 📊 Success Metrics

| Metric | Target | Verification |
|--------|--------|--------------|
| Tests | 40+ | Run `npm test` |
| Test Pass Rate | 100% | All green |
| TypeScript Errors | 0 | Run `tsc --noEmit` |
| Circular Deps | 0 | Run `madge --circular src` |
| Build | Success | Run `npm run build` |
| Determinism | Verified | Test with seeds 12345, 67890 |
| Performance | P95 < 16.666ms | Measure 1000 turns |

---

## 🚦 Routing

**On Completion:**
```
CODER:COMPLETION → QA:VERIFY
```

Include completion report with:
- Self-check results (all quality gates)
- Test output (40+ tests, 100% pass)
- Build output (0 errors)
- Determinism verification (screenshots/logs)
- Performance benchmarks

**Next Owner:** QA/Verifier

---

**Ready to begin? Reference CODER_ONBOARDING.md and start with DuelSystem.ts!**
