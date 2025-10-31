# Graphics Decisions Reference

## Purpose

This document provides **specific numeric values and decision rationales** for graphics polish extracted from real game development sessions (Heli-Attack 2, NextEraGame, Tron, etc.). Use these as starting points, then tune for your specific game.

---

## 1. PARTICLE SYSTEM DECISION TREE

### Particle Count Guidelines

**Decision Process (from Heli-Attack 2):**

```
INITIAL DECISION:
- Started with 25 particles per explosion (looked great!)
- Testing showed: 3+ simultaneous explosions = FPS drops to 40
- Performance target: Maintain 60 FPS

ANALYSIS:
- 3 explosions × 25 particles = 75 particles
- Plus 20 active bullets + 10 enemies = 105 entities
- Particle updates were the bottleneck (O(N) per frame)

REVISED:
- Reduced to 15-20 particles per explosion
- 3 explosions × 20 = 60 particles (acceptable)
- Added HARD CAP: 200 particles total on screen

VALIDATION:
- Tested with 5 simultaneous explosions
- FPS stayed above 55
- Visual quality: Still satisfying (diminishing returns after 15)
```

### Particle Budget by Effect

```javascript
const PARTICLE_COUNTS = {
  // Combat effects
  smallHit: 8,           // Bullet hits enemy
  mediumExplosion: 15,   // Enemy destroyed
  largeExplosion: 20,    // Boss destroyed
  criticalHit: 12,       // Critical damage

  // Environmental
  dustPuff: 5,           // Landing, footstep
  debris: 10,            // Destruction
  sparkle: 8,            // Pickup collected

  // Special effects
  spell: 25,             // Ability activation (worth the cost)
  levelUp: 30,           // Celebration moment

  // CAPS (MANDATORY)
  globalMax: 200,        // Total particles on screen
  perEffect: 30          // Single effect can't exceed this
};
```

**Rationale:**
- **8 particles minimum** - Below this, effect barely visible
- **15-20 particles standard** - Sweet spot for most effects
- **25-30 particles special** - Reserved for important moments
- **200 global cap** - Prevents runaway lag from multiple events

---

## 2. SCREEN SHAKE CALIBRATION

### **REAL Implementation from NextEraGame** ✅

**Actual production code:**

```typescript
const intensityMap = {
  light: 5,      // Small damage (1-50 HP)
  medium: 10,    // Medium damage (51-100 HP)
  heavy: 20,     // High damage (100+ HP)
};

const duration = 300; // Always 300ms - fixed duration
```

**Usage in combat system:**

```typescript
function applyDamage(target: BattleUnit, damage: number) {
  target.health -= damage;

  // Determine shake intensity based on damage
  let shakeIntensity: number;
  if (damage >= 100) {
    shakeIntensity = intensityMap.heavy;   // 20px
  } else if (damage >= 50) {
    shakeIntensity = intensityMap.medium;  // 10px
  } else {
    shakeIntensity = intensityMap.light;   // 5px
  }

  triggerScreenShake(shakeIntensity, 300); // Always 300ms
}
```

**Why These Values (Battle-Tested):**

| Intensity | Pixels | Duration | Damage Range | Use Case |
|-----------|--------|----------|--------------|----------|
| Light | 5px | 300ms | 1-50 HP | Normal attacks, small hits |
| Medium | 10px | 300ms | 51-100 HP | Strong attacks, abilities |
| Heavy | 20px | 300ms | 100+ HP | Critical hits, boss attacks |

**Design Decision: Fixed 300ms Duration**
- **Tested 200ms:** Too quick, felt jarring
- **Tested 300ms:** Perfect for turn-based pacing ✅
- **Tested 400ms:** Too long, nauseating
- **Why fixed?** Simpler implementation, consistent feel, no motion sickness reports

**Key Insight:** Higher intensity pixels (20px vs 5px) combined with fixed duration creates dramatic effect without complexity

---

## 3. ANIMATION TIMING SEQUENCES

### **REAL Combat Timing from NextEraGame** ✅

**Actual production constants:**

```typescript
const TIMING = {
  PSYNERGY_DELAY: 50,        // Delay before psynergy starts
  DAMAGE_DELAY: 300,         // When to show damage numbers
  PSYNERGY_DURATION: 2000,   // Total psynergy animation time
  CLEANUP_BUFFER: 100,       // Extra time before turn ends
};
```

**Complete Combat Sequence:**

