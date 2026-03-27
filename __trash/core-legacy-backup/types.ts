
export type CharacterId = string;

// CharacterState is now a map of CharacterId to CharacterRecord for fast lookup and single-source-of-truth
export interface CharacterState {
  characters: Record<CharacterId, CharacterRecord>;
}

// Placeholder for equipment state
export type EquipmentState = Record<string, unknown>;

// primary character record
export interface CharacterRecord {
  id: CharacterId;
  name: string;
  ownerUserId?: string | null;
  actorUuid?: string | null;
  combatantId?: string | null;

  data: CharacterData;
  bio: CharacterBio;
  equipment: EquipmentState;

  init: InitiativeState;
  action?: ActionState | null;
}

export interface CharacterData {
    ooda: number
}

export interface CharacterBio {
    age?: number;
    gender?: string;
    height?: string;
    weight?: string;
    description?: string;
    ethnicity?: string;
    imageUrl?: string;
    career?: careerData[];
}

export interface careerData{
    job: string;
    years: number;
    dateStarted?: string;
    dateEnded?: string;
    description: string;
}

// Transient, per-combat initiative state
export interface InitiativeState {
  base: number;
  initial: number;
  val: number;
  joined: boolean;
  joinedMidFight?: boolean;
}

export interface ActionState {
    id: string;
    name: string;
    cost: number;
}

export interface AddActorInput {
  character: CharacterData;
  state: Partial<InitiativeState>;
}

export interface CombatState {
  actors: CharacterRecord[];
  lastActingIds: CharacterId[];
  round: number;
}

export interface TurnAdvanceResult {
  state: CombatState;
  actingIds: CharacterId[];
}