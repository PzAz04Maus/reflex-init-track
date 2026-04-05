import type { InjurySeverity } from '../types';

import { getShelterEffects } from './necessities';
import type {
	HealingFactorBreakdown,
	HealingFactorContext,
	MedicalProcedurePenaltyBreakdown,
	MedicalSkillTier,
	TraumaSurgerySupplyCost,
	WoundInfectionChanceContext,
} from './types';

const HEALING_TIME_BY_SEVERITY: Record<Exclude<InjurySeverity, 'none' | 'drt' | 'dead'>, number> = {
	slight: 10,
	moderate: 30,
	serious: 90,
	critical: 180,
};

function getSeverityPenalty(severity: InjurySeverity): number {
	switch (severity) {
		case 'moderate':
			return -1;
		case 'serious':
			return -2;
		case 'critical':
			return -3;
		default:
			return 0;
	}
	}

export function getHealingFactorFromFitness(fitness: number): number {
	if (fitness >= 13) {
		return 4;
	}

	if (fitness >= 8) {
		return 3;
	}

	if (fitness >= 5) {
		return 2;
	}

	return 1;
}

export function getExtendedCareBonus(skillTier: MedicalSkillTier, suppliesAvailable = false): number {
	let bonus = 0;

	switch (skillTier) {
		case 'novice':
		case 'competent':
			bonus = 1;
			break;
		case 'professional':
		case 'expert':
			bonus = 2;
			break;
		case 'master':
			bonus = 3;
			break;
		case 'legendary':
			bonus = 4;
			break;
		default:
			bonus = 0;
	}

	return suppliesAvailable ? bonus * 2 : bonus;
}

export function getHealingFactorBreakdown(context: HealingFactorContext): HealingFactorBreakdown {
	const baseFromFitness = getHealingFactorFromFitness(context.fitness);
	const shelterModifier = getShelterEffects(context.shelter).healingFactorModifier;
	const conditionModifiers =
		(context.starving ? -2 : 0)
		+ (context.dehydrated ? -1 : 0)
		+ (context.chronicallyFatigued ? -1 : 0);
	const extendedCareModifier = context.extendedCareSkillTier
		? getExtendedCareBonus(context.extendedCareSkillTier, context.extendedCareSuppliesAvailable)
		: 0;
	const diseaseModifier = context.diseaseModifier ?? 0;
	const total = baseFromFitness + shelterModifier + conditionModifiers + extendedCareModifier + diseaseModifier;

	return {
		total,
		canHeal: !context.infectedWound && total >= 1,
		baseFromFitness,
		shelterModifier,
		conditionModifiers,
		extendedCareModifier,
		diseaseModifier,
		infectedWound: context.infectedWound ?? false,
	};
}

export function getHealingDaysForSeverity(severity: Exclude<InjurySeverity, 'none' | 'drt' | 'dead'>, healingFactor: number): number {
	if (healingFactor < 1) {
		return Number.POSITIVE_INFINITY;
	}

	return Math.ceil(HEALING_TIME_BY_SEVERITY[severity] / healingFactor);
}

export function getMedicalProcedurePenalty(injuries: InjurySeverity[]): MedicalProcedurePenaltyBreakdown {
	const bySeverity = injuries.map(getSeverityPenalty).filter((penalty) => penalty !== 0);

	return {
		total: bySeverity.reduce((sum, penalty) => sum + penalty, 0),
		bySeverity,
	};
}

export function getFirstAidPenalty(injuries: InjurySeverity[], hoursSinceOldestInjury: number): number {
	return getMedicalProcedurePenalty(injuries).total - Math.max(0, Math.floor(hoursSinceOldestInjury));
}

export function getResuscitationPenalty(injuries: InjurySeverity[], elapsedExchangesOrMinutesSinceDeath: number): number {
	return getMedicalProcedurePenalty(injuries).total - Math.max(0, elapsedExchangesOrMinutesSinceDeath);
}

export function getTraumaSurgeryDurationHours(
	rolledHours: number,
	criticalInjuryLocations: number,
	otherInjuredLocations: number,
): number {
	if (criticalInjuryLocations <= 0) {
		return 0;
	}

	return Math.max(1, rolledHours) * criticalInjuryLocations + otherInjuredLocations;
}

export function getTraumaSurgerySupplyCost(hours: number, criticalHeadInjury = false): TraumaSurgerySupplyCost {
	return {
		hours,
		wholeBlood: hours,
		surgicalSupplies: hours * 2,
		localAnesthesia: criticalHeadInjury ? 0 : hours,
		totalAnesthesia: criticalHeadInjury ? 2 : 0,
		antibiotic: hours > 0 ? 1 : 0,
	};
}

export function getExtendedCareHoursPerDay(totalWoundLevels: number): number {
	return totalWoundLevels / 2;
}

export function getFirstAidInfectionReduction(firstAidMargin: number, usedAntibiotics = false, usedFirstAidSupplies = false): number {
	const multiplier = usedAntibiotics && usedFirstAidSupplies ? 3 : usedAntibiotics || usedFirstAidSupplies ? 2 : 1;

	return Math.max(0, firstAidMargin) * multiplier;
}

export function getWoundInfectionChance(context: WoundInfectionChanceContext = {}): number {
	const causeType = context.causeType ?? 'normal';
	const firstAidMargin = context.firstAidMargin ?? 0;
	const baseChance = causeType === 'fireOrAcid'
		? 30
		: causeType === 'animal'
			? 50
			: causeType === 'bluntNoSkinBreak'
				? 1
				: 15;
	const reduction = getFirstAidInfectionReduction(firstAidMargin, context.usedAntibiotics, context.usedFirstAidSupplies);

	return Math.max(0, baseChance - reduction);
}