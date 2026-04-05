import type { BuildingId, BuildingRecord, BuildingState } from '../types';

import type {
	BuildingAssessment,
	BuildingDamageResolution,
	BuildingDesignPlan,
	BuildingMaterial,
	BuildingMaterialClass,
	BuildingMaterialArmorProfile,
	BuildingExecutionPlan,
	BuildingOccupancyResolution,
	BuildingRepairResolution,
	BridgeDesignPlan,
	BridgeExecutionPlan,
	ConstructionToolingOptions,
	ConstructionProjectProfile,
	ConstructionProjectType,
	DemolitionChargeResolution,
	DemolitionChargePlacementResolution,
	FieldExpedientConstructionPlan,
	FieldExpedientDecayResolution,
	FortificationProfile,
	SalvageResolution,
	SalvageAttemptResolution,
	SampleStructureId,
	ShelterGrade,
	ShelterRestorationPlan,
	StructuralLoadClass,
	StructuralRepairPlan,
	StructuralStabilityResolution,
	StructuralTargetClass,
	TimeAdjustedPlan,
	TypicalBuildingCover,
	VehicleOrStructureCoverOptions,
} from './types';

export const BUILDING_MATERIAL_ARMOR: Record<BuildingMaterial, BuildingMaterialArmorProfile> = {
	advancedCeramicCompositeArmor: { mmPerArmor: 2.5, multiplier: 0.4 },
	steelArmorPlate: { mmPerArmor: 5, multiplier: 0.2 },
	sheetSteel: { mmPerArmor: 6, multiplier: 0.16 },
	reinforcedConcrete: { mmPerArmor: 25, multiplier: 0.04 },
	concreteBrick: { mmPerArmor: 35, multiplier: 0.03 },
	stonePackedDirtWoodLiquid: { mmPerArmor: 50, multiplier: 0.02 },
	fiberglass: { mmPerArmor: 150, multiplier: 0.007 },
	looseDirt: { mmPerArmor: 250, multiplier: 0.004 },
};

export const TYPICAL_BUILDING_COVER_ARMOR: Record<TypicalBuildingCover, number> = {
	hastyEarthenWall: 2,
	sandbag: 5,
	woodenPlank: 1,
	sheetrockInteriorWall: 0.5,
	plywoodInteriorDoor: 0.5,
	woodExteriorDoor: 2,
	brickWall: 3,
	steelSecurityDoor: 3,
	timberWall: 4,
	stoneWall: 6,
	cinderBlockWall: 9,
	reinforcedConcreteWall: 10,
	heavyStoneWall: 12,
};

const TYPICAL_BUILDING_SHELTER: Record<TypicalBuildingCover, ShelterGrade> = {
	hastyEarthenWall: 'minimal',
	sandbag: 'minimal',
	woodenPlank: 'none',
	sheetrockInteriorWall: 'minimal',
	plywoodInteriorDoor: 'minimal',
	woodExteriorDoor: 'minimal',
	brickWall: 'adequate',
	steelSecurityDoor: 'adequate',
	timberWall: 'adequate',
	stoneWall: 'adequate',
	cinderBlockWall: 'adequate',
	reinforcedConcreteWall: 'complete',
	heavyStoneWall: 'complete',
};

const TYPICAL_BUILDING_DAMAGE_THRESHOLD: Record<TypicalBuildingCover, number> = {
	hastyEarthenWall: 1,
	sandbag: 2,
	woodenPlank: 0,
	sheetrockInteriorWall: 0,
	plywoodInteriorDoor: 0,
	woodExteriorDoor: 1,
	brickWall: 2,
	steelSecurityDoor: 2,
	timberWall: 2,
	stoneWall: 3,
	cinderBlockWall: 4,
	reinforcedConcreteWall: 5,
	heavyStoneWall: 5,
};

const TYPICAL_BUILDING_INTEGRITY: Record<TypicalBuildingCover, number> = {
	hastyEarthenWall: 8,
	sandbag: 10,
	woodenPlank: 4,
	sheetrockInteriorWall: 3,
	plywoodInteriorDoor: 3,
	woodExteriorDoor: 6,
	brickWall: 12,
	steelSecurityDoor: 10,
	timberWall: 14,
	stoneWall: 18,
	cinderBlockWall: 20,
	reinforcedConcreteWall: 24,
	heavyStoneWall: 24,
};

const SHELTER_ORDER: ShelterGrade[] = ['none', 'minimal', 'adequate', 'complete'];

