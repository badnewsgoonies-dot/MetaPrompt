# Task 6: Verify & Organize NPC Sprites (GRAPHICS)

**ROLE:** Graphics AI
**TYPE:** Sprite Verification
**PRIORITY:** P1 - HIGH
**EST TIME:** 1-2 hours

---

## 📋 Context

- **Project:** Golden Sun - Vale Village NPC Sprites
- **Current State:** 27 NPC sprite files exist in `/public/assets/`
- **Target State:** Verify all 50 NPCs have sprites, organize properly, create registry

---

## 🎯 Objective

Verify all 50 NPCs in sprite_map.json have valid sprite paths. Check for missing sprites. Create NPC sprite registry. Ensure no 404 errors.

---

## 📦 Requirements

### 1. Verify All NPC Sprites Exist

**Action:** Check that all 50 NPCs in sprite_map.json have valid sprites

**NPCs to verify (50 total):**
- Isaac (player)
- Garet, Dora, Elder, Kraden, Kyle, Jenna (major NPCs)
- Great Healer, Aaron, Kay, Innkeeper, Armor Shop Owner (major NPCs)
- Scholar-1, Scholar-2, Villager-1/2/3, Ivan, Mia, Felix, Sheba, Alex, Saturos (story NPCs)
- 27 additional minor NPCs (guards, villagers, farmers, etc.)

**Expected:** All sprites in `/golden-sun/public/assets/` directory

### 2. Check for Missing Sprites

**Action:** Identify any NPCs with missing sprite files or broken paths

### 3. Create NPC Sprite Registry

**File:** `src/data/npcSpriteRegistry.ts` (NEW)

```typescript
export interface NPCSprite {
  id: string;
  name: string;
  path: string;
  role: 'protagonist' | 'major_npc' | 'minor_npc' | 'antagonist';
  element?: 'Venus' | 'Mars' | 'Jupiter' | 'Mercury';
}

export const NPC_SPRITES: Record<string, NPCSprite> = {
  // All 50 NPCs
};
```

### 4. Verify in Browser

**Action:**
1. Run dev server
2. Check browser console for 404 errors
3. Walk through Vale and verify all NPCs display correctly
4. Check that sprite paths are correct

---

## ✅ Acceptance Criteria

- [ ] All 50 NPCs have valid sprite paths in sprite_map.json
- [ ] All sprite files exist in `/public/assets/`
- [ ] NPC sprite registry created
- [ ] Zero 404 errors in browser console
- [ ] All NPCs display correctly in game
- [ ] TypeScript compiles with 0 errors
- [ ] Build succeeds

---

**STATUS:** Ready for Graphics AI execution
**EST TIME:** 1-2 hours (mostly verification)
