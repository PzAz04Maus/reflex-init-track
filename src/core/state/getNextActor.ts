import type { Actor, CombatState } from "../types";

export function getNextActors(state: CombatState): Actor[] {
  const joinedActors = state.actors.filter((actor) => actor.joined);
  if (joinedActors.length === 0) return [];

  const minTick = Math.min(...joinedActors.map((actor) => actor.tick));
  return joinedActors.filter((actor) => actor.tick === minTick);
}