export function createInitialState() {
    return {
        actors: [],
        lastActingIds: [],
        round: 1,
        phase: 'exchange',
        currentTick: 0,
        pausesSinceLastExchange: 0,
    };
}
