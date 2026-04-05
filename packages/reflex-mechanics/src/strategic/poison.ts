import type { InjurySeverity } from '../types';

import type { PoisonDefinition, PoisonEffectResolution, PoisonId } from './types';
import { SURVIVAL_POISON_SOURCE } from './types';

export const POISON_DEFINITIONS: Record<PoisonId, PoisonDefinition> = {
	atropine: {
		id: 'atropine',
		name: 'Atropine',
		vectors: ['Injected, usually via autoinjector.'],
		symptomsAndEffects: 'Immediate severe vertigo, blurred vision, light sensitivity, irregular heart rate, and possible hallucinations. Causes a virtual serious head injury and restricts movement to crawling. Additional doses can induce cardiac arrest.',
		diagnosisModifier: 'Medicine (COG, TN +2) unless the observer has chemical defense training',
		treatments: [
			{ description: '1 unit of specific counter-agent', bonus: '+4' },
			{ description: 'Standard stabilization if cardiac arrest occurs', bonus: 'Per stabilization rules' },
		],
		recoveryTiming: '1 hour after exposure',
		recoveryCheckModifier: 'TN standard',
		recoveryOutcome: 'A moderate virtual head injury persists for 1 additional hour.',
		failureOutcome: 'A serious virtual head injury persists for 1d6 hours, then a moderate virtual head injury persists for 1d6 hours.',
		source: SURVIVAL_POISON_SOURCE,
	},
	blisterAgent: {
		id: 'blisterAgent',
		name: 'Blister Agent',
		vectors: ['Aerosol or persistent surface contamination; gas mask protects inhalation and eye contact only, sealed suit required for full protection.'],
		symptomsAndEffects: 'Symptoms begin after 4d6 hours. Skin exposure causes 2d10H damage to each exposed location. Eye or inhaled exposure causes 2d20H damage to head or torso. Critical eye injury causes blindness; critical inhalation injury causes death from pulmonary edema.',
		diagnosisModifier: 'Undiagnosable before onset without detection systems',
		treatments: [
			{ description: 'Immediate skin decontamination before symptom onset', bonus: 'Reduces damage to 1d10, or 1d20 for eye/inhalation exposure' },
			{ description: 'Standard care after injury manifests', bonus: 'Use normal physical wound treatment rules' },
		],
		recoveryTiming: 'Standard physical recovery timeline',
		recoveryCheckModifier: 'Standard physical recovery rules',
		recoveryOutcome: 'Healing follows normal injury recovery, but HF is reduced by 1 while blister agent injuries remain unhealed.',
		failureOutcome: 'N/A.',
		source: SURVIVAL_POISON_SOURCE,
	},
	nerveAgent: {
		id: 'nerveAgent',
		name: 'Nerve Agent',
		vectors: ['Aerosol or skin absorption; gas mask protects inhalation but not skin absorption, sealed suit required for full protection.'],
		symptomsAndEffects: 'After 1d3 exchanges, pauses, or minutes, deals 1d10 damage to head and torso. Each subsequent interval adds another 1d10 and continues for 1d10 intervals after exposure ends. A new critical head or torso wound inflicted while one already exists kills the victim.',
		diagnosisModifier: 'Obvious to emergency response, medical, or military personnel; otherwise EDU (TN -2)',
		treatments: [
			{ description: 'Atropine and 2-PAM-CI', bonus: 'One dose if no worse than moderate wound, two doses if serious or critical' },
			{ description: 'Standard treatment of resulting injuries', bonus: 'Per wound rules' },
		],
		recoveryTiming: 'Standard physical recovery timeline',
		recoveryCheckModifier: 'Standard physical recovery rules',
		recoveryOutcome: 'Healing follows normal injury recovery, but HF is reduced by 2 while nerve agent injuries remain unhealed.',
		failureOutcome: 'N/A.',
		source: SURVIVAL_POISON_SOURCE,
	},
	pepperSpray: {
		id: 'pepperSpray',
		name: 'Pepper Spray',
		vectors: ['Aerosol through eyes and respiratory tract; gas mask fully protects, improvised face protection has a 50% chance to block exposure.'],
		symptomsAndEffects: 'Immediate Resolve (TN -4). Success causes a slight virtual head injury; failure causes a moderate virtual head injury; margin of failure 10+ causes respiratory inflammation and suffocation.',
		diagnosisModifier: 'EDU (TN +1) unless the observer has relevant professional or prior exposure knowledge',
		treatments: [
			{ description: 'Flush eyes with milk, mild detergent, or similar oily liquid', bonus: '+2' },
			{ description: 'Oxygen treatment', bonus: '+2' },
			{ description: 'Open the airway if suffocating', bonus: 'Medicine (RES, TN +5)' },
		],
		recoveryTiming: '1 hour after end of exposure',
		recoveryCheckModifier: 'TN +3',
		recoveryOutcome: 'Symptoms cease.',
		failureOutcome: 'Symptoms persist for minutes equal to 10 times the margin of failure.',
		source: SURVIVAL_POISON_SOURCE,
	},
	pulmonaryAgent: {
		id: 'pulmonaryAgent',
		name: 'Pulmonary Agent',
		vectors: ['Aerosol through inhalation and eye contact; gas mask fully protects. Holding breath halves damage. Some agents can destroy gas mask filters.'],
		symptomsAndEffects: 'Immediate 1d6 torso damage, increasing by another 1d6 each subsequent interval of exposure. A serious torso wound from this damage causes suffocation and likely death unless removed from the poison first.',
		diagnosisModifier: 'Medicine (COG, TN +1) unless obvious from military or industrial training',
		treatments: [
			{ description: 'Standard wound treatment before suffocation begins', bonus: 'Use normal physical wound treatment' },
		],
		recoveryTiming: 'Standard physical recovery timeline',
		recoveryCheckModifier: 'Standard physical recovery rules',
		recoveryOutcome: 'Healing follows normal physical recovery.',
		failureOutcome: 'Once suffocation begins, treatment is impossible and the victim dies.',
		source: SURVIVAL_POISON_SOURCE,
	},
	cobraVenom: {
		id: 'cobraVenom',
		name: 'Snake Venom, Cobra Family',
		vectors: ['Injected by bite or other deliberate injection.'],
		symptomsAndEffects: 'After a variable onset, Fit (TN -4). Success causes slight head injury. Failure by 1-4 causes moderate head injury; by 5-9 causes serious head injury after 1d6 minutes; by 10+ causes respiratory paralysis and suffocation.',
		diagnosisModifier: 'Medicine (COG, TN -2) or Fieldcraft (COG, TN -1); identifying the specific snake is Fieldcraft (COG, TN +2)',
		misdiagnosis: 'Poison is recognized as snake venom but exact species is unknown.',
		treatments: [
			{ description: 'Constriction band applied to affected limb', bonus: '+1 to the initial Fitness check' },
			{ description: 'One dose of species-specific antitoxin', bonus: '+6 to the initial Fitness check' },
		],
		recoveryTiming: 'Standard physical recovery timeline',
		recoveryCheckModifier: 'Standard wound recovery rules',
		recoveryOutcome: 'Normal recovery from resulting injuries.',
		failureOutcome: 'At severe failure margins the victim begins suffocating and may die if untreated.',
		source: SURVIVAL_POISON_SOURCE,
	},
	viperVenom: {
		id: 'viperVenom',
		name: 'Snake Venom, Viper Family',
		vectors: ['Injected by bite or other deliberate injection.'],
		symptomsAndEffects: 'After a variable onset, Fit (TN -1). Success causes slight injury to the affected location. Failure by 1-4 causes moderate injury after 1d3 hours, by 5-9 causes severe injury, and by 10+ causes coma with a second Fit check to avoid death within 1d3 days.',
		diagnosisModifier: 'Medicine (COG, TN -2) or Fieldcraft (COG, TN -1); identifying the specific snake is Fieldcraft (COG, TN +2)',
		misdiagnosis: 'Poison is recognized as snake venom but exact species is unknown.',
		treatments: [
			{ description: 'Constriction band applied to affected limb', bonus: '+1 to the initial Fitness check' },
			{ description: 'One dose of species-specific antitoxin', bonus: '+6 to the initial Fitness check' },
		],
		recoveryTiming: 'Standard physical recovery timeline',
		recoveryCheckModifier: 'Standard wound recovery rules',
		recoveryOutcome: 'Normal recovery from resulting injuries; coma prevents normal healing for 2d10H days.',
		failureOutcome: 'At the highest failure margin the victim enters a coma and may die within 1d3 days.',
		source: SURVIVAL_POISON_SOURCE,
	},
	tearGas: {
		id: 'tearGas',
		name: 'Tear Gas',
		vectors: ['Aerosol; gas mask fully protects, improvised protection degrades over time.'],
		symptomsAndEffects: 'Immediately raises fatigue by one level and inflicts a -4 penalty on vision- or concentration-based actions. In enclosed spaces each grenade has a cumulative 20% chance to cause pulmonary edema, giving a serious torso wound and instability.',
		diagnosisModifier: 'Obvious to anyone with medical, law enforcement, military, or prior exposure experience',
		treatments: [
			{ description: 'Flush eyes with at least one liter of water', bonus: '+2' },
			{ description: 'Oxygen treatment', bonus: '+2' },
		],
		recoveryTiming: '5 minutes after end of exposure',
		recoveryCheckModifier: 'TN +3',
		recoveryOutcome: 'Symptoms cease.',
		failureOutcome: 'Margin of failure 6+ causes pulmonary edema; otherwise symptoms persist for minutes equal to twice the margin of failure.',
		source: SURVIVAL_POISON_SOURCE,
	},
	vomitGas: {
		id: 'vomitGas',
		name: 'Vomit Gas',
		vectors: ['As tear gas.'],
		symptomsAndEffects: 'As tear gas, plus Fit (TN -4). Failure causes incapacitating vomiting; failure by 5+ also causes loss of bladder and bowel control. No action except crawling and whimpering is possible without Resolve (TN -4).',
		diagnosisModifier: 'As tear gas',
		treatments: [
			{ description: 'As tear gas', bonus: 'Same treatment bonuses apply' },
		],
		recoveryTiming: 'As tear gas',
		recoveryCheckModifier: 'As tear gas',
		recoveryOutcome: 'As tear gas.',
		failureOutcome: 'As tear gas, though vomiting and associated effects end immediately once recovery succeeds.',
		source: SURVIVAL_POISON_SOURCE,
	},
};

