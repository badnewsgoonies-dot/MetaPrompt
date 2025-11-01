/**
 * Dialogue Data for Golden Sun: Vale Village
 * Contains all NPC dialogue trees with battle challenges and story variations
 */

import { DialogueTree, DialogueRegistry } from '../types/dialogue';

// ============================================================================
// MAJOR NPCs - Rich Dialogue Trees
// ============================================================================

const GARET_DIALOGUE: DialogueTree = {
  id: 'garet-intro',
  npcId: 'garet',
  start: 'greeting',
  lines: {
    // Initial greeting (before battle tutorial)
    greeting: {
      id: 'greeting',
      speaker: 'Garet',
      text: "Isaac! There you are! Did you feel those tremors last night? They shook my whole house!",
      condition: '!first_battle_tutorial',
      next: 'tutorial_offer'
    },
    tutorial_offer: {
      id: 'tutorial_offer',
      speaker: 'Garet',
      text: "Hey, want to spar like old times? Might take our minds off the earthquakes!",
      choices: [
        { text: "Sure, let's battle!", next: 'tutorial_accept' },
        { text: "Maybe later.", next: 'tutorial_decline' }
      ],
      next: ['tutorial_accept', 'tutorial_decline']
    },
    tutorial_accept: {
      id: 'tutorial_accept',
      speaker: 'Garet',
      text: "Yes! Alright, let's see what you've got! Don't hold back!",
      setFlag: 'tutorial_battle_accepted',
      action: { type: 'battle', npcId: 'garet' },
      next: 'post_tutorial_battle'
    },
    tutorial_decline: {
      id: 'tutorial_decline',
      speaker: 'Garet',
      text: "Aw, come on! Fine, but you can't avoid me forever! Everyone in Vale trains together - it's tradition!",
      next: 'end'
    },
    post_tutorial_battle: {
      id: 'post_tutorial_battle',
      speaker: 'Garet',
      text: "Nice! You're getting stronger, Isaac! That's the spirit of Vale - we push each other to improve!",
      setFlag: 'first_battle_tutorial',
      next: 'elder_mention'
    },
    elder_mention: {
      id: 'elder_mention',
      speaker: 'Garet',
      text: "Oh, by the way - the Elder wants to see us. Said it's urgent. Something about the tremors...",
      next: 'end'
    },

    // After tutorial (general dialogue)
    general_greeting: {
      id: 'general_greeting',
      speaker: 'Garet',
      text: "Hey Isaac! What's up?",
      condition: 'first_battle_tutorial && !elder_summons_complete',
      next: 'general_options'
    },
    general_options: {
      id: 'general_options',
      speaker: 'Garet',
      text: "Want to battle again, or should we head to the Elder's house?",
      choices: [
        { text: "Let's battle!", next: 'battle_accept' },
        { text: "Let's see the Elder.", next: 'elder_reminder' },
        { text: "Just talking.", next: 'casual_chat' }
      ],
      next: ['battle_accept', 'elder_reminder', 'casual_chat']
    },

    // Rival battle (can repeat)
    battle_accept: {
      id: 'battle_accept',
      speaker: 'Garet',
      text: "You want to battle? Bring it on! I've been practicing!",
      action: { type: 'battle', npcId: 'garet' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Garet',
      text: "Whew! Good match! You're really improving! Want to go again sometime?",
      setFlag: 'battled_garet',
      next: 'end'
    },

    // After Elder meeting
    after_trial_explained: {
      id: 'after_trial_explained',
      speaker: 'Garet',
      text: "So we have to prove ourselves in battle to enter Sol Sanctum? Sounds intense!",
      condition: 'learned_about_trial',
      next: 'encouragement'
    },
    encouragement: {
      id: 'encouragement',
      speaker: 'Garet',
      text: "But if anyone can do it, it's you, Isaac! I'll help however I can. We're in this together!",
      next: 'end'
    },

    // Progress acknowledgment
    bronze_react: {
      id: 'bronze_react',
      speaker: 'Garet',
      text: "You got the Bronze Badge? Nice! You're climbing the ranks! Keep it up!",
      condition: 'bronze_badge_earned && !silver_badge_earned',
      next: 'end'
    },
    silver_react: {
      id: 'silver_react',
      speaker: 'Garet',
      text: "Silver Badge! Man, you're on fire! ...Wait, that's my thing. You know what I mean!",
      condition: 'silver_badge_earned && !gold_badge_earned',
      next: 'end'
    },
    gold_react: {
      id: 'gold_react',
      speaker: 'Garet',
      text: "Gold Badge?! Isaac, that's amazing! You're almost ready to face Kyle!",
      condition: 'gold_badge_earned && !warrior_badge_earned',
      next: 'end'
    },
    warrior_react: {
      id: 'warrior_react',
      speaker: 'Garet',
      text: "You beat my dad?! I can't believe it! He's been training for years! Now you just have to face the Elder...",
      condition: 'warrior_badge_earned && !guardian_badge_earned',
      next: 'end'
    },
    guardian_react: {
      id: 'guardian_react',
      speaker: 'Garet',
      text: "You defeated the Elder... Isaac, you're incredible! Sol Sanctum is waiting for us!",
      condition: 'guardian_badge_earned',
      next: 'end'
    },

    // Casual chat
    casual_chat: {
      id: 'casual_chat',
      speaker: 'Garet',
      text: "I'm a bit worried about these tremors, to be honest. But with you around, I feel better. We'll figure it out!",
      next: 'end'
    },
    elder_reminder: {
      id: 'elder_reminder',
      speaker: 'Garet',
      text: "Yeah, let's go see what the Elder wants. Hope it's nothing too serious...",
      next: 'end'
    },

    end: {
      id: 'end',
      speaker: 'Garet',
      text: "See you around, Isaac!",
      next: undefined
    }
  }
};

const DORA_DIALOGUE: DialogueTree = {
  id: 'dora-greeting',
  npcId: 'dora',
  start: 'morning_greeting',
  lines: {
    // First morning greeting
    morning_greeting: {
      id: 'morning_greeting',
      speaker: 'Dora',
      text: "Good morning, dear. Did you sleep well? Those tremors last night were rather concerning...",
      condition: '!talked_to_dora',
      next: 'morning_chat'
    },
    morning_chat: {
      id: 'morning_chat',
      speaker: 'Dora',
      text: "I've made your favorite breakfast. You'll need your strength today - the Elder mentioned he might need your help.",
      next: 'father_mention'
    },
    father_mention: {
      id: 'father_mention',
      speaker: 'Dora',
      text: "Your father would be so proud of who you're becoming, Isaac. Strong, kind, and responsible. Just like him.",
      setFlag: 'talked_to_dora',
      next: 'encourage_explore'
    },
    encourage_explore: {
      id: 'encourage_explore',
      speaker: 'Dora',
      text: "Go on, explore the village if you'd like. But do check in with the Elder when you have a chance.",
      next: 'end'
    },

    // After learning about trial
    trial_worry: {
      id: 'trial_worry',
      speaker: 'Dora',
      text: "I heard about the Guardian Trial... Isaac, I know you're strong, but please be careful.",
      condition: 'learned_about_trial && !bronze_badge_earned',
      next: 'mother_support'
    },
    mother_support: {
      id: 'mother_support',
      speaker: 'Dora',
      text: "Your father completed this trial long ago. He was so nervous! But he succeeded, and I know you will too.",
      next: 'end'
    },

    // Progress reactions
    proud_bronze: {
      id: 'proud_bronze',
      speaker: 'Dora',
      text: "You earned the Bronze Badge? Oh, Isaac! I'm so proud of you!",
      condition: 'bronze_badge_earned',
      next: 'end'
    },
    proud_progress: {
      id: 'proud_progress',
      speaker: 'Dora',
      text: "I've heard about your battles. You're becoming quite the warrior. Just... please don't take unnecessary risks.",
      condition: 'silver_badge_earned || gold_badge_earned',
      next: 'end'
    },

    // Before Sol Sanctum
    final_goodbye: {
      id: 'final_goodbye',
      speaker: 'Dora',
      text: "Sol Sanctum... that place took your father from me. But I know you must go. Just... come home safe. That's all I ask.",
      condition: 'guardian_badge_earned && !entered_sanctum',
      next: 'blessing'
    },
    blessing: {
      id: 'blessing',
      speaker: 'Dora',
      text: "I've packed you some food for the journey. Be brave, be careful, and remember - you're never alone. Your father's spirit and my love go with you.",
      action: { type: 'give_item', itemId: 'herb', amount: 3 },
      next: 'end'
    },

    // General dialogue
    general: {
      id: 'general',
      speaker: 'Dora',
      text: "Is everything alright, dear? You know you can always talk to me.",
      next: 'end'
    },

    end: {
      id: 'end',
      speaker: 'Dora',
      text: "Take care, Isaac. I'll be here when you need me.",
      next: undefined
    }
  }
};

const ELDER_DIALOGUE: DialogueTree = {
  id: 'elder-warning',
  npcId: 'elder',
  start: 'first_summons',
  lines: {
    // First meeting
    first_summons: {
      id: 'first_summons',
      speaker: 'Elder',
      text: "Ah, Isaac and Garet. Thank you for coming so quickly. The matter is... urgent.",
      condition: '!elder_summons_complete',
      next: 'earthquake_explain'
    },
    earthquake_explain: {
      id: 'earthquake_explain',
      speaker: 'Elder',
      text: "The tremors are growing stronger. They originate from Mt. Aleph... from Sol Sanctum. I fear the ancient seal is weakening.",
      next: 'sanctum_history'
    },
    sanctum_history: {
      id: 'sanctum_history',
      speaker: 'Elder',
      text: "Three years ago, the Cataclysm took many from us. Since then, I've kept Sol Sanctum sealed. But now... forces may be at work that we cannot ignore.",
      next: 'guardian_reveal'
    },
    guardian_reveal: {
      id: 'guardian_reveal',
      speaker: 'Elder',
      text: "Isaac, your father was a Guardian - a protector of Sol Sanctum's secrets. Now, that responsibility falls to you. But you must prove yourself worthy.",
      next: 'trial_explain'
    },
    trial_explain: {
      id: 'trial_explain',
      speaker: 'Elder',
      text: "The Guardian Trial is ancient tradition. Defeat Vale's warriors. Earn your badges. Only then may you face me in combat. Only then may you enter Sol Sanctum.",
      next: 'trial_reason'
    },
    trial_reason: {
      id: 'trial_reason',
      speaker: 'Elder',
      text: "This is not cruelty, but necessity. What lies within Sol Sanctum will test you beyond measure. You must be ready - in body, mind, and spirit.",
      setFlag: ['elder_summons_complete', 'learned_about_trial', 'learned_about_sanctum'],
      next: 'good_luck'
    },
    good_luck: {
      id: 'good_luck',
      speaker: 'Elder',
      text: "Go now. Begin your trials. Return when you have earned the Warrior Badge. Then, and only then, will I test you myself.",
      next: 'end'
    },

    // Progress check-ins
    no_badge: {
      id: 'no_badge',
      speaker: 'Elder',
      text: "You have not yet begun your trials. Speak with the villagers. Challenge them to battle. Prove your worth.",
      condition: 'learned_about_trial && !bronze_badge_earned',
      next: 'end'
    },
    bronze_earned: {
      id: 'bronze_earned',
      speaker: 'Elder',
      text: "Bronze Badge earned. You've taken your first steps. But the path ahead grows more challenging. Continue your training.",
      condition: 'bronze_badge_earned && !silver_badge_earned',
      next: 'end'
    },
    silver_earned: {
      id: 'silver_earned',
      speaker: 'Elder',
      text: "Silver Badge. You show great promise, Isaac. Your father would be pleased. But do not grow complacent.",
      condition: 'silver_badge_earned && !gold_badge_earned',
      next: 'end'
    },
    gold_earned: {
      id: 'gold_earned',
      speaker: 'Elder',
      text: "The Gold Badge. Impressive. You've proven yourself to the village. Now you must face our strongest - Captain Kyle. Defeat him, and your trial nears completion.",
      condition: 'gold_badge_earned && !warrior_badge_earned',
      next: 'end'
    },

    // Kyle defeated, can now challenge Elder
    kyle_defeated: {
      id: 'kyle_defeated',
      speaker: 'Elder',
      text: "So... you have defeated Kyle. He is our finest warrior, yet you bested him. You've come far, Isaac.",
      condition: 'warrior_badge_earned && !challenged_elder',
      next: 'final_challenge'
    },
    final_challenge: {
      id: 'final_challenge',
      speaker: 'Elder',
      text: "Are you ready to face me? This will be your greatest test. Prove you have your father's spirit, and Sol Sanctum will open to you.",
      choices: [
        { text: "I'm ready. Let's battle!", next: 'challenge_accepted' },
        { text: "I need more time.", next: 'challenge_declined' }
      ],
      next: ['challenge_accepted', 'challenge_declined']
    },
    challenge_accepted: {
      id: 'challenge_accepted',
      speaker: 'Elder',
      text: "Very well. Show me what you have learned. Show me you are worthy to be Guardian!",
      setFlag: 'challenged_elder',
      action: { type: 'battle', npcId: 'elder' },
      next: 'post_battle'
    },
    challenge_declined: {
      id: 'challenge_declined',
      speaker: 'Elder',
      text: "Wisdom in knowing when you are not ready. Return when your resolve is absolute.",
      next: 'end'
    },

    // After defeating Elder
    post_battle: {
      id: 'post_battle',
      speaker: 'Elder',
      text: "...Remarkable. You have your father's strength and more. You've proven yourself beyond doubt.",
      setFlag: 'guardian_badge_earned',
      next: 'sanctum_unlocked'
    },
    sanctum_unlocked: {
      id: 'sanctum_unlocked',
      speaker: 'Elder',
      text: "The path to Sol Sanctum is now open to you. But heed my warning: what you find within may change everything. Ancient powers slumber there. Powers that were sealed for good reason.",
      setFlag: 'ready_for_sanctum',
      next: 'final_warning'
    },
    final_warning: {
      id: 'final_warning',
      speaker: 'Elder',
      text: "Trust in your training. Trust in your friends. And remember - you are Vale's Guardian now. That burden is heavy, but you will not bear it alone.",
      next: 'end'
    },

    // After unlocking Sanctum
    post_trial: {
      id: 'post_trial',
      speaker: 'Elder',
      text: "Sol Sanctum awaits, Guardian Isaac. When you are ready, face what lies ahead. Vale's fate rests in your hands.",
      condition: 'guardian_badge_earned',
      next: 'end'
    },

    end: {
      id: 'end',
      speaker: 'Elder',
      text: "May the elements guide you.",
      next: undefined
    }
  }
};

const KRADEN_DIALOGUE: DialogueTree = {
  id: 'kraden-scholar',
  npcId: 'kraden',
  start: 'first_meeting',
  lines: {
    first_meeting: {
      id: 'first_meeting',
      speaker: 'Kraden',
      text: "Ah, Isaac! And Garet too! Perfect timing! I've been analyzing the seismic data from last night's tremors - fascinating patterns!",
      condition: '!met_kraden',
      next: 'alchemy_intro'
    },
    alchemy_intro: {
      id: 'alchemy_intro',
      speaker: 'Kraden',
      text: "But that's not why the Elder sent you, is it? You're here to learn about... Alchemy. The fundamental force that shapes our world.",
      next: 'show_psynergy'
    },
    show_psynergy: {
      id: 'show_psynergy',
      speaker: 'Kraden',
      text: "Allow me to demonstrate. Watch closely...",
      next: 'psynergy_demo'
    },
    psynergy_demo: {
      id: 'psynergy_demo',
      speaker: 'Kraden',
      text: "*Kraden uses Psynergy to move a small object* You see? Psynergy - mental power channeled through elemental affinity! You both possess this gift!",
      next: 'adept_explain'
    },
    adept_explain: {
      id: 'adept_explain',
      speaker: 'Kraden',
      text: "Isaac, you're a Venus Adept - Earth-aligned. Garet, you're Mars - Fire. This power awakens in times of need. The tremors, the trial... your abilities are emerging!",
      setFlag: ['met_kraden', 'learned_psynergy_basics', 'alchemy_knowledge_gained'],
      next: 'battle_tactics'
    },
    battle_tactics: {
      id: 'battle_tactics',
      speaker: 'Kraden',
      text: "As you face the Guardian Trial, remember: battles are won through strategy as much as strength. Know your element. Know your opponent's weaknesses!",
      next: 'end'
    },

    // General dialogue
    general_chat: {
      id: 'general_chat',
      speaker: 'Kraden',
      text: "Ah, Isaac! How goes your training? Learning much from your battles, I hope?",
      condition: 'met_kraden',
      next: 'advice_options'
    },
    advice_options: {
      id: 'advice_options',
      speaker: 'Kraden',
      text: "Do you need advice on battle strategy, or information about Alchemy?",
      choices: [
        { text: "Tell me about battle tactics.", next: 'battle_advice' },
        { text: "What else can you tell me about Alchemy?", next: 'alchemy_lore' },
        { text: "I'm fine, thank you.", next: 'end' }
      ],
      next: ['battle_advice', 'alchemy_lore', 'end']
    },
    battle_advice: {
      id: 'battle_advice',
      speaker: 'Kraden',
      text: "Venus beats Jupiter, Jupiter beats Mercury, Mercury beats Mars, and Mars beats Venus! Use elemental advantage wisely!",
      next: 'end'
    },
    alchemy_lore: {
      id: 'alchemy_lore',
      speaker: 'Kraden',
      text: "Alchemy was sealed away centuries ago after great wars. Sol Sanctum holds the Elemental Stars - pure crystallized Alchemy. Immense power, immense danger.",
      next: 'end'
    },

    // Progress reactions
    progress_comment: {
      id: 'progress_comment',
      speaker: 'Kraden',
      text: "I've been hearing about your victories! Most impressive! Your Psynergy must be developing rapidly through combat!",
      condition: 'bronze_badge_earned || silver_badge_earned',
      next: 'end'
    },

    end: {
      id: 'end',
      speaker: 'Kraden',
      text: "Good luck with your studies... er, battles!",
      next: undefined
    }
  }
};

// Jenna - Party Member & Rival
const JENNA_DIALOGUE: DialogueTree = {
  id: 'jenna-friend',
  npcId: 'jenna',
  start: 'first_meeting',
  lines: {
    first_meeting: {
      id: 'first_meeting',
      speaker: 'Jenna',
      text: "Isaac. I heard about the Elder's summons. Sol Sanctum, right?",
      condition: '!met_jenna && elder_summons_complete',
      next: 'sanctum_reaction'
    },
    sanctum_reaction: {
      id: 'sanctum_reaction',
      speaker: 'Jenna',
      text: "That's where... where Felix disappeared. Three years ago during the Cataclysm. I've wanted to go back ever since, but the Elder kept it sealed.",
      next: 'determination'
    },
    determination: {
      id: 'determination',
      speaker: 'Jenna',
      text: "I know you have to prove yourself through the Guardian Trial. Fine. But when you're ready to go to Sol Sanctum... I'm coming with you. Don't try to stop me.",
      next: 'join_offer'
    },
    join_offer: {
      id: 'join_offer',
      speaker: 'Jenna',
      text: "I can fight too, you know. Want to see?",
      choices: [
        { text: "Let's battle.", next: 'battle_accept' },
        { text: "I know you're strong.", next: 'acknowledge_strength' }
      ],
      next: ['battle_accept', 'acknowledge_strength']
    },
    battle_accept: {
      id: 'battle_accept',
      speaker: 'Jenna',
      text: "Good. I won't hold back. Let's see what you've learned!",
      setFlag: 'met_jenna',
      action: { type: 'battle', npcId: 'jenna' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Jenna',
      text: "Not bad. You're getting stronger. When you're ready for Sol Sanctum, come find me. Until then... train hard.",
      setFlag: ['battled_jenna', 'party_complete'],
      next: 'end'
    },
    acknowledge_strength: {
      id: 'acknowledge_strength',
      speaker: 'Jenna',
      text: "Thanks, Isaac. When you're ready for Sol Sanctum, I'll be ready too.",
      setFlag: ['met_jenna', 'party_complete'],
      next: 'end'
    },

    // Can challenge her for rival battles
    general_greeting: {
      id: 'general_greeting',
      speaker: 'Jenna',
      text: "Isaac. Need something?",
      condition: 'met_jenna',
      next: 'general_options'
    },
    general_options: {
      id: 'general_options',
      speaker: 'Jenna',
      text: "Want to train together?",
      choices: [
        { text: "Let's battle!", next: 'rival_battle' },
        { text: "Just checking in.", next: 'casual_talk' }
      ],
      next: ['rival_battle', 'casual_talk']
    },
    rival_battle: {
      id: 'rival_battle',
      speaker: 'Jenna',
      text: "Alright. Show me your progress!",
      action: { type: 'battle', npcId: 'jenna' },
      next: 'rival_post_battle'
    },
    rival_post_battle: {
      id: 'rival_post_battle',
      speaker: 'Jenna',
      text: "Good match. You're improving every day. Keep it up.",
      next: 'end'
    },

    // Emotional conversation about Felix
    casual_talk: {
      id: 'casual_talk',
      speaker: 'Jenna',
      text: "I think about Felix every day. What happened at Sol Sanctum... I need to know the truth. That's why I have to go with you.",
      next: 'felix_memory'
    },
    felix_memory: {
      id: 'felix_memory',
      speaker: 'Jenna',
      text: "He was always protecting me. Always strong. Maybe... maybe if I'm strong enough now, I can find answers. Maybe even closure.",
      next: 'gratitude'
    },
    gratitude: {
      id: 'gratitude',
      speaker: 'Jenna',
      text: "Thank you, Isaac. For being here. For understanding. You lost your father too. We carry that together.",
      next: 'end'
    },

    // Ready for Sanctum
    ready_dialogue: {
      id: 'ready_dialogue',
      speaker: 'Jenna',
      text: "You did it. You earned the Guardian Badge. Sol Sanctum is open. When you're ready... let's go find the truth.",
      condition: 'guardian_badge_earned',
      next: 'end'
    },

    end: {
      id: 'end',
      speaker: 'Jenna',
      text: "See you, Isaac.",
      next: undefined
    }
  }
};

// Kyle - Boss Battle (Guard Captain)
const KYLE_DIALOGUE: DialogueTree = {
  id: 'kyle-father',
  npcId: 'kyle',
  start: 'first_greeting',
  lines: {
    first_greeting: {
      id: 'first_greeting',
      speaker: 'Kyle',
      text: "Isaac. Garet. I hear the Elder has given you the Guardian Trial. Good. It's about time you both stepped up.",
      condition: '!gold_badge_earned',
      next: 'not_ready'
    },
    not_ready: {
      id: 'not_ready',
      speaker: 'Kyle',
      text: "But you're not ready to face me yet. Earn the Gold Badge first. Prove yourself to the village. Then we'll see what you're made of.",
      next: 'end'
    },

    // After Gold Badge
    gold_achieved: {
      id: 'gold_achieved',
      speaker: 'Kyle',
      text: "Gold Badge earned. I've been watching your battles. Impressive form. Your father would be proud.",
      condition: 'gold_badge_earned && !warrior_badge_earned',
      next: 'challenge_ready'
    },
    challenge_ready: {
      id: 'challenge_ready',
      speaker: 'Kyle',
      text: "Are you ready to face me, Isaac? I won't go easy on you. This is the real test.",
      choices: [
        { text: "I'm ready. Let's battle!", next: 'battle_start' },
        { text: "Not yet.", next: 'wait_response' }
      ],
      next: ['battle_start', 'wait_response']
    },
    battle_start: {
      id: 'battle_start',
      speaker: 'Kyle',
      text: "Good. Face me with honor. Show me the strength of Vale's next Guardian!",
      action: { type: 'battle', npcId: 'kyle' },
      next: 'post_battle'
    },
    wait_response: {
      id: 'wait_response',
      speaker: 'Kyle',
      text: "Smart. Don't rush into battle unprepared. Come back when you're certain.",
      next: 'end'
    },

    // After defeating Kyle
    post_battle: {
      id: 'post_battle',
      speaker: 'Kyle',
      text: "...Well fought, Isaac. Truly well fought. Your technique, your spirit... you have your father's fire. And something more.",
      setFlag: ['warrior_badge_earned', 'kyle_respect_earned', 'kyle_unlocked'],
      next: 'warrior_earned'
    },
    warrior_earned: {
      id: 'warrior_earned',
      speaker: 'Kyle',
      text: "You've earned the Warrior Badge. There's only one challenge left: the Elder himself. When you face him, give it everything. He'll accept nothing less.",
      next: 'advice'
    },
    advice: {
      id: 'advice',
      speaker: 'Kyle',
      text: "Your father completed the Guardian Trial twenty years ago. He stood where you stand now. He was terrified, but he didn't falter. Neither will you.",
      next: 'garet_pride'
    },
    garet_pride: {
      id: 'garet_pride',
      speaker: 'Kyle',
      text: "And Garet - I'm proud of you too. You've stood by Isaac through everything. That's the mark of a true warrior.",
      next: 'end'
    },

    // After earning Warrior Badge
    post_trial_respect: {
      id: 'post_trial_respect',
      speaker: 'Kyle',
      text: "The Elder awaits your challenge, Isaac. You've proven yourself to me. Now prove yourself to Vale's Master.",
      condition: 'warrior_badge_earned && !guardian_badge_earned',
      next: 'end'
    },

    // After defeating Elder
    final_respect: {
      id: 'final_respect',
      speaker: 'Kyle',
      text: "You defeated the Elder. Incredible. Vale's Guardian has been chosen. May you protect us as your father did.",
      condition: 'guardian_badge_earned',
      next: 'end'
    },

    end: {
      id: 'end',
      speaker: 'Kyle',
      text: "Stay vigilant, warriors.",
      next: undefined
    }
  }
};

// ============================================================================
// SUPPORTING NPCs - Moderate Dialogue
// ============================================================================

// Great Healer - Optional Skilled Battle
const HEALER_DIALOGUE: DialogueTree = {
  id: 'healer-wisdom',
  npcId: 'great-healer',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Great Healer',
      text: "Welcome, young one. The elements have been restless lately. As have you.",
      next: 'sense_power'
    },
    sense_power: {
      id: 'sense_power',
      speaker: 'Great Healer',
      text: "I sense great power awakening within you. Venus energy, strong and stable. You walk a significant path.",
      next: 'offer_options'
    },
    offer_options: {
      id: 'offer_options',
      speaker: 'Great Healer',
      text: "Do you seek healing, or perhaps... a test of your growing strength?",
      choices: [
        { text: "I need healing.", next: 'heal_service' },
        { text: "I'd like to test my strength.", next: 'battle_offer' },
        { text: "Just visiting.", next: 'wisdom_share' }
      ],
      next: ['heal_service', 'battle_offer', 'wisdom_share']
    },
    heal_service: {
      id: 'heal_service',
      speaker: 'Great Healer',
      text: "Of course. Let the elements restore you.",
      action: { type: 'heal' },
      next: 'healed'
    },
    healed: {
      id: 'healed',
      speaker: 'Great Healer',
      text: "You are restored. Go forth with renewed strength.",
      next: 'end'
    },
    battle_offer: {
      id: 'battle_offer',
      speaker: 'Great Healer',
      text: "I am primarily a healer, but I was once a warrior of Mercury. Very well. Let us test your resolve.",
      action: { type: 'battle', npcId: 'great-healer' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Great Healer',
      text: "Well done. Your spirit is as strong as your body. Continue your journey with wisdom and compassion.",
      next: 'end'
    },
    wisdom_share: {
      id: 'wisdom_share',
      speaker: 'Great Healer',
      text: "The path ahead is shrouded. Trust in your friends. Trust in the elements. And remember - true strength comes from within.",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Great Healer',
      text: "May Mercury's wisdom guide you.",
      next: undefined
    }
  }
};

// Innkeeper - Rest & Battle Option
const INNKEEPER_DIALOGUE: DialogueTree = {
  id: 'innkeeper-rest',
  npcId: 'innkeeper',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Innkeeper',
      text: "Welcome to Vale Inn! Rest your weary bones, friend!",
      next: 'services'
    },
    services: {
      id: 'services',
      speaker: 'Innkeeper',
      text: "What can I do for you? A bed for the night, or perhaps a friendly battle to warm up?",
      choices: [
        { text: "I'd like to rest. (10 coins)", next: 'rest_service' },
        { text: "Let's battle!", next: 'battle_accept' },
        { text: "Just looking around.", next: 'gossip' }
      ],
      next: ['rest_service', 'battle_accept', 'gossip']
    },
    rest_service: {
      id: 'rest_service',
      speaker: 'Innkeeper',
      text: "Excellent! Right this way. Sleep well!",
      action: { type: 'save' },
      next: 'rested'
    },
    rested: {
      id: 'rested',
      speaker: 'Innkeeper',
      text: "Feel better? Good sleep works wonders!",
      next: 'end'
    },
    battle_accept: {
      id: 'battle_accept',
      speaker: 'Innkeeper',
      text: "Ha! I don't get to fight much anymore, but I used to be quite the scrapper! Let's go!",
      action: { type: 'battle', npcId: 'innkeeper' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Innkeeper',
      text: "Whew! Still got it! Good match, kid! Come back anytime!",
      next: 'end'
    },
    gossip: {
      id: 'gossip',
      speaker: 'Innkeeper',
      text: "I hear you're tackling the Guardian Trial! Bold! Your father stayed here before his trial years ago. He was nervous but determined, just like you.",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Innkeeper',
      text: "Come back anytime!",
      next: undefined
    }
  }
};

