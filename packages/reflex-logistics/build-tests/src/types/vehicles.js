"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.VehicleInstance = exports.VehicleDefinition = void 0;
const items_1 = require("./items");
// ---------------------------------------------------------------------------
// Clone helpers (internal)
// ---------------------------------------------------------------------------
function cloneGroundSpeed(s) {
    return { ...s };
}
function cloneSpeedProfile(s) {
    if (typeof s === "number")
        return s;
    return cloneGroundSpeed(s);
}
function cloneArmorStats(armor) {
    const out = {};
    for (const [key, entry] of Object.entries(armor)) {
        out[key] = { ...entry };
    }
    return out;
}
function cloneVehicleStats(v) {
    return {
        ...v,
        crew: { ...v.crew },
        fuel: { ...v.fuel, types: [...v.fuel.types] },
        travelSpeed: cloneSpeedProfile(v.travelSpeed),
        combatSpeed: cloneSpeedProfile(v.combatSpeed),
        armor: v.armor ? cloneArmorStats(v.armor) : undefined,
        systems: v.systems ? { ...v.systems, armament: v.systems.armament ? [...v.systems.armament] : undefined } : undefined,
        equipment: v.equipment ? { ...v.equipment } : undefined,
        traits: v.traits ? [...v.traits] : undefined,
        notes: v.notes ? [...v.notes] : undefined,
    };
}
// ---------------------------------------------------------------------------
// VehicleDefinition class
// ---------------------------------------------------------------------------
class VehicleDefinition extends items_1.ItemDefinition {
    vehicle;
    constructor(input) {
        super(input);
        this.vehicle = cloneVehicleStats(input.vehicle);
    }
    toInit() {
        return {
            ...super.toInit(),
            vehicle: cloneVehicleStats(this.vehicle),
        };
    }
    isWatercraft() {
        return (this.vehicle.configuration === "flush-deck" ||
            this.vehicle.configuration === "superstructure");
    }
    isTracked() {
        return this.vehicle.suspension === "trk";
    }
    hasNBC() {
        return this.vehicle.equipment?.nbcDefenseSystem ?? false;
    }
    hasAmphibiousGear() {
        return this.vehicle.equipment?.amphibiousRunningGear ?? false;
    }
    getArmorFacing(key) {
        return this.vehicle.armor?.[key];
    }
    instantiate(input = {}) {
        return new VehicleInstance({
            ...this.toInit(),
            quantity: input.quantity ?? 1,
            location: input.location,
            attachmentIds: input.attachmentIds,
            attachedToItemId: input.attachedToItemId,
            carryMode: input.carryMode,
        });
    }
}
exports.VehicleDefinition = VehicleDefinition;
// ---------------------------------------------------------------------------
// VehicleInstance class
// ---------------------------------------------------------------------------
class VehicleInstance extends items_1.ItemInstance {
    vehicle;
    constructor(input) {
        super(input);
        this.vehicle = cloneVehicleStats(input.vehicle);
    }
    toInit() {
        return {
            ...super.toInit(),
            vehicle: cloneVehicleStats(this.vehicle),
        };
    }
    toInstanceInit() {
        return {
            ...super.toInstanceInit(),
            vehicle: cloneVehicleStats(this.vehicle),
        };
    }
}
exports.VehicleInstance = VehicleInstance;
