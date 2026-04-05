import type { CombatState, CharacterRecord, CharacterId, InitiativeState } from './../types';
import { createPendingAction } from '../combat';
export { computeMargin, computeOodaAdjustedInit } from '../combat';

// AddActorInput now requires character to be a CharacterRecord
export interface AddActorInput {
  character: CharacterRecord;
  state?: Partial<InitiativeState>;
}
import { selectActors, withActors } from '../selectors/combatSelectors';

// Used for late joiners
export function joinMidFightInitialInit(actors: CharacterRecord[], baseInit: number): number {
  if (actors.length === 0) return baseInit;
  const lowestVal = Math.min(...actors.map((actor: CharacterRecord) => actor.init.val ?? 0));
  return baseInit + lowestVal;
}

// ...existing code...

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
  return withActors(state, state.actors.map(actor => {
    if (actor.id !== characterId) return actor;
    const prevAction = actor.action ?? createPendingAction(`${characterId}:pending-action`, actor.name, actionCost);
    return {
      ...actor,
      action: {
        id: prevAction.id,
        key: prevAction.key,
        name: prevAction.name,
        cost: actionCost,
        cadence: prevAction.cadence,
        category: prevAction.category,
        status: prevAction.status,
        summary: prevAction.summary,
        detail: prevAction.detail,
        tags: prevAction.tags,
        declaredTick: prevAction.declaredTick,
        resolvedTick: prevAction.resolvedTick,
        source: prevAction.source,
        metadata: prevAction.metadata,
      }
    };
  }));
}