// Ferris (Blacksmith) - Optional Battle & Crafting
const BLACKSMITH_DIALOGUE: DialogueTree = {
  id: 'blacksmith',
  npcId: 'blacksmith',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Ferris',
      text: "Need something? I'm busy. Best weapons in Vale don't forge themselves.",
      next: 'services'
    },
    services: {
      id: 'services',
      speaker: 'Ferris',
      text: "So? Want to buy a weapon, challenge me to a battle, or just waste my time?",
      choices: [
        { text: "Show me your weapons.", next: 'shop_open' },
        { text: "I challenge you to battle!", next: 'battle_response' },
        { text: "Sorry to bother you.", next: 'leave' }
      ],
      next: ['shop_open', 'battle_response', 'leave']
    },
    shop_open: {
      id: 'shop_open',
      speaker: 'Ferris',
      text: "Fine. But don't touch anything without paying. These blades are art.",
      action: { type: 'shop', shopId: 'blacksmith' },
      next: 'end'
    },
    battle_response: {
      id: 'battle_response',
      speaker: 'Ferris',
      text: "Hoh! Got some fire in you! Alright, let's see if you can back up that challenge!",
      action: { type: 'battle', npcId: 'blacksmith' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Ferris',
      text: "Not bad. You've got good form. Your father's sword... I made that, you know. Finest work I ever did.",
      next: 'father_memory'
    },
    father_memory: {
      id: 'father_memory',
      speaker: 'Ferris',
      text: "Broke my heart to bury it with him. But when you're ready, I'll forge you something just as good. Maybe better.",
      next: 'end'
    },
    leave: {
      id: 'leave',
      speaker: 'Ferris',
      text: "Yeah, thought so. Come back when you need a real weapon.",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Ferris',
      text: "Back to work.",
      next: undefined
    }
  }
};

