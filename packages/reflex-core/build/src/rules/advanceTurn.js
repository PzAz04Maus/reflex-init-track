import { selectActors, withActors } from 'reflex-core';
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
export function sortActors(list) {
    return [...list].sort((a, b) => {
        const aVal = a.init.val ?? 0;
        const bVal = b.init.val ?? 0;
        if (aVal !== bVal)
            return aVal - bVal;
        return a.name.localeCompare(b.name);
    });
}
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
    return withActors(state, state.actors.map((actor) => actor.id === characterId
        ? {
            ...actor,
            action: actor.action
                ? { ...actor.action, cost: actionCost }
                : { id: characterId, name: actor.name, cost: actionCost }
        }
        : actor));
}
