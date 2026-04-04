// Returns all joined actors with the highest initiative value
export function getNextActors(state) {
    const actors = state.actors.filter(actor => actor.init.joined);
    if (actors.length === 0)
        return [];
    const maxVal = Math.max(...actors.map(actor => actor.init.val ?? 0));
    return actors.filter(actor => (actor.init.val ?? 0) === maxVal);
}
// Returns the first joined actor with the highest initiative value, or null
export function getNextActor(state) {
    return getNextActors(state)[0] ?? null;
}
