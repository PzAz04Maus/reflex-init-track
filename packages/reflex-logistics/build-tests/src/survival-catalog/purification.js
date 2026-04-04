"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.PURIFICATION_ITEMS = void 0;
const inventory_1 = require("../inventory");
const SRC = "Source: Twilight 2013 Core OEF PDF p.224";
exports.PURIFICATION_ITEMS = [
    (0, inventory_1.createItemDefinition)({
        id: "survival:filter-group-small",
        name: "Filter, Group, Small",
        weight: 3,
        tags: ["survival", "purification", "water-filter"],
        barterValue: "GG60",
        streetPrice: 300,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "survival:filter-group-large",
        name: "Filter, Group, Large",
        weight: 28,
        tags: ["survival", "purification", "water-filter"],
        barterValue: "GG240",
        streetPrice: 1200,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "survival:filter-personal",
        name: "Filter, Personal",
        weight: 0.5,
        tags: ["survival", "purification", "water-filter"],
        barterValue: "GG29",
        streetPrice: 145,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "survival:filter-cartridge-group",
        name: "Filter Cartridge, Group",
        weight: 1.5,
        tags: ["survival", "purification", "filter-cartridge"],
        barterValue: "GG26",
        streetPrice: 130,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "survival:filter-cartridge-personal",
        name: "Filter Cartridge, Personal",
        weight: 0.2,
        tags: ["survival", "purification", "filter-cartridge"],
        barterValue: "GG12",
        streetPrice: 60,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "survival:purification-tablets",
        name: "Purification Tablets",
        weight: 0.2,
        tags: ["survival", "purification"],
        barterValue: "GG5",
        streetPrice: 10,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "survival:uv-purifier",
        name: "UV Purifier",
        weight: 0.2,
        tags: ["survival", "purification", "uv"],
        barterValue: "GG16",
        streetPrice: 80,
        source: [SRC],
    }),
    (0, inventory_1.createItemDefinition)({
        id: "survival:uv-purifier-rechargeable",
        name: "UV Purifier, Rechargeable",
        weight: 0.3,
        tags: ["survival", "purification", "uv", "rechargeable"],
        barterValue: "GG90",
        streetPrice: 180,
        source: [SRC],
    }),
];
