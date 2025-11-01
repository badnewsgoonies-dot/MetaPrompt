import { FARM_ORIGIN, FARM_SIZE, TILE_SIZE } from "./constants.js";

const TileState = {
  GRASS: "grass",
  TILLED: "tilled",
  WATERED: "watered",
  ROCK: "rock",
  WEED: "weed",
};

export class FarmGrid {
  constructor(state = {}) {
    this.tiles = [];
    for (let y = 0; y < FARM_SIZE.height; y++) {
      const row = [];
      for (let x = 0; x < FARM_SIZE.width; x++) {
        const key = `${x},${y}`;
        row.push(
          state.tiles?.[key] ?? {
            type: Math.random() < 0.15 ? TileState.WEED : TileState.GRASS,
            watered: false,
            crop: null,
          }
        );
      }
      this.tiles.push(row);
    }
  }

  getTile(x, y) {
    if (x < 0 || y < 0 || x >= FARM_SIZE.width || y >= FARM_SIZE.height) {
      return null;
    }
    return this.tiles[y][x];
  }

  getTileFromWorld(position, direction) {
    const offset = { x: 0, y: 0 };
    switch (direction) {
      case "up":
        offset.y = -1;
        break;
      case "down":
        offset.y = 1;
        break;
      case "left":
        offset.x = -1;
        break;
      case "right":
        offset.x = 1;
        break;
    }
    const tileX = Math.floor(position.x / TILE_SIZE) - FARM_ORIGIN.x + offset.x;
    const tileY = Math.floor(position.y / TILE_SIZE) - FARM_ORIGIN.y + offset.y;
    if (!this.getTile(tileX, tileY)) return null;
    return { x: tileX, y: tileY };
  }

  tillTile(x, y) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    if (tile.type === TileState.GRASS || tile.type === TileState.WEED) {
      tile.type = TileState.TILLED;
      tile.watered = false;
      tile.crop = null;
      return true;
    }
    return false;
  }

  plantCrop(x, y, cropId) {
    const tile = this.getTile(x, y);
    if (!tile || tile.crop) return false;
    if (tile.type !== TileState.TILLED && tile.type !== TileState.WATERED) return false;
    tile.crop = {
      id: cropId,
      age: 0,
      stage: 0,
      wateredToday: tile.type === TileState.WATERED,
    };
    return true;
  }

  waterTile(x, y) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    if (tile.type === TileState.TILLED || tile.type === TileState.WATERED) {
      tile.type = TileState.WATERED;
      if (tile.crop) {
        tile.crop.wateredToday = true;
      }
      return true;
    }
    return false;
  }

  clearWeeds(x, y) {
    const tile = this.getTile(x, y);
    if (!tile) return false;
    if (tile.type === TileState.WEED) {
      tile.type = TileState.GRASS;
      return true;
    }
    return false;
  }

  harvestCrop(x, y, cropSystem) {
    const tile = this.getTile(x, y);
    if (!tile || !tile.crop) return false;
    if (cropSystem.isReadyForHarvest(tile.crop)) {
      tile.crop = null;
      tile.type = TileState.TILLED;
      tile.watered = false;
      return true;
    }
    return false;
  }

  advanceDay(cropSystem, weather) {
    for (let y = 0; y < FARM_SIZE.height; y++) {
      for (let x = 0; x < FARM_SIZE.width; x++) {
        const tile = this.tiles[y][x];
        if (tile.crop) {
          const rained = weather.id === "rain";
          const watered = tile.crop.wateredToday || rained;
          cropSystem.progressCrop(tile.crop, watered);
          tile.crop.wateredToday = false;
        }
        if (tile.type === TileState.WATERED) {
          tile.type = TileState.TILLED;
        }
      }
    }
    this.spawnDailyWeeds();
  }

  spawnDailyWeeds() {
    for (let i = 0; i < 2; i++) {
      const x = Math.floor(Math.random() * FARM_SIZE.width);
      const y = Math.floor(Math.random() * FARM_SIZE.height);
      const tile = this.getTile(x, y);
      if (tile && !tile.crop && tile.type === TileState.GRASS) {
        tile.type = TileState.WEED;
      }
    }
  }

  serialize() {
    const payload = {};
    for (let y = 0; y < FARM_SIZE.height; y++) {
      for (let x = 0; x < FARM_SIZE.width; x++) {
        payload[`${x},${y}`] = this.tiles[y][x];
      }
    }
    return payload;
  }

  summary(cropSystem) {
    let tilled = 0;
    let crops = 0;
    let ready = 0;
    for (let y = 0; y < FARM_SIZE.height; y++) {
      for (let x = 0; x < FARM_SIZE.width; x++) {
        const tile = this.tiles[y][x];
        if (tile.type === TileState.TILLED || tile.type === TileState.WATERED) tilled++;
        if (tile.crop) {
          crops++;
          const def = cropSystem?.getCropDefinition(tile.crop.id);
          const maturity = def ? def.stages.length : 4;
          if (tile.crop.stage >= maturity) {
            ready++;
          }
        }
      }
    }
    return `${crops} crops (${ready} ready), ${tilled} tilled`;
  }
}

export { TileState };
