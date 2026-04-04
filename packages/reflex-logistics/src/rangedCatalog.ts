import { createRangedWeaponDefinition } from "./inventory";
import type { RangeBandName } from "reflex-combat";
import type { RangedWeaponDefinition, WeaponRangeProfile, WeaponSpeedProfile } from "./types";

type WeaponCatalogEntry = {
  name: string;
  caliber: string;
  capacity: number | string;
  damage: number;
  penetration: string;
  range: string;
  rateOfFire: string;
  speed: string;
  recoil: number;
  bulk: number;
  weight: number;
  barterValue: string;
  streetPrice: number;
  tags: string[];
  supportedAttachmentKinds?: string[];
  crewServed?: boolean;
  requiresEmplacement?: boolean;
};

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

function slugify(value: string): string {
  return value
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

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

function parsePenetration(penetration: string) {
  const [optimum, maximum] = penetration.split("/");
  return { optimum, maximum };
}

function getFeedTags(capacity: number | string): string[] {
  if (typeof capacity === "number") {
    return [];
  }

  if (capacity.includes("(bt)")) {
    return ["belt-fed"];
  }

  if (capacity.includes("(cy)")) {
    return ["cylinder"];
  }

  if (capacity.includes("(in)")) {
    return ["internal-magazine"];
  }

  if (capacity.includes("(si)")) {
    return ["break-action", "side-by-side"];
  }

  return [];
}

function getVoucherCost(tags: string[]): Record<string, number> {
  return { "held:hands": tags.includes("sidearm") ? 1 : 2 };
}

function getDefaultSupportedAttachmentKinds(tags: string[], crewServed?: boolean): string[] {
  const kinds = new Set<string>(["ammo-handling"]);
  const isLongarm = tags.some((tag) =>
    ["rifle", "shotgun", "smg", "machine-gun", "assault-rifle", "battle-rifle", "service-rifle", "sniper-rifle", "dmr"].includes(tag)
  );

  if (tags.includes("handgun") || isLongarm) {
    kinds.add("reflex-optic");
    kinds.add("rail-accessory");
  }

  if (tags.some((tag) => ["handgun", "smg", "shotgun", "assault-rifle"].includes(tag))) {
    kinds.add("iron-sight-replacement");
  }

  if (tags.some((tag) => ["smg", "assault-rifle"].includes(tag))) {
    kinds.add("fire-control-modification");
  }

  if (isLongarm) {
    kinds.add("magnified-optic");
    kinds.add("support-accessory");
    kinds.add("sling-accessory");
  }

  if (tags.includes("shotgun")) {
    kinds.add("sawed-off-modification");
    kinds.add("side-saddle");
  }

  if (tags.includes("machine-gun")) {
    kinds.add("bipod-accessory");
  }

  if (crewServed) {
    kinds.add("tripod-accessory");
  }

  return [...kinds];
}

function defineWeapon(entry: WeaponCatalogEntry): RangedWeaponDefinition {
  const weaponTags = ["firearm", ...entry.tags, ...getFeedTags(entry.capacity)];
  const supportedAttachmentKinds = new Set([
    ...getDefaultSupportedAttachmentKinds(entry.tags, entry.crewServed),
    ...(entry.supportedAttachmentKinds ?? []),
  ]);

  return createRangedWeaponDefinition({
    id: `weapon:${slugify(entry.name)}:${slugify(entry.caliber)}`,
    name: entry.name,
    weight: entry.weight,
    tags: weaponTags,
    voucherCost: getVoucherCost(weaponTags),
    description: entry.requiresEmplacement || entry.crewServed
      ? "Crew-served weapon. Must be emplaced before firing."
      : undefined,
    rangedWeapon: {
      caliber: entry.caliber,
      capacity: entry.capacity,
      damage: entry.damage,
      penetration: parsePenetration(entry.penetration),
      range: parseRange(entry.range),
      rateOfFire: entry.rateOfFire,
      speed: parseSpeed(entry.speed),
      recoil: entry.recoil,
      bulk: entry.bulk,
      supportedAttachmentKinds: [...supportedAttachmentKinds],
      crewServed: entry.crewServed,
      requiresEmplacement: entry.requiresEmplacement,
      barterValue: entry.barterValue,
      streetPrice: entry.streetPrice,
      traits: weaponTags,
    },
  });
}

export const GENERIC_LONGRIFLE: RangedWeaponDefinition = defineWeapon({
  name: "Generic Long Rifle",
  caliber: "7.62mm",
  capacity: 20,
  damage: 4,
  penetration: "x3/x4",
  range: "O/S",
  rateOfFire: "S",
  speed: "1/2/4",
  recoil: 8,
  bulk: 2,
  weight: 8,
  barterValue: "GG0",
  streetPrice: 0,
  tags: ["rifle", "longarm"],
});

export const AUTOLOADERS: RangedWeaponDefinition[] = [
  defineWeapon({ name: ".22 target pistol", caliber: ".22 LR", capacity: 10, damage: 3, penetration: "x4/Nil", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 3, bulk: 1, weight: 0.5, barterValue: "GG85", streetPrice: 330, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: ".32 holdout pistol", caliber: ".32 ACP", capacity: 7, damage: 4, penetration: "x4/Nil", range: "P/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 4, bulk: 1, weight: 0.4, barterValue: "GG100", streetPrice: 400, tags: ["handgun", "sidearm", "autoloader", "pistol", "holdout"] }),
  defineWeapon({ name: ".380 service pistol", caliber: ".380 ACP", capacity: 8, damage: 4, penetration: "x4/Nil", range: "P/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 5, bulk: 1, weight: 0.7, barterValue: "GG125", streetPrice: 500, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "9mm service pistol", caliber: "9mm P", capacity: 13, damage: 4, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 6, bulk: 1, weight: 0.9, barterValue: "GG130", streetPrice: 520, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: ".357 SIG service pistol", caliber: ".357 SIG", capacity: 12, damage: 5, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 8, bulk: 1, weight: 0.9, barterValue: "GG120", streetPrice: 720, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: ".40 S&W service pistol", caliber: ".40 S&W", capacity: 12, damage: 5, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 9, bulk: 1, weight: 0.9, barterValue: "GG130", streetPrice: 650, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "Beretta Model 92", caliber: "9mm Parabellum", capacity: 15, damage: 4, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 6, bulk: 1, weight: 1, barterValue: "GG160", streetPrice: 650, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "Colt Model 1911A1", caliber: ".45 ACP", capacity: 7, damage: 5, penetration: "x4/Nil", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 7, bulk: 1, weight: 1.1, barterValue: "GG400", streetPrice: 800, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "Colt Model 1911A1", caliber: ".38 Super", capacity: 9, damage: 5, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 9, bulk: 1, weight: 1.1, barterValue: "GG400", streetPrice: 1600, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "FN Five-seven", caliber: "5.7mm FN", capacity: 20, damage: 5, penetration: "x2/x3", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 4, bulk: 1, weight: 0.7, barterValue: "GG490", streetPrice: 980, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "Glock 17", caliber: "9mm P", capacity: 17, damage: 4, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 8, bulk: 1, weight: 0.6, barterValue: "GG225", streetPrice: 450, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "H&K Mk. 23", caliber: ".45 ACP", capacity: 12, damage: 5, penetration: "x4/Nil", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 9, bulk: 1, weight: 1.2, barterValue: "GG375", streetPrice: 1500, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "Makarov PM", caliber: "9mm Makarov", capacity: 8, damage: 4, penetration: "x4/Nil", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 5, bulk: 1, weight: 0.7, barterValue: "GG80", streetPrice: 325, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
  defineWeapon({ name: "Yarygin Pya", caliber: "9mm Parabellum", capacity: 17, damage: 4, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 6, bulk: 1, weight: 1, barterValue: "GG200", streetPrice: 400, tags: ["handgun", "sidearm", "autoloader", "pistol"] }),
];

export const REVOLVERS: RangedWeaponDefinition[] = [
  defineWeapon({ name: ".38 Special holdout", caliber: ".38 Special", capacity: "5 (cy)", damage: 4, penetration: "x4/Nil", range: "P/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 7, bulk: 1, weight: 0.6, barterValue: "GG140", streetPrice: 550, tags: ["handgun", "sidearm", "revolver", "holdout"] }),
  defineWeapon({ name: ".38 Special service", caliber: ".38 Special", capacity: "6 (cy)", damage: 4, penetration: "x4/Nil", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 6, bulk: 1, weight: 1, barterValue: "GG130", streetPrice: 520, tags: ["handgun", "sidearm", "revolver"] }),
  defineWeapon({ name: ".357 Magnum holdout", caliber: ".357 Magnum", capacity: "5 (cy)", damage: 5, penetration: "x3/x4", range: "P/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 10, bulk: 1, weight: 0.75, barterValue: "GG165", streetPrice: 650, tags: ["handgun", "sidearm", "revolver", "holdout"] }),
  defineWeapon({ name: ".357 Magnum service", caliber: ".357 Magnum", capacity: "6 (cy)", damage: 5, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S", speed: "1/2/4", recoil: 8, bulk: 1, weight: 1.2, barterValue: "GG175", streetPrice: 700, tags: ["handgun", "sidearm", "revolver"] }),
  defineWeapon({ name: ".44 Magnum", caliber: ".44 Magnum", capacity: "6 (cy)", damage: 6, penetration: "x3/x4", range: "GF/T", rateOfFire: "S", speed: "2/3/5", recoil: 12, bulk: 2, weight: 1.5, barterValue: "GG225", streetPrice: 900, tags: ["handgun", "sidearm", "revolver"] }),
  defineWeapon({ name: ".454 Casull", caliber: ".454 Casull", capacity: "5 (cy)", damage: 7, penetration: "x3/x4", range: "GF/T", rateOfFire: "S", speed: "2/3/5", recoil: 16, bulk: 2, weight: 1.8, barterValue: "GG275", streetPrice: 1100, tags: ["handgun", "sidearm", "revolver"] }),
];

export const SUBMACHINE_GUNS: RangedWeaponDefinition[] = [
  defineWeapon({ name: "9mm SMG", caliber: "9mm Parabellum", capacity: 30, damage: 4, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S/B4", speed: "2/3/5", recoil: 4, bulk: 2, weight: 3, barterValue: "GG375", streetPrice: 750, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "CZ v.61 Skorpion", caliber: ".32 ACP", capacity: 20, damage: 4, penetration: "x4/Nil", range: "GF/CQB", rateOfFire: "S/B6", speed: "2/3/5*", recoil: 2, bulk: 2, weight: 1.3, barterValue: "GG440", streetPrice: 880, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "CZ v.83 Skorpion", caliber: ".380 ACP", capacity: 20, damage: 4, penetration: "x4/Nil", range: "GF/CQB", rateOfFire: "S/B6", speed: "2/3/5*", recoil: 3, bulk: 2, weight: 1.4, barterValue: "GG440", streetPrice: 880, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "CZ v.82 Skorpion", caliber: "9mm Makarov", capacity: 20, damage: 4, penetration: "x4/Nil", range: "GF/CQB", rateOfFire: "S/B6", speed: "2/3/5*", recoil: 4, bulk: 2, weight: 1.4, barterValue: "GG440", streetPrice: 880, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "FN P90", caliber: "5.7mm FN", capacity: 50, damage: 5, penetration: "x2/x3", range: "CQB/T", rateOfFire: "S/B6", speed: "2/3/5", recoil: 2, bulk: 2, weight: 2.5, barterValue: "GG750", streetPrice: 1500, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "H&K MP5K", caliber: "9mm Parabellum", capacity: 30, damage: 4, penetration: "x3/x4", range: "GF/CQB", rateOfFire: "S/B3/B5", speed: "2/3/5", recoil: 3, bulk: 2, weight: 2.1, barterValue: "GG450", streetPrice: 1000, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "H&K UMP", caliber: "9mm Parabellum", capacity: 30, damage: 4, penetration: "x3/x4", range: "CQB/T", rateOfFire: "S/B2/B4", speed: "2/3/5", recoil: 4, bulk: 2, weight: 2.1, barterValue: "GG475", streetPrice: 950, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "H&K UMP", caliber: ".40 S&W", capacity: 30, damage: 5, penetration: "x3/x4", range: "CQB/T", rateOfFire: "S/B2/B4", speed: "2/3/5", recoil: 6, bulk: 2, weight: 2.1, barterValue: "GG475", streetPrice: 950, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "H&K UMP", caliber: ".45 ACP", capacity: 25, damage: 5, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S/B2/B4", speed: "2/3/5", recoil: 7, bulk: 2, weight: 2.2, barterValue: "GG475", streetPrice: 950, tags: ["smg", "submachine-gun"] }),
  defineWeapon({ name: "Izmash PP-19 Bizon", caliber: "9mm Makarov", capacity: 64, damage: 4, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S/B6", speed: "2/3/5", recoil: 3, bulk: 2, weight: 2.1, barterValue: "GG625", streetPrice: 1250, tags: ["smg", "submachine-gun"] }),
];

export const ASSAULT_RIFLES: RangedWeaponDefinition[] = [
  defineWeapon({ name: "Assault rifle", caliber: "5.56x45mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "S/B3/B5", speed: "3/5/7", recoil: 5, bulk: 3, weight: 3.3, barterValue: "GG600", streetPrice: 1200, tags: ["rifle", "assault-rifle"] }),
  defineWeapon({ name: "Bullpup assault rifle", caliber: "5.56x45mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "S/B5", speed: "3/4/6", recoil: 4, bulk: 3, weight: 4.3, barterValue: "GG900", streetPrice: 1200, tags: ["rifle", "assault-rifle", "bullpup"] }),
  defineWeapon({ name: "Carbine", caliber: "5.56x45mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "T/O", rateOfFire: "S/B5", speed: "3/4/6", recoil: 5, bulk: 3, weight: 2.6, barterValue: "GG600", streetPrice: 1200, tags: ["rifle", "assault-rifle", "carbine"] }),
  defineWeapon({ name: "Battle rifle", caliber: "7.62x51mm", capacity: 20, damage: 8, penetration: "x2/x3", range: "M/S", rateOfFire: "S/B4", speed: "3/6/8", recoil: 9, bulk: 3, weight: 4, barterValue: "GG900", streetPrice: 1800, tags: ["rifle", "battle-rifle"] }),
  defineWeapon({ name: "AK-47", caliber: "7.62x39mm", capacity: 30, damage: 7, penetration: "x2/x3", range: "M/S", rateOfFire: "S/B4", speed: "3/5/7", recoil: 5, bulk: 3, weight: 3.8, barterValue: "GG300", streetPrice: 400, tags: ["rifle", "assault-rifle"] }),
  defineWeapon({ name: "AK-74", caliber: "5.45x39mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "S/B4", speed: "3/5/7", recoil: 4, bulk: 3, weight: 2.9, barterValue: "GG260", streetPrice: 520, tags: ["rifle", "assault-rifle"] }),
  defineWeapon({ name: "AKS-74U", caliber: "5.45x39mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "CQB/M", rateOfFire: "S/B5", speed: "3/4/6", recoil: 4, bulk: 3, weight: 2.3, barterValue: "GG300", streetPrice: 600, tags: ["rifle", "assault-rifle", "carbine"] }),
  defineWeapon({ name: "M16A4", caliber: "5.56x45mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "S/B3", speed: "3/5/7", recoil: 5, bulk: 3, weight: 3.4, barterValue: "GG475", streetPrice: 950, tags: ["rifle", "assault-rifle"] }),
  defineWeapon({ name: "M4A1", caliber: "5.56x45mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "T/O", rateOfFire: "S/B5", speed: "3/4/6", recoil: 5, bulk: 3, weight: 2.5, barterValue: "GG550", streetPrice: 1100, tags: ["rifle", "assault-rifle", "carbine"] }),
  defineWeapon({ name: "QBZ-95", caliber: "5.8x42mm", capacity: 30, damage: 7, penetration: "x2/x3", range: "M/S", rateOfFire: "S/B4", speed: "3/4/6", recoil: 5, bulk: 3, weight: 3.4, barterValue: "GG1,050", streetPrice: 1400, tags: ["rifle", "assault-rifle", "bullpup"] }),
  defineWeapon({ name: "Steyr AUG", caliber: "5.56x45mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "S/B5", speed: "3/5/7", recoil: 4, bulk: 3, weight: 3.6, barterValue: "GG975", streetPrice: 1300, tags: ["rifle", "assault-rifle", "bullpup"] }),
  defineWeapon({ name: "Steyr AUG (carbine)", caliber: "5.56x45mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "T/O", rateOfFire: "S/B5", speed: "2/4/6", recoil: 4, bulk: 2, weight: 3.3, barterValue: "GG975", streetPrice: 1300, tags: ["rifle", "assault-rifle", "bullpup", "carbine"] }),
];

export const TARGET_AND_HUNTING_RIFLES: RangedWeaponDefinition[] = [
  defineWeapon({ name: "Target rifle, bolt action", caliber: ".22 LR", capacity: "5 (in)", damage: 3, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "4/6/9", recoil: 1, bulk: 3, weight: 2.5, barterValue: "GG55", streetPrice: 220, tags: ["rifle", "target-rifle", "bolt-action"] }),
  defineWeapon({ name: "Target rifle, semi-auto", caliber: ".22 LR", capacity: "10 (in)", damage: 3, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "3/4/6", recoil: 2, bulk: 3, weight: 2.1, barterValue: "GG60", streetPrice: 240, tags: ["rifle", "target-rifle", "semi-automatic"] }),
  defineWeapon({ name: "Small game rifle, bolt action", caliber: "5.56x45mm", capacity: "6 (in)", damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "S", speed: "5/8/11", recoil: 5, bulk: 4, weight: 3.1, barterValue: "GG230", streetPrice: 700, tags: ["rifle", "hunting-rifle", "bolt-action"] }),
  defineWeapon({ name: "Hunting rifle, bolt action", caliber: "6.5x55mm", capacity: "5 (in)", damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 8, bulk: 4, weight: 4, barterValue: "GG230", streetPrice: 700, tags: ["rifle", "hunting-rifle", "bolt-action"] }),
  defineWeapon({ name: "Hunting rifle, bolt action", caliber: "7.62x51mm", capacity: "5 (in)", damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 10, bulk: 4, weight: 3.3, barterValue: "GG400", streetPrice: 800, tags: ["rifle", "hunting-rifle", "bolt-action"] }),
  defineWeapon({ name: "Hunting rifle, bolt action", caliber: ".30-06", capacity: "4 (in)", damage: 9, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 11, bulk: 4, weight: 3.4, barterValue: "GG420", streetPrice: 840, tags: ["rifle", "hunting-rifle", "bolt-action"] }),
  defineWeapon({ name: "Hunting rifle, bolt action", caliber: ".300 Winchester Magnum", capacity: "3 (in)", damage: 10, penetration: "x1/x2", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 13, bulk: 4, weight: 3.4, barterValue: "GG425", streetPrice: 850, tags: ["rifle", "hunting-rifle", "bolt-action"] }),
  defineWeapon({ name: "Big game rifle, bolt action", caliber: ".460 Weatherby Magnum", capacity: "2 (in)", damage: 12, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "6/9/14", recoil: 27, bulk: 5, weight: 4.5, barterValue: "GG750", streetPrice: 3000, tags: ["rifle", "hunting-rifle", "bolt-action", "big-game"] }),
];

export const BOLT_ACTION_SERVICE_RIFLES: RangedWeaponDefinition[] = [
  defineWeapon({ name: "Lee-Enfield No. 4 Mk. 1", caliber: ".303 British", capacity: "10 (in)", damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 10, bulk: 4, weight: 3.7, barterValue: "GG335", streetPrice: 670, tags: ["rifle", "service-rifle", "bolt-action"] }),
  defineWeapon({ name: "Mauser Kar98k", caliber: "8mm Mauser", capacity: "5 (in)", damage: 9, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 8, bulk: 4, weight: 4.1, barterValue: "GG435", streetPrice: 870, tags: ["rifle", "service-rifle", "bolt-action"] }),
  defineWeapon({ name: "Mosin-Nagant", caliber: "7.62x54mm", capacity: "5 (in)", damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 9, bulk: 4, weight: 4.1, barterValue: "GG100", streetPrice: 200, tags: ["rifle", "service-rifle", "bolt-action"] }),
];

export const SEMI_AUTOMATIC_SERVICE_RIFLES: RangedWeaponDefinition[] = [
  defineWeapon({ name: "M1 Carbine", caliber: ".30 Carbine", capacity: 15, damage: 4, penetration: "x3/x4", range: "CQB/M", rateOfFire: "S", speed: "3/4/6", recoil: 6, bulk: 3, weight: 2.4, barterValue: "GG150", streetPrice: 600, tags: ["rifle", "service-rifle", "semi-automatic", "carbine"] }),
  defineWeapon({ name: "M1 Garand", caliber: ".30-06", capacity: "8 (in)", damage: 9, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "4/6/9", recoil: 9, bulk: 4, weight: 4.6, barterValue: "GG150", streetPrice: 600, tags: ["rifle", "service-rifle", "semi-automatic"] }),
  defineWeapon({ name: "SKS", caliber: "7.62x39mm", capacity: "10 (in)", damage: 7, penetration: "x2/x3", range: "M/S", rateOfFire: "S", speed: "3/5/7", recoil: 6, bulk: 3, weight: 3.9, barterValue: "GG125", streetPrice: 250, tags: ["rifle", "service-rifle", "semi-automatic"] }),
];

export const BOLT_ACTION_SNIPER_RIFLES: RangedWeaponDefinition[] = [
  defineWeapon({ name: "Sniper rifle", caliber: "7.62x51mm", capacity: 10, damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 7, bulk: 4, weight: 6.2, barterValue: "GG2,000", streetPrice: 4000, tags: ["rifle", "sniper-rifle", "bolt-action"] }),
  defineWeapon({ name: "Anti-materiel rifle", caliber: ".50 BMG", capacity: 5, damage: 16, penetration: "x1/x2", range: "O/EX", rateOfFire: "S", speed: "6/9/14", recoil: 24, bulk: 5, weight: 15, barterValue: "GG5,700", streetPrice: 57000, tags: ["rifle", "sniper-rifle", "anti-materiel", "bolt-action"] }),
  defineWeapon({ name: "AI AW", caliber: "7.62x51mm", capacity: 10, damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 7, bulk: 4, weight: 6.5, barterValue: "GG3,500", streetPrice: 5000, tags: ["rifle", "sniper-rifle", "bolt-action"] }),
  defineWeapon({ name: "AI AWM", caliber: "7mm Remington Magnum", capacity: 5, damage: 9, penetration: "x1/x2", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 8, bulk: 4, weight: 6.6, barterValue: "GG2,000", streetPrice: 5000, tags: ["rifle", "sniper-rifle", "bolt-action"] }),
  defineWeapon({ name: "AI AWM", caliber: ".300 Winchester Magnum", capacity: 5, damage: 10, penetration: "x1/x2", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 9, bulk: 4, weight: 6.7, barterValue: "GG2,200", streetPrice: 5400, tags: ["rifle", "sniper-rifle", "bolt-action"] }),
  defineWeapon({ name: "AI AWM", caliber: ".338 Lapua", capacity: 4, damage: 10, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "5/8/11", recoil: 12, bulk: 4, weight: 7.3, barterValue: "GG2,600", streetPrice: 6400, tags: ["rifle", "sniper-rifle", "bolt-action"] }),
];

export const SEMI_AUTOMATIC_SNIPER_RIFLES: RangedWeaponDefinition[] = [
  defineWeapon({ name: "Sniper rifle", caliber: "7.62x51mm", capacity: 20, damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "4/6/9", recoil: 8, bulk: 4, weight: 5.1, barterValue: "GG1,500", streetPrice: 3000, tags: ["rifle", "sniper-rifle", "semi-automatic"] }),
  defineWeapon({ name: "Barrett Model 82", caliber: ".50 BMG", capacity: 10, damage: 16, penetration: "x1/x2", range: "O/EX", rateOfFire: "S", speed: "5/8/11", recoil: 24, bulk: 5, weight: 14.1, barterValue: "GG8,300", streetPrice: 8300, tags: ["rifle", "sniper-rifle", "semi-automatic", "anti-materiel"] }),
  defineWeapon({ name: "Dragunov SVD", caliber: "7.62x54mm", capacity: 10, damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "4/6/9", recoil: 9, bulk: 4, weight: 4.3, barterValue: "GG400", streetPrice: 800, tags: ["rifle", "sniper-rifle", "semi-automatic"] }),
  defineWeapon({ name: "M14", caliber: "7.62x51mm", capacity: 20, damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "4/6/9", recoil: 8, bulk: 4, weight: 5.2, barterValue: "GG500", streetPrice: 1000, tags: ["rifle", "sniper-rifle", "semi-automatic"] }),
  defineWeapon({ name: "M16 DMR", caliber: "5.56x45mm", capacity: 30, damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "S", speed: "3/5/8", recoil: 4, bulk: 3, weight: 3.8, barterValue: "GG1,500", streetPrice: 3000, tags: ["rifle", "dmr", "semi-automatic"] }),
  defineWeapon({ name: "M16 DMR", caliber: "7.62x51mm", capacity: 20, damage: 8, penetration: "x2/x3", range: "M/EX", rateOfFire: "S", speed: "4/6/8", recoil: 8, bulk: 4, weight: 5.4, barterValue: "GG1,500", streetPrice: 3000, tags: ["rifle", "dmr", "semi-automatic"] }),
];

export const PUMP_ACTION_SHOTGUNS: RangedWeaponDefinition[] = [
  defineWeapon({ name: ".410 bore", caliber: ".410 bore", capacity: "5 (in)", damage: 8, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "5/8/11", recoil: 4, bulk: 4, weight: 3.3, barterValue: "GG160", streetPrice: 635, tags: ["shotgun", "pump-action"], supportedAttachmentKinds: ["sawed-off-modification"] }),
  defineWeapon({ name: "20 gauge", caliber: "20 gauge", capacity: "4 (in)", damage: 9, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "5/8/11", recoil: 13, bulk: 4, weight: 3.3, barterValue: "GG135", streetPrice: 545, tags: ["shotgun", "pump-action"], supportedAttachmentKinds: ["sawed-off-modification"] }),
  defineWeapon({ name: "12 gauge", caliber: "12 gauge", capacity: "7 (in)", damage: 10, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "5/8/11", recoil: 19, bulk: 4, weight: 3.6, barterValue: "GG210", streetPrice: 420, tags: ["shotgun", "pump-action"], supportedAttachmentKinds: ["sawed-off-modification"] }),
  defineWeapon({ name: "10 gauge", caliber: "10 gauge", capacity: "4 (in)", damage: 10, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "5/8/11", recoil: 23, bulk: 4, weight: 3.7, barterValue: "GG365", streetPrice: 730, tags: ["shotgun", "pump-action"], supportedAttachmentKinds: ["sawed-off-modification"] }),
];

export const SEMI_AUTOMATIC_SHOTGUNS: RangedWeaponDefinition[] = [
  defineWeapon({ name: "20 gauge", caliber: "20 gauge", capacity: "5 (in)", damage: 9, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "4/6/9", recoil: 11, bulk: 4, weight: 3.5, barterValue: "GG150", streetPrice: 600, tags: ["shotgun", "semi-automatic"], supportedAttachmentKinds: ["sawed-off-modification"] }),
  defineWeapon({ name: "12 gauge", caliber: "12 gauge", capacity: "7 (in)", damage: 10, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "4/6/9", recoil: 16, bulk: 4, weight: 3.8, barterValue: "GG180", streetPrice: 680, tags: ["shotgun", "semi-automatic"], supportedAttachmentKinds: ["sawed-off-modification"] }),
  defineWeapon({ name: "Saiga 12", caliber: "12 gauge", capacity: 8, damage: 10, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "3/5/8", recoil: 17, bulk: 3, weight: 3.6, barterValue: "GG250", streetPrice: 500, tags: ["shotgun", "semi-automatic"], supportedAttachmentKinds: ["sawed-off-modification"] }),
  defineWeapon({ name: "Saiga 20", caliber: "20 gauge", capacity: 5, damage: 9, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "3/5/8", recoil: 11, bulk: 3, weight: 3.4, barterValue: "GG200", streetPrice: 400, tags: ["shotgun", "semi-automatic"], supportedAttachmentKinds: ["sawed-off-modification"] }),
  defineWeapon({ name: "Saiga 410", caliber: ".410", capacity: 4, damage: 8, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S", speed: "3/5/8", recoil: 3, bulk: 3, weight: 3.4, barterValue: "GG175", streetPrice: 350, tags: ["shotgun", "semi-automatic"], supportedAttachmentKinds: ["sawed-off-modification"] }),
];

export const BREAK_ACTION_SHOTGUNS: RangedWeaponDefinition[] = [
  defineWeapon({ name: "20 gauge", caliber: "20 gauge", capacity: "2 (si)", damage: 9, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S/B2", speed: "4/6/9", recoil: 14, bulk: 4, weight: 2.6, barterValue: "GG75", streetPrice: 300, tags: ["shotgun", "break-action"], supportedAttachmentKinds: ["sawed-off-modification"] }),
  defineWeapon({ name: "12 gauge", caliber: "12 gauge", capacity: "2 (si)", damage: 10, penetration: "x4/Nil", range: "CQB/T", rateOfFire: "S/B2", speed: "4/6/9", recoil: 22, bulk: 4, weight: 2.9, barterValue: "GG85", streetPrice: 350, tags: ["shotgun", "break-action"], supportedAttachmentKinds: ["sawed-off-modification"] }),
];

export const SQUAD_AUTOMATIC_WEAPONS: RangedWeaponDefinition[] = [
  defineWeapon({ name: "FN Minimi", caliber: "5.56x45mm", capacity: "200 (bt)", damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "B5/B9", speed: "4/6/9", recoil: 3, bulk: 4, weight: 7.1, barterValue: "GG1,500", streetPrice: 6000, tags: ["machine-gun", "saw"] }),
  defineWeapon({ name: "RPK", caliber: "7.62x39mm", capacity: 75, damage: 7, penetration: "x2/x3", range: "M/S", rateOfFire: "B4/B8", speed: "4/6/9", recoil: 6, bulk: 4, weight: 5, barterValue: "GG1,100", streetPrice: 4200, tags: ["machine-gun", "saw"] }),
  defineWeapon({ name: "RPK-74", caliber: "5.45x39mm", capacity: 45, damage: 6, penetration: "x2/x3", range: "M/S", rateOfFire: "B4/B8", speed: "4/6/9", recoil: 3, bulk: 4, weight: 5, barterValue: "GG1,200", streetPrice: 4600, tags: ["machine-gun", "saw"] }),
];

export const GENERAL_PURPOSE_MACHINE_GUNS: RangedWeaponDefinition[] = [
  defineWeapon({ name: "FN MAG", caliber: "7.62x51mm", capacity: "100 (bt)", damage: 8, penetration: "x2/x3", range: "O/EX", rateOfFire: "B6/B11", speed: "5/8/11", recoil: 6, bulk: 5, weight: 10.2, barterValue: "GG2,200", streetPrice: 8700, tags: ["machine-gun", "gpmg", "crew-served"], crewServed: true, requiresEmplacement: true }),
  defineWeapon({ name: "PKM", caliber: "7.62x54mmR", capacity: "100 (bt)", damage: 8, penetration: "x2/x3", range: "O/EX", rateOfFire: "B4/B9", speed: "5/8/11", recoil: 6, bulk: 5, weight: 9, barterValue: "GG1,400", streetPrice: 5500, tags: ["machine-gun", "gpmg", "crew-served"], crewServed: true, requiresEmplacement: true }),
];
//TODO: do we really need the crewserved bool? We could just check if the tags include "crew-served" and if it requires emplacement. That would be more flexible and less redundant.

export const HEAVY_MACHINE_GUNS: RangedWeaponDefinition[] = [
  defineWeapon({ name: "Browning M2HB", caliber: ".50 BMG", capacity: "105 (bt)", damage: 16, penetration: "x1/x2", range: "S/EX", rateOfFire: "S/B4/B8", speed: "7/11/16", recoil: 15, bulk: 7, weight: 38, barterValue: "GG3,200", streetPrice: 12700, tags: ["machine-gun", "hmg", "crew-served"], crewServed: true, requiresEmplacement: true }),
  defineWeapon({ name: "KPV", caliber: "14.5x114mm", capacity: "100 (bt)", damage: 21, penetration: "x1/x2", range: "S/EX", rateOfFire: "S/B4/B7", speed: "8/12/18", recoil: 19, bulk: 8, weight: 49, barterValue: "GG4,200", streetPrice: 16600, tags: ["machine-gun", "hmg", "crew-served"], crewServed: true, requiresEmplacement: true }),
  defineWeapon({ name: "NSV", caliber: "12.7x108mm", capacity: "50 (bt)", damage: 16, penetration: "x1/x2", range: "S/EX", rateOfFire: "S/B5/B10", speed: "7/11/16", recoil: 18, bulk: 7, weight: 25, barterValue: "GG2,700", streetPrice: 10800, tags: ["machine-gun", "hmg", "crew-served"], crewServed: true, requiresEmplacement: true }),
];

export const RANGED_CATALOG: RangedWeaponDefinition[] = [
  ...AUTOLOADERS,
  ...REVOLVERS,
  ...SUBMACHINE_GUNS,
  ...ASSAULT_RIFLES,
  ...TARGET_AND_HUNTING_RIFLES,
  ...BOLT_ACTION_SERVICE_RIFLES,
  ...SEMI_AUTOMATIC_SERVICE_RIFLES,
  ...BOLT_ACTION_SNIPER_RIFLES,
  ...SEMI_AUTOMATIC_SNIPER_RIFLES,
  ...PUMP_ACTION_SHOTGUNS,
  ...SEMI_AUTOMATIC_SHOTGUNS,
  ...BREAK_ACTION_SHOTGUNS,
  ...SQUAD_AUTOMATIC_WEAPONS,
  ...GENERAL_PURPOSE_MACHINE_GUNS,
  ...HEAVY_MACHINE_GUNS,
];