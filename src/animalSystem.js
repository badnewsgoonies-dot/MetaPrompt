import { FARM_ORIGIN, TILE_SIZE } from "./constants.js";

const DEFAULT_POSITIONS = [
  {
    x: (FARM_ORIGIN.x - 2) * TILE_SIZE + TILE_SIZE * 0.5,
    y: (FARM_ORIGIN.y + 6) * TILE_SIZE,
  },
  {
    x: (FARM_ORIGIN.x - 1) * TILE_SIZE + TILE_SIZE * 0.5,
    y: (FARM_ORIGIN.y + 7.5) * TILE_SIZE,
  },
];

export class AnimalSystem {
  constructor(state = {}) {
    const defaults = [
      { name: "MooMoo", affection: 30, fedToday: false },
    ];
    this.animals = this._withPositions(state.animals ?? defaults);
  }

  _withPositions(list) {
    return list.map((animal, index) => ({
      ...animal,
      position:
        animal.position ?? {
          ...DEFAULT_POSITIONS[index % DEFAULT_POSITIONS.length],
        },
    }));
  }

  dailyTick() {
    this.animals.forEach((animal) => {
      if (!animal.fedToday) {
        animal.affection = Math.max(0, animal.affection - 2);
      } else {
        animal.affection = Math.min(100, animal.affection + 1);
      }
      animal.fedToday = false;
    });
  }

  feedAll() {
    this.animals.forEach((animal) => (animal.fedToday = true));
  }

  interact(player, radius = 60) {
    const target = this.animals.find((animal) => {
      const dx = (animal.position?.x ?? 0) - player.position.x;
      const dy = (animal.position?.y ?? 0) - player.position.y;
      return Math.hypot(dx, dy) <= radius;
    });

    if (!target) {
      return null;
    }

    if (!target.fedToday && (player.inventory.fodder ?? 0) > 0) {
      player.inventory.fodder -= 1;
      target.fedToday = true;
      target.affection = Math.min(100, target.affection + 3);
      return `${target.name} happily eats the fodder.`;
    }

    target.affection = Math.min(100, target.affection + 1);
    return `${target.name} seems happy (${target.affection}❤).`;
  }

  summary() {
    return this.animals
      .map((a) => `${a.name}: ${a.affection}❤${a.fedToday ? " (fed)" : ""}`)
      .join(", ");
  }

  serialize() {
    return { animals: this.animals };
  }

  hydrate(data = {}) {
    this.animals = this._withPositions(data.animals ?? this.animals);
  }
}
