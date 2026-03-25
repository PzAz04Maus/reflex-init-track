import type { CombatState, CharacterRecord, CharacterId } from '../types';
import { createInitialState } from '../state/stateGet';
import { selectActors, selectActorById, withActors } from '../selectors/combatSelectors';

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
    actors: next.actors ? selectActors({ ...base, actors: next.actors }) : base.actors
  };
}

// Set the ownerUserId for a given actor (by characterId)
export function setActorOwner(state: CombatState, characterId: CharacterId, ownerUserId: string | null): CombatState {
  const actor = selectActorById(state, characterId);
  if (!actor) return state;
  return withActors(
    state,
    selectActors(state).map((entry) =>
      entry.id === characterId
        ? { ...entry, ownerUserId }
        : entry
    )
  );
}

// Replace the entire state
export function replaceState(_current: CombatState, next: CombatState): CombatState {
  return setState(createInitialState(), next);
}
