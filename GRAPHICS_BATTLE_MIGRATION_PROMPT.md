# 🎨 GRAPHICS AI: Battle System UI & Visual Polish

**ROLE:** Visual Design & UI Implementation  
**PROJECT:** NextEraGame → Golden Sun Battle System Migration  
**PHASE:** UI Components, Animations, and Visual Polish  
**TIME ESTIMATE:** 8-12 hours  
**CONTEXT:** Full migration plan at `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md`

---

## 🎯 YOUR MISSION

You are the **Graphics AI** responsible for:
1. **UI Components** - Port all 20 battle UI components (2,391 LOC)
2. **Visual Effects** - Screen shake, flash effects, damage numbers, animations
3. **Sprite Integration** - Copy 2,500+ sprites and 19 psynergy animations
4. **Styling** - Ensure Golden Sun aesthetic consistency
5. **Polish** - Smooth animations, color transitions, visual feedback

---

## 📊 PROJECT CONTEXT

### What You're Building

**Migrating FROM:** NextEraGame battle UI
- 20 battle components (2,391 LOC)
- 5 visual effect hooks (~400 LOC)
- 2,500+ Golden Sun sprites
- 19 animated psynergy effects (GIFs)
- Complete Golden Sun aesthetic (already proven)

**Migrating TO:** Golden Sun project
- Add battle UI to existing game
- Maintain visual consistency with overworld
- Ensure 60 FPS animations
- WCAG 2.1 AA accessibility

### Your Workload

**10 Major Tasks:**
- Sprite assets: Copy 2,500+ sprites (1 hour)
- Core components: Unit display, menus (2-3 hours)
- Visual effects: Damage, heal, attack (2-3 hours)
- Animations: Psynergy, sprite animations (2-3 hours)
- Status display: HP bars, MP bars, turn banner (1-2 hours)
- Main controller: BattleScreen UI (3-4 hours)
- Effect hooks: Screen shake, flash (1 hour)
- Transitions: Fade in/out (1 hour)
- Polish: Styling, consistency (2-3 hours)
- Testing: Visual QA (1-2 hours)

**Total:** 8-12 hours

---

## 📋 YOUR TASKS (Execute in Order)

### ✅ GRAPHICS-01: Copy Sprite Assets (1 hour)

**Priority:** CRITICAL (Needed by all components)

**Description:**  
Copy all Golden Sun sprites from NextEraGame. These are already organized and battle-tested.

**Files to Copy:**
```bash
/workspace/nexteragame/public/sprites/ → /workspace/golden-sun/public/sprites/
```

**Step-by-Step:**

1. **Copy entire sprites directory:**
   ```bash
   cp -r /workspace/nexteragame/public/sprites/* /workspace/golden-sun/public/sprites/
   ```

2. **Verify copy:**
   ```bash
   cd /workspace/golden-sun/public/sprites
   find . -type f | wc -l  # Should be 2,500+
   ```

3. **Check critical sprites exist:**
   ```bash
   # Party member portraits
   ls sprites/golden-sun/icons/characters/
   # Expected: Isaac1.gif, Garet1.gif, Ivan1.gif, Mia1.gif, etc.
   
   # Psynergy animations
   ls sprites/golden-sun/psynergy/
   # Expected: 19 GIF animations
   
   # Enemy sprites
   ls sprites/golden-sun/enemies/
   # Expected: Various monster sprites
   ```

4. **Create sprite registry:**
   ```typescript
   // src/data/battleSpriteRegistry.ts
   export const BATTLE_SPRITE_REGISTRY = {
     // Party portraits
     portraits: {
       isaac: '/sprites/golden-sun/icons/characters/Isaac1.gif',
       garet: '/sprites/golden-sun/icons/characters/Garet1.gif',
       ivan: '/sprites/golden-sun/icons/characters/Ivan1.gif',
       mia: '/sprites/golden-sun/icons/characters/Mia1.gif',
     },
     
     // Psynergy animations
     psynergy: {
       quake: '/sprites/golden-sun/psynergy/quake.gif',
       flare: '/sprites/golden-sun/psynergy/flare.gif',
       frost: '/sprites/golden-sun/psynergy/frost.gif',
       gust: '/sprites/golden-sun/psynergy/gust.gif',
       // ... all 19 animations
     },
     
     // Enemy sprites
     enemies: {
       slime: '/sprites/golden-sun/enemies/slime.gif',
       wild_wolf: '/sprites/golden-sun/enemies/wolf.gif',
       // ... more enemies
     },
   };
   ```

5. **Test sprite loading:**
   - Create simple test page that loads all sprites
   - Verify no 404 errors
   - Verify GIFs animate properly

**Acceptance Criteria:**
- [ ] 2,500+ sprites copied
- [ ] All 19 psynergy animations present
- [ ] No broken image links
- [ ] Sprite registry created
- [ ] All paths use `/sprites/` prefix (public directory)
- [ ] GIF animations work

**Dependencies:** None (start immediately)

---

### ✅ GRAPHICS-02: Create Battle Component Structure (30 minutes)

**Priority:** HIGH (Organization)

**Description:**  
Set up folder structure for battle components.

**Directories to Create:**
```bash
/workspace/golden-sun/src/components/battle/
/workspace/golden-sun/src/components/battle/effects/
/workspace/golden-sun/src/components/battle/status/
/workspace/golden-sun/src/components/battle/animations/
```

