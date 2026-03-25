import type { ReflexState, CombatActor, CharacterId, InitiativeState, CharacterData } from '../types';

// Create an empty initial state
export function createInitialState(): ReflexState {
  return {
    actors: [],
    lastActingIds: [],
    round: 1
  };
}

// Get all actors, sorted by tick then name
export function getActors(state: ReflexState): CombatActor[] {
  return [...state.actors].sort((a, b) => {
    if (a.state.tick !== b.state.tick) return a.state.tick - b.state.tick;
    return a.character.name.localeCompare(b.character.name);
  });
}

// Find a CombatActor by characterId
export function getActorById(state: ReflexState, characterId: CharacterId): CombatActor | null {
  return getActors(state).find((actor) => actor.character.id === characterId) ?? null;
}

// Replace the actors array (with sorting)
export function withActors(state: ReflexState, actors: CombatActor[]): ReflexState {
  return {
    ...state,
    actors: [...actors].sort((a, b) => {
      if (a.state.tick !== b.state.tick) return a.state.tick - b.state.tick;
      return a.character.name.localeCompare(b.character.name);
    })
  };
}