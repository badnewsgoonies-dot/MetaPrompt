import {
  ActionCommand,
  ActionPlanner,
  BattleAction,
  BattleEngine,
  BattleLogEvent,
  BattleSnapshot,
  Combatant,
  Element
} from '../index.js';
import { QueuedActionPlanner, SimpleAiPlanner } from '../planners.js';

type OverlayMode = 'psynergy' | 'djinn' | 'summon' | 'item';

interface UiState {
  snapshot: BattleSnapshot;
  currentActorId: string | null;
  plannedActors: Set<string>;
  pendingAction: { actorId: string; action: BattleAction } | null;
  overlayMode: OverlayMode | null;
  displayedLog: number;
  targetScope: 'allies' | 'enemies' | null;
}

const party: Combatant[] = [
  {
    id: 'isaac',
    name: 'Isaac',
    isPlayer: true,
    statuses: [],
    stats: {
      maxHp: 210,
      hp: 210,
      maxPp: 52,
      pp: 52,
      attack: 145,
      defense: 102,
      agility: 128,
      luck: 20,
      element: 'venus'
    },
    actions: [
      { id: 'isaac-attack', name: 'Attack', category: 'attack', target: { type: 'single', id: 'mad-wolf' } },
      {
        id: 'isaac-ragnarok',
        name: 'Ragnarok',
        category: 'psynergy',
        element: 'venus',
        cost: 14,
        power: 1.6,
        target: { type: 'single', id: 'mad-wolf' }
      },
      {
        id: 'isaac-gold-djinn',
        name: 'Flint',
        category: 'djinn',
        element: 'venus',
        mode: 'set',
        power: 30,
        target: { type: 'single', id: 'isaac' }
      },
      {
        id: 'isaac-release',
        name: 'Granite',
        category: 'djinn',
        element: 'venus',
        mode: 'release',
        power: 40,
        target: { type: 'all', scope: 'enemies' }
      },
      {
        id: 'isaac-summon-venus',
        name: 'Judgement',
        category: 'summon',
        element: 'venus',
        power: 2.4,
        requiredDjinn: 4,
        target: { type: 'all', scope: 'enemies' }
      },
      { id: 'isaac-guard', name: 'Defend', category: 'defend', guardMultiplier: 0.5, target: { type: 'single', id: 'isaac' } },
      { id: 'isaac-flee', name: 'Flee', category: 'flee', target: { type: 'single', id: 'isaac' } }
    ]
  },
  {
    id: 'garet',
    name: 'Garet',
    isPlayer: true,
    statuses: [],
    stats: {
      maxHp: 220,
      hp: 220,
      maxPp: 45,
      pp: 45,
      attack: 158,
      defense: 110,
      agility: 102,
      luck: 14,
      element: 'mars'
    },
    actions: [
      { id: 'garet-attack', name: 'Attack', category: 'attack', target: { type: 'single', id: 'brigand' } },
      {
        id: 'garet-flare',
        name: 'Flare Storm',
        category: 'psynergy',
        element: 'mars',
        cost: 10,
        power: 1.3,
        target: { type: 'all', scope: 'enemies' }
      },
      {
        id: 'garet-set',
        name: 'Torch',
        category: 'djinn',
        element: 'mars',
        mode: 'set',
        power: 28,
        target: { type: 'single', id: 'garet' }
      },
      {
        id: 'garet-release',
        name: 'Cannon',
        category: 'djinn',
        element: 'mars',
        mode: 'release',
        power: 45,
        target: { type: 'all', scope: 'enemies' }
      },
      {
        id: 'garet-summon',
        name: 'Meteor',
        category: 'summon',
        element: 'mars',
        power: 2.2,
        requiredDjinn: 4,
        target: { type: 'all', scope: 'enemies' }
      },
      { id: 'garet-guard', name: 'Defend', category: 'defend', guardMultiplier: 0.5, target: { type: 'single', id: 'garet' } }
    ]
  },
  {
    id: 'ivan',
    name: 'Ivan',
    isPlayer: true,
    statuses: [],
    stats: {
      maxHp: 170,
      hp: 170,
      maxPp: 62,
      pp: 62,
      attack: 132,
      defense: 92,
      agility: 150,
      luck: 24,
      element: 'jupiter'
    },
    actions: [
      { id: 'ivan-attack', name: 'Attack', category: 'attack', target: { type: 'single', id: 'mad-wolf' } },
      {
        id: 'ivan-thor',
        name: 'Shine Plasma',
        category: 'psynergy',
        element: 'jupiter',
        cost: 16,
        power: 1.5,
        target: { type: 'all', scope: 'enemies' }
      },
      {
        id: 'ivan-set',
        name: 'Gust',
        category: 'djinn',
        element: 'jupiter',
        mode: 'set',
        power: 24,
        target: { type: 'single', id: 'ivan' }
      },
      {
        id: 'ivan-release',
        name: 'Smog',
        category: 'djinn',
        element: 'jupiter',
        mode: 'release',
        power: 35,
        target: { type: 'all', scope: 'enemies' }
      },
      {
        id: 'ivan-summon',
        name: 'Thor',
        category: 'summon',
        element: 'jupiter',
        power: 2.1,
        requiredDjinn: 4,
        target: { type: 'all', scope: 'enemies' }
      },
      { id: 'ivan-guard', name: 'Defend', category: 'defend', guardMultiplier: 0.5, target: { type: 'single', id: 'ivan' } }
    ]
  },
  {
    id: 'mia',
    name: 'Mia',
    isPlayer: true,
    statuses: [],
    stats: {
      maxHp: 190,
      hp: 190,
      maxPp: 70,
      pp: 70,
      attack: 120,
      defense: 105,
      agility: 118,
      luck: 28,
      element: 'mercury'
    },
    actions: [
      { id: 'mia-attack', name: 'Attack', category: 'attack', target: { type: 'single', id: 'brigand' } },
      {
        id: 'mia-heal',
        name: 'Ply',
        category: 'psynergy',
        element: 'mercury',
        cost: 10,
        power: 0.9,
        effect: 'heal',
        target: { type: 'single', id: 'isaac' }
      },
      {
        id: 'mia-plywell',
        name: 'Wish',
        category: 'psynergy',
        element: 'mercury',
        cost: 18,
        power: 0.7,
        effect: 'heal',
        target: { type: 'all', scope: 'allies' }
      },
      {
        id: 'mia-set',
        name: 'Sleet',
        category: 'djinn',
        element: 'mercury',
        mode: 'set',
        power: 26,
        target: { type: 'single', id: 'mia' }
      },
      {
        id: 'mia-release',
        name: 'Hail',
        category: 'djinn',
        element: 'mercury',
        mode: 'release',
        power: 42,
        target: { type: 'all', scope: 'enemies' }
      },
      {
        id: 'mia-summon',
        name: 'Neptune',
        category: 'summon',
        element: 'mercury',
        power: 2.0,
        requiredDjinn: 4,
        target: { type: 'all', scope: 'enemies' }
      },
      { id: 'mia-guard', name: 'Defend', category: 'defend', guardMultiplier: 0.5, target: { type: 'single', id: 'mia' } }
    ]
  }
];

