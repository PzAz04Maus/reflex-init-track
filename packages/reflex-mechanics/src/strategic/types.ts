import type { CharacterData, HitLocation, InjurySeverity, TacticalMovementRate } from '../types';

export const SURVIVAL_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.168-178';
export const SURVIVAL_NECESSITIES_SOURCE = 'Twilight 2013 Core OEF PDF pp.168-173';
export const SURVIVAL_DISEASE_SOURCE = 'Twilight 2013 Core OEF PDF pp.175-178';
export const SURVIVAL_POISON_SOURCE = 'Twilight 2013 Core OEF PDF pp.179-182';
export const SURVIVAL_MAINTENANCE_SOURCE = 'Twilight 2013 Core OEF PDF pp.186-187';
export const STRUCTURAL_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.192-195';
export const RESUPPLY_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.188-191';
export const NATURAL_WORLD_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.196-200';

export type StrategicAttributeKey = 'cognition' | 'coordination' | 'fitness' | 'muscle';

export type ClimateBand = 'temperate' | 'tropical' | 'dry' | 'polar';

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';

export type AmbientTemperature = 'normal' | 'cold' | 'extremelyCold' | 'hot' | 'extremelyHot';

export type FoodAcquisitionMethod =
	| 'foraging'
	| 'huntingSmallGame'
	| 'huntingLargeGame'
	| 'huntingVeryLargeGame'
	| 'trapping'
	| 'fishing'
	| 'grenadeFishing'
	| 'agriculture'
	| 'looting';

export type ActivityLevel = 'sleep' | 'inactivity' | 'lightWork' | 'heavyWork';

export type FatigueLevel = 'rested' | 'slight' | 'moderate' | 'serious' | 'critical';

export type ShelterGrade = 'none' | 'minimal' | 'adequate' | 'complete';

export type TerrainType = 'wilderness' | 'urban';

export type WaterTreatmentMethod = 'boiling' | 'filtration' | 'fieldPurification' | 'industrialPurification';

export type WaterSearchCondition = 'normal' | 'mildDrought' | 'dry' | 'extremelyArid';

export type FarmTechBase =
	| 'handToolsManualLabor'
	| 'handToolsDraftAnimals'
	| 'nonPoweredMachinery'
	| 'poweredMachinery'
	| 'industrialMachinery';

export type AgricultureCondition =
	| 'optimalWeather'
	| 'windstorm'
	| 'mildDrought'
	| 'mildFlooding'
	| 'hailstorm'
	| 'severeDrought'
	| 'severeFlooding'
	| 'hurricane'
	| 'locustPlague';

export type MedicalSkillTier = 'untrained' | 'novice' | 'competent' | 'professional' | 'expert' | 'master' | 'legendary';

export type InjuryCauseType = 'normal' | 'fireOrAcid' | 'animal' | 'bluntNoSkinBreak';

export type DiseaseExposureVector = 'humanContact' | 'animalContact' | 'contaminatedWater';

export type DiseaseId =
	| 'bubonicPlague'
	| 'cholera'
	| 'dysentery'
	| 'foodPoisoning'
	| 'hepatitisA'
	| 'influenza'
	| 'minorIllness'
	| 'pneumonia'
	| 'pneumonicPlague'
	| 'rabies'
	| 'typhoidFever'
	| 'typhus';

export type PoisonId =
	| 'atropine'
	| 'blisterAgent'
	| 'nerveAgent'
	| 'pepperSpray'
	| 'pulmonaryAgent'
	| 'cobraVenom'
	| 'viperVenom'
	| 'tearGas'
	| 'vomitGas';

export type PoisonExposureMode = 'injected' | 'aerosol' | 'surface' | 'inhaled' | 'eyeContact' | 'skinAbsorption';

export type MaintenanceSkillMode = 'useSkill' | 'ATS';

export type DevicePartClass = 'mechanical' | 'electronic';

export type BuildingMaterial =
	| 'advancedCeramicCompositeArmor'
	| 'steelArmorPlate'
	| 'sheetSteel'
	| 'reinforcedConcrete'
	| 'concreteBrick'
	| 'stonePackedDirtWoodLiquid'
	| 'fiberglass'
	| 'looseDirt';

