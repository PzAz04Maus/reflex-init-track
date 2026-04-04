import assert from "node:assert/strict";
import test from "node:test";

import {
  CLOSE_COMBAT_WEAPONS,
  PEPPER_SPRAY_CANISTERS,
} from "../src/closeCombatCatalog";
import {
  PISTOL_CARTRIDGES,
  SHOTGUN_SHELLS,
  SMALL_ARMS_AMMUNITION_ITEMS,
} from "../src/ammunition";
import {
  ASSAULT_RIFLES,
  AUTOLOADERS,
  addContainer,
  addItem,
  createItem,
  createHumanoidEquipmentContainer,
  createInventoryState,
  createItemDefinition,
  createRangedWeaponDefinition,
  getContainerVoucherUsage,
  instantiateContainer,
  SUBMACHINE_GUNS,
} from "../src/inventory";
import {
  getNutrition,
  getNutritionCalories,
  getNutritionCaloriesForQuantity,
  getNutritionUnit,
} from "../src/nutrition";
import {
  FIXED_LOAD_BEARING_CONTAINERS,
  FIXED_LBE_COMPONENT_CONTAINERS,
  MODULAR_LOAD_BEARING_CONTAINERS,
  MODULAR_LOAD_BEARING_POUCHES,
  PACK_CONTAINERS,
  SURVIVAL_CONTAINERS,
} from "../src/containerCatalog";
import {
  AMMUNITION_HANDLING_ITEMS,
  FIRE_CONTROL_MODIFICATIONS,
} from "../src/weaponAttachmentsCatalog";
import { ELECTRONICS_CATALOG } from "../src/electronicsCatalog";
import { SIGNAL_CATALOG } from "../src/signalCatalog";
import { FOOD_ITEMS, SUPPLEMENT_ITEMS } from "../src/consumablesCatalog";

test("item definition instantiate clones nested item metadata", () => {
  const definition = createItemDefinition({
    id: "item:test-lamp",
    name: "Test Lamp",
    weight: 1,
    traits: ["Powered"],
    power: {
      kind: "battery",
      batteryCount: 2,
      batterySize: "sm",
      runtimeHours: 4,
    },
    weaponAttachment: {
      kind: "rail-accessory",
      compatibleWeaponTags: ["firearm"],
      modifier: {
        visualRangeModifier: 1,
        accuracyModifier: { snap: 1 },
      },
      notes: ["test-note"],
    },
  });

  const item = definition.instantiate();
  item.traits?.push("Mutated");

  assert.deepEqual(definition.traits, ["Powered"]);
  assert.equal(item.location.kind, "root");

  item.weaponAttachment?.compatibleWeaponTags.push("mutated-tag");
  assert.deepEqual(definition.weaponAttachment?.compatibleWeaponTags, ["firearm"]);
});

test("ranged weapon instantiate clones nested ranged weapon state", () => {
  const definition = createRangedWeaponDefinition({
    id: "weapon:test-rifle",
    name: "Test Rifle",
    weight: 4,
    rangedWeapon: {
      caliber: "5.56x45mm",
      capacity: 30,
      damage: 8,
      penetration: { optimum: "II" },
      range: { optimum: "CQB", maximum: "Open" },
      speed: { hip: 0, snap: 1, aimed: 2, reload: 3 },
      supportedAttachmentKinds: ["reflex-optic"],
      traits: ["firearm", "rifle"],
    },
  });

  const item = definition.instantiate();
  item.rangedWeapon.traits?.push("mutated");
  item.rangedWeapon.range.maximum = "Sniping";

  assert.deepEqual(definition.rangedWeapon.traits, ["firearm", "rifle"]);
  assert.equal(definition.rangedWeapon.range.maximum, "Open");
});

test("humanoid equipment container uses the extracted voucher layout", () => {
  const container = createHumanoidEquipmentContainer({ idPrefix: "test" }).equipment;

  assert.equal(container.id, "test:equipment");
  assert.equal(container.voucherDefinitions?.length, 11);
  assert.equal(container.voucherLimits?.["held:hands"], 2);
});

test("military-pattern small arms expose fire-control modifications", () => {
  assert.equal(FIRE_CONTROL_MODIFICATIONS.length, 2);
  assert.equal(SUBMACHINE_GUNS[0]?.supportsAttachmentKind("fire-control-modification"), true);
  assert.equal(ASSAULT_RIFLES[0]?.supportsAttachmentKind("fire-control-modification"), true);
  assert.equal(AUTOLOADERS[0]?.supportsAttachmentKind("fire-control-modification"), false);
});

