import type { ReflexState } from "../core/types";

export const mockCombatState: ReflexState = {
  round: 1,
  lastActingIds: [],
  actors: [
    {
      character: {
        id: "a1",
        name: "Alpha",
        roll: 12,
        oodaTN: 10,
        baseInit: 20,
      },
      state: {
        characterId: "a1",
        tick: 20,
        actionCost: 5,
        initCost: 20,
        joined: true,
      },
    },
    {
      character: {
        id: "a2",
        name: "Bravo",
        roll: 9,
        oodaTN: 11,
        baseInit: 18,
      },
      state: {
        characterId: "a2",
        tick: 18,
        actionCost: 4,
        initCost: 18,
        joined: true,
      },
    },
    {
      character: {
        id: "a3",
        name: "Charlie",
        roll: 10,
        oodaTN: 12,
        baseInit: 15,
      },
      state: {
        characterId: "a3",
        tick: 15,
        actionCost: 3,
        initCost: 15,
        joined: true,
      },
    },
    {
      character: {
        id: "a4",
        name: "Delta",
        roll: 8,
        oodaTN: 13,
        baseInit: 10,
      },
      state: {
        characterId: "a4",
        tick: 10,
        actionCost: 2,
        initCost: 10,
        joined: false,
      },
    },
  ],
};