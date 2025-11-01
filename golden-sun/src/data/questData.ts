/**
 * Quest Data for Golden Sun: Vale Village
 * Defines all main and side quests
 */

import { Quest, QuestRegistry } from '../types/quest';

// ============================================================================
// MAIN QUEST LINE - Battle Progression
// ============================================================================

const QUEST_MORNING_IN_VALE: Quest = {
  id: 'morning_in_vale',
  title: 'Morning in Vale',
  description: 'Wake up and begin your day in Vale Village. Your mother is calling you for breakfast.',
  questGiver: 'dora',
  questGiverLocation: "Isaac's House",
  
  type: 'main',
  difficulty: 'tutorial',
  
  objectives: [
    {
      id: 'talk_to_dora',
      description: 'Talk to your mother Dora',
      type: 'talk',
      target: 'dora',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'leave_house',
      description: 'Leave the house and explore Vale',
      type: 'visit',
      target: 'vale_exterior',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'battle_garet_tutorial',
      description: 'Practice battle with Garet',
      type: 'battle',
      target: 'garet',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'flag',
      id: 'first_battle_tutorial',
      name: 'Battle Tutorial Complete'
    }
  ],
  
  prerequisite: undefined,
  unlocks: 'elder_summons',
  status: 'available'
};

const QUEST_ELDER_SUMMONS: Quest = {
  id: 'elder_summons',
  title: "The Elder's Summons",
  description: 'The Elder has called for you urgently. Something about the tremors and Sol Sanctum...',
  questGiver: 'elder',
  questGiverLocation: "Elder's House",
  
  type: 'main',
  difficulty: 'easy',
  
  objectives: [
    {
      id: 'meet_garet',
      description: 'Find Garet in the plaza',
      type: 'talk',
      target: 'garet',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'talk_to_elder',
      description: "Report to the Elder's house",
      type: 'talk',
      target: 'elder',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'learn_about_trial',
      description: 'Learn about the Guardian Trial',
      type: 'talk',
      target: 'elder',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'talk_to_kraden',
      description: 'Speak with Kraden about Alchemy',
      type: 'talk',
      target: 'kraden',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'flag',
      id: 'elder_summons_complete',
      name: 'Elder Quest Complete'
    },
    {
      type: 'flag',
      id: 'learned_about_trial',
      name: 'Guardian Trial Unlocked'
    }
  ],
  
  prerequisite: 'morning_in_vale',
  unlocks: 'bronze_badge_challenge',
  status: 'locked'
};

const QUEST_BRONZE_BADGE: Quest = {
  id: 'bronze_badge_challenge',
  title: 'Bronze Badge Challenge',
  description: 'Prove your worth by defeating 3 Vale trainers. Earn the Bronze Badge to continue the Guardian Trial.',
  questGiver: 'elder',
  questGiverLocation: "Elder's House",
  
  type: 'main',
  difficulty: 'easy',
  
  objectives: [
    {
      id: 'defeat_trainers',
      description: 'Defeat 3 Vale trainers in battle (0/3)',
      type: 'count',
      current: 0,
      required: 3,
      completed: false
    },
    {
      id: 'return_to_elder',
      description: 'Return to the Elder to claim your badge',
      type: 'talk',
      target: 'elder',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'badge',
      id: 'bronze_badge',
      name: 'Bronze Badge'
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 50,
      name: '50 Coins'
    },
    {
      type: 'item',
      id: 'herb',
      amount: 2,
      name: '2 Herbs'
    },
    {
      type: 'flag',
      id: 'bronze_badge_earned',
      name: 'Bronze Badge Earned'
    }
  ],
  
  prerequisite: 'elder_summons',
  unlocks: 'silver_badge_challenge',
  status: 'locked'
};