// ============================================================================
// MINOR NPCs - Simple Dialogue with Battle Options
// ============================================================================

// Villager 1 - Beginner Trainer
const VILLAGER_1_DIALOGUE: DialogueTree = {
  id: 'villager-1',
  npcId: 'villager-1',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Villager',
      text: "Beautiful day, isn't it? Despite the tremors...",
      next: 'battle_offer'
    },
    battle_offer: {
      id: 'battle_offer',
      speaker: 'Villager',
      text: "Hey, want to battle? I'm not very strong, but I enjoy the practice!",
      choices: [
        { text: "Sure, let's battle!", next: 'battle_accept' },
        { text: "Maybe later.", next: 'decline' }
      ],
      next: ['battle_accept', 'decline']
    },
    battle_accept: {
      id: 'battle_accept',
      speaker: 'Villager',
      text: "Alright! I'll do my best!",
      action: { type: 'battle', npcId: 'villager-1' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Villager',
      text: "Good match! You're really talented! Keep training!",
      next: 'end'
    },
    decline: {
      id: 'decline',
      speaker: 'Villager',
      text: "No problem! Maybe another time!",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Villager',
      text: "Have a great day!",
      next: undefined
    }
  }
};

// Template for more simple NPCs (Farmer, Guards, etc.)
// Each would follow similar pattern: Greeting → Battle offer → Accept/Decline → Post-battle

