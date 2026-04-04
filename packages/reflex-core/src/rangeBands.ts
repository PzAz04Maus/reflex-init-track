export const RangeBand = {
  Personal: 0,
  Gunfighting: [1, 7],
  CQB: [8, 25],
  Tight: [26, 100],
  Medium: [101, 200],
  Open: [201, 400],
  Sniping: [401, 800],
  Extreme: [801, 1600],
} as const;

export const RangeBandNames = Object.keys(RangeBand) as (keyof typeof RangeBand)[];
export type RangeBandName = Extract<keyof typeof RangeBand, string>;

const VisionBand = {
  Personal: 0,
  Gunfighting: 0,
  CQB: -1,
  Tight: -2,
  Medium: -4,
  Open: -8,
  Sniping: -16,
  Extreme: -32,
} as const;

const EffectiveRangeSize = {
  "1/4": { Mod: 2, description: "cat, rifle" },
  "1/2": { Mod: 1, description: "dog, child" },
  "2x": { Mod: -1, description: "horse, sedan" },
  "4x": { Mod: -2, description: "elephant, truck" },
  "8x": { Mod: -3, description: "house, tank" },
  "16x": { Mod: -4, description: "" },
  "32x": { Mod: -5, description: "" },
} as const;

void VisionBand;
void EffectiveRangeSize;