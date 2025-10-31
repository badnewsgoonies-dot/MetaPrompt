# Game Development Pattern Library

## Purpose

Quick reference for battle-tested patterns extracted from Heli-Attack 2, Tron, and Nightfall Survivors. Copy-paste these patterns when generating onboarding documents.

---

## 1. PERFORMANCE PATTERNS

### Object Pooling (ENTERPRISE)

**When:** 500+ objects spawned/destroyed per second (projectiles, particles)

**Pattern:**
```typescript
// src/util/pool.ts
export interface Pool<T> {
  take(): T | null;
  put(item: T): void;
  size(): number;
  available(): number;
}

export function makePool<T>(
  factory: () => T,
  size: number
): Pool<T> {
  const items: T[] = [];
  for (let i = 0; i < size; i++) {
    items.push(factory());
  }

  let nextIndex = 0;

  return {
    take() {
      if (nextIndex >= items.length) return null;
      return items[nextIndex++];
    },
    put(item: T) {
      if (nextIndex > 0) nextIndex--;
      items[nextIndex] = item;
    },
    size: () => items.length,
    available: () => items.length - nextIndex,
  };
}

// Usage:
const projectilePool = makePool(() => ({
  active: false,
  x: 0, y: 0,
  vx: 0, vy: 0,
  damage: 0,
  ttl: 0
}), 512);

const proj = projectilePool.take();
if (proj) {
  proj.active = true;
  // ... initialize
}

// Later:
proj.active = false;
projectilePool.put(proj);
```

**Numbers:**
- 512 projectiles pool = ~50KB memory
- 256 particles pool = ~25KB memory
- Performance: 1500 projectiles @ 0.013ms P95

---

### Backward Iteration for Safe Removal (ALL)

**When:** Removing items from array during iteration

**Pattern:**
```javascript
// ✅ CORRECT
for (let i = entities.length - 1; i >= 0; i--) {
  const e = entities[i];
  if (e.shouldRemove) {
    entities.splice(i, 1);
  }
}

// ❌ WRONG (skips elements)
for (let i = 0; i < entities.length; i++) {
  if (entities[i].shouldRemove) {
    entities.splice(i, 1); // Breaks iteration!
  }
}
```

---

### Fixed Timestep Loop (ENTERPRISE)

**When:** Need deterministic physics and replay support

**Pattern:**
```typescript
export const STEP_SEC = 1 / 60; // 60 Hz
const MAX_FRAME_DELTA = 0.05; // 50ms max

export function runGameLoop(
  update: (dt: number) => void,
  render: (alpha: number) => void
): void {
  let accumulator = 0;
  let lastTime = performance.now();

  function loop(currentTime: number) {
    let delta = (currentTime - lastTime) / 1000;
    delta = Math.min(delta, MAX_FRAME_DELTA);
    lastTime = currentTime;
    accumulator += delta;

    // Fixed-step updates
    while (accumulator >= STEP_SEC) {
      update(STEP_SEC);
      accumulator -= STEP_SEC;
    }

    // Interpolated rendering
    const alpha = accumulator / STEP_SEC;
    render(alpha);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);
}
```

**Benefits:**
- Physics independent of frame rate
- Perfect determinism for replay
- Smooth rendering with interpolation

---

### Simple Game Loop (SIMPLE/MEDIUM)

**Pattern:**
```javascript
let lastTime = 0;

function gameLoop(currentTime) {
  const dt = Math.min((currentTime - lastTime) / 1000, 0.05);
  lastTime = currentTime;

  update(dt);
  render();

  requestAnimationFrame(gameLoop);
}

requestAnimationFrame(gameLoop);
```

---

## 2. RNG PATTERNS

### Deterministic RNG (ENTERPRISE)

**When:** Need replay, testing, or consistent behavior

**Pattern:**
```typescript
import { xoroshiro128plus } from 'pure-rand';

export type RNG = ReturnType<typeof xoroshiro128plus>;

export function mkRng(seed: number): RNG {
  return xoroshiro128plus(seed);
}

export function nextFloat(rng: RNG): [number, RNG] {
  const [value, nextRng] = rng.next();
  return [value / 0x100000000, nextRng];
}

export function nextRange(rng: RNG, min: number, max: number): [number, RNG] {
  const [value, nextRng] = nextFloat(rng);
  return [min + value * (max - min), nextRng];
}

export function nextInt(rng: RNG, min: number, max: number): [number, RNG] {
  const [value, nextRng] = nextRange(rng, min, max);
  return [Math.floor(value), nextRng];
}

// Threading RNG through functions:
function spawnEnemies(state: GameState): GameState {
  let currentRng = state.rng;

  for (let i = 0; i < count; i++) {
    const [x, rng2] = nextRange(currentRng, 0, 800);
    const [y, rng3] = nextRange(rng2, 0, 600);
    currentRng = rng3;

    enemies.push({ x, y });
  }

  return { ...state, rng: currentRng };
}
```

**ESLint Rules:**
```json
{
  "rules": {
    "no-restricted-globals": ["error", {
      "name": "Math.random",
      "message": "Use deterministic RNG from src/core/rng.ts"
    }]
  }
}
```

---

### Simple RNG (SIMPLE/MEDIUM)

**When:** Determinism not required

**Pattern:**
```javascript
// Direct Math.random() is fine for SIMPLE builds
const angle = Math.random() * Math.PI * 2;
const speed = 2 + Math.random() * 4;
```

---

## 3. MOVEMENT PATTERNS

### 8-Directional with Normalization (ALL)

**Pattern:**
```javascript
function updatePlayer(player, input, dt) {
  const speed = 300; // pixels/sec

  const dx = (input.right ? 1 : 0) - (input.left ? 1 : 0);
  const dy = (input.down ? 1 : 0) - (input.up ? 1 : 0);

  // Normalize diagonal movement (prevent 1.41x speed)
  const mag = Math.sqrt(dx * dx + dy * dy);
  if (mag > 0) {
    player.x += (dx / mag) * speed * dt;
    player.y += (dy / mag) * speed * dt;
  }

  // Clamp to bounds
  player.x = Math.max(0, Math.min(800, player.x));
  player.y = Math.max(0, Math.min(600, player.y));
}
```

**Numbers:**
- Player speed: 250-400 px/sec typical
- Enemy speed: 100-250 px/sec typical
- Fast projectile: 500-800 px/sec
- Slow projectile: 200-400 px/sec

---

### Grid-Based Movement (Tron-style)

**Pattern:**
```javascript
const GRID_SIZE = 10;
const MOVE_SPEED = 5; // cells per second

function updatePlayer(player, input, dt) {
  player.moveTimer -= dt;

  if (player.moveTimer <= 0) {
    player.moveTimer = 1 / MOVE_SPEED;

    // Change direction
    if (input.up && player.dir !== 'down') player.dir = 'up';
    if (input.down && player.dir !== 'up') player.dir = 'down';
    if (input.left && player.dir !== 'right') player.dir = 'left';
    if (input.right && player.dir !== 'left') player.dir = 'right';

    // Move one grid cell
    if (player.dir === 'up') player.y -= GRID_SIZE;
    if (player.dir === 'down') player.y += GRID_SIZE;
    if (player.dir === 'left') player.x -= GRID_SIZE;
    if (player.dir === 'right') player.x += GRID_SIZE;

    // Record trail
    trail.push({ x: player.x, y: player.y });
  }
}
```

---

## 4. SHOOTING PATTERNS

### Cooldown Accumulator (Deterministic)

**Pattern:**
```javascript
const weapon = {
  cooldown: 0.3, // seconds between shots
  cooldownTimer: 0
};

function updateWeapon(weapon, dt, wantsToShoot) {
  weapon.cooldownTimer -= dt;

  if (wantsToShoot && weapon.cooldownTimer <= 0) {
    shoot();
    weapon.cooldownTimer = weapon.cooldown;
  }
}
```

**Numbers:**
- Rapid fire: 0.1-0.15 sec cooldown
- Normal: 0.3-0.5 sec cooldown
- Slow/powerful: 0.8-1.5 sec cooldown

---

### Spread Shooting (Volley)

**Pattern:**
```javascript
function shootVolley(x, y, targetDir, count, spreadDeg) {
  const spreadRad = spreadDeg * Math.PI / 180;
  const baseAngle = Math.atan2(targetDir.y, targetDir.x);

  for (let i = 0; i < count; i++) {
    const offset = (i / (count - 1)) - 0.5; // -0.5 to 0.5
    const angle = baseAngle + offset * spreadRad;

    bullets.push({
      x, y,
      vx: Math.cos(angle) * 500,
      vy: Math.sin(angle) * 500,
      damage: 10
    });
  }
}

// Usage:
shootVolley(player.x, player.y, aimDir, 3, 30); // 3 bullets, 30° spread
```

---

### Projectile Time-to-Live (TTL)

