// Get all actors, sorted by init.value then name
export function selectActors(state) {
    return [...state.actors].sort((a, b) => {
        const aVal = a.init.val ?? 0;
        const bVal = b.init.val ?? 0;
        if (aVal !== bVal)
            return aVal - bVal;
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
            const aVal = a.init.val ?? 0;
            const bVal = b.init.val ?? 0;
            if (aVal !== bVal)
                return aVal - bVal;
            return a.name.localeCompare(b.name);
        })
    };
}
