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
  assert.equal(mk19.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:40x53mm-hv:hedp")?.damage, 15);
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
  const timer = DEMOLITION_CATALOG.find((item) => item.id === "demolition:detonator:timer");

  assert.ok(c4);
  assert.ok(claymoreLike);
  assert.ok(timer);
  assert.equal(c4?.traits?.includes("demolition:dp:6"), true);
  assert.equal(claymoreLike?.traits?.includes("demolition:command-detonation-capable"), true);
  assert.equal(timer?.traits?.includes("demolition:electric-output:10-caps"), true);
});

test("gear catalog includes demolition stock and demolition rules preserve charge math", () => {
  const gearTimer = GEAR_CATALOG.find((item) => item.id === "demolition:detonator:timer");
  const basicChargeRule = DEMOLITION_RULES.find((rule) => rule.id === "demolition-rule:basic-charges");

  assert.ok(gearTimer);
  assert.ok(basicChargeRule);
  assert.equal(basicChargeRule?.notes[0], "Basic charge damage is 5 times the square root of total DP, rounded normally.");
});