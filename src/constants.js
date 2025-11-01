export const TILE_SIZE = 32;
export const GRID_WIDTH = 25;
export const GRID_HEIGHT = 18;
export const LOGIC_HZ = 60;
export const DAY_MINUTES = 720; // 6am-6pm daylight
export const MINUTES_PER_TICK = 5; // each minute = tick step when sleeping or skip? maybe 5 per in-game minute per update

export const SEASONS = ["Spring", "Summer", "Autumn", "Winter"];
export const DAYS_PER_SEASON = 30;

export const TOOLS = [
  { id: "hoe", label: "Hoe" },
  { id: "turnip_seeds", label: "Turnip Seeds" },
  { id: "watering_can", label: "Watering Can" },
  { id: "sickle", label: "Sickle" },
];

export const WEATHER_TYPES = [
  { id: "sunny", label: "Sunny", staminaModifier: 1, wateringBonus: 0 },
  { id: "rain", label: "Rain", staminaModifier: 0.9, wateringBonus: 1 },
  { id: "cloudy", label: "Cloudy", staminaModifier: 1, wateringBonus: 0 },
];

export const PLAYER_SPEED = 120; // pixels per second
export const PLAYER_STAMINA_MAX = 150;
export const TOOL_STAMINA_COST = {
  hoe: 8,
  turnip_seeds: 4,
  watering_can: 5,
  sickle: 6,
};

export const FARM_ORIGIN = { x: 6, y: 4 }; // tile offset for farmland inside grid
export const FARM_SIZE = { width: 12, height: 10 };

export const SAVE_KEY = "hm_prototype_save_v1";
