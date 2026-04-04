"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ARMAMENT_TOOLS = void 0;
const inventory_1 = require("../inventory");
const SRC = "Source: Twilight 2013 Core OEF PDF p.232";
exports.ARMAMENT_TOOLS = [
    (0, inventory_1.createItemDefinition)({
        id: "tool:gun-cleaning-kit",
        name: "Gun Cleaning Kit",
        weight: 0.3,
        tags: ["tool", "armament", "cleaning"],
        barterValue: "GG10",
        streetPrice: 40,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "tool:gunsmiths-tools",
        name: "Gunsmith's Tools",
        weight: 4,
        tags: ["tool", "armament", "gunsmith"],
        barterValue: "GG75",
        streetPrice: 300,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "tool:ordnance-tools",
        name: "Ordnance Tools",
        weight: 20,
        tags: ["tool", "armament", "ordnance"],
        barterValue: "GG225",
        streetPrice: 900,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "tool:reloading-bench",
        name: "Reloading Bench",
        weight: 14,
        tags: ["tool", "armament", "reloading"],
        barterValue: "GG50",
        streetPrice: 200,
        source: [SRC],
    }),
];
