import type { CombatState } from "../../reflex-core/src/types";

export const mockCombatState: CombatState = {
  round: 1,
  lastActingIds: [],
  actors: [
    {
      id: "a1",
      name: "Alpha",
      init: { value: 20, joined: true },
      action: { id: 'a1-action', name: 'Attack', cost: 5 },
      data: { ooda: 10 },
      bio: {},
      equipment: {}
    },
    {
      id: "a2",
      name: "Bravo",
      init: { value: 18, joined: true },
      action: { id: 'a2-action', name: 'Defend', cost: 4 },
      data: { ooda: 8 },
      bio: {},
      equipment: {}
    },
    {
      id: "a3",
      name: "Charlie",
      init: { value: 15, joined: true },
      action: { id: 'a3-action', name: 'Move', cost: 3 },
      data: { ooda: 7 },
      bio: {},
      equipment: {}
    },
    {
      id: "a4",
      name: "Delta",
      init: { value: 10, joined: false },
      action: { id: 'a4-action', name: 'Wait', cost: 2 },
      data: { ooda: 5 },
      bio: {},
      equipment: {}
    },
  ],
};