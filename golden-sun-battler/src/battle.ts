import { DeterministicRng } from './rng.js';
import {
  ActionCommand,
  ActionPlanner,
  BattleAction,
  BattleLogEvent,
  BattleOutcome,
  BattleSnapshot,
  Combatant,
  DamageEvent,
  Element,
  HealEvent,
  ResourceEvent,
  StatusEvent
} from './types.js';
import { applyStatus, getStatus, hasStatus, removeStatus, tickStatuses } from './status.js';

export interface BattleOptions {
  seed?: string;
  maxRounds?: number;
}

interface InternalState {
  players: Combatant[];
  enemies: Combatant[];
  round: number;
  log: BattleLogEvent[];
  outcome: BattleOutcome;
}

export class BattleEngine {
  private rng: DeterministicRng;
  private state: InternalState;

  constructor(players: Combatant[], enemies: Combatant[], options: BattleOptions = {}) {
    const seed = options.seed ?? `${Date.now()}`;
    this.rng = new DeterministicRng(seed);
    this.state = {
      players: players.map(cloneCombatant),
      enemies: enemies.map(cloneCombatant),
      round: 0,
      log: [],
      outcome: { type: 'in-progress' }
    };
  }

  get snapshot(): BattleSnapshot {
    return {
      seed: this.rng.seed,
      round: this.state.round,
      parties: {
        players: this.state.players.map(cloneCombatant),
        enemies: this.state.enemies.map(cloneCombatant)
      },
      log: [...this.state.log],
      outcome: this.state.outcome
    };
  }

  run(planners: Record<string, ActionPlanner>, options: BattleOptions = {}): BattleSnapshot {
    const maxRounds = options.maxRounds ?? Infinity;
    while (this.state.outcome.type === 'in-progress' && this.state.round < maxRounds) {
      this.executeRound(planners);
    }
    return this.snapshot;
  }

  private executeRound(planners: Record<string, ActionPlanner>): void {
    this.state.round += 1;
    const order = this.buildTurnOrder();
    this.record({ type: 'order', order: order.map((actor) => actor.id) });

    for (let index = 0; index < order.length; index += 1) {
      const actor = order[index];
      if (!isAlive(actor)) {
        continue;
      }
      const side = actor.isPlayer ? this.state.players : this.state.enemies;
      const opponents = actor.isPlayer ? this.state.enemies : this.state.players;
      const planner = planners[actor.id];
      if (!planner) {
        throw new Error(`Missing planner for actor ${actor.id}`);
      }
      const command = planner.chooseAction({
        actor: cloneCombatant(actor),
        allies: side.filter(isAlive).map(cloneCombatant),
        enemies: opponents.filter(isAlive).map(cloneCombatant),
        round: this.state.round,
        history: [...this.state.log],
        rng: () => this.rng.next()
      });
      this.executeCommand(actor, command, index);
      if (this.state.outcome.type !== 'in-progress') {
        break;
      }
    }

    // tick statuses at end of round
    this.state.players.forEach(tickStatuses);
    this.state.enemies.forEach(tickStatuses);
    this.evaluateOutcome();
  }

  private executeCommand(actor: Combatant, command: ActionCommand, turnIndex: number): void {
    if (!isAlive(actor)) {
      return;
    }
    const action = command.action ?? actor.actions.find((a) => a.id === command.actorId);
    if (!action) {
      throw new Error(`Actor ${actor.id} attempted unknown action.`);
    }
    this.record({ type: 'action-start', actorId: actor.id, action });
    const targets = this.resolveTargets(actor, action, command.target);
    switch (action.category) {
      case 'attack':
        this.resolveAttack(actor, targets, action);
        break;
      case 'psynergy':
        this.resolvePsynergy(actor, targets, action);
        break;
      case 'djinn':
        this.resolveDjinn(actor, targets, action);
        break;
      case 'summon':
        this.resolveSummon(actor, targets, action);
        break;
      case 'item':
        this.resolveItem(actor, targets, action);
        break;
      case 'defend':
        this.resolveDefend(actor, action);
        break;
      case 'flee':
        this.resolveFlee(actor);
        break;
      default:
        throw new Error(`Unsupported action category ${(action as BattleAction).category}`);
    }
    this.evaluateOutcome();
  }

