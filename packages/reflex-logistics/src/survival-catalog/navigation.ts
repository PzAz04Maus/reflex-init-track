import { createItemDefinition } from "../inventory";
import type { ItemDefinition } from "../types";

const SRC = "Source: Twilight 2013 Core OEF PDF p.226";

export const NAVIGATION_ITEMS: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:compass",
		name: "Compass",
		weight: 0,
		tags: ["survival", "navigation"],
		barterValue: "GG2.5",
		streetPrice: 10,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:gps-civilian-basic",
		name: "GPS, Civilian, Basic",
		weight: 0.1,
		tags: ["survival", "navigation", "gps", "electronic"],
		barterValue: "GG60",
		streetPrice: 120,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:gps-civilian-mapping",
		name: "GPS, Civilian, Mapping",
		weight: 0.2,
		tags: ["survival", "navigation", "gps", "electronic"],
		barterValue: "GG225",
		streetPrice: 450,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:gps-military-basic",
		name: "GPS, Military, Basic",
		weight: 0.1,
		tags: ["survival", "navigation", "gps", "electronic", "military"],
		barterValue: "GG90",
		streetPrice: 120,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:gps-military-mapping",
		name: "GPS, Military, Mapping",
		weight: 0.2,
		tags: ["survival", "navigation", "gps", "electronic", "military"],
		barterValue: "GG340",
		streetPrice: 450,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:map-gps-data-card",
		name: "Map, GPS Data Card",
		weight: 0,
		tags: ["survival", "navigation", "map"],
		barterValue: "GG50",
		streetPrice: 100,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:map-printed",
		name: "Map, Printed",
		weight: 0,
		tags: ["survival", "navigation", "map"],
		barterValue: "GG0.5",
		streetPrice: 5,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:sextant",
		name: "Sextant",
		weight: 2,
		tags: ["survival", "navigation", "sextant"],
		barterValue: "GG350",
		streetPrice: 700,
		source: [SRC],
	}),
];