function getViperInjuryFromMargin(margin: number): InjurySeverity {
	if (margin >= 0) {
		return 'slight';
	}

	if (margin >= -4) {
		return 'moderate';
	}

	return 'serious';
}

export function getPoisonDefinition(poisonId: PoisonId): PoisonDefinition {
	return POISON_DEFINITIONS[poisonId];
}

export function resolveAtropineExposure(
	totalDosesInSystem = 1,
	failedAdditionalDoseFitnessCheck = false,
): PoisonEffectResolution {
	return {
		poisonId: 'atropine',
		virtualHeadInjury: 'serious',
		movementCap: 'crawl',
		torsoInjury: totalDosesInSystem > 1 && failedAdditionalDoseFitnessCheck ? 'serious' : undefined,
		unstable: totalDosesInSystem > 1 && failedAdditionalDoseFitnessCheck,
		notes: [
			'Base exposure causes a virtual serious head injury and restricts movement to crawling.',
			...(totalDosesInSystem > 1 && failedAdditionalDoseFitnessCheck ? ['Additional failed-dose check causes cardiac arrest and a serious torso injury.'] : []),
		],
	};
}

export function getBlisterAgentDamageDice(exposure: 'skin' | 'eyes' | 'inhalation', decontaminatedBeforeOnset = false): { dice: number; sides: number } {
	if (exposure === 'skin') {
		return decontaminatedBeforeOnset ? { dice: 1, sides: 10 } : { dice: 2, sides: 10 };
	}

	return decontaminatedBeforeOnset ? { dice: 1, sides: 20 } : { dice: 2, sides: 20 };
}

