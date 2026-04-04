"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.assertItemFitsInContainer = assertItemFitsInContainer;
exports.assertContainerFitsInContainer = assertContainerFitsInContainer;
exports.canMoveItemToContainer = canMoveItemToContainer;
const shared_1 = require("./shared");
const queries_1 = require("./queries");
const vouchers_1 = require("./vouchers");
function assertItemFitsInContainer(state, item, destination) {
    if (destination.kind !== "container") {
        return;
    }
    const container = (0, shared_1.assertContainerExists)(state, destination.containerId);
    if (!container.voucherLimits) {
        return;
    }
    const currentVoucherUsage = (0, queries_1.getContainerVoucherUsage)(state, destination.containerId);
    const currentUsage = currentVoucherUsage.used;
    const currentLimits = currentVoucherUsage.limits;
    const nextUsage = (0, shared_1.sumVoucherPools)(currentUsage, (0, vouchers_1.getItemVoucherCostForContainer)(state, item, container));
    const nextLimits = (0, shared_1.sumVoucherPools)(currentLimits, (0, vouchers_1.getItemVoucherBonus)(item));
    const overflow = (0, vouchers_1.getVoucherOverflow)(nextLimits, nextUsage);
    if (Object.keys(overflow).length > 0) {
        const details = Object.entries(overflow)
            .map(([key, value]) => `${key}: +${value} over limit`)
            .join(", ");
        throw new Error(`Item does not fit in container ${container.name}. ${details}`);
    }
}
function assertContainerFitsInContainer(state, container, destination) {
    if (destination.kind !== "container") {
        return;
    }
    const hostContainer = (0, shared_1.assertContainerExists)(state, destination.containerId);
    if (!hostContainer.voucherLimits) {
        return;
    }
    const currentVoucherUsage = (0, queries_1.getContainerVoucherUsage)(state, destination.containerId);
    const currentUsage = currentVoucherUsage.used;
    const currentLimits = currentVoucherUsage.limits;
    const nextUsage = (0, shared_1.sumVoucherPools)(currentUsage, (0, vouchers_1.getChildContainerVoucherCostForContainer)(container, hostContainer));
    const nextLimits = (0, shared_1.sumVoucherPools)(currentLimits, (0, vouchers_1.getContainerVoucherBonus)(container));
    const overflow = (0, vouchers_1.getVoucherOverflow)(nextLimits, nextUsage);
    if (Object.keys(overflow).length > 0) {
        const details = Object.entries(overflow)
            .map(([key, value]) => `${key}: +${value} over limit`)
            .join(", ");
        throw new Error(`Container does not fit in container ${hostContainer.name}. ${details}`);
    }
}
function canMoveItemToContainer(state, itemId, containerId) {
    const item = state.items[itemId];
    if (!item) {
        return false;
    }
    try {
        assertItemFitsInContainer(state, item, { kind: "container", containerId });
        return true;
    }
    catch {
        return false;
    }
}
