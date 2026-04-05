// --- Core combat state types (restored from legacy) ---
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

export interface CombatState {
	actors: CharacterRecord[];
	lastActingIds: CharacterId[];
	round: number;
}

export interface TurnAdvanceResult {
	state: CombatState;
	actingIds: CharacterId[];
}
// --- Types merged from reflex-shared ---
export type CharacterId = string;

export interface CharacterState {
	characters: Record<CharacterId, CharacterRecord>;
}

type EquipmentId = string;
type EquipmentDefId = string;

interface EquipmentDefinition {
	defId: EquipmentDefId;
	name: string;
	category: string;
	baseTags: string[];
	baseStats: Record<string, unknown>;
}

interface BaseEquipmentEntry {
	id: string;
	defId: string;
	name: string;
	qty?: number;
	slot?: string | null;
	tags?: string[];
	notes?: string | null;
}

interface WeaponEntry extends BaseEquipmentEntry {
	kind: "weapon";
	summary: {
		damage?: number;
		range?: string;
		ammoType?: string;
	};
	implRef?: { kind: "weapon"; id: string } | null;
}

interface ConsumableEntry extends BaseEquipmentEntry {
	kind: "consumable";
	summary: {
		uses?: number;
	};
	implRef?: { kind: "consumable"; id: string } | null;
}

type EquipmentEntry = WeaponEntry | ConsumableEntry;

interface EquipmentRecord {
	byId: Record<string, EquipmentEntry>;
	order: string[];
}

export interface CharacterRecord {
	id: CharacterId;
	name: string;
	ownerUserId?: string | null;
	actorUuid?: string | null;
	combatantId?: string | null;
	data: CharacterData;
	bio: CharacterBio;
	equipment: EquipmentRecord;
	init: InitiativeState;
	action?: ActionState | null;
}

export interface CharacterData {
		awareness: number;
		coordination: number;
		fitness: number;
		muscle: number;

		cognition: number;
		education: number;
		personality: number;
		resolve: number;

		ooda: number;
		cuf: number;
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
}