```
SPELL CAST TIMELINE (NextEraGame Battle System):

    0ms: ────► User clicks spell button
              └─ Input registered

   50ms: ────► Psynergy sprite animation starts
              ├─ Why 50ms delay? Feels intentional, not robotic
              └─ Immediate start (0ms) felt too harsh

  300ms: ────► IMPACT MOMENT (synchronized)
              ├─ Damage numbers appear
              ├─ Screen shake triggers (20px, 300ms)
              ├─ HP bars animate down
              └─ Flash effect (if critical hit)

 2000ms: ───► Psynergy animation completes
              └─ Full animation duration

 2100ms: ───► Turn ends, next action begins
              └─ 100ms cleanup buffer prevents overlap
```

**Why This Timing Works:**

| Timing | Value | Rationale |
|--------|-------|-----------|
| Psynergy Delay | 50ms | Prevents "robotic" instant start, feels deliberate |
| Damage Delay | 300ms | Synchronize with visual peak of animation |
| Total Duration | 2000ms | Long enough to appreciate, short enough for pacing |
| Cleanup Buffer | 100ms | Prevents awkward overlap between turns |

**Critical Principle:** Damage appears at 300ms (peak), NOT at 0ms!

```typescript
// ❌ BAD - Robotic feel (damage first)
function castSpell() {
  applyDamage();        // Damage appears instantly
  playAnimation();      // Then animation plays
}

// ✅ GOOD - Satisfying feel (animation first)
async function castSpell() {
  await delay(TIMING.PSYNERGY_DELAY);      // 50ms - Start animation
  playPsynergySprite();

  await delay(TIMING.DAMAGE_DELAY - 50);    // Wait until 300ms total
  applyDamage();                            // Damage at peak
  triggerScreenShake(10, 300);
  showDamageNumbers();

  await delay(TIMING.PSYNERGY_DURATION - 300); // Complete animation
  await delay(TIMING.CLEANUP_BUFFER);          // Clean end
}
```

### Additional Timing Standards (from Production)

**From One-Shot Graphics chat:**

```typescript
const TIMINGS = {
  instant: 100,      // Immediate feedback (button press)
  quick: 150,        // Button clicks, fast transitions
  normal: 300,       // Screen transitions, modals
  slow: 500,         // Page transitions
  celebration: 1000, // Victory, level up
};
```

**Usage Guidelines:**
- **100ms (instant):** Button hover states, immediate feedback
- **150ms (quick):** Modal open/close, dropdown menus
- **300ms (normal):** Screen transitions, combat impacts
- **500ms (slow):** Full page navigation
- **1000ms+ (celebration):** Level up, victory screens, important moments

---

## 4. UI/HUD POSITIONING RULES

### Layout Hierarchy (Heli-Attack 2)

```
┌─────────────────────────────────────────────────────┐
│ HEALTH (24px bold)    WAVE (18px)    SCORE (32px)  │ ← Priority 1
│                                                      │
│                                                      │
│                  GAMEPLAY AREA                       │
│            (center 80% of screen)                    │
│                                                      │
│                                                      │
│ WEAPON (18px)                        AMMO (18px)    │ ← Priority 2
└─────────────────────────────────────────────────────┘
```

### Font Size Hierarchy

```javascript
const FONT_SIZES = {
  // Critical (always visible)
  health: 24,          // Must be readable mid-combat
  score: 32,           // Celebration, make it big

  // Important (frequent reference)
  wave: 18,            // Context info
  ammo: 18,            // Glanceable

  // Secondary (occasional reference)
  fps: 14,             // Debug info
  tooltips: 16,        // Help text

  // Damage numbers (floating)
  normalDamage: 18,    // Readable but not huge
  critDamage: 28       // 1.5x larger = critical feel
};
```

### Text Shadow (MANDATORY)

**Problem:** Text invisible on busy backgrounds.

**Solution:**
```css
.hud-text {
  text-shadow: 2px 2px 4px rgba(0,0,0,0.8);
}

/* For light text on light backgrounds */
.hud-text-dark {
  color: white;
  text-shadow:
    2px 2px 4px rgba(0,0,0,0.8),
    -1px -1px 2px rgba(0,0,0,0.6);  /* Extra shadow for readability */
}
```

**Testing Checklist:**
- [ ] Readable on darkest background
- [ ] Readable on lightest background
- [ ] Readable on busiest background (particles, explosions)
- [ ] No flicker or jitter during movement

---

## 5. COLOR SYSTEMS

### **REAL Element Colors from NextEraGame** ✅

**Actual production color palette (from One-Shot Graphics chat):**

```typescript
const COLORS = {
  // Element Colors (Golden Sun JRPG style)
  fire: '#EF4444',      // Mars (red-orange)
  water: '#3B82F6',     // Mercury (blue)
  wind: '#A855F7',      // Jupiter (purple)
  earth: '#22C55E',     // Venus (green)
  light: '#FBBF24',     // Moon (yellow-gold)
  dark: '#7C3AED',      // Sun (deep purple)

  // UI State Colors
  success: '#22C55E',   // Green (actions succeeded)
  warning: '#F59E0B',   // Amber (caution)
  error: '#EF4444',     // Red (failure)
  info: '#3B82F6',      // Blue (information)
};
```

