export type { ActionState, CharacterBio, CharacterData, CharacterId, CharacterRecord, CombatState, EquipmentRecord, InitiativeState, TurnAdvanceResult, } from "reflex-framework";
export { advanceTurn } from "reflex-framework/advanceTurn";
export { createInitialState } from "reflex-framework/createInitialState";
export { selectActorById, selectActors, withActors } from "reflex-framework/selectors/combatSelectors";
export { getNextActor, getNextActors } from "reflex-framework/state/getNextActor";
export { addActor, computeMargin, computeOodaAdjustedInit, joinMidFightInitialInit, updateActorCost, } from "reflex-framework/rules/advanceTurn";
export { RangeBand, RangeBandNames } from "./rangeBands";
export type { RangeBandName } from "./rangeBands";
//# sourceMappingURL=index.d.ts.map