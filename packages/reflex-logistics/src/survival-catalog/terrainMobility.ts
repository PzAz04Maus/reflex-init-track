import { createItemDefinition } from "../inventory";
import type { ItemDefinition } from "../types";

const SRC = "Source: Twilight 2013 Core OEF PDF p.226";

// Aquatic Gear
export const AQUATIC_GEAR: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:dive-computer",
		name: "Dive Computer",
		weight: 0.3,
		tags: ["survival", "aquatic", "electronic"],
		barterValue: "GG150",
		streetPrice: 1200,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:scuba-gear",
		name: "SCUBA Gear",
		weight: 20,
		tags: ["survival", "aquatic", "scuba"],
		barterValue: "GG500",
		streetPrice: 2000,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:snorkel",
		name: "Snorkel",
		weight: 2,
		tags: ["survival", "aquatic"],
		barterValue: "GG5",
		streetPrice: 40,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:swim-fins",
		name: "Swim Fins",
		weight: 1,
		tags: ["survival", "aquatic"],
		barterValue: "GG5",
		streetPrice: 40,
		source: [SRC],
	}),
];

// Climbing Gear
export const CLIMBING_GEAR: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:climbing-harness",
		name: "Climbing Harness",
		weight: 0.4,
		tags: ["survival", "climbing"],
		barterValue: "GG1",
		streetPrice: 80,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:climbing-kit",
		name: "Climbing Kit",
		weight: 5,
		tags: ["survival", "climbing"],
		barterValue: "GG250",
		streetPrice: 2000,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:grapnel",
		name: "Grapnel",
		weight: 0.8,
		tags: ["survival", "climbing"],
		barterValue: "GG30",
		streetPrice: 150,
		source: [SRC],
	}),
];

// Freefall Gear
export const FREEFALL_GEAR: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:altimeter",
		name: "Altimeter",
		weight: 0.2,
		tags: ["survival", "freefall"],
		barterValue: "GG40",
		streetPrice: 160,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:halo-bottle",
		name: "HALO Bottle",
		weight: 6,
		tags: ["survival", "freefall", "halo"],
		barterValue: "GG580",
		streetPrice: 375,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:parachute-military",
		name: "Parachute, Military",
		weight: 9.6,
		tags: ["survival", "freefall", "parachute", "military"],
		barterValue: "GG120",
		streetPrice: 1200,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:parachute-reserve",
		name: "Parachute, Reserve",
		weight: 6.7,
		tags: ["survival", "freefall", "parachute"],
		barterValue: "GG90",
		streetPrice: 900,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:parachute-sports",
		name: "Parachute, Sports",
		weight: 7.4,
		tags: ["survival", "freefall", "parachute"],
		barterValue: "GG180",
		streetPrice: 1800,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:paraglider-solo",
		name: "Paraglider, Solo",
		weight: 7.2,
		tags: ["survival", "freefall", "paraglider"],
		barterValue: "GG600",
		streetPrice: 2400,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:paraglider-tandem",
		name: "Paraglider, Tandem",
		weight: 8.6,
		tags: ["survival", "freefall", "paraglider"],
		barterValue: "GG750",
		streetPrice: 3000,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:paramotor",
		name: "Paramotor",
		weight: 25,
		tags: ["survival", "freefall", "paramotor", "gasoline"],
		barterValue: "GG875",
		streetPrice: 3500,
		source: [SRC],
	}),
];

// Snow and Ice Gear
export const SNOW_AND_ICE_GEAR: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:skis-cross-country",
		name: "Skis, Cross-Country",
		weight: 7,
		tags: ["survival", "snow-ice", "skis"],
		barterValue: "GG75",
		streetPrice: 1500,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:skis-downhill",
		name: "Skis, Downhill",
		weight: 7,
		tags: ["survival", "snow-ice", "skis"],
		barterValue: "GG65",
		streetPrice: 1300,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:snowshoes",
		name: "Snowshoes",
		weight: 2,
		tags: ["survival", "snow-ice"],
		barterValue: "GG9",
		streetPrice: 180,
		source: [SRC],
	}),
];

export const TERRAIN_MOBILITY_ITEMS: ItemDefinition[] = [
	...AQUATIC_GEAR,
	...CLIMBING_GEAR,
	...FREEFALL_GEAR,
	...SNOW_AND_ICE_GEAR,
];
