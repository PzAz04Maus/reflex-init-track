"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ROOT_LOCATION = void 0;
exports.sumVoucherPools = sumVoucherPools;
exports.scaleVoucherPool = scaleVoucherPool;
exports.getEffectiveCarryProfiles = getEffectiveCarryProfiles;
exports.isSameLocation = isSameLocation;
exports.assertContainerExists = assertContainerExists;
exports.assertNoContainerCycle = assertNoContainerCycle;
exports.ROOT_LOCATION = { kind: "root" };
function sumVoucherPools(left = {}, right = {}) {
    const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
    return Object.fromEntries([...keys].map((key) => [key, (left[key] ?? 0) + (right[key] ?? 0)]));
}
function scaleVoucherPool(pool = {}, multiplier) {
    return Object.fromEntries(Object.entries(pool).map(([key, value]) => [key, value * multiplier]));
}
function getEffectiveCarryProfiles(state, item) {
    const attachmentProfiles = (item.attachmentIds ?? []).reduce((profiles, attachmentId) => {
        const attachment = state.items[attachmentId];
        if (!attachment?.grantsCarryProfiles) {
            return profiles;
        }
        return {
            ...profiles,
            ...attachment.grantsCarryProfiles,
        };
    }, {});
    const mergedProfiles = {
        ...attachmentProfiles,
        ...(item.carryProfiles ?? {}),
    };
    return Object.keys(mergedProfiles).length > 0 ? mergedProfiles : undefined;
}
function isSameLocation(left, right) {
    if (left.kind !== right.kind) {
        return false;
    }
    if (left.kind === "root") {
        return true;
    }
    return right.kind === "container" && left.containerId === right.containerId;
}
function assertContainerExists(state, containerId) {
    const container = state.containers[containerId];
    if (!container) {
        throw new Error(`Unknown container: ${containerId}`);
    }
    return container;
}
function assertNoContainerCycle(state, containerId, destination) {
    if (destination.kind === "root") {
        return;
    }
    if (destination.containerId === containerId) {
        throw new Error("A container cannot be moved into itself.");
    }
    let current = state.containers[destination.containerId];
    while (current) {
        if (current.id === containerId) {
            throw new Error("A container cannot be moved into one of its descendants.");
        }
        current = current.location.kind === "container"
            ? state.containers[current.location.containerId]
            : undefined;
    }
}
