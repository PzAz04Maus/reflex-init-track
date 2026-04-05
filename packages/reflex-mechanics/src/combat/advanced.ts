import type { RangeBandName } from '../rangeBands';

export const ADVANCED_COMBAT_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.161-166';

export type DamageSourceClass = 'normalImpact' | 'explosion' | 'fire';

export type MineType = 'apMine' | 'atMine' | 'ied';

export type MineDetonationMode = 'pressure' | 'tripwireOrDirectional' | 'command';

export type CommandDetonationMethod = 'mechanicalOrElectronic' | 'fuse';

export interface ActionResolutionWindow {
  startTick: number;
  tickCost: number;
  endTick: number;
}

export interface ArmorDegradationResolution {
  penetrated: boolean;
  armorLoss: number;
}

export interface ConfinedSpaceExplosionResolution {
  adjustedRadiusMeters: number;
  blastMultiplier: number;
  fragMultiplier: number;
  containment: 'none' | 'partial' | 'total';
}

export interface HandUseResolution {
  penalty: number;
  impossible: boolean;
}

export interface DualFireResolution {
  canAttack: boolean;
  attackMode: 'hip' | null;
  penaltyPerAttack: number;
}

export interface OffHandCloseCombatResolution {
  blockBonus: number;
  coordinatedAttackBonus: number;
}

export interface IndirectFireCallResolution {
  initialAttackPenalty: number;
  landsAtEndOfCurrentPhase: true;
}

export interface IndirectFireAdjustmentResolution {
  adjustmentReduction: number;
  updatedPenalty: number;
}

export interface MineEmplacementResolution {
  timeMinutes: number;
  concealmentBonus: number;
  armed: boolean;
  accidentalDetonation: boolean;
}

export interface MinefieldDetonationResolution {
  detonationChance: number;
  detonates: boolean;
}

export interface ChokePointDetonationResolution {
  detonates: boolean;
  triggerThreshold: number;
}

export interface CommandDetonationResolution {
  actionTickCost: number;
  detonationDelayTicks: number;
  requiresTimingCheck: boolean;
  timingCheckModifier: number;
}

export interface SustainedFireResolution {
  tickCostReduction: number;
  tracerAttackBonus: number;
}

const INDIRECT_FIRE_DEVIATION_FACTOR: Record<RangeBandName, number> = {
  Personal: 0,
  Gunfighting: 0.5,
  CQB: 1,
  Tight: 2,
  Medium: 3,
  Open: 5,
  Sniping: 8,
  Extreme: 10,
};

export function getActionResolutionWindow(startTick: number, tickCost: number): ActionResolutionWindow {
  return {
    startTick,
    tickCost,
    endTick: startTick - tickCost,
  };
}

export function resolvesBefore(left: ActionResolutionWindow, right: ActionResolutionWindow): boolean {
  return left.endTick > right.endTick;
}

export function isActionInterrupted(
  pendingAction: ActionResolutionWindow,
  interruptingAction: ActionResolutionWindow,
): boolean {
  return resolvesBefore(interruptingAction, pendingAction);
}

export function getArmorDegradation(
  rawDamage: number,
  penetrationModifiedArmor: number,
  penetratingDamage: number,
  sourceClass: DamageSourceClass,
): ArmorDegradationResolution {
  if (rawDamage <= penetrationModifiedArmor || penetratingDamage <= 0) {
    return {
      penetrated: false,
      armorLoss: 0,
    };
  }

  return {
    penetrated: true,
    armorLoss: sourceClass === 'normalImpact' ? 1 : Math.ceil(penetratingDamage / 2),
  };
}

export function resolveBlastKnockdown(finalBlastDamage: number, muscleCheckMargin: number): boolean {
  const effectivePenalty = Math.floor(finalBlastDamage / 2);
  return muscleCheckMargin - effectivePenalty <= 0;
}

