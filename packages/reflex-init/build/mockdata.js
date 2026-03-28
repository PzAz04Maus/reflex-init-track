export const mockCombatState = {
    round: 1,
    lastActingIds: [],
    actors: [
        {
            id: "a1",
            name: "Alpha",
            init: { value: 20, joined: true },
            action: { id: 'a1-action', name: 'Attack', cost: 5 },
            data: {},
            bio: {},
            equipment: []
        },
        {
            id: "a2",
            name: "Bravo",
            init: { value: 18, joined: true },
            action: { id: 'a2-action', name: 'Defend', cost: 4 },
            data: {},
            bio: {},
            equipment: []
        },
        {
            id: "a3",
            name: "Charlie",
            init: { value: 15, joined: true },
            action: { id: 'a3-action', name: 'Move', cost: 3 },
            data: {},
            bio: {},
            equipment: []
        },
        {
            id: "a4",
            name: "Delta",
            init: { value: 10, joined: false },
            action: { id: 'a4-action', name: 'Wait', cost: 2 },
            data: {},
            bio: {},
            equipment: []
        },
    ],
};
