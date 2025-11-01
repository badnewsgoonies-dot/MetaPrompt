import { Result, ok, err } from '../utils/result';

/**
 * Cutscene System for Golden Sun
 * Handles timed dialogues, character animations, and camera control
 */

export interface CutsceneAction {
  type: 'dialogue' | 'move' | 'camera' | 'wait' | 'effect' | 'flag';
  timestamp: number; // Milliseconds from cutscene start
  duration?: number;
  params: any;
}

export interface CutsceneDialogue extends CutsceneAction {
  type: 'dialogue';
  params: {
    speakerId: string;
    text: string;
    portrait?: string;
    canSkip: boolean;
  };
}

export interface CutsceneMove extends CutsceneAction {
  type: 'move';
  params: {
    characterId: string;
    targetX: number;
    targetY: number;
    speed: number;
  };
}

export interface CutsceneCamera extends CutsceneAction {
  type: 'camera';
  params: {
    targetX: number;
    targetY: number;
    zoom?: number;
    duration: number;
  };
}

export interface CutsceneWait extends CutsceneAction {
  type: 'wait';
  params: {
    duration: number;
  };
}

export interface CutsceneEffect extends CutsceneAction {
  type: 'effect';
  params: {
    effectType: 'shake' | 'flash' | 'fade' | 'rumble';
    intensity: number;
    duration: number;
  };
}

export interface CutsceneFlag extends CutsceneAction {
  type: 'flag';
  params: {
    flagName: string;
    value: boolean;
  };
}

export interface Cutscene {
  id: string;
  name: string;
  actions: CutsceneAction[];
  canSkip: boolean;
  duration: number; // Total duration in ms
}

export interface CutsceneState {
  cutsceneId: string;
  isPlaying: boolean;
  currentTime: number;
  completedActions: Set<number>;
  skipped: boolean;
}

/**
 * Initialize a cutscene
 */
export function initializeCutscene(
  cutscene: Cutscene
): CutsceneState {
  return {
    cutsceneId: cutscene.id,
    isPlaying: true,
    currentTime: 0,
    completedActions: new Set(),
    skipped: false
  };
}

/**
 * Update cutscene (call every frame)
 */
export function updateCutscene(
  state: CutsceneState,
  cutscene: Cutscene,
  deltaTime: number
): Result<{ state: CutsceneState; actionsToExecute: CutsceneAction[] }, string> {
  if (!state.isPlaying) {
    return err('Cutscene is not playing');
  }

  state.currentTime += deltaTime;

  // Find actions that should execute now
  const actionsToExecute: CutsceneAction[] = [];

  cutscene.actions.forEach((action, index) => {
    if (!state.completedActions.has(index) && state.currentTime >= action.timestamp) {
      actionsToExecute.push(action);
      state.completedActions.add(index);
    }
  });

  // Check if cutscene complete
  if (state.currentTime >= cutscene.duration) {
    state.isPlaying = false;
  }

  return ok({ state, actionsToExecute });
}

/**
 * Skip cutscene
 */
export function skipCutscene(
  state: CutsceneState,
  cutscene: Cutscene
): Result<CutsceneState, string> {
  if (!cutscene.canSkip) {
    return err('This cutscene cannot be skipped');
  }

  state.skipped = true;
  state.isPlaying = false;
  state.currentTime = cutscene.duration;

  return ok(state);
}

/**
 * Check if cutscene is complete
 */
export function isCutsceneComplete(state: CutsceneState): boolean {
  return !state.isPlaying;
}

/**
 * Create a simple dialogue cutscene
 */
export function createDialogueCutscene(
  id: string,
  dialogues: Array<{ speaker: string; text: string; portrait?: string }>
): Cutscene {
  const actions: CutsceneAction[] = [];
  let timestamp = 0;

  dialogues.forEach((dialogue, index) => {
    // Estimate dialogue duration (50ms per character + 1000ms minimum)
    const duration = Math.max(1000, dialogue.text.length * 50);

    actions.push({
      type: 'dialogue',
      timestamp,
      duration,
      params: {
        speakerId: dialogue.speaker,
        text: dialogue.text,
        portrait: dialogue.portrait,
        canSkip: true
      }
    } as CutsceneDialogue);

    timestamp += duration;
  });

  return {
    id,
    name: `Dialogue: ${id}`,
    actions,
    canSkip: true,
    duration: timestamp
  };
}

/**
 * Create Mt. Aleph tragedy cutscene (example)
 */
export function createMtAlephTragedy(): Cutscene {
  const actions: CutsceneAction[] = [];

  // Saturos appears
  actions.push({
    type: 'dialogue',
    timestamp: 0,
    duration: 3000,
    params: {
      speakerId: 'saturos',
      text: 'Foolish children! You've led us right to the Elemental Stars!',
      portrait: 'saturos_angry',
      canSkip: false
    }
  });

  // Menardi appears
  actions.push({
    type: 'dialogue',
    timestamp: 3500,
    duration: 3000,
    params: {
      speakerId: 'menardi',
      text: 'With these, we shall light the Elemental Lighthouses!',
      portrait: 'menardi_smirk',
      canSkip: false
    }
  });

  // Earthquake starts
  actions.push({
    type: 'effect',
    timestamp: 7000,
    duration: 5000,
    params: {
      effectType: 'shake',
      intensity: 10,
      duration: 5000
    }
  });

  actions.push({
    type: 'dialogue',
    timestamp: 7500,
    duration: 2000,
    params: {
      speakerId: 'garet',
      text: 'Isaac! We have to get out of here!',
      portrait: 'garet_panic',
      canSkip: false
    }
  });

  // Felix falls
  actions.push({
    type: 'move',
    timestamp: 10000,
    duration: 1000,
    params: {
      characterId: 'felix',
      targetX: 240,
      targetY: 300, // Falls down
      speed: 300
    }
  });

  actions.push({
    type: 'dialogue',
    timestamp: 11000,
    duration: 2000,
    params: {
      speakerId: 'jenna',
      text: 'FELIX! NO!',
      portrait: 'jenna_scream',
      canSkip: false
    }
  });

  // Set story flag
  actions.push({
    type: 'flag',
    timestamp: 13000,
    params: {
      flagName: 'mt_aleph_tragedy',
      value: true
    }
  });

  return {
    id: 'mt_aleph_tragedy',
    name: 'Mt. Aleph Tragedy',
    actions,
    canSkip: false,
    duration: 15000
  };
}
