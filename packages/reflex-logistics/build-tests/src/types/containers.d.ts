import type { InventoryLocation, StorageMode, VoucherDefinition, VoucherPool } from "./common";
export interface ContainerItemVoucherRule {
    key: string;
    acceptedItemTags: string[];
    unitsPerItem?: number;
}
export interface ContainerChildVoucherRule {
    key: string;
    acceptedContainerTags: string[];
    unitsPerContainer?: number;
}
export interface ContainerDefinitionInit {
    id: string;
    name: string;
    weight?: number;
    capacityWeight?: number;
    attachmentPointCost?: number;
    itemVoucherRules?: ContainerItemVoucherRule[];
    containerVoucherRules?: ContainerChildVoucherRule[];
    tags?: string[];
    barterValue?: string;
    streetPrice?: number;
    voucherDefinitions?: VoucherDefinition[];
    voucherLimits?: VoucherPool;
    voucherCost?: VoucherPool;
    voucherBonus?: VoucherPool;
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
    weight?: number;
    capacityWeight?: number;
    attachmentPointCost?: number;
    itemVoucherRules?: ContainerItemVoucherRule[];
    containerVoucherRules?: ContainerChildVoucherRule[];
    tags?: string[];
    barterValue?: string;
    streetPrice?: number;
    voucherDefinitions?: VoucherDefinition[];
    voucherLimits?: VoucherPool;
    voucherCost?: VoucherPool;
    voucherBonus?: VoucherPool;
    description?: string;
    defaultMode?: StorageMode;
    constructor(input: ContainerDefinitionInit);
    protected toInit(): ContainerDefinitionInit;
    hasTag(tag: string): boolean;
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