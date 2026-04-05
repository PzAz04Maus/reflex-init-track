import assert from "node:assert/strict";
import test from "node:test";

import {
  DEMOLITION_CATALOG,
  DEMOLITION_RULES,
  GEAR_CATALOG,
  LIGHT_SUPPORT_WEAPONS_BY_ID,
  LIGHT_SUPPORT_WEAPONS_RULES,
} from "../src";

test("light support weapons section captures launcher families and ammo traits from pp.264-266", () => {
  const m203 = LIGHT_SUPPORT_WEAPONS_BY_ID["ordnance:launcher:m203:40x46mm"];
  const mk19 = LIGHT_SUPPORT_WEAPONS_BY_ID["ordnance:agl:mk-19:40x53mm-hv"];
  const tow = LIGHT_SUPPORT_WEAPONS_BY_ID["ordnance:atgm:tow"];

  assert.ok(m203);
  assert.ok(mk19);
  assert.ok(tow);
  assert.equal(m203.traits?.includes("ordnance:reload:6-ticks"), true);
  assert.equal(mk19.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:40x53mm-hv:hedp")?.damage?.[0]?.damage, 15);
  assert.equal(mk19.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:40x53mm-hv:hedp")?.damage?.[0]?.blast, 8);
  assert.equal(tow.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:tow-2b:heat")?.traits?.includes("ordnance:top-attack"), true);
});

test("launcher grenades encode non-thrown handling as traits instead of prose", () => {
  const genericLauncher = LIGHT_SUPPORT_WEAPONS_BY_ID["ordnance:launcher:shoulder-fired-generic:40x46mm"];
  const heGrenade = genericLauncher.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:40x46mm:he");
  const grenadeRule = LIGHT_SUPPORT_WEAPONS_RULES.find((rule) => rule.id === "ordnance-rule:launcher-grenades");

  assert.ok(heGrenade);
  assert.ok(grenadeRule);
  assert.equal(heGrenade.traits?.includes("ordnance:not-hand-thrown"), true);
  assert.equal(grenadeRule?.traits.includes("ordnance:not-hand-thrown"), true);
});

test("demolition catalog exposes mine, explosive, and detonator inventory items", () => {
  const c4 = DEMOLITION_CATALOG.find((item) => item.id === "demolition:explosive:plastic-explosive-block");
  const claymoreLike = DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:directional");
  const antipersonnelMine = DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:antipersonnel");
  const timer = DEMOLITION_CATALOG.find((item) => item.id === "demolition:detonator:timer");

  assert.ok(c4);
  assert.ok(claymoreLike);
  assert.ok(antipersonnelMine);
  assert.ok(timer);
  assert.equal(c4?.traits?.includes("demolition:dp:6"), true);
  assert.equal(claymoreLike?.traits?.includes("demolition:command-detonation-capable"), true);
  assert.deepEqual(antipersonnelMine?.damage, [{ damage: 8, blast: 4, frag: 6, area: { kind: "radius", meters: 2 } }]);
  assert.equal(timer?.traits?.includes("demolition:electric-output:10-caps"), true);
});

test("demolition mines expose structured damage arrays and preserve them on instantiation", () => {
  const antipersonnelMine = DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:antipersonnel");
  const antitankMine = DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:antitank-shaped");
  const directionalMine = DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:directional");
  const instantiatedMine = directionalMine?.instantiate();

  assert.ok(antipersonnelMine);
  assert.ok(antitankMine);
  assert.ok(directionalMine);
  assert.ok(instantiatedMine);
  assert.equal(antitankMine?.damage?.[0]?.damage, 40);
  assert.equal(antitankMine?.damage?.[0]?.blast, 10);
  assert.equal(antitankMine?.damage?.[0]?.frag, 2);
  assert.equal(directionalMine?.damage?.[0]?.area?.kind, "cone");
  assert.equal(directionalMine?.damage?.[0]?.area?.degrees, 60);
  assert.equal(directionalMine?.damage?.[0]?.notes?.[0], "Includes normal secondary effects.");
  assert.deepEqual(instantiatedMine?.damage, directionalMine?.damage);
});

test("gear catalog includes demolition stock and demolition rules preserve charge math", () => {
  const gearTimer = GEAR_CATALOG.find((item) => item.id === "demolition:detonator:timer");
  const basicChargeRule = DEMOLITION_RULES.find((rule) => rule.id === "demolition-rule:basic-charges");

  assert.ok(gearTimer);
  assert.ok(basicChargeRule);
  assert.equal(basicChargeRule?.notes[0], "Basic charge damage is 5 times the square root of total DP, rounded normally.");
});