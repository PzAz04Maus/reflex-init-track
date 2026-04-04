import type {
  ContainerInstance,
  InventoryState,
  ItemInstance,
  VoucherPool,
} from "../types";
import { getEffectiveCarryProfiles, scaleVoucherPool } from "./shared";

function getBaseItemVoucherCost(state: InventoryState, item: ItemInstance): VoucherPool {
  const effectiveCarryProfiles = getEffectiveCarryProfiles(state, item);
  const profile = item.carryMode && effectiveCarryProfiles
    ? effectiveCarryProfiles[item.carryMode]
    : undefined;
  if (profile) {
    return profile.voucherCost;
  }

  return item.voucherCost ?? {};
}

export function getItemVoucherCost(state: InventoryState, item: ItemInstance): VoucherPool {
  return scaleVoucherPool(getBaseItemVoucherCost(state, item), item.quantity);
}

export function getItemVoucherCostForContainer(
  state: InventoryState,
  item: ItemInstance,
  container: ContainerInstance,
): VoucherPool {
  if (!container.itemVoucherRules || container.itemVoucherRules.length === 0) {
    return getItemVoucherCost(state, item);
  }

  const matchedRule = container.itemVoucherRules.find((rule) =>
    rule.acceptedItemTags.some((tag) => item.tags?.includes(tag)),
  );

  if (!matchedRule) {
    throw new Error(`Item ${item.name} is not compatible with container ${container.name}.`);
  }

  return {
    [matchedRule.key]: item.quantity * (matchedRule.unitsPerItem ?? 1),
  };
}

export function getChildContainerVoucherCostForContainer(
  childContainer: ContainerInstance,
  hostContainer: ContainerInstance,
): VoucherPool {
  if (!hostContainer.containerVoucherRules || hostContainer.containerVoucherRules.length === 0) {
    return getContainerVoucherCost(childContainer);
  }

  const matchedRule = hostContainer.containerVoucherRules.find((rule) =>
    rule.acceptedContainerTags.some((tag) => childContainer.tags?.includes(tag)),
  );

  if (!matchedRule) {
    throw new Error(
      `Container ${childContainer.name} is not compatible with container ${hostContainer.name}.`,
    );
  }

  return {
    [matchedRule.key]: matchedRule.unitsPerContainer ?? 1,
  };
}

export function getItemVoucherBonus(item: ItemInstance): VoucherPool {
  return scaleVoucherPool(item.voucherBonus, item.quantity);
}

export function getContainerVoucherCost(container: ContainerInstance): VoucherPool {
  return container.voucherCost ?? {};
}

export function getContainerVoucherBonus(container: ContainerInstance): VoucherPool {
  return container.voucherBonus ?? {};
}

export function getVoucherOverflow(limits: VoucherPool = {}, used: VoucherPool = {}): VoucherPool {
  return Object.fromEntries(
    Object.entries(used)
      .filter(([key, value]) => value > (limits[key] ?? 0))
      .map(([key, value]) => [key, value - (limits[key] ?? 0)]),
  );
}