test("small-arms ammunition generates special pistol and rifle loads from base pricing", () => {
  const fiveSeven = PISTOL_CARTRIDGES.find((entry) => entry.caliber === "5.7mm FN");
  const fiveFiveSix = SMALL_ARMS_AMMUNITION_ITEMS.find((item) => item.id === "ammo:rifle-cartridge:5-56x45mm:armor-piercing:100");

  assert.ok(fiveSeven?.ball);
  assert.equal(fiveSeven?.armorPiercing?.streetPrice, 510);
  assert.equal(fiveSeven?.hollowpoint?.streetPrice, 204);
  assert.equal(fiveSeven?.armorPiercing?.barterValue, "GG350");
  assert.equal(fiveFiveSix?.streetPrice, 250);
});

test("shotgun ammunition includes slug and buckshot variants at the same listed cost", () => {
  const twelveGauge = SHOTGUN_SHELLS.find((entry) => entry.caliber === "12 gauge");

  assert.ok(twelveGauge?.slug);
  assert.ok(twelveGauge?.buckshot);
  assert.equal(twelveGauge?.slug?.streetPrice, 200);
  assert.equal(twelveGauge?.buckshot?.streetPrice, 200);
  assert.equal(twelveGauge?.buckshot?.weight, 6);
  assert.equal(twelveGauge?.buckshot?.traits?.includes("ammo:buckshot-margin-double"), true);
});

test("close-combat catalog includes special-case melee and spray entries", () => {
  const brassKnuckles = CLOSE_COMBAT_WEAPONS.find((item) => item.id === "weapon:close-combat:brass-knuckles");
  const telescopingBaton = CLOSE_COMBAT_WEAPONS.find((item) => item.id === "weapon:close-combat:baton-telescoping");
  const policeSpray = PEPPER_SPRAY_CANISTERS.find((item) => item.id === "weapon:close-combat:pepper-spray-police");

  assert.equal(brassKnuckles?.voucherCost?.["worn:hands"], 1);
  assert.equal(telescopingBaton?.traits?.includes("melee:collapsed-as-sap"), true);
  assert.equal(telescopingBaton?.traits?.includes("melee:ready-action-extend"), true);
  assert.equal(policeSpray?.traits?.includes("chemical:pepper-spray-head-hit-resolve-penalty"), true);
});

test("portable containers consume voucher slots when worn or carried", () => {
  const equipment = createHumanoidEquipmentContainer({ idPrefix: "carrier" }).equipment;
  const framePackDefinition = PACK_CONTAINERS.find((container) => container.id === "container:pack:frame-civilian");

  assert.ok(framePackDefinition);

  const framePack = instantiateContainer(framePackDefinition, {
    location: { kind: "container", containerId: equipment.id },
  });

  const state = addContainer(createInventoryState([], [equipment]), framePack);
  const usage = getContainerVoucherUsage(state, equipment.id);

  assert.equal(usage.used["worn:back"], 1);
  assert.equal(usage.remaining["worn:back"], 0);
});

test("holsters consume stowed-handgun voucher capacity", () => {
  const equipment = createHumanoidEquipmentContainer({ idPrefix: "holster-test" }).equipment;
  const beltDefinition = FIXED_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:lbe:basic-belt-and-yoke");
  const holsterDefinition = FIXED_LBE_COMPONENT_CONTAINERS.find((container) => container.id === "container:lbe:holster");
  const handgunDefinition = createItemDefinition({
    id: "item:test-handgun-definition",
    name: "Test Handgun",
    weight: 0.9,
    tags: ["weapon", "firearm", "handgun", "sidearm"],
    voucherCost: { "held:hands": 1 },
  });

  assert.ok(beltDefinition);
  assert.ok(holsterDefinition);
  assert.ok(handgunDefinition);

  const belt = instantiateContainer(beltDefinition, {
    location: { kind: "container", containerId: equipment.id },
  });
  const holster = instantiateContainer(holsterDefinition, {
    location: { kind: "container", containerId: belt.id },
  });
  const handgun = createItem({
    id: "item:test-handgun-1",
    name: handgunDefinition.name,
    weight: handgunDefinition.weight,
    tags: handgunDefinition.tags,
    voucherCost: handgunDefinition.voucherCost,
    quantity: 1,
    location: { kind: "container", containerId: holster.id },
  });
  const secondHandgun = createItem({
    id: "item:test-handgun-2",
    name: handgunDefinition.name,
    weight: handgunDefinition.weight,
    tags: handgunDefinition.tags,
    voucherCost: handgunDefinition.voucherCost,
    quantity: 1,
    location: { kind: "container", containerId: holster.id },
  });

  let state = createInventoryState([], [equipment]);
  state = addContainer(state, belt);
  state = addContainer(state, holster);
  state = addItem(state, handgun);

  const usage = getContainerVoucherUsage(state, holster.id);

  assert.equal(usage.used["stowed:handgun"], 1);
  assert.equal(usage.remaining["stowed:handgun"], 0);
  assert.throws(
    () => addItem(state, secondHandgun),
    /Item does not fit in container Holster/,
  );
});