  private resolveAttack(actor: Combatant, targets: Combatant[], action: BattleAction): void {
    const target = targets[0];
    if (!target) return;
    const { amount, isCritical } = calculateDamage({
      actor,
      target,
      power: 1,
      element: actor.stats.element,
      rng: this.rng
    });
    applyDamage(target, amount, isCritical, actor.stats.element, this.state.log, actor.id);
  }

  private resolvePsynergy(actor: Combatant, targets: Combatant[], action: BattleAction): void {
    if (action.category !== 'psynergy') return;
    if (actor.stats.pp < action.cost) {
      this.record({
        type: 'message',
        actorId: actor.id,
        message: `${actor.name} lacks the PP to cast ${action.name}!`
      });
      return;
    }
    actor.stats.pp -= action.cost;
    this.record({ type: 'resource', actorId: actor.id, deltaPp: -action.cost } satisfies ResourceEvent);

    if (action.effect === 'heal') {
      targets.forEach((target) => {
        const healAmount = Math.round(action.power * 1.1 + actor.stats.attack * 0.2);
        applyHeal(target, healAmount, actor.id, this.state.log);
      });
      return;
    }

    if (action.effect === 'cleanse') {
      targets.forEach((target) => {
        ['poison', 'stun'].forEach((status) => removeStatus(target, status as any));
        this.record({
          type: 'status',
          actorId: actor.id,
          targetId: target.id,
          status: { id: 'poison', duration: 0 },
          applied: false
        });
      });
      return;
    }

    targets.forEach((target) => {
      const { amount, isCritical } = calculateDamage({
        actor,
        target,
        power: action.power,
        element: action.element,
        rng: this.rng
      });
      applyDamage(target, amount, isCritical, action.element, this.state.log, actor.id);
    });
  }

  private resolveDjinn(actor: Combatant, targets: Combatant[], action: BattleAction): void {
    if (action.category !== 'djinn') return;
    if (action.mode === 'set') {
      const applied = applyStatus(actor, { id: 'djinn-set', duration: 4, potency: action.power });
      this.record({
        type: 'status',
        actorId: actor.id,
        targetId: actor.id,
        status: { id: 'djinn-set', duration: 4, potency: action.power },
        applied
      });
      return;
    }

    const setStatus = getStatus(actor, 'djinn-set');
    if (!setStatus) {
      this.record({
        type: 'message',
        actorId: actor.id,
        message: `${action.name} fizzles without a set Djinn!`
      });
      return;
    }
    removeStatus(actor, 'djinn-set');
    applyStatus(actor, { id: 'djinn-recovery', duration: 3 });
    this.record({
      type: 'status',
      actorId: actor.id,
      targetId: actor.id,
      status: { id: 'djinn-recovery', duration: 3 },
      applied: true
    });
    targets.forEach((target) => {
      const { amount, isCritical } = calculateDamage({
        actor,
        target,
        power: action.power + (setStatus.potency ?? 0),
        element: action.element,
        rng: this.rng
      });
      applyDamage(target, amount, isCritical, action.element, this.state.log, actor.id);
    });
  }

  private resolveSummon(actor: Combatant, targets: Combatant[], action: BattleAction): void {
    if (action.category !== 'summon') return;
    const availableDjinn = countDjinnSet(this.state.players);
    if (availableDjinn < action.requiredDjinn) {
      this.record({
        type: 'message',
        actorId: actor.id,
        message: `${actor.name} lacks the Djinn to summon ${action.name}!`
      });
      return;
    }
    consumeDjinn(this.state.players, action.requiredDjinn);
    targets.forEach((target) => {
      const { amount, isCritical } = calculateDamage({
        actor,
        target,
        power: action.power,
        element: action.element,
        rng: this.rng,
        isSummon: true
      });
      applyDamage(target, amount, isCritical, action.element, this.state.log, actor.id);
    });
  }