**Usage in game:**
- **Element attacks:** Fire spell uses `#EF4444`, Water spell uses `#3B82F6`
- **Status indicators:** Success messages use `#22C55E`, errors use `#EF4444`
- **Element-based UI:** Highlighting, particle effects, damage numbers

**Why These Values:**
- Based on Golden Sun JRPG aesthetic
- High contrast for readability
- Distinct hues for colorblind accessibility
- Matches TailwindCSS color scale (easy to remember)

### Health Bar Colors (Standard Pattern)

```javascript
function getHealthBarColor(currentHp, maxHp) {
  const percent = currentHp / maxHp;

  if (percent > 0.6) return '#22C55E';  // Green (safe) - matches success color
  if (percent > 0.3) return '#F59E0B';  // Amber (caution) - matches warning color
  return '#EF4444';                      // Red (danger) - matches error color
}
```

**Thresholds:**
- **>60% HP:** Green (safe zone)
- **30-60% HP:** Amber (caution, consider healing)
- **<30% HP:** Red (danger, heal immediately!)

### Damage Number Colors (Suggested Pattern)

**Note:** These are NOT from production code, but recommended based on industry standards.

```javascript
const DAMAGE_COLORS = {
  physical: '#ffff00',     // Yellow (standard damage)
  critical: '#ff0000',     // Red (critical hit, larger font)
  healing: '#00ff00',      // Green (healing)
  poison: '#88ff00',       // Yellow-green (damage over time)
  // Element-specific (could use COLORS from above)
  fire: '#EF4444',         // Mars red
  water: '#3B82F6',        // Mercury blue
  wind: '#A855F7',         // Jupiter purple
  earth: '#22C55E',        // Venus green
};
```

---

## 6. FLASH EFFECT PATTERNS

### Screen Flash Values (NextEraGame)

```javascript
const FLASH_COLORS = {
  damage: 'rgba(255, 0, 0, 0.3)',      // Red, 30% opacity
  heal: 'rgba(0, 255, 0, 0.3)',        // Green, 30%
  critical: 'rgba(255, 0, 255, 0.5)',  // Magenta, 50% (more intense)
  shield: 'rgba(0, 200, 255, 0.3)',    // Cyan, 30%
  death: 'rgba(0, 0, 0, 0.6)'          // Black, 60% (dramatic)
};

const FLASH_DURATION = 150;  // ms - exactly, don't vary

function triggerFlash(type) {
  const overlay = document.createElement('div');
  overlay.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: ${FLASH_COLORS[type]};
    pointer-events: none;
    animation: flash ${FLASH_DURATION}ms ease-out;
  `;

  document.body.appendChild(overlay);
  setTimeout(() => overlay.remove(), FLASH_DURATION);
}
```

**Duration Rationale:**
- **100ms:** Barely visible, easy to miss
- **150ms:** Perfect - noticeable but not annoying
- **200ms:** Starting to feel long
- **300ms:** Annoying, strobe effect

**Opacity Rules:**
- **Standard flash: 30% opacity**
  - Visible but not overwhelming
  - Works on all background colors
- **Critical/important: 50% opacity**
  - More intense for important moments
  - Still safe for photosensitive players
- **NEVER exceed 50% opacity**
  - Seizure risk
  - Disorienting
  - Blocks gameplay view

---

## 7. PERFORMANCE OPTIMIZATION CHECKLIST

### Frame Time Monitoring

```javascript
// Track frame performance
class PerformanceMonitor {
  constructor() {
    this.frameTimeHistory = [];
    this.targetFrameTime = 16.67;  // 60 FPS
  }

  recordFrame(frameTime) {
    this.frameTimeHistory.push(frameTime);

    // Keep last 60 frames (1 second @ 60fps)
    if (this.frameTimeHistory.length > 60) {
      this.frameTimeHistory.shift();
    }

    // Warn if slow
    if (frameTime > this.targetFrameTime) {
      console.warn(`Slow frame: ${frameTime.toFixed(2)}ms`);
    }
  }

  getAverageFrameTime() {
    if (this.frameTimeHistory.length === 0) return 0;
    const sum = this.frameTimeHistory.reduce((a, b) => a + b, 0);
    return sum / this.frameTimeHistory.length;
  }

  getCurrentFPS() {
    const avg = this.getAverageFrameTime();
    return avg > 0 ? 1000 / avg : 0;
  }
}

// Usage in game loop
const perfMonitor = new PerformanceMonitor();

