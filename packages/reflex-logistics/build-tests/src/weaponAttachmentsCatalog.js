"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.WEAPON_ATTACHMENTS = exports.OPTICS = exports.SHOTGUN_MODIFICATIONS = exports.RAIL_ACCESSORIES = exports.MISCELLANEOUS_ACCESSORIES = exports.FIRE_CONTROL_MODIFICATIONS = exports.AMMUNITION_HANDLING_ITEMS = void 0;
const ammunitionHandling_1 = require("./weapon-attachments-catalog/ammunitionHandling");
const accessories_1 = require("./weapon-attachments-catalog/accessories");
const optics_1 = require("./weapon-attachments-catalog/optics");
var ammunitionHandling_2 = require("./weapon-attachments-catalog/ammunitionHandling");
Object.defineProperty(exports, "AMMUNITION_HANDLING_ITEMS", { enumerable: true, get: function () { return ammunitionHandling_2.AMMUNITION_HANDLING_ITEMS; } });
var accessories_2 = require("./weapon-attachments-catalog/accessories");
Object.defineProperty(exports, "FIRE_CONTROL_MODIFICATIONS", { enumerable: true, get: function () { return accessories_2.FIRE_CONTROL_MODIFICATIONS; } });
Object.defineProperty(exports, "MISCELLANEOUS_ACCESSORIES", { enumerable: true, get: function () { return accessories_2.MISCELLANEOUS_ACCESSORIES; } });
Object.defineProperty(exports, "RAIL_ACCESSORIES", { enumerable: true, get: function () { return accessories_2.RAIL_ACCESSORIES; } });
Object.defineProperty(exports, "SHOTGUN_MODIFICATIONS", { enumerable: true, get: function () { return accessories_2.SHOTGUN_MODIFICATIONS; } });
var optics_2 = require("./weapon-attachments-catalog/optics");
Object.defineProperty(exports, "OPTICS", { enumerable: true, get: function () { return optics_2.OPTICS; } });
exports.WEAPON_ATTACHMENTS = [
    ...ammunitionHandling_1.AMMUNITION_HANDLING_ITEMS,
    ...optics_1.OPTICS,
    ...accessories_1.RAIL_ACCESSORIES,
    ...accessories_1.MISCELLANEOUS_ACCESSORIES,
    ...accessories_1.FIRE_CONTROL_MODIFICATIONS,
    ...accessories_1.SHOTGUN_MODIFICATIONS,
];
