import { selectActors, withActors } from '../selectors/combatSelectors';
// Calculate margin for roll
export function computeMargin(roll, target) {
    return roll - target;
}
// Calculate OODA-adjusted initiative
export function computeOodaAdjustedInit(baseInit, roll, target) {
    return baseInit + computeMargin(roll, target);
}
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
        const prevAction = actor.action ?? { id: '', name: '', cost: 0 };
        return {
            ...actor,
            action: {
                id: prevAction.id,
                name: prevAction.name,
                cost: actionCost
            }
        };
    }));
}
