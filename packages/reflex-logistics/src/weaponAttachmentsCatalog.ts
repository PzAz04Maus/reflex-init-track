import type { ItemDefinition } from "./types";
import { AMMUNITION_HANDLING_ITEMS } from "./weapon-attachments-catalog/ammunitionHandling";
import {
  FIRE_CONTROL_MODIFICATIONS,
  MISCELLANEOUS_ACCESSORIES,
  RAIL_ACCESSORIES,
  SHOTGUN_MODIFICATIONS,
} from "./weapon-attachments-catalog/accessories";
import { OPTICS } from "./weapon-attachments-catalog/optics";

export { AMMUNITION_HANDLING_ITEMS } from "./weapon-attachments-catalog/ammunitionHandling";
export {
  FIRE_CONTROL_MODIFICATIONS,
  MISCELLANEOUS_ACCESSORIES,
  RAIL_ACCESSORIES,
  SHOTGUN_MODIFICATIONS,
} from "./weapon-attachments-catalog/accessories";
export { OPTICS } from "./weapon-attachments-catalog/optics";

export const WEAPON_ATTACHMENTS: ItemDefinition[] = [
  ...AMMUNITION_HANDLING_ITEMS,
  ...OPTICS,
  ...RAIL_ACCESSORIES,
  ...MISCELLANEOUS_ACCESSORIES,
  ...FIRE_CONTROL_MODIFICATIONS,
  ...SHOTGUN_MODIFICATIONS,
];import { createItemDefinition } from "./inventory";
import type { RangeBandName } from "reflex-core";
import type {
  ItemDefinition,
  WeaponAccuracyModifier,
  WeaponRangeProfile,
  WeaponSpeedProfile,
} from "./types";

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

