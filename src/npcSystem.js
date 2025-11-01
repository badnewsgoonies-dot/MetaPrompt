import { TILE_SIZE } from "./constants.js";

const schedule = [
  { time: 6 * 60, position: { x: 5 * TILE_SIZE, y: 5 * TILE_SIZE } },
  { time: 9 * 60, position: { x: 12 * TILE_SIZE, y: 4 * TILE_SIZE } },
  { time: 12 * 60, position: { x: 18 * TILE_SIZE, y: 7 * TILE_SIZE } },
  { time: 16 * 60, position: { x: 8 * TILE_SIZE, y: 12 * TILE_SIZE } },
];

export class NPCSystem {
  constructor(state = {}) {
    this.npcs = state.npcs ?? [
      {
        name: "Popuri",
        affection: 15,
        schedule,
        position: { ...schedule[0].position },
      },
    ];
  }

  update(timeManager, delta) {
    this.npcs.forEach((npc) => {
      const current = npc.schedule.reduce((acc, entry) => {
        if (timeManager.minute >= entry.time) return entry;
        return acc;
      }, npc.schedule[0]);
      if (current) {
        npc.position = { ...current.position };
      }
    });
  }

  talkToNPC(player) {
    const npc = this.npcs[0];
    npc.affection = Math.min(255, npc.affection + 1);
    player.relationships[npc.name.toLowerCase()] = npc.affection;
  }

  summary() {
    return this.npcs.map((npc) => `${npc.name}: ${npc.affection}`).join(", ");
  }

  serialize() {
    return { npcs: this.npcs };
  }
}
