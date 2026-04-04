import { createItemDefinition } from "../inventory";
import type { ItemDefinition } from "../types";

const SRC = "Source: Twilight 2013 Core OEF PDF p.224";

export const SANITATION_ITEMS: ItemDefinition[] = [
	createItemDefinition({
		id: "survival:hand-sanitizer-50ml",
		name: "Hand Sanitizer, 50 mL",
		weight: 0,
		tags: ["survival", "sanitation"],
		barterValue: "GG0.1",
		streetPrice: 5,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:mobile-restroom",
		name: "Mobile Restroom",
		weight: 900,
		tags: ["survival", "sanitation", "mobile-restroom"],
		barterValue: "GG1200",
		streetPrice: 12000,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:portable-toilet",
		name: "Portable Toilet",
		weight: 3.2,
		tags: ["survival", "sanitation"],
		barterValue: "GG2.25",
		streetPrice: 90,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:solar-shower",
		name: "Solar Shower",
		weight: 0.4,
		tags: ["survival", "sanitation", "solar"],
		barterValue: "GG2",
		streetPrice: 20,
		source: [SRC],
	}),
	createItemDefinition({
		id: "survival:toilet-tissue",
		name: "Toilet Tissue, 1 Roll",
		weight: 0.1,
		tags: ["survival", "sanitation"],
		barterValue: "GG0.12",
		streetPrice: 0.25,
		source: [SRC],
	}),
];