**Step-by-Step:**

1. **Create directories:**
   ```bash
   cd /workspace/golden-sun/src/components
   mkdir -p battle/effects battle/status battle/animations
   ```

2. **Create index file:**
   ```typescript
   // src/components/battle/index.ts
   // Re-export all battle components for easy imports
   export { BattleScreen } from './BattleScreen.js';
   export { BattleUnitSlot } from './BattleUnitSlot.js';
   export { ActionMenu } from './ActionMenu.js';
   export { PlayerStatusPanel } from './status/PlayerStatusPanel.js';
   // ... more exports
   ```

**Acceptance Criteria:**
- [ ] Folder structure created
- [ ] Index file ready for exports
- [ ] Organization matches NextEraGame structure

**Dependencies:** None

---

### ✅ GRAPHICS-03: Migrate Core Battle Components (2-3 hours)

**Priority:** HIGH (Foundation UI)

**Description:**  
Port core components: unit display, action menu, battlefield floor.

**Files to Create:**
```bash
/workspace/golden-sun/src/components/battle/BattleUnitSlot.tsx
/workspace/golden-sun/src/components/battle/ActionMenu.tsx
/workspace/golden-sun/src/components/battle/BattlefieldFloor.tsx
/workspace/golden-sun/src/components/battle/battleConstants.ts
```

**Source:**
```bash
/workspace/nexteragame/src/components/battle/BattleUnitSlot.tsx
/workspace/nexteragame/src/components/battle/ActionMenu.tsx
/workspace/nexteragame/src/components/battle/BattlefieldFloor.tsx
/workspace/nexteragame/src/components/battle/battleConstants.ts
```

**Step-by-Step:**

1. **Copy `battleConstants.ts`:**
   ```bash
   cp /workspace/nexteragame/src/components/battle/battleConstants.ts /workspace/golden-sun/src/components/battle/battleConstants.ts
   ```
   - No changes needed (just layout constants)

2. **Copy `BattlefieldFloor.tsx`:**
   ```bash
   cp /workspace/nexteragame/src/components/battle/BattlefieldFloor.tsx /workspace/golden-sun/src/components/battle/BattlefieldFloor.tsx
   ```
   - Update imports to Golden Sun paths
   - Verify background image paths

3. **Copy `BattleUnitSlot.tsx`:**
   ```typescript
   // This component displays a unit (player or enemy) in battle
   // Shows: Sprite, HP bar, name, status effects
   
   import React from 'react';
   import type { BattleUnit } from '../../types/battle.js';
   import { GoldenSunHPBar } from './GoldenSunHPBar.js';
   
   export interface BattleUnitSlotProps {
     unit: BattleUnit;
     isActive: boolean;
     isTargeted: boolean;
     onClick?: () => void;
     position: { x: number; y: number };
   }
   
   export function BattleUnitSlot({
     unit,
     isActive,
     isTargeted,
     onClick,
     position,
   }: BattleUnitSlotProps): React.ReactElement {
     return (
       <div
         className={`battle-unit-slot ${isActive ? 'active' : ''} ${isTargeted ? 'targeted' : ''}`}
         style={{
           position: 'absolute',
           left: `${position.x}px`,
           top: `${position.y}px`,
         }}
         onClick={onClick}
       >
         {/* Sprite */}
         <img
           src={unit.spriteUrl}
           alt={unit.name}
           className="unit-sprite"
         />
         
         {/* Name */}
         <div className="unit-name">{unit.name}</div>
         
         {/* HP Bar */}
         <GoldenSunHPBar
           current={unit.currentHp}
           max={unit.maxHp}
           width={80}
         />
         
         {/* Active indicator */}
         {isActive && (
           <div className="active-glow" />
         )}
         
         {/* Targeting reticle */}
         {isTargeted && (
           <div className="target-reticle" />
         )}
       </div>
     );
   }
   ```

4. **Copy `ActionMenu.tsx`:**
   ```typescript
   // Menu for player actions: Attack, Defend, Psynergy, Items, Flee
   
   import React from 'react';
   import type { Psynergy } from '../../types/psynergy.js';
   
   const ACTIONS = ['Attack', 'Defend', 'Psynergy', 'Items', 'Flee'] as const;
   
   export interface ActionMenuProps {
     selectedIndex: number;
     onSelect: (action: string) => void;
     disabledActions?: string[];
   }
   
   export function ActionMenu({
     selectedIndex,
     onSelect,
     disabledActions = [],
   }: ActionMenuProps): React.ReactElement {
     return (
       <div className="action-menu">
         {ACTIONS.map((action, index) => (
           <button
             key={action}
             className={`action-button ${index === selectedIndex ? 'selected' : ''} ${disabledActions.includes(action) ? 'disabled' : ''}`}
             onClick={() => onSelect(action)}
             disabled={disabledActions.includes(action)}
           >
             {action}
           </button>
         ))}
       </div>
     );
   }
   ```

