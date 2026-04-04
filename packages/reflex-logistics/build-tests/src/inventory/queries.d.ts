import type { InventoryContents, InventoryLocation, InventoryState, VoucherPool, VoucherUsage } from "../types";
export declare function getContents(state: InventoryState, location?: InventoryLocation): InventoryContents;
export declare function getContainerContents(state: InventoryState, containerId: string): InventoryContents;
export declare function getContainerVoucherUsage(state: InventoryState, containerId: string): VoucherUsage;
export declare function getEffectiveItemVoucherCost(state: InventoryState, itemId: string): VoucherPool;
export declare function getRootContents(state: InventoryState): InventoryContents;
//# sourceMappingURL=queries.d.ts.map