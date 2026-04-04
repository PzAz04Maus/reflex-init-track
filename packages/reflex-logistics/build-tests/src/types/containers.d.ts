import type { InventoryLocation, StorageMode, VoucherDefinition, VoucherPool } from "./common";
export interface ContainerDefinitionInit {
    id: string;
    name: string;
    capacityWeight?: number;
    voucherDefinitions?: VoucherDefinition[];
    voucherLimits?: VoucherPool;
    description?: string;
    defaultMode?: StorageMode;
}
export interface ContainerInstanceInit extends ContainerDefinitionInit {
    mode?: StorageMode;
    location?: InventoryLocation;
}
export declare class ContainerDefinition {
    id: string;
    name: string;
    capacityWeight?: number;
    voucherDefinitions?: VoucherDefinition[];
    voucherLimits?: VoucherPool;
    description?: string;
    defaultMode?: StorageMode;
    constructor(input: ContainerDefinitionInit);
    protected toInit(): ContainerDefinitionInit;
    hasVoucher(key: string): boolean;
    instantiate(input?: Omit<ContainerInstanceInit, keyof ContainerDefinitionInit>): ContainerInstance;
}
export declare class ContainerInstance extends ContainerDefinition {
    mode: StorageMode;
    location: InventoryLocation;
    constructor(input: ContainerInstanceInit);
    private toInstanceInit;
    isAt(location: InventoryLocation): boolean;
    withMode(mode: StorageMode): ContainerInstance;
    withLocation(location: InventoryLocation): ContainerInstance;
}
//# sourceMappingURL=containers.d.ts.map