// Scholar - Reluctant Battler
const SCHOLAR_1_DIALOGUE: DialogueTree = {
  id: 'scholar-1',
  npcId: 'scholar-1',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Scholar',
      text: "I'm researching the Cataclysm's seismic patterns. The data is fascinating!",
      next: 'battle_query'
    },
    battle_query: {
      id: 'battle_query',
      speaker: 'Scholar',
      text: "Oh, you want to battle? I'm not really a fighter... but I suppose I could try?",
      choices: [
        { text: "Come on, it'll be fun!", next: 'reluctant_accept' },
        { text: "That's okay.", next: 'relieved' }
      ],
      next: ['reluctant_accept', 'relieved']
    },
    reluctant_accept: {
      id: 'reluctant_accept',
      speaker: 'Scholar',
      text: "Oh dear... alright. I'll try my best!",
      action: { type: 'battle', npcId: 'scholar-1' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Scholar',
      text: "Phew! That was... actually kind of exciting! Maybe I should train more!",
      next: 'end'
    },
    relieved: {
      id: 'relieved',
      speaker: 'Scholar',
      text: "Oh, thank goodness. I much prefer studying to fighting!",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Scholar',
      text: "Back to my research!",
      next: undefined
    }
  }
};

// Child - Enthusiastic Young Fighter
const CHILD_1_DIALOGUE: DialogueTree = {
  id: 'child-1',
  npcId: 'child-1',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Child',
      text: "Wow! Are you Isaac? You're like a real hero!",
      next: 'battle_request'
    },
    battle_request: {
      id: 'battle_request',
      speaker: 'Child',
      text: "Can we battle? Please please please? I wanna be strong like you!",
      choices: [
        { text: "Okay, but I'll go easy!", next: 'excited_accept' },
        { text: "You're too young.", next: 'disappointed' }
      ],
      next: ['excited_accept', 'disappointed']
    },
    excited_accept: {
      id: 'excited_accept',
      speaker: 'Child',
      text: "YES! This is so cool! Here I come!",
      action: { type: 'battle', npcId: 'child-1' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Child',
      text: "That was AWESOME! You're so strong! I'm gonna train every day so I can be like you!",
      next: 'end'
    },
    disappointed: {
      id: 'disappointed',
      speaker: 'Child',
      text: "Awww... okay. But someday I'll be strong enough!",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Child',
      text: "Bye bye!",
      next: undefined
    }
  }
};