const enemies: Combatant[] = [
  {
    id: 'mad-wolf',
    name: 'Mad Wolf',
    isPlayer: false,
    statuses: [],
    stats: {
      maxHp: 320,
      hp: 320,
      maxPp: 20,
      pp: 20,
      attack: 140,
      defense: 95,
      agility: 112,
      luck: 16,
      element: 'mars'
    },
    actions: [
      { id: 'wolf-bite', name: 'Feral Bite', category: 'attack', target: { type: 'single', id: 'isaac' } },
      {
        id: 'wolf-howl',
        name: 'Heat Breath',
        category: 'psynergy',
        element: 'mars',
        cost: 6,
        power: 1.2,
        target: { type: 'all', scope: 'enemies' }
      }
    ]
  },
  {
    id: 'brigand',
    name: 'Brigand',
    isPlayer: false,
    statuses: [],
    stats: {
      maxHp: 260,
      hp: 260,
      maxPp: 12,
      pp: 12,
      attack: 135,
      defense: 88,
      agility: 98,
      luck: 12,
      element: 'venus'
    },
    actions: [
      { id: 'brigand-slash', name: 'Slash', category: 'attack', target: { type: 'single', id: 'isaac' } }
    ]
  },
  {
    id: 'bat',
    name: 'Vile Bat',
    isPlayer: false,
    statuses: [],
    stats: {
      maxHp: 180,
      hp: 180,
      maxPp: 16,
      pp: 16,
      attack: 110,
      defense: 70,
      agility: 160,
      luck: 18,
      element: 'jupiter'
    },
    actions: [
      { id: 'bat-attack', name: 'Claw', category: 'attack', target: { type: 'single', id: 'mia' } },
      {
        id: 'bat-screech',
        name: 'Sonic Scream',
        category: 'psynergy',
        element: 'jupiter',
        cost: 8,
        power: 1.1,
        target: { type: 'all', scope: 'enemies' }
      }
    ]
  }
];

