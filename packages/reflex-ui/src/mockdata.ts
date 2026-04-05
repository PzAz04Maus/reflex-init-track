import { createCombatAction, createCombatantState } from 'reflex-mechanics';
import type { CharacterBio, CharacterData, CombatState, EquipmentRecord, InitiativeState } from 'reflex-mechanics';

const makeInit = (val: number, joined: boolean): InitiativeState => ({
  base: val,
  initial: val,
  val,
  joined,
});

const makeData = (ooda: number): CharacterData => ({
  awareness: 5,
  coordination: 5,
  fitness: 5,
  muscle: 5,
  cognition: 5,
  education: 5,
  personality: 5,
  resolve: 5,
  ooda,
  cuf: 0,
});

const emptyBio: CharacterBio = {};
const emptyEquipment: EquipmentRecord = { byId: {}, order: [] };

export const mockCombatState: CombatState = {
  round: 1,
  lastActingIds: [],
  phase: 'exchange',
  currentTick: 20,
  pausesSinceLastExchange: 0,
  actors: [
    {
      id: 'a1',
      name: 'Alpha',
      init: makeInit(20, true),
      combat: createCombatantState({
        encumbrance: 'light',
        tacticalMovementRate: 'run',
        initiativeRoll: 6,
        initiativeTarget: 10,
        lastComputedInitiative: 20,
      }),
      action: createCombatAction('attack', {
        id: 'a1-action',
        cost: 5,
        detail: 'Prepared with a snap-shot profile for demo purposes.',
      }),
      data: makeData(10),
      bio: emptyBio,
      equipment: emptyEquipment,
    },
    {
      id: 'a2',
      name: 'Bravo',
      init: makeInit(18, true),
      combat: createCombatantState({
        encumbrance: 'moderate',
        stance: 'kneeling',
        pressChoice: 'hold',
        tacticalMovementRate: 'walk',
      }),
      action: createCombatAction('block', {
        id: 'a2-action',
        cost: 4,
        summary: 'Holding a defensive close-combat posture.',
      }),
      data: makeData(8),
      bio: emptyBio,
      equipment: emptyEquipment,
    },
    {
      id: 'a3',
      name: 'Charlie',
      init: makeInit(15, true),
      combat: createCombatantState({
        encumbrance: 'unencumbered',
        tacticalMovementRate: 'trot',
        pressChoice: 'press',
        pressBonus: 5,
      }),
      action: createCombatAction('move', {
        id: 'a3-action',
        cost: 5,
        detail: 'Advancing under trot-speed restrictions.',
      }),
      data: makeData(7),
      bio: emptyBio,
      equipment: emptyEquipment,
    },
    {
      id: 'a4',
      name: 'Delta',
      init: makeInit(10, false),
      combat: createCombatantState({
        encumbrance: 'heavy',
        stance: 'prone',
        tacticalMovementRate: 'crawl',
      }),
      action: createCombatAction('wait', {
        id: 'a4-action',
        cost: 2,
        summary: 'Holding for a cleaner read on the next beat.',
      }),
      data: makeData(5),
      bio: emptyBio,
      equipment: emptyEquipment,
    },
  ],
};