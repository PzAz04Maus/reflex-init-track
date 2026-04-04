import type { ItemDefinition, ItemDefinitionInit } from "../types";
export declare function defineElectronicItem(input: ItemDefinitionInit & {
    powered?: boolean;
}): ItemDefinition;
export declare function defineBatteryDevice(input: ItemDefinitionInit & {
    batteryCount: number;
    batterySize: string;
    runtimeHours: number;
}): ItemDefinition;
export declare function defineRechargeableDevice(input: ItemDefinitionInit & {
    runtimeHours: number;
    rechargeHoursPerHourUsed?: number;
}): ItemDefinition;
export declare function defineAcPoweredDevice(input: ItemDefinitionInit & {
    kilowatts: number;
}): ItemDefinition;
//# sourceMappingURL=helpers.d.ts.map