5. **Style components:**
   ```css
   /* src/components/battle/BattleComponents.css */
   .battle-unit-slot {
     transition: all 0.2s ease;
   }
   
   .battle-unit-slot.active {
     filter: brightness(1.2);
   }
   
   .battle-unit-slot.targeted {
     outline: 2px solid yellow;
   }
   
   .active-glow {
     position: absolute;
     top: -5px;
     left: -5px;
     right: -5px;
     bottom: -5px;
     border: 2px solid gold;
     border-radius: 50%;
     animation: pulse 1s infinite;
   }
   
   @keyframes pulse {
     0%, 100% { opacity: 1; transform: scale(1); }
     50% { opacity: 0.5; transform: scale(1.1); }
   }
   
   .action-menu {
     display: flex;
     gap: 8px;
     padding: 16px;
     background: rgba(0, 0, 0, 0.8);
     border-radius: 8px;
   }
   
   .action-button {
     padding: 12px 24px;
     background: #2a4a8a;
     color: white;
     border: 2px solid #4a6aaa;
     border-radius: 4px;
     font-size: 16px;
     cursor: pointer;
     transition: all 0.2s;
   }
   
   .action-button.selected {
     background: #4a6aaa;
     border-color: gold;
     box-shadow: 0 0 10px rgba(255, 215, 0, 0.5);
   }
   
   .action-button:disabled {
     opacity: 0.5;
     cursor: not-allowed;
   }
   ```

**Acceptance Criteria:**
- [ ] All 3 core components ported
- [ ] Components render without errors
- [ ] Styling matches Golden Sun aesthetic
- [ ] TypeScript: 0 errors
- [ ] Components accept correct props

**Dependencies:** GRAPHICS-01, GRAPHICS-02

---

### ✅ GRAPHICS-04: Migrate Visual Effect Components (2-3 hours)

**Priority:** HIGH (Battle feedback)

**Description:**  
Port damage numbers, heal numbers, attack animations.

**Files to Create:**
```bash
/workspace/golden-sun/src/components/battle/effects/DamageNumber.tsx
/workspace/golden-sun/src/components/battle/effects/HealNumber.tsx
/workspace/golden-sun/src/components/battle/effects/AttackAnimation.tsx
/workspace/golden-sun/src/components/battle/effects/GoldenSunDamageNumber.tsx
```

**Source:**
```bash
/workspace/nexteragame/src/components/battle/DamageNumber.tsx
/workspace/nexteragame/src/components/battle/HealNumber.tsx
/workspace/nexteragame/src/components/battle/AttackAnimation.tsx
/workspace/nexteragame/src/components/battle/GoldenSunDamageNumber.tsx
```

**Step-by-Step:**

1. **Copy `DamageNumber.tsx`:**
   ```typescript
   // Floating damage number animation
   import React, { useEffect, useState } from 'react';
   
   export interface DamageNumberProps {
     amount: number;
     position: { x: number; y: number };
     type: 'damage' | 'critical' | 'miss';
     onComplete?: () => void;
   }
   
   export function DamageNumber({
     amount,
     position,
     type,
     onComplete,
   }: DamageNumberProps): React.ReactElement {
     const [opacity, setOpacity] = useState(1);
     
     useEffect(() => {
       // Fade out animation
       const timer = setTimeout(() => {
         setOpacity(0);
         setTimeout(() => onComplete?.(), 300);
       }, 500);
       
       return () => clearTimeout(timer);
     }, [onComplete]);
     
     return (
       <div
         className={`damage-number ${type}`}
         style={{
           position: 'absolute',
           left: `${position.x}px`,
           top: `${position.y}px`,
           opacity,
           transition: 'all 0.5s ease',
           transform: `translateY(-30px)`,
         }}
       >
         {type === 'miss' ? 'MISS' : amount}
       </div>
     );
   }
   ```

2. **Copy `GoldenSunDamageNumber.tsx`:**
   ```typescript
   // Golden Sun styled damage numbers (white with black outline)
   import React from 'react';
   import { DamageNumber, DamageNumberProps } from './DamageNumber.js';
   
   export function GoldenSunDamageNumber(props: DamageNumberProps): React.ReactElement {
     return (
       <div className="gs-damage-number">
         <DamageNumber {...props} />
       </div>
     );
   }
   ```

3. **Copy `HealNumber.tsx`:**
   ```typescript
   // Similar to DamageNumber but green color
   import React, { useEffect, useState } from 'react';
   
   export interface HealNumberProps {
     amount: number;
     position: { x: number; y: number };
     onComplete?: () => void;
   }
   
   export function HealNumber({
     amount,
     position,
     onComplete,
   }: HealNumberProps): React.ReactElement {
     const [opacity, setOpacity] = useState(1);
     
     useEffect(() => {
       const timer = setTimeout(() => {
         setOpacity(0);
         setTimeout(() => onComplete?.(), 300);
       }, 500);
       
       return () => clearTimeout(timer);
     }, [onComplete]);
     
     return (
       <div
         className="heal-number"
         style={{
           position: 'absolute',
           left: `${position.x}px`,
           top: `${position.y}px`,
           opacity,
           transition: 'all 0.5s ease',
           transform: `translateY(-30px)`,
           color: '#00ff00',
           fontSize: '24px',
           fontWeight: 'bold',
           textShadow: '2px 2px 4px rgba(0,0,0,0.8)',
         }}
       >
         +{amount}
       </div>
     );
   }
   ```

