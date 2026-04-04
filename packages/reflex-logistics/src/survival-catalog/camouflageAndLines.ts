import { createItemDefinition } from "../inventory";
import type { ItemDefinition } from "../types";

const SRC = "Source: Twilight 2013 Core OEF PDF p.226";

// Camouflage
export const CAMOUFLAGE_ITEMS: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:facepaint",
		name: "Facepaint",
		weight: 0.2,
		tags: ["survival", "camouflage"],
		barterValue: "GG5",
		streetPrice: 5,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:camo-netting-1m2",
		name: "Netting, 1 m²",
		weight: 0.2,
		tags: ["survival", "camouflage", "netting"],
		barterValue: "GG1.25",
		streetPrice: 5,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:camo-netting-ir-1m2",
		name: "Netting, IR, 1 m²",
		weight: 0.2,
		tags: ["survival", "camouflage", "netting", "ir"],
		barterValue: "GG2.5",
		streetPrice: 10,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:camo-tape",
		name: "Tape, Camo, 10 m Roll",
		weight: 0.1,
		tags: ["survival", "camouflage", "tape"],
		barterValue: "GG2.5",
		streetPrice: 10,
		source: [SRC],
	}),
];

// Lines
export const LINE_ITEMS: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:cable-steel-30m",
		name: "Cable, Steel, 30 m",
		weight: 11.8,
		tags: ["survival", "line", "cable", "steel"],
		barterValue: "GG4",
		streetPrice: 65,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:cable-synthetic-30m",
		name: "Cable, Synthetic, 30 m",
		weight: 1.6,
		tags: ["survival", "line", "cable", "synthetic"],
		barterValue: "GG15",
		streetPrice: 230,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:chain-steel-light-30m",
		name: "Chain, Steel, Light, 30 m",
		weight: 23,
		tags: ["survival", "line", "chain", "steel"],
		barterValue: "GG4.5",
		streetPrice: 75,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:chain-steel-heavy-30m",
		name: "Chain, Steel, Heavy, 30 m",
		weight: 462,
		tags: ["survival", "line", "chain", "steel"],
		barterValue: "GG25",
		streetPrice: 400,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:paracord-30m",
		name: "Paracord, 30 m",
		weight: 0.2,
		tags: ["survival", "line", "cord"],
		barterValue: "GG0.5",
		streetPrice: 8,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:rope-climbing-30m",
		name: "Rope, Climbing, 30 m",
		weight: 1.5,
		tags: ["survival", "line", "rope", "climbing"],
		barterValue: "GG10",
		streetPrice: 75,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:strap-cargo-10m",
		name: "Strap, Cargo, 10 m",
		weight: 1.8,
		tags: ["survival", "line", "strap"],
		barterValue: "GG2.5",
		streetPrice: 40,
		source: [SRC],
	}),
];

export const CAMOUFLAGE_AND_LINES_ITEMS: ItemDefinition[] = [
	...CAMOUFLAGE_ITEMS,
	...LINE_ITEMS,
];
