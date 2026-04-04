import type {
  ContainerInstance,
  InventoryLocation,
  InventoryState,
  ItemCarryProfile,
  ItemInstance,
  VoucherPool,
} from "../types";

export const ROOT_LOCATION: InventoryLocation = { kind: "root" };

export function sumVoucherPools(left: VoucherPool = {}, right: VoucherPool = {}): VoucherPool {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return Object.fromEntries(
    [...keys].map((key) => [key, (left[key] ?? 0) + (right[key] ?? 0)]),
  );
}

export function scaleVoucherPool(pool: VoucherPool = {}, multiplier: number): VoucherPool {
  return Object.fromEntries(
    Object.entries(pool).map(([key, value]) => [key, value * multiplier]),
  );
}

export function getEffectiveCarryProfiles(
  state: InventoryState,
  item: ItemInstance,
): Record<string, ItemCarryProfile> | undefined {
  const attachmentProfiles = (item.attachmentIds ?? []).reduce<Record<string, ItemCarryProfile>>(
    (profiles, attachmentId) => {
      const attachment = state.items[attachmentId];
      if (!attachment?.grantsCarryProfiles) {
        return profiles;
      }

      return {
        ...profiles,
        ...attachment.grantsCarryProfiles,
      };
    },
    {},
  );

  const mergedProfiles = {
    ...attachmentProfiles,
    ...(item.carryProfiles ?? {}),
  };

  return Object.keys(mergedProfiles).length > 0 ? mergedProfiles : undefined;
}

export function isSameLocation(left: InventoryLocation, right: InventoryLocation): boolean {
  if (left.kind !== right.kind) {
    return false;
  }

  if (left.kind === "root") {
    return true;
  }

  return right.kind === "container" && left.containerId === right.containerId;
}

export function assertContainerExists(state: InventoryState, containerId: string): ContainerInstance {
  const container = state.containers[containerId];
  if (!container) {
    throw new Error(`Unknown container: ${containerId}`);
  }

  return container;
}

export function assertNoContainerCycle(
  state: InventoryState,
  containerId: string,
  destination: InventoryLocation,
): void {
  if (destination.kind === "root") {
    return;
  }

  if (destination.containerId === containerId) {
    throw new Error("A container cannot be moved into itself.");
  }

  let current: ContainerInstance | undefined = state.containers[destination.containerId];
  while (current) {
    if (current.id === containerId) {
      throw new Error("A container cannot be moved into one of its descendants.");
    }

    current = current.location.kind === "container"
      ? state.containers[current.location.containerId]
      : undefined;
  }
}