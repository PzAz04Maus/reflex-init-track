import { createPendingAction } from '../combat';
export { computeMargin, computeOodaAdjustedInit } from '../combat';
import { selectActors, withActors } from '../selectors/combatSelectors';
// Used for late joiners
export function joinMidFightInitialInit(actors, baseInit) {
    if (actors.length === 0)
        return baseInit;
    const lowestVal = Math.min(...actors.map((actor) => actor.init.val ?? 0));
    return baseInit + lowestVal;
}
// ...existing code...
// Add a new actor to combat
/**
 * Add a CharacterRecord to the combat state.
 * @param state The current combat state
 * @param input.character The CharacterRecord to add
 */
export function addActor(state, input) {
    const existing = selectActors(state);
    const { character } = input;
    return withActors(state, [...existing, character]);
}
// Update an actor's action cost
export function updateActorCost(state, characterId, actionCost) {
    return withActors(state, state.actors.map(actor => {
        if (actor.id !== characterId)
            return actor;
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
