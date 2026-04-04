import type { InventoryLocation, VoucherPool } from "./common";
import type { ContainerInstance } from "./containers";
import type { ItemInstance } from "./items";
export interface InventoryState {
    items: Record<string, ItemInstance>;
    containers: Record<string, ContainerInstance>;
}
export interface InventoryContents {
    items: ItemInstance[];
    containers: ContainerInstance[];
}
export interface VoucherUsage {
    used: VoucherPool;
    limits: VoucherPool;
    remaining: VoucherPool;
}
export interface HumanoidEquipmentOptions {
    idPrefix?: string;
    location?: InventoryLocation;
    name?: string;
}
export interface HumanoidEquipmentContainer {
    equipment: ContainerInstance;
}
export interface QuadrupedEquipmentOptions {
    idPrefix?: string;
    location?: InventoryLocation;
    name?: string;
}
export interface QuadrupedEquipmentContainer {
    equipment: ContainerInstance;
}
export interface AmorphousEquipmentOptions {
    idPrefix?: string;
    location?: InventoryLocation;
    name?: string;
}
export interface AmorphousEquipmentContainer {
    equipment: ContainerInstance;
}
//# sourceMappingURL=inventory-state.d.ts.map