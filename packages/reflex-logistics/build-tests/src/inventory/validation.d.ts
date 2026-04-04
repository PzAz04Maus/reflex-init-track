import type { InventoryLocation, InventoryState, ItemInstance, ContainerInstance } from "../types";
export declare function assertItemFitsInContainer(state: InventoryState, item: ItemInstance, destination: InventoryLocation): void;
export declare function assertContainerFitsInContainer(state: InventoryState, container: ContainerInstance, destination: InventoryLocation): void;
export declare function canMoveItemToContainer(state: InventoryState, itemId: string, containerId: string): boolean;
//# sourceMappingURL=validation.d.ts.map