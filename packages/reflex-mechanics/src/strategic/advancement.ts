import type {
	BookLearningResolution,
	CombatAttributeImprovementResolution,
	DowntimeLearningResolution,
	LearningExperienceResolution,
	LearningExperienceSource,
	QualificationTrainingPlan,
	QualificationTrainingResolution,
	SkillTrainingPlan,
	SkillTrainingResolution,
	TrainingSkillTier,
} from './types';

const TRAINING_TIER_VALUE: Record<TrainingSkillTier, number> = {
	unskilled: 1,
	novice: 2,
	competent: 3,
	professional: 4,
	expert: 5,
};

export function getLearningExperienceResolution(
	source: LearningExperienceSource,
	context: {
		totalModifier?: number;
		marginOfSuccess?: number;
		twentyCount?: number;
		diceRolled?: number;
		skillTier?: TrainingSkillTier;
		primarySkillGap?: number;
		successfulAssistance?: boolean;
	} = {},
): LearningExperienceResolution {
	const qualifies = source === 'extraordinarySuccess'
		? (context.totalModifier ?? 0) <= -5 && (context.marginOfSuccess ?? -1) >= 5
		: source === 'catastrophicFailure'
			? (context.skillTier ?? 'unskilled') !== 'unskilled'
				&& (context.twentyCount ?? 0) >= Math.ceil((context.diceRolled ?? 0) / 2)
			: source === 'assistance'
				? (context.successfulAssistance ?? false) && (context.primarySkillGap ?? 0) >= 3
				: true;

	return {
		source,
		qualifies,
		notes: qualifies ? ['The event qualifies as a learning experience.'] : ['The event does not meet the threshold for a learning experience.'],
	};
}

export function getDowntimeLearningResolution(age: number, percentileRolls: readonly number[]): DowntimeLearningResolution {
	const rollsMade = Math.min(3, percentileRolls.length);
	const skillPointsGained = percentileRolls.slice(0, rollsMade).filter((roll) => roll >= age).length;

	return {
		rollsMade,
		skillPointsGained,
		notes: ['Each checked learning experience box can be rolled once during downtime, to a maximum of three rolls per skill.'],
	};
}

export function getSkillTrainingPlan(instructorCognition: number, weeksElapsed: number): SkillTrainingPlan {
	return {
		instructionHours: 40,
		maxStudents: Math.max(1, instructorCognition),
		instructorPenalty: -Math.max(0, Math.floor(weeksElapsed)),
		notes: ['Training a skill requires 40 hours of instruction, with a cumulative -1 penalty per full week elapsed.'],
	};
}

export function getSkillTrainingResolution(instructorSucceeded: boolean, studentSucceeded: boolean): SkillTrainingResolution {
	return {
		instructorSucceeded,
		studentSucceeded,
		skillPointGained: instructorSucceeded && studentSucceeded,
		notes: ['If the instructor succeeds and the student then succeeds on a Cognition check, the student gains 1 point in the skill.'],
	};
}

export function getBookLearningResolution(
	characterTier: TrainingSkillTier,
	materialTier: TrainingSkillTier,
	educationSucceeded: boolean,
): BookLearningResolution {
	const characterValue = TRAINING_TIER_VALUE[characterTier];
	const materialValue = TRAINING_TIER_VALUE[materialTier];
	const canLearn = characterValue === materialValue && characterValue < TRAINING_TIER_VALUE.professional;

	return {
		studyHoursRequired: materialValue * 20,
		canLearn,
		countsAsLearningExperience: canLearn && educationSucceeded,
		notes: [
			'Instructional material requires 20 hours of study per level of complexity.',
			...(characterValue < materialValue ? ['The material is too advanced for the character’s current understanding.'] : []),
			...(characterValue > materialValue ? ['The character already knows everything this material can teach.'] : []),
		],
	};
}

export function getQualificationTrainingPlan(instructorCognition: number, weeksElapsed: number): QualificationTrainingPlan {
	return {
		targetTotal: 5,
		periodHours: 40,
		maxStudents: Math.max(1, instructorCognition),
		instructorPenalty: -Math.max(0, Math.floor(weeksElapsed)),
		notes: ['Training a qualification is an incremental Instruction check with target total 5 and period 40 hours.'],
	};
}

export function getQualificationTrainingResolution(studentSucceeded: boolean): QualificationTrainingResolution {
	return {
		qualificationLearned: studentSucceeded,
		notes: ['If the post-training Cognition-based skill check succeeds, the student acquires the qualification.'],
	};
}

export function getCombatAttributeImprovementResolution(
	currentImprovementPoints: number,
	survivedCombatSceneWithAction: boolean,
): CombatAttributeImprovementResolution {
	const improvementPointsGained = survivedCombatSceneWithAction ? 1 : 0;
	const remainingImprovementPoints = currentImprovementPoints + improvementPointsGained;

	return {
		improvementPointsGained,
		canIncreaseAttribute: remainingImprovementPoints >= 10,
		remainingImprovementPoints,
		notes: ['A character gains 1 improvement point after surviving a combat scene in which they took at least one action other than movement.'],
	};
}