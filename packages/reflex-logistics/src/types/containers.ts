import type { InventoryLocation, StorageMode, VoucherDefinition, VoucherPool } from "./common";

export interface ContainerDefinitionInit {
  id: string;
  name: string;
  capacityWeight?: number;
  voucherDefinitions?: VoucherDefinition[];
  voucherLimits?: VoucherPool;
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
  capacityWeight?: number;
  voucherDefinitions?: VoucherDefinition[];
  voucherLimits?: VoucherPool;
  description?: string;
  defaultMode?: StorageMode;

  constructor(input: ContainerDefinitionInit) {
    this.id = input.id;
    this.name = input.name;
    this.capacityWeight = input.capacityWeight;
    this.voucherDefinitions = input.voucherDefinitions?.map((voucher) => ({ ...voucher }));
    this.voucherLimits = input.voucherLimits ? { ...input.voucherLimits } : undefined;
    this.description = input.description;
    this.defaultMode = input.defaultMode;
  }

  protected toInit(): ContainerDefinitionInit {
    return {
      id: this.id,
      name: this.name,
      capacityWeight: this.capacityWeight,
      voucherDefinitions: this.voucherDefinitions?.map((voucher) => ({ ...voucher })),
      voucherLimits: this.voucherLimits ? { ...this.voucherLimits } : undefined,
      description: this.description,
      defaultMode: this.defaultMode,
    };
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