import type { CombatState, CharacterRecord } from '../types';

export function getNextActors(state: CombatState): CharacterRecord[] {
  const actors = state.actors.filter(actor => actor.init.joined);
  if (actors.length === 0) return [];
  const minVal = Math.min(...actors.map(actor => actor.init.val ?? 0));
  return actors.filter(actor => (actor.init.val ?? 0) === minVal);
}

export function getNextActor(state: CombatState): CharacterRecord | null {
  return getNextActors(state)[0] ?? null;
}
