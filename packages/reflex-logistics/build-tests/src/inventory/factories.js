"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
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
const types_1 = require("../types");
const equipmentLayouts_1 = require("../equipmentLayouts");
const shared_1 = require("./shared");
function cloneVoucherDefinitions(vouchers) {
    return vouchers.map((voucher) => ({ ...voucher }));
}
function createInventoryState(items = [], containers = []) {
    return {
        items: Object.fromEntries(items.map((item) => [item.id, item])),
        containers: Object.fromEntries(containers.map((container) => [container.id, container])),
    };
}
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
function createContainer(id, name, mode, location = shared_1.ROOT_LOCATION) {
    return createContainerDefinition({
        id,
        name,
        defaultMode: mode,
    }).instantiate({
        mode,
        location,
    });
}
function createVoucherContainer(id, name, voucherLimits, mode = "bin", location = shared_1.ROOT_LOCATION) {
    return createVoucherContainerDefinition(id, name, voucherLimits, mode).instantiate({
        mode,
        location,
    });
}
function createTypedVoucherContainer(id, name, voucherDefinitions, mode = "bin", location = shared_1.ROOT_LOCATION) {
    return createTypedVoucherContainerDefinition(id, name, voucherDefinitions, mode).instantiate({
        mode,
        location,
    });
}
function createItemDefinition(input) {
    return new types_1.ItemDefinition(input);
}
function createRangedWeaponDefinition(input) {
    return new types_1.RangedWeaponDefinition(input);
}
function createArmorDefinition(input) {
    return new types_1.ArmorDefinition(input);
}
function createItem(input) {
    return new types_1.ItemInstance({
        ...input,
        location: input.location ?? shared_1.ROOT_LOCATION,
    });
}
function createArmor(input) {
    return new types_1.ArmorInstance({
        ...input,
        location: input.location ?? shared_1.ROOT_LOCATION,
    });
}
function instantiateItem(definition, input = {}) {
    return definition.instantiate({
        quantity: input.quantity ?? 1,
        location: input.location ?? shared_1.ROOT_LOCATION,
        attachmentIds: input.attachmentIds,
        attachedToItemId: input.attachedToItemId,
        carryMode: input.carryMode,
    });
}
function instantiateContainer(definition, input = {}) {
    return definition.instantiate({
        mode: input.mode,
        location: input.location ?? shared_1.ROOT_LOCATION,
    });
}
function createHumanoidEquipmentContainer(options = {}) {
    const { idPrefix = "humanoid", location = shared_1.ROOT_LOCATION, name = "Equipment" } = options;
    return {
        equipment: createTypedVoucherContainer(`${idPrefix}:equipment`, name, equipmentLayouts_1.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS, "bin", location),
    };
}
function createQuadrupedEquipmentContainer(options = {}) {
    const { idPrefix = "quadruped", location = shared_1.ROOT_LOCATION, name = "Equipment" } = options;
    return {
        equipment: createTypedVoucherContainer(`${idPrefix}:equipment`, name, equipmentLayouts_1.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS, "bin", location),
    };
}
function createAmorphousEquipmentContainer(options = {}) {
    const { idPrefix = "amorphous", location = shared_1.ROOT_LOCATION, name = "Equipment" } = options;
    return {
        equipment: createTypedVoucherContainer(`${idPrefix}:equipment`, name, equipmentLayouts_1.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS, "bin", location),
    };
}
