// Returns all joined actors with the lowest initiative value
export function getNextActors(state) {
    const actors = state.actors.filter(actor => actor.init.joined);
    if (actors.length === 0)
        return [];
    const minVal = Math.min(...actors.map(actor => actor.init.val ?? 0));
    return actors.filter(actor => actor.init.value === minVal);
    return actors.filter(actor => (actor.init.val ?? 0) === minVal);
}
// Returns the first joined actor with the lowest initiative value, or null
export function getNextActor(state) {
    return getNextActors(state)[0] ?? null;
}
