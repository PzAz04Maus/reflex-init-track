import type { CombatState, CombatActor, CharacterId, InitiativeState, CharacterData } from '../types';

// Create an empty initial state
export function createInitialState(): CombatState {
  return {
    actors: [],
    lastActingIds: [],
    round: 1
  };
}

// Get all actors, sorted by tick then name
export function selectActors(state: CombatState): CombatActor[] {
  return [...state.actors].sort((a, b) => {
    if (a.state.tick !== b.state.tick) return a.state.tick - b.state.tick;
    return a.character.name.localeCompare(b.character.name);
  });
}

// Find a CombatActor by characterId
export function selectActorById(state: CombatState, characterId: CharacterId): CombatActor | null {
  return selectActors(state).find((actor) => actor.character.id === characterId) ?? null;
}

// Replace the actors array (with sorting)
export function withActors(state: CombatState, actors: CombatActor[]): CombatState {
  return {
    ...state,
    actors: [...actors].sort((a, b) => {
      if (a.state.tick !== b.state.tick) return a.state.tick - b.state.tick;
      return a.character.name.localeCompare(b.character.name);
    })
  };
}