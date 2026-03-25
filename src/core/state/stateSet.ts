import { addActor, updateActorCost, advanceTurn } from '../rules/advanceTurn';
// Reducer for combat state, compatible with useReducer
export function CombatReducer(state: CombatState, action: any): CombatState {
	switch (action.type) {
		case 'addActor':
			// You may need to adapt this to your AddActorInput structure
			return addActor(state, action.actorInput);
		case 'setTick':
			return {
				...state,
				actors: state.actors.map(actor =>
					actor.id === action.actorId
						? { ...actor, initiative: { ...actor.initiative, currentInit: action.tick } }
						: actor
				),
			};
		case 'setActionCost':
			return updateActorCost(state, action.actorId, action.actionCost);
		case 'toggleJoined':
			return {
				...state,
				actors: state.actors.map(actor =>
					actor.id === action.actorId
						? { ...actor, initiative: { ...actor.initiative, joined: !actor.initiative.joined } }
						: actor
				),
			};
		case 'removeActor':
			return {
				...state,
				actors: state.actors.filter(actor => actor.id !== action.actorId),
			};
		case 'advanceTurn':
			return advanceTurn(state).state;
		case 'reset':
			return action.state;
		default:
			return state;
	}
}
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