import type { CombatState } from "../core/types";

export interface VttActorInput {
  id: string;
  name: string;
  initiative?: number;
}

export function fromVttActors(actors: VttActorInput[]): CombatState {
  return {
    exchange: 1,
    actors: actors.map((actor) => ({
      id: actor.id,
      callsign: actor.id,
      name: actor.name,
      tick: actor.initiative ?? 0,
      actionCost: 4,
      joined: true,
    })),
  };
}