export function selectActors(state) {
    return [...state.actors].sort((a, b) => {
        const aVal = a.init.val ?? 0;
        const bVal = b.init.val ?? 0;
        if (aVal !== bVal)
            return aVal - bVal;
        return a.name.localeCompare(b.name);
    });
}
export function selectActorById(state, characterId) {
    return selectActors(state).find((actor) => actor.id === characterId) ?? null;
}
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
