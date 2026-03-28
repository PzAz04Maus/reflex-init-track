import type { CombatState, TurnAdvanceResult, CharacterRecord, CharacterId, InitiativeState } from '../../reflex-core/types';

// AddActorInput now requires character to be a CharacterRecord
export interface AddActorInput {
  character: CharacterRecord;
  state?: Partial<InitiativeState>;
}
import { getNextActor, getNextActors } from '../../reflex-core/state/getNextActor';
import { selectActors, withActors } from '../../reflex-core/selectors/combatSelectors';

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
  const lowestVal = Math.min(...actors.map((actor) => actor.init.val));
  return baseInit + lowestVal;
}

export function sortActors(list: CharacterRecord[]): CharacterRecord[] {
  return [...list].sort((a, b) => {
    if (a.init.val !== b.init.val) return a.init.val - b.init.val;
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
  return withActors(state, state.actors.map(actor =>
    actor.id === characterId ? { ...actor, action: { ...actor.action, cost: actionCost } } : actor
  ));
}
