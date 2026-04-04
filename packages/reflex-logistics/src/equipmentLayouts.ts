import type { VoucherDefinition, VoucherPool } from "./types";

export const DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS: VoucherDefinition[] = [
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

export const DEFAULT_HUMANOID_EQUIPMENT_VOUCHER_LIMITS: VoucherPool = Object.fromEntries(
  DEFAULT_HUMANOID_EQUIPMENT_VOUCHERS.map((voucher) => [voucher.key, voucher.capacity]),
);

export const DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS: VoucherDefinition[] = [
  { key: "worn:head", type: "worn", label: "Head", capacity: 1 },
  { key: "worn:neck", type: "worn", label: "Neck", capacity: 1 },
  { key: "worn:torso", type: "worn", label: "Torso", capacity: 1 },
  { key: "worn:back", type: "worn", label: "Back", capacity: 1 },
  { key: "worn:flank", type: "worn", label: "Flank", capacity: 2 },
  { key: "worn:legs", type: "worn", label: "Legs", capacity: 4 },
  { key: "worn:feet", type: "worn", label: "Feet", capacity: 4 },
  { key: "held:mouth", type: "held", label: "Mouth Held", capacity: 1 },
];

export const DEFAULT_QUADRUPED_EQUIPMENT_VOUCHER_LIMITS: VoucherPool = Object.fromEntries(
  DEFAULT_QUADRUPED_EQUIPMENT_VOUCHERS.map((voucher) => [voucher.key, voucher.capacity]),
);

export const DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS: VoucherDefinition[] = [
  { key: "worn:slots", type: "worn", label: "Worn Slots", capacity: 11 },
  { key: "held:slots", type: "held", label: "Held Slots", capacity: 3 },
];

export const DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHER_LIMITS: VoucherPool = Object.fromEntries(
  DEFAULT_AMORPHOUS_EQUIPMENT_VOUCHERS.map((voucher) => [voucher.key, voucher.capacity]),
);