test("magazine pouches use stowed-magazine voucher slots", () => {
  const equipment = createHumanoidEquipmentContainer({ idPrefix: "mag-test" }).equipment;
  const beltDefinition = FIXED_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:lbe:basic-belt-and-yoke");
  const pouchDefinition = FIXED_LBE_COMPONENT_CONTAINERS.find((container) => container.id === "container:lbe:mag-carrier-pistol-triple");
  const spareMagazineDefinition = AMMUNITION_HANDLING_ITEMS.find((item) => item.id === "accessory:spare-magazine");

  assert.ok(beltDefinition);
  assert.ok(pouchDefinition);
  assert.ok(spareMagazineDefinition);

  const belt = instantiateContainer(beltDefinition, {
    location: { kind: "container", containerId: equipment.id },
  });
  const pouch = instantiateContainer(pouchDefinition, {
    location: { kind: "container", containerId: belt.id },
  });

  let state = createInventoryState([], [equipment]);
  state = addContainer(state, belt);
  state = addContainer(state, pouch);

  for (let index = 0; index < 3; index += 1) {
    state = addItem(state, createItem({
      id: `item:test-magazine-${index + 1}`,
      name: spareMagazineDefinition.name,
      weight: spareMagazineDefinition.weight,
      tags: spareMagazineDefinition.tags,
      quantity: 1,
      location: { kind: "container", containerId: pouch.id },
    }));
  }

  const usage = getContainerVoucherUsage(state, pouch.id);

  assert.equal(usage.used["stowed:magazine"], 3);
  assert.equal(usage.remaining["stowed:magazine"], 0);
  assert.throws(
    () => addItem(state, createItem({
      id: "item:test-magazine-4",
      name: spareMagazineDefinition.name,
      weight: spareMagazineDefinition.weight,
      tags: spareMagazineDefinition.tags,
      quantity: 1,
      location: { kind: "container", containerId: pouch.id },
    })),
    /Item does not fit in container Mag Carrier, Pistol, Triple/,
  );
});

test("sheaths accept knife-tagged items and reject other items", () => {
  const equipment = createHumanoidEquipmentContainer({ idPrefix: "sheath-test" }).equipment;
  const beltDefinition = FIXED_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:lbe:basic-belt-and-yoke");
  const sheathDefinition = FIXED_LBE_COMPONENT_CONTAINERS.find((container) => container.id === "container:lbe:sheath");
  const knifeDefinition = CLOSE_COMBAT_WEAPONS.find((item) => item.id === "weapon:close-combat:knife-working");
  const handgunDefinition = AUTOLOADERS[0];

  assert.ok(beltDefinition);
  assert.ok(sheathDefinition);
  assert.ok(knifeDefinition);
  assert.ok(handgunDefinition);

  const belt = instantiateContainer(beltDefinition, {
    location: { kind: "container", containerId: equipment.id },
  });
  const sheath = instantiateContainer(sheathDefinition, {
    location: { kind: "container", containerId: belt.id },
  });

  let state = createInventoryState([], [equipment]);
  state = addContainer(state, belt);
  state = addContainer(state, sheath);
  state = addItem(state, createItem({
    id: "item:test-knife-1",
    name: knifeDefinition.name,
    weight: knifeDefinition.weight,
    tags: knifeDefinition.tags,
    voucherCost: knifeDefinition.voucherCost,
    quantity: 1,
    location: { kind: "container", containerId: sheath.id },
  }));

  const usage = getContainerVoucherUsage(state, sheath.id);

  assert.equal(usage.used["stowed:knife"], 1);
  assert.equal(usage.remaining["stowed:knife"], 0);
  assert.throws(
    () => addItem(state, createItem({
      id: "item:test-sheath-handgun",
      name: handgunDefinition.name,
      weight: handgunDefinition.weight,
      tags: handgunDefinition.tags,
      voucherCost: handgunDefinition.voucherCost,
      quantity: 1,
      location: { kind: "container", containerId: sheath.id },
    })),
    /not compatible with container Sheath/,
  );
});

