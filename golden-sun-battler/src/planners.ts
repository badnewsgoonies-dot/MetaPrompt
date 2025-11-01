import { ActionCommand, ActionPlanner, BattleAction, Combatant, PlanningContext } from './types.js';

export class QueuedActionPlanner implements ActionPlanner {
  private queue: ActionCommand[] = [];

  constructor(private readonly actorId: string) {}

  enqueue(command: ActionCommand): void {
    if (command.actorId !== this.actorId) {
      this.queue.push({ ...command, actorId: this.actorId });
      return;
    }
    this.queue.push(command);
  }

  clear(): void {
    this.queue = [];
  }

  pendingCount(): number {
    return this.queue.length;
  }

  chooseAction(context: PlanningContext): ActionCommand {
    const command = this.queue.shift();
    if (!command) {
      throw new Error(`No queued action for ${context.actor.id}`);
    }
    return command;
  }
}

export interface SimpleAiOptions {
  preferPsynergyAbove?: number;
  healThreshold?: number;
}

export class SimpleAiPlanner implements ActionPlanner {
  constructor(private readonly options: SimpleAiOptions = {}) {}

  chooseAction(context: PlanningContext): ActionCommand {
    const action = this.selectAction(context.actor, context);
    const target = this.selectTarget(action, context);
    return { actorId: context.actor.id, action, target };
  }

  private selectAction(actor: Combatant, context: PlanningContext): BattleAction {
    const healThreshold = this.options.healThreshold ?? 0.45;
    const preferPsynergyAbove = this.options.preferPsynergyAbove ?? 0.5;
    const available = actor.actions.filter((action) => canPayCost(actor, action));
    const healing = available.filter((action) => action.category === 'psynergy' && action.effect === 'heal');
    const alliesNeedingHeal = context.allies.filter((ally) => ally.stats.hp / ally.stats.maxHp < healThreshold);
    if (healing.length > 0 && alliesNeedingHeal.length > 0) {
      return healing[0];
    }

    const offensivePsynergy = available.filter((action) => action.category === 'psynergy' && action.effect !== 'heal');
    const attack = available.find((action) => action.category === 'attack');

    if (
      offensivePsynergy.length > 0 &&
      actor.stats.pp / Math.max(actor.stats.maxPp, 1) >= preferPsynergyAbove
    ) {
      return offensivePsynergy[0];
    }

    if (attack) {
      return attack;
    }

    return available[0] ?? actor.actions[0];
  }

  private selectTarget(action: BattleAction, context: PlanningContext): string | undefined {
    if (action.target.type === 'single') {
      if (action.category === 'psynergy' && action.effect === 'heal') {
        const wounded = [...context.allies]
          .filter((ally) => ally.stats.hp < ally.stats.maxHp)
          .sort((a, b) => a.stats.hp / a.stats.maxHp - b.stats.hp / b.stats.maxHp);
        return wounded[0]?.id ?? context.actor.id;
      }
      if (action.category === 'item' && action.effect !== 'heal') {
        const fallen = context.allies.find((ally) => ally.stats.hp <= 0);
        return fallen?.id ?? context.allies[0]?.id;
      }
      const target = [...context.enemies]
        .filter((enemy) => enemy.stats.hp > 0)
        .sort((a, b) => a.stats.hp - b.stats.hp);
      return target[0]?.id ?? context.enemies[0]?.id;
    }
    return undefined;
  }
}

function canPayCost(actor: Combatant, action: BattleAction): boolean {
  if (action.category === 'psynergy' && actor.stats.pp < action.cost) {
    return false;
  }
  return true;
}
