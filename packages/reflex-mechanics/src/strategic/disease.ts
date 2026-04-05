import type { DiseaseDefinition, DiseaseExposureResult, DiseaseExposureVector, DiseaseId, ShelterGrade } from './types';
import { SURVIVAL_DISEASE_SOURCE } from './types';

const HUMAN_EXPOSURE_THRESHOLD_BY_SHELTER: Record<ShelterGrade, number> = {
	complete: 12,
	adequate: 11,
	minimal: 10,
	none: 9,
};

const HUMAN_DISEASE_BY_2D6: Record<number, DiseaseId> = {
	2: 'influenza',
	3: 'cholera',
	4: 'hepatitisA',
	5: 'dysentery',
	6: 'foodPoisoning',
	7: 'minorIllness',
	8: 'pneumonia',
	9: 'typhus',
	10: 'typhoidFever',
	11: 'bubonicPlague',
	12: 'pneumonicPlague',
};

const ANIMAL_DISEASE_BY_2D6: Record<number, DiseaseId> = {
	2: 'rabies',
	3: 'bubonicPlague',
	4: 'bubonicPlague',
	5: 'minorIllness',
	6: 'minorIllness',
	7: 'minorIllness',
	8: 'minorIllness',
	9: 'foodPoisoning',
	10: 'foodPoisoning',
	11: 'foodPoisoning',
	12: 'influenza',
};

const WATER_DISEASE_BY_2D6: Record<number, DiseaseId> = {
	2: 'hepatitisA',
	3: 'minorIllness',
	4: 'minorIllness',
	5: 'minorIllness',
	6: 'dysentery',
	7: 'dysentery',
	8: 'dysentery',
	9: 'dysentery',
	10: 'typhoidFever',
	11: 'typhoidFever',
	12: 'cholera',
};