export type TypicalBuildingCover =
	| 'hastyEarthenWall'
	| 'sandbag'
	| 'woodenPlank'
	| 'sheetrockInteriorWall'
	| 'plywoodInteriorDoor'
	| 'woodExteriorDoor'
	| 'brickWall'
	| 'steelSecurityDoor'
	| 'timberWall'
	| 'stoneWall'
	| 'cinderBlockWall'
	| 'reinforcedConcreteWall'
	| 'heavyStoneWall';

export type ConstructionActionType = 'simple' | 'incremental';

export type ConstructionGoverningAttribute = 'AWA' | 'COG' | 'MUS' | 'CDN';

export type ConstructionProjectType =
	| 'assessment'
	| 'plannedStructure'
	| 'improvisedStructure'
	| 'salvageDemolition'
	| 'demolitionCharge';

export type BuildingMaterialClass = 'light' | 'heavy' | 'industrial';

export type EquipmentUseLevel = 'negligible' | 'light' | 'moderate' | 'heavy' | 'severe';

export type MaintainedItemClass = 'mechanical' | 'electronic' | 'vehicle' | 'firearm';

export type ScroungingEnvironment = 'urban' | 'rural' | 'wilderness';

export type AmmoReplacementComponent = 'powder' | 'blackPowder' | 'primer' | 'bullet' | 'casing';

export type FuelContainerSealing = 'open' | 'closed';

export type WeatherComplicationType = 'water' | 'particulates' | 'salt';

export type AnimalStockType = 'cow' | 'donkey' | 'goat' | 'horse' | 'pig' | 'sheep';

export type MeatPreservationMethod = 'salting' | 'smoking';

export type TrainingSkillTier = 'unskilled' | 'novice' | 'competent' | 'professional' | 'expert';

export type LearningExperienceSource = 'extraordinarySuccess' | 'catastrophicFailure' | 'assistance' | 'roleplaying';

export type StructuralLoadClass = 'light' | 'significant' | 'designLimit';

export type CommunityId = string;

export type BuildingSupplyPool = 'light' | 'heavy' | 'industrial';

export type CommunityProjectKind = 'residentialBuilding' | 'nonResidentialBuilding' | 'bridge' | 'repair' | 'fortification';

export type SampleStructureId =
	| 'farmCottage'
	| 'house1Bedroom'
	| 'house2Bedrooms'
	| 'house3Bedrooms'
	| 'house4Bedrooms'
	| 'mansion'
	| 'apartmentBlock3Story'
	| 'apartmentLowRise6Story'
	| 'smallBusiness'
	| 'largeBusiness'
	| 'retailOutlet'
	| 'warehouse'
	| 'lightFactory'
	| 'heavyFactory'
	| 'superheavyFactory'
	| 'pedestrianFootbridge'
	| 'ruralRoadBridgeWood'
	| 'ruralRoadBridgeStone'
	| 'highwayBridgeFourLane'
	| 'railroadBridge'
	| 'temporaryPontoonBridge'
	| 'bunkerFightingPosition'
	| 'bunkerHousing'
	| 'bunkerCommandPost'
	| 'hardenedAircraftShelter';

export type StructuralTargetClass = 'character' | 'passengerVehicle' | 'vehicleOrStructure';

export type StructuralProtectionClass = 'bodyArmor' | 'protectiveGear' | 'vehicleOrStructure';

export interface BuildingMaterialArmorProfile {
	mmPerArmor: number;
	multiplier: number;
}

export interface VehicleOrStructureCoverOptions {
	armor: number;
	attackPassesThroughVehicle?: boolean;
	usingEngineBlock?: boolean;
}

export interface DailyFoodRequirementContext {
	heavyWorkHours?: number;
	temperature?: AmbientTemperature;
}

export interface DailyWaterRequirementContext {
	heavyWorkHours?: number;
	temperature?: AmbientTemperature;
	diseaseMultiplier?: number;
	extraLiters?: number;
}