**Pattern:**
```javascript
// SIMPLE (frame-based)
bullet.lifetime = 120; // frames (2 sec @ 60fps)

function updateBullets(bullets) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].lifetime--;
    if (bullets[i].lifetime <= 0) {
      bullets.splice(i, 1);
    }
  }
}

// ENTERPRISE (time-based)
bullet.ttl = 2.0; // seconds

function updateBullets(bullets, dt) {
  for (let i = bullets.length - 1; i >= 0; i--) {
    bullets[i].ttl -= dt;
    if (bullets[i].ttl <= 0) {
      bullets.splice(i, 1);
    }
  }
}
```

**Numbers:**
- Fast projectile: 0.5-1.0 sec TTL
- Normal: 1.5-2.5 sec TTL
- Slow/arc: 3.0-5.0 sec TTL

---

## 5. COLLISION PATTERNS

### Circle-Circle Collision

**Pattern:**
```javascript
function circleCollision(a, b, r1, r2) {
  const dx = a.x - b.x;
  const dy = a.y - b.y;
  const distSq = dx * dx + dy * dy;
  const minDist = r1 + r2;
  return distSq < minDist * minDist; // Skip sqrt for performance
}

// Usage:
if (circleCollision(player, enemy, 20, 15)) {
  // Collision!
}
```

---

### AABB (Rectangle) Collision

**Pattern:**
```javascript
function rectCollision(a, b) {
  return a.x < b.x + b.width &&
         a.x + a.width > b.x &&
         a.y < b.y + b.height &&
         a.y + a.height > b.y;
}
```

---

### Spatial Partitioning (ENTERPRISE, 500+ entities)

**Pattern:**
```typescript
// Simple grid-based spatial hash
const CELL_SIZE = 50;

function hashPos(x: number, y: number): string {
  const cellX = Math.floor(x / CELL_SIZE);
  const cellY = Math.floor(y / CELL_SIZE);
  return `${cellX},${cellY}`;
}

function buildSpatialHash(entities: Entity[]): Map<string, Entity[]> {
  const hash = new Map<string, Entity[]>();

  for (const e of entities) {
    const key = hashPos(e.x, e.y);
    if (!hash.has(key)) hash.set(key, []);
    hash.get(key)!.push(e);
  }

  return hash;
}

function getNearby(x: number, y: number, hash: Map<string, Entity[]>): Entity[] {
  const nearby: Entity[] = [];

  // Check 9 cells (current + 8 neighbors)
  for (let dx = -1; dx <= 1; dx++) {
    for (let dy = -1; dy <= 1; dy++) {
      const cellX = Math.floor(x / CELL_SIZE) + dx;
      const cellY = Math.floor(y / CELL_SIZE) + dy;
      const key = `${cellX},${cellY}`;
      if (hash.has(key)) {
        nearby.push(...hash.get(key)!);
      }
    }
  }

  return nearby;
}
```

---

## 6. PARTICLE PATTERNS

### Simple Explosion Particles

**Pattern:**
```javascript
function spawnExplosion(x, y, count = 15) {
  for (let i = 0; i < count; i++) {
    const angle = Math.random() * Math.PI * 2;
    const speed = 2 + Math.random() * 4;

    particles.push({
      x, y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 30 + Math.random() * 20, // frames
      size: 2 + Math.random() * 3,
      color: `hsl(${30 + Math.random() * 30}, 100%, 50%)` // Orange-red
    });
  }
}

function updateParticles(particles) {
  for (let i = particles.length - 1; i >= 0; i--) {
    const p = particles[i];
    p.x += p.vx;
    p.y += p.vy;
    p.vy += 0.2; // Gravity
    p.vx *= 0.98; // Air resistance
    p.vy *= 0.98;
    p.life--;

    if (p.life <= 0) {
      particles.splice(i, 1);
    }
  }
}

function renderParticles(ctx, particles) {
  for (const p of particles) {
    const alpha = p.life / 50;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = p.color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1.0;
}
```

**Numbers:**
- Death explosion: 15-25 particles
- Hit impact: 5-8 particles
- Pickup: 8-12 particles
- Performance cap: 200 particles (SIMPLE), 1500 particles (ENTERPRISE with pooling)

---

### Typed Particle Systems (ENTERPRISE)

**Pattern:**
```typescript
export type ParticleType = 'death' | 'hit' | 'pickup' | 'levelup';

function getParticleConfig(type: ParticleType) {
  switch (type) {
    case 'death':
      return {
        speed: 100,      // px/sec
        lifetime: 0.6,   // seconds
        size: 4,         // radius
        color: '#ff4444',
        gravity: 200,    // px/sec²
        count: 15
      };
    case 'hit':
      return {
        speed: 60,
        lifetime: 0.3,
        size: 2,
        color: '#ffaa00',
        gravity: 100,
        count: 8
      };
    case 'pickup':
      return {
        speed: 80,
        lifetime: 0.5,
        size: 3,
        color: '#00ff00',
        gravity: -50,    // Floats upward!
        count: 12
      };
    case 'levelup':
      return {
        speed: 120,
        lifetime: 1.0,
        size: 5,
        color: '#ffff00',
        gravity: -30,
        count: 25
      };
  }
}
```

---

## 7. SCREEN SHAKE PATTERNS

### Simple Direct Shake

**Pattern:**
```javascript
let shakeIntensity = 0;
let shakeFrames = 0;

function addScreenShake(intensity, frames) {
  shakeIntensity = Math.max(shakeIntensity, intensity);
  shakeFrames = Math.max(shakeFrames, frames);
}

function updateScreenShake(ctx) {
  if (shakeFrames > 0) {
    shakeFrames--;
    const offsetX = (Math.random() - 0.5) * shakeIntensity * 2;
    const offsetY = (Math.random() - 0.5) * shakeIntensity * 2;
    ctx.save();
    ctx.translate(offsetX, offsetY);
  }
}

function render() {
  ctx.clearRect(0, 0, 800, 600);
  updateScreenShake(ctx);

  // ... draw game ...

  if (shakeFrames > 0) {
    ctx.restore();
  }
}

// Usage:
addScreenShake(3, 5);  // Light (bullet hit)
addScreenShake(8, 10); // Heavy (explosion)
```

**Numbers:**
- Light shake: 3-5px, 5-8 frames
- Medium shake: 5-7px, 8-12 frames
- Heavy shake: 8-10px, 10-15 frames

---

### Trauma-Based Shake (ENTERPRISE)

**Pattern:**
```typescript
const TRAUMA_DECAY_RATE = 1.5; // per second
const MAX_SHAKE_OFFSET = 20; // pixels

export interface ScreenShake {
  trauma: number; // 0.0 to 1.0
  offsetX: number;
  offsetY: number;
}

export function addTrauma(shake: ScreenShake, amount: number): void {
  shake.trauma = Math.min(1.0, shake.trauma + amount);
}

export function updateScreenShake(shake: ScreenShake, dt: number): void {
  shake.trauma = Math.max(0, shake.trauma - TRAUMA_DECAY_RATE * dt);
  const intensity = shake.trauma * shake.trauma; // Squared for drama

  if (intensity > 0) {
    shake.offsetX = (Math.random() * 2 - 1) * MAX_SHAKE_OFFSET * intensity;
    shake.offsetY = (Math.random() * 2 - 1) * MAX_SHAKE_OFFSET * intensity;
  } else {
    shake.offsetX = 0;
    shake.offsetY = 0;
  }
}

// Usage:
addTrauma(shake, 0.2);  // Light
addTrauma(shake, 0.5);  // Medium
addTrauma(shake, 0.8);  // Heavy
```

**Benefits:**
- Multiple shakes accumulate naturally
- Smooth exponential decay
- Squaring creates more dramatic feel

---

## 8. VISUAL STYLE PATTERNS

### Neon/Cyberpunk

**Pattern:**
```javascript
const NEON_COLORS = {
  bg: '#000000',
  player: '#00ffff',    // Cyan
  enemy: '#ff00ff',     // Magenta
  projectile: '#ffff00',// Yellow
  trail: '#00ffff',
  ui: '#0ff'
};

// Glowing effect
ctx.shadowBlur = 10;
ctx.shadowColor = NEON_COLORS.player;
ctx.strokeStyle = NEON_COLORS.player;
ctx.lineWidth = 2;
ctx.stroke();

// Trails
ctx.strokeStyle = NEON_COLORS.trail;
ctx.lineWidth = 4;
ctx.lineCap = 'round';
ctx.lineJoin = 'round';
ctx.beginPath();
for (let i = 0; i < trail.length; i++) {
  if (i === 0) ctx.moveTo(trail[i].x, trail[i].y);
  else ctx.lineTo(trail[i].x, trail[i].y);
}
ctx.stroke();
```

---

### Military/Realistic

