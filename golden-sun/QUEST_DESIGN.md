# 📜 QUEST DESIGN: Golden Sun - Vale Village

**Project:** Golden Sun: Vale Village  
**Version:** 1.0  
**Date:** 2025-11-01  
**Role:** Quest Designer

---

## 🎯 QUEST SYSTEM OVERVIEW

Vale Village features a **dual-track quest system**:

1. **Main Quest Line (Battle Progression)** - Required to progress story
2. **Side Quests (Optional)** - Additional content, rewards, and world-building

Both quest types integrate seamlessly with the dialogue and story flag systems.

---

## ⚔️ MAIN QUEST LINE: THE GUARDIAN TRIAL

The core progression system that gates access to Sol Sanctum through combat challenges.

### Quest 1: "Morning in Vale" (Tutorial)
**Type:** Main Quest (Tutorial)  
**Giver:** Dora  
**Prerequisites:** None  
**Duration:** 5-7 minutes

**Objectives:**
1. Talk to Dora in the kitchen
2. Explore Isaac's house
3. Exit house and enter Vale Village
4. Battle Garet (tutorial fight)

**Rewards:**
- Tutorial complete
- Movement & dialogue systems learned
- Battle system introduced

**Story Flags Set:**
- `game_started`
- `talked_to_dora`
- `left_house_first_time`
- `first_battle_tutorial`

