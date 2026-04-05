import type { RangeBandName } from "reflex-mechanics/rangeBands";
import { createItemDefinition } from "../inventory";
import type {
  ItemDefinition,
  WeaponAccuracyModifier,
  WeaponRangeProfile,
  WeaponSpeedProfile,
} from "../types";

const RANGE_BAND_MAP: Record<string, RangeBandName> = {
  P: "Personal",
  GF: "Gunfighting",
  CQB: "CQB",
  T: "Tight",
  M: "Medium",
  O: "Open",
  S: "Sniping",
  EX: "Extreme",
};

function parseRange(range: string): WeaponRangeProfile {
  const [optimum, maximum] = range.split("/");

  return {
    optimum: RANGE_BAND_MAP[optimum],
    maximum: maximum ? RANGE_BAND_MAP[maximum] : undefined,
  };
}

function parseSpeed(speed: string): WeaponSpeedProfile {
  const [hip, snap, aimed] = speed.split("/").map((value) => Number(value.replace(/[^0-9.-]/g, "")));

  return { hip, snap, aimed };
}

export function defineWeaponAttachment(input: {
  id: string;
  name: string;
  weight: number;
  kind: string;
  compatibleWeaponTags: string[];
  tags?: string[];
  traits?: string[];
  barterValue?: string;
  streetPrice?: number | string;
  powerRequirement?: string;
  description?: string;
  range?: string;
  speedModifier?: string;
  accuracyModifier?: WeaponAccuracyModifier;
  visualRangeModifier?: number;
  recoilModifierPercent?: number;
  bulkOverride?: number;
  weightModifierPercent?: number;
  grantsCarryProfiles?: Record<string, { voucherCost: Record<string, number>; description?: string }>;
  voucherBonus?: Record<string, number>;
  notes?: string[];
}): ItemDefinition {
  const speedModifier = input.speedModifier
    ? parseSpeed(input.speedModifier)
    : undefined;

  return createItemDefinition({
    id: input.id,
    name: input.name,
    weight: input.weight,
    tags: ["weapon-attachment", ...input.compatibleWeaponTags, ...(input.tags ?? [])],
    traits: input.traits,
    barterValue: input.barterValue,
    streetPrice: input.streetPrice,
    powerRequirement: input.powerRequirement,
    description: input.description,
    grantsCarryProfiles: input.grantsCarryProfiles,
    voucherBonus: input.voucherBonus,
    weaponAttachment: {
      kind: input.kind,
      compatibleWeaponTags: input.compatibleWeaponTags,
      modifier: {
        rangeOverride: input.range ? parseRange(input.range) : undefined,
        speedModifier,
        accuracyModifier: input.accuracyModifier,
        visualRangeModifier: input.visualRangeModifier,
        recoilModifierPercent: input.recoilModifierPercent,
        bulkOverride: input.bulkOverride,
        weightModifierPercent: input.weightModifierPercent,
      },
      notes: input.notes,
    },
  });
}

export function defineAccessoryItem(input: {
  id: string;
  name: string;
  weight: number;
  tags?: string[];
  traits?: string[];
  barterValue?: string;
  streetPrice?: number | string;
  powerRequirement?: string;
  description?: string;
  grantsCarryProfiles?: Record<string, { voucherCost: Record<string, number>; description?: string }>;
  voucherBonus?: Record<string, number>;
}): ItemDefinition {
  return createItemDefinition({
    id: input.id,
    name: input.name,
    weight: input.weight,
    tags: input.tags,
    traits: input.traits,
    barterValue: input.barterValue,
    streetPrice: input.streetPrice,
    powerRequirement: input.powerRequirement,
    description: input.description,
    grantsCarryProfiles: input.grantsCarryProfiles,
    voucherBonus: input.voucherBonus,
  });
}