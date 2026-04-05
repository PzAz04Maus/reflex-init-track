import type { CharacterData } from '../types';

import type {
	AgricultureCondition,
	AmbientTemperature,
	ClimateBand,
	DailyFoodRequirementContext,
	DailyWaterRequirementContext,
	FarmTechBase,
	FoodSearchContext,
	ShelterEffects,
	ShelterGrade,
	ShelterSearchResult,
	StarvationResult,
	StrategicAttributeKey,
	TerrainType,
	WaterSearchCondition,
	WaterTreatmentMethod,
	WaterTreatmentProfile,
	WildFoodYield,
} from './types';

export const FOOD_CLIMATE_MODIFIERS: Record<ClimateBand, number> = {
	temperate: 0,
	tropical: 1,
	dry: -2,
	polar: -3,
};

export const FOOD_SEASON_MODIFIERS: Record<'spring' | 'summer' | 'autumn' | 'winter', number> = {
	spring: -1,
	summer: 0,
	autumn: 1,
	winter: -3,
};

export const WATER_SEARCH_MODIFIERS: Record<WaterSearchCondition, number> = {
	normal: 0,
	mildDrought: -1,
	dry: -4,
	extremelyArid: -10,
};

export const AGRICULTURE_CONDITION_MODIFIERS: Record<AgricultureCondition, number> = {
	optimalWeather: 0,
	windstorm: -1,
	mildDrought: -2,
	mildFlooding: -2,
	hailstorm: -3,
	severeDrought: -3,
	severeFlooding: -3,
	hurricane: -4,
	locustPlague: -5,
};

const STARVATION_ATTRIBUTES: StrategicAttributeKey[] = ['cognition', 'coordination', 'fitness', 'muscle'];

function clampMeals(value: number): number {
	return Math.max(0, Math.floor(value));
}

function cloneStarvationAttributes(data: Pick<CharacterData, StrategicAttributeKey>): Pick<CharacterData, StrategicAttributeKey> {
	return {
		cognition: data.cognition,
		coordination: data.coordination,
		fitness: data.fitness,
		muscle: data.muscle,
	};
}

function getTemperatureFoodModifier(temperature: AmbientTemperature): number {
	if (temperature === 'cold') {
		return 0.25;
	}

	if (temperature === 'extremelyCold') {
		return 0.5;
	}

	return 0;
}

function getTemperatureWaterModifier(temperature: AmbientTemperature): number {
	if (temperature === 'hot') {
		return 1;
	}

	if (temperature === 'extremelyHot') {
		return 2;
	}

	return 0;
}

export function getDailyFoodRequirementDays(context: DailyFoodRequirementContext = {}): number {
	const heavyWorkHours = context.heavyWorkHours ?? 0;
	const temperature = context.temperature ?? 'normal';

	return 1 + (Math.floor(Math.max(0, heavyWorkHours) / 4) * 0.25) + getTemperatureFoodModifier(temperature);
}

export function getDailyWaterRequirementLiters(context: DailyWaterRequirementContext = {}): number {
	const heavyWorkHours = context.heavyWorkHours ?? 0;
	const temperature = context.temperature ?? 'normal';
	const diseaseMultiplier = context.diseaseMultiplier ?? 1;
	const extraLiters = context.extraLiters ?? 0;
	const baseRequirement = 2.5 + (Math.max(0, heavyWorkHours) * 0.5) + getTemperatureWaterModifier(temperature);

	return (baseRequirement * diseaseMultiplier) + extraLiters;
}

export function getFoodSearchModifier(context: FoodSearchContext = {}): number {
	const climate = context.climate ?? 'temperate';
	const season = context.season ?? 'summer';

	return FOOD_CLIMATE_MODIFIERS[climate] + FOOD_SEASON_MODIFIERS[season];
}

export function getDehydrationFatigueStages(daysWithoutRequirement: number, halfRations = false): number {
	const days = Math.max(0, daysWithoutRequirement);
	const stagesPerDay = halfRations ? 1 : 2;

	return days * stagesPerDay;
}

