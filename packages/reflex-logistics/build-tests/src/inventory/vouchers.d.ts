import type { ContainerInstance, InventoryState, ItemInstance, VoucherPool } from "../types";
export declare function getItemVoucherCost(state: InventoryState, item: ItemInstance): VoucherPool;
export declare function getItemVoucherCostForContainer(state: InventoryState, item: ItemInstance, container: ContainerInstance): VoucherPool;
export declare function getChildContainerVoucherCostForContainer(childContainer: ContainerInstance, hostContainer: ContainerInstance): VoucherPool;
export declare function getItemVoucherBonus(item: ItemInstance): VoucherPool;
export declare function getContainerVoucherCost(container: ContainerInstance): VoucherPool;
export declare function getContainerVoucherBonus(container: ContainerInstance): VoucherPool;
export declare function getVoucherOverflow(limits?: VoucherPool, used?: VoucherPool): VoucherPool;
//# sourceMappingURL=vouchers.d.ts.map