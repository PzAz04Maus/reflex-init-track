import type {
  InventoryLocation,
  InventoryState,
  ItemInstance,
  ContainerInstance,
} from "../types";
import { assertContainerExists, sumVoucherPools } from "./shared";
import { getContainerVoucherUsage } from "./queries";
import {
  getChildContainerVoucherCostForContainer,
  getContainerVoucherBonus,
  getItemVoucherBonus,
  getItemVoucherCostForContainer,
  getVoucherOverflow,
} from "./vouchers";

export function assertItemFitsInContainer(
  state: InventoryState,
  item: ItemInstance,
  destination: InventoryLocation,
): void {
  if (destination.kind !== "container") {
    return;
  }

  const container = assertContainerExists(state, destination.containerId);
  if (!container.voucherLimits) {
    return;
  }

  const currentVoucherUsage = getContainerVoucherUsage(state, destination.containerId);
  const currentUsage = currentVoucherUsage.used;
  const currentLimits = currentVoucherUsage.limits;
  const nextUsage = sumVoucherPools(currentUsage, getItemVoucherCostForContainer(state, item, container));
  const nextLimits = sumVoucherPools(currentLimits, getItemVoucherBonus(item));
  const overflow = getVoucherOverflow(nextLimits, nextUsage);

  if (Object.keys(overflow).length > 0) {
    const details = Object.entries(overflow)
      .map(([key, value]) => `${key}: +${value} over limit`)
      .join(", ");
    throw new Error(`Item does not fit in container ${container.name}. ${details}`);
  }
}

export function assertContainerFitsInContainer(
  state: InventoryState,
  container: ContainerInstance,
  destination: InventoryLocation,
): void {
  if (destination.kind !== "container") {
    return;
  }

  const hostContainer = assertContainerExists(state, destination.containerId);
  if (!hostContainer.voucherLimits) {
    return;
  }

  const currentVoucherUsage = getContainerVoucherUsage(state, destination.containerId);
  const currentUsage = currentVoucherUsage.used;
  const currentLimits = currentVoucherUsage.limits;
  const nextUsage = sumVoucherPools(
    currentUsage,
    getChildContainerVoucherCostForContainer(container, hostContainer),
  );
  const nextLimits = sumVoucherPools(currentLimits, getContainerVoucherBonus(container));
  const overflow = getVoucherOverflow(nextLimits, nextUsage);

  if (Object.keys(overflow).length > 0) {
    const details = Object.entries(overflow)
      .map(([key, value]) => `${key}: +${value} over limit`)
      .join(", ");
    throw new Error(`Container does not fit in container ${hostContainer.name}. ${details}`);
  }
}

export function canMoveItemToContainer(
  state: InventoryState,
  itemId: string,
  containerId: string,
): boolean {
  const item = state.items[itemId];
  if (!item) {
    return false;
  }

  try {
    assertItemFitsInContainer(state, item, { kind: "container", containerId });
    return true;
  } catch {
    return false;
  }
}