import { advanceTurn } from "../advanceTurn";
import { withActors } from "../selectors/combatSelectors";
// Reducer kept framework-side so apps can consume a stable state transition API.
export function combatReducer(state, action) {
    switch (action.type) {
        case "addActor":
            return withActors(state, [...state.actors, action.actor]);
        case "removeActor":
            return withActors(state, state.actors.filter((actor) => actor.id !== action.actorId));
        case "setTick":
            return withActors(state, state.actors.map((actor) => actor.id === action.actorId
                ? { ...actor, init: { ...actor.init, val: action.tick } }
                : actor));
        case "setActionCost":
            if (!action.actorId) {
                return state;
            }
            return withActors(state, state.actors.map((actor) => actor.id === action.actorId
                ? {
                    ...actor,
                    action: {
                        id: actor.action?.id ?? "",
                        name: actor.action?.name ?? "",
                        cost: action.actionCost,
                    },
                }
                : actor));
        case "toggleJoined":
            return withActors(state, state.actors.map((actor) => actor.id === action.actorId
                ? {
                    ...actor,
                    init: { ...actor.init, joined: !actor.init.joined },
                }
                : actor));
        case "advanceTurn":
            return advanceTurn(state).state;
        case "reset":
            return action.state;
        default:
            return state;
    }
}
