import { advanceTurn } from "../advanceTurn";
import type { CombatState, CharacterRecord } from "../types";
import { createPendingAction } from "../combat";
import { withActors } from "../selectors/combatSelectors";

export type CombatAction =
  | { type: "addActor"; actor: CharacterRecord }
  | { type: "removeActor"; actorId: string }
  | { type: "setTick"; actorId: string; tick: number }
  | { type: "setActionCost"; actorId?: string; actionCost: number }
  | { type: "toggleJoined"; actorId: string }
  | { type: "advanceTurn" }
  | { type: "reset"; state: CombatState };

// Reducer kept framework-side so apps can consume a stable state transition API.
export function combatReducer(state: CombatState, action: CombatAction): CombatState {
  switch (action.type) {
    case "addActor":
      return withActors(state, [...state.actors, action.actor]);
    case "removeActor":
      return withActors(
        state,
        state.actors.filter((actor) => actor.id !== action.actorId)
      );
    case "setTick":
      return withActors(
        state,
        state.actors.map((actor) =>
          actor.id === action.actorId
            ? { ...actor, init: { ...actor.init, val: action.tick } }
            : actor
        )
      );
    case "setActionCost":
      if (!action.actorId) {
        return state;
      }
      return withActors(
        state,
        state.actors.map((actor) =>
          actor.id === action.actorId
            ? {
                ...actor,
                action: actor.action
                  ? { ...actor.action, cost: action.actionCost }
                  : createPendingAction(`${actor.id}:pending-action`, actor.name, action.actionCost),
              }
            : actor
        )
      );
    case "toggleJoined":
      return withActors(
        state,
        state.actors.map((actor) =>
          actor.id === action.actorId
            ? {
                ...actor,
                init: { ...actor.init, joined: !actor.init.joined },
              }
            : actor
        )
      );
    case "advanceTurn":
      return advanceTurn(state).state;
    case "reset":
      return action.state;
    default:
      return state;
  }
}