export function resolveConfinedSpaceExplosion(
  radiusMeters: number,
  dimensionsMeters: number[],
  weakestSurfaceArmor?: number,
  blast?: number,
): ConfinedSpaceExplosionResolution {
  const requiredSpan = radiusMeters * 2;
  const deficits = dimensionsMeters
    .map((dimension) => Math.max(0, requiredSpan - dimension))
    .filter((deficit) => deficit > 0);
  const adjustedRadiusMeters = deficits.length > 0 && deficits.length <= 2
    ? radiusMeters + deficits.reduce((total, deficit) => total + deficit, 0)
    : radiusMeters;

  const longestDimension = dimensionsMeters.length > 0 ? Math.max(...dimensionsMeters) : Number.POSITIVE_INFINITY;
  if (weakestSurfaceArmor === undefined || blast === undefined || longestDimension >= requiredSpan) {
    return {
      adjustedRadiusMeters,
      blastMultiplier: 1,
      fragMultiplier: 1,
      containment: 'none',
    };
  }

  if (blast > weakestSurfaceArmor) {
    return {
      adjustedRadiusMeters,
      blastMultiplier: 2,
      fragMultiplier: 2,
      containment: 'partial',
    };
  }

  return {
    adjustedRadiusMeters,
    blastMultiplier: 4,
    fragMultiplier: 4,
    containment: 'total',
  };
}

export function resolveHandUse(options: {
  usesNonDominantHand: boolean;
  fineMotorControl?: boolean;
  twoHandedActionWithOneHand?: boolean;
  leverageRequired?: boolean;
  monthsOfRetraining?: number;
}): HandUseResolution {
  if (options.leverageRequired) {
    return {
      penalty: 0,
      impossible: true,
    };
  }

  const retrainingReduction = Math.floor(Math.max(0, options.monthsOfRetraining ?? 0) / 2);
  const nonDominantBasePenalty = options.usesNonDominantHand
    ? (options.fineMotorControl ? 4 : 2)
    : 0;
  const nonDominantPenalty = Math.max(0, nonDominantBasePenalty - retrainingReduction);
  const oneHandPenalty = options.twoHandedActionWithOneHand ? 3 : 0;

  return {
    penalty: -(nonDominantPenalty + oneHandPenalty),
    impossible: false,
  };
}

export function resolveDualGunAttack(sameTarget: boolean): DualFireResolution {
  return {
    canAttack: true,
    attackMode: 'hip',
    penaltyPerAttack: sameTarget ? -2 : -4,
  };
}

export function resolveOffHandCloseCombat(offHandBulk: number, hasAmbidexterity: boolean): OffHandCloseCombatResolution {
  const bonus = hasAmbidexterity ? 1 + offHandBulk : 0;

  return {
    blockBonus: bonus,
    coordinatedAttackBonus: bonus,
  };
}

export function getUnarmedArmPenalty(leftArmPenalty: number, rightArmPenalty: number): number {
  return Math.max(leftArmPenalty, rightArmPenalty);
}

export function getIndirectFireCallResolution(observerMarginOfSuccess: number): IndirectFireCallResolution {
  return {
    initialAttackPenalty: -Math.max(5, 15 - observerMarginOfSuccess),
    landsAtEndOfCurrentPhase: true,
  };
}

export function resolveIndirectFireAdjustment(
  currentPenalty: number,
  observerMarginOfSuccess: number,
): IndirectFireAdjustmentResolution {
  const adjustmentReduction = observerMarginOfSuccess >= 5 ? 2 : observerMarginOfSuccess > 0 ? 1 : 0;

  return {
    adjustmentReduction,
    updatedPenalty: adjustmentReduction > 0 ? Math.min(-5, currentPenalty + adjustmentReduction) : currentPenalty,
  };
}

export function getIndirectFireDeviationDistance(rangeBand: RangeBandName, marginOfFailure: number, pastExtreme = false): number {
  if (pastExtreme) {
    return Math.max(0, marginOfFailure) * 20;
  }

  return Math.max(0, marginOfFailure) * INDIRECT_FIRE_DEVIATION_FACTOR[rangeBand];
}

