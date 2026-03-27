import type { CombatState, TurnAdvanceResult, CharacterRecord, CharacterId, InitiativeState } from '../types.js';

// AddActorInput now requires character to be a CharacterRecord
export interface AddActorInput {
  character: CharacterRecord;
  state?: Partial<InitiativeState>;
}
import { getNextActor, getNextActors } from '../state/getNextActor.js';
import { selectActors, withActors } from '../selectors/combatSelectors.js';

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
  return withActors(
    state,
    selectActors(state).map((actor) =>
      actor.id === characterId
        ? { ...actor, init: { ...actor.init, actionCost } }
        : actor
    )
  );
}

// Update an actor's planned action
export function updateActorAction(state: CombatState, characterId: CharacterId, plannedAction: string): CombatState {
  return withActors(
    state,
    selectActors(state).map((actor) => {
      if (actor.id !== characterId) return actor;
      // If action exists and has id/cost, preserve them; otherwise, provide defaults
      const prev = actor.action;
      if (prev && typeof prev.id === 'string' && typeof prev.cost === 'number') {
        return {
          ...actor,
          action: {
            ...prev,
            name: plannedAction
          }
        };
      } else {
        // If no previous action, create a minimal valid ActionState
        return {
          ...actor,
          action: {
            id: `${actor.id}-action`,
            name: plannedAction,
            cost: 1 // default cost if unknown
          }
        };
      }
    })
  );
}


// Advance the turn for all actors with the lowest initiative value
export function advanceTurn(state: CombatState): TurnAdvanceResult {
  const actors = selectActors(state);
  if (actors.length === 0) {
    return {
      state: {
        ...state,
        lastActingIds: []
      },
      actingIds: []
    };
  }

  // All actors with the lowest initiative value act simultaneously
  const minVal = Math.min(...actors.filter(a => a.init.joined).map(a => a.init.val));
  const acting = actors.filter(a => a.init.joined && a.init.val === minVal);
  const actingIds = acting.map((actor) => actor.id);

  // Subtract action cost from val for all acting actors (not below zero)
  const updatedActors = actors.map((actor) => {
    if (actingIds.includes(actor.id)) {
      // Use actor.action.cost if available, otherwise default to 1
      const actionCost = actor.action && typeof actor.action.cost === 'number' ? actor.action.cost : 1;
      const newVal = Math.max(0, actor.init.val - actionCost);
      return { ...actor, init: { ...actor.init, val: newVal } };
    }
    return actor;
  });

  const previousLead = getNextActor(state)?.id ?? null;
  const nextState = withActors(
    {
      ...state,
      lastActingIds: actingIds
    },
    updatedActors
  );
  const nextLead = getNextActor(nextState)?.id ?? null;

  return {
    state: {
      ...nextState,
      round: previousLead !== null && nextLead === previousLead ? nextState.round : nextState.round + 1
    },
    actingIds
  };
}