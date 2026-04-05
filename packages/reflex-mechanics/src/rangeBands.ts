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

export const RangeBandOrder = [
  'Personal',
  'Gunfighting',
  'CQB',
  'Tight',
  'Medium',
  'Open',
  'Sniping',
  'Extreme',
] as const;

export const RangeBandBounds = {
  Personal: [0, 0],
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

export const VisionRangeModifier = {
  Personal: 0,
  Gunfighting: 0,
  CQB: -1,
  Tight: -2,
  Medium: -4,
  Open: -8,
  Sniping: -16,
  Extreme: -32,
} as const;

export const HumanSizeRangeShift = {
  "1/4": { Mod: 2, description: "cat, rifle" },
  "1/2": { Mod: 1, description: "dog, child" },
  "2x": { Mod: -1, description: "horse, sedan" },
  "4x": { Mod: -2, description: "elephant, truck" },
  "8x": { Mod: -3, description: "house, tank" },
} as const;

export type HumanSizeRangeShiftName = Extract<keyof typeof HumanSizeRangeShift, string>;

export function getRangeBandIndex(rangeBand: RangeBandName): number {
  return RangeBandOrder.indexOf(rangeBand);
}

export function getRangeBandAtIndex(index: number): RangeBandName | undefined {
  return RangeBandOrder[index];
}

export function compareRangeBands(left: RangeBandName, right: RangeBandName): number {
  return getRangeBandIndex(left) - getRangeBandIndex(right);
}

export function countRangeBandSteps(from: RangeBandName, to: RangeBandName): number {
  return Math.abs(compareRangeBands(from, to));
}

export function shiftRangeBand(rangeBand: RangeBandName, steps: number): RangeBandName {
  const shiftedIndex = Math.min(
    RangeBandOrder.length - 1,
    Math.max(0, getRangeBandIndex(rangeBand) + steps),
  );

  return RangeBandOrder[shiftedIndex];
}