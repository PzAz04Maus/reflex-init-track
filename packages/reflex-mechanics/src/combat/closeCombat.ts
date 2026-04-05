export const CLOSE_COMBAT_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.148-151';

export type CloseCombatRange = 'personal';

export type CloseCombatMovementRate = 'stationary' | 'trot' | 'run' | 'sprint';

export type CloseCombatTargetScale = '1/4' | '1/2' | '1x' | '2x' | '4x' | '8x';

export type GrappleActionKey = 'attack' | 'block' | 'communicate' | 'readyItem' | 'wait';

export type CloseCombatControlOption =
  | 'increaseControl'
  | 'complianceHold'
  | 'disarm'
  | 'attack'
  | 'chokeOut';

export interface CloseCombatWeaponProfileLike {
  damage: number;
  penetration: string;
  speed: string;
  bulk: number;
  edged?: boolean;
  unarmed?: boolean;
}

export interface CloseCombatSpeedProfile {
  blindStrike: number;
  standard: number;
  aimed: number;
}

export interface BlockResolution {
  canAttempt: boolean;
  tickCost: number;
  netMargin: number;
  attackStopped: boolean;
}

export interface ControlPenaltyResolution {
  generalPenalty: number;
  againstControllerPenalty: number;
}

export interface DivingStrikeResolution {
  attackModifier: number;
  damageBonus: number;
  controlBonus: number;
  targetMustResistProne: boolean;
  attackerStayUprightPenalty: number;
}

export interface ControlMovementResolution {
  canMove: boolean;
  metersMoved: number;
  netMargin: number;
}

export interface ControlUseResolution {
  allowed: boolean;
  attackBonus?: number;
  overflowCalledStrikeReduction?: number;
  threatConditions?: number;
  disarmHandsFreed?: 1 | 2;
}

export interface GunFuResolution {
  canAttack: boolean;
  attackAttribute: 'muscle';
  rangeTickCostModifier: number;
  canBeBlocked: boolean;
  divingStrikeDamageBonus: number;
}

export interface PersonalRangeWeaponUse {
  canAttack: boolean;
  notes: string[];
}

export const BARE_HAND_WEAPON_PROFILE: CloseCombatWeaponProfileLike = {
  damage: 0,
  penetration: 'Nil',
  speed: '1/2/4',
  bulk: 0,
  unarmed: true,
};

export const CLOSE_COMBAT_SIZE_MODIFIER: Record<CloseCombatTargetScale, number> = {
  '1/4': -4,
  '1/2': -2,
  '1x': 0,
  '2x': 2,
  '4x': 4,
  '8x': 5,
};

const DIVING_STRIKE_MODIFIER: Record<CloseCombatMovementRate, number> = {
  stationary: 0,
  trot: -1,
  run: -2,
  sprint: -3,
};

const CONTROL_OPTION_MINIMUM: Record<CloseCombatControlOption, number> = {
  increaseControl: 1,
  complianceHold: 2,
  disarm: 4,
  attack: 4,
  chokeOut: 0,
};

export function parseCloseCombatSpeed(speed: string): CloseCombatSpeedProfile {
  const [blindStrike, standard, aimed] = speed.split('/').map((part) => Number.parseInt(part, 10));

  return {
    blindStrike,
    standard,
    aimed,
  };
}

export function getCloseCombatSizeModifier(scale: CloseCombatTargetScale = '1x'): number {
  return CLOSE_COMBAT_SIZE_MODIFIER[scale];
}

export function getBlockTickCost(speed: string | CloseCombatSpeedProfile): number {
  const profile = typeof speed === 'string' ? parseCloseCombatSpeed(speed) : speed;
  return 1 + profile.blindStrike;
}

export function resolveBlock(
  attackDeclaredTick: number,
  blockDeclaredTick: number,
  weaponSpeed: string | CloseCombatSpeedProfile,
  attackerMargin: number,
  defenderMargin: number,
): BlockResolution {
  const canAttempt = blockDeclaredTick >= attackDeclaredTick - 1 && blockDeclaredTick <= attackDeclaredTick;
  const netMargin = defenderMargin - attackerMargin;

  return {
    canAttempt,
    tickCost: getBlockTickCost(weaponSpeed),
    netMargin,
    attackStopped: canAttempt && netMargin > 0,
  };
}

export function getBareHandedBlockVsEdgedSelfInjuryChance(
  defenderUsesBareHands: boolean,
  attackerWeaponIsEdged: boolean,
): number {
  return defenderUsesBareHands && attackerWeaponIsEdged ? 0.5 : 0;
}

export function getWeaponBlockVsUnarmedInjuryChance(
  defenderUsesWeapon: boolean,
  attackerIsUnarmed: boolean,
): number {
  return defenderUsesWeapon && attackerIsUnarmed ? 0.5 : 0;
}

