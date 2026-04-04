import type {
  InventoryContents,
  InventoryLocation,
  InventoryState,
  VoucherPool,
  VoucherUsage,
} from "../types";
import { assertContainerExists, isSameLocation, ROOT_LOCATION, sumVoucherPools } from "./shared";
import {
  getChildContainerVoucherCostForContainer,
  getContainerVoucherBonus,
  getItemVoucherBonus,
  getItemVoucherCost,
  getItemVoucherCostForContainer,
} from "./vouchers";

export function getContents(
  state: InventoryState,
  location: InventoryLocation = ROOT_LOCATION,
): InventoryContents {
  return {
    items: Object.values(state.items).filter((item) => isSameLocation(item.location, location)),
    containers: Object.values(state.containers).filter((container) =>
      isSameLocation(container.location, location),
    ),
  };
}

export function getContainerContents(
  state: InventoryState,
  containerId: string,
): InventoryContents {
  assertContainerExists(state, containerId);
  return getContents(state, { kind: "container", containerId });
}

export function getContainerVoucherUsage(
  state: InventoryState,
  containerId: string,
): VoucherUsage {
  const container = assertContainerExists(state, containerId);
  const contents = getContainerContents(state, containerId);
  const usedByItems = contents.items.reduce<VoucherPool>((total, item) => {
    return sumVoucherPools(total, getItemVoucherCostForContainer(state, item, container));
  }, {});
  const usedByContainers = contents.containers.reduce<VoucherPool>((total, childContainer) => {
    return sumVoucherPools(total, getChildContainerVoucherCostForContainer(childContainer, container));
  }, {});
  const grantedByItems = contents.items.reduce<VoucherPool>((total, item) => {
    return sumVoucherPools(total, getItemVoucherBonus(item));
  }, {});
  const grantedByContainers = contents.containers.reduce<VoucherPool>((total, childContainer) => {
    return sumVoucherPools(total, getContainerVoucherBonus(childContainer));
  }, {});
  const used = sumVoucherPools(usedByItems, usedByContainers);
  const granted = sumVoucherPools(grantedByItems, grantedByContainers);
  const limits = sumVoucherPools(container.voucherLimits ?? {}, granted);
  const remaining = Object.fromEntries(
    Object.keys(limits).map((key) => [key, (limits[key] ?? 0) - (used[key] ?? 0)]),
  );

  return {
    used,
    limits,
    remaining,
  };
}

export function getEffectiveItemVoucherCost(
  state: InventoryState,
  itemId: string,
): VoucherPool {
  const item = state.items[itemId];
  if (!item) {
    throw new Error(`Unknown item: ${itemId}`);
  }

  return getItemVoucherCost(state, item);
}

export function getRootContents(state: InventoryState): InventoryContents {
  return getContents(state, ROOT_LOCATION);
}