"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AMMUNITION_HANDLING_ITEMS = void 0;
const helpers_1 = require("./helpers");
exports.AMMUNITION_HANDLING_ITEMS = [
    (0, helpers_1.defineAccessoryItem)({
        id: "accessory:bandolier",
        name: "Bandolier",
        weight: 0.5,
        tags: ["weapon-accessory", "ammo-handling", "bandolier"],
        barterValue: "GG1.75",
        streetPrice: 35,
        description: "Adjustable webbing bandolier for ready ammunition carry. Available by ammunition type.",
    }),
    (0, helpers_1.defineAccessoryItem)({
        id: "accessory:spare-magazine",
        name: "Magazine, Spare",
        weight: 0.05,
        tags: ["weapon-accessory", "ammo-handling", "spare-magazine"],
        barterValue: "GG0.2/10 rds.",
        streetPrice: "$20/10 rds.",
        description: "Empty spare magazine or drum. Weight and cost scale by about 10 rounds of capacity.",
    }),
    (0, helpers_1.defineWeaponAttachment)({
        id: "attachment:shotgun:side-saddle",
        name: "Side Saddle",
        kind: "side-saddle",
        compatibleWeaponTags: ["shotgun"],
        tags: ["weapon-accessory", "ammo-handling", "side-saddle"],
        weight: 0.2,
        barterValue: "GG1.25",
        streetPrice: 25,
        description: "Stock-mounted ammunition carrier. The common shotgun version holds 8 loose rounds.",
        notes: ["Cannot be mounted on a folding stock."],
    }),
    (0, helpers_1.defineAccessoryItem)({
        id: "accessory:speedloader",
        name: "Speedloader",
        weight: 0.1,
        tags: ["weapon-accessory", "ammo-handling", "speedloader"],
        barterValue: "GG1.5",
        streetPrice: 15,
        description: "Revolver loading aid that lets a shooter reload a full cylinder with a single Reload action.",
    }),
    (0, helpers_1.defineAccessoryItem)({
        id: "accessory:stripper-clip",
        name: "Stripper Clip",
        weight: 0,
        tags: ["weapon-accessory", "ammo-handling", "stripper-clip"],
        barterValue: "GG0.02",
        streetPrice: 2,
        description: "Clip for rapidly loading an internal magazine rifle with a single Reload action.",
    }),
];
