/**
 * Shop System for Golden Sun Vale Village
 * Handles buying, selling, and inventory management
 */

import {
  Shop,
  ShopItem,
  Inventory,
  InventoryItem,
  ShopState
} from '../types/shop';
import { Result, Ok, Err } from '../utils/result';

/**
 * Create empty inventory
 */
export function createInventory(maxSlots: number = 30, startingCoins: number = 200): Inventory {
  return {
    items: [],
    maxSlots,
    coins: startingCoins
  };
}

/**
 * Create shop
 */
export function createShop(
  id: string,
  name: string,
  type: 'item' | 'armor' | 'weapon' | 'djinn' | 'general',
  inventory: ShopItem[],
  sellPriceMultiplier: number = 0.5
): Shop {
  return {
    id,
    name,
    type,
    inventory,
    buybackItems: [],
    sellPriceMultiplier
  };
}

/**
 * Find item in inventory
 */
export function findInventoryItem(inventory: Inventory, itemId: string): InventoryItem | null {
  return inventory.items.find(item => item.itemId === itemId) || null;
}

/**
 * Get total quantity of item in inventory
 */
export function getItemQuantity(inventory: Inventory, itemId: string): number {
  const item = findInventoryItem(inventory, itemId);
  return item ? item.quantity : 0;
}

/**
 * Check if inventory has space
 */
export function hasInventorySpace(inventory: Inventory): boolean {
  return inventory.items.length < inventory.maxSlots;
}

/**
 * Get number of empty inventory slots
 */
export function getEmptySlots(inventory: Inventory): number {
  return inventory.maxSlots - inventory.items.length;
}

/**
 * Add item to inventory
 */
export function addItemToInventory(
  inventory: Inventory,
  itemId: string,
  quantity: number,
  maxStack: number
): Result<Inventory, string> {
  if (quantity <= 0) {
    return Err('Quantity must be positive');
  }

  // Check if item already exists
  const existingItem = findInventoryItem(inventory, itemId);

  if (existingItem) {
    // Stack with existing item
    const newQuantity = existingItem.quantity + quantity;

    if (newQuantity > maxStack) {
      return Err(`Cannot carry more than ${maxStack} of this item`);
    }

    const updatedItems = inventory.items.map(item =>
      item.itemId === itemId ? { ...item, quantity: newQuantity } : item
    );

    return Ok({
      ...inventory,
      items: updatedItems
    });
  } else {
    // Add as new item
    if (!hasInventorySpace(inventory)) {
      return Err('Inventory full');
    }

    if (quantity > maxStack) {
      return Err(`Cannot carry more than ${maxStack} of this item`);
    }

    return Ok({
      ...inventory,
      items: [...inventory.items, { itemId, quantity }]
    });
  }
}

/**
 * Remove item from inventory
 */
export function removeItemFromInventory(
  inventory: Inventory,
  itemId: string,
  quantity: number
): Result<Inventory, string> {
  if (quantity <= 0) {
    return Err('Quantity must be positive');
  }

  const existingItem = findInventoryItem(inventory, itemId);

  if (!existingItem) {
    return Err('Item not found in inventory');
  }

  if (existingItem.quantity < quantity) {
    return Err('Not enough items in inventory');
  }

  const newQuantity = existingItem.quantity - quantity;

  let updatedItems: InventoryItem[];
  if (newQuantity === 0) {
    // Remove item entirely
    updatedItems = inventory.items.filter(item => item.itemId !== itemId);
  } else {
    // Reduce quantity
    updatedItems = inventory.items.map(item =>
      item.itemId === itemId ? { ...item, quantity: newQuantity } : item
    );
  }

  return Ok({
    ...inventory,
    items: updatedItems
  });
}

/**
 * Update coins in inventory
 */
export function updateCoins(inventory: Inventory, delta: number): Result<Inventory, string> {
  const newCoins = inventory.coins + delta;

  if (newCoins < 0) {
    return Err('Not enough coins');
  }

  return Ok({
    ...inventory,
    coins: newCoins
  });
}

