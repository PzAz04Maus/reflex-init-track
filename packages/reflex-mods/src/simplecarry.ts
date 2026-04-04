import type {
	ContainerInstance,
	InventoryLocation,
	InventoryState,
	ItemInstance,
} from "../../reflex-logistics/src/types";

export type SimpleCarryEntityKind = "item" | "container";

export interface SimpleCarryConfig {
	carryCapacity: number;
	/**
	 * Temporary scaffold: reuse logistics `capacityWeight` as the bag capacity source.
	 * This can be replaced later with a dedicated simple-carry capacity field.
	 */
	getBagCapacity?: (container: ContainerInstance) => number | undefined;
	/**
	 * Controls which root-level locations count against actor carry capacity.
	 * Defaults to counting everything at the root as carried.
	 */
	countRootLocationAsCarried?: (location: InventoryLocation) => boolean;
}

export interface SimpleCarryBreakdownRow {
	id: string;
	name: string;
	kind: SimpleCarryEntityKind;
	ownWeight: number;
	totalWeight: number;
}

export interface SimpleCarryContainerUsage {
	containerId: string;
	containerName: string;
	capacity?: number;
	used: number;
	remaining?: number;
	withinCapacity: boolean;
}

export interface SimpleCarrySummary {
	carryCapacity: number;
	carriedWeight: number;
	remainingCarryCapacity: number;
	withinCarryCapacity: boolean;
	carried: SimpleCarryBreakdownRow[];
	containerUsage: SimpleCarryContainerUsage[];
}

export interface SimpleCarryViolation {
	kind: "carry-capacity" | "container-capacity";
	message: string;
	containerId?: string;
}

export interface SimpleCarryEvaluation {
	summary: SimpleCarrySummary;
	violations: SimpleCarryViolation[];
}

export interface SimpleCarryModel {
	config: Required<SimpleCarryConfig>;
	evaluate: (state: InventoryState) => SimpleCarryEvaluation;
	canAddItemToContainer: (state: InventoryState, item: ItemInstance, containerId: string) => boolean;
	canAddContainerToContainer: (state: InventoryState, container: ContainerInstance, hostContainerId: string) => boolean;
}

function defaultBagCapacity(container: ContainerInstance): number | undefined {
	return container.capacityWeight;
}

function defaultRootCarryFilter(location: InventoryLocation): boolean {
	return location.kind === "root";
}

function getConfiguredBagCapacity(
	config: Required<SimpleCarryConfig>,
	container: ContainerInstance,
): number | undefined {
	const capacity = config.getBagCapacity(container);
	return capacity !== undefined && capacity >= 0 ? capacity : undefined;
}

function getItemOwnWeight(item: ItemInstance): number {
	return item.weight * item.quantity;
}

function getContainerOwnWeight(container: ContainerInstance): number {
	return container.weight ?? 0;
}

function isContainedBy(location: InventoryLocation, containerId: string): boolean {
	return location.kind === "container" && location.containerId === containerId;
}

export function getDirectItemWeightInContainer(state: InventoryState, containerId: string): number {
	return Object.values(state.items)
		.filter((item) => isContainedBy(item.location, containerId))
		.reduce((total, item) => total + getItemOwnWeight(item), 0);
}

export function getDirectChildContainerIds(state: InventoryState, containerId: string): string[] {
	return Object.values(state.containers)
		.filter((container) => isContainedBy(container.location, containerId))
		.map((container) => container.id);
}

export function getContainedWeight(state: InventoryState, containerId: string): number {
	const directItemWeight = getDirectItemWeightInContainer(state, containerId);
	const childContainerWeight = getDirectChildContainerIds(state, containerId)
		.reduce((total, childContainerId) => total + getContainerTotalWeight(state, childContainerId), 0);

	return directItemWeight + childContainerWeight;
}

export function getContainerTotalWeight(state: InventoryState, containerId: string): number {
	const container = state.containers[containerId];
	if (!container) {
		throw new Error(`Unknown container: ${containerId}`);
	}

	return getContainerOwnWeight(container) + getContainedWeight(state, containerId);
}

export function getRootCarriedRows(
	state: InventoryState,
	config: Required<SimpleCarryConfig>,
): SimpleCarryBreakdownRow[] {
	const rootItems = Object.values(state.items)
		.filter((item) => config.countRootLocationAsCarried(item.location))
		.map<SimpleCarryBreakdownRow>((item) => ({
			id: item.id,
			name: item.name,
			kind: "item",
			ownWeight: getItemOwnWeight(item),
			totalWeight: getItemOwnWeight(item),
		}));

	const rootContainers = Object.values(state.containers)
		.filter((container) => config.countRootLocationAsCarried(container.location))
		.map<SimpleCarryBreakdownRow>((container) => ({
			id: container.id,
			name: container.name,
			kind: "container",
			ownWeight: getContainerOwnWeight(container),
			totalWeight: getContainerTotalWeight(state, container.id),
		}));

	return [...rootItems, ...rootContainers];
}