export function getEscalatingPoisonDamageDice(intervalsSinceOnset: number, dieSize: 6 | 10): number {
	return Math.max(1, intervalsSinceOnset);
}

export function resolvePepperSprayExposure(resolveMargin: number): PoisonEffectResolution {
	return {
		poisonId: 'pepperSpray',
		virtualHeadInjury: resolveMargin >= 0 ? 'slight' : 'moderate',
		beginsSuffocating: resolveMargin <= -10,
		notes: [
			resolveMargin >= 0 ? 'Resolve check succeeded; victim suffers a slight virtual head injury.' : 'Resolve check failed; victim suffers a moderate virtual head injury.',
			...(resolveMargin <= -10 ? ['Margin of failure 10+ triggers respiratory inflammation and suffocation.'] : []),
		],
	};
}

export function resolveSnakeVenomExposure(
	family: 'cobra' | 'viper',
	fitnessMargin: number,
	affectedLocation: PoisonEffectResolution['affectedLocation'] = 'leftLeg',
	failedComaCheck = false,
): PoisonEffectResolution {
	if (family === 'cobra') {
		return {
			poisonId: 'cobraVenom',
			virtualHeadInjury: undefined,
			headInjury: fitnessMargin >= 0 ? 'slight' : fitnessMargin >= -4 ? 'moderate' : 'serious',
			movementCap: null,
			beginsSuffocating: fitnessMargin <= -10,
			notes: [
				fitnessMargin <= -10
					? 'Severe cobra venom exposure progresses to respiratory paralysis and suffocation.'
					: 'Cobra venom produces progressive neurotoxic head-injury effects based on the failed Fitness check margin.',
			],
		};
	}

	return {
		poisonId: 'viperVenom',
		affectedLocation,
		affectedLocationInjury: getViperInjuryFromMargin(fitnessMargin),
		unconscious: fitnessMargin <= -10,
		dead: fitnessMargin <= -10 && failedComaCheck,
		notes: [
			fitnessMargin <= -10
				? 'Severe viper venom exposure causes coma and may be fatal if the second Fitness check also fails.'
				: 'Viper venom inflicts escalating local injury severity based on the failed Fitness check margin.',
		],
	};
}