**Pattern:**
```javascript
const MILITARY_COLORS = {
  bg: '#1a1a1a',
  player: '#4a7c59',    // Olive
  enemy: '#8b4513',     // Brown
  projectile: '#ffa500',// Orange tracer
  explosion: '#ff4500', // Red-orange
  smoke: 'rgba(80, 80, 80, 0.6)'
};

// Muzzle flash
ctx.fillStyle = 'rgba(255, 200, 0, 0.8)';
ctx.beginPath();
ctx.arc(gun.x, gun.y, 8, 0, Math.PI * 2);
ctx.fill();

// Smoke particles
for (let i = 0; i < 5; i++) {
  particles.push({
    x: explosion.x,
    y: explosion.y,
    vx: (Math.random() - 0.5) * 2,
    vy: -1 - Math.random(),
    life: 60,
    size: 8 + Math.random() * 12,
    color: MILITARY_COLORS.smoke
  });
}
```

---

### Colorful/Cartoony

**Pattern:**
```javascript
const CARTOON_COLORS = {
  bg: '#87CEEB',        // Sky blue
  player: '#FFD700',    // Gold
  enemy: '#FF6347',     // Tomato
  powerup: '#32CD32',   // Lime
  ui: '#000'
};

// Bouncy animation
entity.renderY = entity.y + Math.sin(frame * 0.1) * 5;

// Outlined sprites
ctx.fillStyle = CARTOON_COLORS.player;
ctx.strokeStyle = '#000';
ctx.lineWidth = 3;
ctx.beginPath();
ctx.arc(x, y, 20, 0, Math.PI * 2);
ctx.fill();
ctx.stroke();
```

---

## 9. ANIMATION TIMING

### Standard Timings

**Pattern:**
```javascript
const ANIM_TIMING = {
  INSTANT: 0,           // 0ms - immediate
  QUICK: 100,           // 50-100ms - button press, damage flash
  SNAPPY: 150,          // 150ms - UI transitions
  IMPACT: 250,          // 150-300ms - explosions, screen shake
  SMOOTH: 500,          // 300-600ms - menu transitions
  DRAMATIC: 1000,       // 1-2 sec - level up, victory
};

// Damage flash
if (entity.damageFlash > 0) {
  entity.damageFlash -= dt;
  ctx.fillStyle = '#fff'; // White flash
} else {
  ctx.fillStyle = entity.color;
}

// Usage:
entity.damageFlash = 0.1; // 100ms flash
```

---

### Easing Functions

**Pattern:**
```javascript
// Linear
function easeLinear(t) {
  return t;
}

// Ease out (fast → slow)
function easeOutQuad(t) {
  return 1 - (1 - t) * (1 - t);
}

// Ease in (slow → fast)
function easeInQuad(t) {
  return t * t;
}

// Ease in-out (slow → fast → slow)
function easeInOutQuad(t) {
  return t < 0.5
    ? 2 * t * t
    : 1 - Math.pow(-2 * t + 2, 2) / 2;
}

// Usage:
const progress = elapsed / duration;
const eased = easeOutQuad(progress);
const currentValue = start + (end - start) * eased;
```

---

## 10. UI/HUD PATTERNS

### Corner Layout

**Pattern:**
```javascript
function renderUI(ctx, state) {
  ctx.fillStyle = '#fff';
  ctx.font = '20px monospace';

  // Top-left: Score
  ctx.textAlign = 'left';
  ctx.fillText(`Score: ${state.score}`, 10, 30);
  ctx.fillText(`Wave: ${state.wave}`, 10, 60);

  // Top-right: Time
  ctx.textAlign = 'right';
  const minutes = Math.floor(state.time / 60);
  const seconds = Math.floor(state.time % 60);
  ctx.fillText(`${minutes}:${seconds.toString().padStart(2, '0')}`, 790, 30);

  // Bottom-left: Health bar
  ctx.fillStyle = '#333';
  ctx.fillRect(10, 560, 200, 20);
  ctx.fillStyle = '#0f0';
  ctx.fillRect(10, 560, (state.player.health / state.player.maxHealth) * 200, 20);

  // Bottom-center: Ammo/weapons
  ctx.textAlign = 'center';
  ctx.fillStyle = '#fff';
  ctx.fillText(`Ammo: ${state.ammo}`, 400, 575);
}
```

---

### Floating Damage Numbers

**Pattern:**
```javascript
const damageNumbers = [];

function spawnDamageNumber(x, y, value) {
  damageNumbers.push({
    x, y,
    value,
    life: 60, // frames
    vy: -2    // Float upward
  });
}

function updateDamageNumbers() {
  for (let i = damageNumbers.length - 1; i >= 0; i--) {
    const d = damageNumbers[i];
    d.y += d.vy;
    d.life--;
    if (d.life <= 0) {
      damageNumbers.splice(i, 1);
    }
  }
}

function renderDamageNumbers(ctx) {
  ctx.font = 'bold 16px monospace';
  ctx.textAlign = 'center';

  for (const d of damageNumbers) {
    const alpha = d.life / 60;
    ctx.globalAlpha = alpha;
    ctx.fillStyle = '#ff0';
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(d.value.toString(), d.x, d.y);
    ctx.fillText(d.value.toString(), d.x, d.y);
  }

  ctx.globalAlpha = 1.0;
}

// Usage:
spawnDamageNumber(enemy.x, enemy.y - 20, 25);
```

---

## 11. WAVE/SPAWNING PATTERNS

### Progressive Waves

**Pattern:**
```javascript
const waves = [
  { enemies: 5, spawnRate: 1.0, enemySpeed: 100, enemyHealth: 20 },
  { enemies: 8, spawnRate: 0.8, enemySpeed: 120, enemyHealth: 30 },
  { enemies: 12, spawnRate: 0.6, enemySpeed: 140, enemyHealth: 40 },
  { enemies: 15, spawnRate: 0.5, enemySpeed: 160, enemyHealth: 60 },
  { enemies: 20, spawnRate: 0.4, enemySpeed: 180, enemyHealth: 80 },
];

let currentWave = 0;
let spawnedCount = 0;
let spawnTimer = 0;

function updateWaveSpawning(dt) {
  if (currentWave >= waves.length) return; // All waves complete

  const wave = waves[currentWave];

  if (spawnedCount >= wave.enemies) {
    // Check if wave complete
    if (enemies.length === 0) {
      currentWave++;
      spawnedCount = 0;
      spawnTimer = 0;
    }
    return;
  }

  spawnTimer -= dt;
  if (spawnTimer <= 0) {
    spawnEnemy(wave.enemySpeed, wave.enemyHealth);
    spawnedCount++;
    spawnTimer = wave.spawnRate;
  }
}
```

---

### Random Edge Spawning

**Pattern:**
```javascript
function spawnEnemyAtEdge() {
  const side = Math.floor(Math.random() * 4);
  let x, y;

  const margin = 20;

  switch (side) {
    case 0: // Top
      x = Math.random() * canvas.width;
      y = -margin;
      break;
    case 1: // Right
      x = canvas.width + margin;
      y = Math.random() * canvas.height;
      break;
    case 2: // Bottom
      x = Math.random() * canvas.width;
      y = canvas.height + margin;
      break;
    case 3: // Left
      x = -margin;
      y = Math.random() * canvas.height;
      break;
  }

  return { x, y };
}
```

---

## 12. GAME STATE PATTERNS

### Simple State Machine

**Pattern:**
```javascript
let state = 'menu'; // menu | playing | paused | gameover

function handleInput(e) {
  switch (state) {
    case 'menu':
      if (e.key === 'Enter') {
        initGame();
        state = 'playing';
      }
      break;

    case 'playing':
      if (e.key === 'p') state = 'paused';
      // ... game controls ...
      break;

    case 'paused':
      if (e.key === 'p') state = 'playing';
      if (e.key === 'Escape') state = 'menu';
      break;

    case 'gameover':
      if (e.key === 'r') {
        initGame();
        state = 'playing';
      }
      if (e.key === 'Escape') state = 'menu';
      break;
  }
}

function update(dt) {
  if (state === 'playing') {
    // Update game
  }
}

function render() {
  switch (state) {
    case 'menu': renderMenu(); break;
    case 'playing': renderGame(); break;
    case 'paused': renderGame(); renderPauseOverlay(); break;
    case 'gameover': renderGameOver(); break;
  }
}
```

---

## 13. NUMBERS REFERENCE

### Speed (pixels/second)
- Player: 250-400
- Slow enemy: 100-150
- Fast enemy: 200-300
- Bullet: 500-800
- Slow projectile: 200-400

### Damage
- Weak weapon: 5-10
- Normal weapon: 15-25
- Strong weapon: 40-60
- Player health: 100
- Weak enemy health: 20-30
- Strong enemy health: 80-150

### Cooldowns (seconds)
- Rapid fire: 0.1-0.15
- Normal: 0.3-0.5
- Slow: 0.8-1.5

### Particles
- Hit: 5-8 particles
- Death: 15-25 particles
- Pickup: 8-12 particles
- Level up: 25-40 particles
- Cap (SIMPLE): 200 total
- Cap (ENTERPRISE): 1500+ total