  private resolveItem(actor: Combatant, targets: Combatant[], action: BattleAction): void {
    if (action.category !== 'item') return;
    targets.forEach((target) => {
      switch (action.effect) {
        case 'heal':
          applyHeal(target, action.power, actor.id, this.state.log);
          break;
        case 'revive':
          if (!isAlive(target)) {
            target.stats.hp = Math.min(target.stats.maxHp, action.power);
            removeStatus(target, 'downed');
            this.record({
              type: 'message',
              actorId: actor.id,
              message: `${target.name} is revived!`
            });
          }
          break;
        case 'cleanse':
          ['poison', 'stun'].forEach((status) => removeStatus(target, status as any));
          break;
        default:
          break;
      }
    });
  }

  private resolveDefend(actor: Combatant, action: BattleAction): void {
    if (action.category !== 'defend') return;
    const applied = applyStatus(actor, {
      id: 'guarding',
      duration: 2,
      potency: action.guardMultiplier
    });
    this.record({
      type: 'status',
      actorId: actor.id,
      targetId: actor.id,
      status: { id: 'guarding', duration: 2, potency: action.guardMultiplier },
      applied
    } satisfies StatusEvent);
  }

  private resolveFlee(actor: Combatant): void {
    const enemies = actor.isPlayer ? this.state.enemies : this.state.players;
    const chance = fleeChance(actor, enemies.filter(isAlive));
    if (this.rng.next() < chance) {
      this.record({ type: 'message', actorId: actor.id, message: `${actor.name} fled!` });
      this.state.outcome = { type: 'fled', who: actor.isPlayer ? 'players' : 'enemies' };
    } else {
      this.record({ type: 'message', actorId: actor.id, message: `${actor.name} failed to flee.` });
    }
  }

  private resolveTargets(actor: Combatant, action: BattleAction, targetHint?: string): Combatant[] {
    const allies = actor.isPlayer ? this.state.players : this.state.enemies;
    const enemies = actor.isPlayer ? this.state.enemies : this.state.players;
    const scope = action.target;
    if (scope.type === 'single') {
      const targetId = targetHint ?? scope.id;
      const pools = [...allies, ...enemies];
      const target = pools.find((c) => c.id === targetId) ?? enemies.find(isAlive) ?? allies.find(isAlive);
      return target ? [target] : [];
    }
    const pool =
      scope.scope === 'allies'
        ? allies
        : scope.scope === 'enemies'
          ? enemies
          : [...allies, ...enemies];
    return pool.filter(isAlive);
  }

  private buildTurnOrder(): Combatant[] {
    const everyone = [...this.state.players, ...this.state.enemies].filter(isAlive);
    return [...everyone].sort((a, b) => {
      const guardA = getStatus(a, 'guarding')?.potency ?? 1;
      const guardB = getStatus(b, 'guarding')?.potency ?? 1;
      const aScore = a.stats.agility * guardA + this.rng.next() * 5;
      const bScore = b.stats.agility * guardB + this.rng.next() * 5;
      return bScore - aScore;
    });
  }

  private evaluateOutcome(): void {
    if (this.state.outcome.type !== 'in-progress') return;
    const playersAlive = this.state.players.some(isAlive);
    const enemiesAlive = this.state.enemies.some(isAlive);
    if (!playersAlive || !enemiesAlive) {
      this.state.outcome = {
        type: 'victory',
        winner: playersAlive ? 'players' : 'enemies'
      };
    }
  }

  private record(event: BattleLogEvent): void {
    this.state.log.push(event);
  }
}

