import { Result, ok, err } from '../utils/result';
import { IRng } from '../utils/rng';
import { Element } from '../types/enemy';

/**
 * Enhanced Battle System for Golden Sun
 * Turn-based combat with speed-based turn order, elemental system, and status effects
 */

export interface BattleParticipant {
  id: string;
  name: string;
  level: number;
  hp: number;
  maxHp: number;
  pp: number;
  maxPp: number;
  attack: number;
  defense: number;
  agility: number;
  luck: number;
  element: Element;
  isAlly: boolean;
  statusEffects: StatusEffect[];
  djinnSet: number; // Number of Djinn currently Set
}

export interface StatusEffect {
  type: 'poison' | 'stun' | 'sleep' | 'seal' | 'haunt' | 'delusion';
  turnsRemaining: number;
  power?: number; // For damage-over-time effects
}

export interface BattleAction {
  actorId: string;
  type: 'attack' | 'psynergy' | 'djinn' | 'summon' | 'defend' | 'item' | 'flee';
  targetIds: string[];
  abilityId?: string;
  itemId?: string;
}

export interface BattleState {
  turn: number;
  participants: BattleParticipant[];
  turnOrder: string[]; // Participant IDs in turn order
  currentTurnIndex: number;
  battleLog: BattleLogEntry[];
  isComplete: boolean;
  victor: 'allies' | 'enemies' | null;
}

export interface BattleLogEntry {
  turn: number;
  message: string;
  type: 'action' | 'damage' | 'heal' | 'status' | 'defeat' | 'victory';
}

export interface DamageResult {
  damage: number;
  isCritical: boolean;
  elementMultiplier: number;
  targetId: string;
  targetDefeated: boolean;
}

/**
 * Initialize a battle with given participants
 */
export function initializeBattle(
  allies: BattleParticipant[],
  enemies: BattleParticipant[],
  rng: IRng
): Result<BattleState, string> {
  if (allies.length === 0) {
    return err('No allies in battle');
  }
  if (enemies.length === 0) {
    return err('No enemies in battle');
  }

  const participants = [...allies, ...enemies];
  const turnOrder = calculateTurnOrder(participants, rng);

  const battle: BattleState = {
    turn: 1,
    participants,
    turnOrder,
    currentTurnIndex: 0,
    battleLog: [{
      turn: 0,
      message: 'Battle started!',
      type: 'action'
    }],
    isComplete: false,
    victor: null
  };

  return ok(battle);
}

/**
 * Calculate turn order based on agility (speed-based)
 */
export function calculateTurnOrder(
  participants: BattleParticipant[],
  rng: IRng
): string[] {
  // Sort by agility + random variance (±10%)
  const withPriority = participants.map(p => ({
    id: p.id,
    priority: p.agility * (0.9 + rng.next() * 0.2)
  }));

  withPriority.sort((a, b) => b.priority - a.priority);
  return withPriority.map(p => p.id);
}

/**
 * Get current turn participant
 */
export function getCurrentTurnParticipant(
  battle: BattleState
): Result<BattleParticipant, string> {
  const participantId = battle.turnOrder[battle.currentTurnIndex];
  const participant = battle.participants.find(p => p.id === participantId);
  
  if (!participant) {
    return err(`Participant ${participantId} not found`);
  }

  return ok(participant);
}

/**
 * Execute a battle action
 */
export function executeBattleAction(
  battle: BattleState,
  action: BattleAction,
  rng: IRng
): Result<BattleState, string> {
  if (battle.isComplete) {
    return err('Battle is already complete');
  }

  const actorResult = battle.participants.find(p => p.id === action.actorId);
  if (!actorResult) {
    return err(`Actor ${action.actorId} not found`);
  }

  const actor = actorResult;

  // Check if actor can act (status effects)
  const canActResult = canParticipantAct(actor);
  if (!canActResult.ok) {
    battle.battleLog.push({
      turn: battle.turn,
      message: `${actor.name} ${canActResult.error}`,
      type: 'status'
    });
    return ok(advanceTurn(battle, rng));
  }

  switch (action.type) {
    case 'attack':
      return executeAttack(battle, actor, action.targetIds[0], rng);
    case 'defend':
      return executeDefend(battle, actor);
    case 'flee':
      return executeFlee(battle, actor, rng);
    default:
      return err(`Action type ${action.type} not implemented yet`);
  }
}

/**
 * Check if participant can act (status effect check)
 */
