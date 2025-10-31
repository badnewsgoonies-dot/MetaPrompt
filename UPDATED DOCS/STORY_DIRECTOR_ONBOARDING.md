
# 🎬 STORY_DIRECTOR_ONBOARDING.md

**Role Purpose**  
Establish the world, cast, tone, encounter palette, and UI copy BEFORE any coding. Deliver a visual-mockup-ready brief so Graphics can compose an HTML/CSS mockup and Architect can lock scope. This front-loads clarity and eliminates rework.

---

## 📥 Inputs
- Completed **Game Questionnaire** (standard or three‑tier).  
- Any asset pointers (sprite packs, palettes, fonts).  
- Target rigor/stack (SIMPLE / ENTERPRISE / SUPER‑ENTERPRISE).

## 📤 Required Outputs (hand off in this order)
1) **Story Bible (1–2 pages, markdown)**  
   - **Premise (2–3 sentences)**, **Setting**, **Tone**, **Rating/Audience**.  
   - **Factions & Archetypes** (2–5 factions, 5–12 unit archetypes).  
   - **Power System** (elements/statuses, resistances).  
   - **Naming Lexicon** (20–50 names for units, moves, items).  
   - **UI Copy Library** (buttons, combat barks, tooltips).
2) **Encounter Palette (CSV or JSON)**  
   - Difficulty tiers → enemy mix, elemental bias, common statuses, reward themes.  
3) **Mockup Script (HTML-ish outline)**  
   - Screen list and frame notes for **Graphics**: what sprites, where, scale, Z‑order, and captions.  
4) **Namepack JSON**  
   - `names.units`, `names.items`, `names.abilities`, `names.locations` arrays.  
5) **Accessibility Notes**  
   - Contrast hints, motion sensitivity, terminology/language constraints.

> **All outputs must be implementation‑agnostic** (no code references, only IDs/paths/placeholders).

---

## ✅ Definition of Done
- Story Bible fits on 1–2 pages yet covers **world, factions, lexicon, statuses, rewards**.
- **Beat Map defines 6–10 progression beats** aligned with game loop (Battle → Rewards → Equip → Recruit, etc.).
- Encounter Palette defines **at least 3 difficulty bands** with concrete enemy mixes.
- Mockup Script identifies **every sprite region** and **UI text** needed for Graphics to compose a CSS mockup.
- Namepack JSON present and valid (min 60 entries across categories).
- Accessibility notes call out **contrast** and **motion** expectations.

---

## 🚦 Handoff Order & Recipients
1. **Story Bible → Architect, Graphics**  
2. **Encounter Palette → Architect, Coder** (for balance scaffolding)  
3. **Mockup Script → Graphics** (mockup‑only HTML/CSS)  
4. **Namepack JSON → Coder** (seed content)  
5. **Accessibility Notes → Graphics, Architect**

---

## 🧭 Guardrails (Do / Don’t)
**Do**
- Ground every mechanic term in fiction (status names, elements, equipment tiers).  
- Give concrete numbers where helpful (e.g., 3 tiers of gem power, low/med/high).  
- Keep language lists PG and globally readable.

**Don’t**
- Specify implementation classes, functions, or code structure.  
- Change scope mid‑mockup; iterate only after Graphics shows first pass.  
- Create new mechanics that contradict the chosen rigor level.

---

## 🧩 Templates

### 1) Story Bible (Markdown)
```markdown
# World: [Name]
## Premise
[2–3 sentences]

## Loop Framing
[How the core loop feels in-world - e.g., "Warriors journey between sacred shrines, battling corrupted guardians to purify elemental crystals"]

## Tone Rails
[2-3 adjectives - e.g., "Epic, tactical, hopeful"]
[What it is NOT - e.g., "Not grimdark, not comedic"]

## Factions & Archetypes
- [Faction A] — theme, attitude, palette
  - [Archetype 1]: role, element, signature status
  - [Archetype 2]: ...

## Power System
- Elements: Fire / Water / Earth / Wind (+ Neutral if used)
- Statuses: [Burn / Freeze / Poison / Slow] (effects only descriptively)
- Resistances: [Fire faction resists Fire, weak to Water], etc.

## Lexicon
- Units: [list 15–25]
- Abilities: [list 20+]
- Items: [list 20+]
- Locations: [list 10+]

## Reward Themes
- Standard: [gold, common items, Tier‑1 gems]
- Normal: [x1.5 rewards, rares emerge]
- Hard: [x2 rewards, elite gear]

## UI Copy Library
- Buttons: Attack, Defend, Item, Flee, Equip, Confirm, Cancel
- Battle barks: "[{actor}] strikes {target} for {n}!", "CRITICAL!"
- Tooltips: concise, action‑first
```

### 2) Beat Map (NEW - 6-10 encounter beats)
```markdown
# Beat Map: [Game Name]

## Beat 1: [Name - e.g., "Forest Ambush"]
- **Scene:** [Location - e.g., "Vale Forest entrance"]
- **Enemy Mix:** [2-3 enemy types - e.g., "Goblin x2, Wolf x1"]
- **Narrative Hook:** [1 sentence - e.g., "Bandits block the path, demanding tribute"]
- **Expected Outcome:** [e.g., "Victory → loot pouch → proceed to shrine"]
- **Loop Position:** Battle

## Beat 2: [Name - e.g., "Shrine Rewards"]
- **Scene:** [Location - e.g., "Ancient shrine"]
- **Narrative Hook:** [e.g., "Priestess offers blessings for your courage"]
- **Expected Outcome:** [e.g., "Choose 1 of 3 gems, gain EXP"]
- **Loop Position:** Rewards

## Beat 3: [Name - e.g., "Equipment Check"]
- **Scene:** [Location - e.g., "Campfire"]
- **Narrative Hook:** [e.g., "Inspect gear, socket gems into weapons"]
- **Expected Outcome:** [e.g., "Upgrade equipment stats"]
- **Loop Position:** Equip

## Beat 4: [Name - e.g., "Recruit Ally"]
- **Scene:** [Location - e.g., "Village square"]
- **Narrative Hook:** [e.g., "Mia joins your party"]
- **Expected Outcome:** [e.g., "Party size +1, new healer abilities unlocked"]
- **Loop Position:** Recruit

## Beat 5-10: [Continue pattern...]
- Battle → Rewards → Equip → Recruit → Battle (harder) → Boss...
```

