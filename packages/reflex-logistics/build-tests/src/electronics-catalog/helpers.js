"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.defineElectronicItem = defineElectronicItem;
exports.defineBatteryDevice = defineBatteryDevice;
exports.defineRechargeableDevice = defineRechargeableDevice;
exports.defineAcPoweredDevice = defineAcPoweredDevice;
const inventory_1 = require("../inventory");
function withTags(tags, extraTags) {
    const mergedTags = [...(tags ?? []), ...extraTags];
    return mergedTags.length > 0
        ? [...new Set(mergedTags)]
        : undefined;
}
function defineElectronicItem(input) {
    const { powered, ...item } = input;
    return (0, inventory_1.createItemDefinition)({
        ...item,
        tags: withTags(item.tags, powered ? ["powered"] : []),
    });
}
function defineBatteryDevice(input) {
    return defineElectronicItem({
        ...input,
        powered: true,
        power: {
            kind: "battery",
            batteryCount: input.batteryCount,
            batterySize: input.batterySize,
            runtimeHours: input.runtimeHours,
        },
    });
}
function defineRechargeableDevice(input) {
    return defineElectronicItem({
        ...input,
        powered: true,
        power: {
            kind: "rechargeable",
            runtimeHours: input.runtimeHours,
            rechargeHoursPerHourUsed: input.rechargeHoursPerHourUsed ?? 0.5,
        },
    });
}
function defineAcPoweredDevice(input) {
    return defineElectronicItem({
        ...input,
        powered: true,
        power: {
            kind: "ac",
            kilowatts: input.kilowatts,
        },
    });
}
