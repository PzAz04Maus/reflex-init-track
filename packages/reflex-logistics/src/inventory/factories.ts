import {
  ArmorDefinition,
  ArmorInstance,
  ContainerDefinition,
  ItemDefinition,
  ItemInstance,
  RangedWeaponDefinition,
} from "../types";
import {
  DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS,
  DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS,
  DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS,
} from "../equipmentLayouts";
import type {
  ArmorDefinitionInit,
  ArmorInstanceInit,
  AmorphousEquipmentContainer,
  AmorphousEquipmentOptions,
  ContainerDefinitionInit,
  ContainerInstance,
  ContainerInstanceInit,
  HumanoidEquipmentContainer,
  HumanoidEquipmentOptions,
  InventoryState,
  InventoryLocation,
  ItemDefinitionInit,
  ItemInstanceInit,
  QuadrupedEquipmentContainer,
  QuadrupedEquipmentOptions,
  RangedWeaponDefinitionInit,
  StorageMode,
  VoucherDefinition,
  VoucherPool,
} from "../types";
import { ROOT_LOCATION } from "./shared";

function cloneVoucherDefinitions(vouchers: VoucherDefinition[]): VoucherDefinition[] {
  return vouchers.map((voucher) => ({ ...voucher }));
}

export function createInventoryState(
  items: ItemInstance[] = [],
  containers: ContainerInstance[] = [],
): InventoryState {
  return {
    items: Object.fromEntries(items.map((item) => [item.id, item])),
    containers: Object.fromEntries(containers.map((container) => [container.id, container])),
  };
}

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