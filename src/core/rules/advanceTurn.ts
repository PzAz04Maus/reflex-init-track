import type { AddActorInput, CombatState, TurnAdvanceResult, CombatActor, CharacterId, InitiativeState, CharacterData } from '../types';
import { getNextActor, getNextActors } from '../state/getNextActor';
import { getActors, withActors } from '../state/stateGet';

// Calculate margin for roll
export function computeMargin(roll: number, target: number): number {
  return roll - target;
}

// Calculate OODA-adjusted initiative
export function computeOodaAdjustedInit(baseInit: number, roll: number, target: number): number {
  return baseInit + computeMargin(roll, target);
}

// Used for late joiners
// needs to be revised for vanilla init
export function joinMidFightInitialInit(actors: CombatActor[], baseInit: number): number {
  if (actors.length === 0) return baseInit;
  const lowestTick = Math.min(...actors.map((actor) => actor.state.tick));
  return baseInit + lowestTick;
}


export function sortActors(list: CombatActor[]): CombatActor[] {
  return [...list].sort((a, b) => {
    if (a.state.tick !== b.state.tick) return a.state.tick - b.state.tick;
    return a.character.name.localeCompare(b.character.name);
  });
}

// Add a new actor to combat
export function addActor(state: CombatState, input: AddActorInput): CombatState {
  const existing = getActors(state);
  const { character, state: stateInput } = input;
  const oodaAdjusted = computeOodaAdjustedInit(character.baseInit, character.roll, character.oodaTN);
  const joined = stateInput?.joined ?? true;
  const tick = joined ? joinMidFightInitialInit(existing, oodaAdjusted) : oodaAdjusted;

  const newCombatActor: CombatActor = {
    character,
    state: {
      characterId: character.id,
      tick,
      actionCost: character.baseInit,
      initCost: character.baseInit,
      joined,
      plannedAction: stateInput?.plannedAction,
      joinedMidFight: joined,
      ...stateInput,
    },
  };

  return withActors(state, [...existing, newCombatActor]);
}

// Update an actor's action cost
export function updateActorCost(state: CombatState, characterId: CharacterId, actionCost: number): CombatState {
  return withActors(
    state,
    getActors(state).map((actor) =>
      actor.character.id === characterId
        ? { ...actor, state: { ...actor.state, actionCost } }
        : actor
    )
  );
}

// Update an actor's planned action
export function updateActorAction(state: CombatState, characterId: CharacterId, plannedAction: string): CombatState {
  return withActors(
    state,
    getActors(state).map((actor) =>
      actor.character.id === characterId
        ? { ...actor, state: { ...actor.state, plannedAction } }
        : actor
    )
  );
}


// Advance the turn for all actors with the highest tick
export function advanceTurn(state: CombatState): TurnAdvanceResult {
  const actors = getActors(state);
  if (actors.length === 0) {
    return {
      state: {
        ...state,
        lastActingIds: []
      },
      actingIds: []
    };
  }

  // All actors with the highest tick act simultaneously
  const maxTick = Math.max(...actors.filter(a => a.state.joined).map(a => a.state.tick));
  const acting = actors.filter(a => a.state.joined && a.state.tick === maxTick);
  const actingIds = acting.map((actor) => actor.character.id);

  // Subtract actionCost from tick for all acting actors (not below zero)
  const updatedActors = actors.map((actor) => {
    if (actingIds.includes(actor.character.id)) {
      const newTick = Math.max(0, actor.state.tick - actor.state.actionCost);
      return { ...actor, state: { ...actor.state, tick: newTick } };
    }
    return actor;
  });

  const previousLead = getNextActor(state)?.character.id ?? null;
  const nextState = withActors(
    {
      ...state,
      lastActingIds: actingIds
    },
    updatedActors
  );
  const nextLead = getNextActor(nextState)?.character.id ?? null;

  return {
    state: {
      ...nextState,
      round: previousLead !== null && nextLead === previousLead ? nextState.round : nextState.round + 1
    },
    actingIds
  };
}