export function resolveTearGasExposure(enclosedGrenadeCount = 0, pulmonaryEdemaTriggered = false): PoisonEffectResolution {
	return {
		poisonId: 'tearGas',
		fatigueStagesAdded: 1,
		visionPenalty: -4,
		concentrationPenalty: -4,
		torsoInjury: pulmonaryEdemaTriggered ? 'serious' : undefined,
		unstable: pulmonaryEdemaTriggered,
		notes: [
			'Tear gas raises fatigue by one level and inflicts a -4 penalty on vision- and concentration-based actions.',
			...(enclosedGrenadeCount > 0 ? [`Enclosed exposure has a cumulative ${Math.min(100, enclosedGrenadeCount * 20)}% chance of pulmonary edema.`] : []),
			...(pulmonaryEdemaTriggered ? ['Pulmonary edema produces a serious torso wound and instability.'] : []),
		],
	};
}

export function resolveVomitGasExposure(fitnessMargin: number, enclosedGrenadeCount = 0, pulmonaryEdemaTriggered = false): PoisonEffectResolution {
	return {
		...resolveTearGasExposure(enclosedGrenadeCount, pulmonaryEdemaTriggered),
		poisonId: 'vomitGas',
		notes: [
			'Vomit gas applies tear-gas effects first.',
			...(fitnessMargin < 0 ? ['Failed Fitness check incapacitates the victim with violent vomiting.'] : []),
			...(fitnessMargin <= -5 ? ['Margin of failure 5+ also causes loss of bladder and bowel control.'] : []),
		],
	};
}