const engine = new BattleEngine(party, enemies, { seed: 'demo-ui-seed' });
const playerPlanners = new Map<string, QueuedActionPlanner>();
party.forEach((hero) => playerPlanners.set(hero.id, new QueuedActionPlanner(hero.id)));

const planners: Record<string, ActionPlanner> = {};
playerPlanners.forEach((planner, id) => {
  planners[id] = planner;
});
enemies.forEach((enemy) => {
  planners[enemy.id] = new SimpleAiPlanner({ preferPsynergyAbove: 0.4, healThreshold: 0.3 });
});

const state: UiState = {
  snapshot: engine.snapshot,
  currentActorId: null,
  plannedActors: new Set<string>(),
  pendingAction: null,
  overlayMode: null,
  displayedLog: 0,
  targetScope: null
};

const statBar = document.getElementById('party-status') as HTMLDivElement;
const enemyRow = document.getElementById('enemy-row') as HTMLDivElement;
const partyRow = document.getElementById('party-row') as HTMLDivElement;
const portraits = document.getElementById('portrait-grid') as HTMLDivElement;
const combatLog = document.getElementById('combat-log') as HTMLDivElement;
const actionMenu = document.getElementById('action-menu') as HTMLDivElement;
const overlay = document.getElementById('action-overlay') as HTMLDivElement;
const overlayTitle = overlay.querySelector('[data-title]') as HTMLElement;
const overlayList = overlay.querySelector('[data-list]') as HTMLUListElement;
const overlayDetail = overlay.querySelector('[data-detail]') as HTMLDivElement;
const closeOverlayButton = document.getElementById('close-overlay') as HTMLButtonElement;
const outcomeBanner = document.getElementById('outcome-banner') as HTMLDivElement | null;

closeOverlayButton?.addEventListener('click', () => {
  closeOverlay();
});

enemyRow.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest('[data-combatant]') as HTMLElement | null;
  if (!target) return;
  if (state.targetScope !== 'enemies') return;
  const combatantId = target.dataset.combatant ?? '';
  handleTargetSelection(combatantId);
});

partyRow.addEventListener('click', (event) => {
  const target = (event.target as HTMLElement).closest('[data-combatant]') as HTMLElement | null;
  if (!target) return;
  if (state.targetScope !== 'allies') return;
  const combatantId = target.dataset.combatant ?? '';
  handleTargetSelection(combatantId);
});

renderSnapshot(state.snapshot);
startRound();

function startRound(): void {
  playerPlanners.forEach((planner) => planner.clear());
  state.plannedActors.clear();
  state.pendingAction = null;
  state.overlayMode = null;
  state.targetScope = null;
  closeOverlay();
  if (state.snapshot.outcome.type !== 'in-progress') {
    renderActionMenu(null);
    updateOutcome();
    return;
  }
  state.currentActorId = nextActorId();
  renderActionMenu(getCurrentActor());
  highlightActivePortrait();
}

function renderSnapshot(snapshot: BattleSnapshot): void {
  state.snapshot = snapshot;
  renderPartyStatus(snapshot.parties.players);
  renderEnemyRow(snapshot.parties.enemies);
  renderPartyRow(snapshot.parties.players);
  renderPortraits(snapshot.parties.players);
  renderCombatLog(snapshot.log);
  updateOutcome();
}

