import type {
	BuildingId,
	BuildingRecord,
	CharacterId,
	CharacterRecord,
	CharacterStrategicState,
	TacticalMovementRate,
} from '../types';

import { createBuildingState, selectBuildingById, selectBuildings, withBuilding, withoutBuilding } from './buildings';
import {
	createCommunityState,
	selectCommunities,
	selectCommunityById,
	selectProjectById,
	withCommunity,
	withCommunityProject,
	type CommunityState,
} from './communities';

import { getDiseaseDefinition } from './disease';
import { getFatigueEffects, getFatigueStageIndex } from './fatigue';
import type { CommunityConstructionProject, CommunityId, CommunityRecord, DiseaseDefinition, FatigueLevel } from './types';

export interface DerivedStrategicCombatEffects {
	effectiveFatigueLevel: FatigueLevel;
	allActionsPenalty: number;
	physicalActionsPenalty: number;
	movementCap: TacticalMovementRate | null;
}

export interface StrategicState {
	characters: Record<CharacterId, CharacterRecord>;
	buildings: Record<BuildingId, BuildingRecord>;
	communities: CommunityState['communities'];
	projects: CommunityState['projects'];
}

const FATIGUE_ORDER: FatigueLevel[] = ['rested', 'slight', 'moderate', 'serious', 'critical'];

function getMoreSevereFatigueLevel(left: FatigueLevel, right: FatigueLevel): FatigueLevel {
	return FATIGUE_ORDER[Math.max(getFatigueStageIndex(left), getFatigueStageIndex(right))];
}

function getMovementCapFromFatigue(level: FatigueLevel): TacticalMovementRate | null {
	const effects = getFatigueEffects(level);

	if (!effects.canTrot) {
		return 'walk';
	}

	if (!effects.canRun) {
		return 'trot';
	}

	if (!effects.canSprint) {
		return 'run';
	}

	return null;
}

export function createCharacterStrategicState(
	overrides: Partial<CharacterStrategicState> = {},
): CharacterStrategicState {
	return {
		fatigue: 'rested',
		shelter: 'adequate',
		sleeping: false,
		starving: false,
		dehydrated: false,
		chronicallyFatigued: false,
		activeDiseaseIds: [],
		...overrides,
	};
}

export function createStrategicState(
	characters: ReadonlyArray<CharacterRecord> = [],
	buildings: ReadonlyArray<BuildingRecord> = [],
	communities: ReadonlyArray<CommunityRecord> = [],
	projects: ReadonlyArray<CommunityConstructionProject> = [],
): StrategicState {
	const communityState = createCommunityState(communities, projects);

	return {
		characters: Object.fromEntries(characters.map((character) => [character.id, character])),
		buildings: createBuildingState(buildings).buildings,
		communities: communityState.communities,
		projects: communityState.projects,
	};
}

export function selectStrategicCharacters(state: StrategicState): CharacterRecord[] {
	return Object.values(state.characters);
}

export function selectStrategicCharacterById(state: StrategicState, characterId: CharacterId): CharacterRecord | null {
	return state.characters[characterId] ?? null;
}

export function selectStrategicBuildings(state: StrategicState): BuildingRecord[] {
	return selectBuildings({ buildings: state.buildings });
}

export function selectStrategicBuildingById(state: StrategicState, buildingId: BuildingId): BuildingRecord | null {
	return selectBuildingById({ buildings: state.buildings }, buildingId);
}

export function selectStrategicCommunities(state: StrategicState): CommunityRecord[] {
	return selectCommunities({ communities: state.communities, projects: state.projects });
}

export function selectStrategicCommunityById(state: StrategicState, communityId: CommunityId): CommunityRecord | null {
	return selectCommunityById({ communities: state.communities, projects: state.projects }, communityId);
}

export function selectStrategicProjectById(state: StrategicState, projectId: string): CommunityConstructionProject | null {
	return selectProjectById({ communities: state.communities, projects: state.projects }, projectId);
}

export function withStrategicCharacter(state: StrategicState, character: CharacterRecord): StrategicState {
	return {
		...state,
		characters: {
			...state.characters,
			[character.id]: character,
		},
	};
}

export function withoutStrategicCharacter(state: StrategicState, characterId: CharacterId): StrategicState {
	const nextCharacters = { ...state.characters };
	delete nextCharacters[characterId];

	return {
		...state,
		characters: nextCharacters,
	};
}

export function withStrategicBuilding(state: StrategicState, building: BuildingRecord): StrategicState {
	return {
		...state,
		buildings: withBuilding({ buildings: state.buildings }, building).buildings,
	};
}

export function withoutStrategicBuilding(state: StrategicState, buildingId: BuildingId): StrategicState {
	return {
		...state,
		buildings: withoutBuilding({ buildings: state.buildings }, buildingId).buildings,
	};
	}

export function withStrategicCommunity(state: StrategicState, community: CommunityRecord): StrategicState {
	const communityState = withCommunity({ communities: state.communities, projects: state.projects }, community);

	return {
		...state,
		communities: communityState.communities,
		projects: communityState.projects,
	};
}

export function withStrategicProject(state: StrategicState, project: CommunityConstructionProject): StrategicState {
	const communityState = withCommunityProject({ communities: state.communities, projects: state.projects }, project);

	return {
		...state,
		communities: communityState.communities,
		projects: communityState.projects,
	};
}

export function ensureCharacterStrategicState(
	character: Pick<CharacterRecord, 'strategic'>,
): CharacterStrategicState {
	return character.strategic ?? createCharacterStrategicState();
}

export function getActiveDiseaseDefinitions(strategic: CharacterStrategicState): DiseaseDefinition[] {
	return strategic.activeDiseaseIds.map((diseaseId) => getDiseaseDefinition(diseaseId));
}

export function getEffectiveFatigueLevel(strategic: CharacterStrategicState): FatigueLevel {
	return getActiveDiseaseDefinitions(strategic).reduce<FatigueLevel>(
		(level, disease) => disease.fatigueFloor ? getMoreSevereFatigueLevel(level, disease.fatigueFloor) : level,
		strategic.fatigue,
	);
}

export function getDerivedStrategicCombatEffects(strategic: CharacterStrategicState): DerivedStrategicCombatEffects {
	const effectiveFatigueLevel = getEffectiveFatigueLevel(strategic);
	const fatigueEffects = getFatigueEffects(effectiveFatigueLevel);

	return {
		effectiveFatigueLevel,
		allActionsPenalty: fatigueEffects.taskPenalty,
		physicalActionsPenalty: fatigueEffects.taskPenalty,
		movementCap: getMovementCapFromFatigue(effectiveFatigueLevel),
	};
}

export function setFatigueLevel(
	strategic: CharacterStrategicState,
	fatigue: FatigueLevel,
): CharacterStrategicState {
	return {
		...strategic,
		fatigue,
	};
}

export function setSleepingState(
	strategic: CharacterStrategicState,
	sleeping: boolean,
): CharacterStrategicState {
	return {
		...strategic,
		sleeping,
	};
}

export function setDiseaseState(
	strategic: CharacterStrategicState,
	activeDiseaseIds: ReadonlyArray<CharacterStrategicState['activeDiseaseIds'][number]>,
): CharacterStrategicState {
	return {
		...strategic,
		activeDiseaseIds: [...activeDiseaseIds],
	};
}