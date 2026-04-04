import {
  ArmorDefinition,
  ArmorInstance,
  ContainerDefinition,
  ContainerInstance,
  ItemDefinition,
  ItemInstance,
  RangedWeaponDefinition,
} from "./types";
import {
  DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS,
  DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS,
  DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS,
} from "./equipmentLayouts";
import type {
  ArmorDefinitionInit,
  ArmorInstanceInit,
  AmorphousEquipmentContainer,
  AmorphousEquipmentOptions,
  ContainerDefinitionInit,
  ContainerInstanceInit,
  HumanoidEquipmentContainer,
  HumanoidEquipmentOptions,
  InventoryContents,
  ItemDefinitionInit,
  ItemInstanceInit,
  ItemCarryProfile,
  InventoryLocation,
  InventoryState,
  QuadrupedEquipmentContainer,
  QuadrupedEquipmentOptions,
  StorageMode,
  VoucherDefinition,
  VoucherPool,
  VoucherUsage,
  RangedWeaponDefinitionInit,
} from "./types";

export {
  DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS,
  DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS,
  DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS,
  DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS,
  DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS,
  DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS,
} from "./equipmentLayouts";

// Root inventory is the default location for stowed gear.
const ROOT_LOCATION: InventoryLocation = { kind: "root" };

// Voucher helpers support abstract equip capacity accounting.
function sumVoucherPools(left: VoucherPool = {}, right: VoucherPool = {}): VoucherPool {
  const keys = new Set([...Object.keys(left), ...Object.keys(right)]);
  return Object.fromEntries(
    [...keys].map((key) => [key, (left[key] ?? 0) + (right[key] ?? 0)]),
  );
}

function scaleVoucherPool(pool: VoucherPool = {}, multiplier: number): VoucherPool {
  return Object.fromEntries(
    Object.entries(pool).map(([key, value]) => [key, value * multiplier]),
  );
}

