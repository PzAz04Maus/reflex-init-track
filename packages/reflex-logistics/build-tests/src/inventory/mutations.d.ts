import type { AmorphousEquipmentOptions, ContainerInstance, HumanoidEquipmentOptions, InventoryLocation, InventoryState, ItemInstance, QuadrupedEquipmentOptions } from "../types";
export declare function addContainer(state: InventoryState, container: ContainerInstance): InventoryState;
export declare function addItem(state: InventoryState, item: ItemInstance): InventoryState;
export declare function attachItem(state: InventoryState, hostItemId: string, attachmentItemId: string): InventoryState;
export declare function detachItem(state: InventoryState, attachmentItemId: string): InventoryState;
export declare function setItemCarryMode(state: InventoryState, itemId: string, carryMode: string): InventoryState;
export declare function addHumanoidEquipmentContainer(state: InventoryState, options?: HumanoidEquipmentOptions): InventoryState;
export declare function addQuadrupedEquipmentContainer(state: InventoryState, options?: QuadrupedEquipmentOptions): InventoryState;
export declare function addAmorphousEquipmentContainer(state: InventoryState, options?: AmorphousEquipmentOptions): InventoryState;
export declare function toggleContainerMode(state: InventoryState, containerId: string): InventoryState;
export declare function moveItem(state: InventoryState, itemId: string, destination: InventoryLocation): InventoryState;
export declare function moveContainer(state: InventoryState, containerId: string, destination: InventoryLocation): InventoryState;
//# sourceMappingURL=mutations.d.ts.map