function renderPartyStatus(players: Combatant[]): void {
  const html = players
    .map((player) => {
      const hpPercent = Math.max(0, Math.min(100, Math.round((player.stats.hp / player.stats.maxHp) * 100)));
      const ppPercent = Math.max(0, Math.min(100, Math.round((player.stats.pp / player.stats.maxPp) * 100)));
      return `
        <div class="hero-stat" data-id="${player.id}">
          <div class="name">${player.name}</div>
          <div class="stat-line">
            <span class="stat-label">HP</span>
            <span class="stat-value">${player.stats.hp}/${player.stats.maxHp}</span>
            <div class="bar"><div class="bar-fill" style="width:${hpPercent}%"></div></div>
          </div>
          <div class="stat-line">
            <span class="stat-label">PP</span>
            <span class="stat-value">${player.stats.pp}/${player.stats.maxPp}</span>
            <div class="bar"><div class="bar-fill pp" style="width:${ppPercent}%"></div></div>
          </div>
        </div>
      `;
    })
    .join('');
  statBar.innerHTML = html;
}

function renderEnemyRow(enemiesData: Combatant[]): void {
  const html = enemiesData
    .map((enemy) => {
      const statusClass = !isAlive(enemy) ? ' fainted' : '';
      return `
        <div class="enemy${statusClass}" data-combatant="${enemy.id}" data-side="enemies" tabindex="0">
          <img src="../../../sprites/golden-sun/battle/enemies/${spriteName(enemy)}" alt="${enemy.name}" />
        </div>
      `;
    })
    .join('');
  enemyRow.innerHTML = html;
}

function renderPartyRow(players: Combatant[]): void {
  const html = players
    .map((player) => {
      const statusClass = !isAlive(player) ? ' fainted' : '';
      return `
        <div class="hero${statusClass}" data-combatant="${player.id}" data-side="allies" tabindex="0">
          <img src="../assets/${partySprite(player)}" alt="${player.name}" />
        </div>
      `;
    })
    .join('');
  partyRow.innerHTML = html;
}

function renderPortraits(players: Combatant[]): void {
  const html = players
    .map((player) => {
      const isActive = player.id === state.currentActorId;
      const classes = ['portrait'];
      if (isActive) classes.push('active');
      if (!isAlive(player)) classes.push('fainted');
      return `
        <div class="${classes.join(' ')}" data-combatant="${player.id}">
          <img src="../../../sprites/golden-sun/icons/characters/${portraitName(player)}" alt="${player.name} portrait" />
          <div class="char-name">${player.name}</div>
        </div>
      `;
    })
    .join('');
  portraits.innerHTML = html;
}

function renderCombatLog(log: BattleLogEvent[]): void {
  const entries = log.map((event) => `<div class="log-entry">${formatLogEntry(event)}</div>`).join('');
  combatLog.innerHTML = entries;
  combatLog.scrollTop = combatLog.scrollHeight;
  state.displayedLog = log.length;
}

interface ActionButtonConfig {
  label: string;
  onClick?: () => void;
  disabled?: boolean;
}

