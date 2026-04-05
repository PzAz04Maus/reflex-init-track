"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ItemInstance = exports.ItemDefinition = void 0;
function cloneDamageProfile(damage) {
    return damage?.map((profile) => ({
        ...profile,
        ...(profile.area ? { area: { ...profile.area } } : {}),
        ...(profile.notes ? { notes: [...profile.notes] } : {}),
    }));
}
function clonePowerSupply(powerSupply) {
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
function cloneWeaponAttachment(weaponAttachment) {
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
class ItemDefinition {
    id;
    name;
    weight;
    tags;
    traits;
    notes;
    source;
    damage;
    barterValue;
    streetPrice;
    duration;
    powerRequirement;
    power;
    powerSupply;
    weaponAttachment;
    carryProfiles;
    grantsCarryProfiles;
    voucherCost;
    voucherBonus;
    description;
    defaultCarryMode;
    constructor(input) {
        this.id = input.id;
        this.name = input.name;
        this.weight = input.weight;
        this.tags = input.tags;
        this.traits = input.traits ? [...input.traits] : undefined;
        this.notes = input.notes ? [...input.notes] : undefined;
        this.source = input.source ? [...input.source] : undefined;
        this.damage = cloneDamageProfile(input.damage);
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
    toInit() {
        return {
            id: this.id,
            name: this.name,
            weight: this.weight,
            tags: this.tags,
            traits: this.traits ? [...this.traits] : undefined,
            notes: this.notes ? [...this.notes] : undefined,
            source: this.source ? [...this.source] : undefined,
            damage: cloneDamageProfile(this.damage),
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
    hasTag(tag) {
        return this.tags?.includes(tag) ?? false;
    }
    hasTrait(trait) {
        return this.traits?.includes(trait) ?? false;
    }
    isWeaponAttachment() {
        return Boolean(this.weaponAttachment);
    }
    hasStructuredPower() {
        return Boolean(this.power || this.powerSupply);
    }
    requiresBatteryPower() {
        return this.power?.kind === "battery";
    }
    requiresRechargeablePower() {
        return this.power?.kind === "rechargeable";
    }
    requiresAcPower() {
        return this.power?.kind === "ac";
    }
    getRechargeHoursForUsage(hoursUsed) {
        if (this.power?.kind !== "rechargeable") {
            return undefined;
        }
        return hoursUsed * (this.power.rechargeHoursPerHourUsed ?? 0.5);
    }
    getAcPowerKilowatts() {
        return this.power?.kind === "ac" ? this.power.kilowatts : undefined;
    }
    getAcPowerOutputKilowatts() {
        return this.powerSupply?.outputKilowatts;
    }
    getCarryProfile(mode) {
        return this.carryProfiles?.[mode];
    }
    instantiate(input = {}) {
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
exports.ItemDefinition = ItemDefinition;
class ItemInstance extends ItemDefinition {
    quantity;
    location;
    attachmentIds;
    attachedToItemId;
    carryMode;
    constructor(input) {
        super(input);
        this.quantity = input.quantity;
        this.location = input.location ?? { kind: "root" };
        this.attachmentIds = input.attachmentIds;
        this.attachedToItemId = input.attachedToItemId;
        this.carryMode = input.carryMode ?? input.defaultCarryMode;
    }
    toInstanceInit() {
        return {
            ...this.toInit(),
            quantity: this.quantity,
            location: this.location,
            attachmentIds: this.attachmentIds,
            attachedToItemId: this.attachedToItemId,
            carryMode: this.carryMode,
        };
    }
    isAt(location) {
        if (this.location.kind !== location.kind) {
            return false;
        }
        if (this.location.kind === "root") {
            return true;
        }
        return location.kind === "container" && this.location.containerId === location.containerId;
    }
    withQuantity(quantity) {
        return new ItemInstance({
            ...this.toInstanceInit(),
            quantity,
        });
    }
    withLocation(location) {
        return new ItemInstance({
            ...this.toInstanceInit(),
            location,
        });
    }
    withCarryMode(carryMode) {
        return new ItemInstance({
            ...this.toInstanceInit(),
            carryMode,
        });
    }
    withAttachmentIds(attachmentIds) {
        return new ItemInstance({
            ...this.toInstanceInit(),
            attachmentIds,
        });
    }
    withAttachedToItemId(attachedToItemId) {
        return new ItemInstance({
            ...this.toInstanceInit(),
            attachedToItemId,
        });
    }
}
exports.ItemInstance = ItemInstance;
