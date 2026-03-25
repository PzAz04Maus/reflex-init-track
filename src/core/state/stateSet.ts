import type { CombatState, CombatActor, CharacterId } from '../types';
import { createInitialState, getActors, getActorById, withActors } from './stateGet';

// Set the state, merging with current or creating a new one
export function setState(current: CombatState | null | undefined, next: Partial<CombatState>): CombatState {
	const base = current ?? createInitialState();
	return {
		...base,
		...next,
		actors: next.actors ? getActors({ ...base, actors: next.actors }) : base.actors
	};
}

// Set the ownerUserId for a given actor (by characterId)
export function setActorOwner(state: CombatState, characterId: CharacterId, ownerUserId: string | null): CombatState {
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
export function replaceState(_current: CombatState, next: CombatState): CombatState {
	return setState(createInitialState(), next);
}