const QUEST_SILVER_BADGE: Quest = {
  id: 'silver_badge_challenge',
  title: 'Silver Badge Challenge',
  description: 'Continue proving your strength. Defeat 9 trainers total to earn the Silver Badge.',
  questGiver: 'elder',
  questGiverLocation: "Elder's House",
  
  type: 'main',
  difficulty: 'moderate',
  
  objectives: [
    {
      id: 'defeat_trainers',
      description: 'Defeat 9 Vale trainers total (includes Bronze Badge battles)',
      type: 'count',
      current: 0,
      required: 9,
      completed: false
    },
    {
      id: 'return_to_elder',
      description: 'Return to the Elder to claim your badge',
      type: 'talk',
      target: 'elder',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'badge',
      id: 'silver_badge',
      name: 'Silver Badge'
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 100,
      name: '100 Coins'
    },
    {
      type: 'equipment',
      id: 'leather_armor',
      name: 'Leather Armor'
    },
    {
      type: 'flag',
      id: 'silver_badge_earned',
      name: 'Silver Badge Earned'
    }
  ],
  
  prerequisite: 'bronze_badge_challenge',
  unlocks: 'gold_badge_challenge',
  status: 'locked'
};

const QUEST_GOLD_BADGE: Quest = {
  id: 'gold_badge_challenge',
  title: 'Gold Badge Challenge',
  description: "You're approaching mastery. Defeat 19 trainers total to earn the Gold Badge and face Kyle.",
  questGiver: 'elder',
  questGiverLocation: "Elder's House",
  
  type: 'main',
  difficulty: 'moderate',
  
  objectives: [
    {
      id: 'defeat_trainers',
      description: 'Defeat 19 Vale trainers total',
      type: 'count',
      current: 0,
      required: 19,
      completed: false
    },
    {
      id: 'return_to_elder',
      description: 'Return to the Elder to claim your badge',
      type: 'talk',
      target: 'elder',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'badge',
      id: 'gold_badge',
      name: 'Gold Badge'
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 150,
      name: '150 Coins'
    },
    {
      type: 'item',
      id: 'psy_crystal',
      amount: 3,
      name: '3 Psy Crystals'
    },
    {
      type: 'flag',
      id: 'gold_badge_earned',
      name: 'Gold Badge Earned'
    },
    {
      type: 'flag',
      id: 'kyle_unlocked',
      name: 'Can Challenge Kyle'
    }
  ],
  
  prerequisite: 'silver_badge_challenge',
  unlocks: 'captain_challenge',
  status: 'locked'
};

const QUEST_CAPTAIN_CHALLENGE: Quest = {
  id: 'captain_challenge',
  title: "The Captain's Challenge",
  description: 'Kyle, the Guard Captain, stands between you and the final trial. Defeat him to earn the Warrior Badge.',
  questGiver: 'kyle',
  questGiverLocation: 'Guard Post',
  
  type: 'main',
  difficulty: 'hard',
  
  objectives: [
    {
      id: 'challenge_kyle',
      description: 'Speak with Kyle at the Guard Post',
      type: 'talk',
      target: 'kyle',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'defeat_kyle',
      description: 'Defeat Kyle in combat',
      type: 'battle',
      target: 'kyle',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'badge',
      id: 'warrior_badge',
      name: 'Warrior Badge'
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 200,
      name: '200 Coins'
    },
    {
      type: 'equipment',
      id: 'iron_sword',
      name: 'Iron Sword'
    },
    {
      type: 'flag',
      id: 'warrior_badge_earned',
      name: 'Warrior Badge Earned'
    },
    {
      type: 'flag',
      id: 'challenged_elder',
      name: 'Can Challenge Elder'
    }
  ],
  
  prerequisite: 'gold_badge_challenge',
  unlocks: 'guardian_trial',
  status: 'locked'
};

const QUEST_GUARDIAN_TRIAL: Quest = {
  id: 'guardian_trial',
  title: 'The Guardian Trial',
  description: 'The final test. Defeat the Elder to earn the Guardian Badge and unlock Sol Sanctum.',
  questGiver: 'elder',
  questGiverLocation: "Elder's House",
  
  type: 'main',
  difficulty: 'boss',
  
  objectives: [
    {
      id: 'challenge_elder',
      description: 'Accept the Elder\'s final challenge',
      type: 'talk',
      target: 'elder',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'defeat_elder',
      description: 'Defeat the Elder in combat',
      type: 'battle',
      target: 'elder',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'badge',
      id: 'guardian_badge',
      name: 'Guardian Badge'
    },
    {
      type: 'title',
      id: 'guardian_of_vale',
      name: 'Guardian of Vale'
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 300,
      name: '300 Coins'
    },
    {
      type: 'item',
      id: 'herb',
      amount: 5,
      name: '5 Herbs'
    },
    {
      type: 'item',
      id: 'antidote',
      amount: 3,
      name: '3 Antidotes'
    },
    {
      type: 'item',
      id: 'psy_crystal',
      amount: 3,
      name: '3 Psy Crystals'
    },
    {
      type: 'flag',
      id: 'guardian_badge_earned',
      name: 'Guardian Badge Earned'
    },
    {
      type: 'flag',
      id: 'ready_for_sanctum',
      name: 'Sol Sanctum Access Unlocked'
    }
  ],
  
  prerequisite: 'captain_challenge',
  unlocks: 'sol_sanctum_access',
  status: 'locked'
};

