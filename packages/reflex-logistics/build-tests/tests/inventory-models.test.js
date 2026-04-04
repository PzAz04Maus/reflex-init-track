"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const inventory_1 = require("../src/inventory");
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