4. **Copy `AttackAnimation.tsx`:**
   ```typescript
   // Slash animation for physical attacks
   import React from 'react';
   
   export interface AttackAnimationProps {
     position: { x: number; y: number };
     role: 'Tank' | 'DPS' | 'Support' | 'Specialist';
     onComplete?: () => void;
   }
   
   export function AttackAnimation({
     position,
     role,
     onComplete,
   }: AttackAnimationProps): React.ReactElement {
     React.useEffect(() => {
       const timer = setTimeout(() => onComplete?.(), 500);
       return () => clearTimeout(timer);
     }, [onComplete]);
     
     return (
       <div
         className={`attack-animation ${role}`}
         style={{
           position: 'absolute',
           left: `${position.x}px`,
           top: `${position.y}px`,
         }}
       >
         <div className="slash-effect" />
       </div>
     );
   }
   ```

5. **Style effects:**
   ```css
   /* src/components/battle/effects/Effects.css */
   .damage-number {
     font-size: 32px;
     font-weight: bold;
     color: #ff4444;
     text-shadow: 
       -2px -2px 0 #000,
        2px -2px 0 #000,
       -2px  2px 0 #000,
        2px  2px 0 #000;
     pointer-events: none;
     z-index: 1000;
   }
   
   .damage-number.critical {
     font-size: 48px;
     color: #ffaa00;
     animation: critPulse 0.3s;
   }
   
   .damage-number.miss {
     color: #aaaaaa;
     font-size: 24px;
   }
   
   @keyframes critPulse {
     0%, 100% { transform: scale(1) translateY(0); }
     50% { transform: scale(1.2) translateY(-10px); }
   }
   
   .heal-number {
     font-size: 28px;
     font-weight: bold;
     color: #00ff00;
     pointer-events: none;
     z-index: 1000;
   }
   
   .attack-animation {
     width: 100px;
     height: 100px;
     pointer-events: none;
   }
   
   .slash-effect {
     width: 100%;
     height: 100%;
     background: linear-gradient(45deg, transparent 40%, white 50%, transparent 60%);
     animation: slash 0.5s;
   }
   
   @keyframes slash {
     0% { opacity: 0; transform: translateX(-50px); }
     50% { opacity: 1; }
     100% { opacity: 0; transform: translateX(50px); }
   }
   ```

**Acceptance Criteria:**
- [ ] All 4 effect components ported
- [ ] Damage numbers animate smoothly
- [ ] Heal numbers show in green
- [ ] Attack animation looks crisp
- [ ] Animations complete in correct timing
- [ ] TypeScript: 0 errors

**Dependencies:** GRAPHICS-02

---

### ✅ GRAPHICS-05: Migrate Animation Components (2-3 hours)

**Priority:** HIGH (Visual appeal)

**Description:**  
Port psynergy animations and sprite animations.

**Files to Create:**
```bash
/workspace/golden-sun/src/components/battle/animations/PsynergyAnimation.tsx
/workspace/golden-sun/src/components/battle/animations/AnimatedUnitSprite.tsx
/workspace/golden-sun/src/components/battle/animations/AnimatedEnemySprite.tsx
```

**Source:**
```bash
/workspace/nexteragame/src/components/battle/PsynergyAnimation.tsx
/workspace/nexteragame/src/components/battle/AnimatedUnitSprite.tsx
/workspace/nexteragame/src/components/battle/AnimatedEnemySprite.tsx
```

**Step-by-Step:**

1. **Copy `PsynergyAnimation.tsx`:**
   ```typescript
   // Displays animated GIF for psynergy spells
   import React, { useEffect } from 'react';
   import { getPsynergySprite } from '../../../data/psynergySpriteRegistry.js';
   
   export interface PsynergyAnimationProps {
     spellId: string;
     position: { x: number; y: number };
     size: number;
     onComplete?: () => void;
   }
   
   export function PsynergyAnimation({
     spellId,
     position,
     size,
     onComplete,
   }: PsynergyAnimationProps): React.ReactElement {
     const spriteUrl = getPsynergySprite(spellId);
     
     useEffect(() => {
       // Psynergy animations are ~1.5-2 seconds
       const timer = setTimeout(() => {
         onComplete?.();
       }, 1800);
       
       return () => clearTimeout(timer);
     }, [onComplete]);
     
     return (
       <div
         className="psynergy-animation"
         style={{
           position: 'absolute',
           left: `${position.x - size / 2}px`,
           top: `${position.y - size / 2}px`,
           width: `${size}px`,
           height: `${size}px`,
           pointerEvents: 'none',
           zIndex: 999,
         }}
       >
         <img
           src={spriteUrl}
           alt={spellId}
           style={{
             width: '100%',
             height: '100%',
             objectFit: 'contain',
           }}
         />
       </div>
     );
   }
   ```

2. **Create psynergy sprite registry:**
   ```typescript
   // src/data/psynergySpriteRegistry.ts
   export function getPsynergySprite(spellId: string): string {
     const SPRITES: Record<string, string> = {
       quake: '/sprites/golden-sun/psynergy/quake.gif',
       spire: '/sprites/golden-sun/psynergy/spire.gif',
       flare: '/sprites/golden-sun/psynergy/flare.gif',
       volcano: '/sprites/golden-sun/psynergy/volcano.gif',
       frost: '/sprites/golden-sun/psynergy/frost.gif',
       gust: '/sprites/golden-sun/psynergy/gust.gif',
       // ... all 19 psynergy animations
     };
     
     return SPRITES[spellId] || '/sprites/default_spell.gif';
   }
   ```

