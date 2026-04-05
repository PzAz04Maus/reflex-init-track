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
exports.GEAR_CATALOG = void 0;
const ammunition_1 = require("./ammunition");
const armorCatalog_1 = require("./armorCatalog");
const clothingCatalog_1 = require("./clothingCatalog");
const closeCombatCatalog_1 = require("./closeCombatCatalog");
const demolitionsCatalog_1 = require("./demolitionsCatalog");
const electronicsCatalog_1 = require("./electronicsCatalog");
const genericCatalog_1 = require("./genericCatalog");
const rangedCatalog_1 = require("./rangedCatalog");
const weaponAttachmentsCatalog_1 = require("./weaponAttachmentsCatalog");
__exportStar(require("./ammunition"), exports);
__exportStar(require("./armorCatalog"), exports);
__exportStar(require("./clothingCatalog"), exports);
__exportStar(require("./closeCombatCatalog"), exports);
__exportStar(require("./demolitionsCatalog"), exports);
__exportStar(require("./electronicsCatalog"), exports);
__exportStar(require("./genericCatalog"), exports);
__exportStar(require("./lightSupportWeapons"), exports);
__exportStar(require("./rangedCatalog"), exports);
__exportStar(require("./weaponAttachmentsCatalog"), exports);
exports.GEAR_CATALOG = [
    ...genericCatalog_1.GENERIC_CATALOG,
    ...clothingCatalog_1.CLOTHING_CATALOG,
    ...ammunition_1.SMALL_ARMS_AMMUNITION_ITEMS,
    ...closeCombatCatalog_1.CLOSE_COMBAT_WEAPONS,
    ...demolitionsCatalog_1.DEMOLITION_CATALOG,
    ...electronicsCatalog_1.ELECTRONICS_CATALOG,
    ...rangedCatalog_1.RANGED_CATALOG,
    ...weaponAttachmentsCatalog_1.WEAPON_ATTACHMENTS,
    ...armorCatalog_1.ARMOR_CATALOG,
];
