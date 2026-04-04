"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS = exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS = exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS = exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS = exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS = exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS = void 0;
exports.createInventoryState = createInventoryState;
exports.createContainerDefinition = createContainerDefinition;
exports.createVoucherContainerDefinition = createVoucherContainerDefinition;
exports.createTypedVoucherContainerDefinition = createTypedVoucherContainerDefinition;
exports.createContainer = createContainer;
exports.createVoucherContainer = createVoucherContainer;
exports.createTypedVoucherContainer = createTypedVoucherContainer;
exports.createItemDefinition = createItemDefinition;
exports.createRangedWeaponDefinition = createRangedWeaponDefinition;
exports.createArmorDefinition = createArmorDefinition;
exports.createItem = createItem;
exports.createArmor = createArmor;
exports.instantiateItem = instantiateItem;
exports.instantiateContainer = instantiateContainer;
exports.createHumanoidEquipmentContainer = createHumanoidEquipmentContainer;
exports.createQuadrupedEquipmentContainer = createQuadrupedEquipmentContainer;
exports.createAmorphousEquipmentContainer = createAmorphousEquipmentContainer;
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
exports.getContents = getContents;
exports.getContainerContents = getContainerContents;
exports.getContainerVoucherUsage = getContainerVoucherUsage;
exports.canMoveItemToContainer = canMoveItemToContainer;
exports.getEffectiveItemVoucherCost = getEffectiveItemVoucherCost;
exports.getRootContents = getRootContents;
const types_1 = require("./types");
const equipmentLayouts_1 = require("./equipmentLayouts");
var equipmentLayouts_2 = require("./equipmentLayouts");
Object.defineProperty(exports, "DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS", { enumerable: true, get: function () { return equipmentLayouts_2.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS; } });
Object.defineProperty(exports, "DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS", { enumerable: true, get: function () { return equipmentLayouts_2.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS; } });
Object.defineProperty(exports, "DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS", { enumerable: true, get: function () { return equipmentLayouts_2.DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS; } });
Object.defineProperty(exports, "DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS", { enumerable: true, get: function () { return equipmentLayouts_2.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS; } });
Object.defineProperty(exports, "DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS", { enumerable: true, get: function () { return equipmentLayouts_2.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS; } });
Object.defineProperty(exports, "DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS", { enumerable: true, get: function () { return equipmentLayouts_2.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS; } });
// Root inventory is the default location for stowed gear.
const ROOT_LOCATION = { kind: "root" };
// Voucher helpers support abstract equip capacity accounting.
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
function getBaseItemVoucherCost(state, item) {
    const effectiveCarryProfiles = getEffectiveCarryProfiles(state, item);
    const profile = item.carryMode && effectiveCarryProfiles
        ? effectiveCarryProfiles[item.carryMode]
        : undefined;
    if (profile) {
        return profile.voucherCost;
    }
    return item.voucherCost ?? {};
}
function getItemVoucherCost(state, item) {
    return scaleVoucherPool(getBaseItemVoucherCost(state, item), item.quantity);
}
function getItemVoucherBonus(item) {
    return scaleVoucherPool(item.voucherBonus, item.quantity);
}
function getVoucherOverflow(limits = {}, used = {}) {
    return Object.fromEntries(Object.entries(used)
        .filter(([key, value]) => value > (limits[key] ?? 0))
        .map(([key, value]) => [key, value - (limits[key] ?? 0)]));
}
function cloneVoucherDefinitions(vouchers) {
    return vouchers.map((voucher) => ({ ...voucher }));
}
// Move validation enforces voucher limits on special containers like wearing or held gear.
function assertItemFitsInContainer(state, item, destination) {
    if (destination.kind !== "container") {
        return;
    }
    const container = assertContainerExists(state, destination.containerId);
    if (!container.voucherLimits) {
        return;
    }
    const currentVoucherUsage = getContainerVoucherUsage(state, destination.containerId);
    const currentUsage = currentVoucherUsage.used;
    const currentLimits = currentVoucherUsage.limits;
    const nextUsage = sumVoucherPools(currentUsage, getItemVoucherCost(state, item));
    const nextLimits = sumVoucherPools(currentLimits, getItemVoucherBonus(item));
    const overflow = getVoucherOverflow(nextLimits, nextUsage);
    if (Object.keys(overflow).length > 0) {
        const details = Object.entries(overflow)
            .map(([key, value]) => `${key}: +${value} over limit`)
            .join(", ");
        throw new Error(`Item does not fit in container ${container.name}. ${details}`);
    }
}
// Location helpers keep root and nested container comparisons consistent.
function isSameLocation(left, right) {
    if (left.kind !== right.kind) {
        return false;
    }
    if (left.kind === "root") {
        return true;
    }
    return right.kind === "container" && left.containerId === right.containerId;
}
// Container guards centralize not-found checks.
function assertContainerExists(state, containerId) {
    const container = state.containers[containerId];
    if (!container) {
        throw new Error(`Unknown container: ${containerId}`);
    }
    return container;
}
// Nested containers cannot be moved into themselves or their descendants.
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
// State constructors build normalized inventory records.
function createInventoryState(items = [], containers = []) {
    return {
        items: Object.fromEntries(items.map((item) => [item.id, item])),
        containers: Object.fromEntries(containers.map((container) => [container.id, container])),
    };
}
// General-purpose storage definition factory.
function createContainerDefinition(input) {
    return new types_1.ContainerDefinition(input);
}
function createVoucherContainerDefinition(id, name, voucherLimits, defaultMode = "bin") {
    return new types_1.ContainerDefinition({
        id,
        name,
        voucherLimits,
        defaultMode,
    });
}
function createTypedVoucherContainerDefinition(id, name, voucherDefinitions, defaultMode = "bin") {
    return new types_1.ContainerDefinition({
        id,
        name,
        voucherDefinitions: cloneVoucherDefinitions(voucherDefinitions),
        voucherLimits: Object.fromEntries(voucherDefinitions.map((voucher) => [voucher.key, voucher.capacity])),
        defaultMode,
    });
}
// General-purpose storage container factory.
function createContainer(id, name, mode, location = ROOT_LOCATION) {
    return createContainerDefinition({
        id,
        name,
        defaultMode: mode,
    }).instantiate({
        mode,
        location,
    });
}
// Voucher container factory for abstract equip states like wearing or held.
function createVoucherContainer(id, name, voucherLimits, mode = "bin", location = ROOT_LOCATION) {
    return createVoucherContainerDefinition(id, name, voucherLimits, mode).instantiate({
        mode,
        location,
    });
}
// Typed voucher container factory preserves voucher metadata alongside derived limits.
function createTypedVoucherContainer(id, name, voucherDefinitions, mode = "bin", location = ROOT_LOCATION) {
    return createTypedVoucherContainerDefinition(id, name, voucherDefinitions, mode).instantiate({
        mode,
        location,
    });
}
// Item factory with object-style input for readable gear definitions.
function createItemDefinition(input) {
    return new types_1.ItemDefinition(input);
}
function createRangedWeaponDefinition(input) {
    return new types_1.RangedWeaponDefinition(input);
}
function createArmorDefinition(input) {
    return new types_1.ArmorDefinition(input);
}
// Item factory creates a runtime inventory item from raw data.
function createItem(input) {
    return new types_1.ItemInstance({
        ...input,
        location: input.location ?? ROOT_LOCATION,
    });
}
function createArmor(input) {
    return new types_1.ArmorInstance({
        ...input,
        location: input.location ?? ROOT_LOCATION,
    });
}
// Instantiate a runtime inventory item from a reusable static definition.
function instantiateItem(definition, input = {}) {
    return definition.instantiate({
        quantity: input.quantity ?? 1,
        location: input.location ?? ROOT_LOCATION,
        attachmentIds: input.attachmentIds,
        attachedToItemId: input.attachedToItemId,
        carryMode: input.carryMode,
    });
}
function instantiateContainer(definition, input = {}) {
    return definition.instantiate({
        mode: input.mode,
        location: input.location ?? ROOT_LOCATION,
    });
}
// Default equipment container factory for a humanoid's combined worn and held gear.
function createHumanoidEquipmentContainer(options = {}) {
    const { idPrefix = "humanoid", location = ROOT_LOCATION, name = "Equipment" } = options;
    return {
        equipment: createTypedVoucherContainer(`${idPrefix}:equipment`, name, equipmentLayouts_1.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS, "bin", location),
    };
}
// Default equipment container factory for a quadruped's equipment layout.
function createQuadrupedEquipmentContainer(options = {}) {
    const { idPrefix = "quadruped", location = ROOT_LOCATION, name = "Equipment" } = options;
    return {
        equipment: createTypedVoucherContainer(`${idPrefix}:equipment`, name, equipmentLayouts_1.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS, "bin", location),
    };
}
// Default equipment container factory for an amorphous creature using generic slots.
function createAmorphousEquipmentContainer(options = {}) {
    const { idPrefix = "amorphous", location = ROOT_LOCATION, name = "Equipment" } = options;
    return {
        equipment: createTypedVoucherContainer(`${idPrefix}:equipment`, name, equipmentLayouts_1.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS, "bin", location),
    };
}
// Mutations add new containers after validating their destination.
function addContainer(state, container) {
    if (state.containers[container.id]) {
        throw new Error(`Container already exists: ${container.id}`);
    }
    if (container.location.kind === "container") {
        assertContainerExists(state, container.location.containerId);
    }
    return {
        ...state,
        containers: {
            ...state.containers,
            [container.id]: container,
        },
    };
}
// Mutations add new items after validating their destination.
function addItem(state, item) {
    if (state.items[item.id]) {
        throw new Error(`Item already exists: ${item.id}`);
    }
    if (item.location.kind === "container") {
        assertContainerExists(state, item.location.containerId);
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
// Attach an item to a host item and keep their locations aligned.
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
// Detach an item from its host, preserving its current location.
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
// Carry mode changes allow items to swap voucher profiles, such as ready vs slung.
function setItemCarryMode(state, itemId, carryMode) {
    const item = state.items[itemId];
    if (!item) {
        throw new Error(`Unknown item: ${itemId}`);
    }
    const effectiveCarryProfiles = getEffectiveCarryProfiles(state, item);
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
// Convenience setup for installing a humanoid's default equipment container into state.
function addHumanoidEquipmentContainer(state, options = {}) {
    const container = createHumanoidEquipmentContainer(options);
    return addContainer(state, container.equipment);
}
// Convenience setup for installing a quadruped's default equipment container into state.
function addQuadrupedEquipmentContainer(state, options = {}) {
    const container = createQuadrupedEquipmentContainer(options);
    return addContainer(state, container.equipment);
}
// Convenience setup for installing an amorphous creature's default equipment container into state.
function addAmorphousEquipmentContainer(state, options = {}) {
    const container = createAmorphousEquipmentContainer(options);
    return addContainer(state, container.equipment);
}
// Simple mode toggle supports bag/bin presentation without affecting location.
function toggleContainerMode(state, containerId) {
    const container = assertContainerExists(state, containerId);
    const nextMode = container.mode === "bag" ? "bin" : "bag";
    return {
        ...state,
        containers: {
            ...state.containers,
            [containerId]: container.withMode(nextMode),
        },
    };
}
// Item moves enforce both destination existence and voucher-capacity rules.
function moveItem(state, itemId, destination) {
    const item = state.items[itemId];
    if (!item) {
        throw new Error(`Unknown item: ${itemId}`);
    }
    if (destination.kind === "container") {
        assertContainerExists(state, destination.containerId);
    }
    if (isSameLocation(item.location, destination)) {
        return state;
    }
    assertItemFitsInContainer(state, item, destination);
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
// Container moves preserve tree integrity by rejecting cycles.
function moveContainer(state, containerId, destination) {
    const container = assertContainerExists(state, containerId);
    if (destination.kind === "container") {
        assertContainerExists(state, destination.containerId);
    }
    assertNoContainerCycle(state, containerId, destination);
    if (isSameLocation(container.location, destination)) {
        return state;
    }
    return {
        ...state,
        containers: {
            ...state.containers,
            [containerId]: container.withLocation(destination),
        },
    };
}
// Generic contents query for root or any nested container location.
function getContents(state, location = ROOT_LOCATION) {
    return {
        items: Object.values(state.items).filter((item) => isSameLocation(item.location, location)),
        containers: Object.values(state.containers).filter((container) => isSameLocation(container.location, location)),
    };
}
// Container-specific contents query.
function getContainerContents(state, containerId) {
    assertContainerExists(state, containerId);
    return getContents(state, { kind: "container", containerId });
}
// Voucher usage query reports used, total, and remaining equip capacity.
function getContainerVoucherUsage(state, containerId) {
    const container = assertContainerExists(state, containerId);
    const used = getContainerContents(state, containerId).items.reduce((total, item) => {
        return sumVoucherPools(total, getItemVoucherCost(state, item));
    }, {});
    const granted = getContainerContents(state, containerId).items.reduce((total, item) => {
        return sumVoucherPools(total, getItemVoucherBonus(item));
    }, {});
    const limits = sumVoucherPools(container.voucherLimits ?? {}, granted);
    const remaining = Object.fromEntries(Object.keys(limits).map((key) => [key, (limits[key] ?? 0) - (used[key] ?? 0)]));
    return {
        used,
        limits,
        remaining,
    };
}
// Fast boolean check for UI previews before attempting a move.
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
// Effective voucher cost query resolves carry-mode and attachment-dependent item load.
function getEffectiveItemVoucherCost(state, itemId) {
    const item = state.items[itemId];
    if (!item) {
        throw new Error(`Unknown item: ${itemId}`);
    }
    return getItemVoucherCost(state, item);
}
// Root contents query is a convenience wrapper for top-level gear.
function getRootContents(state) {
    return getContents(state, ROOT_LOCATION);
}
