"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __exportStar = (this && this.__exportStar) || function(m, exports) {
    for (var p in m) if (p !== "default" && !Object.prototype.hasOwnProperty.call(exports, p)) __createBinding(exports, m, p);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GEAR_CATALOG = exports.SURVIVAL_CATALOG = exports.TOOLS_CATALOG = exports.WEAPON_ATTACHMENTS = exports.ELECTRONICS_CATALOG = exports.CAMOUFLAGE_AND_LINES_ITEMS = exports.TERRAIN_MOBILITY_ITEMS = exports.NAVIGATION_ITEMS = exports.SANITATION_ITEMS = exports.FIRE_AND_COOKING_ITEMS = exports.FOOD_ACQUISITION_ITEMS = exports.PURIFICATION_ITEMS = exports.SPECIALIST_TOOLS = exports.ARMAMENT_TOOLS = exports.HAND_TOOLS = exports.OPTICS = exports.SHOTGUN_MODIFICATIONS = exports.RAIL_ACCESSORIES = exports.MISCELLANEOUS_ACCESSORIES = exports.FIRE_CONTROL_MODIFICATIONS = exports.AMMUNITION_HANDLING_ITEMS = exports.STILLS = exports.GENERATORS = exports.POWERED_TOOLS = exports.THERMAL_IMAGING_ITEMS = exports.NIGHT_VISION_ITEMS = exports.MAGNIFICATION_ITEMS = exports.ILLUMINATION_ITEMS = void 0;
