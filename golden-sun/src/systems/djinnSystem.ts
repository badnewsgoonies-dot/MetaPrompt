import { Result, Ok, Err } from '../utils/result';
import { SeededRNG } from '../utils/rng';
import { Element } from '../types/enemy';
import { Djinn, DjinnInstance, Summon } from '../data/djinn';

/**
 * Djinn System for Golden Sun
 * Handles Djinn collection, Set/Standby/Recovery states, and summons
 */

export interface DjinnBattleState {
  djinnId: string;
  hp: number;
  maxHp: number;
  isCaptured: boolean;
}

export interface SummonAction {
  summonId: string;
  djinnUsed: string[]; // IDs of Djinn used for summon
  power: number;
  effect: string;
}

/**
 * Initialize a Djinn battle
 */
export function initializeDjinnBattle(
  djinn: Djinn,
  _rng: SeededRNG
): DjinnBattleState {
  return {
    djinnId: djinn.id,
    hp: djinn.battleStats.hp,
    maxHp: djinn.battleStats.hp,
    isCaptured: false
  };
}

/**
 * Attempt to capture a Djinn
 */
export function attemptDjinnCapture(
  battleState: DjinnBattleState,
  rng: SeededRNG
): Result<boolean, string> {
  if (battleState.isCaptured) {
    return Err('Djinn already captured');
  }

  // Calculate capture rate based on remaining HP
  const hpPercent = battleState.hp / battleState.maxHp;
  
  // Capture formula: Success if HP < 25%, chance increases as HP decreases
  if (hpPercent > 0.25) {
    return Ok(false); // HP too high, automatic fail
  }

  // Base capture rate at 25% HP: 50%
  // Increases linearly to 95% at 1 HP
  const baseCaptureRate = 0.5 + (0.45 * (1 - hpPercent / 0.25));
  const captureSuccess = rng.next() < baseCaptureRate;

  if (captureSuccess) {
    battleState.isCaptured = true;
  }

  return Ok(captureSuccess);
}

/**
 * Add Djinn to party collection
 */
export function addDjinnToParty(
  partyDjinn: DjinnInstance[],
  djinnId: string,
  characterId: string
): Result<DjinnInstance[], string> {
  // Check if already collected
  if (partyDjinn.some(d => d.djinnId === djinnId)) {
    return Err('Djinn already collected');
  }

  const newDjinn: DjinnInstance = {
    djinnId,
    state: 'set',
    recoveryTurns: 0,
    equippedTo: characterId
  };

  return Ok([...partyDjinn, newDjinn]);
}

/**
 * Set Djinn to Standby for summon
 */
export function setDjinnToStandby(
  partyDjinn: DjinnInstance[],
  djinnId: string
): Result<DjinnInstance[], string> {
  const djinn = partyDjinn.find(d => d.djinnId === djinnId);
  
  if (!djinn) {
    return Err('Djinn not found in party');
  }

  if (djinn.state !== 'set') {
    return Err(`Djinn is ${djinn.state}, cannot move to Standby`);
  }

  djinn.state = 'standby';

  return Ok(partyDjinn);
}

/**
 * Return Djinn from Standby to Set
 */
export function setDjinnToSet(
  partyDjinn: DjinnInstance[],
  djinnId: string
): Result<DjinnInstance[], string> {
  const djinn = partyDjinn.find(d => d.djinnId === djinnId);
  
  if (!djinn) {
    return Err('Djinn not found in party');
  }

  if (djinn.state !== 'standby') {
    return Err(`Djinn is ${djinn.state}, cannot Set`);
  }

  djinn.state = 'set';

  return Ok(partyDjinn);
}

/**
 * Use Djinn in battle (ability)
 */