function cloneCombatant(value: Combatant): Combatant {
  return {
    ...value,
    stats: { ...value.stats },
    statuses: value.statuses.map((status) => ({ ...status })),
    actions: value.actions.map((action) => ({ ...action }))
  };
}

interface DamageInput {
  actor: Combatant;
  target: Combatant;
  power: number;
  element: Element;
  rng: DeterministicRng;
  isSummon?: boolean;
}

interface DamageResult {
  amount: number;
  isCritical: boolean;
}

function calculateDamage({ actor, target, power, element, rng, isSummon }: DamageInput): DamageResult {
  const baseAttack = actor.stats.attack * power;
  const defense = target.stats.defense;
  const guard = getStatus(target, 'guarding')?.potency ?? 1;
  const elementMultiplier = computeElementMultiplier(element, target.stats.element);
  const randomFactor = 0.9 + rng.next() * 0.2;
  const critical = rng.next() < actor.stats.luck / 200;
  let damage = Math.max(1, baseAttack - defense * 0.4);
  damage *= elementMultiplier;
  damage *= randomFactor;
  damage *= critical ? 1.5 : 1;
  damage *= guard;
  if (isSummon) {
    damage *= 1.2;
  }
  damage = Math.round(damage);
  return { amount: Math.max(1, damage), isCritical: critical };
}

function applyDamage(
  target: Combatant,
  amount: number,
  isCritical: boolean,
  element: Element,
  log: BattleLogEvent[],
  actorId: string
): void {
  target.stats.hp = Math.max(0, target.stats.hp - amount);
  if (target.stats.hp === 0 && !hasStatus(target, 'downed')) {
    applyStatus(target, { id: 'downed', duration: 99 });
  }
  const event: DamageEvent = {
    type: 'damage',
    actorId,
    targetId: target.id,
    amount,
    element,
    isCritical
  };
  log.push(event);
}

function applyHeal(target: Combatant, amount: number, actorId: string, log: BattleLogEvent[]): void {
  const previous = target.stats.hp;
  target.stats.hp = Math.min(target.stats.maxHp, target.stats.hp + amount);
  const delta = target.stats.hp - previous;
  const event: HealEvent = {
    type: 'heal',
    actorId,
    targetId: target.id,
    amount: delta
  };
  log.push(event);
}

function computeElementMultiplier(attacker: Element, defender: Element): number {
  if (attacker === 'neutral' || defender === 'neutral') {
    return 1;
  }
  const advantage: Record<Element, Element> = {
    venus: 'mercury',
    mercury: 'mars',
    mars: 'jupiter',
    jupiter: 'venus',
    neutral: 'neutral'
  };
  if (advantage[attacker] === defender) {
    return 1.25;
  }
  if (advantage[defender] === attacker) {
    return 0.75;
  }
  return 1;
}

function fleeChance(actor: Combatant, enemies: Combatant[]): number {
  const enemyAgility =
    enemies.reduce((total, enemy) => total + enemy.stats.agility, 0) / Math.max(1, enemies.length);
  const base = 0.35 + (actor.stats.agility - enemyAgility) / 200;
  return Math.min(0.9, Math.max(0.2, base));
}

function countDjinnSet(combatants: Combatant[]): number {
  return combatants.reduce((total, combatant) => total + (getStatus(combatant, 'djinn-set') ? 1 : 0), 0);
}

function consumeDjinn(combatants: Combatant[], count: number): void {
  let remaining = count;
  for (const combatant of combatants) {
    if (remaining <= 0) break;
    if (getStatus(combatant, 'djinn-set')) {
      removeStatus(combatant, 'djinn-set');
      applyStatus(combatant, { id: 'djinn-recovery', duration: 4 });
      remaining -= 1;
    }
  }
}

function isAlive(combatant: Combatant): boolean {
  return combatant.stats.hp > 0 && !hasStatus(combatant, 'downed');
}