const ammunition_1 = require("./ammunition");
const armorCatalog_1 = require("./armorCatalog");
const clothingCatalog_1 = require("./clothingCatalog");
const closeCombatCatalog_1 = require("./closeCombatCatalog");
const illumination_1 = require("./electronics-catalog/illumination");
const vision_1 = require("./electronics-catalog/vision");
const poweredTools_1 = require("./electronics-catalog/poweredTools");
const genericCatalog_1 = require("./genericCatalog");
const rangedCatalog_1 = require("./rangedCatalog");
const signalCatalog_1 = require("./signalCatalog");
const ammunitionHandling_1 = require("./weapon-attachments-catalog/ammunitionHandling");
const accessories_1 = require("./weapon-attachments-catalog/accessories");
const optics_1 = require("./weapon-attachments-catalog/optics");
const tools_catalog_1 = require("./tools-catalog");
const survival_catalog_1 = require("./survival-catalog");
__exportStar(require("./ammunition"), exports);
__exportStar(require("./armorCatalog"), exports);
__exportStar(require("./clothingCatalog"), exports);
__exportStar(require("./closeCombatCatalog"), exports);
var illumination_2 = require("./electronics-catalog/illumination");
Object.defineProperty(exports, "ILLUMINATION_ITEMS", { enumerable: true, get: function () { return illumination_2.ILLUMINATION_ITEMS; } });
var vision_2 = require("./electronics-catalog/vision");
Object.defineProperty(exports, "MAGNIFICATION_ITEMS", { enumerable: true, get: function () { return vision_2.MAGNIFICATION_ITEMS; } });
Object.defineProperty(exports, "NIGHT_VISION_ITEMS", { enumerable: true, get: function () { return vision_2.NIGHT_VISION_ITEMS; } });
Object.defineProperty(exports, "THERMAL_IMAGING_ITEMS", { enumerable: true, get: function () { return vision_2.THERMAL_IMAGING_ITEMS; } });
var poweredTools_2 = require("./electronics-catalog/poweredTools");
Object.defineProperty(exports, "POWERED_TOOLS", { enumerable: true, get: function () { return poweredTools_2.POWERED_TOOLS; } });
Object.defineProperty(exports, "GENERATORS", { enumerable: true, get: function () { return poweredTools_2.GENERATORS; } });
Object.defineProperty(exports, "STILLS", { enumerable: true, get: function () { return poweredTools_2.STILLS; } });
__exportStar(require("./genericCatalog"), exports);
__exportStar(require("./rangedCatalog"), exports);
__exportStar(require("./signalCatalog"), exports);
var ammunitionHandling_2 = require("./weapon-attachments-catalog/ammunitionHandling");
Object.defineProperty(exports, "AMMUNITION_HANDLING_ITEMS", { enumerable: true, get: function () { return ammunitionHandling_2.AMMUNITION_HANDLING_ITEMS; } });
var accessories_2 = require("./weapon-attachments-catalog/accessories");
Object.defineProperty(exports, "FIRE_CONTROL_MODIFICATIONS", { enumerable: true, get: function () { return accessories_2.FIRE_CONTROL_MODIFICATIONS; } });
Object.defineProperty(exports, "MISCELLANEOUS_ACCESSORIES", { enumerable: true, get: function () { return accessories_2.MISCELLANEOUS_ACCESSORIES; } });
Object.defineProperty(exports, "RAIL_ACCESSORIES", { enumerable: true, get: function () { return accessories_2.RAIL_ACCESSORIES; } });
Object.defineProperty(exports, "SHOTGUN_MODIFICATIONS", { enumerable: true, get: function () { return accessories_2.SHOTGUN_MODIFICATIONS; } });
var optics_2 = require("./weapon-attachments-catalog/optics");
Object.defineProperty(exports, "OPTICS", { enumerable: true, get: function () { return optics_2.OPTICS; } });
var tools_catalog_2 = require("./tools-catalog");
Object.defineProperty(exports, "HAND_TOOLS", { enumerable: true, get: function () { return tools_catalog_2.HAND_TOOLS; } });
Object.defineProperty(exports, "ARMAMENT_TOOLS", { enumerable: true, get: function () { return tools_catalog_2.ARMAMENT_TOOLS; } });
Object.defineProperty(exports, "SPECIALIST_TOOLS", { enumerable: true, get: function () { return tools_catalog_2.SPECIALIST_TOOLS; } });
var survival_catalog_2 = require("./survival-catalog");
Object.defineProperty(exports, "PURIFICATION_ITEMS", { enumerable: true, get: function () { return survival_catalog_2.PURIFICATION_ITEMS; } });
Object.defineProperty(exports, "FOOD_ACQUISITION_ITEMS", { enumerable: true, get: function () { return survival_catalog_2.FOOD_ACQUISITION_ITEMS; } });
Object.defineProperty(exports, "FIRE_AND_COOKING_ITEMS", { enumerable: true, get: function () { return survival_catalog_2.FIRE_AND_COOKING_ITEMS; } });
Object.defineProperty(exports, "SANITATION_ITEMS", { enumerable: true, get: function () { return survival_catalog_2.SANITATION_ITEMS; } });
Object.defineProperty(exports, "NAVIGATION_ITEMS", { enumerable: true, get: function () { return survival_catalog_2.NAVIGATION_ITEMS; } });
Object.defineProperty(exports, "TERRAIN_MOBILITY_ITEMS", { enumerable: true, get: function () { return survival_catalog_2.TERRAIN_MOBILITY_ITEMS; } });
Object.defineProperty(exports, "CAMOUFLAGE_AND_LINES_ITEMS", { enumerable: true, get: function () { return survival_catalog_2.CAMOUFLAGE_AND_LINES_ITEMS; } });
exports.ELECTRONICS_CATALOG = [
    ...illumination_1.ILLUMINATION_ITEMS,
    ...vision_1.MAGNIFICATION_ITEMS,
    ...vision_1.NIGHT_VISION_ITEMS,
    ...vision_1.THERMAL_IMAGING_ITEMS,
    ...poweredTools_1.POWERED_TOOLS,
];
exports.WEAPON_ATTACHMENTS = [
    ...ammunitionHandling_1.AMMUNITION_HANDLING_ITEMS,
    ...optics_1.OPTICS,
    ...accessories_1.RAIL_ACCESSORIES,
    ...accessories_1.MISCELLANEOUS_ACCESSORIES,
    ...accessories_1.FIRE_CONTROL_MODIFICATIONS,
    ...accessories_1.SHOTGUN_MODIFICATIONS,
];
exports.TOOLS_CATALOG = [
    ...tools_catalog_1.HAND_TOOLS,
    ...tools_catalog_1.ARMAMENT_TOOLS,
    ...tools_catalog_1.SPECIALIST_TOOLS,
    ...poweredTools_1.POWERED_TOOLS,
    ...poweredTools_1.GENERATORS,
    ...poweredTools_1.STILLS,
];
exports.SURVIVAL_CATALOG = [
    ...survival_catalog_1.PURIFICATION_ITEMS,
    ...survival_catalog_1.FOOD_ACQUISITION_ITEMS,
    ...survival_catalog_1.FIRE_AND_COOKING_ITEMS,
    ...survival_catalog_1.SANITATION_ITEMS,
    ...survival_catalog_1.NAVIGATION_ITEMS,
    ...survival_catalog_1.TERRAIN_MOBILITY_ITEMS,
    ...survival_catalog_1.CAMOUFLAGE_AND_LINES_ITEMS,
];
exports.GEAR_CATALOG = [
    ...genericCatalog_1.GENERIC_CATALOG,
    ...clothingCatalog_1.CLOTHING_CATALOG,
    ...ammunition_1.SMALL_ARMS_AMMUNITION_ITEMS,
    ...closeCombatCatalog_1.CLOSE_COMBAT_WEAPONS,
    ...exports.ELECTRONICS_CATALOG,
    ...signalCatalog_1.SIGNAL_CATALOG,
    ...rangedCatalog_1.RANGED_CATALOG,
    ...exports.WEAPON_ATTACHMENTS,
    ...armorCatalog_1.ARMOR_CATALOG,
    ...exports.TOOLS_CATALOG,
    ...exports.SURVIVAL_CATALOG,
];
