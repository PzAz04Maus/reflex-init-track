import type {
	AlcoholFuelProductionPlan,
	AmmunitionAssemblyResolution,
	AmmoReplacementComponent,
	BrassRecoveryResolution,
	BiodieselProductionPlan,
	FuelContainerSealing,
	FuelContaminationResolution,
	FuelPurificationResolution,
	GeneralScroungingResolution,
	ReplacementAmmoRiskProfile,
	SupplyDependentActionResolution,
	TargetedSearchResolution,
} from './types';

export function getSupplyDependentActionResolution(
	requiredSupplyUnits: number,
	availableSupplyUnits: number,
): SupplyDependentActionResolution {
	const shortfallUnits = Math.max(0, requiredSupplyUnits - availableSupplyUnits);

	return {
		requiredSupplyUnits,
		availableSupplyUnits,
		shortfallUnits,
		penalty: shortfallUnits * 2,
		canAttempt: availableSupplyUnits > 0,
		notes: shortfallUnits > 0
			? ['Each unit of missing consumables imposes a cumulative -2 penalty.']
			: ['Full consumable requirements are met.'],
	};
}

export function getGeneralScroungingResolution(
	timeHours: number,
	marginOfSuccess: number,
	detailedStrip = false,
): GeneralScroungingResolution {
	return {
		timeHours: detailedStrip ? timeHours * 4 : timeHours,
		itemsOfInterestFound: Math.max(0, marginOfSuccess),
		detailedStripPossible: detailedStrip,
		notes: [
			...(detailedStrip ? ['Detailed stripping takes four times as long as a standard general scrounging attempt.'] : []),
		],
	};
}

export function getTargetedSearchResolution(
	generalScroungingTimeHours: number,
	marginOfSuccess: number,
): TargetedSearchResolution {
	return {
		timeHours: generalScroungingTimeHours / 2,
		foundTarget: marginOfSuccess >= 0,
		extraItemsOfInterest: Math.max(0, Math.floor(marginOfSuccess / 4)),
		notes: ['Targeted search takes half the time of an equivalent general scrounging attempt.'],
	};
}

export function getBrassRecoveryResolution(roundsFired: number, marginOfSuccess: number): BrassRecoveryResolution {
	const recoveryPercent = Math.min(90, Math.max(0, marginOfSuccess * 20));

	return {
		minutesRequired: 5,
		casingsRecovered: Math.floor(roundsFired * (recoveryPercent / 100)),
		recoveryPercent,
		notes: ['Recovering brass takes five minutes per firearm involved in the fight.'],
	};
}

export function getAmmunitionAssemblyResolution(margin: number): AmmunitionAssemblyResolution {
	return {
		hoursRequired: 1,
		roundsProduced: margin >= 0 ? margin * 5 : 0,
		spoiledMaterialsRounds: margin < 0 ? 11 : 0,
		notes: [
			'One hour of work and a successful Gunsmithing check yields MoS x 5 rounds.',
			...(margin < 0 ? ['Failure ruins 2d10 rounds worth of materials; this helper tracks the expected midpoint of 11.'] : []),
		],
	};
}

export function getReplacementAmmoRiskProfile(
	replacementComponents: ReadonlyArray<AmmoReplacementComponent>,
	weaponWear = 0,
): ReplacementAmmoRiskProfile {
	let failureChancePercent = weaponWear;
	let damageModifierPercent = 0;

	for (const component of replacementComponents) {
		if (component === 'blackPowder') {
			failureChancePercent += 10;
			damageModifierPercent -= 25;
			continue;
		}

		failureChancePercent += 3;
	}

	return {
		replacementComponents: [...replacementComponents],
		failureChancePercent,
		damageModifierPercent,
		notes: ['Each replacement component adds 3% failure chance; black powder adds 10% and reduces damage by 25%.'],
	};
}

export function getFuelContaminationResolution(
	monthsStored: number,
	containerSealing: FuelContainerSealing,
	contaminationRoll?: number,
): FuelContaminationResolution {
	const contaminationChancePercent = (containerSealing === 'closed' ? 1 : 3) * Math.max(0, monthsStored);

	return {
		monthsStored,
		contaminationChancePercent,
		contaminated: typeof contaminationRoll === 'number' ? contaminationRoll <= contaminationChancePercent : false,
		notes: ['Fuel contamination chance is cumulative per month: 3% open containers, 1% closed containers.'],
	};
}

export function getFuelPurificationResolution(litersToPurify: number): FuelPurificationResolution {
	const usableLitersRecovered = litersToPurify * 0.9;

	return {
		minutesRequired: Math.ceil(Math.max(0, litersToPurify)),
		usableLitersRecovered,
		wastedLiters: Math.max(0, litersToPurify - usableLitersRecovered),
		notes: ['Unpowered fuel purification processes one liter per minute and recovers 90% of volume.'],
	};
}

export function getAlcoholFuelProductionPlan(outputLiters: number): AlcoholFuelProductionPlan {
	return {
		outputLiters,
		organicMatterKgRequired: outputLiters,
		waterLitersRequired: outputLiters,
		mashKgProduced: outputLiters * 1.75,
		durationDays: 3,
		notes: ['Each liter of alcohol fuel requires 1 kg of organic matter, 1 liter of water, and a three-day batch process.'],
	};
}

export function getBiodieselProductionPlan(outputLiters: number): BiodieselProductionPlan {
	return {
		outputLiters,
		vegetableOilKgRequired: outputLiters,
		alcoholLitersRequired: outputLiters * 0.12,
		productionChemicalUnitsRequired: outputLiters,
		lightWorkHoursRequired: 16,
		notes: ['Each liter of biodiesel requires 1 kg of vegetable oil, 0.12 liters of alcohol, and 1 unit of production chemicals.'],
	};
}