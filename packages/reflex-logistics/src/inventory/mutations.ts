import type {
  AmorphousEquipmentOptions,
  ContainerInstance,
  HumanoidEquipmentOptions,
  InventoryLocation,
  InventoryState,
  ItemInstance,
  QuadrupedEquipmentOptions,
  StorageMode,
} from "../types";
import {
  createAmorphousEquipmentContainer,
  createHumanoidEquipmentContainer,
  createQuadrupedEquipmentContainer,
} from "./factories";
import {
  assertContainerExists,
  assertNoContainerCycle,
  getEffectiveCarryProfiles,
  isSameLocation,
} from "./shared";
import { assertContainerFitsInContainer, assertItemFitsInContainer } from "./validation";

export function addContainer(state: InventoryState, container: ContainerInstance): InventoryState {
  if (state.containers[container.id]) {
    throw new Error(`Container already exists: ${container.id}`);
  }

  if (container.location.kind === "container") {
    assertContainerExists(state, container.location.containerId);
    assertContainerFitsInContainer(state, container, container.location);
  }

  return {
    ...state,
    containers: {
      ...state.containers,
      [container.id]: container,
    },
  };
}

export function addItem(state: InventoryState, item: ItemInstance): InventoryState {
  if (state.items[item.id]) {
    throw new Error(`Item already exists: ${item.id}`);
  }

  if (item.location.kind === "container") {
    assertContainerExists(state, item.location.containerId);
    assertItemFitsInContainer(state, item, item.location);
  }

  if (item.attachedToItemId && !state.items[item.attachedToItemId]) {
    throw new Error(`Cannot attach item to unknown host: ${item.attachedToItemId}`);
  }

  return {
    ...state,
    items: {
      ...state.items,
      [item.id]: item,
    },
  };
}

export function attachItem(
  state: InventoryState,
  hostItemId: string,
  attachmentItemId: string,
): InventoryState {
  const host = state.items[hostItemId];
  const attachment = state.items[attachmentItemId];

  if (!host) {
    throw new Error(`Unknown host item: ${hostItemId}`);
  }

  if (!attachment) {
    throw new Error(`Unknown attachment item: ${attachmentItemId}`);
  }

  if (hostItemId === attachmentItemId) {
    throw new Error("An item cannot attach to itself.");
  }

  return {
    ...state,
    items: {
      ...state.items,
      [hostItemId]: host.withAttachmentIds(
        Array.from(new Set([...(host.attachmentIds ?? []), attachmentItemId])),
      ),
      [attachmentItemId]: attachment.withAttachedToItemId(hostItemId).withLocation(host.location),
    },
  };
}

export function detachItem(state: InventoryState, attachmentItemId: string): InventoryState {
  const attachment = state.items[attachmentItemId];
  if (!attachment) {
    throw new Error(`Unknown attachment item: ${attachmentItemId}`);
  }

  if (!attachment.attachedToItemId) {
    return state;
  }

  const host = state.items[attachment.attachedToItemId];
  return {
    ...state,
    items: {
      ...state.items,
      ...(host
        ? {
            [host.id]: host.withAttachmentIds(
              (host.attachmentIds ?? []).filter((id) => id !== attachmentItemId),
            ),
          }
        : {}),
      [attachmentItemId]: attachment.withAttachedToItemId(undefined),
    },
  };
}

export function setItemCarryMode(
  state: InventoryState,
  itemId: string,
  carryMode: string,
): InventoryState {
  const item = state.items[itemId];
  if (!item) {
    throw new Error(`Unknown item: ${itemId}`);
  }

  const effectiveCarryProfiles = getEffectiveCarryProfiles(state, item);
  if (!effectiveCarryProfiles || !effectiveCarryProfiles[carryMode]) {
    throw new Error(`Unknown carry mode '${carryMode}' for item ${itemId}`);
  }

  return {
    ...state,
    items: {
      ...state.items,
      [itemId]: item.withCarryMode(carryMode),
    },
  };
}

export function addHumanoidEquipmentContainer(
  state: InventoryState,
  options: HumanoidEquipmentOptions = {},
): InventoryState {
  const container = createHumanoidEquipmentContainer(options);
  return addContainer(state, container.equipment);
}

export function addQuadrupedEquipmentContainer(
  state: InventoryState,
  options: QuadrupedEquipmentOptions = {},
): InventoryState {
  const container = createQuadrupedEquipmentContainer(options);
  return addContainer(state, container.equipment);
}

export function addAmorphousEquipmentContainer(
  state: InventoryState,
  options: AmorphousEquipmentOptions = {},
): InventoryState {
  const container = createAmorphousEquipmentContainer(options);
  return addContainer(state, container.equipment);
}

export function toggleContainerMode(
  state: InventoryState,
  containerId: string,
): InventoryState {
  const container = assertContainerExists(state, containerId);
  const nextMode: StorageMode = container.mode === "bag" ? "bin" : "bag";

  return {
    ...state,
    containers: {
      ...state.containers,
      [containerId]: container.withMode(nextMode),
    },
  };
}

export function moveItem(
  state: InventoryState,
  itemId: string,
  destination: InventoryLocation,
): InventoryState {
  const item = state.items[itemId];
  if (!item) {
    throw new Error(`Unknown item: ${itemId}`);
  }

  if (destination.kind === "container") {
    assertContainerExists(state, destination.containerId);
  }

  if (isSameLocation(item.location, destination)) {
    return state;
  }

  assertItemFitsInContainer(state, item, destination);

  const movedState = {
    ...state,
    items: {
      ...state.items,
      [itemId]: item.withLocation(destination),
    },
  };

  return (item.attachmentIds ?? []).reduce((nextState, attachmentId) => {
    const attachment = nextState.items[attachmentId];
    if (!attachment) {
      return nextState;
    }

    return {
      ...nextState,
      items: {
        ...nextState.items,
        [attachmentId]: attachment.withLocation(destination),
      },
    };
  }, movedState);
}

export function moveContainer(
  state: InventoryState,
  containerId: string,
  destination: InventoryLocation,
): InventoryState {
  const container = assertContainerExists(state, containerId);

  if (destination.kind === "container") {
    assertContainerExists(state, destination.containerId);
  }

  assertNoContainerCycle(state, containerId, destination);

  if (isSameLocation(container.location, destination)) {
    return state;
  }

  assertContainerFitsInContainer(state, container, destination);

  return {
    ...state,
    containers: {
      ...state.containers,
      [containerId]: container.withLocation(destination),
    },
  };
}