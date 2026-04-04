"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ArmorInstance = exports.RangedWeaponInstance = exports.ArmorDefinition = exports.RangedWeaponDefinition = void 0;
const items_1 = require("./items");
function cloneRangedWeaponStats(rangedWeapon) {
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
function cloneArmorStats(armor) {
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
class RangedWeaponDefinition extends items_1.ItemDefinition {
    rangedWeapon;
    constructor(input) {
        super(input);
        this.rangedWeapon = cloneRangedWeaponStats(input.rangedWeapon);
    }
    toInit() {
        return {
            ...super.toInit(),
            rangedWeapon: cloneRangedWeaponStats(this.rangedWeapon),
        };
    }
    isFirearm() {
        return Boolean(this.rangedWeapon.caliber);
    }
    hasWeaponTrait(trait) {
        return this.rangedWeapon.traits?.includes(trait) ?? false;
    }
    isCrewServed() {
        return this.rangedWeapon.crewServed ?? false;
    }
    requiresEmplacement() {
        return this.rangedWeapon.requiresEmplacement ?? this.isCrewServed();
    }
    supportsAttachmentKind(kind) {
        return this.rangedWeapon.supportedAttachmentKinds?.includes(kind) ?? false;
    }
    getOptimumPenetration() {
        return this.rangedWeapon.penetration.optimum;
    }
    getMaximumPenetration() {
        return this.rangedWeapon.penetration.maximum ?? this.rangedWeapon.penetration.optimum;
    }
    getOptimumRange() {
        return this.rangedWeapon.range.optimum;
    }
    getMaximumRange() {
        return this.rangedWeapon.range.maximum ?? this.rangedWeapon.range.optimum;
    }
    instantiate(input = {}) {
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
exports.RangedWeaponDefinition = RangedWeaponDefinition;
class ArmorDefinition extends items_1.ItemDefinition {
    armor;
    constructor(input) {
        super(input);
        this.armor = cloneArmorStats(input.armor);
    }
    toInit() {
        return {
            ...super.toInit(),
            armor: cloneArmorStats(this.armor),
        };
    }
    coversLocation(location) {
        return this.armor.coverage.some((region) => region.location === location);
    }
    hasArmorTrait(trait) {
        return this.armor.traits?.includes(trait) ?? false;
    }
    instantiate(input = {}) {
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
exports.ArmorDefinition = ArmorDefinition;
class RangedWeaponInstance extends items_1.ItemInstance {
    rangedWeapon;
    constructor(input) {
        super(input);
        this.rangedWeapon = cloneRangedWeaponStats(input.rangedWeapon);
    }
    toInit() {
        return {
            ...super.toInit(),
            rangedWeapon: cloneRangedWeaponStats(this.rangedWeapon),
        };
    }
    toInstanceInit() {
        return {
            ...super.toInstanceInit(),
            rangedWeapon: cloneRangedWeaponStats(this.rangedWeapon),
        };
    }
    isFirearm() {
        return Boolean(this.rangedWeapon.caliber);
    }
    hasWeaponTrait(trait) {
        return this.rangedWeapon.traits?.includes(trait) ?? false;
    }
    isCrewServed() {
        return this.rangedWeapon.crewServed ?? false;
    }
    requiresEmplacement() {
        return this.rangedWeapon.requiresEmplacement ?? this.isCrewServed();
    }
    supportsAttachmentKind(kind) {
        return this.rangedWeapon.supportedAttachmentKinds?.includes(kind) ?? false;
    }
    getOptimumPenetration() {
        return this.rangedWeapon.penetration.optimum;
    }
    getMaximumPenetration() {
        return this.rangedWeapon.penetration.maximum ?? this.rangedWeapon.penetration.optimum;
    }
    getOptimumRange() {
        return this.rangedWeapon.range.optimum;
    }
    getMaximumRange() {
        return this.rangedWeapon.range.maximum ?? this.rangedWeapon.range.optimum;
    }
    withQuantity(quantity) {
        return new RangedWeaponInstance({
            ...this.toInstanceInit(),
            quantity,
        });
    }
    withLocation(location) {
        return new RangedWeaponInstance({
            ...this.toInstanceInit(),
            location,
        });
    }
    withCarryMode(carryMode) {
        return new RangedWeaponInstance({
            ...this.toInstanceInit(),
            carryMode,
        });
    }
    withAttachmentIds(attachmentIds) {
        return new RangedWeaponInstance({
            ...this.toInstanceInit(),
            attachmentIds,
        });
    }
    withAttachedToItemId(attachedToItemId) {
        return new RangedWeaponInstance({
            ...this.toInstanceInit(),
            attachedToItemId,
        });
    }
}
exports.RangedWeaponInstance = RangedWeaponInstance;
class ArmorInstance extends items_1.ItemInstance {
    armor;
    constructor(input) {
        super(input);
        this.armor = cloneArmorStats(input.armor);
    }
    toInit() {
        return {
            ...super.toInit(),
            armor: cloneArmorStats(this.armor),
        };
    }
    toInstanceInit() {
        return {
            ...super.toInstanceInit(),
            armor: cloneArmorStats(this.armor),
        };
    }
    coversLocation(location) {
        return this.armor.coverage.some((region) => region.location === location);
    }
    hasArmorTrait(trait) {
        return this.armor.traits?.includes(trait) ?? false;
    }
    withQuantity(quantity) {
        return new ArmorInstance({
            ...this.toInstanceInit(),
            quantity,
        });
    }
    withLocation(location) {
        return new ArmorInstance({
            ...this.toInstanceInit(),
            location,
        });
    }
    withCarryMode(carryMode) {
        return new ArmorInstance({
            ...this.toInstanceInit(),
            carryMode,
        });
    }
    withAttachmentIds(attachmentIds) {
        return new ArmorInstance({
            ...this.toInstanceInit(),
            attachmentIds,
        });
    }
    withAttachedToItemId(attachedToItemId) {
        return new ArmorInstance({
            ...this.toInstanceInit(),
            attachedToItemId,
        });
    }
}
exports.ArmorInstance = ArmorInstance;
