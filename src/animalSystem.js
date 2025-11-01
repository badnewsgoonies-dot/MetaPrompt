export class AnimalSystem {
  constructor(state = {}) {
    this.animals = state.animals ?? [
      { name: "MooMoo", affection: 30, fedToday: false },
    ];
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

  summary() {
    return this.animals
      .map((a) => `${a.name}: ${a.affection}❤${a.fedToday ? " (fed)" : ""}`)
      .join(", ");
  }

  serialize() {
    return { animals: this.animals };
  }
}
