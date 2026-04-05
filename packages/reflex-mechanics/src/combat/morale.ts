import type { CharacterHealthState, CharacterId, EncumbranceLevel, InjurySeverity } from '../types';
import { computeMargin } from './initiative';

export const MORALE_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.157-161';

export type AmbushMode = 'standard' | 'social' | 'maneuver' | 'urbanManeuver';

export type AmbushDetectionMode = 'casualObservation' | 'activeScan';

export type ThreatConditionKey =
  | 'combatOccurring'
  | 'personallyAttacked'
  | 'attackedWithLethalForce'
  | 'enemyUsingAutomaticWeapons'
  | 'enemyUsingExplosives'
  | 'enemyUsingIncendiaries'
  | 'enemyObviouslyIrrational'
  | 'enemyChargingMountedVehicleOrLargeAnimal'
  | 'ambushed'
  | 'fightingInDarkness'
  | 'outnumberedTwoToOne'
  | 'cannotSeeEnemy'
  | 'cannotReachOrHarmEnemy'
  | 'enemySuperiorPosition'
  | 'enemySuperiorArmament'
  | 'enemySuperiorMobility'
  | 'escapeImpossible'
  | 'suppressedAreaExposure';

export interface AmbushSetupResolution {
  setupTimeMinutes: number;
  skill: 'tactics' | 'deception' | 'fieldcraft' | 'streetcraft';
  attribute: 'cognition';
  penalty: number;
}

export interface AmbushDetectionResolution {
  skill: 'awareness' | 'tactics' | 'personality';
  attribute: 'awareness' | 'personality';
  margin: number;
  detected: boolean;
  mayAvoid: boolean;
  surprised: boolean;
}

export interface SurpriseResolution {
  baseInitiativeOverride: number;
  surprised: boolean;
}

export interface ThreatCondition {
  key: ThreatConditionKey | (string & {});
  count: number;
}

export interface MoraleState {
  threatLevel: number;
  effectiveCuf: number;
  penalty: number;
  broken: boolean;
}

export interface CasualtyThreatInput {
  groupSize: number;
  casualties: number;
  teamLeaderCasualty?: boolean;
}

export interface SuppressiveFireResolution {
  maximumWidthMeters: number;
  threatRating: number;
}

export interface SuppressedExposureResolution {
  threatIncrease: number;
  grantsFreeShot: boolean;
}

export interface IntimidationResolution {
  presentedThreatConditions: number;
  totalThreatLevel: number;
  margin: number;
  penalty: number;
  broken: boolean;
}

export interface PanicFireResolution {
  effectiveCufBonus: number;
}

const INJURY_THREAT_BY_SEVERITY: Record<InjurySeverity, number> = {
  none: 0,
  slight: 1,
  moderate: 2,
  serious: 3,
  critical: 4,
  drt: 4,
  dead: 4,
};

export function getAmbushSetupResolution(options: {
  mode?: AmbushMode;
  participantCount: number;
  vehicleCount?: number;
  unskilledCount?: number;
  motorizedVehicleCount?: number;
  teamOrderSucceeded?: boolean;
  reactionDrill?: boolean;
}): AmbushSetupResolution {
  const mode = options.mode ?? 'standard';
  const participantCount = Math.max(0, options.participantCount);

  if (options.reactionDrill && options.teamOrderSucceeded) {
    return {
      setupTimeMinutes: 0,
      skill: mode === 'social'
        ? 'deception'
        : mode === 'maneuver'
          ? 'fieldcraft'
          : mode === 'urbanManeuver'
            ? 'streetcraft'
            : 'tactics',
      attribute: 'cognition',
      penalty: (options.vehicleCount ?? 0) + (options.unskilledCount ?? 0),
    };
  }

  const setupTimeMinutes = options.teamOrderSucceeded ? 1 : participantCount;
  const skill = mode === 'social'
    ? 'deception'
    : mode === 'maneuver'
      ? 'fieldcraft'
      : mode === 'urbanManeuver'
        ? 'streetcraft'
        : 'tactics';
  const vehiclePenalty = mode === 'maneuver' || mode === 'urbanManeuver'
    ? (options.motorizedVehicleCount ?? 0)
    : (options.vehicleCount ?? 0);
  const participantPenalty = mode === 'social'
    ? Math.max(0, participantCount - 1)
    : 0;

  return {
    setupTimeMinutes,
    skill,
    attribute: 'cognition',
    penalty: vehiclePenalty + (options.unskilledCount ?? 0) + participantPenalty,
  };
}

export function resolveAmbushDetection(
  ambusherResult: number,
  defenderRoll: number,
  detectionMode: AmbushDetectionMode,
  social = false,
): AmbushDetectionResolution {
  const margin = computeMargin(defenderRoll, ambusherResult);
  const detected = margin > 0;
  const active = detectionMode === 'activeScan';

  return {
    skill: active ? 'tactics' : social ? 'personality' : 'awareness',
    attribute: active ? 'awareness' : social ? 'personality' : 'awareness',
    margin,
    detected,
    mayAvoid: detected && active,
    surprised: !detected,
  };
}