// Gate Guard - Eager Warrior
const GATE_GUARD_1_DIALOGUE: DialogueTree = {
  id: 'gate-guard-1',
  npcId: 'gate-guard-1',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Gate Guard',
      text: "Keeping watch. Monsters have been more active near Mt. Aleph lately.",
      next: 'battle_interest'
    },
    battle_interest: {
      id: 'battle_interest',
      speaker: 'Gate Guard',
      text: "You're doing the Guardian Trial, right? I'd be honored to test your skills!",
      choices: [
        { text: "Let's battle!", next: 'battle_eager' },
        { text: "Another time.", next: 'understand' }
      ],
      next: ['battle_eager', 'understand']
    },
    battle_eager: {
      id: 'battle_eager',
      speaker: 'Gate Guard',
      text: "Excellent! Show me what Vale's future Guardian can do!",
      action: { type: 'battle', npcId: 'gate-guard-1' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Gate Guard',
      text: "Impressive! You'll keep Vale safe, that's for certain! Good luck with the trial!",
      next: 'end'
    },
    understand: {
      id: 'understand',
      speaker: 'Gate Guard',
      text: "Understood. I'll be here when you're ready!",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Gate Guard',
      text: "Stay safe out there.",
      next: undefined
    }
  }
};

// Farmer 1 - Casual Battler
const FARMER_1_DIALOGUE: DialogueTree = {
  id: 'farmer-1',
  npcId: 'farmer-1',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Farmer',
      text: "These tremors ain't good for crops. Ground keeps shifting.",
      next: 'side_quest'
    },
    side_quest: {
      id: 'side_quest',
      speaker: 'Farmer',
      text: "Hey, I lost my tools in the tall grass over there. Can't see a thing! If you help me find 'em, I'll give you something.",
      choices: [
        { text: "I'll help! (Quest)", next: 'quest_accept' },
        { text: "Want to battle instead?", next: 'battle_option' },
        { text: "Sorry, I'm busy.", next: 'busy_response' }
      ],
      next: ['quest_accept', 'battle_option', 'busy_response']
    },
    quest_accept: {
      id: 'quest_accept',
      speaker: 'Farmer',
      text: "Thank you! Look for them in the tall grass near the barn!",
      action: { type: 'quest_start', questId: 'farmer_tools' },
      next: 'end'
    },
    battle_option: {
      id: 'battle_option',
      speaker: 'Farmer',
      text: "Battle? Ha! Been working all day, but sure! Could use a warm-up!",
      action: { type: 'battle', npcId: 'farmer-1' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Farmer',
      text: "Whew! Not bad! You city folk can fight! Still need my tools though!",
      next: 'end'
    },
    busy_response: {
      id: 'busy_response',
      speaker: 'Farmer',
      text: "Alright, alright. I'll keep lookin' myself.",
      next: 'end'
    },

    // After completing quest
    quest_complete: {
      id: 'quest_complete',
      speaker: 'Farmer',
      text: "You found my tools! You're a lifesaver! Here, take this as thanks!",
      condition: 'quest:farmer_tools:completed',
      action: { type: 'give_item', itemId: 'antidote', amount: 2 },
      setFlag: 'helped_farmer',
      next: 'end'
    },

    end: {
      id: 'end',
      speaker: 'Farmer',
      text: "Back to work!",
      next: undefined
    }
  }
};

