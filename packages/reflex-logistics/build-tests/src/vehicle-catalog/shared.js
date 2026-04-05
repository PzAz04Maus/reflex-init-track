"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.source = source;
exports.sources = sources;
exports.fuel = fuel;
exports.groundSpeed = groundSpeed;
exports.movementMode = movementMode;
exports.defineVehicle = defineVehicle;
const vehicles_1 = require("../types/vehicles");
const SOURCE_BOOK = "Twilight 2013 Core OEF PDF";
function source(page) {
    return `Source: ${SOURCE_BOOK} p.${page}`;
}
function sources(...pages) {
    return pages.map(source);
}
function fuel(types, tankCapacityLiters, consumptionPerHour) {
    return {
        types: [...types],
        tankCapacityLiters,
        consumptionPerHour,
    };
}
function groundSpeed(road, crossCountry) {
    return { road, crossCountry };
}
function movementMode(id, label, kind, init) {
    return {
        id,
        label,
        kind,
        ...init,
    };
}
function defineVehicle(init) {
    return new vehicles_1.VehicleDefinition({
        ...init,
        weight: init.vehicle.weightKg,
        source: sources(...init.sourcePages),
        tags: ["vehicle", ...(init.tags ?? [])],
    });
}
