import { advanceTurn } from "../advanceTurn";
import type { CombatState, CharacterRecord, CombatantState } from "../types";
import { withActors } from "../selectors/combatSelectors";

function createDefaultCombatantState(): CombatantState {
  return {
    encumbrance: 'moderate',
    stance: 'standing',
    tacticalMovementRate: 'walk',
    pressChoice: null,
    lastResolvedChoice: null,
    pressBonus: 0,
    broken: false,
    initiativeRoll: null,
    initiativeTarget: null,
    lastComputedInitiative: null,
  };
}

function createPendingAction(id: string, name: string, cost: number) {
  return {
    id,
    key: 'pending',
    name,
    cost,
    cadence: 'tactical' as const,
    category: 'unmapped',
    status: 'declared' as const,
    summary: 'Declared action pending a specific combat rule mapping.',
    tags: ['displayable', 'placeholder'],
  };
}

export type CombatAction =
  | { type: "addActor"; actor: CharacterRecord }
  | { type: "removeActor"; actorId: string }
  | { type: "setTick"; actorId: string; tick: number }
  | { type: "setActionCost"; actorId?: string; actionCost: number }
  | { type: "setCombatantState"; actorId: string; combat: Partial<CombatantState> }
  | {
      type: "setCombatState";
      combat: Partial<Pick<CombatState, "phase" | "currentTick" | "pausesSinceLastExchange">>;
    }
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
    case "setCombatantState":
      return withActors(
        state,
        state.actors.map((actor) =>
          actor.id === action.actorId
            ? {
                ...actor,
                combat: { ...(actor.combat ?? createDefaultCombatantState()), ...action.combat },
              }
            : actor,
        ),
      );
    case "setCombatState":
      return {
        ...state,
        ...action.combat,
      };
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