function gameLoop() {
  const frameStart = performance.now();

  // ... game logic ...

  const frameTime = performance.now() - frameStart;
  perfMonitor.recordFrame(frameTime);

  requestAnimationFrame(gameLoop);
}
```

### Entity Caps (MANDATORY)

```javascript
const ENTITY_CAPS = {
  // Combat
  playerBullets: 100,     // Rapid fire can spawn many
  enemyBullets: 50,       // Fewer enemies = fewer bullets
  enemies: 20,            // Too many = overwhelming + lag

  // Effects (MOST IMPORTANT)
  particles: 200,         // Biggest performance cost
  damageNumbers: 30,      // Text rendering is expensive

  // Pickups
  drops: 20,              // Items on ground

  // UI
  notifications: 5        // Toast messages
};

function spawnParticle(particle) {
  if (particles.length >= ENTITY_CAPS.particles) {
    // Remove oldest particle
    particles.shift();
  }
  particles.push(particle);
}
```

**Why These Caps:**
- **Bullets (100/50):** Tested with rapid-fire weapons, 100 is safe
- **Enemies (20):** Above 20 = screen too crowded + FPS drop
- **Particles (200):** Tested with 5 simultaneous explosions, 200 is limit
- **Damage numbers (30):** More than 30 = unreadable anyway

### Culling Distance

```javascript
// Remove entities off-screen
const CULL_MARGIN = 100;  // pixels beyond screen

function cullOffscreenEntities(entities, camera) {
  return entities.filter(entity => {
    const inBoundsX = entity.x > camera.x - CULL_MARGIN &&
                      entity.x < camera.x + camera.width + CULL_MARGIN;
    const inBoundsY = entity.y > camera.y - CULL_MARGIN &&
                      entity.y < camera.y + camera.height + CULL_MARGIN;

    return inBoundsX && inBoundsY;
  });
}
```

**Culling Aggressiveness:**
- **Standard (100px margin):** Safe, entities don't pop in
- **Aggressive (at screen edge):** Better performance, slight pop-in
- **Very aggressive (inside screen):** Only for extreme lag

### Skip Rendering Threshold

```javascript
// Don't render nearly-invisible particles
function renderParticle(particle, ctx) {
  if (particle.alpha < 0.05) return;  // Skip if <5% opacity

  ctx.globalAlpha = particle.alpha;
  // ... render particle ...
}
```

**Performance Gain:**
- Skipping <5% opacity particles: ~10-15% FPS boost
- Players can't see them anyway
- Particles still update (for smooth transitions)

---

## 8. DAMAGE NUMBER PATTERNS

### Floating Damage Numbers (NextEraGame)

```javascript
class DamageNumber {
  constructor(damage, x, y, isCritical = false) {
    this.damage = damage;
    this.x = x;
    this.y = y;
    this.startY = y - 20;              // Start 20px above unit
    this.floatDistance = 60;           // Float up 60px total
    this.duration = 1500;              // 1.5 seconds total
    this.elapsed = 0;
    this.isCritical = isCritical;

    // Randomize horizontal slightly
    this.offsetX = (Math.random() - 0.5) * 20;  // ±10px
  }

  update(dt) {
    this.elapsed += dt;
    const progress = this.elapsed / this.duration;

    // Ease-out curve (fast start, slow end)
    const eased = 1 - Math.pow(1 - progress, 3);

    this.y = this.startY - (this.floatDistance * eased);
    this.alpha = 1 - progress;  // Fade linearly
  }

  render(ctx) {
    ctx.save();
    ctx.globalAlpha = this.alpha;
    ctx.font = this.isCritical ? 'bold 28px Arial' : 'bold 18px Arial';
    ctx.fillStyle = this.isCritical ? '#ff00ff' : '#ff0000';
    ctx.textAlign = 'center';

    // Outline for readability
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(this.damage.toString(), this.x + this.offsetX, this.y);
    ctx.fillText(this.damage.toString(), this.x + this.offsetX, this.y);

    ctx.restore();
  }

  isDead() {
    return this.elapsed >= this.duration;
  }
}
```

### Size Scaling

```javascript
const DAMAGE_NUMBER_SIZES = {
  normal: 18,      // Standard hit
  critical: 28,    // 1.5x larger (very noticeable)
  healing: 18,     // Same as normal
  miss: 16,        // Slightly smaller (less important)
  blocked: 16      // Slightly smaller
};
```

### Multiple Simultaneous

```javascript
// Offset overlapping damage numbers
class DamageNumberManager {
  constructor() {
    this.activeNumbers = [];
    this.stackOffset = 10;  // px horizontal offset per number
  }

