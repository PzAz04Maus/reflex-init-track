export type CharacterId = string;
export interface CharacterState {
    characters: Record<CharacterId, CharacterRecord>;
}
export type EquipmentState = Record<string, unknown>;
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
    ooda: number;
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
export interface careerData {
    job: string;
    years: number;
    dateStarted?: string;
    dateEnded?: string;
    description: string;
}
export interface InitiativeState {
    value?: number;
    base?: number;
    initial?: number;
    val?: number;
    joined?: boolean;
    tick?: number;
    actionCost?: number;
}
export interface ActionState {
    id: string;
    name: string;
    cost: number;
}
export interface CombatState {
    actors: CharacterRecord[];
    lastActingIds: string[];
    round: number;
}
export interface TurnAdvanceResult {
    state: CombatState;
    actingIds: string[];
    previousLead: string | null;
}
//# sourceMappingURL=types.d.ts.map