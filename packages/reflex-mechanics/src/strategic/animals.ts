import type {
	AnimalDressingResolution,
	AnimalStockType,
	MeatPreservationMethod,
	MeatPreservationResolution,
	PastureRequirementResolution,
} from './types';

const PASTURE_AREA_PER_HEAD: Record<AnimalStockType, number> = {
	cow: 2.4,
	donkey: 0.8,
	goat: 0.1,
	horse: 2.4,
	pig: 0.15,
	sheep: 0.4,
};

export function resolveAnimalDressing(maxEdibleMeatKg: number, marginOfSuccess: number): AnimalDressingResolution {
	if (marginOfSuccess < 0) {
		return {
			usableMeatKg: 0,
			usableHidePercent: 0,
			percentageRecovered: 0,
			notes: ['Failed dressing yields no reliable recovery of meat or hide.'],
		};
	}

	const percentageRecovered = Math.min(100, 30 + (marginOfSuccess * 10));

	return {
		usableMeatKg: maxEdibleMeatKg * (percentageRecovered / 100),
		usableHidePercent: percentageRecovered,
		percentageRecovered,
		notes: ['Successful dressing yields 30% plus 10% per point of margin of success of the animal’s maximum meat.'],
	};
}

export function getMeatPreservationResolution(
	meatKg: number,
	marginOfSuccess: number,
	method: MeatPreservationMethod,
): MeatPreservationResolution {
	return {
		hoursRequired: 6,
		durationDays: 3,
		preservedMonths: marginOfSuccess >= 0 ? 8 + marginOfSuccess : 0,
		saltKgRequired: method === 'salting' ? meatKg / 10 : 0,
		requiresFirewood: method === 'smoking',
		notes: [
			'Preserving meat requires six hours of light work over three days.',
			...(method === 'salting' ? ['Salting requires 1 kg of salt per 10 kg of meat.'] : ['Smoking requires a ready source of firewood.']),
		],
	};
}

export function getPastureRequirementResolution(
	animal: AnimalStockType,
	headCount: number,
	qualityModifier: 1 | 2 | 3 | 0.67 = 1,
): PastureRequirementResolution {
	return {
		animal,
		headCount,
		hectaresRequired: PASTURE_AREA_PER_HEAD[animal] * Math.max(0, headCount) * qualityModifier,
		notes: [
			...(qualityModifier > 1 ? ['Poor or marginal pasture increases the land requirement.'] : []),
			...(qualityModifier < 1 ? ['Fertile, well-tended, and irrigated pasture reduces the land requirement by one-third.'] : []),
		],
	};
}