  spawn(damage, x, y, isCritical) {
    // Find how many active at this position
    const nearby = this.activeNumbers.filter(n =>
      Math.abs(n.x - x) < 20 && Math.abs(n.startY - y) < 20
    );

    // Offset new number
    const offsetX = nearby.length * this.stackOffset;

    const number = new DamageNumber(damage, x + offsetX, y, isCritical);
    this.activeNumbers.push(number);

    // Stagger start by 50ms
    number.elapsed = nearby.length * -50;  // Negative = delay start

    // Cap at 10 visible
    if (this.activeNumbers.length > 10) {
      this.activeNumbers.shift();
    }
  }
}
```

---

## 9. CONTRAST & READABILITY FIXES

### Problem: Bright Backgrounds

**Issue:** Text unreadable on bright battle backgrounds (sky, snow, etc.)

### Solution 1: Darken Background

```css
.battle-background {
  filter: brightness(0.8);  /* Darken by 20% */
}

/* More aggressive */
.battle-background-aggressive {
  filter: brightness(0.6) contrast(1.1);
}
```

**Trade-off:**
- ✅ Text more readable
- ❌ Background less vibrant
- **Use when:** Readability > aesthetics

### Solution 2: Gradient Overlay

```css
.text-container {
  background: linear-gradient(
    to top,
    rgba(0,0,0,0.4),   /* Dark at bottom (where text is) */
    rgba(0,0,0,0.1),   /* Lighter in middle */
    transparent        /* Clear at top (sky) */
  );
}
```

**Trade-off:**
- ✅ Maintains background brightness
- ✅ Gradual transition feels natural
- ❌ More complex CSS
- **Use when:** Aesthetics matter

### Solution 3: Text Backdrop

```css
.hud-text {
  background: rgba(0,0,0,0.6);  /* Semi-transparent black */
  padding: 4px 8px;
  border-radius: 4px;
}
```

**Trade-off:**
- ✅ Best readability
- ✅ Works on any background
- ❌ Feels "boxier"
- **Use when:** WCAG compliance required

### WCAG 2.1 AA Compliance

```javascript
// Contrast ratio checker
function getContrastRatio(color1, color2) {
  const L1 = getLuminance(color1);
  const L2 = getLuminance(color2);

  const lighter = Math.max(L1, L2);
  const darker = Math.min(L1, L2);

  return (lighter + 0.05) / (darker + 0.05);
}

// WCAG AA requirements:
const WCAG_AA = {
  normalText: 4.5,   // 16px and below
  largeText: 3.0     // 18px+ or 14px+ bold
};

// Usage:
const ratio = getContrastRatio('#ffffff', '#ff0000');
if (ratio < WCAG_AA.normalText) {
  console.warn('Text fails WCAG AA contrast!');
}
```

---

## 10. GRAPHICS TASK RISK ASSESSMENT

### Difficulty Matrix

| Risk Level | Success Rate | Examples | Time Estimate |
|------------|--------------|----------|---------------|
| **LOW** | 90% | CSS polish, text changes, colors | 10-20 min |
| **MEDIUM** | 70% | Sprite integration, simple animations | 30-60 min |
| **HIGH** | 50% | Complex sprite systems, particle effects | 1-2 hours |
| **VERY HIGH** | 30% | WebGL, shaders, procedural generation | 2-4 hours |

### Low Risk Tasks (90% Success)

```markdown
✅ Pure CSS polish
  - Shadows, gradients, colors
  - Border radius, spacing
  - Hover effects, transitions

✅ Text changes
  - Size, weight, color
  - Positioning, alignment
  - Font family swaps

✅ Color scheme updates
  - Theme colors
  - Button colors
  - Background gradients

✅ Icon swaps
  - Same format (SVG → SVG)
  - Same dimensions
  - No animation changes
```

### Medium Risk Tasks (70% Success)

```markdown
⚠️ Sprite integration
  - IF sprites are organized
  - IF paths are documented
  - IF dimensions are consistent

⚠️ Simple animations
  - Fade in/out
  - Slide left/right
  - Scale up/down

⚠️ Background replacements
  - Static images only
  - No layering complexity
  - Tested dimensions

⚠️ Font changes
  - Web-safe fonts
  - OR @font-face with fallbacks
  - Test on all platforms
```

### High Risk Tasks (50% Success)

```markdown
🔴 Complex sprite systems
  - Multiple formats (GIF + PNG + SVG)
  - Dynamic sizing
  - State-based rendering

🔴 Particle systems from scratch
  - Physics calculations
  - Performance tuning
  - Object pooling required

🔴 Advanced animations
  - Multi-step sequences
  - Synchronized timing
  - State machine integration

🔴 Performance-critical effects
  - Real-time updates
  - 60 FPS required
  - Many simultaneous instances
```

### Very High Risk Tasks (30% Success)

```markdown
❌ WebGL/3D graphics
❌ Custom shaders
❌ Complex physics-based effects
❌ Real-time procedural generation
❌ Multi-platform sprite integration (web + mobile + desktop)