export function getSelfObservedIndirectPenalty(previousAttacksAtTarget: number): number {
  return -10 + (Math.max(0, previousAttacksAtTarget) * 2);
}

export function resolveMineEmplacement(options: {
  mineType: MineType;
  margin: number;
  openPlacement?: boolean;
  iedDetonationRoll?: number;
}): MineEmplacementResolution {
  const baseMinutes = options.mineType === 'atMine' ? 15 : 3;
  const timeMinutes = options.openPlacement ? baseMinutes / 3 : baseMinutes;
  const concealmentBonus = options.openPlacement ? 3 : 0;

  if (options.margin > 0) {
    return {
      timeMinutes,
      concealmentBonus,
      armed: true,
      accidentalDetonation: false,
    };
  }

  if (options.mineType === 'ied') {
    const accidentalDetonation = (options.iedDetonationRoll ?? 10) <= Math.abs(options.margin);
    return {
      timeMinutes,
      concealmentBonus,
      armed: false,
      accidentalDetonation,
    };
  }

  return {
    timeMinutes,
    concealmentBonus,
    armed: false,
    accidentalDetonation: Math.abs(options.margin) >= 10,
  };
}

export function resolveMinefieldDetonation(
  densityPerTenSquareMeters: number,
  distanceMeters: number,
  roll: number,
  targetClass: 'character' | 'vehicle',
): MinefieldDetonationResolution {
  const detonationChance = densityPerTenSquareMeters * distanceMeters;
  const alwaysSafe = targetClass === 'vehicle' ? roll >= 20 : roll >= 96;

  return {
    detonationChance,
    detonates: !alwaysSafe && roll <= detonationChance,
  };
}

export function resolveChokePointMine(
  emplacementMarginOfSuccess: number,
  roll: number,
  mode: Exclude<MineDetonationMode, 'command'>,
): ChokePointDetonationResolution {
  const triggerThreshold = Math.max(1, emplacementMarginOfSuccess);
  const dieSize = mode === 'pressure' ? 20 : 10;

  return {
    detonates: roll >= 1 && roll <= Math.min(dieSize, triggerThreshold),
    triggerThreshold,
  };
}

export function resolveCommandDetonation(
  method: CommandDetonationMethod,
  preciseTimingAgainstMovingTarget = false,
  fuseBurnTicks = 0,
): CommandDetonationResolution {
  if (method === 'mechanicalOrElectronic') {
    return {
      actionTickCost: 2,
      detonationDelayTicks: 0,
      requiresTimingCheck: preciseTimingAgainstMovingTarget,
      timingCheckModifier: preciseTimingAgainstMovingTarget ? -1 : 0,
    };
  }

  return {
    actionTickCost: 5,
    detonationDelayTicks: 1 + Math.max(0, fuseBurnTicks),
    requiresTimingCheck: preciseTimingAgainstMovingTarget,
    timingCheckModifier: preciseTimingAgainstMovingTarget ? -1 : 0,
  };
}

export function getStandardMineDurability(mineType: Exclude<MineType, 'ied'>): { bulk: number; armor: number; damageThreshold: number } {
  return mineType === 'apMine'
    ? { bulk: 1, armor: 3, damageThreshold: 4 }
    : { bulk: 3, armor: 4, damageThreshold: 7 };
}

export function getDisabledMineDetonationChance(): number {
  return 0.5;
}

export function getMovedDisabledMineDetonationChance(): number {
  return 0.25;
}

export function resolveSustainedFire(consecutiveAttacksOnSameTarget: number, usingTracer = false): SustainedFireResolution {
  if (consecutiveAttacksOnSameTarget <= 1) {
    return {
      tickCostReduction: 0,
      tracerAttackBonus: 0,
    };
  }

  return {
    tickCostReduction: 1,
    tracerAttackBonus: usingTracer ? consecutiveAttacksOnSameTarget - 1 : 0,
  };
}