export interface FoodSearchContext {
	climate?: ClimateBand;
	season?: Season;
}

export interface ShelterEffects {
	healingFactorModifier: number;
	diseaseResistanceModifier: number;
	fourHourRestFailureChance: number;
}

export interface WaterTreatmentProfile {
	blocksBiologicalContamination: boolean;
	reducesChemicalContamination: boolean;
	blocksChemicalContamination: boolean;
}

export interface WildFoodYield {
	meals: number;
	ammunitionSpent: number | null;
	areaPenaltyApplied?: number;
	predatorEncounter: boolean;
	notes: string[];
}

export interface StarvationResult {
	fatigueStagesAdded: number;
	attributeLoss: number;
	currentAttributes: Pick<CharacterData, StrategicAttributeKey>;
	permanentLossCheckAttributes: StrategicAttributeKey[];
	died: boolean;
}

export interface ShelterSearchResult {
	grade: ShelterGrade | null;
	skill: 'Fieldcraft' | 'Streetcraft' | 'Construction';
	timeHours: number;
}

export interface FatigueEffects {
	taskPenalty: number;
	infectionResistancePenalty: number;
	virtualHeadInjury: 'none' | 'slight' | 'moderate';
	canSprint: boolean;
	canRun: boolean;
	canTrot: boolean;
	requiresResolveToStayAwake: boolean;
}

export interface StimulantDoseResolution {
	effectiveFatigueLevel: FatigueLevel;
	durationModifierHours: number;
	extraHeavyWorkHours: number;
	cardiacInstabilityRisk: number;
}

export interface HealingFactorContext {
	fitness: number;
	shelter: ShelterGrade;
	starving?: boolean;
	dehydrated?: boolean;
	chronicallyFatigued?: boolean;
	infectedWound?: boolean;
	diseaseModifier?: number;
	extendedCareSkillTier?: MedicalSkillTier;
	extendedCareSuppliesAvailable?: boolean;
}

export interface HealingFactorBreakdown {
	total: number;
	canHeal: boolean;
	baseFromFitness: number;
	shelterModifier: number;
	conditionModifiers: number;
	extendedCareModifier: number;
	diseaseModifier: number;
	infectedWound: boolean;
}

export interface MedicalProcedurePenaltyBreakdown {
	total: number;
	bySeverity: number[];
}

export interface WoundInfectionChanceContext {
	causeType?: InjuryCauseType;
	firstAidMargin?: number;
	usedAntibiotics?: boolean;
	usedFirstAidSupplies?: boolean;
}

export interface TraumaSurgerySupplyCost {
	hours: number;
	wholeBlood: number;
	surgicalSupplies: number;
	localAnesthesia: number;
	totalAnesthesia: number;
	antibiotic: number;
}

export interface DiseaseTreatmentOption {
	description: string;
	bonus: string;
}

export interface DiseaseDefinition {
	id: DiseaseId;
	name: string;
	vectors: string[];
	contagionModifier: string;
	symptomsAndEffects: string;
	fatigueFloor?: FatigueLevel;
	additionalWaterRequirementLiters?: number;
	diagnosisModifier: string;
	misdiagnosis: string;
	treatments: DiseaseTreatmentOption[];
	recoveryTiming: string;
	recoveryCheckModifier: string;
	recoveryOutcome: string;
	failureOutcome: string;
	source: string;
}

export interface DiseaseExposureResult {
	exposed: boolean;
	diseaseId: DiseaseId | null;
}

export interface PoisonTreatmentOption {
	description: string;
	bonus: string;
}

export interface PoisonDefinition {
	id: PoisonId;
	name: string;
	vectors: string[];
	symptomsAndEffects: string;
	diagnosisModifier: string;
	misdiagnosis?: string;
	treatments: PoisonTreatmentOption[];
	recoveryTiming: string;
	recoveryCheckModifier: string;
	recoveryOutcome: string;
	failureOutcome: string;
	source: string;
}

