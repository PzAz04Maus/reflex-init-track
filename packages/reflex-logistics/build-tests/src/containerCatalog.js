"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CONTAINER_CATALOG = exports.LIQUID_STORAGE_CONTAINERS = exports.DRY_GOODS_STORAGE_CONTAINERS = exports.SURVIVAL_CONTAINERS = exports.PACK_CONTAINERS = exports.MODULAR_LOAD_BEARING_POUCHES = exports.MODULAR_LOAD_BEARING_CONTAINERS = exports.FIXED_LOAD_BEARING_CONTAINERS = exports.FIXED_LBE_COMPONENT_CONTAINERS = void 0;
const fixedLoadBearing_1 = require("./container-catalog/fixedLoadBearing");
const modularLoadBearing_1 = require("./container-catalog/modularLoadBearing");
const packs_1 = require("./container-catalog/packs");
const survival_1 = require("./container-catalog/survival");
const storage_1 = require("./container-catalog/storage");
var fixedLoadBearing_2 = require("./container-catalog/fixedLoadBearing");
Object.defineProperty(exports, "FIXED_LBE_COMPONENT_CONTAINERS", { enumerable: true, get: function () { return fixedLoadBearing_2.FIXED_LBE_COMPONENT_CONTAINERS; } });
Object.defineProperty(exports, "FIXED_LOAD_BEARING_CONTAINERS", { enumerable: true, get: function () { return fixedLoadBearing_2.FIXED_LOAD_BEARING_CONTAINERS; } });
var modularLoadBearing_2 = require("./container-catalog/modularLoadBearing");
Object.defineProperty(exports, "MODULAR_LOAD_BEARING_CONTAINERS", { enumerable: true, get: function () { return modularLoadBearing_2.MODULAR_LOAD_BEARING_CONTAINERS; } });
Object.defineProperty(exports, "MODULAR_LOAD_BEARING_POUCHES", { enumerable: true, get: function () { return modularLoadBearing_2.MODULAR_LOAD_BEARING_POUCHES; } });
var packs_2 = require("./container-catalog/packs");
Object.defineProperty(exports, "PACK_CONTAINERS", { enumerable: true, get: function () { return packs_2.PACK_CONTAINERS; } });
var survival_2 = require("./container-catalog/survival");
Object.defineProperty(exports, "SURVIVAL_CONTAINERS", { enumerable: true, get: function () { return survival_2.SURVIVAL_CONTAINERS; } });
var storage_2 = require("./container-catalog/storage");
Object.defineProperty(exports, "DRY_GOODS_STORAGE_CONTAINERS", { enumerable: true, get: function () { return storage_2.DRY_GOODS_STORAGE_CONTAINERS; } });
Object.defineProperty(exports, "LIQUID_STORAGE_CONTAINERS", { enumerable: true, get: function () { return storage_2.LIQUID_STORAGE_CONTAINERS; } });
exports.CONTAINER_CATALOG = [
    ...packs_1.PACK_CONTAINERS,
    ...fixedLoadBearing_1.FIXED_LOAD_BEARING_CONTAINERS,
    ...fixedLoadBearing_1.FIXED_LBE_COMPONENT_CONTAINERS,
    ...modularLoadBearing_1.MODULAR_LOAD_BEARING_CONTAINERS,
    ...modularLoadBearing_1.MODULAR_LOAD_BEARING_POUCHES,
    ...survival_1.SURVIVAL_CONTAINERS,
    ...storage_1.LIQUID_STORAGE_CONTAINERS,
    ...storage_1.DRY_GOODS_STORAGE_CONTAINERS,
];
