import type { CombatState, CharacterRecord } from "../types";
export type CombatAction = {
    type: "addActor";
    actor: CharacterRecord;
} | {
    type: "removeActor";
    actorId: string;
} | {
    type: "setTick";
    actorId: string;
    tick: number;
} | {
    type: "setActionCost";
    actorId?: string;
    actionCost: number;
} | {
    type: "toggleJoined";
    actorId: string;
} | {
    type: "advanceTurn";
} | {
    type: "reset";
    state: CombatState;
};
export declare function combatReducer(state: CombatState, action: CombatAction): CombatState;
//# sourceMappingURL=combatReducer.d.ts.map