**Mitigation:** Break into smaller tasks, or avoid entirely
```

---

## 11. GRAPHICS SESSION STRUCTURE

### Session Template (NextEraGame)

```markdown
# Graphics Session: [Feature Name]

## PHASE 1: Asset Inventory (5-10 min)

**Tasks:**
- [ ] List all sprites in `/public/sprites/`
- [ ] Verify file paths work (test 5 random sprites)
- [ ] Check sprite dimensions (consistent?)
- [ ] Document naming patterns

**Output:** Sprite manifest document

---

## PHASE 2: Single Component Test (10-15 min)

**Tasks:**
- [ ] Pick ONE component to enhance (lowest risk)
- [ ] Implement fully
- [ ] Screenshot before/after
- [ ] Verify no breakage (test all screens)

**Output:** Working proof-of-concept

---

## PHASE 3: Expand to Related (15-20 min)

**Tasks:**
- [ ] Identify similar components
- [ ] Apply same pattern to each
- [ ] Maintain consistency (spacing, colors, sizes)
- [ ] Test each addition individually

**Output:** Consistent visual system

---

## PHASE 4: Integration Testing (10 min)

**Tasks:**
- [ ] Test on desktop (Chrome, Firefox)
- [ ] Test on mobile (if applicable)
- [ ] Check all game screens
- [ ] Verify no 404s (check console)
- [ ] Verify no layout breaks

**Output:** QA report with screenshots

---

## PHASE 5: Polish Pass (10 min)

**Tasks:**
- [ ] Adjust spacing (visual balance)
- [ ] Fine-tune colors (contrast check)
- [ ] Verify all text readable
- [ ] Add missing shadows/outlines
- [ ] Final screenshots

**Output:** Production-ready visuals

---

**TOTAL:** 50-75 minutes per session
```

---

## 12. SPRITE INTEGRATION (Real Production Data)

### NextEraGame Sprite Library Stats

**Library Size (Golden Sun Collection):**
- **2,500+ total sprites**
- **8+ party characters** with weapon variants
- **100+ enemies**
- **20+ bosses**
- Organized in `/public/sprites/golden-sun/` directory

### Successful One-Shot Integration (35 minutes)

**Task:** Integrate 12 party characters with dual-path system

**Process that worked:**
1. **Verify assets exist first** - `ls public/sprites/...` before coding
2. **Create dual-path system** - GS mode + Simple fallback
3. **Map units to sprites** - `UNIT_TO_GS_CHARACTER` registry
4. **Test immediately** - Check console after each change
5. **Fix errors before proceeding** - No "fix it all at the end"

### Sprite Path Conventions (Critical!)

**Party Sprites (Case-Sensitive):**

```typescript
// ✅ CORRECT path structure
/sprites/golden-sun/battle/party/isaac/Isaac_lSword_Front.gif
/sprites/golden-sun/battle/party/garet/Garet_Axe_Front.gif

// ❌ WRONG - Folder case mismatch
/sprites/golden-sun/battle/party/Isaac/isaac_lSword_Front.gif  // Folder should be lowercase

// ❌ WRONG - Filename case mismatch
/sprites/golden-sun/battle/party/jenna_gs2/jenna_lBlade_Front.gif  // Filename should be PascalCase
```

**Enemy Sprites (PascalCase + Underscores):**

```typescript
// ✅ CORRECT
/sprites/golden-sun/battle/enemies/Undead.gif
/sprites/golden-sun/battle/enemies/Grand_Chimera.gif  // Underscore for spaces

// ❌ WRONG - Lowercase
/sprites/golden-sun/battle/enemies/undead.gif  // Should be PascalCase

// ❌ WRONG - Space instead of underscore
/sprites/golden-sun/battle/enemies/Grand Chimera.gif  // Space not allowed
```

**Why This Matters:**
- Linux servers are case-sensitive (Windows is not)
- Works locally on Windows, breaks in production on Linux
- 404 errors with no obvious cause
- Always test on case-sensitive filesystems before deploying

### Actual Registry Implementation

```typescript
// From NextEraGame production code
export const UNIT_TO_GS_CHARACTER: Record<string, CharacterSpriteMapping> = {
  'Warrior': { gsCharacter: 'isaac', defaultWeapon: 'lSword' },
  'Guardian': { gsCharacter: 'garet', defaultWeapon: 'Axe' },
  'Ranger': { gsCharacter: 'ivan', defaultWeapon: 'lSword' },
  'Mage': { gsCharacter: 'mia', defaultWeapon: 'Staff' },
  'Rogue': { gsCharacter: 'jenna_gs2', defaultWeapon: 'lBlade' },
  'Cleric': { gsCharacter: 'sheba_gs2', defaultWeapon: 'Staff' },
  'Paladin': { gsCharacter: 'felix_gs2', defaultWeapon: 'lSword' },
  'Berserker': { gsCharacter: 'piers_gs2', defaultWeapon: 'Trident' },
  // ... 12 total mappings
};

