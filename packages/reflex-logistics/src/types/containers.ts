import type { InventoryLocation, StorageMode, VoucherDefinition, VoucherPool } from "./common";

export interface ContainerItemVoucherRule {
  key: string;
  acceptedItemTags: string[];
  unitsPerItem?: number;
}

export interface ContainerChildVoucherRule {
  key: string;
  acceptedContainerTags: string[];
  unitsPerContainer?: number;
}

export interface ContainerDefinitionInit {
  id: string;
  name: string;
  weight?: number;
  capacityWeight?: number;
  attachmentPointCost?: number;
  itemVoucherRules?: ContainerItemVoucherRule[];
  containerVoucherRules?: ContainerChildVoucherRule[];
  tags?: string[];
  barterValue?: string;
  streetPrice?: number;
  voucherDefinitions?: VoucherDefinition[];
  voucherLimits?: VoucherPool;
  voucherCost?: VoucherPool;
  voucherBonus?: VoucherPool;
  description?: string;
  defaultMode?: StorageMode;
}

export interface ContainerInstanceInit extends ContainerDefinitionInit {
  mode?: StorageMode;
  location?: InventoryLocation;
}

export class ContainerDefinition {
  id: string;
  name: string;
  weight?: number;
  capacityWeight?: number;
  attachmentPointCost?: number;
  itemVoucherRules?: ContainerItemVoucherRule[];
  containerVoucherRules?: ContainerChildVoucherRule[];
  tags?: string[];
  barterValue?: string;
  streetPrice?: number;
  voucherDefinitions?: VoucherDefinition[];
  voucherLimits?: VoucherPool;
  voucherCost?: VoucherPool;
  voucherBonus?: VoucherPool;
  description?: string;
  defaultMode?: StorageMode;

  constructor(input: ContainerDefinitionInit) {
    this.id = input.id;
    this.name = input.name;
    this.weight = input.weight;
    this.capacityWeight = input.capacityWeight;
    this.attachmentPointCost = input.attachmentPointCost;
    this.itemVoucherRules = input.itemVoucherRules?.map((rule) => ({
      ...rule,
      acceptedItemTags: [...rule.acceptedItemTags],
    }));
    this.containerVoucherRules = input.containerVoucherRules?.map((rule) => ({
      ...rule,
      acceptedContainerTags: [...rule.acceptedContainerTags],
    }));
    this.tags = input.tags ? [...input.tags] : undefined;
    this.barterValue = input.barterValue;
    this.streetPrice = input.streetPrice;
    this.voucherDefinitions = input.voucherDefinitions?.map((voucher) => ({ ...voucher }));
    this.voucherLimits = input.voucherLimits ? { ...input.voucherLimits } : undefined;
    this.voucherCost = input.voucherCost ? { ...input.voucherCost } : undefined;
    this.voucherBonus = input.voucherBonus ? { ...input.voucherBonus } : undefined;
    this.description = input.description;
    this.defaultMode = input.defaultMode;
  }

  protected toInit(): ContainerDefinitionInit {
    return {
      id: this.id,
      name: this.name,
      weight: this.weight,
      capacityWeight: this.capacityWeight,
      attachmentPointCost: this.attachmentPointCost,
      itemVoucherRules: this.itemVoucherRules?.map((rule) => ({
        ...rule,
        acceptedItemTags: [...rule.acceptedItemTags],
      })),
      containerVoucherRules: this.containerVoucherRules?.map((rule) => ({
        ...rule,
        acceptedContainerTags: [...rule.acceptedContainerTags],
      })),
      tags: this.tags ? [...this.tags] : undefined,
      barterValue: this.barterValue,
      streetPrice: this.streetPrice,
      voucherDefinitions: this.voucherDefinitions?.map((voucher) => ({ ...voucher })),
      voucherLimits: this.voucherLimits ? { ...this.voucherLimits } : undefined,
      voucherCost: this.voucherCost ? { ...this.voucherCost } : undefined,
      voucherBonus: this.voucherBonus ? { ...this.voucherBonus } : undefined,
      description: this.description,
      defaultMode: this.defaultMode,
    };
  }

  hasTag(tag: string): boolean {
    return this.tags?.includes(tag) ?? false;
  }

  hasVoucher(key: string): boolean {
    return Boolean(this.voucherLimits?.[key] ?? this.voucherDefinitions?.some((voucher) => voucher.key === key));
  }

  instantiate(input: Omit<ContainerInstanceInit, keyof ContainerDefinitionInit> = {}): ContainerInstance {
    return new ContainerInstance({
      ...this.toInit(),
      mode: input.mode,
      location: input.location,
    });
  }
}

export class ContainerInstance extends ContainerDefinition {
  mode: StorageMode;
  location: InventoryLocation;

  constructor(input: ContainerInstanceInit) {
    super(input);
    this.mode = input.mode ?? input.defaultMode ?? "bin";
    this.location = input.location ?? { kind: "root" };
  }

  private toInstanceInit(): ContainerInstanceInit {
    return {
      ...this.toInit(),
      mode: this.mode,
      location: this.location,
    };
  }

  isAt(location: InventoryLocation): boolean {
    if (this.location.kind !== location.kind) {
      return false;
    }

    if (this.location.kind === "root") {
      return true;
    }

    return location.kind === "container" && this.location.containerId === location.containerId;
  }

  withMode(mode: StorageMode): ContainerInstance {
    return new ContainerInstance({
      ...this.toInstanceInit(),
      mode,
    });
  }

  withLocation(location: InventoryLocation): ContainerInstance {
    return new ContainerInstance({
      ...this.toInstanceInit(),
      location,
    });
  }
}