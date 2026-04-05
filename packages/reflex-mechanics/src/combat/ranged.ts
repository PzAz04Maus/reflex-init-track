import {
  countRangeBandSteps,
  getRangeBandAtIndex,
  getRangeBandIndex,
  type HumanSizeRangeShiftName,
  HumanSizeRangeShift,
  type RangeBandName,
} from '../rangeBands';
import type { Stance } from '../types';

export const RANGED_COMBAT_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.145-147';

export type CoverMaterial =
  | 'advancedCeramicCompositeArmor'
  | 'steelArmorPlate'
  | 'sheetSteel'
  | 'reinforcedConcrete'
  | 'concreteBrick'
  | 'stonePackedDirtWoodLiquid'
  | 'fiberglass'
  | 'looseDirt';

export type BurstHitOutcome = 'same-location' | 'random-location' | 'miss';

export interface WeaponRangeProfileLike {
  optimum: RangeBandName;
  maximum?: RangeBandName;
  indirect?: RangeBandName;
}

export interface RangedWeaponProfileLike {
  range: WeaponRangeProfileLike;
  recoil?: number;
  rateOfFire?: string;
}

export interface VehicleCoverOptions {
  armor: number;
  attackPassesThroughVehicle?: boolean;
  usingEngineBlock?: boolean;
}

export interface MaterialArmorProfile {
  mmPerArmor: number;
  multiplier: number;
}

export interface RangeResolution {
  targetRangeBand: RangeBandName;
  effectiveRangeBand: RangeBandName;
  sizeShift: number;
  tickCostModifier: number;
  accuracyModifier: number;
  canAttack: boolean;
  bandsFromOptimum: number;
  bandsPastMaximum: number;
}

export interface BurstFireProfile {
  requestedRounds: number;
  roundsFired: number;
  additionalRounds: number;
  attackBonus: number;
  supportedBurstSizes: number[];
}

export interface ThrowingRangeProfile {
  optimum: RangeBandName;
  maximum?: RangeBandName;
  canThrow: boolean;
  weightPenaltyBands: number;
}

export interface HandGrenadeFuseResolution {
  detonationTickCost: number;
}

export type WeaponSupportMode = 'none' | 'bipod' | 'fixedMount';

export type HeavyWeaponCategory =
  | 'machineGun'
  | 'flamethrower'
  | 'squadSupportWeapon'
  | 'lightAutocannon'
  | 'antiTankWeapon'
  | 'cannon'
  | 'structureScale';

export type HeavyWeaponTargetClass = 'character' | 'passengerVehicle' | 'vehicleOrStructure';

export interface BurstHitResolution {
  additionalHits: number;
  sameLocationHits: number;
  randomLocationHits: number;
  misses: number;
  outcomes: BurstHitOutcome[];
}

export interface RecoilContext {
  designedHands?: 1 | 2;
  handsUsed?: 1 | 2;
  stance?: Stance;
  fixedMount?: boolean;
}

export interface RecoilResolution {
  effectiveMuscle: number;
  modifiedRecoil: number;
  attackPenalty: number;
  followUpPenalty: number;
}

export const COVER_MATERIAL_ARMOR: Record<CoverMaterial, MaterialArmorProfile> = {
  advancedCeramicCompositeArmor: { mmPerArmor: 2.5, multiplier: 0.4 },
  steelArmorPlate: { mmPerArmor: 5, multiplier: 0.2 },
  sheetSteel: { mmPerArmor: 6, multiplier: 0.16 },
  reinforcedConcrete: { mmPerArmor: 25, multiplier: 0.04 },
  concreteBrick: { mmPerArmor: 35, multiplier: 0.03 },
  stonePackedDirtWoodLiquid: { mmPerArmor: 50, multiplier: 0.02 },
  fiberglass: { mmPerArmor: 150, multiplier: 0.007 },
  looseDirt: { mmPerArmor: 250, multiplier: 0.004 },
};

const THROWING_RANGE_BY_MUSCLE: ReadonlyArray<{
  minMuscle: number;
  maxMuscle: number;
  optimum: RangeBandName;
  maximum: RangeBandName;
}> = [
  { minMuscle: 1, maxMuscle: 4, optimum: 'Personal', maximum: 'Gunfighting' },
  { minMuscle: 5, maxMuscle: 7, optimum: 'Personal', maximum: 'CQB' },
  { minMuscle: 8, maxMuscle: 12, optimum: 'Gunfighting', maximum: 'CQB' },
  { minMuscle: 13, maxMuscle: Number.POSITIVE_INFINITY, optimum: 'Gunfighting', maximum: 'Tight' },
];

const STANCE_RECOIL_MUSCLE_MODIFIER: Record<Stance, number | 'double'> = {
  standing: 0,
  kneeling: 1,
  sitting: 2,
  prone: 'double',
};