3. **Copy `AnimatedUnitSprite.tsx`:**
   ```typescript
   // Animated player character sprite
   import React from 'react';
   import type { BattleUnit } from '../../../types/battle.js';
   
   export interface AnimatedUnitSpriteProps {
     unit: BattleUnit;
     isAttacking: boolean;
     isDefending: boolean;
     isDamaged: boolean;
   }
   
   export function AnimatedUnitSprite({
     unit,
     isAttacking,
     isDefending,
     isDamaged,
   }: AnimatedUnitSpriteProps): React.ReactElement {
     return (
       <div
         className={`animated-unit-sprite ${isAttacking ? 'attacking' : ''} ${isDefending ? 'defending' : ''} ${isDamaged ? 'damaged' : ''}`}
       >
         <img
           src={unit.spriteUrl}
           alt={unit.name}
           className="unit-sprite-image"
         />
       </div>
     );
   }
   ```

4. **Style animations:**
   ```css
   /* src/components/battle/animations/Animations.css */
   .psynergy-animation {
     animation: psynergyAppear 0.3s;
   }
   
   @keyframes psynergyAppear {
     0% { opacity: 0; transform: scale(0.5); }
     100% { opacity: 1; transform: scale(1); }
   }
   
   .animated-unit-sprite {
     transition: all 0.2s;
   }
   
   .animated-unit-sprite.attacking {
     animation: attackBounce 0.5s;
   }
   
   @keyframes attackBounce {
     0%, 100% { transform: translateX(0); }
     25% { transform: translateX(-10px); }
     75% { transform: translateX(10px); }
   }
   
   .animated-unit-sprite.defending {
     animation: defendPulse 0.5s;
   }
   
   @keyframes defendPulse {
     0%, 100% { filter: brightness(1); }
     50% { filter: brightness(1.5); }
   }
   
   .animated-unit-sprite.damaged {
     animation: damageFlash 0.3s;
   }
   
   @keyframes damageFlash {
     0%, 100% { filter: brightness(1); }
     50% { filter: brightness(3) saturate(0); }
   }
   ```

**Acceptance Criteria:**
- [ ] Psynergy animations display correctly (GIFs)
- [ ] Sprite animations respond to battle state
- [ ] Attacking animation looks good
- [ ] Defending animation shows clearly
- [ ] Damage flash is visible but not jarring
- [ ] TypeScript: 0 errors

**Dependencies:** GRAPHICS-01, GRAPHICS-02

---

### ✅ GRAPHICS-06: Migrate Status Display Components (1-2 hours)

**Priority:** MEDIUM (Battle UI)

**Description:**  
Port HP bars, MP bars, turn banner, status panels.

**Files to Create:**
```bash
/workspace/golden-sun/src/components/battle/status/GoldenSunHPBar.tsx
/workspace/golden-sun/src/components/battle/status/HPBar.tsx
/workspace/golden-sun/src/components/battle/status/PlayerStatusPanel.tsx
/workspace/golden-sun/src/components/battle/status/TurnBanner.tsx
/workspace/golden-sun/src/components/battle/status/TargetHelp.tsx
```

**Source:**
```bash
/workspace/nexteragame/src/components/battle/GoldenSunHPBar.tsx
/workspace/nexteragame/src/components/battle/HPBar.tsx
/workspace/nexteragame/src/components/battle/PlayerStatusPanel.tsx
/workspace/nexteragame/src/components/battle/TurnBanner.tsx
/workspace/nexteragame/src/components/battle/TargetHelp.tsx
```

**Step-by-Step:**

1. **Copy all 5 status components:**
   ```bash
   cp /workspace/nexteragame/src/components/battle/GoldenSunHPBar.tsx /workspace/golden-sun/src/components/battle/status/
   cp /workspace/nexteragame/src/components/battle/HPBar.tsx /workspace/golden-sun/src/components/battle/status/
   # ... etc
   ```

2. **Update imports in each file:**
   ```typescript
   // Change relative paths to match new structure
   import type { BattleUnit } from '../../../types/battle.js';
   ```

3. **Verify HP bar colors (Golden Sun specific):**
   ```typescript
   // In GoldenSunHPBar.tsx
   function getHPBarColor(percentage: number): string {
     if (percentage > 0.6) return '#00ff00'; // Green
     if (percentage > 0.3) return '#ffff00'; // Yellow
     return '#ff0000'; // Red
   }
   ```

4. **Test HP bar transitions:**
   - Smooth color change from green → yellow → red
   - Width animates smoothly on damage
   - Correct percentage display

**Acceptance Criteria:**
- [ ] All 5 status components ported
- [ ] HP bars show correct colors (green/yellow/red)
- [ ] HP bars animate smoothly
- [ ] Turn banner displays clearly
- [ ] Status panels show all relevant info
- [ ] TypeScript: 0 errors

**Dependencies:** GRAPHICS-02

---

### ✅ GRAPHICS-07: Migrate BattleScreen UI (3-4 hours)

**Priority:** CRITICAL (Main UI)

**Description:**  
Port the main BattleScreen component (1,828 LOC). Work with Coder's logic file.

**Files to Create:**
```bash
/workspace/golden-sun/src/screens/BattleScreen.tsx
```

**Source:**
```bash
/workspace/nexteragame/src/screens/BattleScreen.tsx
```

**Files to Use:**
```bash
/workspace/golden-sun/src/screens/BattleScreen.logic.ts  # Created by Coder AI
```

**Step-by-Step:**