export const ENEMY_SPRITE_MAP: Record<string, string> = {
  'Skeleton Warrior': 'Undead',
  'Zombie Brute': 'Ghoul',
  'Dark Mage': 'Ghost_Mage',
  'Shadow Beast': 'Chimera',
  // ... 19 total mappings
};
```

### Dual-Path Asset System

**Why:** Legal compliance - Golden Sun sprites are copyrighted

```typescript
const USE_GS_SPRITES = import.meta.env.VITE_USE_GS_SPRITES === 'true';

function getSpritePath(character: string, weapon: string): string {
  if (USE_GS_SPRITES) {
    return `/sprites/golden-sun/battle/party/${character}/${character}_${weapon}_Front.gif`;
  } else {
    return `/sprites/party/${character}-simple.png`;  // CC-licensed fallback
  }
}
```

**Fallback chain:**
1. Try Golden Sun sprite (if enabled)
2. Fall back to CC-licensed sprite
3. Fall back to colored square placeholder

---

## 13. GRAPHICS TASK FAILURES (Real Mistakes)

### Common Failure Patterns from NextEraGame

**From Graphics Assessment & One-Shot Graphics chats:**

#### 1. Wrong Branch ❌

```bash
# Mistake: Started work on main instead of feature branch
$ git branch --show-current
main  # ← OH NO!

# Result: Overwrote prior work, created merge conflicts
```

**Fix:** Always verify branch FIRST before any coding
```bash
git branch --show-current
git checkout feature/graphics-polish
git status  # Verify clean state
```

#### 2. Missing Context ❌

```
Graphics AI: "I'll add all 12 character sprites!"
[Adds sprites that were already added in prior session]
Result: Duplicate mappings, registry conflicts
```

**Fix:** Read existing code first
```bash
cat src/data/spriteRegistry.ts | grep "UNIT_TO_GS"
# Verify what exists before adding
```

#### 3. Path Case Sensitivity ❌

```typescript
// Worked locally (Windows)
const path = '/sprites/golden-sun/battle/party/Isaac/isaac_lSword.gif';

// Broke in production (Linux)
// 404 - folder is 'isaac' not 'Isaac'
```

**Fix:** Use lowercase folder names, PascalCase filenames
```bash
# Test on Linux or use Docker
ls -la public/sprites/golden-sun/battle/party/isaac/
```

#### 4. CSS Overwriting ❌

```
Session 1: Added sprite positioning CSS
Session 2: Overwrote entire CSS file (lost Session 1 styles)
Result: Sprites positioned wrong again
```

**Fix:** Read file before editing, use targeted edits
```typescript
// Don't replace entire file
// Use Edit tool with specific old_string/new_string
```

#### 5. Sprite Registry Duplication ❌

```typescript
// Session 1 added:
export const UNIT_TO_GS_CHARACTER = { ... }

// Session 2 tried to add again:
export const UNIT_TO_GS_CHARACTER = { ... }  // Error!
```

**Fix:** Check for existence first
```bash
grep "UNIT_TO_GS_CHARACTER" src/data/spriteRegistry.ts
# Only add if doesn't exist
```

### Why Graphics is "Finicky"

**Root causes identified:**

1. **Asset paths are case-sensitive** (Windows hides this issue)
2. **Sprite naming conventions vary** (isaac vs Isaac, lSword vs l_Sword)
3. **Multiple systems confused** (party sprites vs enemy sprites vs effects)
4. **UI integration breaks layouts** (CSS conflicts, z-index issues)
5. **No visual feedback until complete** (can't "test as you go" easily)
6. **Docs encouraged "mega-tasks"** - Integrate everything at once instead of incremental testing

**Solution:** Break graphics work into tiny, testable chunks (5-10 min each)

---

## 14. SPRITE INTEGRATION ANTI-PATTERNS

### What NOT to Do (NextEraGame Lessons)

```markdown
## ❌ DON'T: Replace entire sprite system at once

**Why:** If anything breaks, you can't isolate the cause

**Instead:** Add sprites incrementally, one system at a time
- Day 1: Player sprites
- Day 2: Enemy sprites
- Day 3: Effect sprites

---

## ❌ DON'T: Change sprite paths without verification

**Why:** Typos cause 404s, hard to debug visually

**Instead:** Test each path immediately
```javascript
// Good pattern
const spritePath = '/sprites/player.png';
const img = new Image();
img.onerror = () => console.error(`Failed to load: ${spritePath}`);
img.src = spritePath;
```

