import type { CombatAction, CombatState } from "../types";
import { advanceTurn } from "../rules/advanceTurn";

export function combatReducer(
  state: CombatState,
  action: CombatAction
): CombatState {
  switch (action.type) {
    case "addActor":
      return {
        ...state,
        actors: [...state.actors, action.actor],
      };

    case "removeActor":
      return {
        ...state,
        actors: state.actors.filter((actor) => actor.id !== action.actorId),
      };

    case "setActionCost":
      return {
        ...state,
        actors: state.actors.map((actor) =>
          actor.id === action.actorId
            ? { ...actor, actionCost: action.actionCost }
            : actor
        ),
      };

    case "setTick":
      return {
        ...state,
        actors: state.actors.map((actor) =>
          actor.id === action.actorId ? { ...actor, tick: action.tick } : actor
        ),
      };

    case "toggleJoined":
      return {
        ...state,
        actors: state.actors.map((actor) =>
          actor.id === action.actorId
            ? { ...actor, joined: !actor.joined }
            : actor
        ),
      };

    case "advanceTurn":
      return advanceTurn(state);

    case "reset":
      return action.state;

    default:
      return state;
  }
}