import type { CombatState, CharacterRecord, InitiativeState } from './types';
export interface AddActorInput {
    character: CharacterRecord;
    state?: Partial<InitiativeState>;
}
export declare function addActor(state: CombatState, input: AddActorInput): CombatState;
//# sourceMappingURL=advanceTurn.d.ts.map