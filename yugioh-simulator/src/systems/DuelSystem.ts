/**
 * Duel System - Main game state and battle mechanics
 * Brings together CardSystem and TurnSystem
 */

import { Result, Ok, Err, isOk } from '../utils/result-type';
import { SeededRNG } from '../utils/deterministic-rng';
import {
  MonsterCard,
  createStandardDeck,
} from '../utils/card-data';
import {
  CardZones,
  createCardZones,
  drawCard,
  summonMonster,
  setMonster,
  destroyMonster,
  removeSummoningSickness,
  markAttacked,
  countMonsters,
  FieldCard,
} from './CardSystem';
import {
  TurnState,
  createTurnState,
  nextPhase,
  isBattlePhase,
  canNormalSummon,
  markNormalSummon,
  canEnterBattle,
} from './TurnSystem';

/**
 * Player state
 */
export interface Player {
  id: number;
  lifePoints: number;
  zones: CardZones;
}

/**
 * Complete duel state
 */
export interface DuelState {
  player1: Player;
  player2: Player;
  turnState: TurnState;
  winner: number | null; // null = ongoing, 0/1 = winner
  rng: SeededRNG;
}

/**
 * Battle result
 */
export interface BattleResult {
  attackerDestroyed: boolean;
  defenderDestroyed: boolean;
  damageToAttacker: number;
  damageToDefender: number;
}

/**
 * Initialize a new duel
 */
export function initializeDuel(seed: number): DuelState {
  const rng = new SeededRNG(seed);

  // Create decks
  const deck1 = rng.shuffle(createStandardDeck());
  const deck2 = rng.shuffle(createStandardDeck());

  // Create player zones
  const zones1 = createCardZones();
  const zones2 = createCardZones();
  zones1.deck = deck1;
  zones2.deck = deck2;

  // Draw starting hands (5 cards each)
  let p1Zones = zones1;
  let p2Zones = zones2;
  for (let i = 0; i < 5; i++) {
    const draw1 = drawCard(p1Zones);
    const draw2 = drawCard(p2Zones);
    if (isOk(draw1)) p1Zones = draw1.value;
    if (isOk(draw2)) p2Zones = draw2.value;
  }

  return {
    player1: { id: 0, lifePoints: 8000, zones: p1Zones },
    player2: { id: 1, lifePoints: 8000, zones: p2Zones },
    turnState: createTurnState(0), // Player 1 starts
    winner: null,
    rng,
  };
}

/**
 * Get current turn player
 */
export function getCurrentPlayer(state: DuelState): Player {
  return state.turnState.currentPlayer === 0 ? state.player1 : state.player2;
}

/**
 * Get opponent player
 */
export function getOpponent(state: DuelState): Player {
  return state.turnState.currentPlayer === 0 ? state.player2 : state.player1;
}

/**
 * Update player in state
 */
function updatePlayer(state: DuelState, player: Player): DuelState {
  if (player.id === 0) {
    return { ...state, player1: player };
  } else {
    return { ...state, player2: player };
  }
}

/**
 * Advance to next phase
 */
export function advancePhase(state: DuelState): Result<DuelState, string> {
  if (state.winner !== null) {
    return Err('Duel is already over');
  }

  const newTurnState = nextPhase(state.turnState);
  if (!isOk(newTurnState)) {
    return newTurnState;
  }

  let newState = { ...state, turnState: newTurnState.value };

  // If we just entered Draw Phase, draw a card
  if (newTurnState.value.phase === 'draw') {
    const currentPlayer = getCurrentPlayer(newState);
    const drawResult = drawCard(currentPlayer.zones);

    if (!isOk(drawResult)) {
      // Deck out - opponent wins
      newState.winner = currentPlayer.id === 0 ? 1 : 0;
      return Ok(newState);
    }

    const updatedPlayer = { ...currentPlayer, zones: drawResult.value };
    newState = updatePlayer(newState, updatedPlayer);

    // Remove summoning sickness from monsters
    newState = updatePlayer(
      newState,
      {
        ...getCurrentPlayer(newState),
        zones: removeSummoningSickness(getCurrentPlayer(newState).zones),
      }
    );
  }

  return Ok(newState);
}