function renderActionMenu(actor: Combatant | null): void {
  if (!actionMenu) return;
  if (!actor || state.snapshot.outcome.type !== 'in-progress') {
    actionMenu.innerHTML = '<div class="action-hint">Battle Complete</div>';
    return;
  }

  const buttons: ActionButtonConfig[] = [];
  const attacks = actor.actions.filter((action) => action.category === 'attack');
  if (attacks.length > 0) {
    buttons.push({
      label: 'Attack',
      onClick: () => commitAction(actor, attacks[0])
    });
  }

  const psynergy = actor.actions.filter((action) => action.category === 'psynergy');
  buttons.push({
    label: 'Psynergy',
    disabled: psynergy.length === 0,
    onClick: () => openOverlay('psynergy', actor, psynergy)
  });

  const djinn = actor.actions.filter((action) => action.category === 'djinn');
  buttons.push({
    label: 'Djinn',
    disabled: djinn.length === 0,
    onClick: () => openOverlay('djinn', actor, djinn)
  });

  const summons = actor.actions.filter((action) => action.category === 'summon');
  buttons.push({
    label: 'Summon',
    disabled: summons.length === 0,
    onClick: () => openOverlay('summon', actor, summons)
  });

  const items = actor.actions.filter((action) => action.category === 'item');
  buttons.push({
    label: 'Item',
    disabled: items.length === 0,
    onClick: () => openOverlay('item', actor, items)
  });

  const defend = actor.actions.find((action) => action.category === 'defend');
  if (defend) {
    buttons.push({ label: 'Defend', onClick: () => commitAction(actor, defend) });
  }

  const flee = actor.actions.find((action) => action.category === 'flee');
  if (flee) {
    buttons.push({ label: 'Flee', onClick: () => commitAction(actor, flee) });
  }

  const planned = state.plannedActors.size;
  const total = state.snapshot.parties.players.filter(isAlive).length;

  actionMenu.innerHTML =
    buttons
      .map((button) => {
        const disabled = button.disabled ? 'disabled' : '';
        return `<button class="action-button" ${disabled}>${button.label}</button>`;
      })
      .join('') +
    `<div class="action-progress">Planned ${planned}/${total} turns</div>`;

  const renderedButtons = Array.from(actionMenu.querySelectorAll('button'));
  renderedButtons.forEach((button, index) => {
    const config = buttons[index];
    if (!config || config.disabled || !config.onClick) return;
    button.addEventListener('click', config.onClick);
  });
}

function openOverlay(mode: OverlayMode, actor: Combatant, actions: BattleAction[]): void {
  if (!overlay) return;
  if (actions.length === 0) return;
  state.overlayMode = mode;
  overlay.hidden = false;
  overlayTitle.textContent = overlayTitleFor(mode, actor.name);
  overlayList.innerHTML = '';
  overlayDetail.innerHTML = '<p>Select an action to see details.</p>';

  actions.forEach((action) => {
    const item = document.createElement('li');
    item.className = 'ability-row';
    item.tabIndex = 0;
    item.innerHTML = abilityLabel(action);
    item.addEventListener('mouseenter', () => (overlayDetail.innerHTML = abilityDetail(action)));
    item.addEventListener('focus', () => (overlayDetail.innerHTML = abilityDetail(action)));
    item.addEventListener('click', () => {
      overlayDetail.innerHTML = abilityDetail(action);
      if (action.target.type === 'single' && needsTargetSelection(action)) {
        beginTargetSelection(actor, action);
      } else {
        commitAction(actor, action);
      }
    });
    overlayList.appendChild(item);
  });
}

function closeOverlay(): void {
  if (!overlay) return;
  overlay.hidden = true;
  overlayList.innerHTML = '';
  overlayDetail.innerHTML = '';
  state.overlayMode = null;
  state.pendingAction = null;
  state.targetScope = null;
  toggleSelectable('allies', false);
  toggleSelectable('enemies', false);
}

function beginTargetSelection(actor: Combatant, action: BattleAction): void {
  state.pendingAction = { actorId: actor.id, action };
  state.targetScope = action.category === 'psynergy' && action.effect === 'heal' ? 'allies' : 'enemies';
  overlayDetail.innerHTML = `<p>Select a target to use <strong>${action.name}</strong>.</p>`;
  toggleSelectable('allies', state.targetScope === 'allies');
  toggleSelectable('enemies', state.targetScope === 'enemies');
}

function handleTargetSelection(targetId: string): void {
  if (!state.pendingAction) return;
  toggleSelectable('allies', false);
  toggleSelectable('enemies', false);
  commitActionId(state.pendingAction.actorId, state.pendingAction.action, targetId);
}

function toggleSelectable(scope: 'allies' | 'enemies', enabled: boolean): void {
  const container = scope === 'allies' ? partyRow : enemyRow;
  container.classList.toggle('selecting', enabled);
  container.querySelectorAll('[data-combatant]').forEach((node) => {
    (node as HTMLElement).classList.toggle('selectable', enabled);
  });
}