---

## ❌ DON'T: Mix sprite formats (GIF + PNG + SVG)

**Why:** Different formats have different loading characteristics

**Instead:** Standardize on one format per system
- Characters: GIF (animated)
- UI: SVG (scalable)
- Backgrounds: PNG (static)

---

## ❌ DON'T: Hard-code sprite dimensions

**Why:** Breaks when sprite size changes

**Instead:** Use sprite metadata or config
```javascript
const SPRITE_CONFIG = {
  player: { width: 32, height: 32, frames: 4 },
  enemy: { width: 48, height: 48, frames: 2 }
};
```

---

## ❌ DON'T: Integrate sprites without fallbacks

**Why:** Broken images ruin UX

**Instead:** Keep placeholder until sprite loads
```javascript
<img
  src={spritePath}
  onLoad={() => setLoaded(true)}
  onError={() => setUseFallback(true)}
  style={{ opacity: loaded ? 1 : 0 }}
/>
{!loaded && <div className="placeholder" />}
```

---

## ❌ DON'T: Modify game logic during graphics tasks

**Why:** Graphics AI should never touch battle systems, collision, etc.

**Instead:** Graphics AI touches ONLY:
- src/components/
- src/styles/
- public/sprites/
- CSS files

---

## ❌ DON'T: Add sprites without mobile testing

**Why:** Sprites may be too large, too small, or misaligned on mobile

**Instead:** Test on mobile before marking complete
- Desktop: 1920x1080 test
- Mobile: 375x667 test (iPhone SE size)
```

---

## 13. REAL PROJECT METRICS

### Heli-Attack 2 (SIMPLE, 7 hours)

```javascript
const HELI_ATTACK_METRICS = {
  // Particles
  particleBudget: 200,              // Global max
  explosionParticles: 15,           // Down from 25 after testing

  // Screen shake
  shakePixels: [3, 5, 8],          // Light, medium, heavy
  shakeDuration: [150, 200, 250],   // ms

  // Performance
  targetFPS: 60,
  frameTimeBudget: 16.67,           // ms
  worstCase: 5,                     // Simultaneous explosions tested

  // Entity caps
  bullets: 100,
  enemies: 20,
  particles: 200
};
```

### NextEraGame (SUPER-ENTERPRISE, 30-40 hours)

```javascript
const NEXTERA_METRICS = {
  // Sprites
  spriteCount: 2500,                // Total sprites available
  spritesUsed: 45,                  // Actually integrated
  spriteFormat: 'GIF',              // Animated

  // Animation timing
  buttonDelay: 50,                  // ms before animation starts
  impactMoment: 300,                // ms when damage applies
  animationDuration: 2000,          // ms total
  turnBuffer: 100,                  // ms between turns

  // Damage numbers
  damageLifespan: 1500,             // ms
  criticalSize: 28,                 // px (1.5x normal)
  normalSize: 18,                   // px

  // Flash effects
  flashDuration: 150,               // ms exactly
  flashOpacity: 0.3,                // 30% standard, 50% critical

  // Quality
  testPassRate: 0.996,              // 1029/1033
  visualScore: 9.8                  // Out of 10
};
```

### Tron (SIMPLE, 5-7 hours)

```javascript
const TRON_METRICS = {
  // Trails
  trailLength: 30,                  // Segments
  trailFadeRate: 0.98,              // Opacity multiplier per frame

  // Glow effect
  glowBlur: 10,                     // px
  glowColor: '#00ffff',             // Cyan

  // Grid
  gridSize: 10,                     // px per cell
  gridOpacity: 0.2,                 // Subtle

  // Performance
  targetFPS: 60,
  particleCount: 0                  // None (trails only)
};
```

---

## QUICK REFERENCE CHEAT SHEET

### Particles
- Small hit: 8
- Standard explosion: 15-20
- Special effect: 25-30
- Global cap: 200

### Screen Shake
- Light: 3-5px, 150ms
- Medium: 5-7px, 200ms
- Heavy: 8-10px, 250ms

### Animation
- Button press: 50ms
- Damage flash: 150ms
- Attack: 300-600ms
- Spell: 2000ms

### Text Sizes
- Health: 24px
- Score: 32px
- UI labels: 18px
- Damage numbers: 18px (normal), 28px (critical)

### Colors
- Fire: yellow → orange → red
- Energy: cyan → blue → deep blue
- Healing: bright green → pale green
- Damage: red (physical), magenta (critical)

### Performance
- Target FPS: 60
- Frame budget: 16.67ms
- Entity caps: 20 enemies, 100 bullets, 200 particles
- Cull margin: 100px off-screen

---

**Use these values as starting points, then tune for your specific game based on playtesting!**
