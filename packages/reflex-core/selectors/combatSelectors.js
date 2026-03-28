// Get all actors, sorted by init.val then name
export function selectActors(state) {
    return [...state.actors].sort((a, b) => {
        if (a.init.val !== b.init.val)
            return a.init.val - b.init.val;
        return a.name.localeCompare(b.name);
    });
}
// Find a CharacterRecord by characterId
export function selectActorById(state, characterId) {
    return selectActors(state).find((actor) => actor.id === characterId) ?? null;
}
// Replace the actors array (with sorting)
export function withActors(state, actors) {
    return {
        ...state,
        actors: [...actors].sort((a, b) => {
            if (a.init.val !== b.init.val)
                return a.init.val - b.init.val;
            return a.name.localeCompare(b.name);
        })
    };
}