### Screen Shake
- Light: 3-5px, 5-8 frames
- Medium: 5-7px, 8-12 frames
- Heavy: 8-10px, 10-15 frames

### Canvas Sizes
- Small: 640×480
- Medium: 800×600
- Large: 1024×768
- Full HD: 1920×1080

---

## 14. TESTING PATTERNS

### Determinism Test (ENTERPRISE)

**Pattern:**
```typescript
import { describe, it, expect } from 'vitest';

describe('Determinism', () => {
  it('produces identical results with same seed', () => {
    const state1 = initWorld(12345);
    const state2 = initWorld(12345);

    for (let i = 0; i < 100; i++) {
      updateWorld(state1);
      updateWorld(state2);
    }

    expect(state1).toEqual(state2);
  });

  it('produces different results with different seed', () => {
    const state1 = initWorld(12345);
    const state2 = initWorld(54321);

    for (let i = 0; i < 100; i++) {
      updateWorld(state1);
      updateWorld(state2);
    }

    expect(state1).not.toEqual(state2);
  });
});
```

---

### Acceptance Criteria Tests

**Pattern:**
```typescript
describe('Weapon Cooldown', () => {
  it('fires once per cooldown period', () => {
    const weapon = createWeapon({ cooldown: 0.5 });
    const dt = 1 / 60; // 60 FPS
    let fireCount = 0;

    // Simulate 1 second (60 frames)
    for (let i = 0; i < 60; i++) {
      const result = updateWeapon(weapon, dt, true);
      if (result.fired) fireCount++;
    }

    expect(fireCount).toBe(2); // 1 second / 0.5 cooldown = 2 shots
  });
});

describe('Object Pool', () => {
  it('returns null when exhausted', () => {
    const pool = makePool(() => ({ value: 0 }), 5);

    // Take all 5
    for (let i = 0; i < 5; i++) {
      expect(pool.take()).not.toBe(null);
    }

    // 6th should be null
    expect(pool.take()).toBe(null);
  });

  it('reuses returned objects', () => {
    const pool = makePool(() => ({ value: 0 }), 5);

    const obj = pool.take();
    obj.value = 42;
    pool.put(obj);

    const reused = pool.take();
    expect(reused.value).toBe(42);
  });
});
```

---

## USAGE GUIDE

When generating an onboarding document:

1. **Choose rigor level** → determines which patterns to use
2. **Identify primary actions** → selects movement/shooting patterns
3. **Map visual style** → applies color/rendering patterns
4. **List systems** → pulls relevant system patterns
5. **Copy-paste patterns** → customize numbers for the specific game
6. **Include anti-patterns** → warn against common mistakes
7. **Add success criteria** → make patterns testable

Example flow:
- User wants: Neon shooter, SIMPLE rigor, waves
- Use: Simple game loop + 8-dir movement + cooldown shooting + circle collision + neon colors + simple particles + direct screen shake
- Avoid: TypeScript, pooling, deterministic RNG, tests
- Numbers: 300 px/sec player, 0.3 sec cooldown, 15 particles, 8px shake

Done! Copy-paste, tweak numbers, ship.

---

## 15. SUPER-ENTERPRISE PATTERNS (Three-Tier Workflow)

### Session Planning Pattern

**When:** SUPER-ENTERPRISE builds (40-60 prompts, 30-40 hours, 3 AIs)

**Pattern:**
```markdown
# 🗓️ Session [N]: [Goal]

## 🎯 Session Objective
[One sentence goal]

## 📊 Current State
- Test Count: 1034 tests passing
- Coverage: 50%+
- Known Issues: None
- Last Completed: [Prior session work]

## 🎯 Session Goals (Priority Order)
1. **Goal 1** - [Why] - [Est: 1h]
2. **Goal 2** - [Why] - [Est: 1h]
3. **Goal 3** - [Why] - [Est: 1h]

## 📋 Implementation Tasks

### Task 1: [Title] (Coder AI)
- **File(s):** src/systems/X.ts
- **Action:** [Exact specification]
- **Acceptance:** [Measurable criteria]
- **Time:** 30 min

### Task 2: [Title] (Graphics AI)
- **File(s):** src/components/X.tsx
- **Action:** [Visual specification]
- **Acceptance:** [Screenshot evidence]
- **Time:** 30 min

## ✅ Session Success Criteria
- [ ] All goals completed
- [ ] Tests: 100% pass rate
- [ ] TypeScript: 0 errors
- [ ] No regressions

## 🚫 Out of Scope
- [Feature we're NOT doing]
- [Optimization to defer]

## 📊 Expected End State
- Test Count: 1044 tests (+10)
- New Features: [List]
- Ready for: [Next session]
```

**Numbers:**
- Session duration: 2-4 hours
- Tasks per session: 2-6 tasks
- Total sessions: 10-20 sessions
- Session interval: 1-3 days between

---

### Result Type Pattern (Enterprise Error Handling)

**When:** ALL fallible functions in ENTERPRISE/SUPER-ENTERPRISE

**Pattern:**
```typescript
// src/utils/Result.ts
export type Result<T, E> =
  | { ok: true; value: T }
  | { ok: false; error: E };

export function Ok<T>(value: T): Result<T, never> {
  return { ok: true, value };
}

export function Err<E>(error: E): Result<never, E> {
  return { ok: false, error };
}

export function isOk<T, E>(result: Result<T, E>): result is { ok: true; value: T } {
  return result.ok;
}

export function isErr<T, E>(result: Result<T, E>): result is { ok: false; error: E } {
  return !result.ok;
}

// Usage
function loadSave(id: string): Result<SaveData, string> {
  const data = storage.get(id);
  if (!data) return Err('Save not found');
  return Ok(data);
}

const result = loadSave('slot-1');
if (isOk(result)) {
  console.log('Loaded:', result.value);
} else {
  console.log('Error:', result.error);
}
```

**Why This Pattern:**
- Makes errors explicit in type signatures
- Forces error handling at call sites
- No hidden control flow (unlike exceptions)
- Type-safe at compile time

---

### Deterministic RNG Pattern (Replay-Friendly)

**When:** ENTERPRISE/SUPER-ENTERPRISE with determinism requirements

**Pattern:**
```typescript
// src/utils/rng.ts
import { xoroshiro128plus, type RandomGenerator } from 'pure-rand';

export type IRng = RandomGenerator;

export function mkRng(seed: number): IRng {
  return xoroshiro128plus(seed);
}

// Fork RNG per system (prevents state pollution)
export function forkRng(rng: IRng, label: string): IRng {
  const [seed1, nextRng] = rng.next();
  const [seed2, _] = nextRng.next();
  return xoroshiro128plus(seed1 + seed2);
}

// Helper functions
import { uniformIntDistribution, uniformBigIntDistribution } from 'pure-rand';

export function nextInt(rng: IRng, min: number, max: number): [number, IRng] {
  const [value, nextRng] = uniformIntDistribution(min, max)(rng);
  return [value, nextRng];
}

export function nextFloat(rng: IRng): [number, IRng] {
  const [value, nextRng] = rng.next();
  return [value / 0x100000000, nextRng];
}

export function nextRange(rng: IRng, min: number, max: number): [number, IRng] {
  const [value, nextRng] = nextFloat(rng);
  return [min + value * (max - min), nextRng];
}

// Usage: Thread RNG through functions
function generateRewards(
  difficulty: Difficulty,
  rng: IRng
): { rewards: Rewards; rng: IRng } {
  const [dropChance, rng2] = nextFloat(rng);
  const [itemCount, rng3] = nextInt(rng2, 1, 3);

  // ... generate rewards ...

  return { rewards, rng: rng3 };
}
```

**ESLint Rule to Enforce:**
```json
{
  "rules": {
    "no-restricted-globals": ["error", {
      "name": "Math.random",
      "message": "Use deterministic RNG from src/utils/rng.ts"
    }]
  }
}
```

**Numbers:**
- Same seed + same inputs = 100% identical results
- Fork RNG per system (battle, rewards, choices, etc.)
- Test with 100+ iterations to verify determinism

---

### Three-Tier Task Handoff Pattern

**When:** SUPER-ENTERPRISE with Architect/Coder/Graphics separation