function canParticipantAct(participant: BattleParticipant): Result<true, string> {
  // Check for stun
  const stunned = participant.statusEffects.find(e => e.type === 'stun');
  if (stunned) {
    return err('is stunned and cannot move!');
  }

  // Check for sleep
  const asleep = participant.statusEffects.find(e => e.type === 'sleep');
  if (asleep) {
    return err('is asleep!');
  }

  return ok(true);
}

/**
 * Execute physical attack
 */
function executeAttack(
  battle: BattleState,
  actor: BattleParticipant,
  targetId: string,
  rng: IRng
): Result<BattleState, string> {
  const target = battle.participants.find(p => p.id === targetId);
  if (!target) {
    return err(`Target ${targetId} not found`);
  }

  const damageResult = calculateDamage(actor, target, rng);

  // Apply damage
  target.hp = Math.max(0, target.hp - damageResult.damage);

  // Log action
  const critText = damageResult.isCritical ? ' CRITICAL!' : '';
  battle.battleLog.push({
    turn: battle.turn,
    message: `${actor.name} attacks ${target.name} for ${damageResult.damage} damage!${critText}`,
    type: 'damage'
  });

  // Check if target defeated
  if (target.hp === 0) {
    battle.battleLog.push({
      turn: battle.turn,
      message: `${target.name} was defeated!`,
      type: 'defeat'
    });
  }

  // Check battle end
  const updatedBattle = checkBattleEnd(battle);

  return ok(advanceTurn(updatedBattle, rng));
}

/**
 * Calculate damage from attacker to target
 */
export function calculateDamage(
  attacker: BattleParticipant,
  target: BattleParticipant,
  rng: IRng
): DamageResult {
  // Base damage formula: (ATK - DEF/2) * variance * element_multiplier
  const baseDamage = Math.max(1, attacker.attack - Math.floor(target.defense / 2));
  
  // Random variance ±15%
  const variance = 0.85 + rng.next() * 0.3;
  
  // Critical hit check (luck-based)
  const critChance = attacker.luck / 100;
  const isCritical = rng.next() < critChance;
  const critMultiplier = isCritical ? 2.0 : 1.0;

  // Elemental multiplier
  const elementMultiplier = getElementalMultiplier(attacker.element, target);

  const finalDamage = Math.floor(baseDamage * variance * critMultiplier * elementMultiplier);

  return {
    damage: Math.max(1, finalDamage),
    isCritical,
    elementMultiplier,
    targetId: target.id,
    targetDefeated: target.hp - finalDamage <= 0
  };
}

/**
 * Get elemental damage multiplier
 */
export function getElementalMultiplier(
  attackElement: Element,
  target: BattleParticipant
): number {
  // Check weaknesses (2x damage)
  // Venus weak to Jupiter, Mars weak to Mercury, Jupiter weak to Venus, Mercury weak to Mars
  const weaknesses: Record<Element, Element> = {
    venus: 'jupiter',
    mars: 'mercury',
    jupiter: 'venus',
    mercury: 'mars'
  };

  if (weaknesses[target.element] === attackElement) {
    return 2.0;
  }

  // Check resistance (0.5x damage)
  if (target.element === attackElement) {
    return 0.5;
  }

  // Neutral (1x damage)
  return 1.0;
}

/**
 * Execute defend action
 */
function executeDefend(
  battle: BattleState,
  actor: BattleParticipant
): Result<BattleState, string> {
  battle.battleLog.push({
    turn: battle.turn,
    message: `${actor.name} takes a defensive stance!`,
    type: 'action'
  });

  // Note: Defense bonus would be applied on next attack received
  // For now, just log the action

  return ok(advanceTurn(battle, null));
}

/**
 * Execute flee action
 */
function executeFlee(
  battle: BattleState,
  actor: BattleParticipant,
  rng: IRng
): Result<BattleState, string> {
  // Flee success rate: 50% base + (party avg AGI - enemy avg AGI) / 10
  const allies = battle.participants.filter(p => p.isAlly && p.hp > 0);
  const enemies = battle.participants.filter(p => !p.isAlly && p.hp > 0);

  const allyAvgAgi = allies.reduce((sum, a) => sum + a.agility, 0) / allies.length;
  const enemyAvgAgi = enemies.reduce((sum, e) => sum + e.agility, 0) / enemies.length;

  const fleeChance = Math.min(0.95, 0.5 + (allyAvgAgi - enemyAvgAgi) / 100);

  if (rng.next() < fleeChance) {
    battle.isComplete = true;
    battle.victor = null; // Fled (no victor)
    battle.battleLog.push({
      turn: battle.turn,
      message: 'The party fled successfully!',
      type: 'victory'
    });
    return ok(battle);
  } else {
    battle.battleLog.push({
      turn: battle.turn,
      message: `${actor.name} tried to flee but failed!`,
      type: 'action'
    });
    return ok(advanceTurn(battle, rng));
  }
}

