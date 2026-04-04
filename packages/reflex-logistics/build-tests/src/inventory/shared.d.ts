import type { ContainerInstance, InventoryLocation, InventoryState, ItemCarryProfile, ItemInstance, VoucherPool } from "../types";
export declare const ROOT_LOCATION: InventoryLocation;
export declare function sumVoucherPools(left?: VoucherPool, right?: VoucherPool): VoucherPool;
export declare function scaleVoucherPool(pool: VoucherPool | undefined, multiplier: number): VoucherPool;
export declare function getEffectiveCarryProfiles(state: InventoryState, item: ItemInstance): Record<string, ItemCarryProfile> | undefined;
export declare function isSameLocation(left: InventoryLocation, right: InventoryLocation): boolean;
export declare function assertContainerExists(state: InventoryState, containerId: string): ContainerInstance;
export declare function assertNoContainerCycle(state: InventoryState, containerId: string, destination: InventoryLocation): void;
//# sourceMappingURL=shared.d.ts.map