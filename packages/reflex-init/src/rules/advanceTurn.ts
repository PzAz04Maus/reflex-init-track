import type { CombatState, TurnAdvanceResult, CharacterRecord, CharacterId, InitiativeState } from '../../../reflex-core/src/types';

// AddActorInput now requires character to be a CharacterRecord
export interface AddActorInput {
  character: CharacterRecord;
  state?: Partial<InitiativeState>;
}
import { getNextActor, getNextActors } from '../../../reflex-core/src/state/getNextActor';
import { selectActors, withActors } from '../../../reflex-core/src/selectors/combatSelectors';

// Calculate margin for roll
export function computeMargin(roll: number, target: number): number {
  return roll - target;
}

// Calculate OODA-adjusted initiative
export function computeOodaAdjustedInit(baseInit: number, roll: number, target: number): number {
  return baseInit + computeMargin(roll, target);
}


// Used for late joiners
export function joinMidFightInitialInit(actors: CharacterRecord[], baseInit: number): number {
  if (actors.length === 0) return baseInit;
  const lowestVal = Math.min(...actors.map((actor: CharacterRecord) => actor.init.val ?? 0));
  return baseInit + lowestVal;
}


export function sortActors(list: CharacterRecord[]): CharacterRecord[] {
  return [...list].sort((a: CharacterRecord, b: CharacterRecord) => {
    const aVal = a.init.val ?? 0;
    const bVal = b.init.val ?? 0;
    if (aVal !== bVal) return aVal - bVal;
    return a.name.localeCompare(b.name);
  });
}

// Add a new actor to combat
/**
 * Add a CharacterRecord to the combat state.
 * @param state The current combat state
 * @param input.character The CharacterRecord to add
 */
export function addActor(state: CombatState, input: AddActorInput): CombatState {
  const existing = selectActors(state);
  const { character } = input;
  return withActors(state, [...existing, character]);
}


// Update an actor's action cost
export function updateActorCost(state: CombatState, characterId: CharacterId, actionCost: number): CombatState {
  return withActors(state, state.actors.map((actor: CharacterRecord) =>
    actor.id === characterId
      ? {
          ...actor,
          action: actor.action
            ? { ...actor.action, cost: actionCost }
            : { id: characterId, name: actor.name, cost: actionCost }
        }
      : actor
  ));
}
