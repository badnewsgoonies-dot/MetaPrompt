/**
 * Shop System Types for Golden Sun Vale Village
 */

// Shop item for sale
export interface ShopItem {
  id: string;
  name: string;
  description: string;
  price: number;
  type: 'weapon' | 'armor' | 'consumable' | 'key_item';
  icon?: string; // Path to icon image
  maxStack: number; // Max quantity in single inventory slot
}

// Player inventory item
export interface InventoryItem {
  itemId: string;
  quantity: number;
}

// Player inventory
export interface Inventory {
  items: InventoryItem[];
  maxSlots: number;
  coins: number;
}

// Shop definition
export interface Shop {
  id: string;
  name: string;
  type: 'item' | 'armor' | 'weapon' | 'djinn' | 'general';
  inventory: ShopItem[];
  buybackItems: InventoryItem[]; // Items player sold (can buy back)
  sellPriceMultiplier: number; // 0.5 = sell for half price
}

// Shop transaction result
export interface TransactionResult {
  success: boolean;
  inventory: Inventory;
  shop?: Shop; // Updated shop if transaction modifies it
  message: string;
}

// Shop state (for UI)
export interface ShopState {
  isOpen: boolean;
  activeShop: Shop | null;
  selectedIndex: number;
  mode: 'buy' | 'sell' | 'buyback';
}
