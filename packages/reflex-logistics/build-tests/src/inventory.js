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
exports.SUBMACHINE_GUNS = exports.AUTOLOADERS = exports.ASSAULT_RIFLES = exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS = exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS = exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS = exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS = exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS = exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS = void 0;
var equipmentLayouts_1 = require("./equipmentLayouts");
Object.defineProperty(exports, "DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS", { enumerable: true, get: function () { return equipmentLayouts_1.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS; } });
Object.defineProperty(exports, "DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS", { enumerable: true, get: function () { return equipmentLayouts_1.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS; } });
Object.defineProperty(exports, "DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS", { enumerable: true, get: function () { return equipmentLayouts_1.DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS; } });
Object.defineProperty(exports, "DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS", { enumerable: true, get: function () { return equipmentLayouts_1.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS; } });
Object.defineProperty(exports, "DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS", { enumerable: true, get: function () { return equipmentLayouts_1.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS; } });
Object.defineProperty(exports, "DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS", { enumerable: true, get: function () { return equipmentLayouts_1.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS; } });
__exportStar(require("./inventory/factories"), exports);
__exportStar(require("./inventory/mutations"), exports);
__exportStar(require("./inventory/queries"), exports);
__exportStar(require("./inventory/validation"), exports);
// Backward-compatible exports used by existing tests and callers.
var rangedCatalog_1 = require("./rangedCatalog");
Object.defineProperty(exports, "ASSAULT_RIFLES", { enumerable: true, get: function () { return rangedCatalog_1.ASSAULT_RIFLES; } });
Object.defineProperty(exports, "AUTOLOADERS", { enumerable: true, get: function () { return rangedCatalog_1.AUTOLOADERS; } });
Object.defineProperty(exports, "SUBMACHINE_GUNS", { enumerable: true, get: function () { return rangedCatalog_1.SUBMACHINE_GUNS; } });
