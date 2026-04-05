import type { CombatState, CharacterRecord, CharacterId, InitiativeState } from '../types';
import { computeMargin, computeOodaAdjustedInit, createCombatantState, createPendingAction } from '../combat';

// AddActorInput now requires character to be a CharacterRecord
export interface AddActorInput {
  character: CharacterRecord;
  state?: Partial<InitiativeState>;
}
import { selectActors, withActors } from 'reflex-framework';


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
  return withActors(state, [
    ...existing,
    {
      ...character,
      combat: character.combat ?? createCombatantState(),
    },
  ]);
}


// Update an actor's action cost
export function updateActorCost(state: CombatState, characterId: CharacterId, actionCost: number): CombatState {
  return withActors(state, state.actors.map((actor: CharacterRecord) =>
    actor.id === characterId
      ? {
          ...actor,
          action: actor.action
            ? { ...actor.action, cost: actionCost }
            : { ...createPendingAction(`${characterId}:pending-action`, actor.name, actionCost), id: characterId }
        }
      : actor
  ));
}
