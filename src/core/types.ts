
export type CharacterId = string;

export interface CharacterState {
  character: Record<CharacterId, CharacterData>;
  initiative: Record<CharacterId, InitiativeState>;
  actions: Record<CharacterId, ActionState | null>;
}

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

  initiative: InitiativeState;
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
    description: string;
    years: number;
    dateStarted?: string;
    dateEnded?: string;
}

// Transient, per-combat initiative state
export interface InitiativeState {
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