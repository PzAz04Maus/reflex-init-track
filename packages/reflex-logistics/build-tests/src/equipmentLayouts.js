"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS = exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS = exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS = exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS = exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS = exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS = void 0;
exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS = [
    { key: "worn:head", type: "worn", label: "Head", capacity: 1 },
    { key: "worn:face", type: "worn", label: "Face", capacity: 1 },
    { key: "worn:neck", type: "worn", label: "Neck", capacity: 1 },
    { key: "worn:torso", type: "worn", label: "Torso", capacity: 1 },
    { key: "worn:back", type: "worn", label: "Back", capacity: 1 },
    { key: "worn:waist", type: "worn", label: "Waist", capacity: 1 },
    { key: "worn:legs", type: "worn", label: "Legs", capacity: 1 },
    { key: "worn:feet", type: "worn", label: "Feet", capacity: 2 },
    { key: "worn:hands", type: "worn", label: "Hands Worn", capacity: 2 },
    { key: "held:hands", type: "held", label: "Hands Held", capacity: 2 },
    { key: "held:mouth", type: "held", label: "Mouth Held", capacity: 1 },
];
exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS = Object.fromEntries(exports.DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS.map((voucher) => [voucher.key, voucher.capacity]));
exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS = [
    { key: "worn:head", type: "worn", label: "Head", capacity: 1 },
    { key: "worn:neck", type: "worn", label: "Neck", capacity: 1 },
    { key: "worn:torso", type: "worn", label: "Torso", capacity: 1 },
    { key: "worn:back", type: "worn", label: "Back", capacity: 1 },
    { key: "worn:flank", type: "worn", label: "Flank", capacity: 2 },
    { key: "worn:legs", type: "worn", label: "Legs", capacity: 4 },
    { key: "worn:feet", type: "worn", label: "Feet", capacity: 4 },
    { key: "held:mouth", type: "held", label: "Mouth Held", capacity: 1 },
];
exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS = Object.fromEntries(exports.DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS.map((voucher) => [voucher.key, voucher.capacity]));
exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS = [
    { key: "worn:slots", type: "worn", label: "Worn Slots", capacity: 11 },
    { key: "held:slots", type: "held", label: "Held Slots", capacity: 3 },
];
exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS = Object.fromEntries(exports.DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS.map((voucher) => [voucher.key, voucher.capacity]));
