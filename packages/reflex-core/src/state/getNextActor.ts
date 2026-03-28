import type { CombatState, CharacterRecord } from 'reflex-shared';

// Returns all joined actors with the lowest initiative value
export function getNextActors(state: CombatState): CharacterRecord[] {
  const actors = state.actors.filter((actor: CharacterRecord) => actor.init.joined);
  if (actors.length === 0) return [];
  const minVal = Math.min(...actors.map((actor: CharacterRecord) => actor.init.val ?? 0));
  return actors.filter((actor: CharacterRecord) => (actor.init.val ?? 0) === minVal);
}

// Returns the first joined actor with the lowest initiative value, or null
export function getNextActor(state: CombatState): CharacterRecord | null {
  return getNextActors(state)[0] ?? null;
}
