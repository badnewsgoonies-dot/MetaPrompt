/**
 * Shop Menu Component for Golden Sun Vale Village
 * Displays shop items, inventory, and transactions
 */

import React from 'react';
import { ShopState, Inventory, ShopItem, InventoryItem } from '../types/shop';
import './ShopMenu.css';

interface ShopMenuProps {
  shopState: ShopState;
  playerInventory: Inventory;
  shopItems: ShopItem[];
  onBuy: () => void;
  onSell: () => void;
  onClose: () => void;
  onChangeMode: (mode: 'buy' | 'sell') => void;
}

export const ShopMenu: React.FC<ShopMenuProps> = ({
  shopState,
  playerInventory,
  shopItems,
  onBuy,
  onSell,
  onClose,
  onChangeMode
}) => {
  if (!shopState.activeShop) {
    return null;
  }

  const shop = shopState.activeShop;
  const mode = shopState.mode;
  const currentIndex = shopState.selectedIndex;

  // Determine what to display based on mode
  const displayItems = mode === 'buy' ? shopItems : playerInventory.items.filter(item => item.quantity > 0);
  const selectedItem = displayItems[currentIndex] || null;

  return (
    <div className="shop-menu" role="dialog" aria-label="Shop Menu">
      {/* Shop Header */}
      <div className="shop-header">
        <h2 className="shop-name">{shop.name}</h2>
        <button 
          className="shop-close"
          onClick={onClose}
          aria-label="Close shop"
        >
          ✕
        </button>
      </div>

      {/* Mode Selector */}
      <div className="shop-mode-selector" role="tablist">
        <button
          className={`mode-tab ${mode === 'buy' ? 'active' : ''}`}
          onClick={() => onChangeMode('buy')}
          role="tab"
          aria-selected={mode === 'buy'}
        >
          Buy
        </button>
        <button
          className={`mode-tab ${mode === 'sell' ? 'active' : ''}`}
          onClick={() => onChangeMode('sell')}
          role="tab"
          aria-selected={mode === 'sell'}
        >
          Sell
        </button>
      </div>

      {/* Shop Content */}
      <div className="shop-content">
        {/* Item List */}
        <div className="shop-items" role="list">
          {displayItems.length === 0 ? (
            <div className="empty-message">
              {mode === 'buy' ? 'No items for sale' : 'No items to sell'}
            </div>
          ) : (
            displayItems.map((item, index) => {
              const shopItem = mode === 'buy' 
                ? item as ShopItem
                : shopItems.find(si => si.id === (item as InventoryItem).itemId);
              
              if (!shopItem) return null;

              const displayPrice = mode === 'buy' 
                ? shopItem.price 
                : Math.floor(shopItem.price * shop.sellPriceMultiplier);

              return (
                <div
                  key={`${shopItem.id}-${index}`}
                  className={`shop-item ${index === currentIndex ? 'selected' : ''}`}
                  role="listitem"
                  aria-selected={index === currentIndex}
                >
                  <div className="item-icon">{getItemIcon(shopItem.type)}</div>
                  <div className="item-info">
                    <div className="item-name">{shopItem.name}</div>
                    <div className="item-description">{shopItem.description}</div>
                  </div>
                  <div className="item-price">
                    {displayPrice} 💰
                    {mode === 'sell' && (item as InventoryItem).quantity > 1 && (
                      <span className="item-quantity"> x{(item as InventoryItem).quantity}</span>
                    )}
                  </div>
                </div>
              );
            })
          )}
        </div>

        {/* Item Details */}
        {selectedItem && (() => {
          const shopItem = mode === 'buy'
            ? selectedItem as ShopItem
            : shopItems.find(si => si.id === (selectedItem as InventoryItem).itemId);
          
          if (!shopItem) return null;
          
          const displayPrice = mode === 'buy'
            ? shopItem.price
            : Math.floor(shopItem.price * shop.sellPriceMultiplier);

          return (
          <div className="item-details">
            <h3>{shopItem.name}</h3>
            <div className="detail-row">
              <span className="detail-label">Type:</span>
              <span className="detail-value">{shopItem.type.replace('_', ' ')}</span>
            </div>
            <div className="detail-row">
              <span className="detail-label">Price:</span>
              <span className="detail-value">
                {mode === 'buy' 
                  ? `${displayPrice} coins` 
                  : `${displayPrice} coins (${Math.round(shop.sellPriceMultiplier * 100)}%)`}
              </span>
            </div>
            <div className="detail-description">{shopItem.description}</div>
            
            {mode === 'sell' && (selectedItem as InventoryItem).quantity > 1 && (
              <div className="detail-row">
                <span className="detail-label">Owned:</span>
                <span className="detail-value">{(selectedItem as InventoryItem).quantity}</span>
              </div>
            )}
          </div>
          );
        })()}
      </div>

      {/* Shop Footer */}
      <div className="shop-footer">
        <div className="coins-display">
          <span className="coins-icon">💰</span>
          <span className="coins-amount">{playerInventory.coins} coins</span>
        </div>

        <div className="shop-actions">
          {mode === 'buy' && selectedItem && (() => {
            const shopItem = selectedItem as ShopItem;
            return (
              <button 
                className="action-button buy-button"
                onClick={onBuy}
                disabled={playerInventory.coins < shopItem.price}
              >
                Buy ({shopItem.price} 💰)
              </button>
            );
          })()}
          {mode === 'sell' && selectedItem && (() => {
            const invItem = selectedItem as InventoryItem;
            const shopItem = shopItems.find(si => si.id === invItem.itemId);
            if (!shopItem) return null;
            const sellPrice = Math.floor(shopItem.price * shop.sellPriceMultiplier);
            return (
              <button 
                className="action-button sell-button"
                onClick={onSell}
              >
                Sell ({sellPrice} 💰)
              </button>
            );
          })()}
        </div>
      </div>

      {/* Controls */}
      <div className="shop-controls">
        <span className="control-hint">↑↓ Navigate</span>
        <span className="control-hint">Enter: {mode === 'buy' ? 'Buy' : 'Sell'}</span>
        <span className="control-hint">Tab: Switch Mode</span>
        <span className="control-hint">Esc: Close</span>
      </div>
    </div>
  );
};

// Helper function to get item icon
function getItemIcon(type: string): string {
  switch (type) {
    case 'weapon': return '⚔️';
    case 'armor': return '🛡️';
    case 'consumable': return '🧪';
    case 'key': return '🔑';
    default: return '📦';
  }
}
