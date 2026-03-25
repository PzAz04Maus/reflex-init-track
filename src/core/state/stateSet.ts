import type { ReflexState, CombatActor, CharacterId } from '../types';
import { createInitialState, getActors, getActorById, withActors } from './stateGet';

// Set the state, merging with current or creating a new one
export function setState(current: ReflexState | null | undefined, next: Partial<ReflexState>): ReflexState {
	const base = current ?? createInitialState();
	return {
		...base,
		...next,
		actors: next.actors ? getActors({ ...base, actors: next.actors }) : base.actors
	};
}

// Set the ownerUserId for a given actor (by characterId)
export function setActorOwner(state: ReflexState, characterId: CharacterId, ownerUserId: string | null): ReflexState {
	const actor = getActorById(state, characterId);
	if (!actor) return state;
	return withActors(
		state,
		getActors(state).map((entry) =>
			entry.character.id === characterId
				? {
						...entry,
						character: { ...entry.character, ownerUserId }
					}
				: entry
		)
	);
}

// Replace the entire state
export function replaceState(_current: ReflexState, next: ReflexState): ReflexState {
	return setState(createInitialState(), next);
}