function commitAction(actor: Combatant, action: BattleAction): void {
  if (action.target.type === 'single' && needsTargetSelection(action)) {
    beginTargetSelection(actor, action);
    return;
  }
  commitActionId(actor.id, action, undefined);
}

function needsTargetSelection(action: BattleAction): boolean {
  if (action.target.type !== 'single') return false;
  if (action.category === 'attack') return true;
  if (action.category === 'psynergy' && action.effect !== 'cleanse' && action.effect !== 'buff') return true;
  if (action.category === 'item') return true;
  return false;
}

function commitActionId(actorId: string, action: BattleAction, targetId: string | undefined): void {
  const planner = playerPlanners.get(actorId);
  if (!planner) return;
  const command: ActionCommand = { actorId, action, target: targetId };
  planner.enqueue(command);
  state.plannedActors.add(actorId);
  state.pendingAction = null;
  state.targetScope = null;
  closeOverlay();
  advanceTurn();
}

function advanceTurn(): void {
  const next = nextActorId();
  if (!next) {
    const snapshot = engine.nextRound(planners);
    renderSnapshot(snapshot);
    if (state.snapshot.outcome.type === 'in-progress') {
      startRound();
    } else {
      renderActionMenu(null);
      highlightActivePortrait();
    }
    return;
  }
  state.currentActorId = next;
  renderPortraits(state.snapshot.parties.players);
  renderActionMenu(getCurrentActor());
  highlightActivePortrait();
}

function nextActorId(): string | null {
  const alive = state.snapshot.parties.players.filter(isAlive);
  const remaining = alive.find((player) => !state.plannedActors.has(player.id));
  return remaining ? remaining.id : null;
}

function getCurrentActor(): Combatant | null {
  if (!state.currentActorId) return null;
  return state.snapshot.parties.players.find((player) => player.id === state.currentActorId) ?? null;
}

function highlightActivePortrait(): void {
  const cards = portraits.querySelectorAll('.portrait');
  cards.forEach((card) => {
    const element = card as HTMLElement;
    const id = element.dataset.combatant;
    element.classList.toggle('active', id === state.currentActorId);
  });
}

function formatLogEntry(event: BattleLogEvent): string {
  switch (event.type) {
    case 'order':
      return `Turn order: ${event.order.map((id) => displayName(id)).join(' → ')}`;
    case 'action-start':
      return `${displayName(event.actorId)} uses ${event.action.name}.`;
    case 'damage':
      return `${displayName(event.actorId)} deals <span class="critical">${event.amount}</span> ${elementName(event.element)} damage to ${displayName(event.targetId)}${event.isCritical ? ' (critical!)' : ''}.`;
    case 'heal':
      return `${displayName(event.actorId)} restores <span class="heal">${event.amount}</span> HP to ${displayName(event.targetId)}.`;
    case 'status':
      return statusMessage(event);
    case 'message':
      return event.message;
    case 'resource':
      if (typeof event.deltaPp === 'number') {
        const delta = event.deltaPp < 0 ? `${event.deltaPp}` : `+${event.deltaPp}`;
        return `${displayName(event.actorId)} PP ${delta}`;
      }
      return '';
    default:
      return '';
  }
}

function statusMessage(event: Extract<BattleLogEvent, { type: 'status' }>): string {
  const applied = event.applied ? 'gains' : 'shakes off';
  return `${displayName(event.targetId)} ${applied} ${statusName(event.status.id)}.`;
}

function displayName(id: string): string {
  const all = [...state.snapshot.parties.players, ...state.snapshot.parties.enemies];
  return all.find((unit) => unit.id === id)?.name ?? id;
}

function elementName(element: Element): string {
  return element.charAt(0).toUpperCase() + element.slice(1);
}

function statusName(statusId: string): string {
  switch (statusId) {
    case 'guarding':
      return 'a guard stance';
    case 'poison':
      return 'poison';
    case 'stun':
      return 'stun';
    case 'djinn-set':
      return 'a set Djinn';
    case 'djinn-recovery':
      return 'Djinn recovery';
    case 'downed':
      return 'a downed state';
    default:
      return statusId;
  }
}

