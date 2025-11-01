# Pokemon Battler - Story Bible

## World Overview
A turn-based Pokemon battle simulator capturing the strategic depth and excitement of classic Pokemon battles. Set in a training arena where trainers test their Pokemon's abilities in 1v1 combat.

## Tone & Aesthetic
- **Tone**: Nostalgic, strategic, competitive yet friendly
- **Audience**: Pokemon fans, strategy game enthusiasts, ages 10+
- **Visual Style**: Clean, readable battle interface inspired by Gen 3-5 Pokemon games
- **Color Palette**:
  - Primary: Pokemon-inspired vibrant colors (red, blue, green, yellow)
  - Background: Soft gradients (sky blue to white for arena)
  - UI: Clean borders with rounded corners, white/light gray panels
  - Text: High contrast black on white for readability

## Power System - Type Effectiveness
Classic Pokemon type chart (simplified):
- **Fire** > Grass > Water > Fire (triangle)
- **Normal** (neutral to all)
- **Electric** > Water, Flying
- **Fighting** > Normal, Rock
- Each type interaction: 2x damage (super effective), 0.5x (not very effective), 1x (neutral)

## Core Mechanics
1. **Turn-Based Combat**: Players alternate selecting moves
2. **HP System**: Each Pokemon has current/max HP
3. **Move System**: 4 moves per Pokemon with type, power, and PP (Power Points)
4. **Type Effectiveness**: Damage multipliers based on move type vs Pokemon type
5. **Speed**: Determines turn order each round
6. **Critical Hits**: 6.25% base chance for 1.5x damage

## Encounter Palette

### Starter Pokemon (Balanced Trio)
```json
{
  "pokemon": [
    {
      "id": "charizard",
      "name": "Charizard",
      "type": "Fire",
      "baseHP": 78,
      "baseAttack": 84,
      "baseDefense": 78,
      "baseSpeed": 100,
      "sprite": "charizard.png",
      "moves": ["Flamethrower", "Air Slash", "Dragon Claw", "Fire Spin"]
    },
    {
      "id": "blastoise",
      "name": "Blastoise",
      "type": "Water",
      "baseHP": 79,
      "baseAttack": 83,
      "baseDefense": 100,
      "baseSpeed": 78,
      "sprite": "blastoise.png",
      "moves": ["Hydro Pump", "Ice Beam", "Bite", "Water Gun"]
    },
    {
      "id": "venusaur",
      "name": "Venusaur",
      "type": "Grass",
      "baseHP": 80,
      "baseAttack": 82,
      "baseDefense": 83,
      "baseSpeed": 80,
      "sprite": "venusaur.png",
      "moves": ["Solar Beam", "Sludge Bomb", "Vine Whip", "Razor Leaf"]
    },
    {
      "id": "pikachu",
      "name": "Pikachu",
      "type": "Electric",
      "baseHP": 35,
      "baseAttack": 55,
      "baseDefense": 40,
      "baseSpeed": 90,
      "sprite": "pikachu.png",
      "moves": ["Thunderbolt", "Quick Attack", "Iron Tail", "Thunder Shock"]
    }
  ]
}
```

### Move Database
```json
{
  "moves": [
    {"name": "Flamethrower", "type": "Fire", "power": 90, "pp": 15},
    {"name": "Hydro Pump", "type": "Water", "power": 110, "pp": 5},
    {"name": "Solar Beam", "type": "Grass", "power": 120, "pp": 10},
    {"name": "Thunderbolt", "type": "Electric", "power": 90, "pp": 15},
    {"name": "Quick Attack", "type": "Normal", "power": 40, "pp": 30},
    {"name": "Bite", "type": "Normal", "power": 60, "pp": 25},
    {"name": "Ice Beam", "type": "Water", "power": 90, "pp": 10},
    {"name": "Air Slash", "type": "Normal", "power": 75, "pp": 15},
    {"name": "Dragon Claw", "type": "Normal", "power": 80, "pp": 15},
    {"name": "Fire Spin", "type": "Fire", "power": 35, "pp": 15},
    {"name": "Water Gun", "type": "Water", "power": 40, "pp": 25},
    {"name": "Sludge Bomb", "type": "Normal", "power": 90, "pp": 10},
    {"name": "Vine Whip", "type": "Grass", "power": 45, "pp": 25},
    {"name": "Razor Leaf", "type": "Grass", "power": 55, "pp": 25},
    {"name": "Iron Tail", "type": "Normal", "power": 100, "pp": 15},
    {"name": "Thunder Shock", "type": "Electric", "power": 40, "pp": 30}
  ]
}
```

