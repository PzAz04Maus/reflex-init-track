import type { CombatState, CharacterRecord, CharacterId, InitiativeState } from './../types';
export interface AddActorInput {
    character: CharacterRecord;
    state?: Partial<InitiativeState>;
}
export declare function computeMargin(roll: number, target: number): number;
export declare function computeOodaAdjustedInit(baseInit: number, roll: number, target: number): number;
export declare function joinMidFightInitialInit(actors: CharacterRecord[], baseInit: number): number;
/**
 * Add a CharacterRecord to the combat state.
 * @param state The current combat state
 * @param input.character The CharacterRecord to add
 */
export declare function addActor(state: CombatState, input: AddActorInput): CombatState;
export declare function updateActorCost(state: CombatState, characterId: CharacterId, actionCost: number): CombatState;
//# sourceMappingURL=advanceTurn.d.ts.map