/**
 * Advance to next turn
 */
function advanceTurn(battle: BattleState, rng: IRng | null): BattleState {
  // Process status effects (poison, etc.)
  battle.participants.forEach(p => {
    if (p.hp > 0) {
      processStatusEffects(p, battle);
    }
  });

  // Move to next participant
  battle.currentTurnIndex++;

  // If end of turn order, recalculate and start new round
  if (battle.currentTurnIndex >= battle.turnOrder.length) {
    battle.turn++;
    battle.currentTurnIndex = 0;
    
    if (rng) {
      // Recalculate turn order for new round
      const activePart icipants = battle.participants.filter(p => p.hp > 0);
      battle.turnOrder = calculateTurnOrder(activeParticipants, rng);
    }
  }

  // Skip defeated participants
  const currentParticipant = battle.participants.find(
    p => p.id === battle.turnOrder[battle.currentTurnIndex]
  );
  
  if (currentParticipant && currentParticipant.hp === 0) {
    return advanceTurn(battle, rng);
  }

  return battle;
}

/**
 * Process status effects at turn start
 */
function processStatusEffects(
  participant: BattleParticipant,
  battle: BattleState
): void {
  participant.statusEffects = participant.statusEffects.filter(effect => {
    // Process poison damage
    if (effect.type === 'poison') {
      const damage = Math.floor(participant.maxHp * 0.05); // 5% max HP
      participant.hp = Math.max(0, participant.hp - damage);
      battle.battleLog.push({
        turn: battle.turn,
        message: `${participant.name} takes ${damage} poison damage!`,
        type: 'damage'
      });
    }

    // Decrement turn counter
    effect.turnsRemaining--;
    
    // Remove if expired
    if (effect.turnsRemaining <= 0) {
      battle.battleLog.push({
        turn: battle.turn,
        message: `${participant.name} recovered from ${effect.type}!`,
        type: 'status'
      });
      return false;
    }

    return true;
  });
}

/**
 * Check if battle has ended
 */
function checkBattleEnd(battle: BattleState): BattleState {
  const alliesAlive = battle.participants.filter(p => p.isAlly && p.hp > 0).length;
  const enemiesAlive = battle.participants.filter(p => !p.isAlly && p.hp > 0).length;

  if (alliesAlive === 0) {
    battle.isComplete = true;
    battle.victor = 'enemies';
    battle.battleLog.push({
      turn: battle.turn,
      message: 'The party was defeated...',
      type: 'defeat'
    });
  } else if (enemiesAlive === 0) {
    battle.isComplete = true;
    battle.victor = 'allies';
    battle.battleLog.push({
      turn: battle.turn,
      message: 'Victory! The enemies were defeated!',
      type: 'victory'
    });
  }

  return battle;
}

/**
 * Get all valid targets for an action
 */
export function getValidTargets(
  battle: BattleState,
  actor: BattleParticipant,
  actionType: BattleAction['type']
): BattleParticipant[] {
  switch (actionType) {
    case 'attack':
    case 'psynergy':
      // Target enemies if ally, allies if enemy
      return battle.participants.filter(
        p => p.hp > 0 && p.isAlly !== actor.isAlly
      );
    case 'item':
      // Target allies only
      return battle.participants.filter(
        p => p.hp > 0 && p.isAlly === actor.isAlly
      );
    default:
      return [];
  }
}

/**
 * Calculate experience rewards from battle
 */
export function calculateExpReward(
  defeatedEnemies: BattleParticipant[]
): number {
  return defeatedEnemies.reduce((total, enemy) => {
    // Base EXP = enemy level * 5
    return total + (enemy.level * 5);
  }, 0);
}

/**
 * Calculate coin rewards from battle
 */
export function calculateCoinReward(
  defeatedEnemies: BattleParticipant[]
): number {
  return defeatedEnemies.reduce((total, enemy) => {
    // Base coins = enemy level * 10
    return total + (enemy.level * 10);
  }, 0);
}
