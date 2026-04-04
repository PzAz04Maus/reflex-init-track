import type { ItemCarryProfile, InventoryLocation, PowerRequirementStats, PowerSupplyStats, VoucherPool } from "./common";
import type { WeaponAttachmentStats } from "./weapons";
export interface ItemDefinitionInit {
    id: string;
    name: string;
    weight: number;
    tags?: string[];
    traits?: string[];
    notes?: string[];
    barterValue?: string;
    streetPrice?: number | string;
    duration?: string;
    powerRequirement?: string;
    power?: PowerRequirementStats;
    powerSupply?: PowerSupplyStats;
    weaponAttachment?: WeaponAttachmentStats;
    carryProfiles?: Record<string, ItemCarryProfile>;
    grantsCarryProfiles?: Record<string, ItemCarryProfile>;
    voucherCost?: VoucherPool;
    voucherBonus?: VoucherPool;
    description?: string;
    defaultCarryMode?: string;
}
export interface ItemInstanceInit extends ItemDefinitionInit {
    quantity: number;
    location?: InventoryLocation;
    attachmentIds?: string[];
    attachedToItemId?: string;
    carryMode?: string;
}
export declare class ItemDefinition {
    id: string;
    name: string;
    weight: number;
    tags?: string[];
    traits?: string[];
    notes?: string[];
    barterValue?: string;
    streetPrice?: number | string;
    duration?: string;
    powerRequirement?: string;
    power?: PowerRequirementStats;
    powerSupply?: PowerSupplyStats;
    weaponAttachment?: WeaponAttachmentStats;
    carryProfiles?: Record<string, ItemCarryProfile>;
    grantsCarryProfiles?: Record<string, ItemCarryProfile>;
    voucherCost?: VoucherPool;
    voucherBonus?: VoucherPool;
    description?: string;
    defaultCarryMode?: string;
    constructor(input: ItemDefinitionInit);
    protected toInit(): ItemDefinitionInit;
    hasTag(tag: string): boolean;
    hasTrait(trait: string): boolean;
    isWeaponAttachment(): boolean;
    hasStructuredPower(): boolean;
    requiresBatteryPower(): boolean;
    requiresRechargeablePower(): boolean;
    requiresAcPower(): boolean;
    getRechargeHoursForUsage(hoursUsed: number): number | undefined;
    getAcPowerKilowatts(): number | undefined;
    getAcPowerOutputKilowatts(): number | undefined;
    getCarryProfile(mode: string): ItemCarryProfile | undefined;
    instantiate(input?: Omit<ItemInstanceInit, keyof ItemDefinitionInit | "quantity"> & {
        quantity?: number;
    }): ItemInstance;
}
export declare class ItemInstance extends ItemDefinition {
    quantity: number;
    location: InventoryLocation;
    attachmentIds?: string[];
    attachedToItemId?: string;
    carryMode?: string;
    constructor(input: ItemInstanceInit);
    protected toInstanceInit(): ItemInstanceInit;
    isAt(location: InventoryLocation): boolean;
    withQuantity(quantity: number): ItemInstance;
    withLocation(location: InventoryLocation): ItemInstance;
    withCarryMode(carryMode?: string): ItemInstance;
    withAttachmentIds(attachmentIds?: string[]): ItemInstance;
    withAttachedToItemId(attachedToItemId?: string): ItemInstance;
}
//# sourceMappingURL=items.d.ts.map