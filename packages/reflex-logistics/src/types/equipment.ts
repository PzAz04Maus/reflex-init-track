import type { ArmorStats } from "./armor";
import { ItemDefinition, ItemInstance } from "./items";
import type { ItemDefinitionInit, ItemInstanceInit } from "./items";
import type { InventoryLocation } from "./common";
import type { RangedWeaponStats } from "./weapons";

function cloneRangedWeaponStats(rangedWeapon: RangedWeaponStats): RangedWeaponStats {
  return {
    ...rangedWeapon,
    penetration: { ...rangedWeapon.penetration },
    range: { ...rangedWeapon.range },
    speed: { ...rangedWeapon.speed },
    supportedAttachmentKinds: rangedWeapon.supportedAttachmentKinds
      ? [...rangedWeapon.supportedAttachmentKinds]
      : undefined,
    traits: rangedWeapon.traits ? [...rangedWeapon.traits] : undefined,
  };
}

function cloneArmorStats(armor: ArmorStats): ArmorStats {
  return {
    ...armor,
    coverage: armor.coverage.map((region) => ({ ...region })),
    insertSlots: armor.insertSlots?.map((slot) => ({
      ...slot,
      coverage: slot.coverage.map((region) => ({ ...region })),
    })),
    compatibleInsertSlots: armor.compatibleInsertSlots
      ? [...armor.compatibleInsertSlots]
      : undefined,
    traits: armor.traits ? [...armor.traits] : undefined,
    notes: armor.notes ? [...armor.notes] : undefined,
  };
}

export interface RangedWeaponDefinitionInit extends ItemDefinitionInit {
  rangedWeapon: RangedWeaponStats;
}

export interface ArmorDefinitionInit extends ItemDefinitionInit {
  armor: ArmorStats;
}

export interface RangedWeaponInstanceInit extends ItemInstanceInit {
  rangedWeapon: RangedWeaponStats;
}

export interface ArmorInstanceInit extends ItemInstanceInit {
  armor: ArmorStats;
}

export class RangedWeaponDefinition extends ItemDefinition {
  rangedWeapon: RangedWeaponStats;

  constructor(input: RangedWeaponDefinitionInit) {
    super(input);
    this.rangedWeapon = cloneRangedWeaponStats(input.rangedWeapon);
  }

  protected override toInit(): RangedWeaponDefinitionInit {
    return {
      ...super.toInit(),
      rangedWeapon: cloneRangedWeaponStats(this.rangedWeapon),
    };
  }

  isFirearm(): boolean {
    return Boolean(this.rangedWeapon.caliber);
  }

  hasWeaponTrait(trait: string): boolean {
    return this.rangedWeapon.traits?.includes(trait) ?? false;
  }

  isCrewServed(): boolean {
    return this.rangedWeapon.crewServed ?? false;
  }

  requiresEmplacement(): boolean {
    return this.rangedWeapon.requiresEmplacement ?? this.isCrewServed();
  }

  supportsAttachmentKind(kind: string): boolean {
    return this.rangedWeapon.supportedAttachmentKinds?.includes(kind) ?? false;
  }

  getOptimumPenetration(): string {
    return this.rangedWeapon.penetration.optimum;
  }

  getMaximumPenetration(): string {
    return this.rangedWeapon.penetration.maximum ?? this.rangedWeapon.penetration.optimum;
  }

  getOptimumRange(): string {
    return this.rangedWeapon.range.optimum;
  }

  getMaximumRange(): string {
    return this.rangedWeapon.range.maximum ?? this.rangedWeapon.range.optimum;
  }

  override instantiate(
    input: Omit<RangedWeaponInstanceInit, keyof RangedWeaponDefinitionInit | "quantity"> & { quantity?: number } = {},
  ): RangedWeaponInstance {
    return new RangedWeaponInstance({
      ...this.toInit(),
      quantity: input.quantity ?? 1,
      location: input.location,
      attachmentIds: input.attachmentIds,
      attachedToItemId: input.attachedToItemId,
      carryMode: input.carryMode,
    });
  }
}

export class ArmorDefinition extends ItemDefinition {
  armor: ArmorStats;

  constructor(input: ArmorDefinitionInit) {
    super(input);
    this.armor = cloneArmorStats(input.armor);
  }

  protected override toInit(): ArmorDefinitionInit {
    return {
      ...super.toInit(),
      armor: cloneArmorStats(this.armor),
    };
  }

  coversLocation(location: string): boolean {
    return this.armor.coverage.some((region) => region.location === location);
  }

  hasArmorTrait(trait: string): boolean {
    return this.armor.traits?.includes(trait) ?? false;
  }