export interface PoisonEffectResolution {
	poisonId: PoisonId;
	headInjury?: InjurySeverity;
	torsoInjury?: InjurySeverity;
	affectedLocation?: HitLocation;
	affectedLocationInjury?: InjurySeverity;
	virtualHeadInjury?: InjurySeverity;
	movementCap?: TacticalMovementRate | null;
	fatigueStagesAdded?: number;
	visionPenalty?: number;
	concentrationPenalty?: number;
	beginsSuffocating?: boolean;
	unstable?: boolean;
	unconscious?: boolean;
	dead?: boolean;
	notes: string[];
}

export interface MaintenanceProfile {
	maintenance: number;
	wear: number;
	disabled?: boolean;
	partClass?: DevicePartClass;
}

export interface PreventiveMaintenanceContext {
	itemClass: MaintainedItemClass;
	protectedFromElements?: boolean;
	excessiveHumidity?: boolean;
	dustOrSand?: boolean;
	corrosionExposure?: boolean;
	electronicsRuntimeHoursPerWeek?: number;
	vehicleRoadKilometers?: number;
	vehicleOffRoadKilometers?: number;
	firearmRoundsFired?: number;
}

export interface UseLevelResolution {
	useLevel: EquipmentUseLevel;
	periodLabel: '1 year' | '3 months' | '1 month' | '1 week' | '1 day';
	notes: string[];
}

export interface WearAccrualResolution {
	priorWear: number;
	newWear: number;
	wearGained: number;
	breakCheckRequired: boolean;
	willBreakOnNextUse: boolean;
	notes: string[];
}

export interface WearPenaltyBreakdown {
	maintenancePenalty: number;
	precisionPenalty: number;
	barterValueDivisor: number;
	notes: string[];
}

export interface SupplyDependentActionResolution {
	requiredSupplyUnits: number;
	availableSupplyUnits: number;
	shortfallUnits: number;
	penalty: number;
	canAttempt: boolean;
	notes: string[];
}

export interface GeneralScroungingResolution {
	timeHours: number;
	itemsOfInterestFound: number;
	detailedStripPossible: boolean;
	notes: string[];
}

export interface TargetedSearchResolution {
	timeHours: number;
	foundTarget: boolean;
	extraItemsOfInterest: number;
	notes: string[];
}

export interface BrassRecoveryResolution {
	minutesRequired: number;
	casingsRecovered: number;
	recoveryPercent: number;
	notes: string[];
}

export interface AmmunitionAssemblyResolution {
	hoursRequired: number;
	roundsProduced: number;
	spoiledMaterialsRounds: number;
	notes: string[];
}

export interface ReplacementAmmoRiskProfile {
	replacementComponents: AmmoReplacementComponent[];
	failureChancePercent: number;
	damageModifierPercent: number;
	notes: string[];
}

export interface FuelContaminationResolution {
	monthsStored: number;
	contaminationChancePercent: number;
	contaminated: boolean;
	notes: string[];
}

export interface FuelPurificationResolution {
	minutesRequired: number;
	usableLitersRecovered: number;
	wastedLiters: number;
	notes: string[];
}

export interface AlcoholFuelProductionPlan {
	outputLiters: number;
	organicMatterKgRequired: number;
	waterLitersRequired: number;
	mashKgProduced: number;
	durationDays: 3;
	notes: string[];
}

export interface BiodieselProductionPlan {
	outputLiters: number;
	vegetableOilKgRequired: number;
	alcoholLitersRequired: number;
	productionChemicalUnitsRequired: number;
	lightWorkHoursRequired: number;
	notes: string[];
}

export interface WeatherForecastResolution {
	forecastDays: number;
	method: 'fieldcraft' | 'education';
	notes: string[];
}

export interface WeatherComplicationResolution {
	type: WeatherComplicationType;
	penalty: number;
	maintenanceUseLevelIncrease: boolean;
	notes: string[];
}

export interface AnimalDressingResolution {
	usableMeatKg: number;
	usableHidePercent: number;
	percentageRecovered: number;
	notes: string[];
}

export interface MeatPreservationResolution {
	hoursRequired: number;
	durationDays: number;
	preservedMonths: number;
	saltKgRequired: number;
	requiresFirewood: boolean;
	notes: string[];
}