1. **Copy BattleScreen.tsx:**
   ```bash
   cp /workspace/nexteragame/src/screens/BattleScreen.tsx /workspace/golden-sun/src/screens/BattleScreen.tsx
   ```

2. **Import Coder's logic:**
   ```typescript
   import { useBattleScreenLogic } from './BattleScreen.logic.js';
   import type { BattleUnit, BattleResult } from '../types/battle.js';
   
   export interface BattleScreenProps {
     playerUnits: BattleUnit[];
     enemyUnits: BattleUnit[];
     onComplete: (result: BattleResult) => void;
     canFlee: boolean;
     seed?: number;
   }
   
   export function BattleScreen({
     playerUnits,
     enemyUnits,
     onComplete,
     canFlee,
     seed,
   }: BattleScreenProps): React.ReactElement {
     // Use Coder's logic hook
     const battle = useBattleScreenLogic({
       playerUnits,
       enemyUnits,
       onComplete,
       seed,
     });
     
     // UI state
     const [phase, setPhase] = useState<'menu' | 'targeting'>('menu');
     const [selectedAction, setSelectedAction] = useState<string | null>(null);
     
     // Render battle UI
     return (
       <div className="battle-screen">
         {/* Background */}
         <BattlefieldFloor />
         
         {/* Player units */}
         {battle.alivePlayers.map((unit, index) => (
           <BattleUnitSlot
             key={unit.id}
             unit={unit}
             isActive={battle.activeId === unit.id}
             isTargeted={false}
             position={getPlayerPosition(index)}
           />
         ))}
         
         {/* Enemy units */}
         {battle.aliveEnemies.map((unit, index) => (
           <BattleUnitSlot
             key={unit.id}
             unit={unit}
             isActive={false}
             isTargeted={false}
             position={getEnemyPosition(index)}
           />
         ))}
         
         {/* Status panel */}
         <PlayerStatusPanel units={battle.alivePlayers} />
         
         {/* Action menu (if player's turn) */}
         {battle.activeId && battle.findUnit(battle.activeId)?.isPlayer && (
           <ActionMenu
             selectedIndex={0}
             onSelect={handleActionSelect}
             disabledActions={canFlee ? [] : ['Flee']}
           />
         )}
         
         {/* Turn banner */}
         <TurnBanner
           turnNumber={battle.turnsTaken}
           activeUnit={battle.activeId ? battle.findUnit(battle.activeId) : null}
         />
       </div>
     );
   }
   
   function getPlayerPosition(index: number): { x: number; y: number } {
     // Diagonal formation (bottom-left to top-right)
     const baseX = 100;
     const baseY = 400;
     return {
       x: baseX + (index * 80),
       y: baseY - (index * 60),
     };
   }
   
   function getEnemyPosition(index: number): { x: number; y: number } {
     // Diagonal formation (top-right to bottom-left)
     const baseX = 600;
     const baseY = 150;
     return {
       x: baseX + (index * 80),
       y: baseY + (index * 60),
     };
   }
   ```

3. **Style BattleScreen:**
   ```css
   /* src/screens/BattleScreen.css */
   .battle-screen {
     width: 100vw;
     height: 100vh;
     position: relative;
     overflow: hidden;
     background: linear-gradient(to bottom, #2a4a8a 0%, #1a2a5a 100%);
   }
   
   /* Golden Sun style panels */
   .battle-panel {
     background: rgba(0, 0, 0, 0.8);
     border: 3px solid #4a6aaa;
     border-radius: 8px;
     padding: 16px;
     box-shadow: 0 4px 12px rgba(0, 0, 0, 0.5);
   }
   
   /* Bottom UI panel */
   .battle-ui-bottom {
     position: absolute;
     bottom: 20px;
     left: 50%;
     transform: translateX(-50%);
     width: 90%;
     max-width: 800px;
   }
   ```

4. **Integrate all sub-components:**
   - All 20 battle components should be used in BattleScreen
   - Verify props are passed correctly
   - Test all UI interactions

5. **Test full battle flow:**
   - Player can select actions
   - Actions execute correctly
   - Animations play
   - Turn advances
   - Battle ends correctly

**Acceptance Criteria:**
- [ ] BattleScreen renders correctly
- [ ] All sub-components integrated
- [ ] Player can interact with UI
- [ ] Battle plays to completion
- [ ] Visual quality: 9/10+ (Golden Sun aesthetic)
- [ ] TypeScript: 0 errors

**Dependencies:** GRAPHICS-03, GRAPHICS-04, GRAPHICS-05, GRAPHICS-06

---

### ✅ GRAPHICS-08: Integrate Visual Effect Hooks (1 hour)

**Priority:** MEDIUM (Polish)

**Description:**  
Port screen shake and flash effect hooks.

**Files to Create:**
```bash
/workspace/golden-sun/src/hooks/useScreenShake.ts
/workspace/golden-sun/src/hooks/useFlashEffect.tsx
/workspace/golden-sun/src/hooks/useBattleAnimation.ts
/workspace/golden-sun/src/hooks/useCombatAnimation.ts
```

**Source:**
```bash
/workspace/nexteragame/src/hooks/useScreenShake.ts
/workspace/nexteragame/src/hooks/useFlashEffect.tsx
/workspace/nexteragame/src/hooks/useBattleAnimation.ts
/workspace/nexteragame/src/hooks/useCombatAnimation.ts
```

