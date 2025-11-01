import { describe, it, expect } from 'vitest';
import {
  createInventory,
  createShop,
  findInventoryItem,
  getItemQuantity,
  hasInventorySpace,
  getEmptySlots,
  addItemToInventory,
  removeItemFromInventory,
  updateCoins,
  buyItem,
  sellItem,
  buybackItem,
  createShopState,
  openShop,
  closeShop,
  setShopMode,
  navigateShop,
  getSellableItems,
  calculateSellValue,
  createItemShop,
  createArmorShop
} from '../src/systems/shopSystem';
import { ShopItem, Shop } from '../src/types/shop';

describe('shopSystem', () => {
  const mockHerb: ShopItem = {
    id: 'herb',
    name: 'Herb',
    description: 'Restores 50 HP',
    price: 10,
    type: 'consumable',
    maxStack: 30
  };

  const mockWeapon: ShopItem = {
    id: 'wooden-stick',
    name: 'Wooden Stick',
    description: 'Basic weapon',
    price: 20,
    type: 'weapon',
    maxStack: 1
  };

  describe('createInventory', () => {
    it('should create empty inventory with defaults', () => {
      const inventory = createInventory();
      
      expect(inventory.items.length).toBe(0);
      expect(inventory.maxSlots).toBe(30);
      expect(inventory.coins).toBe(200);
    });

    it('should create inventory with custom values', () => {
      const inventory = createInventory(20, 500);
      
      expect(inventory.maxSlots).toBe(20);
      expect(inventory.coins).toBe(500);
    });
  });

  describe('createShop', () => {
    it('should create shop', () => {
      const shop = createShop('test-shop', 'Test Shop', 'item', [mockHerb]);
      
      expect(shop.id).toBe('test-shop');
      expect(shop.name).toBe('Test Shop');
      expect(shop.inventory.length).toBe(1);
      expect(shop.buybackItems.length).toBe(0);
      expect(shop.sellPriceMultiplier).toBe(0.5);
    });
  });

  describe('findInventoryItem', () => {
    it('should find existing item', () => {
      const inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 3 });
      
      const item = findInventoryItem(inventory, 'herb');
      
      expect(item).not.toBeNull();
      expect(item?.quantity).toBe(3);
    });

    it('should return null for non-existent item', () => {
      const inventory = createInventory();
      const item = findInventoryItem(inventory, 'herb');
      
      expect(item).toBeNull();
    });
  });

  describe('getItemQuantity', () => {
    it('should return quantity of existing item', () => {
      const inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 5 });
      
      expect(getItemQuantity(inventory, 'herb')).toBe(5);
    });

    it('should return 0 for non-existent item', () => {
      const inventory = createInventory();
      expect(getItemQuantity(inventory, 'herb')).toBe(0);
    });
  });

  describe('hasInventorySpace', () => {
    it('should return true when inventory not full', () => {
      const inventory = createInventory(30);
      expect(hasInventorySpace(inventory)).toBe(true);
    });

    it('should return false when inventory full', () => {
      const inventory = createInventory(2);
      inventory.items.push({ itemId: 'herb', quantity: 1 });
      inventory.items.push({ itemId: 'nut', quantity: 1 });
      
      expect(hasInventorySpace(inventory)).toBe(false);
    });
  });

  describe('getEmptySlots', () => {
    it('should return correct number of empty slots', () => {
      const inventory = createInventory(30);
      inventory.items.push({ itemId: 'herb', quantity: 1 });
      inventory.items.push({ itemId: 'nut', quantity: 1 });
      
      expect(getEmptySlots(inventory)).toBe(28);
    });
  });

  describe('addItemToInventory', () => {
    it('should add new item', () => {
      const inventory = createInventory();
      const result = addItemToInventory(inventory, 'herb', 3, 30);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.items.length).toBe(1);
        expect(result.value.items[0].quantity).toBe(3);
      }
    });

    it('should stack with existing item', () => {
      let inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 3 });
      
      const result = addItemToInventory(inventory, 'herb', 2, 30);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.items.length).toBe(1);
        expect(result.value.items[0].quantity).toBe(5);
      }
    });

    it('should return error when exceeding max stack', () => {
      let inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 29 });
      
      const result = addItemToInventory(inventory, 'herb', 2, 30);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Cannot carry more than');
      }
    });

    it('should return error when inventory full', () => {
      const inventory = createInventory(1);
      inventory.items.push({ itemId: 'nut', quantity: 1 });
      
      const result = addItemToInventory(inventory, 'herb', 1, 30);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Inventory full');
      }
    });

    it('should return error for negative quantity', () => {
      const inventory = createInventory();
      const result = addItemToInventory(inventory, 'herb', -1, 30);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('positive');
      }
    });

    it('should not modify original inventory', () => {
      const inventory = createInventory();
      addItemToInventory(inventory, 'herb', 1, 30);
      
      expect(inventory.items.length).toBe(0);
    });
  });

  describe('removeItemFromInventory', () => {
    it('should remove item completely when quantity becomes 0', () => {
      const inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 3 });
      
      const result = removeItemFromInventory(inventory, 'herb', 3);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.items.length).toBe(0);
      }
    });

    it('should reduce quantity when removing partial amount', () => {
      const inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 5 });
      
      const result = removeItemFromInventory(inventory, 'herb', 2);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.items.length).toBe(1);
        expect(result.value.items[0].quantity).toBe(3);
      }
    });

    it('should return error when item not found', () => {
      const inventory = createInventory();
      const result = removeItemFromInventory(inventory, 'herb', 1);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not found');
      }
    });

    it('should return error when not enough quantity', () => {
      const inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 2 });
      
      const result = removeItemFromInventory(inventory, 'herb', 5);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Not enough');
      }
    });

    it('should not modify original inventory', () => {
      const inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 3 });
      
      removeItemFromInventory(inventory, 'herb', 1);
      
      expect(inventory.items[0].quantity).toBe(3);
    });
  });

  describe('updateCoins', () => {
    it('should add coins', () => {
      const inventory = createInventory(30, 100);
      const result = updateCoins(inventory, 50);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.coins).toBe(150);
      }
    });

    it('should subtract coins', () => {
      const inventory = createInventory(30, 100);
      const result = updateCoins(inventory, -30);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.coins).toBe(70);
      }
    });

    it('should return error when coins would go negative', () => {
      const inventory = createInventory(30, 50);
      const result = updateCoins(inventory, -100);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Not enough coins');
      }
    });
  });

  describe('buyItem', () => {
    it('should buy item successfully', () => {
      const inventory = createInventory(30, 100);
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      
      const result = buyItem(inventory, shop, mockHerb, 2);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.inventory.coins).toBe(80); // 100 - (10 * 2)
        expect(getItemQuantity(result.value.inventory, 'herb')).toBe(2);
      }
    });

    it('should stack with existing items', () => {
      let inventory = createInventory(30, 100);
      inventory.items.push({ itemId: 'herb', quantity: 3 });
      
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      const result = buyItem(inventory, shop, mockHerb, 2);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(getItemQuantity(result.value.inventory, 'herb')).toBe(5);
      }
    });

    it('should return error when not enough coins', () => {
      const inventory = createInventory(30, 5);
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      
      const result = buyItem(inventory, shop, mockHerb, 1);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Not enough coins');
      }
    });

    it('should return error when inventory full', () => {
      const inventory = createInventory(1, 100);
      inventory.items.push({ itemId: 'nut', quantity: 1 });
      
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      const result = buyItem(inventory, shop, mockHerb, 1);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Inventory full');
      }
    });
  });

  describe('sellItem', () => {
    it('should sell item successfully', () => {
      let inventory = createInventory(30, 100);
      inventory.items.push({ itemId: 'herb', quantity: 3 });
      
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb], 0.5);
      const result = sellItem(inventory, shop, mockHerb, 2);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.inventory.coins).toBe(110); // 100 + (10 * 0.5 * 2)
        expect(getItemQuantity(result.value.inventory, 'herb')).toBe(1);
        expect(result.value.shop.buybackItems.length).toBe(1);
      }
    });

    it('should return error when not enough items', () => {
      let inventory = createInventory(30, 100);
      inventory.items.push({ itemId: 'herb', quantity: 1 });
      
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      const result = sellItem(inventory, shop, mockHerb, 3);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Not enough items');
      }
    });

    it('should return error when item not in inventory', () => {
      const inventory = createInventory(30, 100);
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      
      const result = sellItem(inventory, shop, mockHerb, 1);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Not enough items');
      }
    });
  });

  describe('buybackItem', () => {
    it('should buy back item successfully', () => {
      const inventory = createInventory(30, 100);
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb], 0.5);
      shop.buybackItems.push({ itemId: 'herb', quantity: 2 });
      
      const result = buybackItem(inventory, shop, 'herb', mockHerb);
      
      expect(result.ok).toBe(true);
      if (result.ok) {
        expect(result.value.inventory.coins).toBe(90); // 100 - (10 * 0.5 * 2)
        expect(getItemQuantity(result.value.inventory, 'herb')).toBe(2);
        expect(result.value.shop.buybackItems.length).toBe(0);
      }
    });

    it('should return error when item not in buyback', () => {
      const inventory = createInventory(30, 100);
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      
      const result = buybackItem(inventory, shop, 'herb', mockHerb);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('not available for buyback');
      }
    });

    it('should return error when not enough coins', () => {
      const inventory = createInventory(30, 5);
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb], 0.5);
      shop.buybackItems.push({ itemId: 'herb', quantity: 2 });
      
      const result = buybackItem(inventory, shop, 'herb', mockHerb);
      
      expect(result.ok).toBe(false);
      if (!result.ok) {
        expect(result.error).toContain('Not enough coins');
      }
    });
  });

  describe('createShopState', () => {
    it('should create initial shop state', () => {
      const state = createShopState();
      
      expect(state.isOpen).toBe(false);
      expect(state.activeShop).toBeNull();
      expect(state.selectedIndex).toBe(0);
      expect(state.mode).toBe('buy');
    });
  });

  describe('openShop', () => {
    it('should open shop', () => {
      const state = createShopState();
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      
      const opened = openShop(state, shop);
      
      expect(opened.isOpen).toBe(true);
      expect(opened.activeShop).toBe(shop);
      expect(opened.selectedIndex).toBe(0);
      expect(opened.mode).toBe('buy');
    });
  });

  describe('closeShop', () => {
    it('should close shop', () => {
      let state = createShopState();
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      state = openShop(state, shop);
      
      const closed = closeShop(state);
      
      expect(closed.isOpen).toBe(false);
      expect(closed.activeShop).toBeNull();
    });
  });

  describe('setShopMode', () => {
    it('should change shop mode', () => {
      let state = createShopState();
      state.selectedIndex = 5;
      
      const updated = setShopMode(state, 'sell');
      
      expect(updated.mode).toBe('sell');
      expect(updated.selectedIndex).toBe(0); // Resets selection
    });
  });

  describe('navigateShop', () => {
    it('should navigate down', () => {
      let state = createShopState();
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      state = openShop(state, shop);
      
      const navigated = navigateShop(state, 1, 10);
      
      expect(navigated.selectedIndex).toBe(1);
    });

    it('should navigate up', () => {
      let state = createShopState();
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      state = openShop(state, shop);
      state.selectedIndex = 5;
      
      const navigated = navigateShop(state, -1, 10);
      
      expect(navigated.selectedIndex).toBe(4);
    });

    it('should clamp at minimum', () => {
      let state = createShopState();
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      state = openShop(state, shop);
      
      const navigated = navigateShop(state, -5, 10);
      
      expect(navigated.selectedIndex).toBe(0);
    });

    it('should clamp at maximum', () => {
      let state = createShopState();
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      state = openShop(state, shop);
      state.selectedIndex = 8;
      
      const navigated = navigateShop(state, 5, 10);
      
      expect(navigated.selectedIndex).toBe(10);
    });
  });

  describe('getSellableItems', () => {
    it('should return sellable items', () => {
      let inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 3 });
      inventory.items.push({ itemId: 'nut', quantity: 2 });
      
      const allItems = new Map([
        ['herb', mockHerb],
        ['nut', { ...mockHerb, id: 'nut', name: 'Nut' }]
      ]);
      
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      const sellable = getSellableItems(inventory, shop, allItems);
      
      expect(sellable.length).toBe(2);
    });

    it('should exclude key items', () => {
      let inventory = createInventory();
      inventory.items.push({ itemId: 'herb', quantity: 3 });
      inventory.items.push({ itemId: 'key', quantity: 1 });
      
      const keyItem: ShopItem = { 
        ...mockHerb, 
        id: 'key', 
        name: 'Golden Key', 
        type: 'key_item' 
      };
      
      const allItems = new Map([
        ['herb', mockHerb],
        ['key', keyItem]
      ]);
      
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb]);
      const sellable = getSellableItems(inventory, shop, allItems);
      
      expect(sellable.length).toBe(1);
      expect(sellable[0].id).toBe('herb');
    });
  });

  describe('calculateSellValue', () => {
    it('should calculate sell value', () => {
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb], 0.5);
      const value = calculateSellValue(mockHerb, shop, 3);
      
      expect(value).toBe(15); // 10 * 0.5 * 3
    });

    it('should floor fractional values', () => {
      const shop = createShop('test-shop', 'Test', 'item', [mockHerb], 0.7);
      const value = calculateSellValue(mockHerb, shop, 1);
      
      expect(value).toBe(7); // floor(10 * 0.7)
    });
  });

  describe('createItemShop', () => {
    it('should create item shop with items', () => {
      const shop = createItemShop();
      
      expect(shop.id).toBe('item-shop-vale');
      expect(shop.type).toBe('item');
      expect(shop.inventory.length).toBeGreaterThan(0);
    });
  });

  describe('createArmorShop', () => {
    it('should create armor shop with items', () => {
      const shop = createArmorShop();
      
      expect(shop.id).toBe('armor-shop-vale');
      expect(shop.type).toBe('armor');
      expect(shop.inventory.length).toBeGreaterThan(0);
    });
  });
});