**Architect → Coder Handoff:**
```markdown
## 🛠️ TASK FOR CODER AI

**Copy this to Coder chat:**

# Task: Add Critical Hit System

## 📋 Context
- **Project:** NextEraGame (C:\Dev\AiGames\NextEraGame)
- **Pattern:** Pure functions, Result types, deterministic RNG

## 🎯 Objective
Create system that checks for critical hits based on luck stat.

## 📦 Requirements

### 1. Create System File
- **File:** src/systems/CriticalHitSystem.ts (NEW)
- **Function Signature:**
  ```typescript
  export function checkCriticalHit(
    attacker: BattleUnit,
    rng: IRng
  ): Result<{ isCrit: boolean; rng: IRng }, string>
  ```

### 2. Implementation
- Crit chance = attacker.luck / 100
- Use rng.nextFloat() for roll
- Return { isCrit: roll < critChance, rng: nextRng }

### 3. Create Tests
- **File:** tests/systems/CriticalHitSystem.test.ts (NEW)
- **Required Tests:** 10+ tests
  - Happy path (50 luck → 50% crit)
  - Edge cases (0 luck, 100 luck)
  - Determinism (same seed = same result)

## ✅ Acceptance Criteria
- [ ] TypeScript compiles (0 errors)
- [ ] 10+ tests passing
- [ ] Uses deterministic RNG
- [ ] Returns Result type

## ⏱️ Time Estimate
30 minutes

---

**Instructions for Human:**
1. Copy everything above
2. Paste into Coder AI chat
3. Let Coder execute
4. Copy completion report back to Architect
```

**Coder → Architect Report:**
```markdown
## ✅ COMPLETION REPORT: Critical Hit System

### Summary
Created CriticalHitSystem with deterministic crit checking based on luck stat. All tests passing, type-safe, follows project patterns.

### Files Created
- `src/systems/CriticalHitSystem.ts` - Main system with checkCriticalHit()
- `tests/systems/CriticalHitSystem.test.ts` - 12 comprehensive tests

### Quality Gates
- ✅ TypeScript: 0 errors
- ✅ Tests: 12/12 passing (100%)
- ✅ Circular Deps: 0
- ✅ Build: Success

### Test Coverage
- Happy path: 50 luck → 50% crit rate (verified)
- Edge case: 0 luck → 0% crit
- Edge case: 100 luck → 100% crit
- Determinism: Same seed produces same result (100 iterations)
- Error handling: Negative luck returns Err

### Next Steps (Recommended)
- Integrate with BattleSystem (damage calculation)
- Add visual indicator for crits (Graphics AI)

---

**Ready for Architect review.**
```

---

### Quality Gate Enforcement Pattern

**When:** ENTERPRISE/SUPER-ENTERPRISE (mandatory before task completion)

**Coder AI Quality Gates:**
```bash
# Run BEFORE reporting completion
npm run type-check    # MUST: 0 errors
npm test              # MUST: 100% pass rate
npm run circular      # MUST: 0 circular dependencies
npm run build         # MUST: No build errors
```

**Graphics AI Quality Gates:**
```markdown
## Completion Evidence

### Screenshots
- Before: [screenshot URL/path]
- After: [screenshot URL/path]

### Manual Testing
- [ ] Tested on desktop (Chrome/Firefox)
- [ ] Tested on mobile (if applicable)
- [ ] All interactions work
- [ ] Animations smooth (30+ FPS)

### Technical Checks
- [ ] No console errors
- [ ] Assets load correctly (no 404s)
- [ ] Visual quality: 9/10+
- [ ] Matches target aesthetic
```

**Enforcement:**
- If ANY gate fails → Fix before reporting
- NO skipping gates (mandatory)
- Keep iterating until ALL pass

---

### Fixed-Timestep Game Loop (Deterministic Physics)

**When:** ENTERPRISE/SUPER-ENTERPRISE with replay requirements

**Pattern:**
```typescript
// src/core/gameLoop.ts
export const STEP_SEC = 1 / 60; // 60 Hz fixed timestep
const MAX_FRAME_DELTA = 0.05; // 50ms max (prevent spiral of death)

export function runGameLoop(
  update: (dt: number) => void,
  render: (alpha: number) => void
): () => void {
  let accumulator = 0;
  let lastTime = performance.now();
  let running = true;

  function loop(currentTime: number) {
    if (!running) return;

    // Calculate delta (with cap)
    let delta = (currentTime - lastTime) / 1000;
    delta = Math.min(delta, MAX_FRAME_DELTA);
    lastTime = currentTime;
    accumulator += delta;

    // Fixed-step updates (deterministic)
    while (accumulator >= STEP_SEC) {
      update(STEP_SEC);
      accumulator -= STEP_SEC;
    }

    // Interpolated rendering (smooth)
    const alpha = accumulator / STEP_SEC;
    render(alpha);

    requestAnimationFrame(loop);
  }

  requestAnimationFrame(loop);

  // Return stop function
  return () => { running = false; };
}
```

**Benefits:**
- Physics independent of frame rate
- Perfect determinism (same inputs = same outputs)
- Smooth rendering with interpolation
- Handles lag spikes gracefully

**Numbers:**
- Fixed step: 1/60 sec (16.666ms)
- Max delta: 50ms (prevents spiral of death)
- Target FPS: 60
- Accumulator ensures consistency

---

### Fresh Session Protocol Pattern

**When:** Starting NEW CHAT that continues prior work

**Pattern:**
```markdown
## 🔄 Fresh Session Setup (DO THIS FIRST!)

### Step 1: Branch Setup
**CRITICAL: Run these commands BEFORE any code work:**

```bash
# 1. Check current branch
git branch --show-current

# 2. If not on correct branch, switch
git checkout [exact-branch-name]

# 3. Verify branch state
git status

# 4. Pull latest changes
git pull origin [branch-name]
```

### Step 2: Context Validation
**Verify these dependencies exist:**

```bash
# List expected files
ls -la src/systems/CriticalHitSystem.ts
ls -la src/types/game.ts

# Check for expected code patterns
grep "luck: number" src/types/game.ts

# Read key files for context
cat src/systems/BattleSystem.ts | head -50
```

**Checklist:**
- [ ] All expected files exist
- [ ] Key patterns/code present
- [ ] No missing dependencies

### Step 3: Start Implementation
**ONLY NOW can you begin coding!**
```

**Why This Pattern:**
- Prevents duplicate work (files already exist)
- Avoids merge conflicts
- Ensures correct branch
- Validates prior session completed

---

## SUPER-ENTERPRISE Numbers Reference

### Project Scale
- **Lines of Code:** 20,000-50,000+
- **Test Count:** 500-1000+
- **Test Pass Rate:** 99%+ (aim for 100%)
- **Files:** 50-100+ source files
- **Systems:** 10-15 game systems
- **Documentation:** 30+ markdown files

### Development Metrics
- **Total Prompts:** 40-60 (across 3 AIs)
  - Architect: 10-15 prompts (planning)
  - Coder: 25-40 prompts (implementation)
  - Graphics: 5-10 prompts (polish)
- **Total Time:** 30-40 hours AI collaboration
- **Sessions:** 10-20 sessions @ 2-4 hours each
- **vs Solo:** 30-40x faster than traditional solo dev

### Code Quality
- **TypeScript Errors:** 0 (strict mode)
- **Circular Dependencies:** 0
- **Health Score:** 10/10
- **Coverage:** 45-50%+ (excellent for indie game)
- **Build Time:** <10 seconds

### Visual Quality
- **Sprite Count:** 1000-2500+ sprites
- **Animation FPS:** 30+ FPS (smooth)
- **Accessibility:** WCAG 2.1 AA compliant
- **Visual Score:** 9-10/10 (AAA retro quality)

### Architecture
- **Pure Functions:** 95%+ of game logic
- **Result Types:** All fallible operations
- **Deterministic RNG:** 100% of randomness
- **Test Determinism:** Verified with 100+ iterations
- **Object Pooling:** 500-1500+ entities

---

## USAGE GUIDE (Updated for SUPER-ENTERPRISE)

When generating an onboarding document:

1. **Choose rigor level** → determines patterns to use
   - SIMPLE: Direct patterns, no tests
   - MEDIUM: Organized patterns, some tests
   - ENTERPRISE: TypeScript + tests + determinism
   - **SUPER-ENTERPRISE: Three-tier workflow + session plans + 500+ tests**

2. **For SUPER-ENTERPRISE specifically:**
   - Generate THREE onboarding docs (Architect, Coder, Graphics)
   - Include session plan template
   - Include 7 task templates
   - Include quality gates
   - Include handoff protocols
   - Include fresh session protocol

3. **Pattern Selection:**
   - SUPER-ENTERPRISE uses ALL enterprise patterns
   - Plus: Result types, deterministic RNG, fixed timestep, object pooling
   - Plus: Session planning, three-tier handoffs, quality gates

4. **Expected Output:**
   - 3 role-specific onboarding docs
   - Session plan template
   - Task templates (7 types)
   - Quality checklist
   - 20,000-50,000 LOC game over 40-60 prompts

Example flow for SUPER-ENTERPRISE:
- User wants: Turn-based tactical roguelike, Golden Sun aesthetic, 1000+ tests
- Generate: Three onboarding docs + session plan + task templates
- Architect creates session plans → Coder implements systems → Graphics polishes UI
- Result: Production-grade game, 10/10 health score, 30-40 hours
- Numbers: 24,500 LOC, 1029 tests (99.6%), deployed live

Done! Three-tier magic.

---

## 16. GRAPHICS POLISH PATTERNS (Three-Tier Graphics AI)