## UI Copy & Lexicon

### Battle Messages
- "Go! [Pokemon Name]!" - Pokemon enters battle
- "What will [Pokemon Name] do?" - Move selection prompt
- "[Pokemon Name] used [Move Name]!" - Move execution
- "It's super effective!" - 2x damage
- "It's not very effective..." - 0.5x damage
- "A critical hit!" - Critical hit landed
- "[Pokemon Name] fainted!" - Pokemon HP reaches 0
- "[Trainer] wins!" - Battle conclusion

### UI Elements
- **HP Bar**: Green (>50%), Yellow (25-50%), Red (<25%)
- **Status Panel**: Shows Pokemon sprite, name, level, HP bar, HP numbers
- **Move Selection**: 4-button grid with move name and PP remaining
- **Battle Log**: Scrolling text area with recent battle messages

## Accessibility Notes

### Contrast
- All text: Minimum 4.5:1 contrast ratio
- HP bar colors distinguishable for colorblind users (use patterns/icons too)
- Focus indicators: 3px solid border for keyboard navigation

### Motion
- Animations: Keep under 300ms duration
- Provide "Reduce Motion" toggle to disable HP bar animations
- No flashing effects (photosensitivity)

### Keyboard Navigation
- Tab order: Move 1 → Move 2 → Move 3 → Move 4 → Settings
- Enter/Space: Select move
- Arrow keys: Navigate move selection
- Escape: Open menu/settings

### Screen Readers
- Battle log updates announced via aria-live="polite"
- HP changes announced with exact values
- Move buttons have aria-labels with full info: "[Move Name], [Type] type, Power [X], PP [Y]/[Max]"

## Mockup Script Specification

### HTML Structure
```
battle-screen (container)
├── player-status-panel
│   ├── pokemon-sprite (back view)
│   ├── pokemon-info
│   │   ├── name-level ("CHARIZARD Lv.50")
│   │   └── hp-bar-container
│   │       ├── hp-bar (colored, animated)
│   │       └── hp-text ("78/78")
├── opponent-status-panel
│   ├── pokemon-sprite (front view)
│   ├── pokemon-info
│   │   ├── name-level
│   │   └── hp-bar-container
├── battle-arena (background)
├── battle-log (scrolling text)
└── move-selection-panel
    ├── move-button-1
    ├── move-button-2
    ├── move-button-3
    └── move-button-4
```

### Required Sprites
- `charizard-front.png` (96x96px)
- `charizard-back.png` (96x96px)
- `blastoise-front.png` (96x96px)
- `blastoise-back.png` (96x96px)
- `venusaur-front.png` (96x96px)
- `venusaur-back.png` (96x96px)
- `pikachu-front.png` (96x96px)
- `pikachu-back.png` (96x96px)
- `battle-arena-bg.png` (800x600px) - Optional, can use CSS gradient

## Success Criteria

### Gameplay
1. Battle starts with both Pokemon at full HP
2. Players can select moves and see damage calculated correctly
3. Type effectiveness applies proper multipliers
4. Critical hits occur randomly (~6% chance)
5. Battle ends when one Pokemon's HP reaches 0
6. Battle log shows all actions in order

### Technical
1. Deterministic damage calculation (with seeded RNG for crits)
2. 0 TypeScript errors
3. 100% test coverage for battle logic
4. All moves functional with correct power/type
5. HP bar animations smooth (30+ FPS)

### Accessibility
1. WCAG 2.1 AA compliant
2. Full keyboard navigation
3. Screen reader friendly battle log
4. Colorblind-safe HP indicators
5. Reduce motion option available