const SAMPLE_STRUCTURE_TEMPLATES: Record<SampleStructureId, Omit<BuildingRecord, 'id'>> = {
	farmCottage: { name: 'Farm/vacation cottage', armor: 2, damageThreshold: 20, structuralIntegrity: 1, currentStructuralIntegrity: 1, shelter: 'adequate', baselineShelter: 'adequate', livingSpace: 3, floorSpaceSquareMeters: 48, dominantMaterialClass: 'light', tags: ['sampleStructure', 'home'], source: 'Twilight 2013 Core OEF PDF p.194' },
	house1Bedroom: { name: 'House, 1 bedroom', armor: 2, damageThreshold: 20, structuralIntegrity: 2, currentStructuralIntegrity: 2, shelter: 'complete', baselineShelter: 'complete', livingSpace: 5, floorSpaceSquareMeters: 80, dominantMaterialClass: 'light', tags: ['sampleStructure', 'home'], source: 'Twilight 2013 Core OEF PDF p.194' },
	house2Bedrooms: { name: 'House, 2 bedrooms', armor: 2, damageThreshold: 20, structuralIntegrity: 3, currentStructuralIntegrity: 3, shelter: 'complete', baselineShelter: 'complete', livingSpace: 8, floorSpaceSquareMeters: 128, dominantMaterialClass: 'light', tags: ['sampleStructure', 'home'], source: 'Twilight 2013 Core OEF PDF p.194' },
	house3Bedrooms: { name: 'House, 3 bedrooms', armor: 3, damageThreshold: 30, structuralIntegrity: 5, currentStructuralIntegrity: 5, shelter: 'complete', baselineShelter: 'complete', livingSpace: 11, floorSpaceSquareMeters: 176, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'home'], source: 'Twilight 2013 Core OEF PDF p.194' },
	house4Bedrooms: { name: 'House, 4 bedrooms', armor: 3, damageThreshold: 30, structuralIntegrity: 7, currentStructuralIntegrity: 7, shelter: 'complete', baselineShelter: 'complete', livingSpace: 14, floorSpaceSquareMeters: 224, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'home'], source: 'Twilight 2013 Core OEF PDF p.194' },
	mansion: { name: 'Mansion', armor: 5, damageThreshold: 50, structuralIntegrity: 25, currentStructuralIntegrity: 25, shelter: 'complete', baselineShelter: 'complete', livingSpace: 80, floorSpaceSquareMeters: 1280, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'home'], source: 'Twilight 2013 Core OEF PDF p.194' },
	apartmentBlock3Story: { name: 'Apartment block, 3-story', armor: 8, damageThreshold: 80, structuralIntegrity: 21, currentStructuralIntegrity: 21, shelter: 'complete', baselineShelter: 'complete', livingSpace: 64, floorSpaceSquareMeters: 1024, dominantMaterialClass: 'industrial', tags: ['sampleStructure', 'home', 'apartment'], source: 'Twilight 2013 Core OEF PDF p.194' },
	apartmentLowRise6Story: { name: 'Apartment low-rise, 6-story', armor: 9, damageThreshold: 90, structuralIntegrity: 45, currentStructuralIntegrity: 45, shelter: 'complete', baselineShelter: 'complete', livingSpace: 280, floorSpaceSquareMeters: 4480, dominantMaterialClass: 'industrial', tags: ['sampleStructure', 'home', 'apartment'], source: 'Twilight 2013 Core OEF PDF p.194' },
	smallBusiness: { name: 'Business, small', armor: 3, damageThreshold: 30, structuralIntegrity: 4, currentStructuralIntegrity: 4, shelter: 'adequate', baselineShelter: 'adequate', livingSpace: 10, floorSpaceSquareMeters: 200, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'commercial'], source: 'Twilight 2013 Core OEF PDF p.194' },
	largeBusiness: { name: 'Business, large', armor: 4, damageThreshold: 40, structuralIntegrity: 20, currentStructuralIntegrity: 20, shelter: 'adequate', baselineShelter: 'adequate', livingSpace: 45, floorSpaceSquareMeters: 900, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'commercial'], source: 'Twilight 2013 Core OEF PDF p.194' },
	retailOutlet: { name: 'Business, retail outlet', armor: 4, damageThreshold: 40, structuralIntegrity: 250, currentStructuralIntegrity: 250, shelter: 'adequate', baselineShelter: 'adequate', livingSpace: 600, floorSpaceSquareMeters: 12000, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'commercial'], source: 'Twilight 2013 Core OEF PDF p.194' },
	warehouse: { name: 'Warehouse', armor: 5, damageThreshold: 50, structuralIntegrity: 400, currentStructuralIntegrity: 400, shelter: 'minimal', baselineShelter: 'minimal', livingSpace: 300, floorSpaceSquareMeters: 6000, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'commercial', 'storage'], source: 'Twilight 2013 Core OEF PDF p.194' },
	lightFactory: { name: 'Factory, light', armor: 4, damageThreshold: 40, structuralIntegrity: 30, currentStructuralIntegrity: 30, shelter: 'minimal', baselineShelter: 'minimal', livingSpace: 100, floorSpaceSquareMeters: 2000, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'commercial', 'industrialSite'], source: 'Twilight 2013 Core OEF PDF p.194' },
	heavyFactory: { name: 'Factory, heavy', armor: 10, damageThreshold: 100, structuralIntegrity: 70, currentStructuralIntegrity: 70, shelter: 'minimal', baselineShelter: 'minimal', livingSpace: 200, floorSpaceSquareMeters: 4000, dominantMaterialClass: 'industrial', tags: ['sampleStructure', 'commercial', 'industrialSite'], source: 'Twilight 2013 Core OEF PDF p.194' },
	superheavyFactory: { name: 'Factory, superheavy', armor: 12, damageThreshold: 120, structuralIntegrity: 150, currentStructuralIntegrity: 150, shelter: 'minimal', baselineShelter: 'minimal', livingSpace: 400, floorSpaceSquareMeters: 8000, dominantMaterialClass: 'industrial', tags: ['sampleStructure', 'commercial', 'industrialSite'], source: 'Twilight 2013 Core OEF PDF p.194' },
	pedestrianFootbridge: { name: 'Pedestrian footbridge', armor: 1, damageThreshold: 10, structuralIntegrity: 1, currentStructuralIntegrity: 1, shelter: 'none', baselineShelter: 'none', livingSpace: 0, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'bridge'], source: 'Twilight 2013 Core OEF PDF p.194' },
	ruralRoadBridgeWood: { name: 'Rural road bridge, wood', armor: 4, damageThreshold: 40, structuralIntegrity: 2, currentStructuralIntegrity: 2, shelter: 'none', baselineShelter: 'none', livingSpace: 0, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'bridge'], source: 'Twilight 2013 Core OEF PDF p.194' },
	ruralRoadBridgeStone: { name: 'Rural road bridge, stone', armor: 6, damageThreshold: 60, structuralIntegrity: 5, currentStructuralIntegrity: 5, shelter: 'none', baselineShelter: 'none', livingSpace: 0, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'bridge'], source: 'Twilight 2013 Core OEF PDF p.194' },
	highwayBridgeFourLane: { name: 'Highway bridge, 4-lane', armor: 15, damageThreshold: 150, structuralIntegrity: 8, currentStructuralIntegrity: 8, shelter: 'none', baselineShelter: 'none', livingSpace: 0, dominantMaterialClass: 'industrial', tags: ['sampleStructure', 'bridge'], source: 'Twilight 2013 Core OEF PDF p.194' },
	railroadBridge: { name: 'Railroad bridge', armor: 30, damageThreshold: 300, structuralIntegrity: 10, currentStructuralIntegrity: 10, shelter: 'none', baselineShelter: 'none', livingSpace: 0, dominantMaterialClass: 'industrial', tags: ['sampleStructure', 'bridge'], source: 'Twilight 2013 Core OEF PDF p.194' },
	temporaryPontoonBridge: { name: 'Temporary pontoon bridge', armor: 4, damageThreshold: 40, structuralIntegrity: 12, currentStructuralIntegrity: 12, shelter: 'none', baselineShelter: 'none', livingSpace: 0, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'bridge', 'temporary'], source: 'Twilight 2013 Core OEF PDF p.194' },
	bunkerFightingPosition: { name: 'Bunker, fighting position', armor: 5, damageThreshold: 50, structuralIntegrity: 3, currentStructuralIntegrity: 3, shelter: 'minimal', baselineShelter: 'minimal', livingSpace: 1, floorSpaceSquareMeters: 16, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'military'], source: 'Twilight 2013 Core OEF PDF p.194' },
	bunkerHousing: { name: 'Bunker, housing', armor: 5, damageThreshold: 50, structuralIntegrity: 6, currentStructuralIntegrity: 6, shelter: 'adequate', baselineShelter: 'adequate', livingSpace: 9, floorSpaceSquareMeters: 144, dominantMaterialClass: 'heavy', tags: ['sampleStructure', 'military'], source: 'Twilight 2013 Core OEF PDF p.194' },
	bunkerCommandPost: { name: 'Bunker, command post', armor: 10, damageThreshold: 100, structuralIntegrity: 8, currentStructuralIntegrity: 8, shelter: 'minimal', baselineShelter: 'minimal', livingSpace: 20, floorSpaceSquareMeters: 320, dominantMaterialClass: 'industrial', tags: ['sampleStructure', 'military'], source: 'Twilight 2013 Core OEF PDF p.194' },
	hardenedAircraftShelter: { name: 'Hardened aircraft shelter', armor: 20, damageThreshold: 200, structuralIntegrity: 25, currentStructuralIntegrity: 25, shelter: 'minimal', baselineShelter: 'minimal', livingSpace: 60, floorSpaceSquareMeters: 1200, dominantMaterialClass: 'industrial', tags: ['sampleStructure', 'military'], source: 'Twilight 2013 Core OEF PDF p.194' },
};

