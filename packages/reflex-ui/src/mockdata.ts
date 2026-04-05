import type { CharacterBio, CharacterData, CombatState, EquipmentRecord, InitiativeState } from 'reflex-core';

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
  actors: [
    {
      id: 'a1',
      name: 'Alpha',
      init: makeInit(20, true),
      action: { id: 'a1-action', name: 'Attack', cost: 5 },
      data: makeData(10),
      bio: emptyBio,
      equipment: emptyEquipment,
    },
    {
      id: 'a2',
      name: 'Bravo',
      init: makeInit(18, true),
      action: { id: 'a2-action', name: 'Defend', cost: 4 },
      data: makeData(8),
      bio: emptyBio,
      equipment: emptyEquipment,
    },
    {
      id: 'a3',
      name: 'Charlie',
      init: makeInit(15, true),
      action: { id: 'a3-action', name: 'Move', cost: 3 },
      data: makeData(7),
      bio: emptyBio,
      equipment: emptyEquipment,
    },
    {
      id: 'a4',
      name: 'Delta',
      init: makeInit(10, false),
      action: { id: 'a4-action', name: 'Wait', cost: 2 },
      data: makeData(5),
      bio: emptyBio,
      equipment: emptyEquipment,
    },
  ],
};