/**
 * Normal summon a monster
 */
export function performSummon(
  state: DuelState,
  cardId: string,
  position: 'attack' | 'defense',
  tributes: number[]
): Result<DuelState, string> {
  if (state.winner !== null) {
    return Err('Duel is already over');
  }

  const canSummon = canNormalSummon(state.turnState);
  if (!isOk(canSummon)) {
    return Err(canSummon.error);
  }

  const currentPlayer = getCurrentPlayer(state);
  const summonResult = summonMonster(
    currentPlayer.zones,
    cardId,
    position,
    tributes
  );

  if (!isOk(summonResult)) {
    return Err(summonResult.error);
  }

  const newTurnState = markNormalSummon(state.turnState);
  if (!isOk(newTurnState)) {
    return Err(newTurnState.error);
  }

  const updatedPlayer = { ...currentPlayer, zones: summonResult.value };
  let newState = updatePlayer(state, updatedPlayer);
  newState.turnState = newTurnState.value;

  return Ok(newState);
}

/**
 * Set a monster face-down
 */
export function performSet(
  state: DuelState,
  cardId: string,
  tributes: number[]
): Result<DuelState, string> {
  if (state.winner !== null) {
    return Err('Duel is already over');
  }

  const canSummon = canNormalSummon(state.turnState);
  if (!isOk(canSummon)) {
    return Err(canSummon.error);
  }

  const currentPlayer = getCurrentPlayer(state);
  const setResult = setMonster(currentPlayer.zones, cardId, tributes);

  if (!isOk(setResult)) {
    return Err(setResult.error);
  }

  const newTurnState = markNormalSummon(state.turnState);
  if (!isOk(newTurnState)) {
    return Err(newTurnState.error);
  }

  const updatedPlayer = { ...currentPlayer, zones: setResult.value };
  let newState = updatePlayer(state, updatedPlayer);
  newState.turnState = newTurnState.value;

  return Ok(newState);
}

/**
 * Calculate battle damage between two monsters
 */
export function calculateBattle(
  attacker: MonsterCard,
  defender: FieldCard
): BattleResult {
  const defenderCard = defender.card as MonsterCard;

  // Defender in attack position
  if (defender.position === 'attack') {
    if (attacker.attack > defenderCard.attack) {
      return {
        attackerDestroyed: false,
        defenderDestroyed: true,
        damageToAttacker: 0,
        damageToDefender: attacker.attack - defenderCard.attack,
      };
    } else if (attacker.attack < defenderCard.attack) {
      return {
        attackerDestroyed: true,
        defenderDestroyed: false,
        damageToAttacker: defenderCard.attack - attacker.attack,
        damageToDefender: 0,
      };
    } else {
      // Equal attack - both destroyed
      return {
        attackerDestroyed: true,
        defenderDestroyed: true,
        damageToAttacker: 0,
        damageToDefender: 0,
      };
    }
  }

  // Defender in defense position
  if (attacker.attack > defenderCard.defense) {
    return {
      attackerDestroyed: false,
      defenderDestroyed: true,
      damageToAttacker: 0,
      damageToDefender: 0, // No damage when attacking defense
    };
  } else if (attacker.attack < defenderCard.defense) {
    return {
      attackerDestroyed: false,
      defenderDestroyed: false,
      damageToAttacker: defenderCard.defense - attacker.attack,
      damageToDefender: 0,
    };
  } else {
    // Equal - no destruction or damage
    return {
      attackerDestroyed: false,
      defenderDestroyed: false,
      damageToAttacker: 0,
      damageToDefender: 0,
    };
  }
}

/**
 * Attack with a monster (direct or vs another monster)
 */