export function resolveDivingStrike(
  movementRate: Exclude<CloseCombatMovementRate, 'stationary'>,
  attackSucceeded: boolean,
): DivingStrikeResolution {
  const attackModifier = DIVING_STRIKE_MODIFIER[movementRate];
  const damageBonus = Math.abs(attackModifier) * 2;
  const controlBonus = Math.abs(attackModifier);

  return {
    attackModifier,
    damageBonus,
    controlBonus,
    targetMustResistProne: true,
    attackerStayUprightPenalty: attackSucceeded ? attackModifier : attackModifier * 2,
  };
}

export function getGrappleSkillLevelPenalty(isQualifiedForGrapple: boolean): number {
  return isQualifiedForGrapple ? 0 : -3;
}

export function resolveGrappleControl(marginOfSuccess: number, divingControlBonus = 0): number {
  if (marginOfSuccess <= 0) {
    return 0;
  }

  return marginOfSuccess + divingControlBonus;
}

export function canMaintainControl(actionKey: GrappleActionKey, declaredHoldAtExchangeEnd: boolean): boolean {
  return !declaredHoldAtExchangeEnd && ['attack', 'block', 'communicate', 'readyItem', 'wait'].includes(actionKey);
}

export function getControlPenalty(totalControl: number): ControlPenaltyResolution {
  return {
    generalPenalty: Math.floor(totalControl / 2),
    againstControllerPenalty: Math.floor(Math.floor(totalControl / 2) / 2),
  };
}

export function resolveControlledMovement(victimMargin: number, controllerMargin: number): ControlMovementResolution {
  const netMargin = victimMargin - controllerMargin;

  return {
    canMove: netMargin > 0,
    metersMoved: Math.max(0, netMargin),
    netMargin,
  };
}

export function resolveControlUse(
  option: Exclude<CloseCombatControlOption, 'chokeOut'>,
  currentControl: number,
  attackMargin = 0,
): ControlUseResolution {
  const minimumControl = CONTROL_OPTION_MINIMUM[option];

  if (currentControl < minimumControl) {
    return { allowed: false };
  }

  if (option === 'increaseControl') {
    return { allowed: true };
  }

  if (option === 'complianceHold') {
    return {
      allowed: true,
      attackBonus: Math.floor(currentControl / 2),
      threatConditions: Math.floor(attackMargin / 2),
    };
  }

  if (option === 'disarm') {
    return {
      allowed: true,
      disarmHandsFreed: attackMargin >= 5 ? 2 : 1,
    };
  }

  return {
    allowed: true,
    attackBonus: Math.min(currentControl, 5),
    overflowCalledStrikeReduction: Math.max(0, currentControl - 5),
  };
}

export function resolveChokeOut(
  currentControl: number,
  victimMuscle: number,
  victimFitnessSucceeded: boolean,
): 'unconscious' | 'dead' | 'head-worsens' | 'insufficient-control' {
  const minimumControl = victimMuscle + 3;

  if (currentControl <= 0) {
    return 'insufficient-control';
  }

  if (currentControl < minimumControl) {
    return 'head-worsens';
  }

  return victimFitnessSucceeded ? 'unconscious' : 'dead';
}

export function resolveEscapeAttempt(currentControl: number, marginOfSuccess: number): number {
  return Math.max(0, currentControl - Math.max(0, marginOfSuccess));
}

export function resolveGunFuAttack(
  firearmRangeTickCostModifier: number,
): GunFuResolution {
  return {
    canAttack: true,
    attackAttribute: 'muscle',
    rangeTickCostModifier: firearmRangeTickCostModifier,
    canBeBlocked: true,
    divingStrikeDamageBonus: 0,
  };
}

export function resolvePersonalRangeWeaponUse(
  weaponClass: 'firearm' | 'crossbow' | 'bow' | 'heavyWeapon' | 'thrownWeapon' | 'grenade' | 'thrownMeleeWeapon',
): PersonalRangeWeaponUse {
  if (weaponClass === 'firearm' || weaponClass === 'crossbow') {
    return {
      canAttack: true,
      notes: ['Uses Muscle instead of Coordination.', 'Target may attempt a Block action.'],
    };
  }

  if (weaponClass === 'heavyWeapon') {
    return {
      canAttack: false,
      notes: ['Heavy weapons automatically fail at Personal range.'],
    };
  }

  if (weaponClass === 'bow' || weaponClass === 'thrownWeapon') {
    return {
      canAttack: false,
      notes: ['This weapon class is not usable for ranged attacks at Personal range.'],
    };
  }

  if (weaponClass === 'grenade') {
    return {
      canAttack: false,
      notes: ['A live grenade can be readied, activated, and ditched without making an attack.'],
    };
  }

  return {
    canAttack: true,
    notes: ['This item functions as a standard close combat weapon at Personal range.'],
  };
}