test("canteen carriers accept tagged child containers", () => {
  const equipment = createHumanoidEquipmentContainer({ idPrefix: "canteen-test" }).equipment;
  const beltDefinition = FIXED_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:lbe:basic-belt-and-yoke");
  const canteenCarrierDefinition = FIXED_LBE_COMPONENT_CONTAINERS.find((container) => container.id === "container:lbe:canteen-carrier");
  const canteenDefinition = SURVIVAL_CONTAINERS.find((container) => container.id === "container:survival:canteen-1l");
  const hydrationDefinition = SURVIVAL_CONTAINERS.find((container) => container.id === "container:survival:hydration-bladder-1-5l");

  assert.ok(beltDefinition);
  assert.ok(canteenCarrierDefinition);
  assert.ok(canteenDefinition);
  assert.ok(hydrationDefinition);

  const belt = instantiateContainer(beltDefinition, {
    location: { kind: "container", containerId: equipment.id },
  });
  const canteenCarrier = instantiateContainer(canteenCarrierDefinition, {
    location: { kind: "container", containerId: belt.id },
  });

  let state = createInventoryState([], [equipment]);
  state = addContainer(state, belt);
  state = addContainer(state, canteenCarrier);
  state = addContainer(state, instantiateContainer(canteenDefinition, {
    location: { kind: "container", containerId: canteenCarrier.id },
  }));

  const usage = getContainerVoucherUsage(state, canteenCarrier.id);

  assert.equal(usage.used["stowed:canteen"], 1);
  assert.equal(usage.remaining["stowed:canteen"], 0);
  assert.throws(
    () => addContainer(state, instantiateContainer(hydrationDefinition, {
      location: { kind: "container", containerId: canteenCarrier.id },
    })),
    /not compatible with container Canteen Carrier/,
  );
});

test("modular pouches consume and enforce container attachment-point budgets", () => {
  const thighCarrierDefinition = MODULAR_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:mlbe:thigh-carrier");
  const utilityPouchDefinition = MODULAR_LOAD_BEARING_POUCHES.find((container) => container.id === "container:mlbe:utility-pouch");
  const hydrationCarrierDefinition = MODULAR_LOAD_BEARING_POUCHES.find((container) => container.id === "container:mlbe:hydration-bladder-carrier");

  assert.ok(thighCarrierDefinition);
  assert.ok(utilityPouchDefinition);
  assert.ok(hydrationCarrierDefinition);

  const thighCarrier = instantiateContainer(thighCarrierDefinition);
  const utilityPouch = instantiateContainer(utilityPouchDefinition, {
    location: { kind: "container", containerId: thighCarrier.id },
  });

  const stateWithCarrier = createInventoryState([], [thighCarrier]);
  const stateWithPouch = addContainer(stateWithCarrier, utilityPouch);
  const usage = getContainerVoucherUsage(stateWithPouch, thighCarrier.id);

  assert.equal(usage.used["mlbe:ap"], 4);
  assert.equal(usage.remaining["mlbe:ap"], 0);
  assert.equal(usage.used["lbe:component"], undefined);

  const hydrationCarrier = instantiateContainer(hydrationCarrierDefinition, {
    location: { kind: "container", containerId: thighCarrier.id },
  });

  assert.throws(
    () => addContainer(stateWithCarrier, hydrationCarrier),
    /Container does not fit in container Thigh Carrier/,
  );
});

test("communication electronics are present and tagged for radio pouches", () => {
  const tacticalRadio = ELECTRONICS_CATALOG.find((item) => item.id === "communication:radio-tactical");

  assert.ok(tacticalRadio);
  assert.equal(tacticalRadio?.tags?.includes("radio"), true);
  assert.equal(tacticalRadio?.tags?.includes("communication"), true);
  assert.equal(tacticalRadio?.notes?.includes("Source: Twilight 2013 Core OEF PDF p.221"), true);
});

test("non-electronic signal items are isolated in signal catalog", () => {
  const signalWhistle = SIGNAL_CATALOG.find((item) => item.id === "signal:whistle");
  const electronicLeak = ELECTRONICS_CATALOG.find((item) => item.id === "signal:whistle");

  assert.ok(signalWhistle);
  assert.equal(signalWhistle?.tags?.includes("non-electronic"), true);
  assert.equal(signalWhistle?.notes?.includes("Source: Twilight 2013 Core OEF PDF p.221"), true);
  assert.equal(electronicLeak, undefined);
});

test("nutrition helpers parse calorie and unit traits from consumables", () => {
  const militaryRation = FOOD_ITEMS.find((item) => item.id === "consumable:food-military-ration");
  const energyBar = SUPPLEMENT_ITEMS.find((item) => item.id === "consumable:supplement-energy-bar");
  const coffee = SUPPLEMENT_ITEMS.find((item) => item.id === "consumable:supplement-coffee");

  assert.ok(militaryRation);
  assert.ok(energyBar);
  assert.ok(coffee);

  assert.equal(getNutritionCalories(militaryRation), 1250);
  assert.equal(getNutritionUnit(militaryRation), "meal");
  assert.deepEqual(getNutrition(militaryRation), { calories: 1250, unit: "meal" });
  assert.equal(getNutritionCaloriesForQuantity(militaryRation, 2), 2500);

  assert.equal(getNutritionCalories(energyBar), 300);
  assert.equal(getNutritionUnit(energyBar), "item");

  assert.equal(getNutritionCalories(coffee), undefined);
  assert.equal(getNutrition(coffee), undefined);
});