import { createItemDefinition } from "../inventory";
import type { ItemDefinition } from "../types";

const SRC = "Source: Twilight 2013 Core OEF PDF p.232";

export const ARMAMENT_TOOLS: ItemDefinition[] = [
	createItemDefinition({
		id: "tool:gun-cleaning-kit",
		name: "Gun Cleaning Kit",
		weight: 0.3,
		tags: ["tool", "armament", "cleaning"],
		barterValue: "GG10",
		streetPrice: 40,
		source: [SRC],
	}),
	createItemDefinition({
		id: "tool:gunsmiths-tools",
		name: "Gunsmith's Tools",
		weight: 4,
		tags: ["tool", "armament", "gunsmith"],
		barterValue: "GG75",
		streetPrice: 300,
		source: [SRC],
	}),
	createItemDefinition({
		id: "tool:ordnance-tools",
		name: "Ordnance Tools",
		weight: 20,
		tags: ["tool", "armament", "ordnance"],
		barterValue: "GG225",
		streetPrice: 900,
		source: [SRC],
	}),
	createItemDefinition({
		id: "tool:reloading-bench",
		name: "Reloading Bench",
		weight: 14,
		tags: ["tool", "armament", "reloading"],
		barterValue: "GG50",
		streetPrice: 200,
		source: [SRC],
	}),
];