function clampShelterGrade(target: ShelterGrade, cap: ShelterGrade): ShelterGrade {
	return SHELTER_ORDER[Math.min(SHELTER_ORDER.indexOf(target), SHELTER_ORDER.indexOf(cap))] ?? 'none';
}

function getBaselineShelter(building: Pick<BuildingRecord, 'baselineShelter' | 'shelter'>): ShelterGrade {
	return building.baselineShelter ?? building.shelter;
}

function getLivingSpace(building: Pick<BuildingRecord, 'livingSpace' | 'floorSpaceSquareMeters'>): number {
	if (typeof building.livingSpace === 'number') {
		return Math.max(0, building.livingSpace);
	}

	if (typeof building.floorSpaceSquareMeters === 'number') {
		return estimateLivingSpaceFromFloorSpace(building.floorSpaceSquareMeters);
	}

	return 0;
}

function getMaterialClass(building: Pick<BuildingRecord, 'dominantMaterialClass' | 'armor'>): BuildingMaterialClass {
	if (building.dominantMaterialClass) {
		return building.dominantMaterialClass;
	}

	if (building.armor >= 8) {
		return 'industrial';
	}

	if (building.armor >= 3) {
		return 'heavy';
	}

	return 'light';
}

function getCurrentStructuralIntegrity(
	building: Pick<BuildingRecord, 'structuralIntegrity' | 'currentStructuralIntegrity'>,
): number {
	return Math.max(0, building.currentStructuralIntegrity ?? building.structuralIntegrity);
}

function getStructuralIntegrityRatio(
	building: Pick<BuildingRecord, 'structuralIntegrity' | 'currentStructuralIntegrity'>,
): number {
	if (building.structuralIntegrity <= 0) {
		return 0;
	}

	return getCurrentStructuralIntegrity(building) / building.structuralIntegrity;
}

function divideAndRoundUp(value: number, divisor: number): number {
	return Math.max(1, Math.ceil(value / divisor));
}

function getDesignTimeDivisor(options: ConstructionToolingOptions = {}): number {
	let divisor = 1;

	if (options.electronicSurveyingTools) {
		divisor *= 2;
	}

	if (options.computerDesignSoftware) {
		divisor *= 10;
	}

	return divisor;
}

function getExecutionTimeDivisor(options: ConstructionToolingOptions = {}): number {
	let divisor = 1;

	if (options.powerTools) {
		divisor *= 2;
	}

	if (options.heavyEquipment) {
		divisor *= 10;
	}

	return divisor;
}

export function getTypicalBuildingCoverArmor(cover: TypicalBuildingCover): number {
	return TYPICAL_BUILDING_COVER_ARMOR[cover];
}

export function getStructureDamageThreshold(armor: number): number {
	return armor > 0 ? armor * 10 : 5;
}