function getEffectiveCarryProfiles(
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

function getItemVoucherCost(state: InventoryState, item: ItemInstance): VoucherPool {
  return scaleVoucherPool(getBaseItemVoucherCost(state, item), item.quantity);
}

function getItemVoucherBonus(item: ItemInstance): VoucherPool {
  return scaleVoucherPool(item.voucherBonus, item.quantity);
}

function getVoucherOverflow(limits: VoucherPool = {}, used: VoucherPool = {}): VoucherPool {
  return Object.fromEntries(
    Object.entries(used)
      .filter(([key, value]) => value > (limits[key] ?? 0))
      .map(([key, value]) => [key, value - (limits[key] ?? 0)]),
  );
}

function cloneVoucherDefinitions(vouchers: VoucherDefinition[]): VoucherDefinition[] {
  return vouchers.map((voucher) => ({ ...voucher }));
}

// Move validation enforces voucher limits on special containers like wearing or held gear.
function assertItemFitsInContainer(
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
  const nextUsage = sumVoucherPools(currentUsage, getItemVoucherCost(state, item));
  const nextLimits = sumVoucherPools(currentLimits, getItemVoucherBonus(item));
  const overflow = getVoucherOverflow(nextLimits, nextUsage);

  if (Object.keys(overflow).length > 0) {
    const details = Object.entries(overflow)
      .map(([key, value]) => `${key}: +${value} over limit`)
      .join(", ");
    throw new Error(`Item does not fit in container ${container.name}. ${details}`);
  }
}

// Location helpers keep root and nested container comparisons consistent.
function isSameLocation(left: InventoryLocation, right: InventoryLocation): boolean {
  if (left.kind !== right.kind) {
    return false;
  }

  if (left.kind === "root") {
    return true;
  }

  return right.kind === "container" && left.containerId === right.containerId;
}

// Container guards centralize not-found checks.
function assertContainerExists(state: InventoryState, containerId: string): ContainerInstance {
  const container = state.containers[containerId];
  if (!container) {
    throw new Error(`Unknown container: ${containerId}`);
  }

  return container;
}

// Nested containers cannot be moved into themselves or their descendants.
function assertNoContainerCycle(
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

// State constructors build normalized inventory records.
export function createInventoryState(
  items: ItemInstance[] = [],
  containers: ContainerInstance[] = [],
): InventoryState {
  return {
    items: Object.fromEntries(items.map((item) => [item.id, item])),
    containers: Object.fromEntries(containers.map((container) => [container.id, container])),
  };
}

// General-purpose storage definition factory.
export function createContainerDefinition(input: ContainerDefinitionInit): ContainerDefinition {
  return new ContainerDefinition(input);
}

export function createVoucherContainerDefinition(
  id: string,
  name: string,
  voucherLimits: VoucherPool,
  defaultMode: StorageMode = "bin",
): ContainerDefinition {
  return new ContainerDefinition({
    id,
    name,
    voucherLimits,
    defaultMode,
  });
}

export function createTypedVoucherContainerDefinition(
  id: string,
  name: string,
  voucherDefinitions: VoucherDefinition[],
  defaultMode: StorageMode = "bin",
): ContainerDefinition {
  return new ContainerDefinition({
    id,
    name,
    voucherDefinitions: cloneVoucherDefinitions(voucherDefinitions),
    voucherLimits: Object.fromEntries(
      voucherDefinitions.map((voucher) => [voucher.key, voucher.capacity]),
    ),
    defaultMode,
  });
}

// General-purpose storage container factory.
export function createContainer(
  id: string,
  name: string,
  mode: StorageMode,
  location: InventoryLocation = ROOT_LOCATION,
): ContainerInstance {
  return createContainerDefinition({
    id,
    name,
    defaultMode: mode,
  }).instantiate({
    mode,
    location,
  });
}

// Voucher container factory for abstract equip states like wearing or held.
export function createVoucherContainer(
  id: string,
  name: string,
  voucherLimits: VoucherPool,
  mode: StorageMode = "bin",
  location: InventoryLocation = ROOT_LOCATION,
): ContainerInstance {
  return createVoucherContainerDefinition(id, name, voucherLimits, mode).instantiate({
    mode,
    location,
  });
}

// Typed voucher container factory preserves voucher metadata alongside derived limits.
export function createTypedVoucherContainer(
  id: string,
  name: string,
  voucherDefinitions: VoucherDefinition[],
  mode: StorageMode = "bin",
  location: InventoryLocation = ROOT_LOCATION,
): ContainerInstance {
  return createTypedVoucherContainerDefinition(id, name, voucherDefinitions, mode).instantiate({
    mode,
    location,
  });
}

// Item factory with object-style input for readable gear definitions.
export function createItemDefinition(input: ItemDefinitionInit): ItemDefinition {
  return new ItemDefinition(input);
}

export function createRangedWeaponDefinition(
  input: RangedWeaponDefinitionInit,
): RangedWeaponDefinition {
  return new RangedWeaponDefinition(input);
}

export function createArmorDefinition(input: ArmorDefinitionInit): ArmorDefinition {
  return new ArmorDefinition(input);
}

// Item factory creates a runtime inventory item from raw data.
export function createItem(input: ItemInstanceInit): ItemInstance {
  return new ItemInstance({
    ...input,
    location: input.location ?? ROOT_LOCATION,
  });
}

export function createArmor(input: ArmorInstanceInit): ArmorInstance {
  return new ArmorInstance({
    ...input,
    location: input.location ?? ROOT_LOCATION,
  });
}

// Instantiate a runtime inventory item from a reusable static definition.
export function instantiateItem(
  definition: ItemDefinition,
  input: {
    quantity?: number;
    location?: InventoryLocation;
    attachmentIds?: string[];
    attachedToItemId?: string;
    carryMode?: string;
  } = {},
): ItemInstance {
  return definition.instantiate({
    quantity: input.quantity ?? 1,
    location: input.location ?? ROOT_LOCATION,
    attachmentIds: input.attachmentIds,
    attachedToItemId: input.attachedToItemId,
    carryMode: input.carryMode,
  });
}

export function instantiateContainer(
  definition: ContainerDefinition,
  input: Omit<ContainerInstanceInit, keyof ContainerDefinitionInit> = {},
): ContainerInstance {
  return definition.instantiate({
    mode: input.mode,
    location: input.location ?? ROOT_LOCATION,
  });
}

// Default equipment container factory for a humanoid's combined worn and held gear.
export function createHumanoidEquipmentContainer(
  options: HumanoidEquipmentOptions = {},
): HumanoidEquipmentContainer {
  const { idPrefix = "humanoid", location = ROOT_LOCATION, name = "Equipment" } = options;

  return {
    equipment: createTypedVoucherContainer(
      `${idPrefix}:equipment`,
      name,
      DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS,
      "bin",
      location,
    ),
  };
}

// Default equipment container factory for a quadruped's equipment layout.
export function createQuadrupedEquipmentContainer(
  options: QuadrupedEquipmentOptions = {},
): QuadrupedEquipmentContainer {
  const { idPrefix = "quadruped", location = ROOT_LOCATION, name = "Equipment" } = options;

  return {
    equipment: createTypedVoucherContainer(
      `${idPrefix}:equipment`,
      name,
      DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS,
      "bin",
      location,
    ),
  };
}

// Default equipment container factory for an amorphous creature using generic slots.
export function createAmorphousEquipmentContainer(
  options: AmorphousEquipmentOptions = {},
): AmorphousEquipmentContainer {
  const { idPrefix = "amorphous", location = ROOT_LOCATION, name = "Equipment" } = options;

  return {
    equipment: createTypedVoucherContainer(
      `${idPrefix}:equipment`,
      name,
      DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS,
      "bin",
      location,
    ),
  };
}

// Mutations add new containers after validating their destination.
export function addContainer(state: InventoryState, container: ContainerInstance): InventoryState {
  if (state.containers[container.id]) {
    throw new Error(`Container already exists: ${container.id}`);
  }

  if (container.location.kind === "container") {
    assertContainerExists(state, container.location.containerId);
  }

  return {
    ...state,
    containers: {
      ...state.containers,
      [container.id]: container,
    },
  };
}

// Mutations add new items after validating their destination.
export function addItem(state: InventoryState, item: ItemInstance): InventoryState {
  if (state.items[item.id]) {
    throw new Error(`Item already exists: ${item.id}`);
  }

  if (item.location.kind === "container") {
    assertContainerExists(state, item.location.containerId);
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

// Attach an item to a host item and keep their locations aligned.
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

// Detach an item from its host, preserving its current location.
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

// Carry mode changes allow items to swap voucher profiles, such as ready vs slung.
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

// Convenience setup for installing a humanoid's default equipment container into state.
export function addHumanoidEquipmentContainer(
  state: InventoryState,
  options: HumanoidEquipmentOptions = {},
): InventoryState {
  const container = createHumanoidEquipmentContainer(options);
  return addContainer(state, container.equipment);
}

// Convenience setup for installing a quadruped's default equipment container into state.
export function addQuadrupedEquipmentContainer(
  state: InventoryState,
  options: QuadrupedEquipmentOptions = {},
): InventoryState {
  const container = createQuadrupedEquipmentContainer(options);
  return addContainer(state, container.equipment);
}

// Convenience setup for installing an amorphous creature's default equipment container into state.
export function addAmorphousEquipmentContainer(
  state: InventoryState,
  options: AmorphousEquipmentOptions = {},
): InventoryState {
  const container = createAmorphousEquipmentContainer(options);
  return addContainer(state, container.equipment);
}

// Simple mode toggle supports bag/bin presentation without affecting location.
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

// Item moves enforce both destination existence and voucher-capacity rules.
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

// Container moves preserve tree integrity by rejecting cycles.
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

  return {
    ...state,
    containers: {
      ...state.containers,
      [containerId]: container.withLocation(destination),
    },
  };
}

// Generic contents query for root or any nested container location.
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

// Container-specific contents query.
export function getContainerContents(
  state: InventoryState,
  containerId: string,
): InventoryContents {
  assertContainerExists(state, containerId);
  return getContents(state, { kind: "container", containerId });
}

// Voucher usage query reports used, total, and remaining equip capacity.
export function getContainerVoucherUsage(
  state: InventoryState,
  containerId: string,
): VoucherUsage {
  const container = assertContainerExists(state, containerId);
  const used = getContainerContents(state, containerId).items.reduce<VoucherPool>((total, item) => {
    return sumVoucherPools(total, getItemVoucherCost(state, item));
  }, {});
  const granted = getContainerContents(state, containerId).items.reduce<VoucherPool>((total, item) => {
    return sumVoucherPools(total, getItemVoucherBonus(item));
  }, {});
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

// Fast boolean check for UI previews before attempting a move.
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

// Effective voucher cost query resolves carry-mode and attachment-dependent item load.
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

// Root contents query is a convenience wrapper for top-level gear.
export function getRootContents(state: InventoryState): InventoryContents {
  return getContents(state, ROOT_LOCATION);
}