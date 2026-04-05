import type { CombatState } from './types';

export function createInitialState(): CombatState {
  return {
    actors: [],
    lastActingIds: [],
    round: 1,
    phase: 'exchange',
    currentTick: 0,
    pausesSinceLastExchange: 0,
  };
}