**Step-by-Step:**

1. **Copy all 4 hooks:**
   ```bash
   cp /workspace/nexteragame/src/hooks/useScreenShake.ts /workspace/golden-sun/src/hooks/
   cp /workspace/nexteragame/src/hooks/useFlashEffect.tsx /workspace/golden-sun/src/hooks/
   cp /workspace/nexteragame/src/hooks/useBattleAnimation.ts /workspace/golden-sun/src/hooks/
   cp /workspace/nexteragame/src/hooks/useCombatAnimation.ts /workspace/golden-sun/src/hooks/
   ```

2. **No modifications needed** - These are self-contained React hooks

3. **Integrate into BattleScreen:**
   ```typescript
   // In BattleScreen.tsx
   import { useScreenShake } from '../hooks/useScreenShake.js';
   import { useFlashEffect } from '../hooks/useFlashEffect.js';
   
   export function BattleScreen(props: BattleScreenProps) {
     const { shake } = useScreenShake();
     const { flash, FlashOverlay } = useFlashEffect();
     
     // On damage:
     function handleDamage(amount: number) {
       if (amount > 50) {
         shake(20); // Big shake for high damage
       } else {
         shake(10); // Small shake
       }
       flash('red', 0.3); // Red flash
     }
     
     return (
       <div className="battle-screen">
         {/* ... battle UI ... */}
         <FlashOverlay />
       </div>
     );
   }
   ```

4. **Test visual effects:**
   - Screen shake on damage (5px/10px/20px based on damage)
   - Flash on damage (red) and heal (green)
   - Effects don't interfere with gameplay

**Acceptance Criteria:**
- [ ] All 4 hooks ported
- [ ] Screen shake works (tuned to GS feel)
- [ ] Flash effects work
- [ ] Effects enhance, don't distract
- [ ] TypeScript: 0 errors

**Dependencies:** GRAPHICS-07

---

### ✅ GRAPHICS-09: Polish and Styling (2-3 hours)

**Priority:** HIGH (Final quality)

**Description:**  
Ensure visual consistency with Golden Sun aesthetic across all battle components.

**Step-by-Step:**

1. **Create unified battle styles:**
   ```css
   /* src/styles/battle.css */
   
   /* Golden Sun Color Palette */
   :root {
     --gs-blue-dark: #1a2a5a;
     --gs-blue-medium: #2a4a8a;
     --gs-blue-light: #4a6aaa;
     --gs-gold: #ffd700;
     --gs-gold-dark: #b8860b;
     --gs-hp-green: #00ff00;
     --gs-hp-yellow: #ffff00;
     --gs-hp-red: #ff0000;
   }
   
   /* Panel styling (consistent with overworld) */
   .gs-panel {
     background: rgba(0, 0, 0, 0.85);
     border: 3px solid var(--gs-blue-light);
     border-radius: 8px;
     padding: 16px;
     box-shadow: 
       0 4px 12px rgba(0, 0, 0, 0.5),
       inset 0 1px 0 rgba(255, 255, 255, 0.1);
     backdrop-filter: blur(4px);
   }
   
   /* Button styling */
   .gs-button {
     background: linear-gradient(to bottom, var(--gs-blue-medium), var(--gs-blue-dark));
     border: 2px solid var(--gs-blue-light);
     color: white;
     font-family: 'Press Start 2P', monospace;
     font-size: 14px;
     padding: 12px 24px;
     cursor: pointer;
     transition: all 0.2s;
   }
   
   .gs-button:hover {
     border-color: var(--gs-gold);
     box-shadow: 0 0 8px rgba(255, 215, 0, 0.5);
   }
   
   .gs-button:active {
     transform: translateY(2px);
   }
   
   /* Text styling */
   .gs-text {
     font-family: 'Press Start 2P', monospace;
     color: white;
     text-shadow: 2px 2px 0 rgba(0, 0, 0, 0.8);
   }
   
   /* HP Bar (Golden Sun style) */
   .gs-hp-bar {
     width: 100%;
     height: 8px;
     background: #333;
     border: 1px solid #666;
     border-radius: 4px;
     overflow: hidden;
   }
   
   .gs-hp-bar-fill {
     height: 100%;
     transition: all 0.3s ease;
     border-radius: 3px;
   }
   
   .gs-hp-bar-fill.high {
     background: linear-gradient(to bottom, #00ff00, #00cc00);
   }
   
   .gs-hp-bar-fill.medium {
     background: linear-gradient(to bottom, #ffff00, #cccc00);
   }
   
   .gs-hp-bar-fill.low {
     background: linear-gradient(to bottom, #ff0000, #cc0000);
     animation: pulse 1s infinite;
   }
   
   @keyframes pulse {
     0%, 100% { opacity: 1; }
     50% { opacity: 0.7; }
   }
   ```

2. **Ensure font consistency:**
   ```css
   /* Import Golden Sun font */
   @import url('https://fonts.googleapis.com/css2?family=Press+Start+2P&display=swap');
   
   .battle-screen * {
     font-family: 'Press Start 2P', monospace;
   }
   ```

3. **Review all components for consistency:**
   - All panels use `.gs-panel` class
   - All buttons use `.gs-button` class
   - All text uses `.gs-text` class
   - Color palette matches GS aesthetic
   - Fonts consistent

