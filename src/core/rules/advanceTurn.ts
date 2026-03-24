import type { CombatState } from "../types";

export function advanceTurn(state: CombatState): CombatState {
  const joinedActors = state.actors.filter((actor) => actor.joined);
  if (joinedActors.length === 0) return state;

  const minTick = Math.min(...joinedActors.map((actor) => actor.tick));

  const nextActors = joinedActors.filter((actor) => actor.tick === minTick);

  return {
    ...state,
    actors: state.actors.map((actor) => {
      const isActing = nextActors.some((next) => next.id === actor.id);
      if (!isActing) return actor;

      return {
        ...actor,
        tick: actor.tick + actor.actionCost,
      };
    }),
  };
}