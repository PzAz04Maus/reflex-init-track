import type { EncumbranceLevel, HitLocation, InjurySeverity } from '../types';
import { worsenInjurySeverity } from './damage';

export const HAZARD_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.154-157';

export type ExplosionEffectZone = 'contact' | 'primary' | 'secondary' | 'outside';

export type FireSource =
  | 'paperFire'
  | 'brushFire'
  | 'houseFire'
  | 'forestFire'
  | 'blowtorch'
  | 'magnesiumFlare'
  | 'whitePhosphorus'
  | 'thermite'
  | 'campfire'
  | 'aviationFuelFire';

export type FireSize =
  | 'pinpoint'
  | 'candleFlame'
  | 'torch'
  | 'campfire'
  | 'humanSized'
  | 'smallVehicle'
  | 'largeVehicle'
  | 'structure'
  | 'completeEnvelopment';

export type FireProtectionClass = 'bodyArmor' | 'protectiveGear' | 'vehicleOrStructure';

export type ImpactProtectionClass = 'softArmor' | 'helmet' | 'rigidArmor';

export type WindSpeed = 'mild' | 'moderate' | 'strong' | 'majorStorm';

export interface ExplosiveProfile {
  damage: number;
  radiusMeters: number;
  blast: number;
  frag: number;
}

export interface ExplosionZoneResolution {
  zone: ExplosionEffectZone;
  withinPrimaryRadius: boolean;
  withinSecondaryRadius: boolean;
}

export interface ExplosionDirectHitResolution {
  damage: number;
  penetration: 'x1';
}

export interface ExplosionBlastResolution {
  damage: number;
  penetration: 'x2' | 'x3' | null;
  applies: boolean;
}

export interface FragmentHit {
  roll: number;
  damage: number;
  penetration: 'x2' | 'Nil';
}

export interface FragmentationResolution {
  applies: boolean;
  hitCount: number;
  hits: FragmentHit[];
  luckyBreaks: number;
  missedByZone: number;
}

export interface FireProfile {
  temperatureC: number;
  damage: number;
}

export interface ImpactResolution {
  damagePerHit: number;
  avoidancePenalty: number;
}

export interface ImpactFailureResolution {
  hitCount: number;
  damagePerHit: number;
}

export interface BreathHoldingResolution {
  exchangesBeforeDeprivation: number;
  deprivationBeginsThisExchange: boolean;
}

export interface OxygenDeprivationResolution {
  nextSeverity: InjurySeverity;
  unconscious: boolean;
  dead: boolean;
}

export interface GasCloudProgression {
  currentRadiusMeters: number;
  downwindExtensionPerExchangeMeters: number;
  maximumDownwindExtensionMeters: number;
  durationExchanges: number;
}

const FIRE_PROFILES: Record<FireSource, FireProfile> = {
  paperFire: { temperatureC: 230, damage: 1 },
  brushFire: { temperatureC: 500, damage: 2 },
  houseFire: { temperatureC: 600, damage: 3 },
  forestFire: { temperatureC: 800, damage: 4 },
  blowtorch: { temperatureC: 1300, damage: 7 },
  magnesiumFlare: { temperatureC: 1800, damage: 9 },
  whitePhosphorus: { temperatureC: 2000, damage: 10 },
  thermite: { temperatureC: 2500, damage: 12 },
  campfire: { temperatureC: 1000, damage: 5 },
  aviationFuelFire: { temperatureC: 1200, damage: 6 },
};

const FIRE_SIZE_TN_MODIFIER: Record<FireSize, number> = {
  pinpoint: 4,
  candleFlame: 3,
  torch: 2,
  campfire: 0,
  humanSized: 1,
  smallVehicle: -1,
  largeVehicle: -2,
  structure: -3,
  completeEnvelopment: -5,
};

const IMPACT_ENCUMBRANCE_DAMAGE_MODIFIER: Record<EncumbranceLevel, number> = {
  unencumbered: 0,
  light: 0,
  moderate: 1,
  heavy: 2,
  overloaded: 4,
};

const GAS_DISPERSION_DURATION: Record<WindSpeed, number> = {
  mild: 4,
  moderate: 2,
  strong: 1,
  majorStorm: 0,
};

export function getExplosionEffectZone(distanceMeters: number, radiusMeters: number): ExplosionZoneResolution {
  if (distanceMeters <= 0) {
    return {
      zone: 'contact',
      withinPrimaryRadius: true,
      withinSecondaryRadius: true,
    };
  }

  if (distanceMeters < radiusMeters) {
    return {
      zone: 'primary',
      withinPrimaryRadius: true,
      withinSecondaryRadius: true,
    };
  }

  if (distanceMeters <= radiusMeters * 2) {
    return {
      zone: 'secondary',
      withinPrimaryRadius: false,
      withinSecondaryRadius: true,
    };
  }

  return {
    zone: 'outside',
    withinPrimaryRadius: false,
    withinSecondaryRadius: false,
  };
}

export function resolveExplosionDirectHit(profile: Pick<ExplosiveProfile, 'damage'>, marginOfSuccess: number): ExplosionDirectHitResolution {
  return {
    damage: profile.damage + marginOfSuccess,
    penetration: 'x1',
  };
}

export function getDirectHitPrimaryAffectedLocations(
  directHitLocation: HitLocation,
  exposedLocations: HitLocation[],
): HitLocation[] {
  return exposedLocations.filter((location) => location !== directHitLocation);
}

