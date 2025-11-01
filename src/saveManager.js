import { SAVE_KEY } from "./constants.js";

export class SaveManager {
  constructor(timeManager, player, stamina, farm, animalSystem, npcSystem) {
    this.timeManager = timeManager;
    this.player = player;
    this.stamina = stamina;
    this.farm = farm;
    this.animalSystem = animalSystem;
    this.npcSystem = npcSystem;
  }

  load() {
    try {
      const raw = localStorage.getItem(SAVE_KEY);
      if (!raw) return false;
      const data = JSON.parse(raw);
      this.timeManager.minute = data.time.minute;
      this.timeManager.day = data.time.day;
      this.timeManager.seasonIndex = data.time.seasonIndex;
      this.timeManager.year = data.time.year;
      this.timeManager.weather = data.time.weather;
      this.player.hydrate(data.player);
      this.stamina.current = data.stamina.current;
      this.farm.tiles = this.farm.tiles.map((row, y) =>
        row.map((tile, x) => data.farm.tiles?.[`${x},${y}`] ?? tile)
      );
      this.animalSystem.hydrate(data.animal);
      this.npcSystem.npcs = data.npc.npcs;
      return true;
    } catch (err) {
      console.warn("Failed to load save", err);
      return false;
    }
  }

  save() {
    const payload = {
      time: this.timeManager.serialize(),
      player: this.player.serialize(),
      stamina: this.stamina.serialize(),
      farm: { tiles: this.farm.serialize() },
      animal: this.animalSystem.serialize(),
      npc: this.npcSystem.serialize(),
    };
    localStorage.setItem(SAVE_KEY, JSON.stringify(payload));
  }

  clear() {
    localStorage.removeItem(SAVE_KEY);
  }
}
