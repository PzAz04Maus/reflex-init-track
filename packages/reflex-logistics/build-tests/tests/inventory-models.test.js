"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const closeCombatCatalog_1 = require("../src/closeCombatCatalog");
const ammunition_1 = require("../src/ammunition");
const inventory_1 = require("../src/inventory");
const containerCatalog_1 = require("../src/containerCatalog");
const weaponAttachmentsCatalog_1 = require("../src/weaponAttachmentsCatalog");
const electronicsCatalog_1 = require("../src/electronicsCatalog");
const signalCatalog_1 = require("../src/signalCatalog");
(0, node_test_1.default)("item definition instantiate clones nested item metadata", () => {
    const definition = (0, inventory_1.createItemDefinition)({
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
    strict_1.default.deepEqual(definition.traits, ["Powered"]);
    strict_1.default.equal(item.location.kind, "root");
    item.weaponAttachment?.compatibleWeaponTags.push("mutated-tag");
    strict_1.default.deepEqual(definition.weaponAttachment?.compatibleWeaponTags, ["firearm"]);
});
(0, node_test_1.default)("ranged weapon instantiate clones nested ranged weapon state", () => {
    const definition = (0, inventory_1.createRangedWeaponDefinition)({
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
    strict_1.default.deepEqual(definition.rangedWeapon.traits, ["firearm", "rifle"]);
    strict_1.default.equal(definition.rangedWeapon.range.maximum, "Open");
});
(0, node_test_1.default)("humanoid equipment container uses the extracted voucher layout", () => {
    const container = (0, inventory_1.createHumanoidEquipmentContainer)({ idPrefix: "test" }).equipment;
    strict_1.default.equal(container.id, "test:equipment");
    strict_1.default.equal(container.voucherDefinitions?.length, 11);
    strict_1.default.equal(container.voucherLimits?.["held:hands"], 2);
});
(0, node_test_1.default)("military-pattern small arms expose fire-control modifications", () => {
    strict_1.default.equal(weaponAttachmentsCatalog_1.FIRE_CONTROL_MODIFICATIONS.length, 2);
    strict_1.default.equal(inventory_1.SUBMACHINE_GUNS[0]?.supportsAttachmentKind("fire-control-modification"), true);
    strict_1.default.equal(inventory_1.ASSAULT_RIFLES[0]?.supportsAttachmentKind("fire-control-modification"), true);
    strict_1.default.equal(inventory_1.AUTOLOADERS[0]?.supportsAttachmentKind("fire-control-modification"), false);
});
(0, node_test_1.default)("small-arms ammunition generates special pistol and rifle loads from base pricing", () => {
    const fiveSeven = ammunition_1.PISTOL_CARTRIDGES.find((entry) => entry.caliber === "5.7mm FN");
    const fiveFiveSix = ammunition_1.SMALL_ARMS_AMMUNITION_ITEMS.find((item) => item.id === "ammo:rifle-cartridge:5-56x45mm:armor-piercing:100");
    strict_1.default.ok(fiveSeven?.ball);
    strict_1.default.equal(fiveSeven?.armorPiercing?.streetPrice, 510);
    strict_1.default.equal(fiveSeven?.hollowpoint?.streetPrice, 204);
    strict_1.default.equal(fiveSeven?.armorPiercing?.barterValue, "GG350");
    strict_1.default.equal(fiveFiveSix?.streetPrice, 250);
});
(0, node_test_1.default)("shotgun ammunition includes slug and buckshot variants at the same listed cost", () => {
    const twelveGauge = ammunition_1.SHOTGUN_SHELLS.find((entry) => entry.caliber === "12 gauge");
    strict_1.default.ok(twelveGauge?.slug);
    strict_1.default.ok(twelveGauge?.buckshot);
    strict_1.default.equal(twelveGauge?.slug?.streetPrice, 200);
    strict_1.default.equal(twelveGauge?.buckshot?.streetPrice, 200);
    strict_1.default.equal(twelveGauge?.buckshot?.weight, 6);
    strict_1.default.equal(twelveGauge?.buckshot?.notes?.includes("The attacker's margin of success is doubled for purposes of determining final Damage when firing buckshot."), true);
});
(0, node_test_1.default)("close-combat catalog includes special-case melee and spray entries", () => {
    const brassKnuckles = closeCombatCatalog_1.CLOSE_COMBAT_WEAPONS.find((item) => item.id === "weapon:close-combat:brass-knuckles");
    const telescopingBaton = closeCombatCatalog_1.CLOSE_COMBAT_WEAPONS.find((item) => item.id === "weapon:close-combat:baton-telescoping");
    const policeSpray = closeCombatCatalog_1.PEPPER_SPRAY_CANISTERS.find((item) => item.id === "weapon:close-combat:pepper-spray-police");
    strict_1.default.equal(brassKnuckles?.voucherCost?.["worn:hands"], 1);
    strict_1.default.equal(telescopingBaton?.notes?.includes("When collapsed, a telescoping baton performs like a sap. Ready it as a Novice Hand Weapons action to extend it."), true);
    strict_1.default.equal(policeSpray?.notes?.includes("A direct hit to the head inflicts an additional -2 penalty on the victim's Resolve check."), true);
});
(0, node_test_1.default)("portable containers consume voucher slots when worn or carried", () => {
    const equipment = (0, inventory_1.createHumanoidEquipmentContainer)({ idPrefix: "carrier" }).equipment;
    const framePackDefinition = containerCatalog_1.PACK_CONTAINERS.find((container) => container.id === "container:pack:frame-civilian");
    strict_1.default.ok(framePackDefinition);
    const framePack = (0, inventory_1.instantiateContainer)(framePackDefinition, {
        location: { kind: "container", containerId: equipment.id },
    });
    const state = (0, inventory_1.addContainer)((0, inventory_1.createInventoryState)([], [equipment]), framePack);
    const usage = (0, inventory_1.getContainerVoucherUsage)(state, equipment.id);
    strict_1.default.equal(usage.used["worn:back"], 1);
    strict_1.default.equal(usage.remaining["worn:back"], 0);
});
(0, node_test_1.default)("holsters consume stowed-handgun voucher capacity", () => {
    const equipment = (0, inventory_1.createHumanoidEquipmentContainer)({ idPrefix: "holster-test" }).equipment;
    const beltDefinition = containerCatalog_1.FIXED_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:lbe:basic-belt-and-yoke");
    const holsterDefinition = containerCatalog_1.FIXED_LBE_COMPONENT_CONTAINERS.find((container) => container.id === "container:lbe:holster");
    const handgunDefinition = (0, inventory_1.createItemDefinition)({
        id: "item:test-handgun-definition",
        name: "Test Handgun",
        weight: 0.9,
        tags: ["weapon", "firearm", "handgun", "sidearm"],
        voucherCost: { "held:hands": 1 },
    });
    strict_1.default.ok(beltDefinition);
    strict_1.default.ok(holsterDefinition);
    strict_1.default.ok(handgunDefinition);
    const belt = (0, inventory_1.instantiateContainer)(beltDefinition, {
        location: { kind: "container", containerId: equipment.id },
    });
    const holster = (0, inventory_1.instantiateContainer)(holsterDefinition, {
        location: { kind: "container", containerId: belt.id },
    });
    const handgun = (0, inventory_1.createItem)({
        id: "item:test-handgun-1",
        name: handgunDefinition.name,
        weight: handgunDefinition.weight,
        tags: handgunDefinition.tags,
        voucherCost: handgunDefinition.voucherCost,
        quantity: 1,
        location: { kind: "container", containerId: holster.id },
    });
    const secondHandgun = (0, inventory_1.createItem)({
        id: "item:test-handgun-2",
        name: handgunDefinition.name,
        weight: handgunDefinition.weight,
        tags: handgunDefinition.tags,
        voucherCost: handgunDefinition.voucherCost,
        quantity: 1,
        location: { kind: "container", containerId: holster.id },
    });
    let state = (0, inventory_1.createInventoryState)([], [equipment]);
    state = (0, inventory_1.addContainer)(state, belt);
    state = (0, inventory_1.addContainer)(state, holster);
    state = (0, inventory_1.addItem)(state, handgun);
    const usage = (0, inventory_1.getContainerVoucherUsage)(state, holster.id);
    strict_1.default.equal(usage.used["stowed:handgun"], 1);
    strict_1.default.equal(usage.remaining["stowed:handgun"], 0);
    strict_1.default.throws(() => (0, inventory_1.addItem)(state, secondHandgun), /Item does not fit in container Holster/);
});
(0, node_test_1.default)("magazine pouches use stowed-magazine voucher slots", () => {
    const equipment = (0, inventory_1.createHumanoidEquipmentContainer)({ idPrefix: "mag-test" }).equipment;
    const beltDefinition = containerCatalog_1.FIXED_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:lbe:basic-belt-and-yoke");
    const pouchDefinition = containerCatalog_1.FIXED_LBE_COMPONENT_CONTAINERS.find((container) => container.id === "container:lbe:mag-carrier-pistol-triple");
    const spareMagazineDefinition = weaponAttachmentsCatalog_1.AMMUNITION_HANDLING_ITEMS.find((item) => item.id === "accessory:spare-magazine");
    strict_1.default.ok(beltDefinition);
    strict_1.default.ok(pouchDefinition);
    strict_1.default.ok(spareMagazineDefinition);
    const belt = (0, inventory_1.instantiateContainer)(beltDefinition, {
        location: { kind: "container", containerId: equipment.id },
    });
    const pouch = (0, inventory_1.instantiateContainer)(pouchDefinition, {
        location: { kind: "container", containerId: belt.id },
    });
    let state = (0, inventory_1.createInventoryState)([], [equipment]);
    state = (0, inventory_1.addContainer)(state, belt);
    state = (0, inventory_1.addContainer)(state, pouch);
    for (let index = 0; index < 3; index += 1) {
        state = (0, inventory_1.addItem)(state, (0, inventory_1.createItem)({
            id: `item:test-magazine-${index + 1}`,
            name: spareMagazineDefinition.name,
            weight: spareMagazineDefinition.weight,
            tags: spareMagazineDefinition.tags,
            quantity: 1,
            location: { kind: "container", containerId: pouch.id },
        }));
    }
    const usage = (0, inventory_1.getContainerVoucherUsage)(state, pouch.id);
    strict_1.default.equal(usage.used["stowed:magazine"], 3);
    strict_1.default.equal(usage.remaining["stowed:magazine"], 0);
    strict_1.default.throws(() => (0, inventory_1.addItem)(state, (0, inventory_1.createItem)({
        id: "item:test-magazine-4",
        name: spareMagazineDefinition.name,
        weight: spareMagazineDefinition.weight,
        tags: spareMagazineDefinition.tags,
        quantity: 1,
        location: { kind: "container", containerId: pouch.id },
    })), /Item does not fit in container Mag Carrier, Pistol, Triple/);
});
(0, node_test_1.default)("sheaths accept knife-tagged items and reject other items", () => {
    const equipment = (0, inventory_1.createHumanoidEquipmentContainer)({ idPrefix: "sheath-test" }).equipment;
    const beltDefinition = containerCatalog_1.FIXED_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:lbe:basic-belt-and-yoke");
    const sheathDefinition = containerCatalog_1.FIXED_LBE_COMPONENT_CONTAINERS.find((container) => container.id === "container:lbe:sheath");
    const knifeDefinition = closeCombatCatalog_1.CLOSE_COMBAT_WEAPONS.find((item) => item.id === "weapon:close-combat:knife-working");
    const handgunDefinition = inventory_1.AUTOLOADERS[0];
    strict_1.default.ok(beltDefinition);
    strict_1.default.ok(sheathDefinition);
    strict_1.default.ok(knifeDefinition);
    strict_1.default.ok(handgunDefinition);
    const belt = (0, inventory_1.instantiateContainer)(beltDefinition, {
        location: { kind: "container", containerId: equipment.id },
    });
    const sheath = (0, inventory_1.instantiateContainer)(sheathDefinition, {
        location: { kind: "container", containerId: belt.id },
    });
    let state = (0, inventory_1.createInventoryState)([], [equipment]);
    state = (0, inventory_1.addContainer)(state, belt);
    state = (0, inventory_1.addContainer)(state, sheath);
    state = (0, inventory_1.addItem)(state, (0, inventory_1.createItem)({
        id: "item:test-knife-1",
        name: knifeDefinition.name,
        weight: knifeDefinition.weight,
        tags: knifeDefinition.tags,
        voucherCost: knifeDefinition.voucherCost,
        quantity: 1,
        location: { kind: "container", containerId: sheath.id },
    }));
    const usage = (0, inventory_1.getContainerVoucherUsage)(state, sheath.id);
    strict_1.default.equal(usage.used["stowed:knife"], 1);
    strict_1.default.equal(usage.remaining["stowed:knife"], 0);
    strict_1.default.throws(() => (0, inventory_1.addItem)(state, (0, inventory_1.createItem)({
        id: "item:test-sheath-handgun",
        name: handgunDefinition.name,
        weight: handgunDefinition.weight,
        tags: handgunDefinition.tags,
        voucherCost: handgunDefinition.voucherCost,
        quantity: 1,
        location: { kind: "container", containerId: sheath.id },
    })), /not compatible with container Sheath/);
});
(0, node_test_1.default)("canteen carriers accept tagged child containers", () => {
    const equipment = (0, inventory_1.createHumanoidEquipmentContainer)({ idPrefix: "canteen-test" }).equipment;
    const beltDefinition = containerCatalog_1.FIXED_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:lbe:basic-belt-and-yoke");
    const canteenCarrierDefinition = containerCatalog_1.FIXED_LBE_COMPONENT_CONTAINERS.find((container) => container.id === "container:lbe:canteen-carrier");
    const canteenDefinition = containerCatalog_1.SURVIVAL_CONTAINERS.find((container) => container.id === "container:survival:canteen-1l");
    const hydrationDefinition = containerCatalog_1.SURVIVAL_CONTAINERS.find((container) => container.id === "container:survival:hydration-bladder-1-5l");
    strict_1.default.ok(beltDefinition);
    strict_1.default.ok(canteenCarrierDefinition);
    strict_1.default.ok(canteenDefinition);
    strict_1.default.ok(hydrationDefinition);
    const belt = (0, inventory_1.instantiateContainer)(beltDefinition, {
        location: { kind: "container", containerId: equipment.id },
    });
    const canteenCarrier = (0, inventory_1.instantiateContainer)(canteenCarrierDefinition, {
        location: { kind: "container", containerId: belt.id },
    });
    let state = (0, inventory_1.createInventoryState)([], [equipment]);
    state = (0, inventory_1.addContainer)(state, belt);
    state = (0, inventory_1.addContainer)(state, canteenCarrier);
    state = (0, inventory_1.addContainer)(state, (0, inventory_1.instantiateContainer)(canteenDefinition, {
        location: { kind: "container", containerId: canteenCarrier.id },
    }));
    const usage = (0, inventory_1.getContainerVoucherUsage)(state, canteenCarrier.id);
    strict_1.default.equal(usage.used["stowed:canteen"], 1);
    strict_1.default.equal(usage.remaining["stowed:canteen"], 0);
    strict_1.default.throws(() => (0, inventory_1.addContainer)(state, (0, inventory_1.instantiateContainer)(hydrationDefinition, {
        location: { kind: "container", containerId: canteenCarrier.id },
    })), /not compatible with container Canteen Carrier/);
});
(0, node_test_1.default)("modular pouches consume and enforce container attachment-point budgets", () => {
    const thighCarrierDefinition = containerCatalog_1.MODULAR_LOAD_BEARING_CONTAINERS.find((container) => container.id === "container:mlbe:thigh-carrier");
    const utilityPouchDefinition = containerCatalog_1.MODULAR_LOAD_BEARING_POUCHES.find((container) => container.id === "container:mlbe:utility-pouch");
    const hydrationCarrierDefinition = containerCatalog_1.MODULAR_LOAD_BEARING_POUCHES.find((container) => container.id === "container:mlbe:hydration-bladder-carrier");
    strict_1.default.ok(thighCarrierDefinition);
    strict_1.default.ok(utilityPouchDefinition);
    strict_1.default.ok(hydrationCarrierDefinition);
    const thighCarrier = (0, inventory_1.instantiateContainer)(thighCarrierDefinition);
    const utilityPouch = (0, inventory_1.instantiateContainer)(utilityPouchDefinition, {
        location: { kind: "container", containerId: thighCarrier.id },
    });
    const stateWithCarrier = (0, inventory_1.createInventoryState)([], [thighCarrier]);
    const stateWithPouch = (0, inventory_1.addContainer)(stateWithCarrier, utilityPouch);
    const usage = (0, inventory_1.getContainerVoucherUsage)(stateWithPouch, thighCarrier.id);
    strict_1.default.equal(usage.used["mlbe:ap"], 4);
    strict_1.default.equal(usage.remaining["mlbe:ap"], 0);
    strict_1.default.equal(usage.used["lbe:component"], undefined);
    const hydrationCarrier = (0, inventory_1.instantiateContainer)(hydrationCarrierDefinition, {
        location: { kind: "container", containerId: thighCarrier.id },
    });
    strict_1.default.throws(() => (0, inventory_1.addContainer)(stateWithCarrier, hydrationCarrier), /Container does not fit in container Thigh Carrier/);
});
(0, node_test_1.default)("communication electronics are present and tagged for radio pouches", () => {
    const tacticalRadio = electronicsCatalog_1.ELECTRONICS_CATALOG.find((item) => item.id === "communication:radio-tactical");
    strict_1.default.ok(tacticalRadio);
    strict_1.default.equal(tacticalRadio?.tags?.includes("radio"), true);
    strict_1.default.equal(tacticalRadio?.tags?.includes("communication"), true);
    strict_1.default.equal(tacticalRadio?.notes?.includes("Source: Twilight 2013 Core OEF PDF p.221"), true);
});
(0, node_test_1.default)("non-electronic signal items are isolated in signal catalog", () => {
    const signalWhistle = signalCatalog_1.SIGNAL_CATALOG.find((item) => item.id === "signal:whistle");
    const electronicLeak = electronicsCatalog_1.ELECTRONICS_CATALOG.find((item) => item.id === "signal:whistle");
    strict_1.default.ok(signalWhistle);
    strict_1.default.equal(signalWhistle?.tags?.includes("non-electronic"), true);
    strict_1.default.equal(signalWhistle?.notes?.includes("Source: Twilight 2013 Core OEF PDF p.221"), true);
    strict_1.default.equal(electronicLeak, undefined);
});
