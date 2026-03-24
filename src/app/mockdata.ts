import type { CombatState } from "../core/types";

export const mockCombatState: CombatState = {
  exchange: 1,
  actors: [
    { id: "a1", callsign: "1", name: "Alpha", tick: 3, actionCost: 4, joined: true },
    { id: "a2", callsign: "2", name: "Bravo", tick: 1, actionCost: 3, joined: true },
    { id: "a3", callsign: "3", name: "Charlie", tick: 1, actionCost: 5, joined: true },
    { id: "a4", callsign: "4", name: "Delta", tick: 6, actionCost: 2, joined: false },
  ],
};