export function resolveSurprise(isSurprised: boolean): SurpriseResolution {
  return {
    baseInitiativeOverride: isSurprised ? 0 : -1,
    surprised: isSurprised,
  };
}

export function getThreatFromInjury(severity: InjurySeverity): number {
  return INJURY_THREAT_BY_SEVERITY[severity];
}

export function getThreatFromHealthState(health: CharacterHealthState): number {
  const mostSevereInjury = Object.values(health.injuries).reduce<InjurySeverity>(
    (worst, track) => INJURY_THREAT_BY_SEVERITY[track.effective] > INJURY_THREAT_BY_SEVERITY[worst] ? track.effective : worst,
    'none',
  );

  return getThreatFromInjury(mostSevereInjury);
}

export function getThreatFromConditions(conditions: ThreatCondition[]): number {
  return conditions.reduce((total, condition) => total + Math.max(0, condition.count), 0);
}

export function getCasualtyThreat(input: CasualtyThreatInput): number {
  const groupSize = Math.max(1, input.groupSize);
  const casualties = Math.max(0, input.casualties);

  if (casualties <= 0) {
    return input.teamLeaderCasualty ? 1 : 0;
  }

  const lossRatio = casualties / groupSize;
  const additionalThreat = Math.max(0, Math.ceil((lossRatio - 0.25) / 0.25));

  return 1 + additionalThreat + (input.teamLeaderCasualty ? 1 : 0);
}

export function getLifesavingThreat(severity: InjurySeverity): number {
  return getThreatFromInjury(severity);
}

export function resolveMorale(cuf: number, conditions: ThreatCondition[], cufBoost = 0): MoraleState {
  const threatLevel = getThreatFromConditions(conditions);
  const effectiveCuf = cuf + cufBoost;
  const penalty = Math.max(0, threatLevel - effectiveCuf);

  return {
    threatLevel,
    effectiveCuf,
    penalty,
    broken: penalty >= 5,
  };
}

export function getSuppressiveFireResolution(options: {
  roundsFired: number;
  usesExplosives?: boolean;
  usesTracer?: boolean;
}): SuppressiveFireResolution {
  const baseThreat = options.roundsFired <= 5 ? 1 : 2;
  const bonusThreat = options.usesExplosives || options.usesTracer ? 1 : 0;

  return {
    maximumWidthMeters: options.roundsFired / 2,
    threatRating: baseThreat + bonusThreat,
  };
}

export function resolveSuppressedAreaExposure(
  threatRating: number,
  attackerStillSuppressing: boolean,
  exposedBeforeNextAction: boolean,
): SuppressedExposureResolution {
  return {
    threatIncrease: Math.max(0, threatRating),
    grantsFreeShot: attackerStillSuppressing && exposedBeforeNextAction,
  };
}

export function resolveIntimidation(
  marginOfSuccess: number,
  subjectResolve: number,
  extraConditions: ThreatCondition[] = [],
): IntimidationResolution {
  const presentedThreatConditions = Math.max(0, marginOfSuccess);
  const totalThreatLevel = presentedThreatConditions + getThreatFromConditions(extraConditions);
  const penalty = Math.max(0, totalThreatLevel - subjectResolve);

  return {
    presentedThreatConditions,
    totalThreatLevel,
    margin: marginOfSuccess,
    penalty,
    broken: penalty >= 5,
  };
}

export function getTangoDownCufBonus(threatsRemovedByActor: number, codeForbidsKill = false): number {
  const magnitude = Math.min(3, Math.max(0, threatsRemovedByActor));
  return codeForbidsKill ? -magnitude : magnitude;
}

export function resolvePanicFire(options: {
  roundsFired?: number;
  explosionRadius?: number;
  explosiveAutomaticWeapon?: boolean;
}): PanicFireResolution {
  const bulletBonus = Math.floor(Math.max(0, options.roundsFired ?? 0) / 2);
  const explosionBonus = Math.floor(Math.max(0, options.explosionRadius ?? 0) / 2);

  return {
    effectiveCufBonus: options.explosiveAutomaticWeapon ? Math.max(bulletBonus, explosionBonus) : bulletBonus || explosionBonus,
  };
}

export function getMorphineInjuryThreat(severity: InjurySeverity): number {
  return severity === 'critical' || severity === 'drt' || severity === 'dead' ? 4 : 0;
}

export function resolveCommandMoraleBoost(marginOfSuccess: number): number {
  return Math.max(1, marginOfSuccess);
}

export function getBrokenCombatLimits(): {
  allowedActions: ReadonlyArray<'flee' | 'selfFirstAid' | 'communicate' | 'cower'>;
  mustHoldAtExchangeEnd: true;
  automaticallyFailsOpposedSocialChecks: true;
} {
  return {
    allowedActions: ['flee', 'selfFirstAid', 'communicate', 'cower'],
    mustHoldAtExchangeEnd: true,
    automaticallyFailsOpposedSocialChecks: true,
  };
}

export function getTeamworkCufBonus(isOnTeam: boolean, bonus = 1): number {
  return isOnTeam ? bonus : 0;
}