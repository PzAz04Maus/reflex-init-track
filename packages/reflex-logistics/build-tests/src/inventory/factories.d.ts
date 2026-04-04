import { ArmorDefinition, ArmorInstance, ContainerDefinition, ItemDefinition, ItemInstance, RangedWeaponDefinition } from "../types";
import type { ArmorDefinitionInit, ArmorInstanceInit, AmorphousEquipmentContainer, AmorphousEquipmentOptions, ContainerDefinitionInit, ContainerInstance, ContainerInstanceInit, HumanoidEquipmentContainer, HumanoidEquipmentOptions, InventoryState, InventoryLocation, ItemDefinitionInit, ItemInstanceInit, QuadrupedEquipmentContainer, QuadrupedEquipmentOptions, RangedWeaponDefinitionInit, StorageMode, VoucherDefinition, VoucherPool } from "../types";
export declare function createInventoryState(items?: ItemInstance[], containers?: ContainerInstance[]): InventoryState;
export declare function createContainerDefinition(input: ContainerDefinitionInit): ContainerDefinition;
export declare function createVoucherContainerDefinition(id: string, name: string, voucherLimits: VoucherPool, defaultMode?: StorageMode): ContainerDefinition;
export declare function createTypedVoucherContainerDefinition(id: string, name: string, voucherDefinitions: VoucherDefinition[], defaultMode?: StorageMode): ContainerDefinition;
export declare function createContainer(id: string, name: string, mode: StorageMode, location?: InventoryLocation): ContainerInstance;
export declare function createVoucherContainer(id: string, name: string, voucherLimits: VoucherPool, mode?: StorageMode, location?: InventoryLocation): ContainerInstance;
export declare function createTypedVoucherContainer(id: string, name: string, voucherDefinitions: VoucherDefinition[], mode?: StorageMode, location?: InventoryLocation): ContainerInstance;
export declare function createItemDefinition(input: ItemDefinitionInit): ItemDefinition;
export declare function createRangedWeaponDefinition(input: RangedWeaponDefinitionInit): RangedWeaponDefinition;
export declare function createArmorDefinition(input: ArmorDefinitionInit): ArmorDefinition;
export declare function createItem(input: ItemInstanceInit): ItemInstance;
export declare function createArmor(input: ArmorInstanceInit): ArmorInstance;
export declare function instantiateItem(definition: ItemDefinition, input?: {
    quantity?: number;
    location?: InventoryLocation;
    attachmentIds?: string[];
    attachedToItemId?: string;
    carryMode?: string;
}): ItemInstance;
export declare function instantiateContainer(definition: ContainerDefinition, input?: Omit<ContainerInstanceInit, keyof ContainerDefinitionInit>): ContainerInstance;
export declare function createHumanoidEquipmentContainer(options?: HumanoidEquipmentOptions): HumanoidEquipmentContainer;
export declare function createQuadrupedEquipmentContainer(options?: QuadrupedEquipmentOptions): QuadrupedEquipmentContainer;
export declare function createAmorphousEquipmentContainer(options?: AmorphousEquipmentOptions): AmorphousEquipmentContainer;
//# sourceMappingURL=factories.d.ts.map