**Success Criteria:**
- Player understands basic controls
- First battle completed (win or lose - it's practice)
- Player can navigate village

---

### Quest 2: "The Elder's Summons"
**Type:** Main Quest  
**Giver:** Elder  
**Prerequisites:** Complete "Morning in Vale"  
**Duration:** 10-15 minutes

**Objectives:**
1. Meet with Garet in the plaza
2. Go to Elder's house
3. Learn about Sol Sanctum and the Guardian Trial
4. Speak with Kraden about Alchemy and Psynergy

**Rewards:**
- Guardian Trial unlocked
- Psynergy system explained
- Bronze Badge quest becomes available

**Story Flags Set:**
- `elder_summons_complete`
- `learned_about_sanctum`
- `learned_about_trial`
- `met_kraden`
- `learned_psynergy_basics`

**Success Criteria:**
- Player understands the trial requirement
- Player knows they must defeat trainers to progress
- Alchemy/Psynergy lore delivered

---

### Quest 3: "Bronze Badge Challenge"
**Type:** Main Quest (Battle Progression)  
**Giver:** Elder (automatically active)  
**Prerequisites:** Complete "The Elder's Summons"  
**Duration:** 10-15 minutes

**Objectives:**
1. Defeat 3 Vale trainers in battle
2. Return to Elder to claim Bronze Badge

**Available Trainers (defeat any 3):**
- Villager 1-3 (easiest)
- Child 1-2 (easy, enthusiastic)
- Farmer 1 (moderate)
- Scholar 1 (reluctant but willing)
- Innkeeper (moderate)

**Rewards:**
- **Bronze Badge** earned
- 50 coins
- 2 Herbs (from Elder)
- Silver Badge quest unlocked

**Story Flags Set:**
- `bronze_badge_earned`
- `battles_won` +3 (minimum)
- Individual `defeated_[npc_id]` flags

**Success Criteria:**
- Player defeats at least 3 trainers
- Player understands battle system fully
- Progression feels rewarding

---

### Quest 4: "Silver Badge Challenge"
**Type:** Main Quest (Battle Progression)  
**Giver:** Elder (automatically active)  
**Prerequisites:** Earn Bronze Badge  
**Duration:** 15-20 minutes

**Objectives:**
1. Defeat 6 more Vale trainers (9 total)
2. Return to Elder to claim Silver Badge

**New Available Trainers:**
- Gate Guards (skilled)
- Villagers 4-7 (moderate)
- Farmers 2 (moderate)
- Barn Worker (moderate)
- Great Healer (skilled, optional)

**Optional Challenges:**
- Battle Garet (rival match)
- Battle Jenna (rival match)

**Rewards:**
- **Silver Badge** earned
- 100 coins
- Leather Armor OR Leather Cap (player choice)
- Gold Badge quest unlocked

**Story Flags Set:**
- `silver_badge_earned`
- `battles_won` +6 (minimum)

**Success Criteria:**
- Player has faced diverse opponents
- Player explores more of Vale
- Optional rival battles create emotional beats

---

### Quest 5: "Gold Badge Challenge"
**Type:** Main Quest (Battle Progression)  
**Giver:** Elder (automatically active)  
**Prerequisites:** Earn Silver Badge  
**Duration:** 15-20 minutes

**Objectives:**
1. Defeat 10 more Vale trainers (19 total)
2. Optional: Complete side quests for rewards
3. Return to Elder to claim Gold Badge

**Remaining Trainers:**
- Ivan (Jupiter Adept, skilled)
- Mia (Mercury Adept, skilled)
- Ferris/Blacksmith (veteran)
- Scholars 2-3 (reluctant)
- Storage Keeper, Merchant, etc. (moderate)
- Sanctum Guards (skilled)

**Rewards:**
- **Gold Badge** earned
- 150 coins
- Psy Crystal x3
- Kyle battle unlocked
- Warrior Badge quest unlocked

**Story Flags Set:**
- `gold_badge_earned`
- `battles_won` +10 (minimum)
- `kyle_unlocked`

**Success Criteria:**
- Player has explored entire village
- Player feels accomplished and ready for boss battles
- Anticipation builds for Kyle challenge

---

### Quest 6: "The Captain's Challenge"
**Type:** Main Quest (Boss Battle)  
**Giver:** Kyle (automatically available)  
**Prerequisites:** Earn Gold Badge  
**Duration:** 10-15 minutes

**Objectives:**
1. Speak with Kyle at the Guard Post
2. Defeat Kyle in combat
3. Receive Warrior Badge

**Boss Battle: Kyle**
- **Difficulty:** Hard
- **Element:** Mars (Fire)
- **Strategy:** Disciplined combatant, balanced offense/defense
- **Can be retried:** Yes, if player loses

**Rewards:**
- **Warrior Badge** earned
- 200 coins
- Iron Sword (equipment upgrade)
- Elder battle unlocked

**Story Flags Set:**
- `warrior_badge_earned`
- `defeated_kyle`
- `kyle_respect_earned`
- `challenged_elder` (available)

**Success Criteria:**
- Challenging but fair boss fight
- Emotional payoff (Kyle's respect speech)
- Player feels ready for final challenge

---

### Quest 7: "The Guardian Trial" (Final Boss)
**Type:** Main Quest (Final Boss Battle)  
**Giver:** Elder (automatically available)  
**Prerequisites:** Earn Warrior Badge  
**Duration:** 10-15 minutes

**Objectives:**
1. Return to Elder's house
2. Accept the final challenge
3. Defeat the Elder in combat
4. Receive Guardian Badge

**Boss Battle: Elder**
- **Difficulty:** Very Hard (hardest fight in Vale)
- **Element:** Venus (Earth)
- **Strategy:** Master tactician, uses advanced techniques
- **Can be retried:** Yes, Elder encourages trying again

**Rewards:**
- **Guardian Badge** earned
- Sol Sanctum access unlocked
- 300 coins
- 5 Herbs, 3 Antidotes, 3 Psy Crystals
- Title: "Guardian of Vale"

**Story Flags Set:**
- `guardian_badge_earned`
- `defeated_elder`
- `ready_for_sanctum`
- `elder_approval`

**Success Criteria:**
- Epic final boss fight
- Emotional story payoff
- Player feels like a true Guardian
- Gateway to Sol Sanctum (future content)

---

## 🌟 SIDE QUESTS

Optional content that enriches the world and provides additional rewards.

### Side Quest 1: "Lost Child"
**Type:** Side Quest (Rescue)  
**Giver:** Aaron OR Kay (Parent)  
**Location:** Plaza  
**Prerequisites:** Left house first time  
**Duration:** 5-10 minutes

**Story:**
A worried parent's child wandered toward the forest near Vale's edge. The tremors have made the area dangerous. Please find and return the child safely.

**Objectives:**
1. Talk to Aaron or Kay in the plaza
2. Find Child near the forest (west of village)
3. Use Psynergy to clear a fallen tree blocking the path
4. Return Child to parent

**Rewards:**
- 2 Herbs
- 30 coins
- Parent's gratitude
- `found_lost_child` flag

**Optional Variation:**
- Can battle the Child afterward (they're so inspired they want to spar!)

---

### Side Quest 2: "Farmer's Tools"
**Type:** Side Quest (Fetch/Exploration)  
**Giver:** Farmer 1  
**Location:** Farm District  
**Prerequisites:** None  
**Duration:** 5 minutes

**Story:**
The farmer lost his harvesting tools in the tall grass. He can't see them and needs help finding them.

**Objectives:**
1. Talk to Farmer 1
2. Search tall grass areas near barn
3. Use Psynergy "Reveal" or careful exploration to find 3 tools
4. Return tools to Farmer

**Rewards:**
- 2 Antidotes
- 20 coins
- `helped_farmer` flag

**Teaching Moment:**
- Teaches exploration mechanics
- Rewards thorough searching

---

### Side Quest 3: "Blacksmith's Request"
**Type:** Side Quest (Fetch & Craft)  
**Giver:** Ferris (Blacksmith)  
**Location:** Blacksmith Shop  
**Prerequisites:** Bronze Badge earned  
**Duration:** 10 minutes

**Story:**
Ferris wants to craft a special weapon but needs quality ore from near Mt. Aleph. Bring him the ore and he'll forge you something special.

**Objectives:**
1. Talk to Ferris at Blacksmith
2. Travel to Mt. Aleph foothills
3. Find "Star Ore" (hidden item)
4. Return to Ferris
5. Wait while he crafts (or rest at Inn)
6. Receive crafted weapon

**Rewards:**
- **Long Sword** (stronger than starting equipment)
- 50 coins
- `blacksmith_quest` flag
- Ferris becomes friendlier (dialogue changes)

**Optional:**
- Can battle Ferris after quest completion

---

### Side Quest 4: "The Healer's Medicine"
**Type:** Side Quest (Delivery)  
**Giver:** Great Healer  
**Location:** Great Healer's Dwelling  
**Prerequisites:** Met Kraden  
**Duration:** 5 minutes

**Story:**
The Great Healer prepared medicine for an elderly villager but is too busy to deliver it. Can you help?

**Objectives:**
1. Receive medicine from Great Healer
2. Find Elder Woman (villager) in residential district
3. Deliver medicine
4. Return to Great Healer

**Rewards:**
- 3 Herbs
- Healing Psynergy tutorial (cutscene)
- `delivered_medicine` flag

**Character Moment:**
- Shows Vale's community spirit
- Great Healer explains importance of caring for others

---

### Side Quest 5: "Rival Training" (Repeatable)
**Type:** Side Quest (Rival Battles)  
**Giver:** Garet OR Jenna  
**Location:** Various  
**Prerequisites:** Met party members  
**Duration:** 5 minutes per battle

**Story:**
Garet and Jenna want to train with Isaac. Battle them to strengthen bonds and improve skills.

**Objectives:**
1. Challenge Garet or Jenna to battle
2. Fight (win or lose, both are supportive)
3. Repeat anytime for training

**Rewards:**
- Friendship moments (dialogue changes based on # of battles)
- Small coin rewards (20-30 per battle)
- `battled_garet` / `battled_jenna` flags
- `garet_rivalry_level` / `jenna_rivalry_level` counters

**Special:**
- After 5 battles with each: Special dialogue about friendship
- After 10 battles total: They give you a "Friendship Trinket" (accessory)

---

### Side Quest 6: "The Scholar's Debate" (Optional)
**Type:** Side Quest (Knowledge)  
**Giver:** Scholar 1, 2, OR 3  
**Location:** Plaza or Elder's House  
**Prerequisites:** Met Kraden  
**Duration:** 5-10 minutes

**Story:**
The three scholars are debating whether Alchemy is real or myth. They ask Isaac (who has Psynergy) to settle the argument by demonstrating his powers.

**Objectives:**
1. Talk to all three scholars
2. Demonstrate Psynergy (move an object)
3. Answer their questions about Alchemy (dialogue choices)
4. Optional: Battle one of them to prove Adepts are real warriors

**Rewards:**
- Lore about Alchemy's history
- 40 coins
- Scholars respect you (better dialogue)
- `scholar_debate` flag

**Teaching Moment:**
- Reinforces Alchemy lore
- Shows different perspectives on Psynergy in the world

---

### Side Quest 7: "The Innkeeper's Story"
**Type:** Side Quest (Dialogue/Lore)  
**Giver:** Innkeeper  
**Location:** Inn  
**Prerequisites:** Silver Badge earned  
**Duration:** 5 minutes

**Story:**
After hearing about Isaac's battles, the Innkeeper shares stories about Isaac's father completing the Guardian Trial years ago.

**Objectives:**
1. Talk to Innkeeper (triggers after Silver Badge)
2. Listen to story (cutscene dialogue)
3. Optional: Battle Innkeeper in his father's honor

**Rewards:**
- Emotional connection to Isaac's father
- Lore about previous Guardians
- Herb x3 (from Innkeeper as gift)
- `innkeeper_story` flag

**Character Moment:**
- Deepens Isaac's motivation
- World-building about Vale's history

---

### Side Quest 8: "Completionist Challenge"
**Type:** Side Quest (Meta Achievement)  
**Giver:** Elder  
**Location:** Elder's House  
**Prerequisites:** Defeated all 48 NPCs who can battle  
**Duration:** N/A (tracked automatically)

**Story:**
For those who challenge every single trainer in Vale, the Elder acknowledges this extraordinary feat.

**Objectives:**
1. Defeat every single NPC who offers battles (approximately 30-35 NPCs)
2. Return to Elder

**Rewards:**
- **Title:** "Champion of Vale"
- **Special Equipment:** "Guardian's Crest" (powerful accessory)
- 500 coins
- `defeated_all_optional_trainers` flag
- Special dialogue from Elder: "Truly remarkable. Your dedication surpasses even your father's."

**For Completionists:**
- Optional challenge for dedicated players
- Requires exploring every corner of Vale
- Ultimate bragging rights

---

## 📊 QUEST STATISTICS

### Main Quests
- **Total:** 7 quests
- **Playtime:** 70-100 minutes (completionist path)
- **Playtime:** 40-50 minutes (speedrun path)

### Side Quests
- **Total:** 8 quests
- **Playtime:** 30-50 minutes (all side quests)
- **Optional:** Can complete story without side quests

### Total Content
- **15 quests total**
- **100-150 minutes** of gameplay (full completion)
- **Replayability:** Rival battles repeatable, multiple paths

---

## 🎮 QUEST PROGRESSION FLOW

### Linear (Main Quest)
```
Morning in Vale → Elder's Summons → Bronze Badge → Silver Badge → Gold Badge → Kyle Boss → Elder Boss → Sol Sanctum
```

### Branching (Side Quests)
- Can be completed in any order
- Some unlock after story progression
- Optional but rewarding

### Recommended Play Pattern
1. Complete tutorial
2. Get Bronze Badge + 1-2 side quests
3. Get Silver Badge + 2-3 side quests
4. Complete remaining exploration/side quests
5. Get Gold Badge
6. Final preparations
7. Boss battles
8. Sol Sanctum ready

---

## ✅ QUEST DESIGN - QUALITY GATES

### Structural Quality
- ✅ Clear main quest path
- ✅ Optional side content doesn't block story
- ✅ Progressive difficulty in battles
- ✅ Variety in quest types (battle, fetch, delivery, dialogue)

### Reward Balance
- ✅ Main quests give progression (badges)
- ✅ Side quests give items and lore
- ✅ Battles give coins and experience
- ✅ Completionists get special rewards

### Story Integration
- ✅ Quests support story themes
- ✅ Battle progression feels natural
- ✅ Side quests add character depth
- ✅ All quests respect story flags

### Player Experience
- ✅ Always clear what to do next
- ✅ Optional content clearly marked
- ✅ Multiple paths to goals
- ✅ Rewarding to explore

---

**QUEST DESIGN COMPLETE**

*This document defines all quest structures for Vale Village. Next: Create questData.ts with complete quest definitions.*

---

**Next Phase:** Create questData.ts with programmatic quest definitions.
