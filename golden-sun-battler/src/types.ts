export type Element = 'venus' | 'mars' | 'jupiter' | 'mercury' | 'neutral';

export type StatusId =
  | 'downed'
  | 'guarding'
  | 'poison'
  | 'stun'
  | 'djinn-set'
  | 'djinn-recovery';

export interface StatusEffect {
  id: StatusId;
  duration: number;
  potency?: number;
}

export interface Stats {
  maxHp: number;
  hp: number;
  maxPp: number;
  pp: number;
  attack: number;
  defense: number;
  agility: number;
  luck: number;
  element: Element;
}

export interface Combatant {
  id: string;
  name: string;
  stats: Stats;
  statuses: StatusEffect[];
  isPlayer: boolean;
  actions: BattleAction[];
}

export type Target =
  | { type: 'single'; id: string }
  | { type: 'all'; scope: 'enemies' | 'allies' | 'field' };

export interface ActionContext {
  source: Combatant;
  targets: Combatant[];
  seed: string;
  round: number;
  turnIndex: number;
}

export type BattleEvent =
  | { type: 'action-start'; actorId: string; action: BattleAction };

export interface DamageEvent {
  type: 'damage';
  actorId: string;
  targetId: string;
  amount: number;
  element: Element;
  isCritical: boolean;
}

export interface HealEvent {
  type: 'heal';
  actorId: string;
  targetId: string;
  amount: number;
}

export interface StatusEvent {
  type: 'status';
  actorId: string;
  targetId: string;
  status: StatusEffect;
  applied: boolean;
}

export interface MessageEvent {
  type: 'message';
  message: string;
  actorId?: string;
}

export interface ResourceEvent {
  type: 'resource';
  actorId: string;
  deltaPp?: number;
}

export interface OrderEvent {
  type: 'order';
  order: string[];
}

export type BattleLogEvent =
  | BattleEvent
  | DamageEvent
  | HealEvent
  | StatusEvent
  | MessageEvent
  | ResourceEvent
  | OrderEvent;

export type BattleOutcome =
  | { type: 'in-progress' }
  | { type: 'victory'; winner: 'players' | 'enemies' }
  | { type: 'fled'; who: 'players' | 'enemies' };

export type ActionCategory =
  | 'attack'
  | 'psynergy'
  | 'djinn'
  | 'summon'
  | 'item'
  | 'defend'
  | 'flee';

export interface BattleActionBase {
  id: string;
  name: string;
  category: ActionCategory;
  target: Target;
}

export interface AttackAction extends BattleActionBase {
  category: 'attack';
}

export interface PsynergyAction extends BattleActionBase {
  category: 'psynergy';
  element: Element;
  cost: number;
  power: number;
  effect?: 'heal' | 'cleanse' | 'buff';
}

export interface DjinnAction extends BattleActionBase {
  category: 'djinn';
  element: Element;
  mode: 'set' | 'release';
  power: number;
}

export interface SummonAction extends BattleActionBase {
  category: 'summon';
  element: Element;
  power: number;
  requiredDjinn: number;
}

export interface ItemAction extends BattleActionBase {
  category: 'item';
  effect: 'heal' | 'revive' | 'cleanse';
  power: number;
}

export interface DefendAction extends BattleActionBase {
  category: 'defend';
  guardMultiplier: number;
}

export interface FleeAction extends BattleActionBase {
  category: 'flee';
}

export type BattleAction =
  | AttackAction
  | PsynergyAction
  | DjinnAction
  | SummonAction
  | ItemAction
  | DefendAction
  | FleeAction;

export interface ActionCommand {
  actorId: string;
  action: BattleAction;
  target?: string;
}

export interface ActionPlanner {
  chooseAction(context: PlanningContext): ActionCommand;
}

export interface PlanningContext {
  actor: Combatant;
  allies: Combatant[];
  enemies: Combatant[];
  round: number;
  history: BattleLogEvent[];
  rng: () => number;
}

export interface BattleSnapshot {
  seed: string;
  round: number;
  parties: {
    players: Combatant[];
    enemies: Combatant[];
  };
  log: BattleLogEvent[];
  outcome: BattleOutcome;
}
