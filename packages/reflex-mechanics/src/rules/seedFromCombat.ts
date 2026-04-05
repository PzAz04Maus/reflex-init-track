import { createCombatantState, getBaseInitiative } from '../combat';
import type { CharacterData, CombatState, EquipmentRecord } from '../types';
import { createInitialState } from 'reflex-framework';
import { addActor } from './advanceTurn';

const emptyEquipment: EquipmentRecord = { byId: {}, order: [] };

function randomD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

export function makeDefaultCharacterData(overrides: Partial<CharacterData> = {}): CharacterData {
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

export async function seedFromCombat(combat: any): Promise<CombatState> {
  let state = createInitialState();
  const combatants = Array.from(combat.combatants ?? []) as any[];

  for (const combatant of combatants) {
    const actor = combatant.actor;
    const ownerUser = game.users?.find((user: any) =>
      actor?.testUserPermission?.(user, foundry?.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3),
    );

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
          base: getBaseInitiative('moderate'),
          initial: randomD20(),
          val: 0,
          joined: false
        },
        combat: createCombatantState({ encumbrance: 'moderate', stance: 'standing' }),
        action: null
      },
      state: {
        joined: false
      }
    });
  }

  return state;
}