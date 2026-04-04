"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getItemVoucherCost = getItemVoucherCost;
exports.getItemVoucherCostForContainer = getItemVoucherCostForContainer;
exports.getChildContainerVoucherCostForContainer = getChildContainerVoucherCostForContainer;
exports.getItemVoucherBonus = getItemVoucherBonus;
exports.getContainerVoucherCost = getContainerVoucherCost;
exports.getContainerVoucherBonus = getContainerVoucherBonus;
exports.getVoucherOverflow = getVoucherOverflow;
const shared_1 = require("./shared");
function getBaseItemVoucherCost(state, item) {
    const effectiveCarryProfiles = (0, shared_1.getEffectiveCarryProfiles)(state, item);
    const profile = item.carryMode && effectiveCarryProfiles
        ? effectiveCarryProfiles[item.carryMode]
        : undefined;
    if (profile) {
        return profile.voucherCost;
    }
    return item.voucherCost ?? {};
}
function getItemVoucherCost(state, item) {
    return (0, shared_1.scaleVoucherPool)(getBaseItemVoucherCost(state, item), item.quantity);
}
function getItemVoucherCostForContainer(state, item, container) {
    if (!container.itemVoucherRules || container.itemVoucherRules.length === 0) {
        return getItemVoucherCost(state, item);
    }
    const matchedRule = container.itemVoucherRules.find((rule) => rule.acceptedItemTags.some((tag) => item.tags?.includes(tag)));
    if (!matchedRule) {
        throw new Error(`Item ${item.name} is not compatible with container ${container.name}.`);
    }
    return {
        [matchedRule.key]: item.quantity * (matchedRule.unitsPerItem ?? 1),
    };
}
function getChildContainerVoucherCostForContainer(childContainer, hostContainer) {
    if (!hostContainer.containerVoucherRules || hostContainer.containerVoucherRules.length === 0) {
        return getContainerVoucherCost(childContainer);
    }
    const matchedRule = hostContainer.containerVoucherRules.find((rule) => rule.acceptedContainerTags.some((tag) => childContainer.tags?.includes(tag)));
    if (!matchedRule) {
        throw new Error(`Container ${childContainer.name} is not compatible with container ${hostContainer.name}.`);
    }
    return {
        [matchedRule.key]: matchedRule.unitsPerContainer ?? 1,
    };
}
function getItemVoucherBonus(item) {
    return (0, shared_1.scaleVoucherPool)(item.voucherBonus, item.quantity);
}
function getContainerVoucherCost(container) {
    return container.voucherCost ?? {};
}
function getContainerVoucherBonus(container) {
    return container.voucherBonus ?? {};
}
function getVoucherOverflow(limits = {}, used = {}) {
    return Object.fromEntries(Object.entries(used)
        .filter(([key, value]) => value > (limits[key] ?? 0))
        .map(([key, value]) => [key, value - (limits[key] ?? 0)]));
}
