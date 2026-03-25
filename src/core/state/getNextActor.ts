import type { CombatActor, CombatState } from '../types';
import { getActors } from './stateGet';

// Returns all joined actors with the lowest tick
export function getNextActors(state: CombatState): CombatActor[] {
  const actors = getActors(state).filter(actor => actor.state.joined);
  if (actors.length === 0) return [];
  const minTick = Math.min(...actors.map(actor => actor.state.tick));
  return actors.filter(actor => actor.state.tick === minTick);
}

// Returns the first joined actor with the lowest tick, or null
export function getNextActor(state: CombatState): CombatActor | null {
  return getNextActors(state)[0] ?? null;
}