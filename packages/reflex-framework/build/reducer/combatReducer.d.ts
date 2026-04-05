import type { CombatState, CharacterRecord, CombatantState } from "../types";
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
    type: "setCombatantState";
    actorId: string;
    combat: Partial<CombatantState>;
} | {
    type: "setCombatState";
    combat: Partial<Pick<CombatState, "phase" | "currentTick" | "pausesSinceLastExchange">>;
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