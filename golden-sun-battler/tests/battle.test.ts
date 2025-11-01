import { describe, expect, it } from 'vitest';
import {
  ActionCommand,
  ActionPlanner,
  AttackAction,
  BattleEngine,
  Combatant,
  DefendAction,
  DjinnAction,
  FleeAction,
  PsynergyAction,
  SummonAction
} from '../src/index.js';

class ScriptedPlanner implements ActionPlanner {
  private index = 0;
  constructor(private readonly script: ActionCommand[]) {}
  chooseAction(_context?: unknown): ActionCommand {
    const command = this.script[Math.min(this.index, this.script.length - 1)];
    this.index += 1;
    return command;
  }
}

function cloneCombatants(units: Combatant[]): Combatant[] {
  return units.map((unit) => ({
    ...unit,
    stats: { ...unit.stats },
    statuses: unit.statuses.map((status) => ({ ...status })),
    actions: unit.actions.map((action) => ({ ...action }))
  }));
}

function createParty(): { players: Combatant[]; enemies: Combatant[] } {
  const basicAttack: AttackAction = {
    id: 'strike',
    name: 'Strike',
    category: 'attack' as const,
    target: { type: 'single', id: '' }
  };
  const cure: PsynergyAction = {
    id: 'cure',
    name: 'Cure',
    category: 'psynergy',
    target: { type: 'single', id: '' },
    element: 'venus',
    cost: 3,
    power: 55,
    effect: 'heal'
  };
  const ragnarok: PsynergyAction = {
    id: 'ragnarok',
    name: 'Ragnarok',
    category: 'psynergy',
    target: { type: 'single', id: '' },
    element: 'venus',
    cost: 8,
    power: 1.7
  };
  const forge: DjinnAction = {
    id: 'forge',
    name: 'Forge',
    category: 'djinn',
    target: { type: 'all', scope: 'enemies' },
    element: 'mars',
    mode: 'set',
    power: 0
  };
  const unleashForge: DjinnAction = {
    ...forge,
    id: 'forge-release',
    mode: 'release',
    power: 1.2,
    target: { type: 'all', scope: 'enemies' }
  };
  const judgement: SummonAction = {
    id: 'judgement',
    name: 'Judgement',
    category: 'summon',
    target: { type: 'all', scope: 'enemies' },
    element: 'jupiter',
    power: 2.5,
    requiredDjinn: 1
  };
  const defend: DefendAction = {
    id: 'defend',
    name: 'Defend',
    category: 'defend',
    target: { type: 'single', id: '' },
    guardMultiplier: 0.5
  };

  const isaac: Combatant = {
    id: 'isaac',
    name: 'Isaac',
    isPlayer: true,
    stats: {
      maxHp: 400,
      hp: 400,
      maxPp: 50,
      pp: 50,
      attack: 120,
      defense: 70,
      agility: 100,
      luck: 15,
      element: 'venus'
    },
    statuses: [],
    actions: [basicAttack, cure, ragnarok, defend]
  };
  const garet: Combatant = {
    id: 'garet',
    name: 'Garet',
    isPlayer: true,
    stats: {
      maxHp: 420,
      hp: 420,
      maxPp: 45,
      pp: 45,
      attack: 135,
      defense: 65,
      agility: 92,
      luck: 12,
      element: 'mars'
    },
    statuses: [],
    actions: [basicAttack, forge, unleashForge, defend]
  };
  const ivan: Combatant = {
    id: 'ivan',
    name: 'Ivan',
    isPlayer: true,
    stats: {
      maxHp: 320,
      hp: 320,
      maxPp: 65,
      pp: 65,
      attack: 105,
      defense: 60,
      agility: 115,
      luck: 18,
      element: 'jupiter'
    },
    statuses: [],
    actions: [basicAttack, judgement, defend]
  };

  const bandit: Combatant = {
    id: 'bandit',
    name: 'Bandit',
    isPlayer: false,
    stats: {
      maxHp: 330,
      hp: 330,
      maxPp: 30,
      pp: 30,
      attack: 110,
      defense: 60,
      agility: 80,
      luck: 10,
      element: 'venus'
    },
    statuses: [],
    actions: [basicAttack, defend]
  };

  const thief: Combatant = {
    id: 'thief',
    name: 'Thief',
    isPlayer: false,
    stats: {
      maxHp: 300,
      hp: 300,
      maxPp: 20,
      pp: 20,
      attack: 95,
      defense: 55,
      agility: 85,
      luck: 9,
      element: 'mars'
    },
    statuses: [],
    actions: [basicAttack, defend]
  };

  const bruiser: Combatant = {
    id: 'bruiser',
    name: 'Bruiser',
    isPlayer: false,
    stats: {
      maxHp: 360,
      hp: 360,
      maxPp: 10,
      pp: 10,
      attack: 125,
      defense: 60,
      agility: 75,
      luck: 6,
      element: 'jupiter'
    },
    statuses: [],
    actions: [basicAttack, defend]
  };

  return {
    players: [isaac, garet, ivan],
    enemies: [bandit, thief, bruiser]
  };
}