export function getCarriedWeight(
	state: InventoryState,
	config: Required<SimpleCarryConfig>,
): number {
	return getRootCarriedRows(state, config)
		.reduce((total, row) => total + row.totalWeight, 0);
}

export function getContainerUsage(
	state: InventoryState,
	config: Required<SimpleCarryConfig>,
	containerId: string,
): SimpleCarryContainerUsage {
	const container = state.containers[containerId];
	if (!container) {
		throw new Error(`Unknown container: ${containerId}`);
	}

	const used = getContainedWeight(state, containerId);
	const capacity = getConfiguredBagCapacity(config, container);

	return {
		containerId,
		containerName: container.name,
		capacity,
		used,
		remaining: capacity !== undefined ? capacity - used : undefined,
		withinCapacity: capacity === undefined ? true : used <= capacity,
	};
}

export function evaluateSimpleCarry(
	state: InventoryState,
	inputConfig: SimpleCarryConfig,
): SimpleCarryEvaluation {
	const config: Required<SimpleCarryConfig> = {
		carryCapacity: inputConfig.carryCapacity,
		getBagCapacity: inputConfig.getBagCapacity ?? defaultBagCapacity,
		countRootLocationAsCarried: inputConfig.countRootLocationAsCarried ?? defaultRootCarryFilter,
	};

	const carried = getRootCarriedRows(state, config);
	const carriedWeight = carried.reduce((total, row) => total + row.totalWeight, 0);
	const containerUsage = Object.keys(state.containers)
		.map((containerId) => getContainerUsage(state, config, containerId));

	const violations: SimpleCarryViolation[] = [];

	if (carriedWeight > config.carryCapacity) {
		violations.push({
			kind: "carry-capacity",
			message: `Carried weight ${carriedWeight} exceeds carry capacity ${config.carryCapacity}.`,
		});
	}

	for (const usage of containerUsage) {
		if (!usage.withinCapacity) {
			violations.push({
				kind: "container-capacity",
				containerId: usage.containerId,
				message: `Container ${usage.containerName} is over capacity by ${(usage.used - (usage.capacity ?? 0)).toFixed(2)}.`,
			});
		}
	}

	return {
		summary: {
			carryCapacity: config.carryCapacity,
			carriedWeight,
			remainingCarryCapacity: config.carryCapacity - carriedWeight,
			withinCarryCapacity: carriedWeight <= config.carryCapacity,
			carried,
			containerUsage,
		},
		violations,
	};
}

export function canAddItemToContainerSimple(
	state: InventoryState,
	item: ItemInstance,
	hostContainerId: string,
	inputConfig: SimpleCarryConfig,
): boolean {
	const config: Required<SimpleCarryConfig> = {
		carryCapacity: inputConfig.carryCapacity,
		getBagCapacity: inputConfig.getBagCapacity ?? defaultBagCapacity,
		countRootLocationAsCarried: inputConfig.countRootLocationAsCarried ?? defaultRootCarryFilter,
	};
	const hostContainer = state.containers[hostContainerId];
	if (!hostContainer) {
		return false;
	}

	const capacity = getConfiguredBagCapacity(config, hostContainer);
	if (capacity === undefined) {
		return true;
	}

	return getContainedWeight(state, hostContainerId) + getItemOwnWeight(item) <= capacity;
}

export function canAddContainerToContainerSimple(
	state: InventoryState,
	container: ContainerInstance,
	hostContainerId: string,
	inputConfig: SimpleCarryConfig,
): boolean {
	const config: Required<SimpleCarryConfig> = {
		carryCapacity: inputConfig.carryCapacity,
		getBagCapacity: inputConfig.getBagCapacity ?? defaultBagCapacity,
		countRootLocationAsCarried: inputConfig.countRootLocationAsCarried ?? defaultRootCarryFilter,
	};
	const hostContainer = state.containers[hostContainerId];
	if (!hostContainer) {
		return false;
	}

	const capacity = getConfiguredBagCapacity(config, hostContainer);
	if (capacity === undefined) {
		return true;
	}

	const nestedWeight = getContainerOwnWeight(container);
	return getContainedWeight(state, hostContainerId) + nestedWeight <= capacity;
}

export function createSimpleCarryModel(config: SimpleCarryConfig): SimpleCarryModel {
	const resolvedConfig: Required<SimpleCarryConfig> = {
		carryCapacity: config.carryCapacity,
		getBagCapacity: config.getBagCapacity ?? defaultBagCapacity,
		countRootLocationAsCarried: config.countRootLocationAsCarried ?? defaultRootCarryFilter,
	};

	return {
		config: resolvedConfig,
		evaluate: (state) => evaluateSimpleCarry(state, resolvedConfig),
		canAddItemToContainer: (state, item, hostContainerId) =>
			canAddItemToContainerSimple(state, item, hostContainerId, resolvedConfig),
		canAddContainerToContainer: (state, container, hostContainerId) =>
			canAddContainerToContainerSimple(state, container, hostContainerId, resolvedConfig),
	};
}
