"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SPECIALIST_TOOLS = void 0;
const inventory_1 = require("../inventory");
const SRC = "Source: Twilight 2013 Core OEF PDF p.232";
exports.SPECIALIST_TOOLS = [
    (0, inventory_1.createItemDefinition)({
        id: "tool:demolition-tools",
        name: "Demolition Tools",
        weight: 2.5,
        tags: ["tool", "specialist", "demolition"],
        barterValue: "GG150",
        streetPrice: 300,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "tool:locksmiths-tools",
        name: "Locksmith's Tools",
        weight: 1,
        tags: ["tool", "specialist", "locksmith"],
        barterValue: "GG125",
        streetPrice: 250,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "tool:portable-darkroom-basic",
        name: "Portable Darkroom, Basic",
        weight: 3,
        tags: ["tool", "specialist", "darkroom", "photography"],
        barterValue: "GG12.5",
        streetPrice: 50,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "tool:portable-darkroom-advanced",
        name: "Portable Darkroom, Advanced",
        weight: 18,
        tags: ["tool", "specialist", "darkroom", "photography"],
        barterValue: "GG600",
        streetPrice: 2400,
        source: [SRC],
    }),
];
