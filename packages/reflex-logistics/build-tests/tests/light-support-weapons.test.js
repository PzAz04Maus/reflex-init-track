"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const strict_1 = __importDefault(require("node:assert/strict"));
const node_test_1 = __importDefault(require("node:test"));
const src_1 = require("../src");
(0, node_test_1.default)("light support weapons section captures launcher families and ammo traits from pp.264-266", () => {
    const m203 = src_1.LIGHT_SUPPORT_WEAPONS_BY_ID["ordnance:launcher:m203:40x46mm"];
    const mk19 = src_1.LIGHT_SUPPORT_WEAPONS_BY_ID["ordnance:agl:mk-19:40x53mm-hv"];
    const tow = src_1.LIGHT_SUPPORT_WEAPONS_BY_ID["ordnance:atgm:tow"];
    strict_1.default.ok(m203);
    strict_1.default.ok(mk19);
    strict_1.default.ok(tow);
    strict_1.default.equal(m203.traits?.includes("ordnance:reload:6-ticks"), true);
    strict_1.default.equal(mk19.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:40x53mm-hv:hedp")?.damage?.[0]?.damage, 15);
    strict_1.default.equal(mk19.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:40x53mm-hv:hedp")?.damage?.[0]?.blast, 8);
    strict_1.default.equal(tow.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:tow-2b:heat")?.traits?.includes("ordnance:top-attack"), true);
});
(0, node_test_1.default)("launcher grenades encode non-thrown handling as traits instead of prose", () => {
    const genericLauncher = src_1.LIGHT_SUPPORT_WEAPONS_BY_ID["ordnance:launcher:shoulder-fired-generic:40x46mm"];
    const heGrenade = genericLauncher.ammoOptions?.find((ammo) => ammo.id === "ordnance-ammo:40x46mm:he");
    const grenadeRule = src_1.LIGHT_SUPPORT_WEAPONS_RULES.find((rule) => rule.id === "ordnance-rule:launcher-grenades");
    strict_1.default.ok(heGrenade);
    strict_1.default.ok(grenadeRule);
    strict_1.default.equal(heGrenade.traits?.includes("ordnance:not-hand-thrown"), true);
    strict_1.default.equal(grenadeRule?.traits.includes("ordnance:not-hand-thrown"), true);
});
(0, node_test_1.default)("demolition catalog exposes mine, explosive, and detonator inventory items", () => {
    const c4 = src_1.DEMOLITION_CATALOG.find((item) => item.id === "demolition:explosive:plastic-explosive-block");
    const claymoreLike = src_1.DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:directional");
    const antipersonnelMine = src_1.DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:antipersonnel");
    const timer = src_1.DEMOLITION_CATALOG.find((item) => item.id === "demolition:detonator:timer");
    strict_1.default.ok(c4);
    strict_1.default.ok(claymoreLike);
    strict_1.default.ok(antipersonnelMine);
    strict_1.default.ok(timer);
    strict_1.default.equal(c4?.traits?.includes("demolition:dp:6"), true);
    strict_1.default.equal(claymoreLike?.traits?.includes("demolition:command-detonation-capable"), true);
    strict_1.default.deepEqual(antipersonnelMine?.damage, [{ damage: 8, blast: 4, frag: 6, area: { kind: "radius", meters: 2 } }]);
    strict_1.default.equal(timer?.traits?.includes("demolition:electric-output:10-caps"), true);
});
(0, node_test_1.default)("demolition mines expose structured damage arrays and preserve them on instantiation", () => {
    const antipersonnelMine = src_1.DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:antipersonnel");
    const antitankMine = src_1.DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:antitank-shaped");
    const directionalMine = src_1.DEMOLITION_CATALOG.find((item) => item.id === "demolition:mine:directional");
    const instantiatedMine = directionalMine?.instantiate();
    strict_1.default.ok(antipersonnelMine);
    strict_1.default.ok(antitankMine);
    strict_1.default.ok(directionalMine);
    strict_1.default.ok(instantiatedMine);
    strict_1.default.equal(antitankMine?.damage?.[0]?.damage, 40);
    strict_1.default.equal(antitankMine?.damage?.[0]?.blast, 10);
    strict_1.default.equal(antitankMine?.damage?.[0]?.frag, 2);
    strict_1.default.equal(directionalMine?.damage?.[0]?.area?.kind, "cone");
    strict_1.default.equal(directionalMine?.damage?.[0]?.area?.degrees, 60);
    strict_1.default.equal(directionalMine?.damage?.[0]?.notes?.[0], "Includes normal secondary effects.");
    strict_1.default.deepEqual(instantiatedMine?.damage, directionalMine?.damage);
});
(0, node_test_1.default)("gear catalog includes demolition stock and demolition rules preserve charge math", () => {
    const gearTimer = src_1.GEAR_CATALOG.find((item) => item.id === "demolition:detonator:timer");
    const basicChargeRule = src_1.DEMOLITION_RULES.find((rule) => rule.id === "demolition-rule:basic-charges");
    strict_1.default.ok(gearTimer);
    strict_1.default.ok(basicChargeRule);
    strict_1.default.equal(basicChargeRule?.notes[0], "Basic charge damage is 5 times the square root of total DP, rounded normally.");
});
