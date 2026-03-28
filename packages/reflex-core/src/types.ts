export type CharacterId = string;

export interface InitiativeState {
  value: number;
  joined?: boolean;
  tick?: number;
  actionCost?: number;
  // Add more fields as needed
}

export interface CombatState {
  actors: CharacterRecord[];
  lastActingIds: string[];
  round: number;
  // Add more fields as needed
}

export interface TurnAdvanceResult {
  // Define the structure as needed
}

export interface CharacterRecord {
  id: CharacterId;
  name: string;
  init: InitiativeState;
  action?: { cost: number };
  // Add more fields as needed
}
