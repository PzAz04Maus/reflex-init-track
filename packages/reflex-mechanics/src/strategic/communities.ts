import type { BuildingId, CharacterId } from '../types';

import type {
	BuildingSupplyPool,
	CommunityConstructionProject,
	CommunityId,
	CommunityRecord,
	CommunityResourceStockpile,
} from './types';

export interface CommunityState {
	communities: Record<CommunityId, CommunityRecord>;
	projects: Record<CommunityConstructionProject['id'], CommunityConstructionProject>;
}

function ensureUnique<T>(values: ReadonlyArray<T>): T[] {
	return [...new Set(values)];
}

export function createCommunityRecord(
	id: CommunityId,
	name: string,
	overrides: Partial<Omit<CommunityRecord, 'id' | 'name'>> = {},
): CommunityRecord {
	return {
		id,
		name,
		residentIds: [],
		buildingIds: [],
		resources: {},
		projectIds: [],
		...overrides,
	};
}

export function createCommunityState(
	communities: ReadonlyArray<CommunityRecord> = [],
	projects: ReadonlyArray<CommunityConstructionProject> = [],
): CommunityState {
	return {
		communities: Object.fromEntries(communities.map((community) => [community.id, community])),
		projects: Object.fromEntries(projects.map((project) => [project.id, project])),
	};
}

export function createCommunityConstructionProject(
	id: string,
	kind: CommunityConstructionProject['kind'],
	name: string,
	supplyPool: BuildingSupplyPool,
	target: number,
	overrides: Partial<Omit<CommunityConstructionProject, 'id' | 'kind' | 'name' | 'supplyPool' | 'target'>> = {},
): CommunityConstructionProject {
	return {
		id,
		kind,
		name,
		assignedWorkerIds: [],
		progress: 0,
		target,
		supplyPool,
		supplyUnitsCommitted: 0,
		...overrides,
	};
}

export function selectCommunities(state: CommunityState): CommunityRecord[] {
	return Object.values(state.communities);
}

export function selectCommunityById(state: CommunityState, communityId: CommunityId): CommunityRecord | null {
	return state.communities[communityId] ?? null;
}

export function selectProjectById(state: CommunityState, projectId: string): CommunityConstructionProject | null {
	return state.projects[projectId] ?? null;
}

export function withCommunity(state: CommunityState, community: CommunityRecord): CommunityState {
	return {
		...state,
		communities: {
			...state.communities,
			[community.id]: community,
		},
	};
}

export function withCommunityProject(state: CommunityState, project: CommunityConstructionProject): CommunityState {
	return {
		...state,
		projects: {
			...state.projects,
			[project.id]: project,
		},
	};
}

export function assignResidentToCommunity(community: CommunityRecord, residentId: CharacterId): CommunityRecord {
	return {
		...community,
		residentIds: ensureUnique([...community.residentIds, residentId]),
	};
}

export function assignBuildingToCommunity(community: CommunityRecord, buildingId: BuildingId): CommunityRecord {
	return {
		...community,
		buildingIds: ensureUnique([...community.buildingIds, buildingId]),
	};
}

export function assignProjectToCommunity(community: CommunityRecord, projectId: string): CommunityRecord {
	return {
		...community,
		projectIds: ensureUnique([...community.projectIds, projectId]),
	};
}

export function updateCommunityResources(
	community: CommunityRecord,
	resourceChanges: Partial<CommunityResourceStockpile>,
): CommunityRecord {
	return {
		...community,
		resources: {
			...community.resources,
			...resourceChanges,
		},
	};
}

export function assignWorkersToProject(
	project: CommunityConstructionProject,
	workerIds: ReadonlyArray<CharacterId>,
): CommunityConstructionProject {
	return {
		...project,
		assignedWorkerIds: ensureUnique([...project.assignedWorkerIds, ...workerIds]),
	};
}

export function advanceCommunityProject(
	project: CommunityConstructionProject,
	progressAdded: number,
	additionalSupplyUnitsCommitted = 0,
): CommunityConstructionProject {
	return {
		...project,
		progress: Math.min(project.target, project.progress + Math.max(0, progressAdded)),
		supplyUnitsCommitted: project.supplyUnitsCommitted + Math.max(0, additionalSupplyUnitsCommitted),
	};
}

export function isCommunityProjectComplete(project: CommunityConstructionProject): boolean {
	return project.progress >= project.target;
}