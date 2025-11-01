const crops = {
  turnip: {
    name: "Turnip",
    stages: [1, 2, 2, 2],
    regrow: false,
    sellValue: 120,
    seedCost: 60,
    seasons: ["Spring"],
  },
};

export class CropGrowthSystem {
  constructor() {}

  getCropDefinition(id) {
    return crops[id];
  }

  progressCrop(cropInstance, watered) {
    const def = crops[cropInstance.id];
    if (!def) return;
    if (!watered) return;
    cropInstance.age += 1;
    const stageThresholds = def.stages;
    let accumulated = 0;
    for (let i = 0; i < stageThresholds.length; i++) {
      accumulated += stageThresholds[i];
      if (cropInstance.age < accumulated) {
        cropInstance.stage = i;
        return;
      }
    }
    cropInstance.stage = stageThresholds.length;
  }

  isReadyForHarvest(cropInstance) {
    const def = crops[cropInstance.id];
    if (!def) return false;
    return cropInstance.stage >= def.stages.length;
  }

  sellValue(cropId) {
    return crops[cropId]?.sellValue ?? 0;
  }

  serialize() {
    return {};
  }
}

export function cropList() {
  return crops;
}
