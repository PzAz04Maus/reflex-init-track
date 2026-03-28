export const mockCombatState = {
    round: 1,
    lastActingIds: [],
    actors: [
        {
            id: "a1",
            name: "Alpha",
            ownerUserId: null,
            actorUuid: null,
            combatantId: null,
            data: { ooda: 10 },
            bio: {},
            equipment: {},
            init: { base: 20, initial: 20, val: 20, joined: true },
            action: { id: "a1-action", name: "Default", cost: 5 }
        },
        {
            id: "a2",
            name: "Bravo",
            ownerUserId: null,
            actorUuid: null,
            combatantId: null,
            data: { ooda: 11 },
            bio: {},
            equipment: {},
            init: { base: 18, initial: 18, val: 18, joined: true },
            action: { id: "a2-action", name: "Default", cost: 4 }
        },
        {
            id: "a3",
            name: "Charlie",
            ownerUserId: null,
            actorUuid: null,
            combatantId: null,
            data: { ooda: 12 },
            bio: {},
            equipment: {},
            init: { base: 15, initial: 15, val: 15, joined: true },
            action: { id: "a3-action", name: "Default", cost: 3 }
        },
        {
            id: "a4",
            name: "Delta",
            ownerUserId: null,
            actorUuid: null,
            combatantId: null,
            data: { ooda: 13 },
            bio: {},
            equipment: {},
            init: { base: 10, initial: 10, val: 10, joined: false },
            action: { id: "a4-action", name: "Default", cost: 2 }
        },
    ],
};