export function estimateStructuralIntegrityFromFloorSpace(floorSpaceSquareMeters: number): number {
	return Math.max(1, Math.round(Math.max(0, floorSpaceSquareMeters) / 50));
}

export function estimateLivingSpaceFromFloorSpace(floorSpaceSquareMeters: number, habitationDesigned = true): number {
	const divisor = habitationDesigned ? 16 : 20;
	return Math.max(0, Math.floor(Math.max(0, floorSpaceSquareMeters) / divisor));
}

export function getMaximumShelterForIntegrity(building: Pick<BuildingRecord, 'structuralIntegrity' | 'currentStructuralIntegrity' | 'baselineShelter' | 'shelter'>): ShelterGrade {
	const maximumStructuralIntegrity = Math.max(0, building.structuralIntegrity);
	const currentStructuralIntegrity = getCurrentStructuralIntegrity(building);
	const lostStructuralIntegrity = Math.max(0, maximumStructuralIntegrity - currentStructuralIntegrity);
	const baselineShelter = getBaselineShelter(building);

	if (currentStructuralIntegrity <= 0) {
		return 'none';
	}

	if (lostStructuralIntegrity >= Math.max(1, Math.ceil(maximumStructuralIntegrity * 0.25))) {
		return clampShelterGrade(baselineShelter, 'minimal');
	}

	if (lostStructuralIntegrity >= 1) {
		return clampShelterGrade(baselineShelter, 'adequate');
	}

	return baselineShelter;
}

export function createBuildingState(buildings: ReadonlyArray<BuildingRecord> = []): BuildingState {
	return {
		buildings: Object.fromEntries(buildings.map((building) => [building.id, building])),
	};
}

export function listSampleStructureTemplates(): SampleStructureId[] {
	return Object.keys(SAMPLE_STRUCTURE_TEMPLATES) as SampleStructureId[];
}

export function getSampleStructureTemplate(id: SampleStructureId): Omit<BuildingRecord, 'id'> {
	return SAMPLE_STRUCTURE_TEMPLATES[id];
}

export function instantiateSampleStructure(
	id: BuildingId,
	templateId: SampleStructureId,
	overrides: Partial<Omit<BuildingRecord, 'id'>> = {},
): BuildingRecord {
	return {
		id,
		...SAMPLE_STRUCTURE_TEMPLATES[templateId],
		...overrides,
	};
}

export function selectBuildings(state: BuildingState): BuildingRecord[] {
	return Object.values(state.buildings);
}

export function selectBuildingById(state: BuildingState, buildingId: BuildingId): BuildingRecord | null {
	return state.buildings[buildingId] ?? null;
}

export function withBuilding(state: BuildingState, building: BuildingRecord): BuildingState {
	return {
		...state,
		buildings: {
			...state.buildings,
			[building.id]: building,
		},
	};
}

export function withoutBuilding(state: BuildingState, buildingId: BuildingId): BuildingState {
	const nextBuildings = { ...state.buildings };
	delete nextBuildings[buildingId];

	return {
		...state,
		buildings: nextBuildings,
	};
}

export function createFortificationProfile(cover: TypicalBuildingCover): FortificationProfile {
	return {
		cover,
		armor: TYPICAL_BUILDING_COVER_ARMOR[cover],
		damageThreshold: TYPICAL_BUILDING_DAMAGE_THRESHOLD[cover],
		structuralIntegrity: TYPICAL_BUILDING_INTEGRITY[cover],
		shelter: TYPICAL_BUILDING_SHELTER[cover],
		notes: [
			'This profile is a first-pass fortification baseline built from the sourced cover-material table.',
		],
	};
}

export function createFortificationBuilding(
	id: BuildingId,
	name: string,
	cover: TypicalBuildingCover,
	overrides: Partial<Omit<BuildingRecord, 'id' | 'name' | 'armor' | 'damageThreshold' | 'structuralIntegrity' | 'currentStructuralIntegrity' | 'shelter'>> = {},
): BuildingRecord {
	const profile = createFortificationProfile(cover);

	return {
		id,
		name,
		armor: profile.armor,
		damageThreshold: getStructureDamageThreshold(profile.armor),
		structuralIntegrity: profile.structuralIntegrity,
		currentStructuralIntegrity: profile.structuralIntegrity,
		shelter: profile.shelter,
		baselineShelter: profile.shelter,
		tags: ['fortification', cover],
		traits: ['constructedCover'],
		...overrides,
	};
}

export function computeBuildingMaterialArmor(material: BuildingMaterial, thicknessMm: number): number {
	return thicknessMm * BUILDING_MATERIAL_ARMOR[material].multiplier;
}

export function resolveVehicleOrStructureCoverArmor(options: VehicleOrStructureCoverOptions): number {
	const throughVehicleMultiplier = options.attackPassesThroughVehicle ? 2 : 1;
	const engineBonus = options.usingEngineBlock ? 12 : 0;

	return options.armor * throughVehicleMultiplier + engineBonus;
}

export function getVehicleOrStructureFirePenetration(): 'x2' {
	return 'x2';
}

export function getStructureScaleAttackPenalty(targetClass: StructuralTargetClass): number | null {
	return targetClass === 'vehicleOrStructure' ? 0 : null;
}

