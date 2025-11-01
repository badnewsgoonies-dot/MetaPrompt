import { DAY_MINUTES, DAYS_PER_SEASON, SEASONS, WEATHER_TYPES } from "./constants.js";

function randomWeather(currentSeason) {
  const base = WEATHER_TYPES[Math.floor(Math.random() * WEATHER_TYPES.length)];
  if (currentSeason === "Summer" && Math.random() < 0.35) {
    return WEATHER_TYPES.find((w) => w.id === "rain");
  }
  if (currentSeason === "Winter") {
    return WEATHER_TYPES.find((w) => w.id === "cloudy");
  }
  return base;
}

export class TimeManager {
  constructor(state = {}) {
    this.minute = state.minute ?? 6 * 60; // start 6am
    this.day = state.day ?? 1;
    this.seasonIndex = state.seasonIndex ?? 0;
    this.year = state.year ?? 1;
    this.weather = state.weather ?? randomWeather(this.currentSeason());
  }

  currentSeason() {
    return SEASONS[this.seasonIndex];
  }

  advance(minutes) {
    this.minute += minutes;
    if (this.minute >= DAY_MINUTES + 6 * 60) {
      this.minute = 6 * 60; // reset to 6am
      this.day += 1;
      if (this.day > DAYS_PER_SEASON) {
        this.day = 1;
        this.seasonIndex = (this.seasonIndex + 1) % SEASONS.length;
        if (this.seasonIndex === 0) {
          this.year += 1;
        }
      }
      this.weather = randomWeather(this.currentSeason());
      return true; // new day
    }
    return false;
  }

  formattedTime() {
    const hours = Math.floor(this.minute / 60);
    const minutes = this.minute % 60;
    const suffix = hours >= 12 ? "pm" : "am";
    const twelveHour = ((hours + 11) % 12) + 1;
    return `${twelveHour}:${minutes.toString().padStart(2, "0")} ${suffix}`;
  }

  dayLabel() {
    return `Day ${this.day}`;
  }

  seasonLabel() {
    return `${this.currentSeason()} Y${this.year}`;
  }

  serialize() {
    return {
      minute: this.minute,
      day: this.day,
      seasonIndex: this.seasonIndex,
      year: this.year,
      weather: this.weather,
    };
  }
}
