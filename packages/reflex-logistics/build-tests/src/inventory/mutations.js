"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addContainer = addContainer;
exports.addItem = addItem;
exports.attachItem = attachItem;
exports.detachItem = detachItem;
exports.setItemCarryMode = setItemCarryMode;
exports.addHumanoidEquipmentContainer = addHumanoidEquipmentContainer;
exports.addQuadrupedEquipmentContainer = addQuadrupedEquipmentContainer;
exports.addAmorphousEquipmentContainer = addAmorphousEquipmentContainer;
exports.toggleContainerMode = toggleContainerMode;
exports.moveItem = moveItem;
exports.moveContainer = moveContainer;
const factories_1 = require("./factories");
const shared_1 = require("./shared");
const validation_1 = require("./validation");
function addContainer(state, container) {
    if (state.containers[container.id]) {
        throw new Error(`Container already exists: ${container.id}`);
    }
    if (container.location.kind === "container") {
        (0, shared_1.assertContainerExists)(state, container.location.containerId);
        (0, validation_1.assertContainerFitsInContainer)(state, container, container.location);
    }
    return {
        ...state,
        containers: {
            ...state.containers,
            [container.id]: container,
        },
    };
}
function addItem(state, item) {
    if (state.items[item.id]) {
        throw new Error(`Item already exists: ${item.id}`);
    }
    if (item.location.kind === "container") {
        (0, shared_1.assertContainerExists)(state, item.location.containerId);
        (0, validation_1.assertItemFitsInContainer)(state, item, item.location);
    }
    if (item.attachedToItemId && !state.items[item.attachedToItemId]) {
        throw new Error(`Cannot attach item to unknown host: ${item.attachedToItemId}`);
    }
    return {
        ...state,
        items: {
            ...state.items,
            [item.id]: item,
        },
    };
}
function attachItem(state, hostItemId, attachmentItemId) {
    const host = state.items[hostItemId];
    const attachment = state.items[attachmentItemId];
    if (!host) {
        throw new Error(`Unknown host item: ${hostItemId}`);
    }
    if (!attachment) {
        throw new Error(`Unknown attachment item: ${attachmentItemId}`);
    }
    if (hostItemId === attachmentItemId) {
        throw new Error("An item cannot attach to itself.");
    }
    return {
        ...state,
        items: {
            ...state.items,
            [hostItemId]: host.withAttachmentIds(Array.from(new Set([...(host.attachmentIds ?? []), attachmentItemId]))),
            [attachmentItemId]: attachment.withAttachedToItemId(hostItemId).withLocation(host.location),
        },
    };
}
function detachItem(state, attachmentItemId) {
    const attachment = state.items[attachmentItemId];
    if (!attachment) {
        throw new Error(`Unknown attachment item: ${attachmentItemId}`);
    }
    if (!attachment.attachedToItemId) {
        return state;
    }
    const host = state.items[attachment.attachedToItemId];
    return {
        ...state,
        items: {
            ...state.items,
            ...(host
                ? {
                    [host.id]: host.withAttachmentIds((host.attachmentIds ?? []).filter((id) => id !== attachmentItemId)),
                }
                : {}),
            [attachmentItemId]: attachment.withAttachedToItemId(undefined),
        },
    };
}
function setItemCarryMode(state, itemId, carryMode) {
    const item = state.items[itemId];
    if (!item) {
        throw new Error(`Unknown item: ${itemId}`);
    }
    const effectiveCarryProfiles = (0, shared_1.getEffectiveCarryProfiles)(state, item);
    if (!effectiveCarryProfiles || !effectiveCarryProfiles[carryMode]) {
        throw new Error(`Unknown carry mode '${carryMode}' for item ${itemId}`);
    }
    return {
        ...state,
        items: {
            ...state.items,
            [itemId]: item.withCarryMode(carryMode),
        },
    };
}
function addHumanoidEquipmentContainer(state, options = {}) {
    const container = (0, factories_1.createHumanoidEquipmentContainer)(options);
    return addContainer(state, container.equipment);
}
function addQuadrupedEquipmentContainer(state, options = {}) {
    const container = (0, factories_1.createQuadrupedEquipmentContainer)(options);
    return addContainer(state, container.equipment);
}
function addAmorphousEquipmentContainer(state, options = {}) {
    const container = (0, factories_1.createAmorphousEquipmentContainer)(options);
    return addContainer(state, container.equipment);
}
function toggleContainerMode(state, containerId) {
    const container = (0, shared_1.assertContainerExists)(state, containerId);
    const nextMode = container.mode === "bag" ? "bin" : "bag";
    return {
        ...state,
        containers: {
            ...state.containers,
            [containerId]: container.withMode(nextMode),
        },
    };
}
function moveItem(state, itemId, destination) {
    const item = state.items[itemId];
    if (!item) {
        throw new Error(`Unknown item: ${itemId}`);
    }
    if (destination.kind === "container") {
        (0, shared_1.assertContainerExists)(state, destination.containerId);
    }
    if ((0, shared_1.isSameLocation)(item.location, destination)) {
        return state;
    }
    (0, validation_1.assertItemFitsInContainer)(state, item, destination);
    const movedState = {
        ...state,
        items: {
            ...state.items,
            [itemId]: item.withLocation(destination),
        },
    };
    return (item.attachmentIds ?? []).reduce((nextState, attachmentId) => {
        const attachment = nextState.items[attachmentId];
        if (!attachment) {
            return nextState;
        }
        return {
            ...nextState,
            items: {
                ...nextState.items,
                [attachmentId]: attachment.withLocation(destination),
            },
        };
    }, movedState);
}
function moveContainer(state, containerId, destination) {
    const container = (0, shared_1.assertContainerExists)(state, containerId);
    if (destination.kind === "container") {
        (0, shared_1.assertContainerExists)(state, destination.containerId);
    }
    (0, shared_1.assertNoContainerCycle)(state, containerId, destination);
    if ((0, shared_1.isSameLocation)(container.location, destination)) {
        return state;
    }
    (0, validation_1.assertContainerFitsInContainer)(state, container, destination);
    return {
        ...state,
        containers: {
            ...state.containers,
            [containerId]: container.withLocation(destination),
        },
    };
}
