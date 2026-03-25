
export type CharacterId = string;

export interface CharacterState {
  character: Record<CharacterId, CharacterData>;
  initiative: Record<CharacterId, InitiativeState>;
  actions: Record<CharacterId, ActionState | null>;
}

// primart character record
export interface CharacterRecord {
  id: CharacterId;
  name: string;
  ownerUserId?: string | null;
  actorUuid?: string | null;
  combatantId?: string | null;

  data: CharacterData;
  equipment: any; // Placeholder for equipment data

  Initiative: InitiativeState;
  Action?: ActionState | null;
}

export interface CharacterData {
    ooda: number
}

// Transient, per-combat initiative state
export interface InitiativeState {
  id: CharacterId;
  baseInit: number;
  startingInit: number;
  currentInit: number;
  joined: boolean;
  joinedMidFight?: boolean;
}

export interface ActionState {
    id: string;
    name: string;
    cost: number;
}

// Composition for use in combat state (if needed)
export interface CombatActor {
  character: CharacterData;
  state: InitiativeState;
}

export interface AddActorInput {
  character: CharacterData;
  state: Partial<InitiativeState>;
}

export interface ReflexState {
  actors: CombatActor[];
  lastActingIds: CharacterId[];
  round: number;
}

export interface TurnAdvanceResult {
  state: ReflexState;
  actingIds: CharacterId[];
}