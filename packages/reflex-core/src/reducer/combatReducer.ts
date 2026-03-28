import type { CombatState, TurnAdvanceResult, CharacterRecord, CharacterId, InitiativeState } from '../types';
import { selectActors, selectActorById, withActors } from '../selectors/combatSelectors';

// Create an empty initial state
export function createInitialState(): CombatState {
	return {
		actors: [],
		lastActingIds: [],
		round: 1
	};
}

// Reducer for combat state, compatible with useReducer
export function combatReducer(state: CombatState, action: any): CombatState {
	switch (action.type) {
		case 'addActor':
			// You must provide a CharacterRecord in action.actor
			return withActors(state, [...state.actors, action.actor]);
		case 'setTick':
			return {
				...state,
				actors: state.actors.map(actor =>
					actor.id === action.actorId
						? { ...actor, init: { ...actor.init, tick: action.tick } }
						: actor
				),
			};
		case 'setActionCost':
			return {
				...state,
				actors: state.actors.map(actor =>
					actor.id === action.actorId
						? { ...actor, init: { ...actor.init, actionCost: action.actionCost } }
						: actor
				),
			};
		case 'toggleJoined':
			return {
				...state,
				actors: state.actors.map(actor =>
					actor.id === action.actorId
						? { ...actor, init: { ...actor.init, joined: !actor.init.joined } }
						: actor
				),
			};
		case 'removeActor':
			return {
				...state,
				actors: state.actors.filter(actor => actor.id !== action.actorId),
			};
		// You may want to implement advanceTurn logic here if needed
		case 'reset':
			return action.state;
		default:
			return state;
	}
}

// Set the state, merging with current or creating a new one
export function setState(current: CombatState | null | undefined, next: Partial<CombatState>): CombatState {
	const base = current ?? createInitialState();
	return {
		...base,
		...next,
	};
}