export function attack(
  state: DuelState,
  attackerSlot: number,
  defenderSlot: number | null // null = direct attack
): Result<DuelState, string> {
  if (state.winner !== null) {
    return Err('Duel is already over');
  }

  const canBattle = canEnterBattle(state.turnState);
  if (!isOk(canBattle)) {
    return Err(canBattle.error);
  }

  if (!isBattlePhase(state.turnState)) {
    return Err('Can only attack during Battle Phase');
  }

  const currentPlayer = getCurrentPlayer(state);
  const opponent = getOpponent(state);

  // Validate attacker
  const attacker = currentPlayer.zones.monsterZone[attackerSlot];
  if (!attacker) {
    return Err('No monster in attacker slot');
  }

  if (!attacker.canAttack) {
    return Err('Monster has summoning sickness');
  }

  if (attacker.hasAttacked) {
    return Err('Monster already attacked this turn');
  }

  if (attacker.position !== 'attack') {
    return Err('Monster must be in attack position');
  }

  const attackerCard = attacker.card as MonsterCard;

  // Direct attack
  if (defenderSlot === null) {
    if (countMonsters(opponent.zones) > 0) {
      return Err('Cannot direct attack while opponent has monsters');
    }

    // Mark as attacked
    const markResult = markAttacked(currentPlayer.zones, attackerSlot);
    if (!isOk(markResult)) {
      return Err(markResult.error);
    }

    let newState = updatePlayer(state, {
      ...currentPlayer,
      zones: markResult.value,
    });

    // Apply damage
    const newOpponent = {
      ...opponent,
      lifePoints: opponent.lifePoints - attackerCard.attack,
    };
    newState = updatePlayer(newState, newOpponent);

    // Check win condition
    if (newOpponent.lifePoints <= 0) {
      newState.winner = currentPlayer.id;
    }

    return Ok(newState);
  }

  // Monster vs Monster
  const defender = opponent.zones.monsterZone[defenderSlot];
  if (!defender) {
    return Err('No monster in defender slot');
  }

  // Calculate battle
  const battleResult = calculateBattle(attackerCard, defender);

  // Mark as attacked
  const markResult = markAttacked(currentPlayer.zones, attackerSlot);
  if (!isOk(markResult)) {
    return Err(markResult.error);
  }

  let newState = updatePlayer(state, {
    ...currentPlayer,
    zones: markResult.value,
  });

  // Apply destruction
  let newCurrentPlayer = getCurrentPlayer(newState);
  let newOpponent = getOpponent(newState);

  if (battleResult.attackerDestroyed) {
    const destroyResult = destroyMonster(
      newCurrentPlayer.zones,
      attackerSlot
    );
    if (isOk(destroyResult)) {
      newCurrentPlayer = { ...newCurrentPlayer, zones: destroyResult.value };
      newState = updatePlayer(newState, newCurrentPlayer);
    }
  }

  if (battleResult.defenderDestroyed) {
    const destroyResult = destroyMonster(newOpponent.zones, defenderSlot);
    if (isOk(destroyResult)) {
      newOpponent = { ...newOpponent, zones: destroyResult.value };
      newState = updatePlayer(newState, newOpponent);
    }
  }

  // Apply damage
  newCurrentPlayer = {
    ...newCurrentPlayer,
    lifePoints: newCurrentPlayer.lifePoints - battleResult.damageToAttacker,
  };
  newOpponent = {
    ...newOpponent,
    lifePoints: newOpponent.lifePoints - battleResult.damageToDefender,
  };

  newState = updatePlayer(newState, newCurrentPlayer);
  newState = updatePlayer(newState, newOpponent);

  // Check win conditions
  if (newCurrentPlayer.lifePoints <= 0) {
    newState.winner = opponent.id;
  } else if (newOpponent.lifePoints <= 0) {
    newState.winner = currentPlayer.id;
  }

  return Ok(newState);
}

/**
 * Check if duel is over
 */
export function isDuelOver(state: DuelState): boolean {
  return state.winner !== null;
}

/**
 * Get winner (null if ongoing)
 */
export function getWinner(state: DuelState): number | null {
  return state.winner;
}
