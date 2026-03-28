import type { CombatState } from "reflex-shared";

export interface VttActorInput {
  id: string;
  name: string;
  initiative?: number;
}

export function fromVttActors(actors: VttActorInput[]): CombatState {
  return {
    round: 1,
    lastActingIds: [],
    actors: actors.map((actor) => ({
      id: actor.id,
      name: actor.name,
      ownerUserId: null,
      actorUuid: null,
      combatantId: null,
      data: { ooda: 10 },
      bio: {},
      equipment: {},
      init: { base: actor.initiative ?? 0, initial: actor.initiative ?? 0, val: actor.initiative ?? 0, joined: true, actionCost: 4 },
      action: null
    })),
  };
}