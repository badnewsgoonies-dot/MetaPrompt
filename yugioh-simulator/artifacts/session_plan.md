# 🏛️ ARCHITECT SESSION PLAN: Yu-Gi-Oh Card Simulator v1.0.0

**Date:** 2025-10-31
**Session:** 1
**System:** 6-Role CI/CD Pipeline

---

## 📋 Session Overview

**Goal:** Create a functional Yu-Gi-Oh card duel simulator with core mechanics: monster battles, spell/trap cards, life points, and turn-based gameplay.

**Scope:** Simplified ruleset focusing on:
- Monster summoning (normal & tribute summon)
- Direct attacks and monster battles
- Spell card activation (simple effects)
- Trap card setting and activation
- Life point tracking and win conditions

**Out of Scope (v1.0.0):**
- Complex chain resolution
- Fusion/Synchro/XYZ/Link summoning
- Full official ruleset (60+ card types)
- Online multiplayer

---

## 🎯 Measurable Goals

| Metric | Target | Owner |
|--------|--------|-------|
| Tests passing | 100% (40+ tests) | Coder |
| TypeScript errors | 0 | Coder |
| Circular dependencies | 0 | Coder |
| Build status | Success | Coder |
| Determinism | Verified with seeds | Coder |
| Performance | P95 < 16.666ms | Coder |
| Console errors | 0 | Graphics |
| Missing assets | 0 | Graphics |
| WCAG compliance | 2.1 AA | Graphics |
| Animation FPS | 30+ | Graphics |

---

## 📦 Deliverables

### From Coder
1. **Systems:**
   - `DuelSystem.ts` - Core duel logic and state management
   - `CardSystem.ts` - Card definitions and effects
   - `TurnSystem.ts` - Turn flow and phase management

2. **Utils:**
   - `result-type.ts` - Type-safe error handling
   - `deterministic-rng.ts` - Seeded RNG for shuffling
   - `card-data.ts` - Card database

3. **Tests:**
   - `DuelSystem.test.ts` - 20+ tests
   - `CardSystem.test.ts` - 15+ tests
   - `TurnSystem.test.ts` - 10+ tests

4. **Completion Report** - Using template from CODER_ONBOARDING.md

### From Graphics
1. **Phase 1 - Mockup:**
   - `mockups/duel.html` - Duel screen layout
   - `mockups/duel.css` - Styling and card zones
   - `mockups/sprite_placements.json` - Card positions

2. **Phase 2 - Integration:**
   - `components/duel/DuelField.tsx` - Main duel component
   - `components/duel/CardZone.tsx` - Card display zones
   - `components/ui/Card.tsx` - Card visual component
   - `components/ui/LifePoints.tsx` - LP display

3. **Completion Report** - Using template from GRAPHICS_ONBOARDING.md

---

## 🔄 Pipeline Flow

```
ARCHITECT (this plan)
    ↓
CODER (implements logic)
    ↓
CODER:COMPLETION → QA:VERIFY
    ↓
GRAPHICS (creates mockup, then integrates)
    ↓
GRAPHICS:COMPLETION → QA:VERIFY
    ↓
QA:PASS → RELEASE:PACKAGE+PUBLISH
    ↓
RELEASE:DONE → NEXT-TASK
```

---

## 📝 Task Briefs

### Task 1: CODER - Duel System Implementation
**File:** `tasks/T-SYS-duel-system.md`
**Priority:** P0 (Blocking)
**Dependencies:** None
**Routing:** CODER:COMPLETION → QA:VERIFY

### Task 2: GRAPHICS - Duel UI
**File:** `tasks/T-GFX-duel-ui.md`
**Priority:** P1
**Dependencies:** T-SYS-duel-system (for state integration)
**Routing:** GRAPHICS:COMPLETION → QA:VERIFY

---

## ✅ Acceptance Criteria

### Functional Requirements
- [ ] Players can summon monsters (normal and tribute)
- [ ] Monsters can attack directly or battle other monsters
- [ ] Spell cards can be activated from hand
- [ ] Trap cards can be set and activated
- [ ] Life points decrease correctly
- [ ] Win condition triggered at 0 LP
- [ ] Turn phases work correctly (Draw, Main, Battle, End)
- [ ] Deck shuffling is deterministic

### Quality Gates (Coder)
- [ ] 40+ tests, 100% pass rate
- [ ] 0 TypeScript errors
- [ ] 0 circular dependencies
- [ ] Build success
- [ ] Determinism verified
- [ ] P95 frame time < 16.666ms

### Quality Gates (Graphics)
- [ ] 0 console errors
- [ ] 0 missing assets (404s)
- [ ] 30+ FPS animations
- [ ] WCAG 2.1 AA compliant
- [ ] Keyboard navigation functional
- [ ] Text contrast ≥ 4.5:1

---

## 🎲 Game Design Decisions

### Simplified Ruleset
1. **Deck Size:** 20 cards (vs official 40-60)
2. **Hand Size:** 5 card starting hand
3. **Monster Zones:** 3 per player (vs official 5)
4. **Spell/Trap Zones:** 3 per player (vs official 5)
5. **No Extra Deck** (no Fusion/Synchro/XYZ)
6. **Simplified Tributes:** 1 tribute for 5-6★, 2 for 7+★
7. **Battle Damage:** Standard (ATK differences)
8. **No Chain System** (immediate resolution)

### Card Types (v1.0.0)
- **Monster Cards:** Normal monsters with ATK/DEF
- **Spell Cards:** Activate from hand (instant effects)
- **Trap Cards:** Set face-down, activate on trigger

### Sample Card Database
```typescript
// 10 Monsters, 5 Spells, 5 Traps
Monsters:
  - Dark Magician (7★, 2500 ATK, 2100 DEF)
  - Blue-Eyes White Dragon (8★, 3000 ATK, 2500 DEF)
  - Celtic Guardian (4★, 1400 ATK, 1200 DEF)
  - etc.

Spells:
  - Dark Hole (destroy all monsters)
  - Monster Reborn (revive from graveyard)
  - Pot of Greed (draw 2 cards)
  etc.

Traps:
  - Mirror Force (destroy attacking monsters)
  - Trap Hole (destroy summoned monster)
  - Magic Cylinder (reflect attack damage)
  etc.
```

---

## 🚦 Success Metrics

**Definition of Done:**
1. All acceptance criteria checked
2. All quality gates passed
3. QA verification: **PASS**
4. Release packaged with SemVer tag
5. Deployment playable in browser

**Target Timeline:**
- Coder: ~2 hours of AI work
- Graphics: ~1.5 hours (mockup + integration)
- QA: ~30 minutes verification
- Release: ~15 minutes packaging
- **Total:** ~4 hours equivalent

---

## 📄 Next Steps

1. **Coder:** Read `tasks/T-SYS-duel-system.md` and begin implementation
2. **Graphics:** Wait for Coder completion, then read `tasks/T-GFX-duel-ui.md`
3. **QA:** Monitor for completion reports from Coder and Graphics
4. **Release:** Watch for QA: PASS signal

---

**Routing:** ARCHITECT:PLAN-COMPLETE → CODER:START
**Architect:** 🏛️ Session plan approved. Handing off to Coder.