// ============================================================================
// SIDE QUESTS
// ============================================================================

const QUEST_LOST_CHILD: Quest = {
  id: 'lost_child',
  title: 'Lost Child',
  description: 'A worried parent\'s child wandered toward the forest. Find and return them safely.',
  questGiver: 'aaron',
  questGiverLocation: 'Plaza',
  
  type: 'side',
  difficulty: 'easy',
  
  objectives: [
    {
      id: 'talk_to_parent',
      description: 'Talk to the worried parent',
      type: 'talk',
      target: 'aaron',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'find_child',
      description: 'Find the child near the forest',
      type: 'visit',
      target: 'forest_edge',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'clear_path',
      description: 'Use Psynergy to clear the blocked path',
      type: 'explore',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'return_child',
      description: 'Return the child to their parent',
      type: 'deliver',
      target: 'aaron',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'item',
      id: 'herb',
      amount: 2,
      name: '2 Herbs'
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 30,
      name: '30 Coins'
    },
    {
      type: 'flag',
      id: 'found_lost_child',
      name: 'Rescued Lost Child'
    }
  ],
  
  prerequisite: 'left_house_first_time',
  status: 'locked'
};

const QUEST_FARMER_TOOLS: Quest = {
  id: 'farmer_tools',
  title: "Farmer's Tools",
  description: 'Help the farmer find his harvesting tools lost in the tall grass.',
  questGiver: 'farmer-1',
  questGiverLocation: 'Farm District',
  
  type: 'side',
  difficulty: 'easy',
  
  objectives: [
    {
      id: 'accept_quest',
      description: 'Talk to the farmer',
      type: 'talk',
      target: 'farmer-1',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'find_tools',
      description: 'Find 3 tools in the tall grass (0/3)',
      type: 'collect',
      target: 'farming_tool',
      current: 0,
      required: 3,
      completed: false
    },
    {
      id: 'return_tools',
      description: 'Return the tools to the farmer',
      type: 'deliver',
      target: 'farmer-1',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'item',
      id: 'antidote',
      amount: 2,
      name: '2 Antidotes'
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 20,
      name: '20 Coins'
    },
    {
      type: 'flag',
      id: 'helped_farmer',
      name: 'Helped Farmer'
    }
  ],
  
  prerequisite: undefined,
  status: 'available'
};

const QUEST_BLACKSMITH_REQUEST: Quest = {
  id: 'blacksmith_request',
  title: "Blacksmith's Request",
  description: 'Ferris needs quality ore from Mt. Aleph to forge a special weapon.',
  questGiver: 'blacksmith',
  questGiverLocation: 'Blacksmith Shop',
  
  type: 'side',
  difficulty: 'moderate',
  
  objectives: [
    {
      id: 'talk_to_ferris',
      description: 'Talk to Ferris at the Blacksmith',
      type: 'talk',
      target: 'blacksmith',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'find_star_ore',
      description: 'Find Star Ore near Mt. Aleph',
      type: 'explore',
      target: 'star_ore',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'return_ore',
      description: 'Return the ore to Ferris',
      type: 'deliver',
      target: 'blacksmith',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'wait_for_craft',
      description: 'Wait for Ferris to finish crafting (rest at Inn or explore)',
      type: 'visit',
      target: 'inn',
      current: 0,
      required: 1,
      completed: false,
      optional: true
    },
    {
      id: 'receive_weapon',
      description: 'Return to Ferris to receive your weapon',
      type: 'talk',
      target: 'blacksmith',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'equipment',
      id: 'long_sword',
      name: 'Long Sword'
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 50,
      name: '50 Coins'
    },
    {
      type: 'flag',
      id: 'blacksmith_quest',
      name: 'Blacksmith Quest Complete'
    }
  ],
  
  prerequisite: 'bronze_badge_earned',
  status: 'locked'
};

