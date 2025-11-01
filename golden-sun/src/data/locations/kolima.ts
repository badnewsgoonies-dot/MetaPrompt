import { Location, NPC } from '../../types/scene';

/**
 * Kolima Village - Cursed village where residents are turned into trees
 * Story: Must reach Kolima Forest to break the curse
 */

export const KOLIMA_LOCATION: Location = {
  id: 'kolima',
  name: 'Kolima Village',
  type: 'town',
  description: 'A small village cursed by dark forest magic. The residents have been transformed into trees.',
  gridWidth: 12,
  gridHeight: 12,
  spawnPoint: { x: 6, y: 11 },
  musicId: 'kolima_cursed_theme',
  connections: {
    south: 'kolima_bridge',
    north: 'kolima_forest_entrance'
  }
};

export const KOLIMA_NPCS: NPC[] = [
  // === TREE-PEOPLE (Cursed NPCs) ===
  {
    id: 'tret',
    name: 'Tret (Tree)',
    spriteId: 'npc_tree_large',
    position: { x: 6, y: 4 },
    facing: 'down',
    dialogues: [
      {
        id: 'tret_cursed',
        text: "...H...help... us... The forest... angry... *rustling leaves*",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'tret_restored',
        text: "You saved us! Thank you, brave Adepts! The forest spirit Tret was in pain, and we suffered for it.",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: false,
    interactionRadius: 2
  },

  {
    id: 'kolima_tree_man_1',
    name: 'Townsman (Tree)',
    spriteId: 'npc_tree_medium',
    position: { x: 4, y: 6 },
    facing: 'right',
    dialogues: [
      {
        id: 'tree_man_1_cursed',
        text: "*creaking branches* ...can't... move... roots... so deep...",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'tree_man_1_restored',
        text: "I thought I'd be a tree forever! How can we ever repay you?",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'kolima_tree_woman_1',
    name: 'Townswoman (Tree)',
    spriteId: 'npc_tree_medium',
    position: { x: 8, y: 6 },
    facing: 'left',
    dialogues: [
      {
        id: 'tree_woman_1_cursed',
        text: "*swaying in wind* ...my children... where... *weak voice*",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'tree_woman_1_restored',
        text: "My family is safe! Bless you, kind travelers!",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'kolima_tree_child_1',
    name: 'Child (Tree)',
    spriteId: 'npc_tree_small',
    position: { x: 3, y: 8 },
    facing: 'down',
    dialogues: [
      {
        id: 'tree_child_1_cursed',
        text: "*soft rustling* ...mommy... daddy... scared...",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'tree_child_1_restored',
        text: "I'm not a tree anymore! That was scary!",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'kolima_tree_elder',
    name: 'Village Elder (Tree)',
    spriteId: 'npc_tree_large',
    position: { x: 9, y: 8 },
    facing: 'down',
    dialogues: [
      {
        id: 'tree_elder_cursed',
        text: "...Tret... the guardian... wounded... *whispering leaves* ...heal... the forest...",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'tree_elder_restored',
        text: "You healed Tret and broke the curse. Kolima Village is forever grateful. Take this treasure from our vault.",
        conditions: { flags: ['kolima_curse_broken'] },
        actions: [
          { type: 'giveItem', itemId: 'psyCrystal', quantity: 5 },
          { type: 'giveCoins', amount: 300 }
        ]
      }
    ],
    canMove: false,
    interactionRadius: 2
  },

  // === NON-CURSED NPCs (visiting or immune) ===
  {
    id: 'kolima_merchant',
    name: 'Stranded Merchant',
    spriteId: 'npc_merchant_male',
    position: { x: 2, y: 5 },
    facing: 'right',
    dialogues: [
      {
        id: 'merchant_trapped',
        text: "I came to trade, but everyone turned into trees! I'm too scared to leave in case the curse spreads!",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'merchant_relief',
        text: "The curse is broken! I can finally leave! Here, take some items as thanks.",
        conditions: { flags: ['kolima_curse_broken'] },
        actions: [
          { type: 'giveItem', itemId: 'herb', quantity: 3 },
          { type: 'giveItem', itemId: 'nut', quantity: 2 }
        ]
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  // Item shop - barely functional during curse
  {
    id: 'kolima_shop_tree',
    name: 'Shopkeeper (Tree)',
    spriteId: 'npc_tree_medium',
    position: { x: 10, y: 5 },
    facing: 'down',
    dialogues: [
      {
        id: 'shop_cursed',
        text: "*rustling* ...take... what... need... *can barely speak*",
        conditions: { flags: ['!kolima_curse_broken'] },
        action: {
          type: 'shop',
          shopId: 'kolima_item_shop_cursed',
          shopType: 'item',
          inventory: [
            { itemId: 'herb', price: 10, stock: 10 },
            { itemId: 'nut', price: 20, stock: 5 }
          ]
        }
      },
      {
        id: 'shop_restored',
        text: "Back in business! Thank you for saving us! I've restocked everything!",
        conditions: { flags: ['kolima_curse_broken'] },
        action: {
          type: 'shop',
          shopId: 'kolima_item_shop',
          shopType: 'item',
          inventory: [
            { itemId: 'herb', price: 10, stock: 99 },
            { itemId: 'nut', price: 20, stock: 99 },
            { itemId: 'antidote', price: 20, stock: 50 },
            { itemId: 'psyCrystal', price: 30, stock: 50 }
          ]
        }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  // More cursed villagers
  {
    id: 'kolima_tree_2',
    name: 'Farmer (Tree)',
    spriteId: 'npc_tree_medium',
    position: { x: 5, y: 9 },
    facing: 'up',
    dialogues: [
      {
        id: 'tree_2_cursed',
        text: "*creaking* ...my crops... withering... help...",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'tree_2_restored',
        text: "My fields! I need to check on my fields! Thank you for freeing us!",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: false,
    interactionRadius: 1
  },

  {
    id: 'kolima_tree_3',
    name: 'Woman (Tree)',
    spriteId: 'npc_tree_medium',
    position: { x: 7, y: 9 },
    facing: 'up',
    dialogues: [
      {
        id: 'tree_3_cursed',
        text: "*swaying sadly* ...how long... has it been... days... weeks...",
        conditions: { flags: ['!kolima_curse_broken'] }
      },
      {
        id: 'tree_3_restored',
        text: "It felt like an eternity! Every moment trapped as a tree was agony.",
        conditions: { flags: ['kolima_curse_broken'] }
      }
    ],
    canMove: false,
    interactionRadius: 1
  }
];

export const KOLIMA_BUILDINGS = [
  {
    id: 'kolima_item_shop',
    name: 'Village Shop',
    position: { x: 10, y: 5 },
    entrance: { x: 10, y: 6 },
    interior: 'kolima_shop_interior',
    spriteId: 'building_shop_cursed'
  },
  {
    id: 'kolima_elder_house',
    name: "Elder's House",
    position: { x: 9, y: 8 },
    entrance: { x: 9, y: 9 },
    interior: 'kolima_elder_interior',
    spriteId: 'building_house_cursed'
  }
];

/**
 * Special note: Kolima has a darker color palette when cursed
 * Background: Dark greens, grays, fog
 * After curse broken: Normal bright colors return
 */