// Ivan - Future Party Member Cameo
const IVAN_DIALOGUE: DialogueTree = {
  id: 'ivan-joins',
  npcId: 'ivan',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Ivan',
      text: "Pardon me, but you're Isaac, correct? I've heard you're a Venus Adept. I'm Jupiter-aligned myself.",
      next: 'introduction'
    },
    introduction: {
      id: 'introduction',
      speaker: 'Ivan',
      text: "My name is Ivan. I'm traveling to study Psynergy across the world. Vale seemed... significant somehow. The wind told me to come here.",
      next: 'observation'
    },
    observation: {
      id: 'observation',
      speaker: 'Ivan',
      text: "I can sense disturbances in the air currents. Something is awakening on Mt. Aleph. Be very careful, Isaac.",
      next: 'battle_offer'
    },
    battle_offer: {
      id: 'battle_offer',
      speaker: 'Ivan',
      text: "If you'd like, I could show you what Jupiter Psynergy can do. A friendly match?",
      choices: [
        { text: "Let's battle!", next: 'battle_accept' },
        { text: "Maybe another time.", next: 'polite_decline' }
      ],
      next: ['battle_accept', 'polite_decline']
    },
    battle_accept: {
      id: 'battle_accept',
      speaker: 'Ivan',
      text: "Excellent. Let the winds guide us!",
      action: { type: 'battle', npcId: 'ivan' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Ivan',
      text: "Impressive! Your Earth techniques are formidable. I look forward to seeing you grow stronger.",
      next: 'future_hint'
    },
    future_hint: {
      id: 'future_hint',
      speaker: 'Ivan',
      text: "The wind whispers that our paths will cross again. When the time comes, I'd be honored to journey with you.",
      next: 'end'
    },
    polite_decline: {
      id: 'polite_decline',
      speaker: 'Ivan',
      text: "I understand. The offer stands if you change your mind. Good luck with your trials.",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Ivan',
      text: "Fare well, Isaac.",
      next: undefined
    }
  }
};