/**
 * Buy item from shop
 */
export function buyItem(
  inventory: Inventory,
  shop: Shop,
  item: ShopItem,
  quantity: number = 1
): Result<{ inventory: Inventory; shop: Shop }, string> {
  if (quantity <= 0) {
    return Err('Quantity must be positive');
  }

  const totalCost = item.price * quantity;

  // Check if player has enough coins
  if (inventory.coins < totalCost) {
    return Err(`Not enough coins. Need ${totalCost}, have ${inventory.coins}`);
  }

  // Check if inventory has space (for new item types)
  const existingItem = findInventoryItem(inventory, item.id);
  if (!existingItem && !hasInventorySpace(inventory)) {
    return Err('Inventory full');
  }

  // Add item to inventory
  const addResult = addItemToInventory(inventory, item.id, quantity, item.maxStack);
  if (!addResult.ok) {
    return Err(addResult.error);
  }

  // Deduct coins
  const coinsResult = updateCoins(addResult.value, -totalCost);
  if (!coinsResult.ok) {
    return Err(coinsResult.error);
  }

  return Ok({
    inventory: coinsResult.value,
    shop // Shop inventory doesn't change (infinite stock)
  });
}

/**
 * Sell item to shop
 */
export function sellItem(
  inventory: Inventory,
  shop: Shop,
  item: ShopItem,
  quantity: number = 1
): Result<{ inventory: Inventory; shop: Shop }, string> {
  if (quantity <= 0) {
    return Err('Quantity must be positive');
  }

  // Check if player has item
  const existingItem = findInventoryItem(inventory, item.id);
  if (!existingItem || existingItem.quantity < quantity) {
    return Err('Not enough items to sell');
  }

  // Calculate sell price
  const sellPrice = Math.floor(item.price * shop.sellPriceMultiplier * quantity);

  // Remove item from inventory
  const removeResult = removeItemFromInventory(inventory, item.id, quantity);
  if (!removeResult.ok) {
    return Err(removeResult.error);
  }

  // Add coins
  const coinsResult = updateCoins(removeResult.value, sellPrice);
  if (!coinsResult.ok) {
    return Err(coinsResult.error);
  }

  // Add to shop buyback
  const updatedShop: Shop = {
    ...shop,
    buybackItems: [
      ...shop.buybackItems,
      { itemId: item.id, quantity }
    ]
  };

  return Ok({
    inventory: coinsResult.value,
    shop: updatedShop
  });
}

/**
 * Buy back item from shop (items player sold)
 */
export function buybackItem(
  inventory: Inventory,
  shop: Shop,
  itemId: string,
  item: ShopItem
): Result<{ inventory: Inventory; shop: Shop }, string> {
  // Find buyback item
  const buybackItem = shop.buybackItems.find(b => b.itemId === itemId);
  if (!buybackItem) {
    return Err('Item not available for buyback');
  }

  // Buyback at sell price (same as sell price)
  const buybackPrice = Math.floor(item.price * shop.sellPriceMultiplier * buybackItem.quantity);

  // Check if player has enough coins
  if (inventory.coins < buybackPrice) {
    return Err(`Not enough coins. Need ${buybackPrice}, have ${inventory.coins}`);
  }

  // Add item to inventory
  const addResult = addItemToInventory(inventory, itemId, buybackItem.quantity, item.maxStack);
  if (!addResult.ok) {
    return Err(addResult.error);
  }

  // Deduct coins
  const coinsResult = updateCoins(addResult.value, -buybackPrice);
  if (!coinsResult.ok) {
    return Err(coinsResult.error);
  }

  // Remove from buyback
  const updatedShop: Shop = {
    ...shop,
    buybackItems: shop.buybackItems.filter(b => b.itemId !== itemId)
  };

  return Ok({
    inventory: coinsResult.value,
    shop: updatedShop
  });
}

