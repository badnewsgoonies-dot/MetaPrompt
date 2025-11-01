# On-Screen Controller Guide

## Overview
The Golden Sun game now includes a touch-friendly on-screen controller for iPad and mobile devices!

## Controller Layout

```
┌─────────────────────────────────────────────────────────┐
│                                                           │
│                                                           │
│   [D-PAD]          [START] [SELECT]          [A B X Y]   │
│     ▲                                            Y        │
│   ◀ ● ▶                                        X   B      │
│     ▼                                            A        │
└─────────────────────────────────────────────────────────┘
```

## Button Mappings

### D-Pad (Left Side)
- **Up Arrow (▲)** - Move character up
- **Down Arrow (▼)** - Move character down  
- **Left Arrow (◀)** - Move character left
- **Right Arrow (▶)** - Move character right

### Action Buttons (Right Side)
- **A Button** (Red) - Primary action
  - Talk to NPCs
  - Advance dialogue
  - Enter doors/shops
  - Confirm selections
  
- **B Button** (Yellow) - Cancel/Back
  - Close dialogue
  - Exit shops
  - Cancel actions
  
- **X Button** (Blue) - Secondary action
  - Reserved for future features
  
- **Y Button** (Blue) - Secondary action  
  - Reserved for future features

### Center Buttons
- **START** - Advance dialogue (same as A)
- **SELECT** - Reserved for menu access

## Features

✨ **Touch-Optimized**
- Large, easy-to-press buttons
- Visual feedback on press
- Works with multi-touch (press multiple buttons simultaneously)

🎮 **GBA-Inspired Design**
- Classic Game Boy Advance button layout
- Retro color scheme
- Familiar D-pad + action button arrangement

📱 **Responsive**
- Automatically appears on touch devices
- Hidden on desktop (unless manually enabled)
- Scales appropriately for different screen sizes

🎯 **Smart Positioning**
- Fixed to bottom of screen
- Game viewport adjusted to prevent overlap
- Transparent background to maintain immersion

## Keyboard Equivalents

The on-screen controller simulates keyboard inputs:

| Button | Keyboard Key |
|--------|--------------|
| D-Pad Up | Arrow Up / W |
| D-Pad Down | Arrow Down / S |
| D-Pad Left | Arrow Left / A |
| D-Pad Right | Arrow Right / D |
| A Button | A / Enter |
| B Button | Escape |
| X Button | X |
| Y Button | Y |
| Start | Enter |
| Select | Shift |

## Usage Tips

1. **Movement** - Use the D-pad for smooth character movement
2. **Talking to NPCs** - Walk near an NPC and press A button
3. **Reading Dialogue** - Press A repeatedly to advance through dialogue
4. **Closing Menus** - Press B button to exit dialogues or shops
5. **Entering Shops** - Walk to door and press A when indicator appears

## Technical Details

### Auto-Detection
The controller automatically appears when:
- Device has touch capability (`hover: none` and `pointer: coarse`)
- Screen width is below 1024px

### Performance
- Event handlers optimized for minimal latency
- Touch events properly prevent scrolling interference
- Multiple simultaneous inputs supported (e.g., diagonal movement)

### Accessibility
- All buttons have proper ARIA labels
- Button states clearly visible
- High contrast color scheme

## Future Enhancements

Planned features:
- [ ] Customizable button layout
- [ ] Button size adjustment
- [ ] Opacity control
- [ ] Haptic feedback
- [ ] Save/Load button mapping preferences
- [ ] On-screen joystick alternative to D-pad

---

Enjoy playing Golden Sun on your iPad! 🎮✨