// Mia - Future Party Member Cameo
const MIA_DIALOGUE: DialogueTree = {
  id: 'mia-healer',
  npcId: 'mia',
  start: 'greeting',
  lines: {
    greeting: {
      id: 'greeting',
      speaker: 'Mia',
      text: "Hello. I'm Mia, a healer from the Mercury Clan in the north. I've come to study with the Great Healer.",
      next: 'sense_power'
    },
    sense_power: {
      id: 'sense_power',
      speaker: 'Mia',
      text: "Your Psynergy... it's quite strong. Venus affinity, I sense. You must be Isaac.",
      next: 'warning'
    },
    warning: {
      id: 'warning',
      speaker: 'Mia',
      text: "I sense... turmoil ahead. Dark forces moving in shadow. Please be careful, Isaac. Not all who seek Alchemy do so with pure intent.",
      next: 'healing_offer'
    },
    healing_offer: {
      id: 'healing_offer',
      speaker: 'Mia',
      text: "If you're injured, I can help. Mercury's gift is healing. I could also demonstrate my abilities in a friendly match, if you'd like?",
      choices: [
        { text: "Please heal me.", next: 'heal' },
        { text: "Let's battle!", next: 'battle_accept' },
        { text: "I'm fine, thank you.", next: 'farewell' }
      ],
      next: ['heal', 'battle_accept', 'farewell']
    },
    heal: {
      id: 'heal',
      speaker: 'Mia',
      text: "Of course. Let the waters restore you...",
      action: { type: 'heal' },
      next: 'healed'
    },
    healed: {
      id: 'healed',
      speaker: 'Mia',
      text: "There. You should feel better now. Take care of yourself.",
      next: 'end'
    },
    battle_accept: {
      id: 'battle_accept',
      speaker: 'Mia',
      text: "Very well. I'll show you the power of Mercury!",
      action: { type: 'battle', npcId: 'mia' },
      next: 'post_battle'
    },
    post_battle: {
      id: 'post_battle',
      speaker: 'Mia',
      text: "You're very skilled. When your journey takes you beyond Vale, I hope our paths cross again.",
      next: 'end'
    },
    farewell: {
      id: 'farewell',
      speaker: 'Mia',
      text: "Safe travels, Isaac. May the water's wisdom guide you.",
      next: 'end'
    },
    end: {
      id: 'end',
      speaker: 'Mia',
      text: "Goodbye.",
      next: undefined
    }
  }
};

