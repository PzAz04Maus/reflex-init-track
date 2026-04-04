import { createInitialState } from 'reflex-framework/createInitialState';
import { addActor } from 'reflex-framework/rules/advanceTurn';
const emptyEquipment = { byId: {}, order: [] };
function randomD20() {
    return Math.floor(Math.random() * 20) + 1;
}
export function makeDefaultCharacterData(overrides = {}) {
    return {
        awareness: 5,
        coordination: 5,
        fitness: 5,
        muscle: 5,
        cognition: 5,
        education: 5,
        personality: 5,
        resolve: 5,
        ooda: 10,
        cuf: 0,
        ...overrides,
    };
}
export async function seedFromCombat(combat) {
    let state = createInitialState();
    const combatants = Array.from(combat.combatants ?? []);
    for (const combatant of combatants) {
        const actor = combatant.actor;
        const ownerUser = game.users?.find((user) => actor?.testUserPermission?.(user, foundry?.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3));
        state = addActor(state, {
            character: {
                id: combatant.id,
                name: combatant.name ?? actor?.name ?? 'Unknown',
                ownerUserId: ownerUser?.id ?? null,
                actorUuid: actor?.uuid ?? null,
                combatantId: combatant.id,
                data: makeDefaultCharacterData({ ooda: 10 }),
                bio: {},
                equipment: emptyEquipment,
                init: {
                    base: 4,
                    initial: randomD20(),
                    val: 0,
                    joined: false
                },
                action: null
            },
            state: {
                joined: false
            }
        });
    }
    return state;
}
