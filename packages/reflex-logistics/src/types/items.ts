import type {
  ItemCarryProfile,
  InventoryLocation,
  PowerRequirementStats,
  PowerSupplyStats,
  VoucherPool,
} from "./common";
import type { WeaponAttachmentStats } from "./weapons";

function clonePowerSupply(powerSupply?: PowerSupplyStats): PowerSupplyStats | undefined {
  return powerSupply
    ? {
        ...powerSupply,
        fuel: powerSupply.fuel
          ? {
              ...powerSupply.fuel,
              notes: powerSupply.fuel.notes ? [...powerSupply.fuel.notes] : undefined,
            }
          : undefined,
        notes: powerSupply.notes ? [...powerSupply.notes] : undefined,
      }
    : undefined;
}

function cloneWeaponAttachment(weaponAttachment?: WeaponAttachmentStats): WeaponAttachmentStats | undefined {
  return weaponAttachment
    ? {
        ...weaponAttachment,
        compatibleWeaponTags: [...weaponAttachment.compatibleWeaponTags],
        modifier: {
          ...weaponAttachment.modifier,
          rangeOverride: weaponAttachment.modifier.rangeOverride
            ? { ...weaponAttachment.modifier.rangeOverride }
            : undefined,
          speedModifier: weaponAttachment.modifier.speedModifier
            ? { ...weaponAttachment.modifier.speedModifier }
            : undefined,
          accuracyModifier: weaponAttachment.modifier.accuracyModifier
            ? { ...weaponAttachment.modifier.accuracyModifier }
            : undefined,
        },
        notes: weaponAttachment.notes ? [...weaponAttachment.notes] : undefined,
      }
    : undefined;
}

export interface ItemDefinitionInit {
  id: string;
  name: string;
  weight: number;
  tags?: string[];
  traits?: string[];
  notes?: string[];
  barterValue?: string;
  streetPrice?: number | string;
  duration?: string;
  powerRequirement?: string;
  power?: PowerRequirementStats;
  powerSupply?: PowerSupplyStats;
  weaponAttachment?: WeaponAttachmentStats;
  carryProfiles?: Record<string, ItemCarryProfile>;
  grantsCarryProfiles?: Record<string, ItemCarryProfile>;
  voucherCost?: VoucherPool;
  voucherBonus?: VoucherPool;
  description?: string;
  defaultCarryMode?: string;
}

export interface ItemInstanceInit extends ItemDefinitionInit {
  quantity: number;
  location?: InventoryLocation;
  attachmentIds?: string[];
  attachedToItemId?: string;
  carryMode?: string;
}

export class ItemDefinition {
  id: string;
  name: string;
  weight: number;
  tags?: string[];
  traits?: string[];
  notes?: string[];
  barterValue?: string;
  streetPrice?: number | string;
  duration?: string;
  powerRequirement?: string;
  power?: PowerRequirementStats;
  powerSupply?: PowerSupplyStats;
  weaponAttachment?: WeaponAttachmentStats;
  carryProfiles?: Record<string, ItemCarryProfile>;
  grantsCarryProfiles?: Record<string, ItemCarryProfile>;
  voucherCost?: VoucherPool;
  voucherBonus?: VoucherPool;
  description?: string;
  defaultCarryMode?: string;

  constructor(input: ItemDefinitionInit) {
    this.id = input.id;
    this.name = input.name;
    this.weight = input.weight;
    this.tags = input.tags;
    this.traits = input.traits ? [...input.traits] : undefined;
    this.notes = input.notes ? [...input.notes] : undefined;
    this.barterValue = input.barterValue;
    this.streetPrice = input.streetPrice;
    this.duration = input.duration;
    this.powerRequirement = input.powerRequirement;
    this.power = input.power ? { ...input.power } : undefined;
    this.powerSupply = clonePowerSupply(input.powerSupply);
    this.weaponAttachment = cloneWeaponAttachment(input.weaponAttachment);
    this.carryProfiles = input.carryProfiles;
    this.grantsCarryProfiles = input.grantsCarryProfiles;
    this.voucherCost = input.voucherCost;
    this.voucherBonus = input.voucherBonus;
    this.description = input.description;
    this.defaultCarryMode = input.defaultCarryMode;
  }