export function useDjinnAbility(
  partyDjinn: DjinnInstance[],
  djinnId: string
): Result<DjinnInstance[], string> {
  const djinn = partyDjinn.find(d => d.djinnId === djinnId);
  
  if (!djinn) {
    return Err('Djinn not found in party');
  }

  if (djinn.state !== 'set') {
    return Err(`Djinn is ${djinn.state}, cannot use ability`);
  }

  // Move to Standby after using ability
  djinn.state = 'standby';

  return Ok(partyDjinn);
}

/**
 * Execute summon using Standby Djinn
 */
export function executeSummon(
  partyDjinn: DjinnInstance[],
  summon: Summon
): Result<{ action: SummonAction; updatedDjinn: DjinnInstance[] }, string> {
  // Get Standby Djinn matching summon element
  const standbyDjinn = partyDjinn.filter(
    d => d.state === 'standby'
  );

  if (standbyDjinn.length < summon.djinnRequired) {
    return Err(`Need ${summon.djinnRequired} Standby Djinn, only have ${standbyDjinn.length}`);
  }

  // Use the first N Standby Djinn
  const djinnUsed = standbyDjinn.slice(0, summon.djinnRequired);

  // Move used Djinn to Recovery
  djinnUsed.forEach(d => {
    d.state = 'recovery';
    d.recoveryTurns = 3; // 3 turns recovery
  });

  const action: SummonAction = {
    summonId: summon.id,
    djinnUsed: djinnUsed.map(d => d.djinnId),
    power: summon.power,
    effect: summon.effect
  };

  return Ok({ action, updatedDjinn: partyDjinn });
}

/**
 * Update Djinn recovery at turn start
 */
export function updateDjinnRecovery(
  partyDjinn: DjinnInstance[]
): DjinnInstance[] {
  partyDjinn.forEach(djinn => {
    if (djinn.state === 'recovery') {
      djinn.recoveryTurns--;
      
      if (djinn.recoveryTurns <= 0) {
        djinn.state = 'set';
        djinn.recoveryTurns = 0;
      }
    }
  });

  return partyDjinn;
}

/**
 * Calculate stat bonuses from Set Djinn
 */
export function calculateDjinnBonuses(
  characterId: string,
  partyDjinn: DjinnInstance[],
  djinnDatabase: Record<string, Djinn>
): {
  hp: number;
  pp: number;
  attack: number;
  defense: number;
  agility: number;
} {
  const setDjinn = partyDjinn.filter(
    d => d.state === 'set' && d.equippedTo === characterId
  );

  const bonuses = {
    hp: 0,
    pp: 0,
    attack: 0,
    defense: 0,
    agility: 0
  };

  setDjinn.forEach(instance => {
    const djinn = djinnDatabase[instance.djinnId];
    if (djinn) {
      bonuses.hp += djinn.setBonus.hp;
      bonuses.pp += djinn.setBonus.pp;
      bonuses.attack += djinn.setBonus.attack;
      bonuses.defense += djinn.setBonus.defense;
      bonuses.agility += djinn.setBonus.agility;
    }
  });

  return bonuses;
}

/**
 * Get available summons based on Standby Djinn
 */
export function getAvailableSummons(
  partyDjinn: DjinnInstance[],
  summonDatabase: Record<string, Summon>
): Summon[] {
  const standbyCount = partyDjinn.filter(d => d.state === 'standby').length;

  return Object.values(summonDatabase).filter(
    summon => summon.djinnRequired <= standbyCount
  );
}

/**
 * Count Djinn by element
 */
export function countDjinnByElement(
  partyDjinn: DjinnInstance[],
  djinnDatabase: Record<string, Djinn>,
  element: Element
): { set: number; standby: number; recovery: number } {
  const counts = {
    set: 0,
    standby: 0,
    recovery: 0
  };

  partyDjinn.forEach(instance => {
    const djinn = djinnDatabase[instance.djinnId];
    if (djinn && djinn.element === element) {
      if (instance.state === 'set') counts.set++;
      else if (instance.state === 'standby') counts.standby++;
      else if (instance.state === 'recovery') counts.recovery++;
    }
  });

  return counts;
}