function spriteName(enemy: Combatant): string {
  const map: Record<string, string> = {
    'Mad Wolf': 'Ape.gif',
    Brigand: 'Brigand.gif',
    'Vile Bat': 'Bat.gif'
  };
  return map[enemy.name] ?? 'Brigand.gif';
}

function partySprite(hero: Combatant): string {
  const map: Record<string, string> = {
    Isaac: 'Isaac_Axe_Front.gif',
    Garet: 'Garet_Axe_Front.gif',
    Ivan: 'Ivan_Staff_Front.gif',
    Mia: 'Mia_Mace_Front.gif'
  };
  return map[hero.name] ?? 'Isaac_Axe_Front.gif';
}

function portraitName(hero: Combatant): string {
  const map: Record<string, string> = {
    Isaac: 'Isaac1.gif',
    Garet: 'Garet1.gif',
    Ivan: 'Ivan.gif',
    Mia: 'Mia.gif'
  };
  return map[hero.name] ?? 'Isaac1.gif';
}

function abilityLabel(action: BattleAction): string {
  switch (action.category) {
    case 'psynergy':
      return `<span class="ability-name">${action.name}</span><span class="ability-meta">${elementName(action.element)} • ${action.cost} PP</span>`;
    case 'djinn':
      return `<span class="ability-name">${action.name}</span><span class="ability-meta">${capitalize(action.mode)} ${elementName(action.element)}</span>`;
    case 'summon':
      return `<span class="ability-name">${action.name}</span><span class="ability-meta">Requires ${action.requiredDjinn} Djinn</span>`;
    case 'item':
      return `<span class="ability-name">${action.name}</span><span class="ability-meta">${capitalize(action.effect)}</span>`;
    default:
      return `<span class="ability-name">${action.name}</span>`;
  }
}

function abilityDetail(action: BattleAction): string {
  switch (action.category) {
    case 'psynergy':
      return `
        <h3>${action.name}</h3>
        <p>Element: ${elementName(action.element)}</p>
        <p>Cost: ${action.cost} PP</p>
        <p>${action.effect === 'heal' ? 'Restores HP to a single ally or the whole party.' : 'Damages foes with elemental power.'}</p>
      `;
    case 'djinn':
      return `
        <h3>${action.name}</h3>
        <p>${action.mode === 'set' ? 'Sets a Djinn to prepare powerful summons and stat boosts.' : 'Releases a Djinn to unleash a burst attack and send it to recovery.'}</p>
      `;
    case 'summon':
      return `
        <h3>${action.name}</h3>
        <p>Summon unleashed elemental might dealing massive damage to all foes.</p>
        <p>Requires ${action.requiredDjinn} Djinn.</p>
      `;
    case 'item':
      return `
        <h3>${action.name}</h3>
        <p>Uses an item to ${action.effect}.</p>
      `;
    default:
      return `<h3>${action.name}</h3>`;
  }
}

function overlayTitleFor(mode: OverlayMode, actorName: string): string {
  switch (mode) {
    case 'psynergy':
      return `${actorName}'s Psynergy`;
    case 'djinn':
      return `${actorName}'s Djinn`;
    case 'summon':
      return 'Summon Tablet';
    case 'item':
      return 'Inventory';
  }
}

function capitalize(value: string | undefined): string {
  if (!value) return '';
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function isAlive(combatant: Combatant): boolean {
  return combatant.stats.hp > 0 && !combatant.statuses.some((status) => status.id === 'downed');
}

function updateOutcome(): void {
  if (!outcomeBanner) return;
  const outcome = state.snapshot.outcome;
  if (outcome.type === 'in-progress') {
    outcomeBanner.textContent = '';
    outcomeBanner.hidden = true;
    return;
  }
  outcomeBanner.hidden = false;
  if (outcome.type === 'victory') {
    const winner = outcome.winner === 'players' ? 'Party Victory!' : 'Enemies Triumph';
    outcomeBanner.textContent = winner;
  } else if (outcome.type === 'fled') {
    const who = outcome.who === 'players' ? 'The party fled safely.' : 'Enemies fled the battle.';
    outcomeBanner.textContent = who;
  }
}
