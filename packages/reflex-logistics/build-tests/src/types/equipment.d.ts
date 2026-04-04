import type { ArmorStats } from "./armor";
import { ItemDefinition, ItemInstance } from "./items";
import type { ItemDefinitionInit, ItemInstanceInit } from "./items";
import type { InventoryLocation } from "./common";
import type { RangedWeaponStats } from "./weapons";
export interface RangedWeaponDefinitionInit extends ItemDefinitionInit {
    rangedWeapon: RangedWeaponStats;
}
export interface ArmorDefinitionInit extends ItemDefinitionInit {
    armor: ArmorStats;
}
export interface RangedWeaponInstanceInit extends ItemInstanceInit {
    rangedWeapon: RangedWeaponStats;
}
export interface ArmorInstanceInit extends ItemInstanceInit {
    armor: ArmorStats;
}
export declare class RangedWeaponDefinition extends ItemDefinition {
    rangedWeapon: RangedWeaponStats;
    constructor(input: RangedWeaponDefinitionInit);
    protected toInit(): RangedWeaponDefinitionInit;
    isFirearm(): boolean;
    hasWeaponTrait(trait: string): boolean;
    isCrewServed(): boolean;
    requiresEmplacement(): boolean;
    supportsAttachmentKind(kind: string): boolean;
    getOptimumPenetration(): string;
    getMaximumPenetration(): string;
    getOptimumRange(): string;
    getMaximumRange(): string;
    instantiate(input?: Omit<RangedWeaponInstanceInit, keyof RangedWeaponDefinitionInit | "quantity"> & {
        quantity?: number;
    }): RangedWeaponInstance;
}
export declare class ArmorDefinition extends ItemDefinition {
    armor: ArmorStats;
    constructor(input: ArmorDefinitionInit);
    protected toInit(): ArmorDefinitionInit;
    coversLocation(location: string): boolean;
    hasArmorTrait(trait: string): boolean;
    instantiate(input?: Omit<ArmorInstanceInit, keyof ArmorDefinitionInit | "quantity"> & {
        quantity?: number;
    }): ArmorInstance;
}
export declare class RangedWeaponInstance extends ItemInstance {
    rangedWeapon: RangedWeaponStats;
    constructor(input: RangedWeaponInstanceInit);
    protected toInit(): RangedWeaponDefinitionInit;
    protected toInstanceInit(): RangedWeaponInstanceInit;
    isFirearm(): boolean;
    hasWeaponTrait(trait: string): boolean;
    isCrewServed(): boolean;
    requiresEmplacement(): boolean;
    supportsAttachmentKind(kind: string): boolean;
    getOptimumPenetration(): string;
    getMaximumPenetration(): string;
    getOptimumRange(): string;
    getMaximumRange(): string;
    withQuantity(quantity: number): RangedWeaponInstance;
    withLocation(location: InventoryLocation): RangedWeaponInstance;
    withCarryMode(carryMode?: string): RangedWeaponInstance;
    withAttachmentIds(attachmentIds?: string[]): RangedWeaponInstance;
    withAttachedToItemId(attachedToItemId?: string): RangedWeaponInstance;
}
export declare class ArmorInstance extends ItemInstance {
    armor: ArmorStats;
    constructor(input: ArmorInstanceInit);
    protected toInit(): ArmorDefinitionInit;
    protected toInstanceInit(): ArmorInstanceInit;
    coversLocation(location: string): boolean;
    hasArmorTrait(trait: string): boolean;
    withQuantity(quantity: number): ArmorInstance;
    withLocation(location: InventoryLocation): ArmorInstance;
    withCarryMode(carryMode?: string): ArmorInstance;
    withAttachmentIds(attachmentIds?: string[]): ArmorInstance;
    withAttachedToItemId(attachedToItemId?: string): ArmorInstance;
}
//# sourceMappingURL=equipment.d.ts.map