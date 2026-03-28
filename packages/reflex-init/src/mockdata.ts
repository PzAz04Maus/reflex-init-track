import type { CombatState } from "../../reflex-core/src/types";

export const mockCombatState: CombatState = {
  round: 1,
  lastActingIds: [],
  actors: [
    {
      id: "a1",
      name: "Alpha",
      init: { value: 20, joined: true },
      action: { cost: 5 }
    },
    {
      id: "a2",
      name: "Bravo",
      init: { value: 18, joined: true },
      action: { cost: 4 }
    },
    {
      id: "a3",
      name: "Charlie",
      init: { value: 15, joined: true },
      action: { cost: 3 }
    },
    {
      id: "a4",
      name: "Delta",
      init: { value: 10, joined: false },
      action: { cost: 2 }
    },
  ],
};