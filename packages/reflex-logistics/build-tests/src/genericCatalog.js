"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.GENERIC_CATALOG = exports.RIFLE_SLING = exports.BACKPACK = void 0;
const inventory_1 = require("./inventory");
exports.BACKPACK = (0, inventory_1.createItemDefinition)({
    id: "gear:backpack",
    name: "Backpack",
    weight: 3,
    voucherCost: { "worn:torso": 1 },
});
exports.RIFLE_SLING = (0, inventory_1.createItemDefinition)({
    id: "gear:generic-sling",
    name: "Generic Sling",
    weight: 1,
    tags: ["sling"],
    grantsCarryProfiles: {
        slung: {
            voucherCost: { "worn:shoulder": 1 },
            description: "Attached host item may be carried slung without using the hands.",
        },
    },
    voucherBonus: { "worn:shoulder": 1 },
});
exports.GENERIC_CATALOG = [exports.BACKPACK, exports.RIFLE_SLING];