**Full reference:** See [graphics-decisions-reference.md](graphics-decisions-reference.md) for complete numeric values and decision rationales.

### Particle System Quick Reference

**Particle Counts (Battle-Tested):**
```javascript
const PARTICLE_COUNTS = {
  // Direct hits
  smallHit: 8,              // Bullet hits enemy
  mediumExplosion: 15,      // Enemy destroyed (down from 25 after performance testing)
  largeExplosion: 20,       // Boss destroyed

  // Special effects
  criticalHit: 12,          // Critical damage
  healingEffect: 10,        // Healing ability

  // Global caps
  globalMax: 200,           // Total particles on screen
  poolSize: 256             // Object pool size
};
```

**Performance Rules:**
- Below 8 particles → effect barely visible
- 15-20 particles → sweet spot for most effects
- Above 25 particles → diminishing returns (more lag, little visual gain)
- Monitor frame time → if >16.66ms, reduce particle counts

---

### Screen Shake Calibration (NextEraGame Production Values)

**Intensity Mapping:**
```typescript
const intensityMap = {
  light: 5,      // Small damage (1-50 HP)
  medium: 10,    // Medium damage (51-100 HP)
  heavy: 20,     // High damage (100+ HP)
};

const duration = 300; // Always 300ms - fixed duration

function applyDamage(target: BattleUnit, damage: number) {
  let shakeIntensity: number;
  if (damage >= 100) shakeIntensity = intensityMap.heavy;   // 20px
  else if (damage >= 50) shakeIntensity = intensityMap.medium;  // 10px
  else shakeIntensity = intensityMap.light;   // 5px

  triggerScreenShake(shakeIntensity, 300);
}
```

**Rationale:**
- **5px:** Subtle feedback for normal attacks (1-50 HP)
- **10px:** Noticeable impact for strong attacks (51-100 HP)
- **20px:** Dramatic effect for critical hits (100+ HP)
- **300ms fixed duration:** Tested against 200ms (jarring) and 400ms (nauseating)

---

### Animation Timing Sequences (NextEraGame Production Code)

**Combat Animation (Actual Production Constants):**
```typescript
const TIMING = {
  PSYNERGY_DELAY: 50,        // Delay before psynergy starts
  DAMAGE_DELAY: 300,         // When to show damage numbers
  PSYNERGY_DURATION: 2000,   // Total psynergy animation time
  CLEANUP_BUFFER: 100,       // Extra time before turn ends
};

// Usage in turn-based combat (NextEraGame battle system)
async function castSpell() {
  await delay(TIMING.PSYNERGY_DELAY);           // 50ms - Start animation
  playPsynergySprite();

  await delay(TIMING.DAMAGE_DELAY - 50);         // Wait until 300ms total
  applyDamage();                                 // Damage at peak
  triggerScreenShake(10, 300);                   // 10px, 300ms
  showDamageNumbers();

  await delay(TIMING.PSYNERGY_DURATION - 300);   // Complete animation
  await delay(TIMING.CLEANUP_BUFFER);            // Clean end
}
```

**Timeline:**
- **0ms:** User clicks spell
- **50ms:** Psynergy animation starts (prevents "robotic" instant start)
- **300ms:** Damage numbers + shake + flash (synchronized at peak)
- **2000ms:** Animation complete
- **2100ms:** Turn ends (100ms cleanup buffer)

**Standard Timing Reference (from Production):**
- **100ms:** Instant (button press feedback)
- **150ms:** Quick (button clicks, fast transitions)
- **300ms:** Normal (screen transitions, combat impacts)
- **500ms:** Slow (page transitions)
- **1000ms+:** Celebration (level up, victory)

---

### Color System (NextEraGame Production Palette)

**Element Colors (Actual Production Code):**
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

**Usage:**
- **Element attacks:** Fire spell uses `#EF4444`, Water uses `#3B82F6`
- **Status indicators:** Success messages use `#22C55E`, errors use `#EF4444`
- **Particle effects:** Color-coded by element
- **Damage numbers:** Can use element colors for element-specific damage

**Health Bar Colors:**
```javascript
function getHealthBarColor(currentHp, maxHp) {
  const percent = currentHp / maxHp;
  if (percent > 0.6) return '#22C55E';  // Green (safe)
  if (percent > 0.3) return '#F59E0B';  // Amber (caution)
  return '#EF4444';                      // Red (danger)
}
```

---

### Flash Effect Standards

**Screen Flash (Victory/Level Up):**
```javascript
const FLASH_DURATION = 150; // Exactly 150ms (never longer!)
const FLASH_OPACITY = 0.3;  // 30% white overlay

function triggerScreenFlash() {
  overlay.style.opacity = FLASH_OPACITY;
  setTimeout(() => {
    overlay.style.opacity = 0;
  }, FLASH_DURATION);
}
```

**Damage Flash (Entity Hit):**
```javascript
const DAMAGE_FLASH = {
  duration: 100,        // 100ms flash
  color: '#ffffff',     // White tint
  opacity: 0.5          // 50% white overlay on sprite
};

// Usage
entity.flashTimer = DAMAGE_FLASH.duration;

// In render loop:
if (entity.flashTimer > 0) {
  ctx.globalCompositeOperation = 'lighter';
  ctx.globalAlpha = (entity.flashTimer / DAMAGE_FLASH.duration) * DAMAGE_FLASH.opacity;
  ctx.fillStyle = DAMAGE_FLASH.color;
  ctx.fillRect(entity.x, entity.y, entity.width, entity.height);
  ctx.globalAlpha = 1.0;
  ctx.globalCompositeOperation = 'source-over';
}
```

**Rationale:**
- 150ms flash duration = visible but not jarring
- 30-50% opacity = noticeable without blinding
- Never exceed 200ms or 60% opacity

---

### Performance Optimization Checklist

**Frame Time Monitoring:**
```javascript
let frameTimeSum = 0;
let frameCount = 0;

function measureFrame(callback) {
  const start = performance.now();
  callback();
  const end = performance.now();

  frameTimeSum += (end - start);
  frameCount++;

  if (frameCount >= 60) {
    const avgFrameTime = frameTimeSum / frameCount;
    if (avgFrameTime > 16.66) {
      console.warn('Performance issue:', avgFrameTime.toFixed(2), 'ms/frame');
      // Reduce particle counts, lower entity caps
    }
    frameTimeSum = 0;
    frameCount = 0;
  }
}
```

**Entity Caps:**
```javascript
const ENTITY_CAPS = {
  enemies: 50,          // Max enemies on screen
  projectiles: 150,     // Max player + enemy projectiles
  particles: 200,       // Max total particles (SIMPLE)
  particles_pooled: 1500 // Max with object pooling (ENTERPRISE)
};

// Enforce caps
if (enemies.length >= ENTITY_CAPS.enemies) {
  return; // Don't spawn more
}
```

**Culling (Off-Screen Entities):**
```javascript
const CULL_MARGIN = 50; // pixels outside viewport

function isOnScreen(entity, canvas) {
  return entity.x > -CULL_MARGIN &&
         entity.x < canvas.width + CULL_MARGIN &&
         entity.y > -CULL_MARGIN &&
         entity.y < canvas.height + CULL_MARGIN;
}

// Only render on-screen entities
for (const entity of entities) {
  if (isOnScreen(entity, canvas)) {
    renderEntity(entity);
  }
}
```

---

### Damage Number Positioning

**Floating Damage Numbers:**
```javascript
function spawnDamageNumber(x, y, value, type = 'physical') {
  damageNumbers.push({
    x: x + (Math.random() - 0.5) * 20,  // ±10px horizontal variance
    y: y - 20,                          // Start 20px above entity
    vy: -1.5,                           // Float upward at 1.5 px/frame
    value,
    type,
    life: 60,                           // 60 frames (1 second @ 60fps)
    fontSize: type === 'critical' ? 20 : 16
  });
}

function updateDamageNumbers() {
  for (let i = damageNumbers.length - 1; i >= 0; i--) {
    const d = damageNumbers[i];
    d.y += d.vy;
    d.life--;

    if (d.life <= 0) {
      damageNumbers.splice(i, 1);
    }
  }
}

function renderDamageNumbers(ctx) {
  for (const d of damageNumbers) {
    const alpha = d.life / 60;
    ctx.globalAlpha = alpha;
    ctx.font = `bold ${d.fontSize}px monospace`;
    ctx.textAlign = 'center';
    ctx.fillStyle = DAMAGE_COLORS[d.type];
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 3;
    ctx.strokeText(d.value.toString(), d.x, d.y);
    ctx.fillText(d.value.toString(), d.x, d.y);
  }
  ctx.globalAlpha = 1.0;
}
```

---

### Contrast & Readability (WCAG 2.1 AA)

**Text Contrast Requirements:**
- Normal text (16px+): 4.5:1 contrast ratio minimum
- Large text (24px+): 3:1 contrast ratio minimum
- UI controls: 3:1 contrast ratio minimum