export function getDaysUntilDehydrationDeath(currentFatigueStageIndex: number, halfRations = false): number {
	const remainingStages = Math.max(0, 4 - currentFatigueStageIndex);
	const stagesPerDay = halfRations ? 1 : 2;
	const daysToCritical = Math.ceil(remainingStages / stagesPerDay);

	return daysToCritical + 1;
}

export function applyStarvationToCharacter(
	data: Pick<CharacterData, StrategicAttributeKey>,
	starvationThreshold: number,
	daysWithoutAdequateFood: number,
	onHalfRations = false,
): StarvationResult {
	const safeThreshold = Math.max(1, starvationThreshold);
	const interval = onHalfRations ? safeThreshold * 3 : safeThreshold;
	const attributeLoss = daysWithoutAdequateFood < safeThreshold
		? 0
		: 1 + Math.floor((daysWithoutAdequateFood - safeThreshold) / interval);
	const currentAttributes = cloneStarvationAttributes(data);

	for (const key of STARVATION_ATTRIBUTES) {
		currentAttributes[key] = Math.max(0, currentAttributes[key] - attributeLoss);
	}

	return {
		fatigueStagesAdded: daysWithoutAdequateFood > 0 ? 1 : 0,
		attributeLoss,
		currentAttributes,
		permanentLossCheckAttributes: STARVATION_ATTRIBUTES.filter((key) => currentAttributes[key] <= Math.floor(data[key] / 2)),
		died: STARVATION_ATTRIBUTES.some((key) => currentAttributes[key] === 0),
	};
}

export function getFarmHectaresPerFarmer(fitness: number, techBase: FarmTechBase): number {
	switch (techBase) {
		case 'handToolsManualLabor':
			return fitness;
		case 'handToolsDraftAnimals':
			return fitness * 3;
		case 'nonPoweredMachinery':
			return fitness * 10;
		case 'poweredMachinery':
			return 250;
		case 'industrialMachinery':
			return 1000;
	}
	}

export function getCropYieldMealsPerHectare(failedMonthlyChecks: number, foodCrop = true): number {
	const divisor = Math.max(1, failedMonthlyChecks + 1);
	const usableMaterial = Math.floor(400 / divisor);

	if (foodCrop) {
		return usableMaterial;
	}

	return Math.floor(usableMaterial * 0.25);
}

export function getAgricultureModifier(condition: AgricultureCondition): number {
	return AGRICULTURE_CONDITION_MODIFIERS[condition];
}

export function resolveForaging(marginOfSuccess: number, priorSuccessfulAttemptsThisMonth = 0): WildFoodYield {
	return {
		meals: priorSuccessfulAttemptsThisMonth > 0 ? 0 : clampMeals(marginOfSuccess),
		ammunitionSpent: null,
		predatorEncounter: marginOfSuccess <= -5,
		notes: priorSuccessfulAttemptsThisMonth > 0 ? ['Area already successfully foraged this month.'] : [],
	};
}

export function resolveSmallGameHunt(
	marginOfSuccess: number,
	ammunitionSpent: number,
	priorSuccessfulAttemptsThisMonth = 0,
): WildFoodYield {
	return {
		meals: priorSuccessfulAttemptsThisMonth > 0 ? 0 : clampMeals(marginOfSuccess / 2),
		ammunitionSpent,
		areaPenaltyApplied: priorSuccessfulAttemptsThisMonth,
		predatorEncounter: marginOfSuccess <= -5,
		notes: [],
	};
}

export function resolveLargeGameHunt(
	marginOfSuccess: number,
	ammunitionSpent: number,
	priorSuccessfulAttemptsThisMonth = 0,
): WildFoodYield {
	return {
		meals: priorSuccessfulAttemptsThisMonth > 0 ? 0 : clampMeals(marginOfSuccess * 2),
		ammunitionSpent,
		areaPenaltyApplied: priorSuccessfulAttemptsThisMonth,
		predatorEncounter: marginOfSuccess <= -5,
		notes: [],
	};
}

