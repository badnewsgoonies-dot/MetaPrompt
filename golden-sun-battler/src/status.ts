import { Combatant, StatusEffect, StatusId } from './types.js';

export function hasStatus(combatant: Combatant, id: StatusId): boolean {
  return combatant.statuses.some((s) => s.id === id && s.duration !== 0);
}

export function getStatus(combatant: Combatant, id: StatusId): StatusEffect | undefined {
  return combatant.statuses.find((s) => s.id === id && s.duration !== 0);
}

export function applyStatus(target: Combatant, status: StatusEffect): boolean {
  const existing = target.statuses.find((s) => s.id === status.id);
  if (existing) {
    existing.duration = Math.max(existing.duration, status.duration);
    existing.potency = status.potency ?? existing.potency;
    return false;
  }
  target.statuses.push({ ...status });
  return true;
}

export function tickStatuses(target: Combatant): void {
  target.statuses = target.statuses
    .map((status) => ({ ...status, duration: status.duration - 1 }))
    .filter((status) => status.duration > 0);
}

export function removeStatus(target: Combatant, id: StatusId): void {
  target.statuses = target.statuses.filter((status) => status.id !== id);
}