export function assessBuilding(
	building: Pick<BuildingRecord, 'armor' | 'structuralIntegrity' | 'currentStructuralIntegrity' | 'shelter' | 'baselineShelter' | 'damageThreshold'>,
): BuildingAssessment {
	const currentStructuralIntegrity = getCurrentStructuralIntegrity(building);
	const integrityRatio = getStructuralIntegrityRatio(building);
	const loadBearingStable = currentStructuralIntegrity > 0 && integrityRatio > 0.5;
	const shelterCap = getMaximumShelterForIntegrity(building);
	const suitableAsShelter = shelterCap !== 'none';
	const salvageable = currentStructuralIntegrity > 0;
	const notes: string[] = [];

	if (!loadBearingStable) {
		notes.push('The structure is too compromised to trust for load-bearing use.');
	}

	if (!suitableAsShelter) {
		notes.push('The structure no longer provides reliable shelter in its current state.');
	}

	if (shelterCap !== getBaselineShelter(building)) {
		notes.push(`Structural damage caps shelter at ${shelterCap}.`);
	}

	if (building.damageThreshold > 0) {
		notes.push(`Attacks must exceed Damage Threshold ${building.damageThreshold} to matter structurally.`);
	}

	return {
		actionType: 'simple',
		governingAttribute: 'AWA',
		coverArmor: building.armor,
		loadBearingStable,
		suitableAsShelter,
		salvageable,
		currentStructuralIntegrity,
		maximumStructuralIntegrity: building.structuralIntegrity,
		notes,
	};
}

export function applyStructuralDamage(
	building: BuildingRecord,
	incomingDamage: number,
	massiveSource = false,
): { building: BuildingRecord; resolution: BuildingDamageResolution } {
	const threshold = building.damageThreshold > 0 ? building.damageThreshold : getStructureDamageThreshold(building.armor);
	const blockedByThreshold = incomingDamage >= threshold ? threshold : Math.max(0, incomingDamage);
	const structuralIntegrityLoss = incomingDamage < threshold
		? 0
		: massiveSource
			? Math.max(1, Math.floor(incomingDamage / Math.max(1, threshold)))
			: 1;
	const remainingStructuralIntegrity = Math.max(0, getCurrentStructuralIntegrity(building) - structuralIntegrityLoss);
	const collapsed = remainingStructuralIntegrity === 0;
	const updatedBuilding = {
		...building,
		currentStructuralIntegrity: remainingStructuralIntegrity,
		shelter: clampShelterGrade(building.shelter, getMaximumShelterForIntegrity({
			structuralIntegrity: building.structuralIntegrity,
			currentStructuralIntegrity: remainingStructuralIntegrity,
			shelter: building.shelter,
			baselineShelter: building.baselineShelter,
		})),
	};
	const stillProvidesShelter = getMaximumShelterForIntegrity(updatedBuilding) !== 'none';
	const notes: string[] = [];

	if (structuralIntegrityLoss === 0) {
		notes.push(`Damage did not exceed threshold ${threshold}.`);
	}

	if (structuralIntegrityLoss > 0) {
		notes.push(`The structure loses ${structuralIntegrityLoss} SI.`);
	}

	if (collapsed) {
		notes.push('The structure has collapsed.');
	}

	if (!collapsed && !stillProvidesShelter) {
		notes.push('The structure still stands but no longer provides reliable shelter.');
	}

	return {
		building: updatedBuilding,
		resolution: {
			appliedDamage: structuralIntegrityLoss,
			blockedByThreshold,
			remainingStructuralIntegrity,
			collapsed,
			stillProvidesShelter,
			notes,
		},
	};
}

export function repairBuilding(
	building: BuildingRecord,
	restoredIntegrity: number,
): { building: BuildingRecord; resolution: BuildingRepairResolution } {
	const safeRestoredIntegrity = Math.max(0, restoredIntegrity);
	const newStructuralIntegrity = Math.min(
		building.structuralIntegrity,
		getCurrentStructuralIntegrity(building) + safeRestoredIntegrity,
	);
	const fullyRestored = newStructuralIntegrity >= building.structuralIntegrity;
	const stillDamaged = newStructuralIntegrity < building.structuralIntegrity;

	return {
		building: {
			...building,
			currentStructuralIntegrity: newStructuralIntegrity,
		},
		resolution: {
			restoredIntegrity: newStructuralIntegrity - getCurrentStructuralIntegrity(building),
			newStructuralIntegrity,
			fullyRestored,
			stillDamaged,
			notes: fullyRestored
				? ['The structure has been restored to full structural integrity.']
				: ['The structure remains damaged and may still be unsuitable for full use.'],
		},
	};
}

export function restoreBuildingShelter(building: BuildingRecord, levels = 1): BuildingRecord {
	const safeLevels = Math.max(0, levels);
	const shelterCap = getMaximumShelterForIntegrity(building);
	const baselineShelter = getBaselineShelter(building);
	const currentIndex = SHELTER_ORDER.indexOf(building.shelter);
	const targetIndex = Math.min(SHELTER_ORDER.indexOf(baselineShelter), currentIndex + safeLevels);

	return {
		...building,
		shelter: clampShelterGrade(SHELTER_ORDER[targetIndex] ?? baselineShelter, shelterCap),
	};
}

export function getBuildingSalvageResolution(building: BuildingRecord): SalvageResolution {
	const currentStructuralIntegrity = getCurrentStructuralIntegrity(building);
	const maximumStructuralIntegrity = Math.max(0, building.structuralIntegrity);
	const salvageRatio = maximumStructuralIntegrity <= 0 ? 0 : currentStructuralIntegrity / maximumStructuralIntegrity;
	const condition = currentStructuralIntegrity === 0
		? 'collapsed'
		: salvageRatio <= 0.25
			? 'ruin'
			: salvageRatio < 0.75
				? 'damaged'
				: 'intact';

	return {
		currentStructuralIntegrity,
		maximumStructuralIntegrity,
		salvageable: currentStructuralIntegrity > 0,
		salvageRatio,
		condition,
		notes: [
			'Safely demolishing a structure for salvage is treated as an incremental Construction action.',
			...(currentStructuralIntegrity > 0
				? ['Higher remaining structural integrity indicates more recoverable raw material.']
				: ['A collapsed structure may leave debris, but no intact structural integrity remains to salvage.']),
		],
	};
}