export interface PastureRequirementResolution {
	animal: AnimalStockType;
	headCount: number;
	hectaresRequired: number;
	notes: string[];
}

export interface LearningExperienceResolution {
	source: LearningExperienceSource;
	qualifies: boolean;
	notes: string[];
}

export interface DowntimeLearningResolution {
	rollsMade: number;
	skillPointsGained: number;
	notes: string[];
}

export interface SkillTrainingPlan {
	instructionHours: number;
	maxStudents: number;
	instructorPenalty: number;
	notes: string[];
}

export interface SkillTrainingResolution {
	instructorSucceeded: boolean;
	studentSucceeded: boolean;
	skillPointGained: boolean;
	notes: string[];
}

export interface BookLearningResolution {
	studyHoursRequired: number;
	canLearn: boolean;
	countsAsLearningExperience: boolean;
	notes: string[];
}

export interface QualificationTrainingPlan {
	targetTotal: number;
	periodHours: number;
	maxStudents: number;
	instructorPenalty: number;
	notes: string[];
}

export interface QualificationTrainingResolution {
	qualificationLearned: boolean;
	notes: string[];
}

export interface CombatAttributeImprovementResolution {
	improvementPointsGained: number;
	canIncreaseAttribute: boolean;
	remainingImprovementPoints: number;
	notes: string[];
}

export interface PreventiveMaintenanceResolution {
	hoursRequired: number;
	skillMode: MaintenanceSkillMode;
	targetNumber: number;
	automaticSuccessWithSupplies: boolean;
	preventsWearAccrual: boolean;
	notes: string[];
}

export interface ReconditioningResolution {
	hoursRequired: number;
	partsRequired: number;
	targetNumber: number;
	wearPenalty: number;
	resultingWearOnSuccess: number;
	resultingWearOnBadFailure: number;
	automaticSuccess: boolean;
	notes: string[];
}

export interface CannibalizationResolution {
	hoursRequired: number;
	targetNumber: number;
	partsYield: number;
	maxPartsYield: number;
	destroyed: boolean;
	canAttemptAgain: boolean;
	notes: string[];
}

export interface RepairResolution {
	hoursRequired: number;
	partsRequired: number;
	targetNumber: number;
	wearPenalty: number;
	repaired: boolean;
	destroyed: boolean;
	notes: string[];
}

export interface BuildingAssessment {
	actionType: 'simple';
	governingAttribute: 'AWA';
	coverArmor: number;
	loadBearingStable: boolean;
	suitableAsShelter: boolean;
	salvageable: boolean;
	currentStructuralIntegrity: number;
	maximumStructuralIntegrity: number;
	notes: string[];
}

export interface ConstructionProjectProfile {
	projectType: ConstructionProjectType;
	actionType: ConstructionActionType;
	governingAttribute: ConstructionGoverningAttribute;
	mechanized: boolean;
	requiresPlans: boolean;
	usesExplosives: boolean;
	notes: string[];
}

export interface BuildingOccupancyResolution {
	currentOccupants: number;
	comfortableOccupants: number;
	overcrowdingPercent: number;
	restFailureChance: number;
	shelterModifier: number;
	effectiveShelter: ShelterGrade;
	notes: string[];
}

export interface StructuralStabilityResolution {
	loadClass: StructuralLoadClass;
	partialCollapseChance: number;
	loadBearingStable: boolean;
	notes: string[];
}

export interface ShelterRestorationPlan {
	periodHours: number;
	targetTotal: number;
	supplyRequirementUnits: number;
	supplyClass: 'light';
	notes: string[];
}

export interface StructuralRepairPlan {
	periodHours: number;
	targetTotal: number;
	supplyRequirementUnits: number;
	supplyClass: 'heavy' | 'industrial';
	restoredStructuralIntegrity: number;
	notes: string[];
}

export interface SalvageAttemptResolution {
	hoursRequired: number;
	recoveredUnits: number;
	materialClass: BuildingMaterialClass;
	notes: string[];
}

export interface BuildingDesignPlan {
	designDays: number;
	governingAttribute: 'EDU';
	targetNumber: number;
	notes: string[];
}