/**
 * Create shop state (for UI)
 */
export function createShopState(): ShopState {
  return {
    isOpen: false,
    activeShop: null,
    selectedIndex: 0,
    mode: 'buy'
  };
}

/**
 * Open shop
 */
export function openShop(state: ShopState, shop: Shop): ShopState {
  return {
    ...state,
    isOpen: true,
    activeShop: shop,
    selectedIndex: 0,
    mode: 'buy'
  };
}

/**
 * Close shop
 */
export function closeShop(state: ShopState): ShopState {
  return {
    ...state,
    isOpen: false,
    activeShop: null,
    selectedIndex: 0
  };
}

/**
 * Change shop mode (buy/sell/buyback)
 */
export function setShopMode(state: ShopState, mode: 'buy' | 'sell' | 'buyback'): ShopState {
  return {
    ...state,
    mode,
    selectedIndex: 0
  };
}

/**
 * Navigate shop selection
 */
export function navigateShop(state: ShopState, delta: number, maxIndex: number): ShopState {
  if (!state.activeShop) return state;

  const newIndex = Math.max(0, Math.min(state.selectedIndex + delta, maxIndex));

  return {
    ...state,
    selectedIndex: newIndex
  };
}

/**
 * Get sellable items from inventory (items that shop will buy)
 */
export function getSellableItems(
  inventory: Inventory,
  _shop: Shop,
  allItems: Map<string, ShopItem>
): ShopItem[] {
  const sellable: ShopItem[] = [];

  for (const invItem of inventory.items) {
    const itemData = allItems.get(invItem.itemId);
    if (itemData && itemData.type !== 'key_item') {
      sellable.push(itemData);
    }
  }

  return sellable;
}

/**
 * Calculate sell value of inventory item
 */
export function calculateSellValue(item: ShopItem, shop: Shop, quantity: number): number {
  return Math.floor(item.price * shop.sellPriceMultiplier * quantity);
}

/**
 * Create Vale Village Item Shop
 */
export function createItemShop(): Shop {
  const items: ShopItem[] = [
    {
      id: 'herb',
      name: 'Herb',
      description: 'Restores 50 HP',
      price: 10,
      type: 'consumable',
      maxStack: 30
    },
    {
      id: 'nut',
      name: 'Nut',
      description: 'Restores 50 PP',
      price: 20,
      type: 'consumable',
      maxStack: 30
    },
    {
      id: 'antidote',
      name: 'Antidote',
      description: 'Cures poison',
      price: 20,
      type: 'consumable',
      maxStack: 30
    },
    {
      id: 'psy-crystal',
      name: 'Psy Crystal',
      description: 'Restores 100 PP',
      price: 50,
      type: 'consumable',
      maxStack: 30
    }
  ];

  return createShop('item-shop-vale', 'Vale Item Shop', 'item', items, 0.5);
}

/**
 * Create Vale Village Armor Shop
 */
export function createArmorShop(): Shop {
  const items: ShopItem[] = [
    {
      id: 'wooden-stick',
      name: 'Wooden Stick',
      description: 'A simple wooden weapon',
      price: 20,
      type: 'weapon',
      maxStack: 1
    },
    {
      id: 'leather-armor',
      name: 'Leather Armor',
      description: 'Basic protective armor',
      price: 40,
      type: 'armor',
      maxStack: 1
    },
    {
      id: 'leather-cap',
      name: 'Leather Cap',
      description: 'Basic headgear',
      price: 30,
      type: 'armor',
      maxStack: 1
    },
    {
      id: 'leather-gloves',
      name: 'Leather Gloves',
      description: 'Basic hand protection',
      price: 15,
      type: 'armor',
      maxStack: 1
    }
  ];

  return createShop('armor-shop-vale', 'Vale Armor Shop', 'armor', items, 0.5);
}