function clampRangeBandIndex(index: number): number {
  return Math.min(Math.max(index, 0), getRangeBandIndex('Extreme'));
}

function getRangeBandForIndex(index: number): RangeBandName {
  return getRangeBandAtIndex(clampRangeBandIndex(index)) ?? 'Extreme';
}

function getThrowingRangeEntry(muscle: number) {
  return THROWING_RANGE_BY_MUSCLE.find((entry) => muscle >= entry.minMuscle && muscle <= entry.maxMuscle)
    ?? THROWING_RANGE_BY_MUSCLE[0];
}

export function getHumanSizeRangeShift(size: HumanSizeRangeShiftName | '1x' = '1x'): number {
  if (size === '1x') {
    return 0;
  }

  return HumanSizeRangeShift[size].Mod;
}

export function getEffectiveTargetRangeBand(
  targetRangeBand: RangeBandName,
  size: HumanSizeRangeShiftName | '1x' = '1x',
): RangeBandName {
  const effectiveIndex = getRangeBandIndex(targetRangeBand) + getHumanSizeRangeShift(size);
  return getRangeBandForIndex(effectiveIndex);
}

export function resolveWeaponRange(
  weaponRange: WeaponRangeProfileLike,
  targetRangeBand: RangeBandName,
  size: HumanSizeRangeShiftName | '1x' = '1x',
): RangeResolution {
  const sizeShift = getHumanSizeRangeShift(size);
  const effectiveRangeIndex = getRangeBandIndex(targetRangeBand) + sizeShift;
  const effectiveRangeBand = getRangeBandForIndex(effectiveRangeIndex);
  const optimumIndex = getRangeBandIndex(weaponRange.optimum);
  const maximumIndex = getRangeBandIndex(weaponRange.maximum ?? weaponRange.optimum);
  const bandsFromOptimum = Math.abs(effectiveRangeIndex - optimumIndex);
  const bandsPastMaximum = Math.max(0, effectiveRangeIndex - maximumIndex);

  if (effectiveRangeIndex < optimumIndex) {
    return {
      targetRangeBand,
      effectiveRangeBand,
      sizeShift,
      tickCostModifier: optimumIndex - effectiveRangeIndex,
      accuracyModifier: 0,
      canAttack: true,
      bandsFromOptimum,
      bandsPastMaximum: 0,
    };
  }

  if (effectiveRangeIndex > maximumIndex) {
    return {
      targetRangeBand,
      effectiveRangeBand,
      sizeShift,
      tickCostModifier: 0,
      accuracyModifier: -3 * countRangeBandSteps(weaponRange.optimum, effectiveRangeBand),
      canAttack: false,
      bandsFromOptimum,
      bandsPastMaximum,
    };
  }

  return {
    targetRangeBand,
    effectiveRangeBand,
    sizeShift,
    tickCostModifier: 0,
    accuracyModifier: -3 * Math.max(0, effectiveRangeIndex - optimumIndex),
    canAttack: true,
    bandsFromOptimum,
    bandsPastMaximum: 0,
  };
}

export function getThrowingRangeProfile(muscle: number, weightKg: number): ThrowingRangeProfile {
  const entry = getThrowingRangeEntry(muscle);
  const heavyLimitKg = muscle / 2;

  if (weightKg > heavyLimitKg) {
    return {
      optimum: entry.optimum,
      maximum: entry.maximum,
      canThrow: false,
      weightPenaltyBands: 0,
    };
  }

  const weightPenaltyBands = weightKg > 1 ? 1 : 0;

  return {
    optimum: getRangeBandForIndex(getRangeBandIndex(entry.optimum) - weightPenaltyBands),
    maximum: getRangeBandForIndex(getRangeBandIndex(entry.maximum) - weightPenaltyBands),
    canThrow: true,
    weightPenaltyBands,
  };
}

export function resolveHandGrenadeFuse(roll: number): HandGrenadeFuseResolution {
  return {
    detonationTickCost: roll + 4,
  };
}

export function parseBurstFireSizes(rateOfFire?: string): number[] {
  if (!rateOfFire) {
    return [];
  }

  return rateOfFire
    .split('/')
    .map((part) => part.trim())
    .map((part) => /^B(\d+)$/i.exec(part))
    .flatMap((match) => (match ? [Number.parseInt(match[1], 10)] : []));
}

