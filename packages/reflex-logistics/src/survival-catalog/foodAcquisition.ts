import { createItemDefinition } from "../inventory";
import type { ItemDefinition } from "../types";

const SRC = "Source: Twilight 2013 Core OEF PDF p.224";

export const FOOD_ACQUISITION_ITEMS: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:fishing-kit",
		name: "Fishing Kit",
		weight: 4,
		tags: ["survival", "food-acquisition", "fishing"],
		barterValue: "GG125",
		streetPrice: 250,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:fishing-kit-pocket",
		name: "Fishing Kit, Pocket",
		weight: 0.1,
		tags: ["survival", "food-acquisition", "fishing"],
		barterValue: "GG0.2",
		streetPrice: 20,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:gill-net",
		name: "Gill Net",
		weight: 1.5,
		tags: ["survival", "food-acquisition", "fishing", "net"],
		barterValue: "GG10",
		streetPrice: 20,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:trap-bear",
		name: "Trap, Bear",
		weight: 20,
		tags: ["survival", "food-acquisition", "trap"],
		barterValue: "GG30",
		streetPrice: 300,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:trap-box-small-game",
		name: "Trap, Box, Small Game",
		weight: 1,
		tags: ["survival", "food-acquisition", "trap"],
		barterValue: "GG8",
		streetPrice: 40,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:trap-box-vermin",
		name: "Trap, Box, Vermin",
		weight: 0.8,
		tags: ["survival", "food-acquisition", "trap"],
		barterValue: "GG5",
		streetPrice: 25,
		source: [SRC],
	}),
];
