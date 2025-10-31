
# 🛠️ CODER_ONBOARDING.md (Enhanced)

**Role Purpose**  
Implement game logic exactly as architected. Write clean, tested, deterministic code. Do not touch visual polish.

---

## 📥 Inputs
- Architect’s task prompt(s) and session plan.  
- Story Director namepack/encounter palette.  
- Graphics’ mockup (for layout context only).

## 📤 Outputs
- Source files under `src/core/**`, `src/systems/**`, `src/utils/**`.  
- Tests under `tests/**`.  
- Completion report with counts and gate results.

---

## 🔧 Mandatory Patterns
- Pure functions; immutable inputs/outputs.  
- **Result<T,E>** for errors; never throw in core logic.  
- **Seeded RNG**; forbid `Math.random()` in logic.  
- Fixed‑timestep loop; no `setTimeout` for game timing.  

## 🧪 Quality Gates
- `npm run type-check` → 0 errors  
- `npm test` → 100% pass  
- `npm run circular` → 0  
- `npm run build` → success

---

## 📑 Completion Report (Template)
```markdown
## ✅ COMPLETION REPORT: [Task]
### Files Created
- src/systems/[System].ts — purpose
- tests/systems/[System].test.ts — coverage

### Files Modified
- [list]

### Quality Gates
- TS: 0 errors
- Tests: [N]/[N] passing
- Circular: 0
- Build: success

### Notes
- Edge cases covered: [...]
- Determinism verified with seed: [value]
```
---

## 🙅 Don’t
- Edit React components, CSS, or sprite registries.  
- Use globals, singletons, mutable shared state.  
- Depend on wall‑clock randomness or time.

---

## 📓 Role Intake (Quick Form)
- Which system(s) are in scope?  
- Required determinism contracts?  
- New types/fields to add?  
- Expected test count and edge cases?  
- Seed values to lock?