function defineWeaponAttachment(input: {
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

function defineAccessoryItem(input: {
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

export const AMMUNITION_HANDLING_ITEMS: ItemDefinition[] = [
  defineAccessoryItem({
    id: "accessory:bandolier",
    name: "Bandolier",
    weight: 0.5,
    tags: ["weapon-accessory", "ammo-handling", "bandolier"],
    barterValue: "GG1.75",
    streetPrice: 35,
    description: "Adjustable webbing bandolier for ready ammunition carry. Available by ammunition type.",
  }),
  defineAccessoryItem({
    id: "accessory:spare-magazine",
    name: "Magazine, Spare",
    weight: 0.05,
    tags: ["weapon-accessory", "ammo-handling", "spare-magazine"],
    barterValue: "GG0.2/10 rds.",
    streetPrice: "$20/10 rds.",
    description: "Empty spare magazine or drum. Weight and cost scale by about 10 rounds of capacity.",
  }),
  defineWeaponAttachment({
    id: "attachment:shotgun:side-saddle",
    name: "Side Saddle",
    kind: "side-saddle",
    compatibleWeaponTags: ["shotgun"],
    tags: ["weapon-accessory", "ammo-handling", "side-saddle"],
    weight: 0.2,
    barterValue: "GG1.25",
    streetPrice: 25,
    description: "Stock-mounted ammunition carrier. The common shotgun version holds 8 loose rounds.",
    notes: ["Cannot be mounted on a folding stock."],
  }),
  defineAccessoryItem({
    id: "accessory:speedloader",
    name: "Speedloader",
    weight: 0.1,
    tags: ["weapon-accessory", "ammo-handling", "speedloader"],
    barterValue: "GG1.5",
    streetPrice: 15,
    description: "Revolver loading aid that lets a shooter reload a full cylinder with a single Reload action.",
  }),
  defineAccessoryItem({
    id: "accessory:stripper-clip",
    name: "Stripper Clip",
    weight: 0,
    tags: ["weapon-accessory", "ammo-handling", "stripper-clip"],
    barterValue: "GG0.02",
    streetPrice: 2,
    description: "Clip for rapidly loading an internal magazine rifle with a single Reload action.",
  }),
];

export const OPTICS: ItemDefinition[] = [
  defineWeaponAttachment({
    id: "attachment:optic:night-sight",
    name: "Night Sight",
    kind: "iron-sight-replacement",
    compatibleWeaponTags: ["handgun", "smg", "shotgun", "assault-rifle"],
    tags: ["weapon-accessory", "optic", "gunsight"],
    weight: 0,
    barterValue: "GG30",
    streetPrice: 150,
    description: "Luminous iron-sight replacement for low-light shooting.",
    notes: [
      "Reduces dim or minimal-light range penalties by up to 2.",
      "Does not require batteries.",
      "Can be combined with another gunsight, but benefits do not stack.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:night-vision",
    name: "Night-Vision Sight",
    kind: "magnified-optic",
    compatibleWeaponTags: ["rifle", "shotgun", "smg", "machine-gun"],
    tags: ["weapon-accessory", "optic", "night-vision", "gunsight"],
    weight: 0.9,
    barterValue: "GG375",
    streetPrice: 1500,
    powerRequirement: "4 sm/60 hrs",
    speedModifier: "0/1/1",
    description: "Weapon-mounted night-vision sight for longarms.",
    notes: [
      "Provides the same low-light aiming benefits as night sights for snap and aimed attacks.",
      "Benefits never apply to hip shots.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:night-vision-mag-1",
    name: "Night-Vision Sight",
    kind: "magnified-optic",
    compatibleWeaponTags: ["rifle", "shotgun", "smg", "machine-gun"],
    tags: ["weapon-accessory", "optic", "night-vision", "gunsight"],
    traits: ["Mag-1"],
    weight: 1.4,
    barterValue: "GG500",
    streetPrice: 2000,
    powerRequirement: "4 sm/60 hrs",
    speedModifier: "0/2/2",
    visualRangeModifier: 1,
    description: "Night-vision sight with built-in low magnification.",
    notes: [
      "Provides the same low-light aiming benefits as night sights for snap and aimed attacks.",
      "Benefits never apply to hip shots.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:reflex-powered",
    name: "Reflex Sight, Powered",
    kind: "reflex-optic",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "optic", "reflex", "gunsight"],
    weight: 0.3,
    barterValue: "GG100",
    streetPrice: 400,
    powerRequirement: "2 sm/1 yr",
    speedModifier: "0/-1/-1",
    accuracyModifier: { snap: 2 },
    description: "Powered red-dot style reflex sight.",
    notes: [
      "Benefits apply to snap and aimed attacks only.",
      "Any firearm can accept a reflex sight; autoloaders may require a special bracket.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:reflex-unpowered",
    name: "Reflex Sight, Unpowered",
    kind: "reflex-optic",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "optic", "reflex", "gunsight"],
    weight: 0.2,
    barterValue: "GG500",
    streetPrice: 1000,
    speedModifier: "0/-1/-1",
    accuracyModifier: { snap: 2 },
    description: "Prism-based reflex sight that works in minimal through excessive lighting conditions.",
    notes: [
      "Benefits apply to snap and aimed attacks only.",
      "Any firearm can accept a reflex sight; autoloaders may require a special bracket.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:reflex-powered-mag-1",
    name: "Reflex Sight, Powered",
    kind: "reflex-optic",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "optic", "reflex", "gunsight"],
    traits: ["Mag-1"],
    weight: 0.3,
    barterValue: "GG150",
    streetPrice: 600,
    powerRequirement: "2 sm/1 yr",
    accuracyModifier: { snap: 2 },
    visualRangeModifier: 1,
    description: "Low-magnification powered reflex sight.",
    notes: [
      "Benefits apply to snap and aimed attacks only.",
      "Provides a +2 bonus to snap attacks and increases effective visual range by one band for snap and aimed attacks.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:reflex-unpowered-mag-1",
    name: "Reflex Sight, Unpowered",
    kind: "reflex-optic",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "optic", "reflex", "gunsight"],
    traits: ["Mag-1"],
    weight: 0.2,
    barterValue: "GG750",
    streetPrice: 1500,
    accuracyModifier: { snap: 2 },
    visualRangeModifier: 1,
    description: "Low-magnification prism reflex sight.",
    notes: [
      "Benefits apply to snap and aimed attacks only.",
      "Provides a +2 bonus to snap attacks and increases effective visual range by one band for snap and aimed attacks.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:reflex-magnifier",
    name: "Reflex Sight Magnifier",
    kind: "magnified-optic",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "optic", "reflex", "magnifier"],
    weight: 0.1,
    barterValue: "GG600",
    streetPrice: 800,
    speedModifier: "0/1/1",
    visualRangeModifier: 1,
    description: "Clip-on low magnifier for a reflex sight.",
    notes: ["Pairs with a reflex sight to extend effective visual range by one band for snap and aimed attacks."],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:telescopic-mag-1",
    name: "Telescopic Sight",
    kind: "magnified-optic",
    compatibleWeaponTags: ["rifle", "shotgun", "machine-gun"],
    tags: ["weapon-accessory", "optic", "telescopic", "gunsight"],
    traits: ["Mag-1"],
    weight: 0.3,
    barterValue: "GG75",
    streetPrice: 150,
    speedModifier: "0/1/1",
    visualRangeModifier: 1,
    description: "Low-power telescopic sight.",
    notes: [
      "Benefits apply to snap and aimed attacks only.",
      "At very close range the optic is too slow for meaningful observation and attacks using it may fail automatically.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:telescopic-mag-2",
    name: "Telescopic Sight",
    kind: "magnified-optic",
    compatibleWeaponTags: ["rifle", "shotgun", "machine-gun"],
    tags: ["weapon-accessory", "optic", "telescopic", "gunsight"],
    traits: ["Mag-2"],
    weight: 0.4,
    barterValue: "GG175",
    streetPrice: 350,
    speedModifier: "0/2/2",
    visualRangeModifier: 2,
    description: "Medium-power telescopic sight.",
    notes: [
      "Benefits apply to snap and aimed attacks only.",
      "At very close range the optic is too slow for meaningful observation and attacks using it may fail automatically.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:telescopic-mag-3",
    name: "Telescopic Sight",
    kind: "magnified-optic",
    compatibleWeaponTags: ["rifle", "shotgun", "machine-gun"],
    tags: ["weapon-accessory", "optic", "telescopic", "gunsight"],
    traits: ["Mag-3"],
    weight: 0.5,
    barterValue: "GG225",
    streetPrice: 450,
    speedModifier: "0/3/3",
    visualRangeModifier: 3,
    description: "High-power telescopic sight.",
    notes: [
      "Benefits apply to snap and aimed attacks only.",
      "At very close range the optic is too slow for meaningful observation and attacks using it may fail automatically.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:optic:thermal",
    name: "Thermal Sight",
    kind: "magnified-optic",
    compatibleWeaponTags: ["rifle", "shotgun", "machine-gun"],
    tags: ["weapon-accessory", "optic", "thermal", "gunsight"],
    weight: 1.4,
    barterValue: "GG3,000",
    streetPrice: 12000,
    powerRequirement: "2 med/8 hrs",
    description: "Thermal imaging gunsight.",
  }),
  defineWeaponAttachment({
    id: "attachment:optic:thermal-mag-1",
    name: "Thermal Sight",
    kind: "magnified-optic",
    compatibleWeaponTags: ["rifle", "shotgun", "machine-gun"],
    tags: ["weapon-accessory", "optic", "thermal", "gunsight"],
    traits: ["Mag-1"],
    weight: 1.5,
    barterValue: "GG3,250",
    streetPrice: 13000,
    powerRequirement: "2 med/8 hrs",
    visualRangeModifier: 1,
    description: "Thermal imaging gunsight with low magnification.",
  }),
];

export const RAIL_ACCESSORIES: ItemDefinition[] = [
  defineWeaponAttachment({
    id: "attachment:rail:laser-sight",
    name: "Laser Sight",
    kind: "rail-accessory",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "rail-accessory", "laser"],
    weight: 0.1,
    barterValue: "GG75",
    streetPrice: 300,
    powerRequirement: "1 micro/24 hrs",
  }),
  defineWeaponAttachment({
    id: "attachment:rail:laser-sight-ir",
    name: "Laser Sight, IR",
    kind: "rail-accessory",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "rail-accessory", "laser", "infrared"],
    weight: 0.1,
    barterValue: "GG150",
    streetPrice: 600,
    powerRequirement: "1 micro/24 hrs",
  }),
  defineWeaponAttachment({
    id: "attachment:rail:multi-light",
    name: "Multi-Light",
    kind: "rail-accessory",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "rail-accessory", "light"],
    weight: 0.2,
    barterValue: "GG125",
    streetPrice: 500,
    powerRequirement: "2 sm/2 hrs",
  }),
  defineWeaponAttachment({
    id: "attachment:rail:vertical-foregrip",
    name: "Vertical Foregrip",
    kind: "rail-accessory",
    compatibleWeaponTags: ["smg", "shotgun", "rifle", "machine-gun"],
    tags: ["weapon-accessory", "rail-accessory", "foregrip"],
    weight: 0.1,
    barterValue: "GG2",
    streetPrice: 40,
  }),
  defineWeaponAttachment({
    id: "attachment:rail:weapon-light-small",
    name: "Weapon Light, Small",
    kind: "rail-accessory",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "rail-accessory", "light"],
    weight: 0.1,
    barterValue: "GG25",
    streetPrice: 100,
    powerRequirement: "1 sm/1 hr",
  }),
  defineWeaponAttachment({
    id: "attachment:rail:weapon-light-large",
    name: "Weapon Light, Large",
    kind: "rail-accessory",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "rail-accessory", "light"],
    weight: 0.2,
    barterValue: "GG50",
    streetPrice: 200,
    powerRequirement: "2 sm/1 hr",
  }),
  defineWeaponAttachment({
    id: "attachment:rail:weapon-light-ir-small",
    name: "Weapon Light, IR, Small",
    kind: "rail-accessory",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "rail-accessory", "light", "infrared"],
    weight: 0.1,
    barterValue: "GG40",
    streetPrice: 150,
    powerRequirement: "1 sm/1 hr",
  }),
  defineWeaponAttachment({
    id: "attachment:rail:weapon-light-ir-large",
    name: "Weapon Light, IR, Large",
    kind: "rail-accessory",
    compatibleWeaponTags: ["firearm"],
    tags: ["weapon-accessory", "rail-accessory", "light", "infrared"],
    weight: 0.2,
    barterValue: "GG75",
    streetPrice: 300,
    powerRequirement: "2 sm/1 hr",
  }),
];

export const MISCELLANEOUS_ACCESSORIES: ItemDefinition[] = [
  defineWeaponAttachment({
    id: "attachment:support:bipod",
    name: "Bipod",
    kind: "bipod-accessory",
    compatibleWeaponTags: ["rifle", "machine-gun"],
    tags: ["weapon-accessory", "support-accessory", "bipod"],
    weight: 0.4,
    barterValue: "GG1.25",
    streetPrice: 50,
  }),
  defineWeaponAttachment({
    id: "attachment:stock:folding-stock",
    name: "Folding Stock",
    kind: "support-accessory",
    compatibleWeaponTags: ["smg", "rifle", "shotgun"],
    tags: ["weapon-accessory", "stock-accessory"],
    weight: 0,
    barterValue: "GG5",
    streetPrice: 100,
  }),
  defineWeaponAttachment({
    id: "attachment:sling:weapon-sling",
    name: "Weapon Sling",
    kind: "sling-accessory",
    compatibleWeaponTags: ["rifle", "shotgun", "smg", "machine-gun"],
    tags: ["weapon-accessory", "sling"],
    weight: 0.2,
    barterValue: "GG1",
    streetPrice: 40,
    grantsCarryProfiles: {
      slung: {
        voucherCost: { "worn:shoulder": 1 },
        description: "Attached host item may be carried slung without using the hands.",
      },
    },
    voucherBonus: { "worn:shoulder": 1 },
  }),
  defineWeaponAttachment({
    id: "attachment:support:tripod-light",
    name: "Tripod, Light",
    kind: "tripod-accessory",
    compatibleWeaponTags: ["machine-gun"],
    tags: ["weapon-accessory", "support-accessory", "tripod"],
    weight: 7,
    barterValue: "GG10",
    streetPrice: 200,
  }),
  defineWeaponAttachment({
    id: "attachment:support:tripod-medium",
    name: "Tripod, Medium",
    kind: "tripod-accessory",
    compatibleWeaponTags: ["machine-gun"],
    tags: ["weapon-accessory", "support-accessory", "tripod"],
    weight: 11,
    barterValue: "GG15",
    streetPrice: 300,
  }),
  defineWeaponAttachment({
    id: "attachment:support:tripod-heavy",
    name: "Tripod, Heavy",
    kind: "tripod-accessory",
    compatibleWeaponTags: ["machine-gun"],
    tags: ["weapon-accessory", "support-accessory", "tripod"],
    weight: 20,
    barterValue: "GG20",
    streetPrice: 400,
  }),
];

export const FIRE_CONTROL_MODIFICATIONS: ItemDefinition[] = [
  defineWeaponAttachment({
    id: "attachment:fire-control:civilian-legal-conversion",
    name: "Weapon Modification: Civilian-Legal variant",
    kind: "fire-control-modification",
    compatibleWeaponTags: ["smg", "assault-rifle"],
    tags: ["weapon-accessory", "fire-control-modification", "civilian-legal"],
    weight: 0,
    description: "Converts a military-pattern SMG or assault rifle into a civilian-legal semiautomatic variant.",
    notes: [
      "Use the printed street price and halve the barter value for the civilian-legal version.",
      "Remove all burst or automatic rates of fire.",
      "If the host weapon is an SMG with Bulk 2, increase Bulk to 3 to represent the legally mandated longer barrel.",
      "Civilian-legal variants can still share magazines and most parts with their military counterpart.",
    ],
  }),
  defineWeaponAttachment({
    id: "attachment:fire-control:full-auto-conversion",
    name: "Weapon Modification: Full-Auto Conversion",
    kind: "fire-control-modification",
    compatibleWeaponTags: ["smg", "assault-rifle"],
    tags: ["weapon-accessory", "fire-control-modification", "illegal-modification"],
    weight: 0,
    description: "Illicit fire-control conversion for a civilian-pattern semiautomatic military arm.",
    notes: [
      "Requires 1 hour and a successful Mechanic/Machinist (CDN, TN -1) or Artisan: Gunsmith (CDN) check.",
      "On success, the host weapon gains the highest listed rate of fire used by its military counterpart.",
      "If the margin of success is less than 5, the weapon also gains 1 permanent Wear.",
    ],
  }),
];

export const SHOTGUN_MODIFICATIONS: ItemDefinition[] = [
  defineWeaponAttachment({
    id: "attachment:shotgun:remove-stock",
    name: "Shotgun Modification: Remove Stock",
    kind: "sawed-off-modification",
    compatibleWeaponTags: ["shotgun"],
    tags: ["weapon-accessory", "shotgun-modification"],
    weight: 0,
    speedModifier: "-1/-1/-2",
    recoilModifierPercent: 50,
    bulkOverride: 3,
    weightModifierPercent: -20,
    notes: ["Keeps the original range profile.", "Represents cutting or removing the stock from a full-length shotgun."],
  }),
  defineWeaponAttachment({
    id: "attachment:shotgun:shorten-barrel",
    name: "Shotgun Modification: Shorten Barrel",
    kind: "sawed-off-modification",
    compatibleWeaponTags: ["shotgun"],
    tags: ["weapon-accessory", "shotgun-modification"],
    weight: 0,
    range: "GF/CQB",
    speedModifier: "-1/-1/-2",
    recoilModifierPercent: 25,
    bulkOverride: 3,
    weightModifierPercent: -20,
    notes: ["Changes the shotgun to the reduced Gunfighting/CQB range profile."],
  }),
  defineWeaponAttachment({
    id: "attachment:shotgun:sawed-off-complete",
    name: "Shotgun Modification: Sawed-Off",
    kind: "sawed-off-modification",
    compatibleWeaponTags: ["shotgun"],
    tags: ["weapon-accessory", "shotgun-modification"],
    weight: 0,
    range: "GF/CQB",
    speedModifier: "-2/-2/-3",
    recoilModifierPercent: 75,
    bulkOverride: 2,
    weightModifierPercent: -40,
    notes: ["Combines stock removal and barrel shortening into a full sawed-off conversion."],
  }),
];

export const WEAPON_ATTACHMENTS: ItemDefinition[] = [
  ...AMMUNITION_HANDLING_ITEMS,
  ...OPTICS,
  ...RAIL_ACCESSORIES,
  ...MISCELLANEOUS_ACCESSORIES,
  ...FIRE_CONTROL_MODIFICATIONS,
  ...SHOTGUN_MODIFICATIONS,
];