  override instantiate(
    input: Omit<ArmorInstanceInit, keyof ArmorDefinitionInit | "quantity"> & { quantity?: number } = {},
  ): ArmorInstance {
    return new ArmorInstance({
      ...this.toInit(),
      quantity: input.quantity ?? 1,
      location: input.location,
      attachmentIds: input.attachmentIds,
      attachedToItemId: input.attachedToItemId,
      carryMode: input.carryMode,
    });
  }
}

export class RangedWeaponInstance extends ItemInstance {
  rangedWeapon: RangedWeaponStats;

  constructor(input: RangedWeaponInstanceInit) {
    super(input);
    this.rangedWeapon = cloneRangedWeaponStats(input.rangedWeapon);
  }

  protected override toInit(): RangedWeaponDefinitionInit {
    return {
      ...super.toInit(),
      rangedWeapon: cloneRangedWeaponStats(this.rangedWeapon),
    };
  }

  protected override toInstanceInit(): RangedWeaponInstanceInit {
    return {
      ...super.toInstanceInit(),
      rangedWeapon: cloneRangedWeaponStats(this.rangedWeapon),
    };
  }

  isFirearm(): boolean {
    return Boolean(this.rangedWeapon.caliber);
  }

  hasWeaponTrait(trait: string): boolean {
    return this.rangedWeapon.traits?.includes(trait) ?? false;
  }

  isCrewServed(): boolean {
    return this.rangedWeapon.crewServed ?? false;
  }

  requiresEmplacement(): boolean {
    return this.rangedWeapon.requiresEmplacement ?? this.isCrewServed();
  }

  supportsAttachmentKind(kind: string): boolean {
    return this.rangedWeapon.supportedAttachmentKinds?.includes(kind) ?? false;
  }

  getOptimumPenetration(): string {
    return this.rangedWeapon.penetration.optimum;
  }

  getMaximumPenetration(): string {
    return this.rangedWeapon.penetration.maximum ?? this.rangedWeapon.penetration.optimum;
  }

  getOptimumRange(): string {
    return this.rangedWeapon.range.optimum;
  }

  getMaximumRange(): string {
    return this.rangedWeapon.range.maximum ?? this.rangedWeapon.range.optimum;
  }

  override withQuantity(quantity: number): RangedWeaponInstance {
    return new RangedWeaponInstance({
      ...this.toInstanceInit(),
      quantity,
    });
  }

  override withLocation(location: InventoryLocation): RangedWeaponInstance {
    return new RangedWeaponInstance({
      ...this.toInstanceInit(),
      location,
    });
  }

  override withCarryMode(carryMode?: string): RangedWeaponInstance {
    return new RangedWeaponInstance({
      ...this.toInstanceInit(),
      carryMode,
    });
  }

  override withAttachmentIds(attachmentIds?: string[]): RangedWeaponInstance {
    return new RangedWeaponInstance({
      ...this.toInstanceInit(),
      attachmentIds,
    });
  }

  override withAttachedToItemId(attachedToItemId?: string): RangedWeaponInstance {
    return new RangedWeaponInstance({
      ...this.toInstanceInit(),
      attachedToItemId,
    });
  }
}

export class ArmorInstance extends ItemInstance {
  armor: ArmorStats;

  constructor(input: ArmorInstanceInit) {
    super(input);
    this.armor = cloneArmorStats(input.armor);
  }

  protected override toInit(): ArmorDefinitionInit {
    return {
      ...super.toInit(),
      armor: cloneArmorStats(this.armor),
    };
  }

  protected override toInstanceInit(): ArmorInstanceInit {
    return {
      ...super.toInstanceInit(),
      armor: cloneArmorStats(this.armor),
    };
  }

  coversLocation(location: string): boolean {
    return this.armor.coverage.some((region) => region.location === location);
  }

  hasArmorTrait(trait: string): boolean {
    return this.armor.traits?.includes(trait) ?? false;
  }

  override withQuantity(quantity: number): ArmorInstance {
    return new ArmorInstance({
      ...this.toInstanceInit(),
      quantity,
    });
  }

  override withLocation(location: InventoryLocation): ArmorInstance {
    return new ArmorInstance({
      ...this.toInstanceInit(),
      location,
    });
  }

  override withCarryMode(carryMode?: string): ArmorInstance {
    return new ArmorInstance({
      ...this.toInstanceInit(),
      carryMode,
    });
  }

  override withAttachmentIds(attachmentIds?: string[]): ArmorInstance {
    return new ArmorInstance({
      ...this.toInstanceInit(),
      attachmentIds,
    });
  }

  override withAttachedToItemId(attachedToItemId?: string): ArmorInstance {
    return new ArmorInstance({
      ...this.toInstanceInit(),
      attachedToItemId,
    });
  }
}