export function getBuildingOccupancyResolution(
	building: Pick<BuildingRecord, 'livingSpace' | 'floorSpaceSquareMeters' | 'shelter' | 'baselineShelter' | 'structuralIntegrity' | 'currentStructuralIntegrity'>,
	currentOccupants: number,
	rigorousPublicHealth = false,
): BuildingOccupancyResolution {
	const comfortableOccupants = Math.max(0, getLivingSpace(building));
	const overcrowdingPercent = comfortableOccupants <= 0
		? (currentOccupants > 0 ? Number.POSITIVE_INFINITY : 0)
		: ((Math.max(0, currentOccupants) - comfortableOccupants) / comfortableOccupants) * 100;
	const shelterCap = getMaximumShelterForIntegrity(building);
	let shelterModifier = 0;
	let restFailureChance = 0;
	const notes: string[] = [];

	if (comfortableOccupants > 0 && currentOccupants > comfortableOccupants && currentOccupants <= comfortableOccupants * 1.5) {
		restFailureChance = 10;
		notes.push('Up to 50% overcrowding gives each rest period a 10% chance of no benefit.');
	}

	if (comfortableOccupants > 0 && currentOccupants > comfortableOccupants * 1.5 && currentOccupants <= comfortableOccupants * 2) {
		shelterModifier = -1;
		notes.push('Occupancy above 150% reduces shelter by one level.');
	}

	if (comfortableOccupants > 0 && currentOccupants > comfortableOccupants * 2 && currentOccupants <= comfortableOccupants * 4) {
		shelterModifier = -2;
		notes.push('Occupancy above 200% reduces shelter by two levels.');
	}

	if (comfortableOccupants > 0 && currentOccupants > comfortableOccupants * 4) {
		shelterModifier = -3;
		notes.push('Extreme overcrowding drops shelter to none.');
	}

	if (rigorousPublicHealth && shelterModifier < 0) {
		shelterModifier += 1;
		notes.push('Rigorous public health discipline mitigates one level of overcrowding penalty.');
	}

	const baseShelter = clampShelterGrade(getBaselineShelter(building), shelterCap);
	const effectiveShelter = SHELTER_ORDER[Math.max(0, SHELTER_ORDER.indexOf(baseShelter) + shelterModifier)] ?? 'none';

	return {
		currentOccupants,
		comfortableOccupants,
		overcrowdingPercent,
		restFailureChance,
		shelterModifier,
		effectiveShelter,
		notes,
	};
}

export function getBuildingStabilityResolution(
	building: Pick<BuildingRecord, 'structuralIntegrity' | 'currentStructuralIntegrity'>,
	loadClass: StructuralLoadClass,
): StructuralStabilityResolution {
	const integrityRatio = getStructuralIntegrityRatio(building);
	let partialCollapseChance = 0;
	const notes: string[] = [];

	if (integrityRatio <= 0) {
		partialCollapseChance = 100;
		notes.push('The structure has already collapsed.');
	} else if (integrityRatio <= 0.25) {
		if (loadClass === 'designLimit') {
			partialCollapseChance = 50;
		} else if (loadClass === 'significant') {
			partialCollapseChance = 25;
		}
	} else if (integrityRatio <= 0.5 && loadClass === 'designLimit') {
		partialCollapseChance = 25;
	}

	if (partialCollapseChance > 0) {
		notes.push('Damage has reduced stability enough to risk partial collapse under load.');
	}

	return {
		loadClass,
		partialCollapseChance,
		loadBearingStable: partialCollapseChance === 0,
		notes,
	};
}

export function getShelterRestorationPlan(
	building: Pick<BuildingRecord, 'livingSpace' | 'floorSpaceSquareMeters'>,
): ShelterRestorationPlan {
	return {
		periodHours: 4,
		targetTotal: Math.max(1, getLivingSpace(building)),
		supplyRequirementUnits: 1,
		supplyClass: 'light',
		notes: ['Restoring one lost shelter level is a supply-dependent incremental Construction task.'],
	};
}

export function applyDesignToolingToPlan(
	plan: BuildingDesignPlan | BridgeDesignPlan,
	options: ConstructionToolingOptions = {},
): TimeAdjustedPlan<BuildingDesignPlan | BridgeDesignPlan> {
	const divisorApplied = getDesignTimeDivisor(options);
	const adjustedPlan = {
		...plan,
		designDays: divideAndRoundUp(plan.designDays, divisorApplied),
		notes: [
			...plan.notes,
			...(divisorApplied > 1 ? [`Design time reduced by a divisor of ${divisorApplied} from available survey/design tools.`] : []),
		],
	};

	return {
		basePlan: plan,
		adjustedPlan,
		divisorApplied,
		notes: adjustedPlan.notes,
	};
}

export function applyExecutionToolingToPlan(
	plan: BuildingExecutionPlan | BridgeExecutionPlan,
	options: ConstructionToolingOptions = {},
): TimeAdjustedPlan<BuildingExecutionPlan | BridgeExecutionPlan> {
	const divisorApplied = getExecutionTimeDivisor(options);
	const adjustedPlan = {
		...plan,
		effectivePeriodDays: divideAndRoundUp(plan.effectivePeriodDays, divisorApplied),
		notes: [
			...plan.notes,
			...(divisorApplied > 1 ? [`Execution time reduced by a divisor of ${divisorApplied} from available power tools or heavy equipment.`] : []),
		],
		};

	return {
		basePlan: plan,
		adjustedPlan,
		divisorApplied,
		notes: adjustedPlan.notes,
	};
}