// ============================================================================
// DIALOGUE REGISTRY - Export all dialogue trees
// ============================================================================

export const DIALOGUE_DATA: DialogueRegistry = {
  'garet-intro': GARET_DIALOGUE,
  'dora-greeting': DORA_DIALOGUE,
  'elder-warning': ELDER_DIALOGUE,
  'kraden-scholar': KRADEN_DIALOGUE,
  'jenna-friend': JENNA_DIALOGUE,
  'kyle-father': KYLE_DIALOGUE,
  'healer-wisdom': HEALER_DIALOGUE,
  'innkeeper-rest': INNKEEPER_DIALOGUE,
  'blacksmith': BLACKSMITH_DIALOGUE,
  'villager-1': VILLAGER_1_DIALOGUE,
  'scholar-1': SCHOLAR_1_DIALOGUE,
  'child-1': CHILD_1_DIALOGUE,
  'gate-guard-1': GATE_GUARD_1_DIALOGUE,
  'farmer-1': FARMER_1_DIALOGUE,
  'ivan-joins': IVAN_DIALOGUE,
  'mia-healer': MIA_DIALOGUE,

  // TODO: Add remaining 32 NPCs with similar patterns
  // Each would follow: Greeting → Battle offer → Personality-based responses
  // Mixing eager, casual, and reluctant battlers
  // Some with side quests, some pure combat, some story flavor
};

/**
 * Get dialogue tree for an NPC
 */
export function getDialogueTree(dialogueId: string): DialogueTree | undefined {
  return DIALOGUE_DATA[dialogueId];
}

/**
 * Get starting dialogue line for an NPC based on story flags
 */
export function getStartingDialogue(
  dialogueId: string,
  flags: Record<string, boolean | number>
): string {
  const tree = getDialogueTree(dialogueId);
  if (!tree) return 'greeting'; // fallback

  // Find first matching dialogue line based on conditions
  for (const [lineId, line] of Object.entries(tree.lines)) {
    if (!line.condition) continue;
    if (checkCondition(line.condition, flags)) {
      return lineId;
    }
  }

  return tree.start; // Default start
}

/**
 * Check if story flag condition is met
 */
function checkCondition(condition: string, flags: Record<string, boolean | number>): boolean {
  // Simple condition checking
  // Supports: flag_name, !flag_name, flag1 && flag2, flag1 || flag2
  
  if (condition.startsWith('!')) {
    const flagName = condition.slice(1);
    return !flags[flagName];
  }
  
  if (condition.includes('&&')) {
    const parts = condition.split('&&').map(s => s.trim());
    return parts.every(part => checkCondition(part, flags));
  }
  
  if (condition.includes('||')) {
    const parts = condition.split('||').map(s => s.trim());
    return parts.some(part => checkCondition(part, flags));
  }
  
  return !!flags[condition];
}