export function resolveExplosionBlast(
  profile: Pick<ExplosiveProfile, 'blast'>,
  marginOfSuccess: number,
  zone: ExplosionEffectZone,
): ExplosionBlastResolution {
  const primaryBlastDamage = profile.blast + marginOfSuccess;

  if (primaryBlastDamage <= 0 || zone === 'outside') {
    return {
      damage: 0,
      penetration: null,
      applies: false,
    };
  }

  if (zone === 'contact' || zone === 'primary') {
    return {
      damage: primaryBlastDamage,
      penetration: 'x2',
      applies: true,
    };
  }

  return {
    damage: Math.floor(primaryBlastDamage / 2),
    penetration: 'x3',
    applies: true,
  };
}

export function resolveExplosionFragmentation(
  frag: number,
  zone: ExplosionEffectZone,
  rolls: number[],
): FragmentationResolution {
  if (zone === 'outside' || frag <= 0) {
    return {
      applies: false,
      hitCount: 0,
      hits: [],
      luckyBreaks: 0,
      missedByZone: 0,
    };
  }

  const usesD20 = zone === 'secondary';
  const baseDamage = usesD20 ? 4 : 6;
  const penetration: 'x2' | 'Nil' = usesD20 ? 'Nil' : 'x2';
  const relevantRolls = rolls.slice(0, Math.max(0, frag));
  const hits: FragmentHit[] = [];
  let luckyBreaks = 0;

  for (const roll of relevantRolls) {
    if (roll <= 5) {
      hits.push({
        roll,
        damage: baseDamage + roll,
        penetration,
      });
      continue;
    }

    luckyBreaks += 1;
  }

  return {
    applies: true,
    hitCount: hits.length,
    hits,
    luckyBreaks,
    missedByZone: Math.max(0, frag - relevantRolls.length),
  };
}

export function getFireProfile(source: FireSource): FireProfile {
  return FIRE_PROFILES[source];
}

export function getFireAvoidanceModifier(size: FireSize): number {
  return FIRE_SIZE_TN_MODIFIER[size];
}

export function getFirePenetration(targetClass: FireProtectionClass): 'x1/2' | 'x2' {
  return targetClass === 'vehicleOrStructure' ? 'x2' : 'x1/2';
}

export function resolveFireExposure(source: FireSource, size: FireSize) {
  return {
    ...getFireProfile(source),
    avoidanceModifier: getFireAvoidanceModifier(size),
  };
}

export function getImpactPenetration(targetClass: ImpactProtectionClass): 'x1' | 'x2' {
  return targetClass === 'rigidArmor' ? 'x1' : 'x2';
}

export function resolveFallingImpact(distanceMeters: number, encumbrance: EncumbranceLevel = 'unencumbered'): ImpactResolution {
  return {
    damagePerHit: Math.max(0, distanceMeters + IMPACT_ENCUMBRANCE_DAMAGE_MODIFIER[encumbrance]),
    avoidancePenalty: -Math.max(0, distanceMeters),
  };
}

export function resolveVehicleCollisionImpact(weightTons: number, speedKph: number): ImpactResolution {
  const closingSpeedSteps = Math.floor(speedKph / 10);

  return {
    damagePerHit: Math.max(0, (weightTons + speedKph) / 10),
    avoidancePenalty: -Math.max(0, closingSpeedSteps),
  };
}

export function resolveImpactFailure(damagePerHit: number, marginOfFailure: number): ImpactFailureResolution {
  return {
    hitCount: Math.max(0, marginOfFailure),
    damagePerHit,
  };
}

export function resolveBreathHolding(marginOfSuccess: number, prepared = false): BreathHoldingResolution {
  const effectiveMargin = prepared ? marginOfSuccess + 4 : marginOfSuccess;
  const exchangesBeforeDeprivation = Math.max(0, Math.floor(effectiveMargin / 2));

  return {
    exchangesBeforeDeprivation,
    deprivationBeginsThisExchange: exchangesBeforeDeprivation === 0,
  };
}

export function advanceOxygenDeprivation(currentSeverity: InjurySeverity | 'none'): OxygenDeprivationResolution {
  const nextSeverity = currentSeverity === 'none'
    ? 'slight'
    : currentSeverity === 'critical'
      ? 'dead'
      : worsenInjurySeverity(currentSeverity);

  return {
    nextSeverity,
    unconscious: nextSeverity === 'critical' || currentSeverity === 'critical',
    dead: nextSeverity === 'dead' || nextSeverity === 'drt',
  };
}

export function restoreBreathingSeverity(previousSeverity: InjurySeverity): InjurySeverity {
  if (previousSeverity === 'dead' || previousSeverity === 'drt') {
    return previousSeverity;
  }

  return previousSeverity === 'none' ? 'none' : 'slight';
}

export function getGasDispersionDuration(windSpeed: WindSpeed): number {
  return GAS_DISPERSION_DURATION[windSpeed];
}

export function resolveGasCloudProgression(initialRadiusMeters: number, windSpeed: WindSpeed): GasCloudProgression {
  const downwindExtensionPerExchangeMeters = initialRadiusMeters * 2;
  const durationExchanges = getGasDispersionDuration(windSpeed);

  return {
    currentRadiusMeters: initialRadiusMeters,
    downwindExtensionPerExchangeMeters,
    maximumDownwindExtensionMeters: downwindExtensionPerExchangeMeters * durationExchanges,
    durationExchanges,
  };
}

export function getEnclosedGasRadius(initialRadiusMeters: number): number {
  return initialRadiusMeters * 2;
}

export function getEnclosedGasDispersionDuration(minutesRoll: number): number {
  return Math.max(1, minutesRoll);
}