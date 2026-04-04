import type { CombatState, CharacterData, EquipmentRecord } from "reflex-core";

const emptyEquipment: EquipmentRecord = { byId: {}, order: [] };
function makeDefaultCharacterData(overrides: Partial<CharacterData> = {}): CharacterData {
  return {
    awareness: 5,
    coordination: 5,
    fitness: 5,
    muscle: 5,
    cognition: 5,
    education: 5,
    personality: 5,
    resolve: 5,
    ooda: 10,
    cuf: 0,
    ...overrides
  };
}

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
      data: makeDefaultCharacterData({ ooda: 10 }),
      bio: {},
      equipment: emptyEquipment,
      init: { base: actor.initiative ?? 0, initial: actor.initiative ?? 0, val: actor.initiative ?? 0, joined: true },
      action: null
    })),
  };
}