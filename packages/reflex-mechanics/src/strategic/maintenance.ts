import type {
	CannibalizationResolution,
	MaintenanceProfile,
	MaintenanceSkillMode,
	PreventiveMaintenanceContext,
	PreventiveMaintenanceResolution,
	ReconditioningResolution,
	RepairResolution,
	UseLevelResolution,
	WearAccrualResolution,
	WearPenaltyBreakdown,
} from './types';

const USE_LEVEL_PERIODS: Record<UseLevelResolution['useLevel'], UseLevelResolution['periodLabel']> = {
	negligible: '1 year',
	light: '3 months',
	moderate: '1 month',
	heavy: '1 week',
	severe: '1 day',
};

function elevateUseLevel(level: UseLevelResolution['useLevel']): UseLevelResolution['useLevel'] {
	if (level === 'negligible') {
		return 'light';
	}

	if (level === 'light') {
		return 'moderate';
	}

	if (level === 'moderate') {
		return 'heavy';
	}

	if (level === 'heavy') {
		return 'severe';
	}

	return 'severe';
}

function reduceUseLevel(level: UseLevelResolution['useLevel']): UseLevelResolution['useLevel'] {
	if (level === 'severe') {
		return 'heavy';
	}

	if (level === 'heavy') {
		return 'moderate';
	}

	if (level === 'moderate') {
		return 'light';
	}

	if (level === 'light') {
		return 'negligible';
	}

	return 'negligible';
}

export function getUseLevelResolution(context: PreventiveMaintenanceContext): UseLevelResolution {
	let useLevel: UseLevelResolution['useLevel'] = 'negligible';
	const notes: string[] = [];

	if (context.itemClass === 'electronic') {
		const runtime = context.electronicsRuntimeHoursPerWeek ?? 0;
		useLevel = runtime <= 0 ? 'negligible' : runtime <= 20 ? 'light' : runtime <= 50 ? 'moderate' : runtime <= 100 ? 'heavy' : 'severe';
	}

	if (context.itemClass === 'vehicle') {
		const road = context.vehicleRoadKilometers ?? 0;
		const offRoad = context.vehicleOffRoadKilometers ?? 0;
		useLevel = road <= 0 && offRoad <= 0
			? 'negligible'
			: road <= 100 && offRoad <= 0
				? 'light'
				: road <= 500 && offRoad <= 100
					? 'moderate'
					: road <= 1000 && offRoad <= 200
						? 'heavy'
						: 'severe';
	}

	if (context.itemClass === 'firearm') {
		const rounds = context.firearmRoundsFired ?? 0;
		useLevel = rounds <= 0 ? 'negligible' : rounds <= 50 ? 'light' : rounds <= 100 ? 'moderate' : rounds <= 250 ? 'heavy' : 'severe';
	}

	if (context.itemClass === 'mechanical') {
		useLevel = context.protectedFromElements ? 'negligible' : 'light';
	}

	if (context.excessiveHumidity || context.dustOrSand || context.corrosionExposure) {
		useLevel = elevateUseLevel(useLevel);
		notes.push('Harsh environmental exposure increases effective use by one level.');
	}

	if (context.protectedFromElements) {
		const reductionCount = context.itemClass === 'electronic' ? 2 : 1;
		for (let index = 0; index < reductionCount; index += 1) {
			useLevel = reduceUseLevel(useLevel);
		}
		notes.push(context.itemClass === 'electronic'
			? 'Complete shelter reduces electronic use by two levels.'
			: 'Complete shelter reduces mechanical use by one level.');
	}

	return {
		useLevel,
		periodLabel: USE_LEVEL_PERIODS[useLevel],
		notes,
	};
}

export function getWearPenaltyBreakdown(wear: number): WearPenaltyBreakdown {
	const maintenancePenalty = Math.max(0, wear - 4);

	return {
		maintenancePenalty,
		precisionPenalty: Math.floor(maintenancePenalty / 2),
		barterValueDivisor: Math.max(1, wear),
		notes: maintenancePenalty > 0
			? ['Maintenance and repair checks suffer Wear - 4 penalty; precision uses suffer half that penalty.']
			: ['Wear is not yet high enough to impose maintenance or precision penalties.'],
	};
}