function buildEngine(seed: string, overrides?: Partial<{ players: Combatant[]; enemies: Combatant[] }>) {
  const { players, enemies } = createParty();
  return new BattleEngine(overrides?.players ?? cloneCombatants(players), overrides?.enemies ?? cloneCombatants(enemies), {
    seed
  });
}

function planBasicStrikes(engine: BattleEngine): Record<string, ActionPlanner> {
  const snapshot = engine.snapshot;
  const planners: Record<string, ActionPlanner> = {};
  const firstEnemy = snapshot.parties.enemies.find(() => true)?.id ?? 'bandit';
  const firstPlayer = snapshot.parties.players.find(() => true)?.id ?? 'isaac';
  snapshot.parties.players.forEach((player) => {
    planners[player.id] = new ScriptedPlanner([
      { actorId: player.id, action: player.actions[0], target: firstEnemy }
    ]);
  });
  snapshot.parties.enemies.forEach((enemy) => {
    planners[enemy.id] = new ScriptedPlanner([
      { actorId: enemy.id, action: enemy.actions[0], target: firstPlayer }
    ]);
  });
  return planners;
}

describe('Golden Sun battle engine', () => {
  it('resolves a scripted battle with victory for the party', () => {
    const engine = buildEngine('victory-seed');
    const snapshot = engine.snapshot;
    const planners: Record<string, ActionPlanner> = {
      isaac: new ScriptedPlanner([
        { actorId: 'isaac', action: snapshot.parties.players[0].actions[2], target: 'bandit' },
        { actorId: 'isaac', action: snapshot.parties.players[0].actions[1], target: 'garet' },
        { actorId: 'isaac', action: snapshot.parties.players[0].actions[0], target: 'bandit' }
      ]),
      garet: new ScriptedPlanner([
        { actorId: 'garet', action: snapshot.parties.players[1].actions[1] },
        { actorId: 'garet', action: snapshot.parties.players[1].actions[2] }
      ]),
      ivan: new ScriptedPlanner([
        { actorId: 'ivan', action: snapshot.parties.players[2].actions[1] }
      ]),
      bandit: new ScriptedPlanner([
        { actorId: 'bandit', action: snapshot.parties.enemies[0].actions[0], target: 'isaac' }
      ]),
      thief: new ScriptedPlanner([
        { actorId: 'thief', action: snapshot.parties.enemies[1].actions[0], target: 'garet' }
      ]),
      bruiser: new ScriptedPlanner([
        { actorId: 'bruiser', action: snapshot.parties.enemies[2].actions[0], target: 'ivan' }
      ])
    };

    const result = engine.run(planners, { maxRounds: 6 });
    const defeated = result.parties.enemies.filter((enemy) => enemy.stats.hp === 0).length;
    expect(defeated).toBeGreaterThan(0);
    const damageEvents = result.log.filter((event) => event.type === 'damage');
    expect(damageEvents.length).toBeGreaterThan(3);
    const healEvents = result.log.filter((event) => event.type === 'heal');
    expect(healEvents.length).toBeGreaterThan(0);
  });

  it('produces deterministic logs for a given seed', () => {
    const engineA = buildEngine('deterministic');
    const engineB = buildEngine('deterministic');
    const plannersA = planBasicStrikes(engineA);
    const plannersB = planBasicStrikes(engineB);
    const logA = engineA.run(plannersA, { maxRounds: 1 }).log;
    const logB = engineB.run(plannersB, { maxRounds: 1 }).log;
    expect(logA).toEqual(logB);
  });

  it('supports fleeing from battle', () => {
    const { players, enemies } = createParty();
    const fleeAction: FleeAction = { id: 'flee', name: 'Flee', category: 'flee', target: { type: 'single', id: '' } };
    const fleeEngine = new BattleEngine(
      cloneCombatants([
        { ...players[0], stats: { ...players[0].stats, agility: 200 }, actions: [...players[0].actions, fleeAction] }
      ]),
      cloneCombatants([enemies[0]]),
      { seed: 'flee-seed' }
    );

    const planners: Record<string, ActionPlanner> = {
      isaac: new ScriptedPlanner([{ actorId: 'isaac', action: fleeEngine.snapshot.parties.players[0].actions.slice(-1)[0] }]),
      bandit: new ScriptedPlanner([{ actorId: 'bandit', action: fleeEngine.snapshot.parties.enemies[0].actions[0], target: 'isaac' }])
    };

    const outcome = fleeEngine.run(planners, { maxRounds: 2 }).outcome;
    expect(['victory', 'fled']).toContain(outcome.type);
  });
});