export function createFieldExpedientConstructionPlan<TPlan extends BuildingExecutionPlan | BridgeExecutionPlan>(
	plan: TPlan,
): FieldExpedientConstructionPlan<TPlan> {
	const adjustedPlan = {
		...plan,
		effectivePeriodDays: divideAndRoundUp(plan.effectivePeriodDays, 5),
		notes: [
			...plan.notes,
			'Field-expedient construction divides required times by 5 but sacrifices permanence and safety.',
		],
	};

	return {
		basePlan: plan,
		adjustedPlan: adjustedPlan as TPlan,
		timeDivisorApplied: 5,
		monthlyStructuralIntegrityLossChancePercent: 10,
		monthlyStructuralIntegrityLossPercent: 25,
		notes: [
			...adjustedPlan.notes,
			'The finished structure has a 10% monthly chance of losing 25% of its original SI.',
		],
	};
}

export function resolveFieldExpedientDecay(
	building: Pick<BuildingRecord, 'structuralIntegrity' | 'currentStructuralIntegrity'>,
	decayTriggered: boolean,
): FieldExpedientDecayResolution {
	const structuralIntegrityLost = decayTriggered
		? Math.max(1, Math.ceil(Math.max(0, building.structuralIntegrity) * 0.25))
		: 0;
	const remainingStructuralIntegrity = Math.max(0, getCurrentStructuralIntegrity(building) - structuralIntegrityLost);

	return {
		monthlyCheckChancePercent: 10,
		structuralIntegrityLost,
		remainingStructuralIntegrity,
		notes: decayTriggered
			? ['The field-expedient structure loses 25% of its original SI this month.']
			: ['The field-expedient structure avoids monthly decay this month.'],
	};
}

export function getStructuralRepairPlan(
	building: Pick<BuildingRecord, 'armor' | 'dominantMaterialClass'>,
): StructuralRepairPlan {
	const supplyClass = getMaterialClass(building) === 'industrial' ? 'industrial' : 'heavy';

	return {
		periodHours: 8,
		targetTotal: Math.max(1, Math.ceil(building.armor)),
		supplyRequirementUnits: 1,
		supplyClass,
		restoredStructuralIntegrity: 1,
		notes: ['Restoring one lost SI is a supply-dependent incremental Construction task.'],
	};
}

export function resolveBuildingSalvageAttempt(
	building: Pick<BuildingRecord, 'dominantMaterialClass' | 'armor'>,
	marginOfSuccess: number,
): SalvageAttemptResolution {
	return {
		hoursRequired: 1,
		recoveredUnits: marginOfSuccess > 0 ? Math.floor(marginOfSuccess / 2) : 0,
		materialClass: getMaterialClass(building),
		notes: ['Success recovers building materials equal to half the margin of success.'],
	};
}

export function getResidentialBuildingDesignPlan(livingSpace: number): BuildingDesignPlan {
	return {
		designDays: Math.max(1, livingSpace * 10),
		governingAttribute: 'EDU',
		targetNumber: 1,
		notes: ['Residential building design time is Living Space x 10 days.'],
	};
}

export function getResidentialBuildingExecutionPlan(
	livingSpace: number,
	designerMarginOfSuccess: number,
	workers: number,
	completeShelter = true,
): BuildingExecutionPlan {
	const safeLivingSpace = Math.max(1, livingSpace);
	const safeDesignerMargin = Math.max(1, designerMarginOfSuccess);
	const safeWorkers = Math.max(1, workers);
	const periodManDays = completeShelter ? 60 : 20;

	return {
		periodManDays,
		effectivePeriodDays: Math.max(1, Math.ceil(periodManDays / safeWorkers)),
		workers: safeWorkers,
		governingAttribute: 'COG',
		targetNumber: 3,
		targetTotal: Math.max(1, Math.ceil((safeLivingSpace * 5) / safeDesignerMargin)),
		supplyRequirementUnitsPerCheck: 1,
		minimumHeavyOrIndustrialUnitsPerCheck: 0.5,
		notes: [
			'Execution is an incremental supply-dependent Construction task.',
			'At least half of all building materials used must be heavy or industrial as appropriate to the intended Armor.',
			...(completeShelter ? [] : ['Adequate-shelter-only construction reduces the base period to 20 man-days.']),
		],
	};
}

export function getNonResidentialBuildingDesignPlan(floorSpaceSquareMeters: number): BuildingDesignPlan {
	return {
		designDays: Math.max(1, Math.ceil(Math.max(0, floorSpaceSquareMeters) / 2)),
		governingAttribute: 'EDU',
		targetNumber: 1,
		notes: ['Non-residential building design time is half the planned floorspace in square meters.'],
	};
}

export function getNonResidentialBuildingExecutionPlan(
	floorSpaceSquareMeters: number,
	designerMarginOfSuccess: number,
	workers: number,
): BuildingExecutionPlan {
	const safeFloorSpace = Math.max(1, floorSpaceSquareMeters);
	const safeDesignerMargin = Math.max(1, designerMarginOfSuccess);
	const safeWorkers = Math.max(1, workers);
	const periodManDays = 60;

	return {
		periodManDays,
		effectivePeriodDays: Math.max(1, Math.ceil(periodManDays / safeWorkers)),
		workers: safeWorkers,
		governingAttribute: 'COG',
		targetNumber: 3,
		targetTotal: Math.max(1, Math.ceil(safeFloorSpace / (5 * safeDesignerMargin))),
		supplyRequirementUnitsPerCheck: 1,
		minimumHeavyOrIndustrialUnitsPerCheck: 0.5,
		notes: [
			'Non-residential execution uses floorspace rather than living space to determine target total.',
			'At least half of all building materials used must be heavy or industrial as appropriate to the intended Armor.',
		],
	};
}

export function getBridgeDeckArea(widthMeters: number, lengthMeters: number): number {
	return Math.max(0, widthMeters) * Math.max(0, lengthMeters);
}

