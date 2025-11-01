import { Location, NPC } from '../../types/scene';

/**
 * Vault Town - First town outside Vale
 * Story: Mayor's son trapped in Goma Range
 */

export const VAULT_LOCATION: Location = {
  id: 'vault',
  name: 'Vault',
  type: 'town',
  description: 'A peaceful town nestled at the foot of the Goma Range mountains.',
  gridWidth: 20,
  gridHeight: 20,
  spawnPoint: { x: 10, y: 18 }, // South entrance
  musicId: 'town_theme',
  connections: {
    south: 'world_map_vale_region',
    north: 'goma_range'
  }
};

export const VAULT_NPCS: NPC[] = [
  {
    id: 'vault_mayor',
    name: 'Mayor of Vault',
    spriteId: 'npc_elder_male',
    position: { x: 10, y: 5 },
    facing: 'down',
    dialogues: [
      {
        id: 'vault_mayor_initial',
        text: "Welcome to Vault, travelers! I'm the mayor of this humble town.",
        conditions: { flags: ['!goma_range_quest_started'] }
      },
      {
        id: 'vault_mayor_quest',
        text: "My son ventured into Goma Range and hasn't returned... Please, can you help find him?",
        conditions: { flags: ['!goma_range_quest_started'] },
        choices: [
          { text: 'Of course, we\'ll help!', action: { setFlag: 'goma_range_quest_started' }, nextDialogueId: 'vault_mayor_grateful' },
          { text: 'We need to prepare first.', nextDialogueId: 'vault_mayor_waiting' }
        ]
      },
      {
        id: 'vault_mayor_grateful',
        text: "Thank you! He went north through the Goma Range pass. Please be careful!",
        conditions: { flags: ['goma_range_quest_started', '!goma_range_quest_complete'] }
      },
      {
        id: 'vault_mayor_complete',
        text: "You saved my son! Please accept this reward and our eternal gratitude!",
        conditions: { flags: ['goma_range_quest_complete'] },
        actions: [
          { type: 'giveItem', itemId: 'leatherBoots', quantity: 1 },
          { type: 'giveCoins', amount: 500 }
        ]
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'vault_innkeeper',
    name: 'Innkeeper',
    spriteId: 'npc_merchant_female',
    position: { x: 15, y: 8 },
    facing: 'down',
    dialogues: [
      {
        id: 'vault_inn_greeting',
        text: "Welcome to Vault Inn! Rest here for 30 coins?",
        choices: [
          { text: 'Yes, rest here', action: { type: 'inn', cost: 30 }, nextDialogueId: 'vault_inn_rest' },
          { text: 'No thanks', nextDialogueId: 'vault_inn_decline' }
        ]
      },
      {
        id: 'vault_inn_rest',
        text: "Sleep well! Your HP and PP have been restored."
      },
      {
        id: 'vault_inn_decline',
        text: "Come back anytime you need rest!"
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'vault_item_shop',
    name: 'Item Shopkeeper',
    spriteId: 'npc_merchant_male',
    position: { x: 5, y: 10 },
    facing: 'down',
    dialogues: [
      {
        id: 'vault_item_shop',
        text: "Looking for supplies? Check out my wares!",
        action: {
          type: 'shop',
          shopId: 'vault_item_shop',
          shopType: 'item',
          inventory: [
            { itemId: 'herb', price: 10, stock: 99 },
            { itemId: 'nut', price: 20, stock: 99 },
            { itemId: 'antidote', price: 20, stock: 50 },
            { itemId: 'psyCrystal', price: 30, stock: 50 },
            { itemId: 'elixir', price: 100, stock: 10 }
          ]
        }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'vault_weapon_shop',
    name: 'Weapon Shopkeeper',
    spriteId: 'npc_blacksmith',
    position: { x: 5, y: 14 },
    facing: 'down',
    dialogues: [
      {
        id: 'vault_weapon_shop',
        text: "Need better equipment? I've got quality gear!",
        action: {
          type: 'shop',
          shopId: 'vault_weapon_shop',
          shopType: 'equipment',
          inventory: [
            { itemId: 'bronzeSword', price: 200, stock: 5 },
            { itemId: 'bronzeAxe', price: 220, stock: 5 },
            { itemId: 'bronzeArmor', price: 400, stock: 5 },
            { itemId: 'bronzeHelm', price: 300, stock: 5 },
            { itemId: 'bronzeShield', price: 250, stock: 5 },
            { itemId: 'leatherGloves', price: 150, stock: 10 }
          ]
        }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  // Regular townsfolk
  {
    id: 'vault_guard_1',
    name: 'Town Guard',
    spriteId: 'npc_guard',
    position: { x: 10, y: 17 },
    facing: 'up',
    dialogues: [
      {
        id: 'vault_guard_1_default',
        text: "Welcome to Vault! We're a peaceful town, but the Goma Range can be dangerous."
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'vault_scholar',
    name: 'Traveling Scholar',
    spriteId: 'npc_scholar',
    position: { x: 12, y: 10 },
    facing: 'left',
    dialogues: [
      {
        id: 'vault_scholar_lore',
        text: "Did you know? The Goma Range was formed by ancient Venus Psynergy. Fascinating!"
      }
    ],
    canMove: true,
    movementPattern: 'wander',
    interactionRadius: 1
  },

  {
    id: 'vault_child_1',
    name: 'Child',
    spriteId: 'npc_child_boy',
    position: { x: 8, y: 12 },
    facing: 'right',
    dialogues: [
      {
        id: 'vault_child_1_default',
        text: "My dad says there are monsters in the mountains! Are you gonna fight them?"
      }
    ],
    canMove: true,
    movementPattern: 'wander',
    interactionRadius: 1
  },

  {
    id: 'vault_woman_1',
    name: 'Townswoman',
    spriteId: 'npc_woman_1',
    position: { x: 13, y: 15 },
    facing: 'down',
    dialogues: [
      {
        id: 'vault_woman_1_default',
        text: "Ever since the Mayor's son went missing, everyone's been worried.",
        conditions: { flags: ['!goma_range_quest_complete'] }
      },
      {
        id: 'vault_woman_1_resolved',
        text: "Thank goodness you rescued the Mayor's son! You're heroes!",
        conditions: { flags: ['goma_range_quest_complete'] }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'vault_man_1',
    name: 'Townsman',
    spriteId: 'npc_man_1',
    position: { x: 7, y: 7 },
    facing: 'left',
    dialogues: [
      {
        id: 'vault_man_1_hint',
        text: "If you're heading to Goma Range, bring plenty of healing items. Goblins up there are tough!"
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'vault_elder_woman',
    name: 'Elderly Woman',
    spriteId: 'npc_elder_female',
    position: { x: 16, y: 12 },
    facing: 'down',
    dialogues: [
      {
        id: 'vault_elder_woman_memory',
        text: "In my youth, I traveled all over Weyard. Vale, Bilibin, even Imil! Those were the days..."
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'vault_blacksmith_apprentice',
    name: 'Apprentice',
    spriteId: 'npc_worker',
    position: { x: 4, y: 15 },
    facing: 'right',
    dialogues: [
      {
        id: 'vault_apprentice_tip',
        text: "The master's Bronze equipment is great for beginners. Save up and upgrade your gear!"
      }
    ],
    canMove: false,
    interactionRadius: 1
  }
];

/**
 * Buildings in Vault
 */
export const VAULT_BUILDINGS = [
  {
    id: 'vault_inn',
    name: 'Vault Inn',
    position: { x: 15, y: 8 },
    entrance: { x: 15, y: 9 },
    interior: 'vault_inn_interior',
    spriteId: 'building_inn'
  },
  {
    id: 'vault_item_shop',
    name: 'Item Shop',
    position: { x: 5, y: 10 },
    entrance: { x: 5, y: 11 },
    interior: 'vault_item_shop_interior',
    spriteId: 'building_shop'
  },
  {
    id: 'vault_weapon_shop',
    name: 'Weapon & Armor Shop',
    position: { x: 5, y: 14 },
    entrance: { x: 5, y: 15 },
    interior: 'vault_weapon_shop_interior',
    spriteId: 'building_shop_2'
  },
  {
    id: 'vault_mayor_house',
    name: "Mayor's House",
    position: { x: 10, y: 5 },
    entrance: { x: 10, y: 6 },
    interior: 'vault_mayor_house_interior',
    spriteId: 'building_house_large'
  }
];
