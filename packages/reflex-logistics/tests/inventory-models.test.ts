import assert from "node:assert/strict";
import test from "node:test";

import {
  PISTOL_CARTRIDGES,
  SHOTGUN_SHELLS,
  SMALL_ARMS_AMMUNITION_ITEMS,
} from "../src/ammunition";
import {
  ASSAULT_RIFLES,
  AUTOLOADERS,
  createHumanoidEquipmentContainer,
  createItemDefinition,
  createRangedWeaponDefinition,
  SUBMACHINE_GUNS,
} from "../src/inventory";
import { FIRE_CONTROL_MODIFICATIONS } from "../src/weaponAttachmentsCatalog";

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
  assert.equal(twelveGauge?.buckshot?.notes?.includes("The attacker's margin of success is doubled for purposes of determining final Damage when firing buckshot."), true);
});