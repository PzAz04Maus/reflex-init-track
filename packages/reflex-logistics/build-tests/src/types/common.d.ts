export type StorageMode = "bag" | "bin";
export type VoucherPool = Record<string, number>;
export type VoucherType = "worn" | "held" | (string & {});
export interface VoucherDefinition {
    key: string;
    type: VoucherType;
    label: string;
    capacity: number;
    description?: string;
}
export type InventoryLocation = {
    kind: "root";
} | {
    kind: "container";
    containerId: string;
};
export interface ItemCarryProfile {
    voucherCost: VoucherPool;
    description?: string;
}
export type BatterySize = "micro" | "sm" | "med" | "lg" | (string & {});
export type FuelType = "G" | "D" | (string & {});
export interface BatteryPowerRequirement {
    kind: "battery";
    batteryCount: number;
    batterySize: BatterySize;
    runtimeHours: number;
}
export interface RechargeablePowerRequirement {
    kind: "rechargeable";
    runtimeHours: number;
    rechargeHoursPerHourUsed?: number;
}
export interface ACPowerRequirement {
    kind: "ac";
    kilowatts: number;
}
export type PowerRequirementStats = BatteryPowerRequirement | RechargeablePowerRequirement | ACPowerRequirement;
export interface FuelConsumptionStats {
    fuelType: FuelType;
    tankCapacity?: number;
    consumptionPerHour: number;
    notes?: string[];
}
export interface PowerSupplyStats {
    outputKilowatts: number;
    fuel?: FuelConsumptionStats;
    notes?: string[];
}
//# sourceMappingURL=common.d.ts.map