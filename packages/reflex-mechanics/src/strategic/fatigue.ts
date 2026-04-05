import type { FatigueEffects, FatigueLevel, StimulantDoseResolution } from './types';

const FATIGUE_ORDER: FatigueLevel[] = ['rested', 'slight', 'moderate', 'serious', 'critical'];

export function worsenFatigueLevel(level: FatigueLevel, stages = 1): FatigueLevel {
	const currentIndex = FATIGUE_ORDER.indexOf(level);
	const nextIndex = Math.min(FATIGUE_ORDER.length - 1, currentIndex + Math.max(0, stages));

	return FATIGUE_ORDER[nextIndex];
}

export function improveFatigueLevel(level: FatigueLevel, stages = 1): FatigueLevel {
	const currentIndex = FATIGUE_ORDER.indexOf(level);
	const nextIndex = Math.max(0, currentIndex - Math.max(0, stages));

	return FATIGUE_ORDER[nextIndex];
}

export function getFatigueStageIndex(level: FatigueLevel): number {
	return FATIGUE_ORDER.indexOf(level);
}

export function getFatigueEffects(level: FatigueLevel): FatigueEffects {
	switch (level) {
		case 'rested':
			return {
				taskPenalty: 0,
				infectionResistancePenalty: 0,
				virtualHeadInjury: 'none',
				canSprint: true,
				canRun: true,
				canTrot: true,
				requiresResolveToStayAwake: false,
			};
		case 'slight':
			return {
				taskPenalty: -1,
				infectionResistancePenalty: -1,
				virtualHeadInjury: 'none',
				canSprint: true,
				canRun: true,
				canTrot: true,
				requiresResolveToStayAwake: false,
			};
		case 'moderate':
			return {
				taskPenalty: -2,
				infectionResistancePenalty: -2,
				virtualHeadInjury: 'none',
				canSprint: false,
				canRun: true,
				canTrot: true,
				requiresResolveToStayAwake: false,
			};
		case 'serious':
			return {
				taskPenalty: -3,
				infectionResistancePenalty: -3,
				virtualHeadInjury: 'slight',
				canSprint: false,
				canRun: false,
				canTrot: true,
				requiresResolveToStayAwake: false,
			};
		case 'critical':
			return {
				taskPenalty: -4,
				infectionResistancePenalty: -4,
				virtualHeadInjury: 'moderate',
				canSprint: false,
				canRun: false,
				canTrot: false,
				requiresResolveToStayAwake: true,
			};
	}
	}

export function getSleepHoursPerStageReduction(age?: number): number {
	return age !== undefined && age >= 55 ? 3 : 4;
}

export function getSleepHoursRequiredPerDay(age?: number): number {
	return age !== undefined && age >= 55 ? 3 : 4;
}

export function getInactivityHoursPerStageReduction(): number {
	return 8;
}

export function getFatigueRecoveryFromSleep(consecutiveHoursOfSleep: number, age?: number): number {
	return Math.floor(Math.max(0, consecutiveHoursOfSleep) / getSleepHoursPerStageReduction(age));
}

export function getFatigueRecoveryFromInactivity(consecutiveHoursOfInactivity: number): number {
	return Math.floor(Math.max(0, consecutiveHoursOfInactivity) / getInactivityHoursPerStageReduction());
}

export function getFatigueFromSleepLoss(consecutiveSleepHoursInPastDay: number, age?: number): number {
	return consecutiveSleepHoursInPastDay < getSleepHoursRequiredPerDay(age) ? 1 : 0;
}

export function getSleepingAwarenessPenalty(level: FatigueLevel): number {
	return getFatigueEffects(level).taskPenalty - 5;
}

export function getPostAwakeningInitiativePenalty(awarenessMarginOfSuccess: number): number {
	return Math.max(0, 5 - awarenessMarginOfSuccess);
}

export function resolveStimulantDose(
	level: FatigueLevel,
	doseNumberSinceRest: number,
	medicalStimulant = false,
	hasSeriousOrCriticalHeadOrTorsoWound = false,
): StimulantDoseResolution {
	const canReduce = medicalStimulant || level === 'slight' || level === 'moderate';
	const durationModifierHours = -Math.max(0, doseNumberSinceRest - 1);
	const effectiveFatigueLevel = canReduce ? improveFatigueLevel(level, 1) : level;
	const extraHeavyWorkHours = durationModifierHours <= -4 ? 1 : 0;

	return {
		effectiveFatigueLevel,
		durationModifierHours,
		extraHeavyWorkHours,
		cardiacInstabilityRisk: medicalStimulant && hasSeriousOrCriticalHeadOrTorsoWound ? 0.1 : 0,
	};
}