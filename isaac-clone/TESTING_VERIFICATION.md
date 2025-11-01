# Manual Testing Verification Guide

## Critical Bugs Fixed

### Bug #1: Player Could Not Exit Start Room
**Problem:** Door trigger zones were mathematically unreachable
- Player movement clamped to: x (66-734), y (66-534)
- Door triggers required: x (<60 or >740), y (<60 or >540)
- **Result:** Player literally could not trigger any door

**Fix:** Adjusted door trigger zones to reachable positions
- North door: y < 80 (was 60)
- South door: y > 520 (was 540)
- West door: x < 80 (was 60)
- East door: x > 720 (was 740)

### Bug #2: No Resources to Test Mechanics
**Problem:** Player started with 0 keys, 0 bombs, 0 coins
- Could not test bomb mechanics
- Could not test locked door mechanics
- Nothing to interact with in start room

**Fix:** Player now starts with:
- 2 Keys (to test locked doors)
- 3 Bombs (to test bomb mechanics)
- 5 Coins (for future shop mechanics)

### Bug #3: No Pickups in Normal Rooms
**Problem:** Only treasure rooms had pickups
- Limited ability to collect resources
- Made game progression difficult

**Fix:** Normal rooms now have 60% chance to spawn pickups

---

## Manual Testing Checklist

### ✅ 1. Room Transitions
**How to test:**
1. Start game (refresh page)
2. Move to edge of room using WASD keys
3. Walk to any door edge while holding movement key
4. Verify you transition to new room
5. Verify player respawns at center of new room

**Expected:**
- Should be able to move north, south, east, or west from start room
- Player position resets to center (400, 300) after transition
- Room type shown in status panel should change

**Test all 4 directions from start room**

---

### ✅ 2. Starting Resources
**How to test:**
1. Start game (refresh page)
2. Look at HUD at top of screen

**Expected:**
- 🔑 Keys: 2
- 💣 Bombs: 3
- 💰 Coins: 5
- ♥ Hearts: 3 full hearts (6/6 health)

---

### ✅ 3. Bomb Placement
**How to test:**
1. Start game
2. Press 'E' key to place bomb
3. Observe bomb countdown timer (3, 2, 1)
4. Observe explosion after 3 seconds
5. Check that bomb count decreases in HUD

**Expected:**
- Bomb appears at player position with💣 emoji
- Countdown timer appears above bomb
- After 3 seconds, bomb explodes (💥 animation)
- Bomb count in HUD decreases by 1
- Can place 3 bombs total (starting amount)

---

### ✅ 4. Enemy Combat
**How to test:**
1. Start game
2. Move to adjacent normal room (not shop/treasure)
3. Observe enemies spawn
4. Use arrow keys to shoot tears at enemies
5. Observe enemies take damage and eventually die

**Expected:**
- Enemies appear in normal rooms (🪰 flies, 🕷️ spiders)
- Health bars appear above enemies
- Tears (projectiles) damage enemies
- Enemies die when health reaches 0
- Doors lock when enemies present
- Doors unlock when all enemies defeated

---

### ✅ 5. Locked Doors & Keys
**How to test:**
1. Start game
2. Move to treasure room or shop room
3. Observe at least one door is locked (red glow)
4. Walk up to locked door and hold movement key
5. Observe key consumption and door unlock
6. Verify key count decreases in HUD

**Expected:**
- Locked doors have visual indicator (red glow via CSS)
- Walking into locked door while holding key consumes 1 key
- Door unlocks and allows passage
- Key count in HUD decreases

**Note:** Treasure room is typically north (room_1_0), Shop is west (room_0_1)

---

### ✅ 6. Pickup Collection
**How to test:**
1. Move to various rooms
2. Look for pickup items on ground
3. Walk over pickups to collect them
4. Verify resources increase in HUD

**Pickup types:**
- ❤️ Heart = +2 health (1 full heart)
- 🔑 Key = +1 key
- 💣 Bomb = +1 bomb
- 💰 Coin = +1 coin

**Expected:**
- Walking over pickup collects it
- Pickup disappears
- Resource count increases immediately
- Health cannot exceed maximum (6)

---

### ✅ 7. Obstacles
**How to test:**
1. Enter normal rooms
2. Observe various obstacles
3. Test collision (cannot walk through most)
4. Test bomb destruction on rocks/poop

**Obstacle types:**
- 🪨 Rock (destructible with bombs)
- ⚡ Spike (damages player on contact)
- 🕳️ Pit (blocks movement)
- 🔥 Fire (damages player on contact)
- 💩 Poop (destructible with bombs)

**Expected:**
- Obstacles block movement
- Hazards (spike, fire) damage player
- Rocks and poop can be destroyed with bombs
- Bomb explosion removes destructible obstacles

---

### ✅ 8. Item Collection
**How to test:**
1. Enter treasure room
2. Collect pedestal item
3. Check stats in HUD

**Item types:**
- ♥️ Health Up = +2 max health
- ⚔️ Damage Up = +20% damage
- 👟 Speed Up = +20% movement speed
- 🔥 Tear Rate Up = +20% fire rate

**Expected:**
- Item appears on pedestal
- Walking over item collects it
- Stats update in HUD
- Permanent stat increase

---

## Test Results Summary

Run through all 8 test categories above and verify each works correctly.

| Test Category | Status | Notes |
|--------------|--------|-------|
| 1. Room Transitions | ⬜ | |
| 2. Starting Resources | ⬜ | |
| 3. Bomb Placement | ⬜ | |
| 4. Enemy Combat | ⬜ | |
| 5. Locked Doors & Keys | ⬜ | |
| 6. Pickup Collection | ⬜ | |
| 7. Obstacles | ⬜ | |
| 8. Item Collection | ⬜ | |

---

## Automated Test Coverage

All automated tests passing: **32/32 tests** ✅

### Test Files:
1. `tests/collision.test.ts` - 3 tests (collision detection)
2. `tests/roomSystem.test.ts` - 5 tests (dungeon generation, room navigation)
3. `tests/playerSystem.test.ts` - 7 tests (player movement, health, stats)
4. `tests/gameEngine.test.ts` - 4 tests (game initialization, updates)
5. `tests/integration.test.ts` - 13 tests (end-to-end gameplay verification)

### Integration Tests Cover:
- ✅ Room transitions between all door directions
- ✅ Enemy spawning in normal rooms
- ✅ Door locking when enemies present
- ✅ Starting resources (keys, bombs, coins)
- ✅ Bomb placement and resource consumption
- ✅ Pickup collection (hearts, keys, bombs, coins)
- ✅ Player movement bounds and door trigger zones
- ✅ Game loop time progression
- ✅ Pause functionality

Run tests with: `npm test`

---

## Known Limitations

1. **Golden key not currently spawnable** - System exists but no spawn logic
2. **Secret rooms not fully implemented** - Generated but may be inaccessible
3. **Shop purchase mechanics not implemented** - Items appear but cannot be purchased
4. **No boss mechanics** - Boss rooms exist but no special boss behavior

---

## Performance Notes

- Game runs at 60 FPS (16.666ms per frame)
- Bundle size: 167.64 KB (53.12 KB gzipped)
- No TypeScript errors
- No console warnings in normal gameplay

---

## Controls Reference

| Key | Action |
|-----|--------|
| W,A,S,D | Move |
| Arrow Keys | Shoot tears |
| E | Place bomb |
| SPACE | Pause/Resume |
| R | Restart game |

---

## Development Server

Server running at: **http://localhost:5173/**

Hot reload enabled - changes to source code will automatically refresh the game.