const QUEST_HEALER_MEDICINE: Quest = {
  id: 'healer_medicine',
  title: "The Healer's Medicine",
  description: 'Deliver medicine to an elderly villager for the Great Healer.',
  questGiver: 'great-healer',
  questGiverLocation: "Great Healer's Dwelling",
  
  type: 'side',
  difficulty: 'easy',
  
  objectives: [
    {
      id: 'receive_medicine',
      description: 'Receive medicine from the Great Healer',
      type: 'talk',
      target: 'great-healer',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'find_villager',
      description: 'Find the elderly villager in residential district',
      type: 'visit',
      target: 'elder-woman-1',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'deliver_medicine',
      description: 'Deliver the medicine',
      type: 'deliver',
      target: 'elder-woman-1',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'report_back',
      description: 'Return to the Great Healer',
      type: 'talk',
      target: 'great-healer',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'item',
      id: 'herb',
      amount: 3,
      name: '3 Herbs'
    },
    {
      type: 'flag',
      id: 'delivered_medicine',
      name: 'Delivered Medicine'
    }
  ],
  
  prerequisite: 'met_kraden',
  status: 'locked'
};

const QUEST_RIVAL_TRAINING: Quest = {
  id: 'rival_training',
  title: 'Rival Training',
  description: 'Train with Garet and Jenna to strengthen your bonds and skills.',
  questGiver: 'garet',
  questGiverLocation: 'Various',
  
  type: 'side',
  difficulty: 'moderate',
  repeatable: true,
  timesCompleted: 0,
  
  objectives: [
    {
      id: 'battle_garet',
      description: 'Battle Garet',
      type: 'battle',
      target: 'garet',
      current: 0,
      required: 1,
      completed: false,
      optional: true
    },
    {
      id: 'battle_jenna',
      description: 'Battle Jenna',
      type: 'battle',
      target: 'jenna',
      current: 0,
      required: 1,
      completed: false,
      optional: true
    }
  ],
  
  rewards: [
    {
      type: 'coins',
      id: 'coins',
      amount: 25,
      name: '25 Coins'
    },
    {
      type: 'flag',
      id: 'battled_rival',
      name: 'Rival Battle Complete'
    }
  ],
  
  prerequisite: 'met_garet',
  status: 'locked'
};

const QUEST_SCHOLAR_DEBATE: Quest = {
  id: 'scholar_debate',
  title: "The Scholar's Debate",
  description: 'Settle the scholars\' debate about whether Alchemy is real by demonstrating your Psynergy.',
  questGiver: 'scholar-1',
  questGiverLocation: 'Plaza',
  
  type: 'side',
  difficulty: 'easy',
  
  objectives: [
    {
      id: 'talk_to_scholars',
      description: 'Talk to all three scholars (0/3)',
      type: 'count',
      current: 0,
      required: 3,
      completed: false
    },
    {
      id: 'demonstrate_psynergy',
      description: 'Demonstrate Psynergy by moving an object',
      type: 'explore',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'answer_questions',
      description: 'Answer the scholars\' questions about Alchemy',
      type: 'talk',
      target: 'scholar-1',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'coins',
      id: 'coins',
      amount: 40,
      name: '40 Coins'
    },
    {
      type: 'flag',
      id: 'scholar_debate',
      name: 'Settled Scholar Debate'
    }
  ],
  
  prerequisite: 'met_kraden',
  status: 'locked'
};