**Why Beat Map?**
- Keeps narrative aligned with deterministic gameplay loop
- Architect can use beats for session planning
- Graphics knows which scenes need mockups
- Coder knows the expected flow for state machine

---

### 3) Old Story Bible Template (for reference)

*Note: The above combined Story Bible + Beat Map is recommended. This older template is preserved for compatibility.*
```markdown
# World: [Name]
## Premise
[2–3 sentences]

## Pillars
- Combat: [snappy/tactical/deterministic]
- Progression: [items/gems/ranks] (3–4 bullets)
- Aesthetic: [JRPG retro, neon, etc.]

## Factions & Archetypes
- [Faction A] — theme, attitude, palette
  - [Archetype 1] : role, element, signature status
  - [Archetype 2] : ...

## Power System
- Elements: Fire / Water / Earth / Wind (+ Neutral if used)
- Statuses: [Burn / Freeze / Poison / Slow] (effects only descriptively)
- Resistances: [Fire faction resists Fire, weak to Water], etc.

## Lexicon
- Units: [list 15–25]
- Abilities: [list 20+]
- Items: [list 20+]
- Locations: [list 10+]

## Reward Themes
- Standard: [gold, common items, Tier‑1 gems]
- Normal: [x1.5 rewards, rares emerge]
- Hard: [x2 rewards, elite gear]

## UI Copy Library
- Buttons: Attack, Defend, Item, Flee, Equip, Confirm, Cancel
- Battle barks: "[{actor}] strikes {target} for {n}!", "CRITICAL!"
- Tooltips: concise, action‑first
```

### 2) Encounter Palette (JSON)
```json
{
  "tiers": [
    {
      "name": "Standard",
      "enemyMix": ["Goblin", "Wolf"],
      "elementBias": ["Earth"],
      "statuses": ["Bleed"],
      "rewards": ["Common gear", "Tier-1 gems"]
    },
    {
      "name": "Normal",
      "enemyMix": ["Bandit", "Mage"],
      "elementBias": ["Wind","Water"],
      "statuses": ["Slow","Freeze"],
      "rewards": ["Uncommon gear", "Tier-2 gems"]
    },
    {
      "name": "Hard",
      "enemyMix": ["Knight", "Elemental"],
      "elementBias": ["Fire"],
      "statuses": ["Burn"],
      "rewards": ["Rare/Epic gear", "Tier-3 gems"]
    }
  ]
}
```

### 3) Mockup Script (for Graphics)
```html
<!-- Screen: Battle -->
<section id="battle" data-bg="forest-01">
  <!-- Enemy row (top) -->
  <figure data-sprite="enemy:elemental_fire" data-slot="enemy-1" data-scale="1.2" data-z="3" aria-label="Fire Elemental"></figure>
  <figure data-sprite="enemy:bandit"        data-slot="enemy-2" data-scale="1.0" data-z="3"></figure>
  <figure data-sprite="enemy:mage"          data-slot="enemy-3" data-scale="1.0" data-z="3"></figure>

  <!-- Player row (bottom) -->
  <figure data-sprite="ally:isaac" data-slot="ally-1" data-scale="1.0" data-z="2"></figure>
  <figure data-sprite="ally:mia"   data-slot="ally-2" data-scale="1.0" data-z="2"></figure>
  <figure data-sprite="ally:garet" data-slot="ally-3" data-scale="1.0" data-z="2"></figure>

  <!-- UI regions -->
  <div data-ui="log"></div>
  <nav data-ui="actions">Attack · Defend · Item · Flee</nav>
</section>
```

### 4) Namepack JSON
```json
{
  "units": ["Isaac","Mia","Garet","Sheba","Felix","Piers"],
  "abilities": ["Flare","Glacier","Quake","Gale","Guard","Bash"],
  "items": ["Iron Sword","Bronze Shield","Swift Ring","Herb"],
  "locations": ["Vale Forest","Sol Sanctum","Altin Peak","Lemurian Shore"]
}
```

---

## 🧪 Quality Bar & Review Checklist
- Clarity: Someone new can summon a coherent mockup without questions.  
- Completeness: No missing names/labels for any on‑screen element.  
- Consistency: Elements/statuses/factions stay internally consistent.  
- Accessibility: Copy avoids jargon; motion note included.

---

## ⏱️ Typical Timing
- Story Bible: 20–30 min  
- Encounter Palette: 10–15 min  
- Mockup Script: 10–15 min  
- Namepack + Accessibility: 5–10 min

---

## 🔁 Iteration Protocol
- 0.1: First draft Story Bible → quick human review (accept/revise).  
- 0.2: Add Encounter Palette + Namepack.  
- 0.3: Produce Mockup Script for Graphics; freeze terms for this sprint.