export const DISEASE_DEFINITIONS: Record<DiseaseId, DiseaseDefinition> = {
	bubonicPlague: {
		id: 'bubonicPlague',
		name: 'Bubonic Plague',
		vectors: ['Fleas, usually those of rodents.'],
		contagionModifier: 'TN -2',
		symptomsAndEffects: 'Incubation 1d6 days, then fever, swollen lymph nodes, and severe abdominal pain. Fatigue cannot drop below serious.',
		fatigueFloor: 'serious',
		diagnosisModifier: 'TN standard',
		misdiagnosis: 'Minor illness.',
		treatments: [
			{ description: '2 units of Gram-negative antibiotic', bonus: '+4 in the first week, otherwise +2' },
			{ description: 'Relief of pain and fever', bonus: '+1' },
		],
		recoveryTiming: '2 weeks after symptom onset',
		recoveryCheckModifier: 'TN standard',
		recoveryOutcome: 'Fatigue cannot drop below moderate for 2d6 weeks, then below slight for 2d6 weeks, then returns to normal.',
		failureOutcome: 'Death.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	cholera: {
		id: 'cholera',
		name: 'Cholera',
		vectors: ['Contaminated food or water.'],
		contagionModifier: 'TN -3',
		symptomsAndEffects: 'Asymptomatic for 1 day, then abdominal pain, acute diarrhea, and fever. Fatigue cannot drop below moderate and daily water requirement is doubled.',
		fatigueFloor: 'moderate',
		additionalWaterRequirementLiters: 0,
		diagnosisModifier: 'TN standard',
		misdiagnosis: 'Dysentery.',
		treatments: [
			{ description: 'Intravenous and ingested fluid replacement', bonus: '+3' },
			{ description: '1 unit of Gram-negative antibiotic', bonus: '+2' },
			{ description: 'Relief of pain and fever', bonus: '+2' },
		],
		recoveryTiming: '1 week after symptom onset',
		recoveryCheckModifier: 'TN standard',
		recoveryOutcome: 'Fatigue cannot drop below slight for 1d3 weeks, then returns to normal.',
		failureOutcome: 'Death on margin of failure 8+; otherwise fatigue cannot drop below moderate for 1d3 weeks, then below slight for 1d3 weeks.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	dysentery: {
		id: 'dysentery',
		name: 'Dysentery',
		vectors: ['Contaminated food or water.'],
		contagionModifier: 'TN +1',
		symptomsAndEffects: 'Asymptomatic for 1d3 days, then abdominal pain and diarrhea. Fatigue cannot drop below moderate and daily water requirement is doubled.',
		fatigueFloor: 'moderate',
		diagnosisModifier: 'TN standard',
		misdiagnosis: 'Cholera or minor illness.',
		treatments: [
			{ description: 'Intravenous and ingested fluid replacement', bonus: '+3' },
			{ description: 'Relief of pain and fever', bonus: '+1' },
		],
		recoveryTiming: '1 week after symptom onset',
		recoveryCheckModifier: 'TN +2',
		recoveryOutcome: 'Fatigue cannot drop below slight for 1d6 days, then returns to normal.',
		failureOutcome: 'Death on margin of failure 9+; otherwise fatigue cannot drop below moderate for 1 week, then below slight for 1 week.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	foodPoisoning: {
		id: 'foodPoisoning',
		name: 'Food Poisoning',
		vectors: ['Contaminated food.'],
		contagionModifier: 'TN -2',
		symptomsAndEffects: 'After 4d6 hours, severe abdominal pain, cramps, vomiting, and slight fever. Fatigue cannot drop below moderate and daily water requirement increases by 1 liter.',
		fatigueFloor: 'moderate',
		additionalWaterRequirementLiters: 1,
		diagnosisModifier: 'TN standard',
		misdiagnosis: 'Cholera or another variety of food poisoning.',
		treatments: [
			{ description: 'Roll 1d10 for specific food poisoning variety', bonus: 'Determines whether symptom relief and antitoxin or antibiotic treatment applies.' },
			{ description: 'Symptom relief', bonus: '+2 or +4 depending on variety' },
			{ description: 'Specific antitoxin or antibiotic', bonus: '+3 to +5 depending on variety' },
		],
		recoveryTiming: '1 week after symptom onset',
		recoveryCheckModifier: 'TN -3',
		recoveryOutcome: 'Fatigue cannot drop below slight for 1 week, then returns to normal.',
		failureOutcome: 'Death on margin of failure 7+; otherwise fatigue cannot drop below moderate for 1 week, then below slight for 1 week.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	hepatitisA: {
		id: 'hepatitisA',
		name: 'Hepatitis-A',
		vectors: ['Bodily contact and poor hygiene, or contaminated food or water.'],
		contagionModifier: 'TN -2; prior infection gives +1 to resist recurrence',
		symptomsAndEffects: 'Asymptomatic for 1d6 weeks, then body pain, fever, malaise, and jaundice. Fatigue cannot drop below moderate.',
		fatigueFloor: 'moderate',
		diagnosisModifier: 'TN -2',
		misdiagnosis: 'Minor illness.',
		treatments: [
			{ description: 'Relief of pain and fever', bonus: '+2' },
		],
		recoveryTiming: '1 week after symptom onset',
		recoveryCheckModifier: 'TN +3',
		recoveryOutcome: 'Fatigue cannot drop below slight for 1 week, then returns to normal.',
		failureOutcome: 'Death on margin of failure 9+; otherwise fatigue cannot drop below moderate for 1 week, then below slight for 1 week.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	influenza: {
		id: 'influenza',
		name: 'Influenza',
		vectors: ['Bodily contact, airborne particulates, or droppings of infected birds.'],
		contagionModifier: 'TN -3',
		symptomsAndEffects: 'After 1d3 days, fever, chills, and body pain. Fatigue cannot drop below moderate. Another 1d3 days later, symptoms worsen and fatigue cannot drop below serious.',
		fatigueFloor: 'serious',
		diagnosisModifier: 'TN -2',
		misdiagnosis: 'Minor illness.',
		treatments: [
			{ description: 'Relief of pain and fever', bonus: '+2' },
			{ description: 'Specific antiviral medication', bonus: '+2d6L' },
		],
		recoveryTiming: '1 week after symptom onset',
		recoveryCheckModifier: 'TN -1d6',
		recoveryOutcome: 'Fatigue cannot drop below slight for 1 week, then returns to normal.',
		failureOutcome: 'Death on margin of failure 7+; otherwise the victim immediately progresses to late-stage pneumonia.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	minorIllness: {
		id: 'minorIllness',
		name: 'Minor Illness',
		vectors: ['Any human, animal, water, or food contact.'],
		contagionModifier: 'TN standard',
		symptomsAndEffects: 'Incubation 1d3 days, then fever, headache, body pain, nausea, vomiting, diarrhea, rash, discoloration, or similar symptoms. Fatigue cannot drop below slight.',
		fatigueFloor: 'slight',
		diagnosisModifier: 'TN -3 to +3 at GM discretion',
		misdiagnosis: 'Any other illness, usually another minor one.',
		treatments: [
			{ description: 'Roll 1d20 for exact illness family', bonus: 'Determines whether symptom relief, antitoxin, or antibiotic treatment applies.' },
			{ description: 'Symptom relief', bonus: '+1 to +4 depending on variety' },
			{ description: 'Specific antitoxin or antibiotic', bonus: '+2 to +5 depending on variety' },
		],
		recoveryTiming: '1d20 days after symptom onset',
		recoveryCheckModifier: 'TN -1',
		recoveryOutcome: 'No further problems.',
		failureOutcome: 'Fatigue cannot drop below slight for 1d6 days, then returns to normal.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	pneumonia: {
		id: 'pneumonia',
		name: 'Pneumonia',
		vectors: ['Bodily contact or airborne particulates.'],
		contagionModifier: 'TN -3',
		symptomsAndEffects: 'After 1d6 days, coughing, chest pain, fever, and discomfort. Fatigue cannot drop below slight. Another 1d6 days later, fluid in the lungs develops and fatigue cannot drop below moderate.',
		fatigueFloor: 'moderate',
		diagnosisModifier: 'TN standard',
		misdiagnosis: 'Minor illness, pneumonic plague, or another pneumonia variant.',
		treatments: [
			{ description: 'Roll 1d10 for pneumonia variety', bonus: 'Determines whether Gram-positive, Gram-negative, or symptom-only treatment applies.' },
			{ description: 'Symptom relief', bonus: '+2 or +4 depending on variety' },
			{ description: '2 units of antibiotic', bonus: '+3 for susceptible bacterial varieties' },
		],
		recoveryTiming: '2 weeks after symptom onset',
		recoveryCheckModifier: 'TN standard',
		recoveryOutcome: 'No further problems.',
		failureOutcome: 'Death on margin of failure 9+; otherwise fatigue cannot drop below slight for 1 week.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	pneumonicPlague: {
		id: 'pneumonicPlague',
		name: 'Pneumonic Plague',
		vectors: ['Bodily contact or airborne particulates.'],
		contagionModifier: 'TN -4',
		symptomsAndEffects: 'After 1d6 days, fever, swollen lymph nodes, severe abdominal pain, severe coughing, and chills. Fatigue cannot drop below serious.',
		fatigueFloor: 'serious',
		diagnosisModifier: 'TN standard',
		misdiagnosis: 'Minor illness or pneumonia.',
		treatments: [
			{ description: '2 units of Gram-negative antibiotic', bonus: '+3 in the first week, otherwise +1' },
			{ description: 'Relief of pain and fever', bonus: '+1' },
		],
		recoveryTiming: '2 weeks after symptom onset',
		recoveryCheckModifier: 'TN -2',
		recoveryOutcome: 'Fatigue cannot drop below moderate for 2d6 weeks, then below slight for 2d6 weeks, then returns to normal.',
		failureOutcome: 'Death.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	rabies: {
		id: 'rabies',
		name: 'Rabies',
		vectors: ['Blood or saliva, usually through an animal bite.'],
		contagionModifier: 'TN -1',
		symptomsAndEffects: 'After 2d6 weeks, fever, malaise, and sore throat. Fatigue cannot drop below slight. Two weeks after onset, severe pain, hypersalivation, sweating, hallucinations, paranoia, and violent behavior develop; late-stage victims are no longer playable.',
		fatigueFloor: 'slight',
		diagnosisModifier: 'TN standard',
		misdiagnosis: 'Minor illness.',
		treatments: [
			{ description: 'Begin the full 4-week rabies vaccination process before initial symptoms', bonus: 'Automatic recovery on completion' },
			{ description: 'Incomplete vaccination course', bonus: '+1 per completed week toward the standard recovery check' },
		],
		recoveryTiming: 'Upon treatment completion',
		recoveryCheckModifier: 'No Fitness check if full treatment completes',
		recoveryOutcome: 'Automatic recovery if treatment finishes before symptoms begin.',
		failureOutcome: 'Death 1 week after onset of late-stage symptoms if untreated or if recovery fails.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	typhoidFever: {
		id: 'typhoidFever',
		name: 'Typhoid Fever',
		vectors: ['Bodily contact or contaminated food or water.'],
		contagionModifier: 'TN -2',
		symptomsAndEffects: 'After 1d3 days, severe fever, pain, coughing, and apathy. Fatigue cannot drop below moderate.',
		fatigueFloor: 'moderate',
		diagnosisModifier: 'TN -3',
		misdiagnosis: 'Pneumonia or pneumonic plague.',
		treatments: [
			{ description: '3 units of Gram-negative antibiotic', bonus: '+4' },
		],
		recoveryTiming: '3 weeks after symptom onset',
		recoveryCheckModifier: 'TN +1',
		recoveryOutcome: 'Fatigue cannot drop below slight for 1 month, then returns to normal.',
		failureOutcome: 'Death on margin of failure 9+; otherwise fatigue cannot drop below moderate for 1 month, then below slight for 1 month.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
	typhus: {
		id: 'typhus',
		name: 'Typhus',
		vectors: ['Body lice.'],
		contagionModifier: 'TN -2',
		symptomsAndEffects: 'After 1 day, headache, fever, and rash. Fatigue cannot drop below slight.',
		fatigueFloor: 'slight',
		diagnosisModifier: 'TN +3',
		misdiagnosis: 'Minor illness.',
		treatments: [
			{ description: '2 units of any antibiotic', bonus: '+3' },
		],
		recoveryTiming: '2 weeks after symptom onset',
		recoveryCheckModifier: 'TN +1',
		recoveryOutcome: 'No further penalties.',
		failureOutcome: 'Death on margin of failure 8+; otherwise fatigue cannot drop below slight for 2 weeks.',
		source: SURVIVAL_DISEASE_SOURCE,
	},
};

function getDiseaseTable(vector: DiseaseExposureVector): Record<number, DiseaseId> {
	if (vector === 'animalContact') {
		return ANIMAL_DISEASE_BY_2D6;
	}

	if (vector === 'contaminatedWater') {
		return WATER_DISEASE_BY_2D6;
	}

	return HUMAN_DISEASE_BY_2D6;
}

export function getHumanDiseaseExposureThreshold(shelter: ShelterGrade): number {
	return HUMAN_EXPOSURE_THRESHOLD_BY_SHELTER[shelter];
}

export function isDiseaseExposureTriggered(vector: DiseaseExposureVector, exposureRoll: number, shelter: ShelterGrade = 'adequate'): boolean {
	if (vector === 'humanContact') {
		return exposureRoll >= getHumanDiseaseExposureThreshold(shelter);
	}

	return exposureRoll >= 12;
}

export function getDiseaseFromExposure(vector: DiseaseExposureVector, diseaseRoll: number): DiseaseId {
	return getDiseaseTable(vector)[diseaseRoll];
}

export function resolveDiseaseExposure(
	vector: DiseaseExposureVector,
	exposureRoll: number,
	diseaseRoll: number,
	shelter: ShelterGrade = 'adequate',
): DiseaseExposureResult {
	if (!isDiseaseExposureTriggered(vector, exposureRoll, shelter)) {
		return {
			exposed: false,
			diseaseId: null,
		};
	}

	return {
		exposed: true,
		diseaseId: getDiseaseFromExposure(vector, diseaseRoll),
	};
}

export function getDiseaseDefinition(diseaseId: DiseaseId): DiseaseDefinition {
	return DISEASE_DEFINITIONS[diseaseId];
}