**Common Fixes:**
```javascript
// ❌ BAD: Low contrast
ctx.fillStyle = '#888';  // Gray on dark gray background

// ✅ GOOD: High contrast
ctx.fillStyle = '#fff';  // White on dark background
ctx.strokeStyle = '#000'; // Black outline for extra readability
ctx.lineWidth = 3;
ctx.strokeText(text, x, y);
ctx.fillText(text, x, y);
```

**Dark Mode-Friendly Palette:**
```javascript
const PALETTE = {
  bg: '#0a0a0a',          // Near-black background
  text: '#ffffff',        // White text (21:1 contrast)
  textSecondary: '#aaa',  // Light gray (7:1 contrast)
  accent: '#00ff00',      // Bright green (8:1 contrast)
  error: '#ff4444',       // Bright red (5:1 contrast)
  success: '#44ff44'      // Bright green (9:1 contrast)
};
```

---

### Graphics Task Risk Assessment

**Success Rate by Task Type:**

| Task Type | Success Rate | Time | Notes |
|-----------|--------------|------|-------|
| Particle tuning | 90% | 15-30 min | Easy wins, just tweak counts |
| Screen shake calibration | 85% | 20-40 min | Find sweet spot for intensity |
| Color palette swap | 80% | 30-60 min | May need multiple iterations |
| Animation timing | 70% | 1-2 hours | Timing is subjective, needs polish |
| Sprite integration (100-500 sprites) | 60% | 2-4 hours | Medium risk, layout issues |
| Sprite integration (1000+ sprites) | 40% | 4-8 hours | High risk, complex mappings |
| Custom shader/WebGL | 30% | 4-8 hours | Very high risk, esoteric bugs |

**Risk Mitigation:**
- Start with LOW risk tasks (particles, shake)
- Prototype HIGH risk tasks in isolation first
- Break VERY HIGH risk tasks into smaller chunks
- Always have fallback plan (simple shapes instead of sprites)

---

### Graphics Session Structure (Recommended)

**5-Phase Session Template (50-75 minutes):**

```markdown
## 📸 Graphics Session: [Feature Name]

### Phase 1: Context Gathering (5-10 min)
- Review current visual state (screenshots)
- Identify visual deficiencies
- Check for console errors, asset 404s

### Phase 2: Priority Selection (5 min)
**Pick 2-3 tasks from this list:**
- [ ] Particle effects (LOW risk, 15-30 min)
- [ ] Screen shake (LOW risk, 20-40 min)
- [ ] Animation timing (MEDIUM risk, 1-2 hours)
- [ ] Sprite integration (MEDIUM-HIGH risk, 2-8 hours)

### Phase 3: Implementation (30-45 min)
- Execute tasks in priority order
- Test visually after EACH change
- Screenshot before/after

### Phase 4: Manual Testing (5-10 min)
- [ ] Play game for 2-3 minutes
- [ ] Check all visual effects
- [ ] Verify smooth animations (30+ FPS)
- [ ] Test on desktop + mobile (if applicable)

### Phase 5: Documentation (5 min)
- Screenshot final state
- Document numeric values used
- Create completion report
```

---

## GRAPHICS POLISH USAGE GUIDE

**When generating SUPER-ENTERPRISE onboarding:**

1. **Include graphics-decisions-reference.md link** in Graphics AI onboarding doc
2. **Specify numeric values** from this section for particle counts, shake intensity, timing
3. **Provide color palettes** matching the game's visual style (neon, military, JRPG, etc.)
4. **Set performance budgets** (max particles, entity caps, frame time targets)
5. **Include risk assessment** so Graphics AI knows which tasks are easy vs hard
6. **Provide session structure** to keep graphics work organized and time-boxed

**Example Graphics Task Specification:**
```markdown
## Task: Add Screen Shake to Enemy Death

### Numeric Values (Pre-Calculated)
- Intensity: 5px (medium shake)
- Duration: 200ms
- Trigger: When enemy health reaches 0

### Implementation
- Use trauma-based shake pattern from pattern-library.md Section 7
- Add shake trigger in enemy death handler
- Test with 3-5 enemy deaths to verify feel

### Acceptance
- [ ] Shake triggers on death
- [ ] 5px intensity, 200ms duration
- [ ] Feels satisfying (subjective, but important!)
- [ ] Screenshot evidence
```

---

## 16. MOCKUP-FIRST GRAPHICS WORKFLOW (SUPER-ENTERPRISE)

### Why Mockup-First?

**Traditional Approach (Integrate Sprites Directly):**
- ❌ Graphics AI success rate: 30-40%
- ❌ Common failure: Breaking game logic during sprite integration
- ❌ Recovery time: 2-4 hours of debugging
- ❌ Requires multiple iterations to get visual layout correct

