"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ELECTRONICS_CATALOG = exports.CONSUMER_ELECTRONICS = exports.SOFTWARE_ITEMS = exports.COMPUTER_PERIPHERALS = exports.COMPUTER_SYSTEMS = exports.SENSOR_ITEMS = exports.PHOTOGRAPHY_ITEMS = exports.COMMUNICATION_ITEMS = exports.POWERED_TOOLS = exports.THERMAL_IMAGING_ITEMS = exports.NIGHT_VISION_ITEMS = exports.MAGNIFICATION_ITEMS = exports.ILLUMINATION_ITEMS = void 0;
const illumination_1 = require("./electronics-catalog/illumination");
const vision_1 = require("./electronics-catalog/vision");
const poweredTools_1 = require("./electronics-catalog/poweredTools");
const communication_1 = require("./electronics-catalog/communication");
const photography_1 = require("./electronics-catalog/photography");
const sensors_1 = require("./electronics-catalog/sensors");
const computing_1 = require("./electronics-catalog/computing");
const consumerElectronics_1 = require("./electronics-catalog/consumerElectronics");
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
var photography_2 = require("./electronics-catalog/photography");
Object.defineProperty(exports, "PHOTOGRAPHY_ITEMS", { enumerable: true, get: function () { return photography_2.PHOTOGRAPHY_ITEMS; } });
var sensors_2 = require("./electronics-catalog/sensors");
Object.defineProperty(exports, "SENSOR_ITEMS", { enumerable: true, get: function () { return sensors_2.SENSOR_ITEMS; } });
var computing_2 = require("./electronics-catalog/computing");
Object.defineProperty(exports, "COMPUTER_SYSTEMS", { enumerable: true, get: function () { return computing_2.COMPUTER_SYSTEMS; } });
Object.defineProperty(exports, "COMPUTER_PERIPHERALS", { enumerable: true, get: function () { return computing_2.COMPUTER_PERIPHERALS; } });
Object.defineProperty(exports, "SOFTWARE_ITEMS", { enumerable: true, get: function () { return computing_2.SOFTWARE_ITEMS; } });
var consumerElectronics_2 = require("./electronics-catalog/consumerElectronics");
Object.defineProperty(exports, "CONSUMER_ELECTRONICS", { enumerable: true, get: function () { return consumerElectronics_2.CONSUMER_ELECTRONICS; } });
exports.ELECTRONICS_CATALOG = [
    ...illumination_1.ILLUMINATION_ITEMS,
    ...vision_1.MAGNIFICATION_ITEMS,
    ...vision_1.NIGHT_VISION_ITEMS,
    ...vision_1.THERMAL_IMAGING_ITEMS,
    ...poweredTools_1.POWERED_TOOLS,
    ...communication_1.COMMUNICATION_ITEMS,
    ...photography_1.PHOTOGRAPHY_ITEMS,
    ...sensors_1.SENSOR_ITEMS,
    ...computing_1.COMPUTER_SYSTEMS,
    ...computing_1.COMPUTER_PERIPHERALS,
    ...computing_1.SOFTWARE_ITEMS,
    ...consumerElectronics_1.CONSUMER_ELECTRONICS,
];
