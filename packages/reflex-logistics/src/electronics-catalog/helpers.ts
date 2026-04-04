import { createItemDefinition } from "../inventory";
import type { ItemDefinition, ItemDefinitionInit } from "../types";

function withTags(tags: string[] | undefined, extraTags: string[]): string[] | undefined {
	const mergedTags = [...(tags ?? []), ...extraTags];
	return mergedTags.length > 0
		? [...new Set(mergedTags)]
		: undefined;
}

export function defineElectronicItem(input: ItemDefinitionInit & { powered?: boolean }): ItemDefinition {
	const { powered, ...item } = input;
	return createItemDefinition({
		...item,
		tags: withTags(item.tags, powered ? ["powered"] : []),
	});
}

export function defineBatteryDevice(
	input: ItemDefinitionInit & {
		batteryCount: number;
		batterySize: string;
		runtimeHours: number;
	},
): ItemDefinition {
	return defineElectronicItem({
		...input,
		powered: true,
		power: {
			kind: "battery",
			batteryCount: input.batteryCount,
			batterySize: input.batterySize,
			runtimeHours: input.runtimeHours,
		},
	});
}

export function defineRechargeableDevice(
	input: ItemDefinitionInit & {
		runtimeHours: number;
		rechargeHoursPerHourUsed?: number;
	},
): ItemDefinition {
	return defineElectronicItem({
		...input,
		powered: true,
		power: {
			kind: "rechargeable",
			runtimeHours: input.runtimeHours,
			rechargeHoursPerHourUsed: input.rechargeHoursPerHourUsed ?? 0.5,
		},
	});
}

export function defineAcPoweredDevice(
	input: ItemDefinitionInit & {
		kilowatts: number;
	},
): ItemDefinition {
	return defineElectronicItem({
		...input,
		powered: true,
		power: {
			kind: "ac",
			kilowatts: input.kilowatts,
		},
	});
}