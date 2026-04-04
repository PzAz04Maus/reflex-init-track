"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineContainer = defineContainer;
exports.createItemRule = createItemRule;
exports.createContainerRule = createContainerRule;
exports.defineAttachmentContainer = defineAttachmentContainer;
const inventory_1 = require("../inventory");
function defineContainer(input) {
    return (0, inventory_1.createContainerDefinition)(input);
}
function createItemRule(key, acceptedItemTags, unitsPerItem = 1) {
    return { key, acceptedItemTags, unitsPerItem };
}
function createContainerRule(key, acceptedContainerTags, unitsPerContainer = 1) {
    return { key, acceptedContainerTags, unitsPerContainer };
}
function defineAttachmentContainer(input) {
    const voucherCost = {
        ...(input.voucherCost ?? {}),
        ...(input.attachmentPointCost !== undefined ? { "mlbe:ap": input.attachmentPointCost } : {}),
        ...(input.attachmentPointCost === undefined
            ? (input.beltComponent ? { "lbe:component": 1, "lbe:belt-component": 1 } : { "lbe:component": 1 })
            : {}),
    };
    return defineContainer({
        ...input,
        attachmentPointCost: input.attachmentPointCost,
        voucherCost,
    });
}
// TODO: capacity weight is used for liters and kilogram carrying capacities.
// Need to figure out how to handle this better, since it's confusing to have a
// weight capacity that isn't actually a weight.
