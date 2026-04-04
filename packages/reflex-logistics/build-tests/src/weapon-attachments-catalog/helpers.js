"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineWeaponAttachment = defineWeaponAttachment;
exports.defineAccessoryItem = defineAccessoryItem;
const inventory_1 = require("../inventory");
const RANGE_BAND_MAP = {
    P: "Personal",
    GF: "Gunfighting",
    CQB: "CQB",
    T: "Tight",
    M: "Medium",
    O: "Open",
    S: "Sniping",
    EX: "Extreme",
};
function parseRange(range) {
    const [optimum, maximum] = range.split("/");
    return {
        optimum: RANGE_BAND_MAP[optimum],
        maximum: maximum ? RANGE_BAND_MAP[maximum] : undefined,
    };
}
function parseSpeed(speed) {
    const [hip, snap, aimed] = speed.split("/").map((value) => Number(value.replace(/[^0-9.-]/g, "")));
    return { hip, snap, aimed };
}
function defineWeaponAttachment(input) {
    const speedModifier = input.speedModifier
        ? parseSpeed(input.speedModifier)
        : undefined;
    return (0, inventory_1.createItemDefinition)({
        id: input.id,
        name: input.name,
        weight: input.weight,
        tags: ["weapon-attachment", ...input.compatibleWeaponTags, ...(input.tags ?? [])],
        traits: input.traits,
        barterValue: input.barterValue,
        streetPrice: input.streetPrice,
        powerRequirement: input.powerRequirement,
        description: input.description,
        grantsCarryProfiles: input.grantsCarryProfiles,
        voucherBonus: input.voucherBonus,
        weaponAttachment: {
            kind: input.kind,
            compatibleWeaponTags: input.compatibleWeaponTags,
            modifier: {
                rangeOverride: input.range ? parseRange(input.range) : undefined,
                speedModifier,
                accuracyModifier: input.accuracyModifier,
                visualRangeModifier: input.visualRangeModifier,
                recoilModifierPercent: input.recoilModifierPercent,
                bulkOverride: input.bulkOverride,
                weightModifierPercent: input.weightModifierPercent,
            },
            notes: input.notes,
        },
    });
}
function defineAccessoryItem(input) {
    return (0, inventory_1.createItemDefinition)({
        id: input.id,
        name: input.name,
        weight: input.weight,
        tags: input.tags,
        traits: input.traits,
        barterValue: input.barterValue,
        streetPrice: input.streetPrice,
        powerRequirement: input.powerRequirement,
        description: input.description,
        grantsCarryProfiles: input.grantsCarryProfiles,
        voucherBonus: input.voucherBonus,
    });
}