4. **Test visual quality:**
   - Take screenshots
   - Compare to original Golden Sun
   - Ensure 9/10+ visual similarity

5. **Optimize performance:**
   - Check for unnecessary re-renders
   - Verify 60 FPS during battles
   - Test on lower-end devices (if possible)

**Acceptance Criteria:**
- [ ] All components styled consistently
- [ ] Golden Sun aesthetic maintained (9/10+)
- [ ] Color palette correct
- [ ] Fonts consistent
- [ ] Animations smooth (60 FPS)
- [ ] No visual bugs or glitches

**Dependencies:** All previous GRAPHICS tasks

---

### ✅ GRAPHICS-10: Create Battle Transition Animations (1 hour)

**Priority:** MEDIUM (Polish)

**Description:**  
Create smooth fade transitions between overworld and battle.

**Files to Create:**
```bash
/workspace/golden-sun/src/components/BattleTransition.tsx
```

**Step-by-Step:**

1. **Create transition component:**
   ```typescript
   import React from 'react';
   
   export interface BattleTransitionProps {
     direction: 'in' | 'out';
     onComplete?: () => void;
   }
   
   export function BattleTransition({
     direction,
     onComplete,
   }: BattleTransitionProps): React.ReactElement {
     React.useEffect(() => {
       const duration = direction === 'out' ? 1000 : 500;
       const timer = setTimeout(() => onComplete?.(), duration);
       return () => clearTimeout(timer);
     }, [direction, onComplete]);
     
     return (
       <div
         className={`battle-transition ${direction}`}
         style={{
           position: 'fixed',
           top: 0,
           left: 0,
           width: '100vw',
           height: '100vh',
           background: 'black',
           zIndex: 9999,
           pointerEvents: 'none',
         }}
       />
     );
   }
   ```

2. **Style transitions:**
   ```css
   .battle-transition {
     animation-fill-mode: forwards;
   }
   
   .battle-transition.out {
     animation: fadeOut 1s ease-out;
   }
   
   .battle-transition.in {
     animation: fadeIn 0.5s ease-in;
   }
   
   @keyframes fadeOut {
     0% { opacity: 0; }
     100% { opacity: 1; }
   }
   
   @keyframes fadeIn {
     0% { opacity: 1; }
     100% { opacity: 0; }
   }
   ```

3. **Test transitions:**
   - Smooth fade (no jarring cuts)
   - Correct timing (1s out, 0.5s in)
   - Doesn't block interaction after complete

**Acceptance Criteria:**
- [ ] Smooth fade transitions
- [ ] Correct timing
- [ ] No visual artifacts
- [ ] TypeScript: 0 errors

**Dependencies:** None

---

## 🎯 SUCCESS METRICS

**Your work is complete when:**

1. ✅ All 10 tasks completed
2. ✅ All 20 battle components ported
3. ✅ 2,500+ sprites copied and working
4. ✅ 19 psynergy animations functional
5. ✅ Visual effects smooth (60 FPS)
6. ✅ Golden Sun aesthetic maintained (9/10+)
7. ✅ WCAG 2.1 AA accessibility maintained
8. ✅ TypeScript: 0 errors
9. ✅ All components render without errors
10. ✅ Battle looks production-ready

---

## 🔍 QUALITY CHECKLIST

After each task, verify:

- [ ] **Visual Quality:** 9/10+ GS aesthetic
- [ ] **Performance:** 60 FPS maintained
- [ ] **Accessibility:** WCAG 2.1 AA (keyboard nav, screen reader)
- [ ] **TypeScript:** 0 errors
- [ ] **Animations:** Smooth, no jank
- [ ] **Colors:** Match GS palette
- [ ] **Fonts:** Consistent (Press Start 2P)
- [ ] **Sprites:** Load correctly, no 404s
- [ ] **Responsive:** Works at different resolutions
- [ ] **Polish:** Professional, polished feel

---

## 🚀 HOW TO START

**Immediate first steps:**

1. Read `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md` completely
2. Read the Architect's documents (when available):
   - `GRAPHICS_TASKS.md`
   - `BATTLE_INTEGRATION_ARCHITECTURE.md`
3. Start with **GRAPHICS-01** (Copy Sprite Assets)
4. Work through tasks **in order** (they have dependencies)

**Work methodically. Test visuals after each task. Maintain GS aesthetic!**

---

## 📚 REFERENCE FILES

**Main Migration Plan:**
- `/workspace/BATTLE_SYSTEM_MIGRATION_PLAN.md` (Your guide)

**NextEraGame Source:**
- `/workspace/nexteragame/src/components/battle/` (All UI components)
- `/workspace/nexteragame/public/sprites/` (All sprites)

**Golden Sun Current:**
- `/workspace/golden-sun/` (Your target)

---

## ⚠️ CRITICAL REMINDERS

1. **Maintain GS aesthetic** - Visual consistency is key
2. **Test performance** - 60 FPS or visual quality suffers
3. **Accessibility** - Keyboard nav and screen reader support
4. **Don't modify logic** - That's Coder's job, you handle UI
5. **Smooth animations** - Golden Sun is known for polish
6. **Sprite paths** - Always use `/sprites/` prefix (public dir)
7. **Test on real device** - Emulator can hide performance issues

---

**Ready to create beautiful battle UI! Start with GRAPHICS-01: Copy Sprite Assets.**

Good luck, Graphics AI! 🎨
