"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELECTRONICS_CATALOG = exports.COMMUNICATION_ITEMS = exports.POWERED_TOOLS = exports.THERMAL_IMAGING_ITEMS = exports.NIGHT_VISION_ITEMS = exports.MAGNIFICATION_ITEMS = exports.ILLUMINATION_ITEMS = void 0;
const illumination_1 = require("./electronics-catalog/illumination");
const vision_1 = require("./electronics-catalog/vision");
const poweredTools_1 = require("./electronics-catalog/poweredTools");
const communication_1 = require("./electronics-catalog/communication");
var illumination_2 = require("./electronics-catalog/illumination");
Object.defineProperty(exports, "ILLUMINATION_ITEMS", { enumerable: true, get: function () { return illumination_2.ILLUMINATION_ITEMS; } });
var vision_2 = require("./electronics-catalog/vision");
Object.defineProperty(exports, "MAGNIFICATION_ITEMS", { enumerable: true, get: function () { return vision_2.MAGNIFICATION_ITEMS; } });
Object.defineProperty(exports, "NIGHT_VISION_ITEMS", { enumerable: true, get: function () { return vision_2.NIGHT_VISION_ITEMS; } });
Object.defineProperty(exports, "THERMAL_IMAGING_ITEMS", { enumerable: true, get: function () { return vision_2.THERMAL_IMAGING_ITEMS; } });
var poweredTools_2 = require("./electronics-catalog/poweredTools");
Object.defineProperty(exports, "POWERED_TOOLS", { enumerable: true, get: function () { return poweredTools_2.POWERED_TOOLS; } });
var communication_2 = require("./electronics-catalog/communication");
Object.defineProperty(exports, "COMMUNICATION_ITEMS", { enumerable: true, get: function () { return communication_2.COMMUNICATION_ITEMS; } });
exports.ELECTRONICS_CATALOG = [
    ...illumination_1.ILLUMINATION_ITEMS,
    ...vision_1.MAGNIFICATION_ITEMS,
    ...vision_1.NIGHT_VISION_ITEMS,
    ...vision_1.THERMAL_IMAGING_ITEMS,
    ...poweredTools_1.POWERED_TOOLS,
    ...communication_1.COMMUNICATION_ITEMS,
];