export interface BuildingExecutionPlan {
	periodManDays: number;
	effectivePeriodDays: number;
	workers: number;
	governingAttribute: 'COG';
	targetNumber: number;
	targetTotal: number;
	supplyRequirementUnitsPerCheck: number;
	minimumHeavyOrIndustrialUnitsPerCheck: number;
	notes: string[];
}

export interface BridgeDesignPlan {
	designDays: number;
	deckAreaSquareMeters: number;
	governingAttribute: 'EDU';
	targetNumber: number;
	notes: string[];
}

export interface BridgeExecutionPlan {
	periodManDays: number;
	effectivePeriodDays: number;
	workers: number;
	governingAttribute: 'COG';
	targetNumber: number;
	targetTotal: number;
	supplyRequirementUnitsPerCheck: number;
	supplyClass: 'heavy' | 'industrial';
	notes: string[];
}

export interface ConstructionToolingOptions {
	electronicSurveyingTools?: boolean;
	computerDesignSoftware?: boolean;
	powerTools?: boolean;
	heavyEquipment?: boolean;
}

export interface TimeAdjustedPlan<TPlan> {
	basePlan: TPlan;
	adjustedPlan: TPlan;
	divisorApplied: number;
	notes: string[];
}

export interface FieldExpedientConstructionPlan<TPlan> {
	basePlan: TPlan;
	adjustedPlan: TPlan;
	timeDivisorApplied: 5;
	monthlyStructuralIntegrityLossChancePercent: 10;
	monthlyStructuralIntegrityLossPercent: 25;
	notes: string[];
}

export interface FieldExpedientDecayResolution {
	monthlyCheckChancePercent: 10;
	structuralIntegrityLost: number;
	remainingStructuralIntegrity: number;
	notes: string[];
}

export interface DemolitionChargePlacementResolution {
	margin: number;
	effectiveArmorAgainstCharge: number;
	armorMultiplier: number;
	placementQuality: 'effective' | 'wasted';
	notes: string[];
}

export interface DemolitionChargeResolution {
	rawChargeDamage: number;
	effectiveArmorAgainstCharge: number;
	postArmorDamage: number;
	structuralIntegrityLost: number;
	remainingStructuralIntegrity: number;
	collapsed: boolean;
	notes: string[];
}

export interface CommunityResourceStockpile {
	foodDays?: number;
	waterLiters?: number;
	lightBuildingMaterials?: number;
	heavyBuildingMaterials?: number;
	industrialBuildingMaterials?: number;
	fuelUnits?: number;
	medicalSupplyUnits?: number;
	notes?: string[];
}

export interface CommunityConstructionProject {
	id: string;
	kind: CommunityProjectKind;
	name: string;
	buildingId?: string;
	assignedWorkerIds: string[];
	progress: number;
	target: number;
	supplyPool: BuildingSupplyPool;
	supplyUnitsCommitted: number;
	notes?: string[];
}

export interface CommunityRecord {
	id: CommunityId;
	name: string;
	residentIds: string[];
	buildingIds: string[];
	resources: CommunityResourceStockpile;
	projectIds: string[];
	description?: string;
	tags?: string[];
	source?: string;
}

export interface BuildingDamageResolution {
	appliedDamage: number;
	blockedByThreshold: number;
	remainingStructuralIntegrity: number;
	collapsed: boolean;
	stillProvidesShelter: boolean;
	notes: string[];
}

export interface BuildingRepairResolution {
	restoredIntegrity: number;
	newStructuralIntegrity: number;
	fullyRestored: boolean;
	stillDamaged: boolean;
	notes: string[];
}

export interface FortificationProfile {
	cover: TypicalBuildingCover;
	armor: number;
	damageThreshold: number;
	structuralIntegrity: number;
	shelter: ShelterGrade;
	notes: string[];
}

export interface SalvageResolution {
	currentStructuralIntegrity: number;
	maximumStructuralIntegrity: number;
	salvageable: boolean;
	salvageRatio: number;
	condition: 'intact' | 'damaged' | 'ruin' | 'collapsed';
	notes: string[];
}