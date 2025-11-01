import { Location, NPC } from '../../types/scene';

/**
 * Bilibin Town - Major town with palace
 * Story: Lord Bilibin requests help with Kolima Forest curse
 */

export const BILIBIN_LOCATION: Location = {
  id: 'bilibin',
  name: 'Bilibin',
  type: 'town',
  description: 'A prosperous town ruled by Lord Bilibin, gateway to the eastern regions.',
  gridWidth: 25,
  gridHeight: 25,
  spawnPoint: { x: 12, y: 23 },
  musicId: 'bilibin_theme',
  connections: {
    south: 'world_map_central',
    east: 'kolima_bridge',
    west: 'vale_region'
  }
};

export const BILIBIN_NPCS: NPC[] = [
  // === PALACE NPCs ===
  {
    id: 'lord_bilibin',
    name: 'Lord Bilibin',
    spriteId: 'npc_noble',
    position: { x: 12, y: 5 },
    facing: 'down',
    dialogues: [
      {
        id: 'bilibin_lord_initial',
        text: "Greetings, travelers. I am Lord Bilibin, ruler of this town.",
        conditions: { flags: ['!bilibin_quest_started'] }
      },
      {
        id: 'bilibin_lord_quest',
        text: "A terrible curse has befallen Kolima Village. The townspeople have been transformed into trees! Will you investigate Kolima Forest?",
        conditions: { flags: ['!bilibin_quest_started'] },
        choices: [
          { text: 'We will help!', action: { setFlag: 'bilibin_quest_started' }, nextDialogueId: 'bilibin_lord_gratitude' },
          { text: 'We need time to prepare.', nextDialogueId: 'bilibin_lord_waiting' }
        ]
      },
      {
        id: 'bilibin_lord_gratitude',
        text: "Thank you! The curse originates from deep within Kolima Forest. You'll need to reach the forest's heart.",
        conditions: { flags: ['bilibin_quest_started', '!kolima_curse_broken'] }
      },
      {
        id: 'bilibin_lord_complete',
        text: "You've broken the curse! Bilibin is forever in your debt. Please, take this as a token of our gratitude.",
        conditions: { flags: ['kolima_curse_broken'] },
        actions: [
          { type: 'giveItem', itemId: 'guardRing', quantity: 1 },
          { type: 'giveCoins', amount: 1000 }
        ]
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'palace_guard_captain',
    name: 'Guard Captain',
    spriteId: 'npc_knight',
    position: { x: 11, y: 7 },
    facing: 'right',
    dialogues: [
      {
        id: 'captain_duty',
        text: "I oversee the palace guard. Lord Bilibin's safety is my highest priority."
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'palace_advisor',
    name: 'Royal Advisor',
    spriteId: 'npc_scholar',
    position: { x: 13, y: 7 },
    facing: 'left',
    dialogues: [
      {
        id: 'advisor_lore',
        text: "The Kolima curse is unlike anything we've seen. Ancient Psynergy must be at work.",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'advisor_resolved',
        text: "Your mastery of Psynergy saved Kolima. You are true Adepts!",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  // === SHOPS ===
  {
    id: 'bilibin_item_shop',
    name: 'Item Merchant',
    spriteId: 'npc_merchant_male',
    position: { x: 7, y: 15 },
    facing: 'down',
    dialogues: [
      {
        id: 'bilibin_item_shop',
        text: "Welcome to Bilibin's finest item shop!",
        action: {
          type: 'shop',
          shopId: 'bilibin_item_shop',
          shopType: 'item',
          inventory: [
            { itemId: 'herb', price: 10, stock: 99 },
            { itemId: 'nut', price: 20, stock: 99 },
            { itemId: 'antidote', price: 20, stock: 99 },
            { itemId: 'psyCrystal', price: 30, stock: 99 },
            { itemId: 'elixir', price: 100, stock: 50 },
            { itemId: 'waterOfLife', price: 500, stock: 5 }
          ]
        }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'bilibin_weapon_shop',
    name: 'Weapon Master',
    spriteId: 'npc_blacksmith',
    position: { x: 17, y: 15 },
    facing: 'down',
    dialogues: [
      {
        id: 'bilibin_weapon_shop',
        text: "I forge the finest weapons in the region! Take a look.",
        action: {
          type: 'shop',
          shopId: 'bilibin_weapon_shop',
          shopType: 'equipment',
          inventory: [
            { itemId: 'ironSword', price: 500, stock: 5 },
            { itemId: 'battleAxe', price: 550, stock: 5 },
            { itemId: 'ironArmor', price: 800, stock: 5 },
            { itemId: 'ironHelm', price: 600, stock: 5 },
            { itemId: 'ironShield', price: 500, stock: 5 },
            { itemId: 'chainMail', price: 900, stock: 3 }
          ]
        }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'bilibin_innkeeper',
    name: 'Innkeeper',
    spriteId: 'npc_merchant_female',
    position: { x: 12, y: 18 },
    facing: 'down',
    dialogues: [
      {
        id: 'bilibin_inn',
        text: "Rest at Bilibin Inn for 50 coins?",
        choices: [
          { text: 'Yes', action: { type: 'inn', cost: 50 } },
          { text: 'No', nextDialogueId: 'bilibin_inn_decline' }
        ]
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  // === SPECIAL NPCs ===
  {
    id: 'fortune_teller',
    name: 'Fortune Teller',
    spriteId: 'npc_mystic',
    position: { x: 20, y: 10 },
    facing: 'down',
    dialogues: [
      {
        id: 'fortune_teller_hint',
        text: "The cards reveal your next path... *shuffles cards* You must journey north to break the curse that binds nature itself.",
        conditions: { flags: ['bilibin_quest_started', '!kolima_curse_broken'] }
      },
      {
        id: 'fortune_teller_general',
        text: "The spirits whisper of great destiny for you, young Adept. Your journey has only begun.",
        conditions: { flags: ['!bilibin_quest_started'] }
      },
      {
        id: 'fortune_teller_future',
        text: "I see lighthouses... Four great beacons that must not be lit. The fate of Weyard hangs in the balance.",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  // === TOWNSFOLK ===
  {
    id: 'bilibin_guard_1',
    name: 'Palace Guard',
    spriteId: 'npc_guard',
    position: { x: 12, y: 9 },
    facing: 'down',
    dialogues: [
      {
        id: 'guard_1_duty',
        text: "The palace is open to all citizens, but please be respectful."
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'bilibin_guard_2',
    name: 'Gate Guard',
    spriteId: 'npc_guard',
    position: { x: 12, y: 22 },
    facing: 'up',
    dialogues: [
      {
        id: 'guard_2_warning',
        text: "Be careful on the roads. Monsters have been more active lately."
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'bilibin_scholar_1',
    name: 'Scholar',
    spriteId: 'npc_scholar',
    position: { x: 15, y: 12 },
    facing: 'left',
    dialogues: [
      {
        id: 'scholar_lore_1',
        text: "I'm researching the four elements: Venus, Mars, Jupiter, and Mercury. Fascinating how they govern all of Alchemy!"
      }
    ],
    canMove: true,
    movementPattern: 'wander',
    interactionRadius: 1
  },

  {
    id: 'bilibin_child_1',
    name: 'Boy',
    spriteId: 'npc_child_boy',
    position: { x: 10, y: 16 },
    facing: 'right',
    dialogues: [
      {
        id: 'child_1_excitement',
        text: "Are you adventurers? That's so cool! I wanna be an Adept when I grow up!"
      }
    ],
    canMove: true,
    movementPattern: 'wander',
    interactionRadius: 1
  },

  {
    id: 'bilibin_child_2',
    name: 'Girl',
    spriteId: 'npc_child_girl',
    position: { x: 14, y: 16 },
    facing: 'left',
    dialogues: [
      {
        id: 'child_2_worry',
        text: "My friend from Kolima wrote me a letter... but then she stopped. I hope she's okay.",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'child_2_relief',
        text: "My friend from Kolima is okay! Thank you for saving her!",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: true,
    movementPattern: 'wander',
    interactionRadius: 1
  },

  {
    id: 'bilibin_woman_1',
    name: 'Townswoman',
    spriteId: 'npc_woman_1',
    position: { x: 8, y: 12 },
    facing: 'down',
    dialogues: [
      {
        id: 'woman_1_gossip',
        text: "Have you been to the palace? Lord Bilibin is a wise and just ruler."
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'bilibin_man_1',
    name: 'Townsman',
    spriteId: 'npc_man_1',
    position: { x: 16, y: 20 },
    facing: 'left',
    dialogues: [
      {
        id: 'man_1_trade',
        text: "Bilibin is a trade hub. Merchants from all over Angara pass through here."
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'bilibin_merchant',
    name: 'Traveling Merchant',
    spriteId: 'npc_merchant_male',
    position: { x: 18, y: 18 },
    facing: 'down',
    dialogues: [
      {
        id: 'merchant_rumor',
        text: "I heard strange things are happening at Mercury Lighthouse to the north. Pirates, they say!"
      }
    ],
    canMove: true,
    movementPattern: 'wander',
    interactionRadius: 1
  },

  {
    id: 'bilibin_elder',
    name: 'Village Elder',
    spriteId: 'npc_elder_male',
    position: { x: 5, y: 10 },
    facing: 'right',
    dialogues: [
      {
        id: 'elder_history',
        text: "Bilibin has stood for centuries. We've weathered many storms, and we'll weather this curse too."
      }
    ],
    canMove: false,
    interactionRadius: 1
  }
];

export const BILIBIN_BUILDINGS = [
  {
    id: 'bilibin_palace',
    name: 'Bilibin Palace',
    position: { x: 12, y: 5 },
    entrance: { x: 12, y: 8 },
    interior: 'bilibin_palace_interior',
    spriteId: 'building_palace'
  },
  {
    id: 'bilibin_inn',
    name: 'Bilibin Inn',
    position: { x: 12, y: 18 },
    entrance: { x: 12, y: 19 },
    interior: 'bilibin_inn_interior',
    spriteId: 'building_inn'
  },
  {
    id: 'bilibin_item_shop',
    name: 'Item Shop',
    position: { x: 7, y: 15 },
    entrance: { x: 7, y: 16 },
    interior: 'bilibin_item_shop_interior',
    spriteId: 'building_shop'
  },
  {
    id: 'bilibin_weapon_shop',
    name: 'Weapon & Armor Shop',
    position: { x: 17, y: 15 },
    entrance: { x: 17, y: 16 },
    interior: 'bilibin_weapon_shop_interior',
    spriteId: 'building_shop_2'
  },
  {
    id: 'bilibin_fortune_house',
    name: "Fortune Teller's House",
    position: { x: 20, y: 10 },
    entrance: { x: 20, y: 11 },
    interior: 'bilibin_fortune_interior',
    spriteId: 'building_house_small'
  }
];