export function accrueWear(
	priorWear: number,
	causesWear: boolean,
	breakRoll?: number,
): WearAccrualResolution {
	const wearGained = causesWear ? 1 : 0;
	const newWear = Math.min(10, priorWear + wearGained);
	const breakCheckRequired = wearGained > 0 && newWear < 10;
	const willBreakOnNextUse = newWear >= 10 || (typeof breakRoll === 'number' && breakCheckRequired && breakRoll <= newWear);

	return {
		priorWear,
		newWear,
		wearGained,
		breakCheckRequired,
		willBreakOnNextUse,
		notes: [
			...(wearGained > 0 ? ['The item accrues 1 Wear.'] : ['The item does not accrue Wear.']),
			...(newWear >= 10 ? ['Wear 10 means the item falls apart and is salvage only.'] : []),
			...(willBreakOnNextUse && newWear < 10 ? ['The item will break the next time it is used unless maintained first.'] : []),
		],
	};
}

export function getPreventiveMaintenanceResolution(
	profile: MaintenanceProfile,
	skillMode: MaintenanceSkillMode = 'useSkill',
	automaticSuccessWithSupplies = false,
	hasNoviceRating = false,
): PreventiveMaintenanceResolution {
	const targetNumber = skillMode === 'useSkill' ? 3 : 5;
	const canAutoSucceed = automaticSuccessWithSupplies && hasNoviceRating;

	return {
		hoursRequired: profile.maintenance,
		skillMode,
		targetNumber,
		automaticSuccessWithSupplies: canAutoSucceed,
		preventsWearAccrual: canAutoSucceed,
		notes: [
			'Preventive maintenance preserves current Wear but cannot improve condition.',
			...(canAutoSucceed ? ['Expend one unit of appropriate maintenance supplies for automatic success.'] : []),
		],
	};
}

export function resolveReconditioningAttempt(
	profile: MaintenanceProfile,
	margin: number,
	usedCompatibleCannibalizedParts = false,
	hasNoviceATS = false,
): ReconditioningResolution {
	const automaticSuccess = usedCompatibleCannibalizedParts && hasNoviceATS;
	const baseHours = profile.wear * profile.maintenance;
	const hoursRequired = automaticSuccess ? baseHours / 2 : baseHours;

	return {
		hoursRequired,
		partsRequired: 1,
		targetNumber: -2,
		wearPenalty: -Math.floor(profile.wear / 2),
		resultingWearOnSuccess: Math.max(automaticSuccess ? 0 : 1, profile.wear - 1),
		resultingWearOnBadFailure: margin < -5 ? profile.wear + 1 : profile.wear,
		automaticSuccess,
		notes: [
			'Reconditioning normally cannot reduce Wear to 0.',
			...(automaticSuccess ? ['Compatible donor parts with Novice ATS or better grant automatic success and halve time.'] : []),
		],
	};
}

export function getReconditioningTimeForWearReduction(
	startingWear: number,
	targetWear: number,
	maintenance: number,
	compatibleCannibalizedParts = false,
): number {
	let totalHours = 0;

	for (let wear = startingWear; wear > targetWear; wear -= 1) {
		totalHours += wear * maintenance;
	}

	return compatibleCannibalizedParts ? totalHours / 2 : totalHours;
}

export function canReconditionToZero(totalPartsSpent: number, cannibalizedPartsSpent: number): boolean {
	return totalPartsSpent >= 10 && cannibalizedPartsSpent >= 5;
}

export function resolveCannibalizationAttempt(profile: MaintenanceProfile, margin: number): CannibalizationResolution {
	const maxPartsYield = Math.max(0, 12 - profile.wear);
	const partsYield = margin > 0 ? Math.min(maxPartsYield, margin) : 0;

	return {
		hoursRequired: profile.maintenance * 2,
		targetNumber: -2,
		partsYield,
		maxPartsYield,
		destroyed: margin !== 0,
		canAttemptAgain: margin === 0,
		notes: [
			'Cannibalization destroys the donor item except on an exact-margin success of 0, where no parts are gained and another attempt is possible.',
		],
	};
}

export function resolveRepairAttempt(profile: MaintenanceProfile, margin: number): RepairResolution {
	return {
		hoursRequired: profile.wear * profile.maintenance,
		partsRequired: 1,
		targetNumber: 0,
		wearPenalty: -Math.floor(profile.wear / 2),
		repaired: margin >= 0,
		destroyed: margin < -5,
		notes: [
			'Repair removes the disabled state on success.',
			...(margin < -5 ? ['Margin of failure greater than 5 destroys the item permanently.'] : []),
		],
	};
}