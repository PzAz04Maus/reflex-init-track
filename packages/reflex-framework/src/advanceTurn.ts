// --- ADVANCE TURN LOGIC ---
import type { CombatState, TurnAdvanceResult } from './types';
import { selectActors, withActors } from './selectors/combatSelectors';
import { getNextActor } from './state/getNextActor';
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
  const minVal = Math.min(...actors.filter(a => a.init.joined).map(a => a.init.val ?? 0));
  const acting = actors.filter(a => a.init.joined && (a.init.val ?? 0) === minVal);
  const actingIds = acting.map((actor) => actor.id);

  // Subtract action cost from val for all acting actors (not below zero)
  const updatedActors = actors.map((actor) => {
    if (actingIds.includes(actor.id)) {
      // Use actor.action.cost if available, otherwise default to 1
      const actionCost = actor.action && typeof actor.action.cost === 'number' ? actor.action.cost : 1;
      const prevVal = actor.init.val ?? 0;
      const newVal = Math.max(0, prevVal - actionCost);
      return { ...actor, init: { ...actor.init, val: newVal } };
    }
    return actor;
  });

  const nextState = withActors(
    {
      ...state,
      lastActingIds: actingIds
    },
    updatedActors
  );
  return {
    state: nextState,
    actingIds
  };
}
