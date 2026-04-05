import assert from "node:assert/strict";
import test from "node:test";

import {
  ANIMAL_TRAINING_LEVELS,
  CIVILIAN_VEHICLES,
  MILITARY_VEHICLES,
  VEHICLE_ARMAMENTS_BY_ID,
  VEHICLE_CONVERSION_RULES,
  VEHICLE_EQUIPMENT_ROLE_CODES,
} from "../src/vehicle-catalog";

test("vehicle instances clone movement modes and nested fuel state", () => {
  const yacht = CIVILIAN_VEHICLES.find((entry) => entry.id === "vehicle:civilian:yacht-ocean-sailboat");

  assert.ok(yacht);

  const instance = yacht.instantiate();
  instance.vehicle.movementModes[1]?.fuel?.types.push("A");
  instance.vehicle.movementModes[0]?.traits?.push("mutated");

  assert.deepEqual(yacht.getMovementMode("diesel")?.fuel?.types, ["D"]);
  assert.deepEqual(yacht.getMovementMode("sail")?.traits, ["vehicle:wind-limited"]);
});

test("mixed-propulsion and towed civilian craft preserve source-specific movement modeling", () => {
  const yacht = CIVILIAN_VEHICLES.find((entry) => entry.id === "vehicle:civilian:yacht-ocean-sailboat");
  const barge = CIVILIAN_VEHICLES.find((entry) => entry.id === "vehicle:civilian:barge");

  assert.ok(yacht);
  assert.ok(barge);
  assert.equal(yacht.vehicle.movementModes.length, 2);
  assert.equal(yacht.getMovementMode("sail")?.travelSpeed, 7);
  assert.equal(yacht.getMovementMode("diesel")?.fuel?.consumptionPerHour, 20);
  assert.equal(barge.getPrimaryMovementMode()?.kind, "towed");
  assert.equal(barge.getPrimaryMovementMode()?.fuel, undefined);
  assert.equal(barge.vehicle.cargoText, "Hopper barge; tanker variant carries 5,000,000 liters.");
});

test("military catalog includes tracked AFV mechanics from the page span", () => {
  const t72 = MILITARY_VEHICLES.find((entry) => entry.id === "vehicle:military:t-72");
  const bradley = MILITARY_VEHICLES.find((entry) => entry.id === "vehicle:military:m2a3-bradley-ifv");
  const warrior = MILITARY_VEHICLES.find((entry) => entry.id === "vehicle:military:fv510-warrior");
  const patrolBoat = MILITARY_VEHICLES.find((entry) => entry.id === "vehicle:military:patrol-boat");

  assert.ok(t72);
  assert.ok(bradley);
  assert.ok(warrior);
  assert.ok(patrolBoat);
  assert.equal(t72.vehicle.traits?.includes("vehicle:autoloader:9-ticks:22-round-capacity"), true);
  assert.equal(bradley.getArmorFacing("HF")?.spaced, true);
  assert.equal(bradley.vehicle.traits?.includes("vehicle:weapon:tow-reload-exposed-double-time"), true);
  assert.deepEqual(warrior.vehicle.systems?.armamentIds, [
    "vehicle-weapon:l21a1-rarden-30mm",
    "vehicle-weapon:l94a1-chain-gun",
  ]);
  assert.equal(patrolBoat.isWatercraft(), true);
});

test("vehicle mechanics exports cover conversions, role codes, and animal training", () => {
  const technical = VEHICLE_CONVERSION_RULES.find((rule) => rule.id === "vehicle-conversion:technical");
  const cavalry = ANIMAL_TRAINING_LEVELS.find((level) => level.id === "animal-training:cavalry");

  assert.ok(technical);
  assert.ok(cavalry);
  assert.equal(technical.targetTotal, 3);
  assert.equal(technical.effects.includes("Add one crew position with a weapon mount."), true);
  assert.equal(VEHICLE_EQUIPMENT_ROLE_CODES.notes[2], "G = gunner-mounted equipment.");
  assert.equal(cavalry.trainingPeriod, "1 month");
});

test("vehicle armament section captures dedicated heavy-weapon mechanics and ammo tables", () => {
  const rarden = VEHICLE_ARMAMENTS_BY_ID["vehicle-weapon:l21a1-rarden-30mm"];
  const bushmaster = VEHICLE_ARMAMENTS_BY_ID["vehicle-weapon:m242-bushmaster-25mm"];
  const tow = VEHICLE_ARMAMENTS_BY_ID["vehicle-weapon:tow-launcher"];

  assert.ok(rarden);
  assert.ok(bushmaster);
  assert.ok(tow);
  assert.equal(rarden.ammoOptions?.[0]?.damage, 27);
  assert.equal(rarden.notes?.includes("One 6-tick Reload action loads a single 3-round clip."), true);
  assert.equal(bushmaster.powerRequirement, "0.75 kW");
  assert.equal(bushmaster.ammoOptions?.find((ammo) => ammo.id === "vehicle-weapon-ammo:m242:api")?.penetration?.maximum, "x2");
  assert.equal(tow.ammoOptions?.find((ammo) => ammo.id === "vehicle-weapon-ammo:tow:2b")?.traits?.includes("vehicle-weapon:top-attack"), true);
});