  protected toInit(): ItemDefinitionInit {
    return {
      id: this.id,
      name: this.name,
      weight: this.weight,
      tags: this.tags,
      traits: this.traits ? [...this.traits] : undefined,
      notes: this.notes ? [...this.notes] : undefined,
      barterValue: this.barterValue,
      streetPrice: this.streetPrice,
      duration: this.duration,
      powerRequirement: this.powerRequirement,
      power: this.power ? { ...this.power } : undefined,
      powerSupply: clonePowerSupply(this.powerSupply),
      weaponAttachment: cloneWeaponAttachment(this.weaponAttachment),
      carryProfiles: this.carryProfiles,
      grantsCarryProfiles: this.grantsCarryProfiles,
      voucherCost: this.voucherCost,
      voucherBonus: this.voucherBonus,
      description: this.description,
      defaultCarryMode: this.defaultCarryMode,
    };
  }

  hasTag(tag: string): boolean {
    return this.tags?.includes(tag) ?? false;
  }

  hasTrait(trait: string): boolean {
    return this.traits?.includes(trait) ?? false;
  }

  isWeaponAttachment(): boolean {
    return Boolean(this.weaponAttachment);
  }

  hasStructuredPower(): boolean {
    return Boolean(this.power || this.powerSupply);
  }

  requiresBatteryPower(): boolean {
    return this.power?.kind === "battery";
  }

  requiresRechargeablePower(): boolean {
    return this.power?.kind === "rechargeable";
  }

  requiresAcPower(): boolean {
    return this.power?.kind === "ac";
  }

  getRechargeHoursForUsage(hoursUsed: number): number | undefined {
    if (this.power?.kind !== "rechargeable") {
      return undefined;
    }

    return hoursUsed * (this.power.rechargeHoursPerHourUsed ?? 0.5);
  }

  getAcPowerKilowatts(): number | undefined {
    return this.power?.kind === "ac" ? this.power.kilowatts : undefined;
  }

  getAcPowerOutputKilowatts(): number | undefined {
    return this.powerSupply?.outputKilowatts;
  }

  getCarryProfile(mode: string): ItemCarryProfile | undefined {
    return this.carryProfiles?.[mode];
  }

  instantiate(
    input: Omit<ItemInstanceInit, keyof ItemDefinitionInit | "quantity"> & { quantity?: number } = {},
  ): ItemInstance {
    return new ItemInstance({
      ...this.toInit(),
      quantity: input.quantity ?? 1,
      location: input.location,
      attachmentIds: input.attachmentIds,
      attachedToItemId: input.attachedToItemId,
      carryMode: input.carryMode,
    });
  }
}

export class ItemInstance extends ItemDefinition {
  quantity: number;
  location: InventoryLocation;
  attachmentIds?: string[];
  attachedToItemId?: string;
  carryMode?: string;

  constructor(input: ItemInstanceInit) {
    super(input);
    this.quantity = input.quantity;
    this.location = input.location ?? { kind: "root" };
    this.attachmentIds = input.attachmentIds;
    this.attachedToItemId = input.attachedToItemId;
    this.carryMode = input.carryMode ?? input.defaultCarryMode;
  }

  protected toInstanceInit(): ItemInstanceInit {
    return {
      ...this.toInit(),
      quantity: this.quantity,
      location: this.location,
      attachmentIds: this.attachmentIds,
      attachedToItemId: this.attachedToItemId,
      carryMode: this.carryMode,
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

  withQuantity(quantity: number): ItemInstance {
    return new ItemInstance({
      ...this.toInstanceInit(),
      quantity,
    });
  }

  withLocation(location: InventoryLocation): ItemInstance {
    return new ItemInstance({
      ...this.toInstanceInit(),
      location,
    });
  }

  withCarryMode(carryMode?: string): ItemInstance {
    return new ItemInstance({
      ...this.toInstanceInit(),
      carryMode,
    });
  }

  withAttachmentIds(attachmentIds?: string[]): ItemInstance {
    return new ItemInstance({
      ...this.toInstanceInit(),
      attachmentIds,
    });
  }

  withAttachedToItemId(attachedToItemId?: string): ItemInstance {
    return new ItemInstance({
      ...this.toInstanceInit(),
      attachedToItemId,
    });
  }
}