export function resolveVeryLargeGameHunt(
	marginOfSuccess: number,
	ammunitionSpent: number,
	priorSuccessfulAttemptsThisMonth = 0,
): WildFoodYield {
	return {
		meals: priorSuccessfulAttemptsThisMonth > 0 ? 0 : clampMeals(10 + (marginOfSuccess * 10)),
		ammunitionSpent,
		areaPenaltyApplied: priorSuccessfulAttemptsThisMonth,
		predatorEncounter: marginOfSuccess <= -5,
		notes: [],
	};
}

export function resolveTrapping(marginOfSuccess: number): WildFoodYield {
	return {
		meals: clampMeals(marginOfSuccess / 2),
		ammunitionSpent: null,
		predatorEncounter: marginOfSuccess <= -5,
		notes: ['Trap yield is realized after 24 hours.'],
	};
}

export function resolveFishing(
	marginOfSuccess: number,
	priorSuccessfulAttemptsThisWeek = 0,
	openWaterMultiplier = 1,
): WildFoodYield {
	return {
		meals: clampMeals(marginOfSuccess * Math.max(1, openWaterMultiplier)),
		ammunitionSpent: null,
		areaPenaltyApplied: priorSuccessfulAttemptsThisWeek,
		predatorEncounter: marginOfSuccess <= -5,
		notes: openWaterMultiplier > 1 ? ['Open-water equipment multiplier applied.'] : [],
	};
}

export function resolveGrenadeFishing(grenadeRoll: number, priorAttemptsToday = 0): WildFoodYield {
	return {
		meals: clampMeals(Math.max(0, grenadeRoll - 1 - priorAttemptsToday)),
		ammunitionSpent: null,
		areaPenaltyApplied: priorAttemptsToday,
		predatorEncounter: false,
		notes: ['Each subsequent grenade-fishing attempt in the same body of water suffers a cumulative -1 penalty that bottoms out after the fifth attempt.'],
	};
}

export function getWaterSearchModifier(condition: WaterSearchCondition): number {
	return WATER_SEARCH_MODIFIERS[condition];
}

export function getWaterTreatmentProfile(methods: WaterTreatmentMethod[]): WaterTreatmentProfile {
	const hasBoiling = methods.includes('boiling');
	const hasFiltration = methods.includes('filtration');
	const hasFieldPurification = methods.includes('fieldPurification');
	const hasIndustrialPurification = methods.includes('industrialPurification');

	if (hasIndustrialPurification) {
		return {
			blocksBiologicalContamination: true,
			reducesChemicalContamination: true,
			blocksChemicalContamination: true,
		};
	}

	return {
		blocksBiologicalContamination: hasBoiling || hasFieldPurification || hasFiltration,
		reducesChemicalContamination: hasFiltration,
		blocksChemicalContamination: false,
	};
}

export function getShelterEffects(grade: ShelterGrade): ShelterEffects {
	switch (grade) {
		case 'none':
			return {
				healingFactorModifier: -1,
				diseaseResistanceModifier: -3,
				fourHourRestFailureChance: 0.5,
			};
		case 'minimal':
			return {
				healingFactorModifier: 0,
				diseaseResistanceModifier: -1,
				fourHourRestFailureChance: 0.1,
			};
		case 'adequate':
			return {
				healingFactorModifier: 1,
				diseaseResistanceModifier: 0,
				fourHourRestFailureChance: 0,
			};
		case 'complete':
			return {
				healingFactorModifier: 2,
				diseaseResistanceModifier: 3,
				fourHourRestFailureChance: 0,
			};
	}
	}

export function resolveLocatedShelter(terrain: TerrainType, marginOfSuccess: number): ShelterSearchResult {
	if (terrain === 'wilderness') {
		return {
			grade: marginOfSuccess >= 10 ? 'adequate' : marginOfSuccess >= 0 ? 'minimal' : null,
			skill: 'Fieldcraft',
			timeHours: 1,
		};
	}

	return {
		grade: marginOfSuccess >= 5 ? 'adequate' : marginOfSuccess >= 0 ? 'minimal' : null,
		skill: 'Streetcraft',
		timeHours: 1,
	};
}

export function resolveImprovisedShelter(marginOfSuccess: number): ShelterSearchResult {
	return {
		grade: marginOfSuccess >= 0 ? 'minimal' : null,
		skill: 'Construction',
		timeHours: 1,
	};
}