const QUEST_INNKEEPER_STORY: Quest = {
  id: 'innkeeper_story',
  title: "The Innkeeper's Story",
  description: "Listen to the Innkeeper's stories about your father's Guardian Trial.",
  questGiver: 'innkeeper',
  questGiverLocation: 'Inn',
  
  type: 'side',
  difficulty: 'easy',
  
  objectives: [
    {
      id: 'trigger_story',
      description: 'Talk to the Innkeeper',
      type: 'talk',
      target: 'innkeeper',
      current: 0,
      required: 1,
      completed: false
    },
    {
      id: 'listen_to_story',
      description: 'Listen to the story about your father',
      type: 'talk',
      target: 'innkeeper',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'item',
      id: 'herb',
      amount: 3,
      name: '3 Herbs'
    },
    {
      type: 'flag',
      id: 'innkeeper_story',
      name: 'Heard Father\'s Story'
    }
  ],
  
  prerequisite: 'silver_badge_earned',
  status: 'locked'
};

const QUEST_COMPLETIONIST: Quest = {
  id: 'completionist_challenge',
  title: 'Champion of Vale',
  description: 'Defeat every single trainer in Vale Village to prove you are the ultimate champion.',
  questGiver: 'elder',
  questGiverLocation: "Elder's House",
  
  type: 'side',
  difficulty: 'boss',
  
  objectives: [
    {
      id: 'defeat_all_trainers',
      description: 'Defeat all trainers in Vale (0/35)',
      type: 'count',
      current: 0,
      required: 35,
      completed: false
    },
    {
      id: 'report_to_elder',
      description: 'Return to the Elder',
      type: 'talk',
      target: 'elder',
      current: 0,
      required: 1,
      completed: false
    }
  ],
  
  rewards: [
    {
      type: 'title',
      id: 'champion_of_vale',
      name: 'Champion of Vale'
    },
    {
      type: 'equipment',
      id: 'guardian_crest',
      name: "Guardian's Crest"
    },
    {
      type: 'coins',
      id: 'coins',
      amount: 500,
      name: '500 Coins'
    },
    {
      type: 'flag',
      id: 'defeated_all_optional_trainers',
      name: 'Defeated All Trainers'
    }
  ],
  
  prerequisite: 'guardian_badge_earned',
  status: 'locked'
};

// ============================================================================
// QUEST REGISTRY - Export all quests
// ============================================================================

export const QUEST_DATA: QuestRegistry = {
  // Main Quests
  'morning_in_vale': QUEST_MORNING_IN_VALE,
  'elder_summons': QUEST_ELDER_SUMMONS,
  'bronze_badge_challenge': QUEST_BRONZE_BADGE,
  'silver_badge_challenge': QUEST_SILVER_BADGE,
  'gold_badge_challenge': QUEST_GOLD_BADGE,
  'captain_challenge': QUEST_CAPTAIN_CHALLENGE,
  'guardian_trial': QUEST_GUARDIAN_TRIAL,
  
  // Side Quests
  'lost_child': QUEST_LOST_CHILD,
  'farmer_tools': QUEST_FARMER_TOOLS,
  'blacksmith_request': QUEST_BLACKSMITH_REQUEST,
  'healer_medicine': QUEST_HEALER_MEDICINE,
  'rival_training': QUEST_RIVAL_TRAINING,
  'scholar_debate': QUEST_SCHOLAR_DEBATE,
  'innkeeper_story': QUEST_INNKEEPER_STORY,
  'completionist_challenge': QUEST_COMPLETIONIST
};

/**
 * Get quest by ID
 */
export function getQuest(questId: string): Quest | undefined {
  return QUEST_DATA[questId];
}

/**
 * Get all available quests based on story flags
 */
export function getAvailableQuests(
  flags: Record<string, boolean | number>
): Quest[] {
  return Object.values(QUEST_DATA).filter(quest => {
    if (quest.status === 'completed') return false;
    if (!quest.prerequisite) return true;
    
    // Check prerequisite
    if (Array.isArray(quest.prerequisite)) {
      return quest.prerequisite.every(prereq => flags[prereq]);
    }
    return !!flags[quest.prerequisite];
  });
}

/**
 * Get active quests
 */
export function getActiveQuests(quests: QuestRegistry): Quest[] {
  return Object.values(quests).filter(q => q.status === 'active');
}

/**
 * Get completed quests
 */
export function getCompletedQuests(quests: QuestRegistry): Quest[] {
  return Object.values(quests).filter(q => q.status === 'completed');
}