export function getBridgeDesignPlan(
	widthMeters: number,
	lengthMeters: number,
	maximumLoadTons: number,
): BridgeDesignPlan {
	const deckAreaSquareMeters = getBridgeDeckArea(widthMeters, lengthMeters);

	return {
		designDays: Math.max(1, Math.ceil(Math.max(0, maximumLoadTons) + (deckAreaSquareMeters / 2))),
		deckAreaSquareMeters,
		governingAttribute: 'EDU',
		targetNumber: 2,
		notes: ['Bridge design time is maximum load plus half the bridge deck area.'],
	};
}

export function getBridgeExecutionPlan(
	widthMeters: number,
	lengthMeters: number,
	maximumLoadTons: number,
	designerMarginOfSuccess: number,
	workers: number,
	footbridge = false,
): BridgeExecutionPlan {
	const deckAreaSquareMeters = getBridgeDeckArea(widthMeters, lengthMeters);
	const safeDesignerMargin = Math.max(1, designerMarginOfSuccess);
	const safeWorkers = Math.max(1, workers);
	const periodManDays = Math.max(1, maximumLoadTons);

	return {
		periodManDays,
		effectivePeriodDays: Math.max(1, Math.ceil(periodManDays / safeWorkers)),
		workers: safeWorkers,
		governingAttribute: 'COG',
		targetNumber: 4,
		targetTotal: Math.max(1, Math.ceil(deckAreaSquareMeters / safeDesignerMargin)),
		supplyRequirementUnitsPerCheck: Math.max(1, Math.ceil(Math.max(0, maximumLoadTons) / 10)),
		supplyClass: footbridge ? 'heavy' : 'industrial',
		notes: [
			'Bridge execution uses maximum load in man-days as the base period.',
			...(footbridge
				? ['Pedestrian or animal bridges use heavy rather than industrial building materials.']
				: ['Vehicular bridges require industrial building materials.']),
		],
	};
}

export function resolveDemolitionChargePlacement(
	structureArmor: number,
	margin: number,
): DemolitionChargePlacementResolution {
	if (margin < 0) {
		return {
			margin,
			effectiveArmorAgainstCharge: structureArmor * 2,
			armorMultiplier: 2,
			placementQuality: 'wasted',
			notes: ['Failed charge placement wastes force; the structure doubles Armor against that charge.'],
		};
	}

	const divisor = Math.max(1, margin / 2);

	return {
		margin,
		effectiveArmorAgainstCharge: structureArmor / divisor,
		armorMultiplier: 1 / divisor,
		placementQuality: 'effective',
		notes: ['Successful charge placement divides the structure\'s Armor against that charge by half the margin of success, minimum divisor 1.'],
	};
}

export function resolveDemolitionChargeAgainstStructure(
	building: BuildingRecord,
	rawChargeDamage: number,
	placementMargin: number,
): { building: BuildingRecord; resolution: DemolitionChargeResolution } {
	const placement = resolveDemolitionChargePlacement(building.armor, placementMargin);
	const postArmorDamage = Math.max(0, rawChargeDamage - placement.effectiveArmorAgainstCharge);
	const damageResult = applyStructuralDamage(building, postArmorDamage, true);

	return {
		building: damageResult.building,
		resolution: {
			rawChargeDamage,
			effectiveArmorAgainstCharge: placement.effectiveArmorAgainstCharge,
			postArmorDamage,
			structuralIntegrityLost: damageResult.resolution.appliedDamage,
			remainingStructuralIntegrity: damageResult.resolution.remainingStructuralIntegrity,
			collapsed: damageResult.resolution.collapsed,
			notes: [
				...placement.notes,
				`Charge damage after structural armor is ${postArmorDamage}.`,
				...damageResult.resolution.notes,
			],
		},
	};
}

export function resolveDemolitionChargesAgainstStructure(
	building: BuildingRecord,
	charges: ReadonlyArray<{ rawChargeDamage: number; placementMargin: number }>,
): { building: BuildingRecord; resolutions: DemolitionChargeResolution[] } {
	let currentBuilding = building;
	const resolutions: DemolitionChargeResolution[] = [];

	for (const charge of charges) {
		const result = resolveDemolitionChargeAgainstStructure(currentBuilding, charge.rawChargeDamage, charge.placementMargin);
		currentBuilding = result.building;
		resolutions.push(result.resolution);
	}

	return {
		building: currentBuilding,
		resolutions,
	};
}

export function getConstructionProjectProfile(
	projectType: ConstructionProjectType,
	mechanized = false,
): ConstructionProjectProfile {
	if (projectType === 'assessment') {
		return {
			projectType,
			actionType: 'simple',
			governingAttribute: 'AWA',
			mechanized: false,
			requiresPlans: false,
			usesExplosives: false,
			notes: [
				'Assessing a structure\'s condition, shelter value, salvage potential, or cover value is a simple Construction action.',
			],
		};
	}

	if (projectType === 'demolitionCharge') {
		return {
			projectType,
			actionType: 'simple',
			governingAttribute: 'COG',
			mechanized: false,
			requiresPlans: false,
			usesExplosives: true,
			notes: [
				'Rigging charges to demolish a specific structure is a simple Construction action using explosives training.',
			],
		};
	}

	const requiresPlans = projectType === 'plannedStructure';
	const notes = projectType === 'salvageDemolition'
		? ['Safely demolishing a structure to salvage raw materials is an incremental Construction action.']
		: projectType === 'improvisedStructure'
			? ['Improvising a temporary structure is an incremental Construction action.']
			: ['Building a structure from plans is an incremental Construction action.'];

	return {
		projectType,
		actionType: 'incremental',
		governingAttribute: mechanized ? 'CDN' : 'MUS',
		mechanized,
		requiresPlans,
		usesExplosives: false,
		notes,
	};
	}