export function prepareBurstFire(
  rateOfFire: string | undefined,
  ammoAvailable: number,
  requestedRounds?: number,
): BurstFireProfile | null {
  const supportedBurstSizes = parseBurstFireSizes(rateOfFire);

  if (supportedBurstSizes.length === 0) {
    return null;
  }

  const requestedBurst = requestedRounds ?? supportedBurstSizes[0];

  if (!supportedBurstSizes.includes(requestedBurst)) {
    return null;
  }

  const roundsFired = Math.max(1, Math.min(requestedBurst, ammoAvailable));

  return {
    requestedRounds: requestedBurst,
    roundsFired,
    additionalRounds: Math.max(0, roundsFired - 1),
    attackBonus: Math.max(0, roundsFired - 1),
    supportedBurstSizes,
  };
}

export function resolveBurstHitRolls(rolls: readonly number[]): BurstHitResolution {
  const outcomes = rolls.map<BurstHitOutcome>((roll) => {
    if (roll === 1) {
      return 'same-location';
    }

    if (roll === 2 || roll === 3) {
      return 'random-location';
    }

    return 'miss';
  });

  const sameLocationHits = outcomes.filter((outcome) => outcome === 'same-location').length;
  const randomLocationHits = outcomes.filter((outcome) => outcome === 'random-location').length;
  const misses = outcomes.filter((outcome) => outcome === 'miss').length;

  return {
    additionalHits: sameLocationHits + randomLocationHits,
    sameLocationHits,
    randomLocationHits,
    misses,
    outcomes,
  };
}

export function applyWeaponSupportRecoil(baseRecoil: number, supportMode: WeaponSupportMode): number {
  if (supportMode === 'bipod') {
    return Math.max(0, baseRecoil - 2);
  }

  if (supportMode === 'fixedMount') {
    return Math.floor(baseRecoil / 2);
  }

  return baseRecoil;
}

export function getEffectiveMuscleForRecoil(muscle: number, context: RecoilContext = {}): number {
  const designedHands = context.designedHands ?? 1;
  const handsUsed = context.handsUsed ?? designedHands;
  let effectiveMuscle = muscle;

  if (designedHands === 1 && handsUsed === 2) {
    effectiveMuscle += 2;
  }

  if (designedHands === 2 && handsUsed === 1 && !context.fixedMount) {
    effectiveMuscle = Math.floor(effectiveMuscle / 2);
  }

  const stanceModifier = STANCE_RECOIL_MUSCLE_MODIFIER[context.stance ?? 'standing'];

  if (stanceModifier === 'double') {
    effectiveMuscle *= 2;
  } else {
    effectiveMuscle += stanceModifier;
  }

  return effectiveMuscle;
}

export function resolveSingleShotRecoil(
  weaponRecoil: number,
  muscle: number,
  context: RecoilContext = {},
): RecoilResolution {
  const effectiveMuscle = getEffectiveMuscleForRecoil(muscle, context);
  const followUpPenalty = Math.max(0, weaponRecoil - effectiveMuscle);

  return {
    effectiveMuscle,
    modifiedRecoil: weaponRecoil,
    attackPenalty: 0,
    followUpPenalty,
  };
}

export function resolveBurstFireRecoil(
  weaponRecoil: number,
  burstRounds: number,
  muscle: number,
  context: RecoilContext = {},
): RecoilResolution {
  const effectiveMuscle = getEffectiveMuscleForRecoil(muscle, context);
  const modifiedRecoil = weaponRecoil + burstRounds;
  const penalty = Math.max(0, modifiedRecoil - effectiveMuscle);

  return {
    effectiveMuscle,
    modifiedRecoil,
    attackPenalty: penalty,
    followUpPenalty: penalty,
  };
}

export function getHeavyWeaponAttackPenalty(
  weaponCategory: HeavyWeaponCategory,
  targetClass: HeavyWeaponTargetClass,
): number | null {
  if (weaponCategory === 'structureScale') {
    return targetClass === 'vehicleOrStructure' ? 0 : null;
  }

  if (weaponCategory === 'machineGun' || weaponCategory === 'flamethrower') {
    return 0;
  }

  if (weaponCategory === 'squadSupportWeapon' || weaponCategory === 'lightAutocannon') {
    return targetClass === 'character' ? -3 : 0;
  }

  if (weaponCategory === 'antiTankWeapon' || weaponCategory === 'cannon') {
    if (targetClass === 'character') {
      return -6;
    }

    if (targetClass === 'passengerVehicle') {
      return -3;
    }

    return 0;
  }

  return 0;
}

export function computeMaterialCoverArmor(material: CoverMaterial, thicknessMm: number): number {
  return thicknessMm * COVER_MATERIAL_ARMOR[material].multiplier;
}

export function resolveVehicleCoverArmor(options: VehicleCoverOptions): number {
  const throughVehicleMultiplier = options.attackPassesThroughVehicle ? 2 : 1;
  const engineBonus = options.usingEngineBlock ? 12 : 0;

  return options.armor * throughVehicleMultiplier + engineBonus;
}