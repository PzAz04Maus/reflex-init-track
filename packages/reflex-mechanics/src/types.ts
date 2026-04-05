// --- Core combat state types (restored from legacy) ---
// Transient, per-combat initiative state
export interface InitiativeState {
	base: number;
	initial: number;
	val: number;
	joined: boolean;
	joinedMidFight?: boolean;
}

export type CombatPhase = "exchange" | "pause" | "ended";

export type PressHoldChoice = "press" | "hold";

export type EncumbranceLevel = "overloaded" | "heavy" | "moderate" | "light" | "unencumbered";

export type Stance = "standing" | "kneeling" | "sitting" | "prone";

export type TacticalMovementRate = "sprint" | "run" | "trot" | "walk" | "stagger" | "crawl";

export type DominantHand = 'left' | 'right';

export type HitLocation = 'head' | 'torso' | 'leftArm' | 'rightArm' | 'leftLeg' | 'rightLeg';

export type InjurySeverity = 'none' | 'slight' | 'moderate' | 'serious' | 'critical' | 'drt' | 'dead';

export interface WoundThresholdProfile {
	slight: number;
	moderate: number;
	serious: number;
	critical: number;
	drt?: number;
}

export interface InjuryRecord {
	location: HitLocation;
	severity: InjurySeverity;
	virtual?: boolean;
}

export interface InjuryTrack {
	location: HitLocation;
	actual: InjurySeverity;
	virtual: InjurySeverity;
	effective: InjurySeverity;
}

export interface CharacterHealthState {
	baseWoundThreshold: number;
	thresholdsByLocation: Record<HitLocation, WoundThresholdProfile>;
	injuries: Record<HitLocation, InjuryTrack>;
	inShock: boolean;
	unstable: boolean;
	unconscious: boolean;
	dead: boolean;
}

export type ActionCadence = "tactical" | "operational" | "free";

export type ActionStatus =
	| "available"
	| "declared"
	| "resolving"
	| "resolved"
	| "interrupted";

export type ActionMetadataValue = string | number | boolean | null;

export interface ActionState {
	id: string;
	key?: string;
	name: string;
	cost: number;
	cadence?: ActionCadence;
	category?: string;
	status?: ActionStatus;
	summary?: string;
	detail?: string;
	tags?: string[];
	declaredTick?: number | null;
	resolvedTick?: number | null;
	source?: string;
	metadata?: Record<string, ActionMetadataValue>;
}

export interface CombatantState {
	encumbrance: EncumbranceLevel;
	stance: Stance;
	tacticalMovementRate: TacticalMovementRate;
	dominantHand?: DominantHand;
	movementCapFromHealth?: TacticalMovementRate | null;
	woundPenalty?: number;
	physicalWoundPenalty?: number;
	healthInjuryThreat?: number;
	baseThreatLevel?: number;
	pressChoice: PressHoldChoice | null;
	lastResolvedChoice: PressHoldChoice | null;
	pressBonus: number;
	broken: boolean;
	surprised?: boolean;
	threatLevel?: number;
	moralePenalty?: number;
	initiativeRoll?: number | null;
	initiativeTarget?: number | null;
	lastComputedInitiative?: number | null;
	queuedActionEndsOnTick?: number | null;
	sustainedFireTargetId?: CharacterId | null;
	sustainedFireWeaponId?: string | null;
	sustainedFireSequence?: number;
}

export interface CombatState {
	actors: CharacterRecord[];
	lastActingIds: CharacterId[];
	round: number;
	phase: CombatPhase;
	currentTick: number;
	pausesSinceLastExchange: number;
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

export interface EquipmentRecord {
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
	health?: CharacterHealthState;
	bio: CharacterBio;
	equipment: EquipmentRecord;
	init: InitiativeState;
	combat: CombatantState;
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
