"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getContents = getContents;
exports.getContainerContents = getContainerContents;
exports.getContainerVoucherUsage = getContainerVoucherUsage;
exports.getEffectiveItemVoucherCost = getEffectiveItemVoucherCost;
exports.getRootContents = getRootContents;
const shared_1 = require("./shared");
const vouchers_1 = require("./vouchers");
function getContents(state, location = shared_1.ROOT_LOCATION) {
    return {
        items: Object.values(state.items).filter((item) => (0, shared_1.isSameLocation)(item.location, location)),
        containers: Object.values(state.containers).filter((container) => (0, shared_1.isSameLocation)(container.location, location)),
    };
}
function getContainerContents(state, containerId) {
    (0, shared_1.assertContainerExists)(state, containerId);
    return getContents(state, { kind: "container", containerId });
}
function getContainerVoucherUsage(state, containerId) {
    const container = (0, shared_1.assertContainerExists)(state, containerId);
    const contents = getContainerContents(state, containerId);
    const usedByItems = contents.items.reduce((total, item) => {
        return (0, shared_1.sumVoucherPools)(total, (0, vouchers_1.getItemVoucherCostForContainer)(state, item, container));
    }, {});
    const usedByContainers = contents.containers.reduce((total, childContainer) => {
        return (0, shared_1.sumVoucherPools)(total, (0, vouchers_1.getChildContainerVoucherCostForContainer)(childContainer, container));
    }, {});
    const grantedByItems = contents.items.reduce((total, item) => {
        return (0, shared_1.sumVoucherPools)(total, (0, vouchers_1.getItemVoucherBonus)(item));
    }, {});
    const grantedByContainers = contents.containers.reduce((total, childContainer) => {
        return (0, shared_1.sumVoucherPools)(total, (0, vouchers_1.getContainerVoucherBonus)(childContainer));
    }, {});
    const used = (0, shared_1.sumVoucherPools)(usedByItems, usedByContainers);
    const granted = (0, shared_1.sumVoucherPools)(grantedByItems, grantedByContainers);
    const limits = (0, shared_1.sumVoucherPools)(container.voucherLimits ?? {}, granted);
    const remaining = Object.fromEntries(Object.keys(limits).map((key) => [key, (limits[key] ?? 0) - (used[key] ?? 0)]));
    return {
        used,
        limits,
        remaining,
    };
}
function getEffectiveItemVoucherCost(state, itemId) {
    const item = state.items[itemId];
    if (!item) {
        throw new Error(`Unknown item: ${itemId}`);
    }
    return (0, vouchers_1.getItemVoucherCost)(state, item);
}
function getRootContents(state) {
    return getContents(state, shared_1.ROOT_LOCATION);
}