**Mockup-First Approach (Two-Phase):**
- ✅ Graphics AI success rate: 80-90%
- ✅ Phase 1: HTML/CSS mockup (NO game code)
- ✅ Phase 2: Integration (AFTER Coder completes logic)
- ✅ Prevents cross-contamination (visuals separate from logic)
- ✅ Faster iteration (CSS tweaks don't break tests)

---

### Phase 1: Mockup Creation (Before Code)

**Inputs Required:**
- Story Bible (from Story Director or questionnaire)
- Mockup Script (HTML outline with sprite placements)
- Sprite Library (paths, formats, counts)
- Layout Specification (grid, regions, aspect ratio, z-layers)
- Design Tokens (spacing, timing, scales, colors)
- Accessibility Requirements (contrast, motion, keyboard nav)

**Outputs:**
```
mockups/
├── battle.html         # HTML mockup (NO JavaScript)
├── battle.css          # Visual styles + layout
├── tokens.css          # Design tokens (spacing, z-layers, timing, colors)
└── sprite_map.json     # Sprite paths + scales + anchors
```

---

### Phase 1 Pattern: HTML Mockup Structure

```html
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Game Name - Battle Screen Mockup</title>
  <link rel="stylesheet" href="battle.css">
  <link rel="stylesheet" href="tokens.css">
</head>
<body>
  <main id="battle-screen" class="battle-container">

    <!-- Background (z: 0) -->
    <div class="battle-bg" data-scene="forest-01" role="presentation"></div>

    <!-- Enemy row (z: 3) -->
    <section class="enemy-row" aria-label="Enemy units">
      <figure class="unit-slot" data-slot="enemy-1" data-scale="1.2">
        <img src="/sprites/enemies/fire_elemental_idle.gif" alt="Fire Elemental" class="sprite" />
        <div class="hp-bar"><div class="hp-fill" style="width: 80%;"></div></div>
        <span class="unit-name">Fire Elemental</span>
      </figure>
      <!-- More enemies... -->
    </section>

    <!-- Ally row (z: 2) -->
    <section class="ally-row" aria-label="Player units">
      <figure class="unit-slot" data-slot="ally-1" data-scale="1.0">
        <img src="/sprites/allies/isaac_front.gif" alt="Isaac" class="sprite" />
        <div class="hp-bar"><div class="hp-fill" style="width: 90%;"></div></div>
        <span class="unit-name">Isaac</span>
      </figure>
      <!-- More allies... -->
    </section>

    <!-- Combat log (z: 5) -->
    <aside class="combat-log" aria-live="polite">
      <p class="log-entry">Isaac strikes Fire Elemental for 35!</p>
    </aside>

    <!-- Action buttons (z: 10) -->
    <nav class="action-buttons" aria-label="Battle actions">
      <button class="btn-primary" data-action="attack">Attack</button>
      <button class="btn-secondary" data-action="defend">Defend</button>
      <button class="btn-secondary" data-action="item">Item</button>
      <button class="btn-danger" data-action="flee">Flee</button>
    </nav>

    <!-- Turn order (z: 10) -->
    <aside class="turn-order" aria-label="Turn order">
      <h3>Turn Order</h3>
      <ol>
        <li class="turn-active">Isaac</li>
        <li>Mia</li>
        <li>Fire Elemental</li>
      </ol>
    </aside>

  </main>

  <!-- Accessibility -->
  <div class="sr-only" aria-live="assertive" id="announcements"></div>
</body>
</html>
```

---

### Phase 1 Pattern: Design Tokens

```css
/* mockups/tokens.css */
:root {
  /* Spacing (4px baseline) */
  --baseline: 4px;
  --space-xs: calc(var(--baseline) * 1); /* 4px */
  --space-sm: calc(var(--baseline) * 2); /* 8px */
  --space-md: calc(var(--baseline) * 3); /* 12px */
  --space-lg: calc(var(--baseline) * 4); /* 16px */
  --space-xl: calc(var(--baseline) * 6); /* 24px */

  /* Z-layers */
  --z-bg: 0;
  --z-allies: 2;
  --z-enemies: 3;
  --z-fx: 5;
  --z-ui: 10;
  --z-hud: 15;

  /* Sprite scales */
  --scale-normal: 1.0;
  --scale-boss: 1.2;
  --scale-mega-boss: 1.5;
  --scale-ui-icon: 0.8;

  /* Animation timing (ms) - from Story Director or NextEraGame */
  --timing-attack: 600ms;
  --timing-hurt: 400ms;
  --timing-flash: 150ms;
  --timing-turn-transition: 500ms;
  --timing-death: 800ms;

  /* Colors (from Story Director palette or spec) */
  --color-bg: #1a1a1a;
  --color-primary: #4682b4;
  --color-secondary: #2f4f4f;
  --color-danger: #8b0000;
  --color-text: #ffffff;

  /* HP bar gradients */
  --hp-full: linear-gradient(to right, #00ff00, #00cc00);
  --hp-mid: linear-gradient(to right, #ffff00, #ffcc00);
  --hp-low: linear-gradient(to right, #ff4500, #cc0000);
}
```

**Key Design Token Categories:**
- **Spacing:** 4px baseline (xs/sm/md/lg/xl)
- **Z-layers:** 0 (bg) → 15 (HUD)
- **Scales:** 1.0 (normal) → 1.5 (mega-boss)
- **Timing:** 150ms (flash) → 800ms (death)
- **Colors:** Palette from Story Director or spec

---

### Phase 1 Pattern: Sprite Map JSON

```json
{
  "allies": [
    {
      "id": "isaac",
      "name": "Isaac",
      "paths": {
        "front": "/sprites/allies/isaac_front.gif",
        "back": "/sprites/allies/isaac_back.gif",
        "attack": "/sprites/allies/isaac_attack.gif",
        "hurt": "/sprites/allies/isaac_hurt.gif",
        "defend": "/sprites/allies/isaac_defend.gif"
      },
      "scale": 1.0,
      "anchor": "bottom-center"
    }
  ],
  "enemies": [
    {
      "id": "fire_elemental",
      "name": "Fire Elemental",
      "paths": {
        "idle": "/sprites/enemies/fire_elemental_idle.gif",
        "attack": "/sprites/enemies/fire_elemental_attack.gif",
        "hurt": "/sprites/enemies/fire_elemental_hurt.gif",
        "death": "/sprites/enemies/fire_elemental_death.gif"
      },
      "scale": 1.2,
      "anchor": "bottom-center"
    }
  ],
  "backgrounds": [
    {
      "id": "forest-01",
      "path": "/backgrounds/forest_01.png"
    }
  ]
}
```

**Why JSON?**
- Coder AI can import directly during Phase 2
- Graphics AI maintains single source of truth
- No hardcoded paths in game code

---

### Phase 1 Quality Gates

**Visual Approval:**
- [ ] Layout matches mockup script or specification
- [ ] All sprites load correctly (no 404s)
- [ ] Sprite scales match spec (1.0x, 1.2x, 1.5x)
- [ ] Z-layers correct (background < allies < enemies < UI)
- [ ] Grid/regions aligned per spec

**Accessibility (WCAG 2.1 AA):**
- [ ] Text contrast ≥ 4.5:1 on backgrounds
- [ ] UI elements contrast ≥ 3:1
- [ ] Focus rings visible on all interactive elements
- [ ] Keyboard navigation works (tab order logical)
- [ ] Screen reader labels present (aria-label, alt text)
- [ ] prefers-reduced-motion respected

**Technical:**
- [ ] No console errors in browser
- [ ] All sprite paths resolve correctly
- [ ] CSS tokens file loads and applies
- [ ] Responsive behavior works (if required)
- [ ] **NO JavaScript present** (HTML/CSS only)

**Evidence Required:**
- [ ] Screenshot: Desktop (1920x1080)
- [ ] Screenshot: Laptop (1366x768)
- [ ] Screenshot: Mobile (if responsive)
- [ ] Screenshot: Keyboard focus visible
- [ ] Accessibility audit report (browser DevTools)

---

### Phase 2: Integration (After Coder Implements Logic)

**Timing:** Phase 2 begins AFTER Coder completes all game systems with 100% tests passing + TypeScript 0 errors.

**Coder Provides to Graphics:**
1. **UI Contract** - Component props/types (frozen, read-only)
2. **Game State Shape** - What data Graphics can read
3. **Integration Points** - Where to mount React components
4. **CSS Class Names** - Existing classes to preserve

**Graphics Integrates:**
1. Convert static HTML → React components (preserve structure)
2. Apply mockup CSS → React components (use className)
3. Wire sprite animations → game state (read-only)
4. **Preserve ALL game logic** (NO modifications to src/systems/)
5. Test visually + verify no regressions

---

### Phase 2 Pattern: React Integration

**Before (Phase 1 HTML):**
```html
<figure class="unit-slot" data-slot="enemy-1" data-scale="1.2">
  <img src="/sprites/enemies/fire_elemental_idle.gif" alt="Fire Elemental" class="sprite" />
  <div class="hp-bar"><div class="hp-fill" style="width: 80%;"></div></div>
  <span class="unit-name">Fire Elemental</span>
</figure>
```

**After (Phase 2 React):**
```tsx
// src/components/battle/UnitSlot.tsx
interface UnitSlotProps {
  unit: UnitState; // From Coder's UI contract
  slot: string;
  scale: number;
}

export function UnitSlot({ unit, slot, scale }: UnitSlotProps) {
  const spritePath = getSpritePathForState(unit.id, unit.currentState);
  const hpPercent = (unit.currentHP / unit.maxHP) * 100;

  return (
    <figure className="unit-slot" data-slot={slot} data-scale={scale}>
      <img src={spritePath} alt={unit.name} className="sprite" />
      <div className="hp-bar">
        <div className="hp-fill" style={{ width: `${hpPercent}%` }}></div>
      </div>
      <span className="unit-name">{unit.name}</span>
    </figure>
  );
}
```

**Key Rules:**
- ✅ Preserve HTML structure from Phase 1
- ✅ Apply exact CSS class names from mockup
- ✅ Read game state (read-only)
- ❌ NO game logic modifications
- ❌ NO prop type changes (Coder owns contract)

---

### Phase 2 Quality Gates

**Integration Success:**
- [ ] All mockup styles applied to React components
- [ ] Sprites animate based on game state
- [ ] No game logic modifications
- [ ] All tests still pass (100% pass rate)
- [ ] TypeScript still 0 errors

**Visual Consistency:**
- [ ] Layout matches Phase 1 mockup
- [ ] Sprites display correctly in game
- [ ] Animations smooth (30+ FPS)
- [ ] No visual regressions

**Evidence Required:**
- [ ] Screenshot: Game running with integrated styles
- [ ] Video: 10-second gameplay clip
- [ ] Test output: All tests passing
- [ ] TypeScript output: 0 errors

---

### Mockup-First Anti-Patterns

**Phase 1 Mistakes:**
- ❌ Adding JavaScript to mockup (NO JS! HTML/CSS only)
- ❌ Skipping accessibility (WCAG 2.1 AA mandatory)
- ❌ Vague sprite paths (use exact resolved paths)
- ❌ Missing z-layer tokens (define all z-indices in tokens.css)
- ❌ No screenshots (visual evidence required for approval)

**Phase 2 Mistakes:**
- ❌ Modifying game logic (Graphics touches ONLY visual files)
- ❌ Breaking tests (integration must preserve 100% pass rate)
- ❌ Ignoring UI contract (Coder defines props, Graphics consumes)
- ❌ Recreating components (use existing, apply styles)
- ❌ Skipping regression checks (test old features still work)

---

### Mockup-First Success Metrics

**Traditional Approach (no mockup):**
- Success rate: 30-40%
- Recovery time: 2-4 hours

**Mockup-First Approach:**
- Success rate: 80-90%
- Recovery time: <30 min (CSS tweaks only)

**Time Investment:**
- Phase 1 (Mockup): 1-2 hours
- Phase 2 (Integration): 1-2 hours
- **Total: 2-4 hours** (vs 4-8 hours with traditional failures)

---

### Mockup-First Workflow Summary

```
User → Story Director (1-2 hours)
  ↓
Story Director → Graphics (outputs: Story Bible, Mockup Script, tokens)
  ↓
Graphics Phase 1: Mockup (1-2 hours, HTML/CSS only)
  ↓
Human approves mockup (screenshots + accessibility audit)
  ↓
Graphics → Architect (approved mockup for planning)
  ↓
Architect → Coder (session plans + tasks)
  ↓
Coder implements game logic (tests 100%, TS 0 errors)
  ↓
Coder → Graphics (UI contract + integration points)
  ↓
Graphics Phase 2: Integration (1-2 hours, React + game state)
  ↓
Final verification (tests pass, visuals match, no regressions)
```

**Total Time:** 4-6 hours (Story → Mockup → Code → Integration)

**Reference:** See [graphics-mockup-template.md](graphics-mockup-template.md) for complete template.

---

Done! Graphics polish patterns ready to copy-paste.
