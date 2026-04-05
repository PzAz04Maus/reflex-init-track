"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const vehicle_catalog_1 = require("../src/vehicle-catalog");
(0, node_test_1.default)("vehicle instances clone movement modes and nested fuel state", () => {
    const yacht = vehicle_catalog_1.CIVILIAN_VEHICLES.find((entry) => entry.id === "vehicle:civilian:yacht-ocean-sailboat");
    strict_1.default.ok(yacht);
    const instance = yacht.instantiate();
    instance.vehicle.movementModes[1]?.fuel?.types.push("A");
    instance.vehicle.movementModes[0]?.traits?.push("mutated");
    strict_1.default.deepEqual(yacht.getMovementMode("diesel")?.fuel?.types, ["D"]);
    strict_1.default.deepEqual(yacht.getMovementMode("sail")?.traits, ["vehicle:wind-limited"]);
});
(0, node_test_1.default)("mixed-propulsion and towed civilian craft preserve source-specific movement modeling", () => {
    const yacht = vehicle_catalog_1.CIVILIAN_VEHICLES.find((entry) => entry.id === "vehicle:civilian:yacht-ocean-sailboat");
    const barge = vehicle_catalog_1.CIVILIAN_VEHICLES.find((entry) => entry.id === "vehicle:civilian:barge");
    strict_1.default.ok(yacht);
    strict_1.default.ok(barge);
    strict_1.default.equal(yacht.vehicle.movementModes.length, 2);
    strict_1.default.equal(yacht.getMovementMode("sail")?.travelSpeed, 7);
    strict_1.default.equal(yacht.getMovementMode("diesel")?.fuel?.consumptionPerHour, 20);
    strict_1.default.equal(barge.getPrimaryMovementMode()?.kind, "towed");
    strict_1.default.equal(barge.getPrimaryMovementMode()?.fuel, undefined);
    strict_1.default.equal(barge.vehicle.cargoText, "Hopper barge; tanker variant carries 5,000,000 liters.");
});
(0, node_test_1.default)("military catalog includes tracked AFV mechanics from the page span", () => {
    const t72 = vehicle_catalog_1.MILITARY_VEHICLES.find((entry) => entry.id === "vehicle:military:t-72");
    const bradley = vehicle_catalog_1.MILITARY_VEHICLES.find((entry) => entry.id === "vehicle:military:m2a3-bradley-ifv");
    const warrior = vehicle_catalog_1.MILITARY_VEHICLES.find((entry) => entry.id === "vehicle:military:fv510-warrior");
    const patrolBoat = vehicle_catalog_1.MILITARY_VEHICLES.find((entry) => entry.id === "vehicle:military:patrol-boat");
    strict_1.default.ok(t72);
    strict_1.default.ok(bradley);
    strict_1.default.ok(warrior);
    strict_1.default.ok(patrolBoat);
    strict_1.default.equal(t72.vehicle.traits?.includes("vehicle:autoloader:9-ticks:22-round-capacity"), true);
    strict_1.default.equal(bradley.getArmorFacing("HF")?.spaced, true);
    strict_1.default.equal(bradley.vehicle.traits?.includes("vehicle:weapon:tow-reload-exposed-double-time"), true);
    strict_1.default.deepEqual(warrior.vehicle.systems?.armamentIds, [
        "vehicle-weapon:l21a1-rarden-30mm",
        "vehicle-weapon:l94a1-chain-gun",
    ]);
    strict_1.default.equal(patrolBoat.isWatercraft(), true);
});
(0, node_test_1.default)("vehicle mechanics exports cover conversions, role codes, and animal training", () => {
    const technical = vehicle_catalog_1.VEHICLE_CONVERSION_RULES.find((rule) => rule.id === "vehicle-conversion:technical");
    const cavalry = vehicle_catalog_1.ANIMAL_TRAINING_LEVELS.find((level) => level.id === "animal-training:cavalry");
    strict_1.default.ok(technical);
    strict_1.default.ok(cavalry);
    strict_1.default.equal(technical.targetTotal, 3);
    strict_1.default.equal(technical.effects.includes("Add one crew position with a weapon mount."), true);
    strict_1.default.equal(vehicle_catalog_1.VEHICLE_EQUIPMENT_ROLE_CODES.notes[2], "G = gunner-mounted equipment.");
    strict_1.default.equal(cavalry.trainingPeriod, "1 month");
});
(0, node_test_1.default)("vehicle armament section captures dedicated heavy-weapon mechanics and ammo tables", () => {
    const rarden = vehicle_catalog_1.VEHICLE_ARMAMENTS_BY_ID["vehicle-weapon:l21a1-rarden-30mm"];
    const bushmaster = vehicle_catalog_1.VEHICLE_ARMAMENTS_BY_ID["vehicle-weapon:m242-bushmaster-25mm"];
    const tow = vehicle_catalog_1.VEHICLE_ARMAMENTS_BY_ID["vehicle-weapon:tow-launcher"];
    strict_1.default.ok(rarden);
    strict_1.default.ok(bushmaster);
    strict_1.default.ok(tow);
    strict_1.default.equal(rarden.ammoOptions?.[0]?.damage?.[0]?.damage, 27);
    strict_1.default.equal(rarden.ammoOptions?.find((ammo) => ammo.id === "vehicle-weapon-ammo:l21a1-rarden:he")?.damage?.[0]?.frag, 4);
    strict_1.default.equal(rarden.notes?.includes("One 6-tick Reload action loads a single 3-round clip."), true);
    strict_1.default.equal(bushmaster.powerRequirement, "0.75 kW");
    strict_1.default.equal(bushmaster.ammoOptions?.find((ammo) => ammo.id === "vehicle-weapon-ammo:m242:api")?.penetration?.maximum, "x2");
    strict_1.default.equal(tow.ammoOptions?.find((ammo) => ammo.id === "vehicle-weapon-ammo:tow:2b")?.traits?.includes("vehicle-weapon:top-attack"), true);
});
