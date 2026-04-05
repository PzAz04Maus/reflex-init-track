import type {
  CharacterHealthState,
  CharacterRecord,
  CharacterData,
  HitLocation,
  InjuryTrack,
  InjuryRecord,
  InjurySeverity,
  TacticalMovementRate,
  WoundThresholdProfile,
} from '../types';

export const DAMAGE_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp.151-154';

export type ProtectionPenetration = 'Nil' | 'x1/2' | 'x1' | 'x2' | 'x3' | 'x4' | 'x5' | (string & {});

export type EquipmentMaterial =
  | 'paper'
  | 'potteryGlass'
  | 'electronicComponents'
  | 'leather'
  | 'rubber'
  | 'softWood'
  | 'bone'
  | 'hardPlastic'
  | 'aluminum'
  | 'hardWood'
  | 'polymer'
  | 'stone'
  | 'iron'
  | 'steel'
  | 'titanium';

export interface InjuryPenaltyProfile {
  skillPenalty: number;
  physicalOnly: boolean;
  immediateMuscleCheck?: {
    modifier: number;
    onFailure: 'drop-held-item' | 'fall-prone';
  };
  movementCap?: TacticalMovementRate;
  armUnusable?: boolean;
  legUnusable?: boolean;
  unconscious?: boolean;
  automaticShock: boolean;
  shockCheckRequired: boolean;
  unstableCheckRequired: boolean;
  unstableOnFailureMarginGreaterThan?: number;
  catastrophicAmputationThreshold?: number;
}

export interface AppliedProtection {
  printedArmor: number;
  penetration: number;
  effectiveArmor: number;
  damage: number;
  finalDamage: number;
  stopped: boolean;
}

export interface InjuryResolution {
  location: HitLocation;
  damage: number;
  severity: InjurySeverity;
  thresholds: WoundThresholdProfile;
  penalty: InjuryPenaltyProfile;
}

export interface InstabilityResolution {
  injuries: InjuryRecord[];
  bleedsOut: boolean;
  headCausedUnconsciousness: boolean;
}

export interface EquipmentDurabilityProfile {
  armor: number;
  damageThreshold: number;
}

export interface EquipmentDamageResolution {
  damage: number;
  threshold: number;
  wearGained: number;
  disabled: boolean;
  destroyed: boolean;
  cosmeticOnly: boolean;
  instantDestroyed: boolean;
}

export interface CharacterDamageResolution {
  health: CharacterHealthState;
  previousSeverity: InjurySeverity;
  effectiveSeverity: InjurySeverity;
  enteredShock: boolean;
  becameUnstable: boolean;
  becameUnconscious: boolean;
  died: boolean;
  injury: InjuryResolution;
}

export interface ApplyInjuryOptions {
  virtual?: boolean;
  fitnessCheckSucceeded?: boolean;
  fitnessMargin?: number;
}

export interface DerivedHealthCombatEffects {
  mostSevereInjury: InjurySeverity;
  allActionsPenalty: number;
  physicalActionsPenalty: number;
  movementCap: TacticalMovementRate | null;
}

const INJURY_ORDER: InjurySeverity[] = ['none', 'slight', 'moderate', 'serious', 'critical', 'drt', 'dead'];

const LIMB_LOCATIONS: HitLocation[] = ['leftArm', 'rightArm', 'leftLeg', 'rightLeg'];

const EQUIPMENT_DURABILITY_BY_MATERIAL: Record<EquipmentMaterial, { armor: number; thresholdModifier: number }> = {
  paper: { armor: 0, thresholdModifier: 0 },
  potteryGlass: { armor: 0, thresholdModifier: 1 },
  electronicComponents: { armor: 0, thresholdModifier: 1 },
  leather: { armor: 1, thresholdModifier: 1 },
  rubber: { armor: 1, thresholdModifier: 1 },
  softWood: { armor: 2, thresholdModifier: 2 },
  bone: { armor: 2, thresholdModifier: 2 },
  hardPlastic: { armor: 2, thresholdModifier: 2 },
  aluminum: { armor: 3, thresholdModifier: 1 },
  hardWood: { armor: 3, thresholdModifier: 3 },
  polymer: { armor: 3, thresholdModifier: 3 },
  stone: { armor: 4, thresholdModifier: 3 },
  iron: { armor: 4, thresholdModifier: 3 },
  steel: { armor: 4, thresholdModifier: 4 },
  titanium: { armor: 5, thresholdModifier: 5 },
};

function createInjuryTrack(location: HitLocation): InjuryTrack {
  return {
    location,
    actual: 'none',
    virtual: 'none',
    effective: 'none',
  };
}

function createInjuryTracks(): Record<HitLocation, InjuryTrack> {
  return {
    head: createInjuryTrack('head'),
    torso: createInjuryTrack('torso'),
    leftArm: createInjuryTrack('leftArm'),
    rightArm: createInjuryTrack('rightArm'),
    leftLeg: createInjuryTrack('leftLeg'),
    rightLeg: createInjuryTrack('rightLeg'),
  };
}

function recalculateEffectiveTrack(track: InjuryTrack): InjuryTrack {
  return {
    ...track,
    effective: getWorseInjurySeverity(track.actual, track.virtual),
  };
}

function worsenForInstability(severity: InjurySeverity): InjurySeverity {
  if (severity === 'none' || severity === 'dead' || severity === 'drt') {
    return severity;
  }

  if (severity === 'critical') {
    return 'dead';
  }

  return worsenInjurySeverity(severity);
}

function clampSeverityIndex(index: number): number {
  return Math.max(0, Math.min(index, INJURY_ORDER.length - 1));
}

export function getBaseWoundThreshold(data: Pick<CharacterData, 'fitness' | 'muscle'>): number {
  return Math.floor((10 + data.muscle + (2 * data.fitness)) / 4);
}

export function getWoundThresholds(baseWoundThreshold: number, location: HitLocation, useDeadRightThere = false): WoundThresholdProfile {
  const thresholds: WoundThresholdProfile = {
    slight: 1,
    moderate: location === 'head' ? Math.max(1, Math.floor(baseWoundThreshold / 2)) : baseWoundThreshold,
    serious: location === 'torso'
      ? baseWoundThreshold * 2
      : location === 'head'
        ? baseWoundThreshold
        : Math.floor(baseWoundThreshold * 1.5),
    critical: location === 'torso'
      ? baseWoundThreshold * 3
      : location === 'head'
        ? Math.floor(baseWoundThreshold * 1.5)
        : baseWoundThreshold * 2,
  };

  if (useDeadRightThere && (location === 'head' || location === 'torso')) {
    thresholds.drt = thresholds.critical + baseWoundThreshold;
  }

  return thresholds;
}

export function getAllWoundThresholds(
  data: Pick<CharacterData, 'fitness' | 'muscle'>,
  useDeadRightThere = false,
): Record<HitLocation, WoundThresholdProfile> {
  const base = getBaseWoundThreshold(data);

  return {
    head: getWoundThresholds(base, 'head', useDeadRightThere),
    torso: getWoundThresholds(base, 'torso', useDeadRightThere),
    leftArm: getWoundThresholds(base, 'leftArm', useDeadRightThere),
    rightArm: getWoundThresholds(base, 'rightArm', useDeadRightThere),
    leftLeg: getWoundThresholds(base, 'leftLeg', useDeadRightThere),
    rightLeg: getWoundThresholds(base, 'rightLeg', useDeadRightThere),
  };
}

export function createCharacterHealthState(
  data: Pick<CharacterData, 'fitness' | 'muscle'>,
  useDeadRightThere = false,
): CharacterHealthState {
  const baseWoundThreshold = getBaseWoundThreshold(data);

  return {
    baseWoundThreshold,
    thresholdsByLocation: getAllWoundThresholds(data, useDeadRightThere),
    injuries: createInjuryTracks(),
    inShock: false,
    unstable: false,
    unconscious: false,
    dead: false,
  };
}

export function ensureCharacterHealthState(
  character: Pick<CharacterRecord, 'data'> & { health?: CharacterHealthState },
  useDeadRightThere = false,
): CharacterHealthState {
  return character.health ?? createCharacterHealthState(character.data, useDeadRightThere);
}

export function parsePenetrationMultiplier(penetration: ProtectionPenetration): number {
  const normalized = penetration.trim().toLowerCase();

  if (normalized === 'nil' || normalized === '-') {
    return 0;
  }

  if (normalized === 'x1/2' || normalized === 'x0.5' || normalized === 'x½') {
    return 0.5;
  }

  const match = /^x(\d+(?:\.\d+)?)$/.exec(normalized);
  if (match) {
    return Number.parseFloat(match[1]);
  }

  return 1;
}

export function applyProtection(
  damage: number,
  printedArmor: number,
  penetration: ProtectionPenetration,
): AppliedProtection {
  const penetrationMultiplier = parsePenetrationMultiplier(penetration);
  const effectiveArmor = printedArmor <= 0 ? 0 : penetrationMultiplier === 0 ? Number.POSITIVE_INFINITY : printedArmor * penetrationMultiplier;
  const finalDamage = Number.isFinite(effectiveArmor) ? Math.max(0, damage - effectiveArmor) : 0;

  return {
    printedArmor,
    penetration: penetrationMultiplier,
    effectiveArmor,
    damage,
    finalDamage,
    stopped: finalDamage <= 0,
  };
}

export function resolveInjurySeverity(damage: number, thresholds: WoundThresholdProfile): InjurySeverity {
  if (thresholds.drt !== undefined && damage >= thresholds.drt) {
    return 'drt';
  }

  if (damage >= thresholds.critical) {
    return 'critical';
  }

  if (damage >= thresholds.serious) {
    return 'serious';
  }

  if (damage >= thresholds.moderate) {
    return 'moderate';
  }

  if (damage >= thresholds.slight) {
    return 'slight';
  }

  return 'none';
}

export function worsenInjurySeverity(severity: InjurySeverity, steps = 1): InjurySeverity {
  return INJURY_ORDER[clampSeverityIndex(INJURY_ORDER.indexOf(severity) + steps)];
}

export function getWorseInjurySeverity(left: InjurySeverity, right: InjurySeverity): InjurySeverity {
  return INJURY_ORDER[Math.max(INJURY_ORDER.indexOf(left), INJURY_ORDER.indexOf(right))];
}

export function getInjuryPenalty(location: HitLocation, severity: InjurySeverity, criticalDamage = 0): InjuryPenaltyProfile {
  if (severity === 'none') {
    return {
      skillPenalty: 0,
      physicalOnly: false,
      automaticShock: false,
      shockCheckRequired: false,
      unstableCheckRequired: false,
    };
  }

  if (severity === 'drt' || severity === 'dead') {
    return {
      skillPenalty: 99,
      physicalOnly: false,
      unconscious: true,
      automaticShock: true,
      shockCheckRequired: false,
      unstableCheckRequired: false,
    };
  }

  const basePenalty = severity === 'slight' ? -1 : severity === 'moderate' ? -2 : severity === 'serious' ? -3 : -4;
  const automaticShock = severity === 'critical';
  const shockCheckRequired = severity === 'moderate' || severity === 'serious';
  const unstableCheckRequired = severity === 'moderate' || severity === 'serious' || severity === 'critical';

  if (location === 'head') {
    return {
      skillPenalty: basePenalty,
      physicalOnly: false,
      unconscious: severity === 'critical',
      automaticShock,
      shockCheckRequired,
      unstableCheckRequired,
      unstableOnFailureMarginGreaterThan: shockCheckRequired ? 5 : undefined,
    };
  }

  if (location === 'torso') {
    return {
      skillPenalty: basePenalty,
      physicalOnly: true,
      automaticShock,
      shockCheckRequired,
      unstableCheckRequired,
      unstableOnFailureMarginGreaterThan: shockCheckRequired ? 5 : undefined,
    };
  }

  if (location === 'leftArm' || location === 'rightArm') {
    return {
      skillPenalty: basePenalty,
      physicalOnly: false,
      immediateMuscleCheck: severity === 'moderate'
        ? { modifier: 0, onFailure: 'drop-held-item' }
        : severity === 'serious'
          ? { modifier: -2, onFailure: 'drop-held-item' }
          : undefined,
      armUnusable: severity === 'critical',
      automaticShock,
      shockCheckRequired,
      unstableCheckRequired,
      unstableOnFailureMarginGreaterThan: shockCheckRequired ? 5 : undefined,
      catastrophicAmputationThreshold: severity === 'critical' ? criticalDamage * 2 : undefined,
    };
  }

  return {
    skillPenalty: basePenalty,
    physicalOnly: false,
    immediateMuscleCheck: severity === 'moderate'
      ? { modifier: 0, onFailure: 'fall-prone' }
      : severity === 'serious'
        ? { modifier: -2, onFailure: 'fall-prone' }
        : undefined,
    movementCap: severity === 'slight'
      ? 'run'
      : severity === 'moderate'
        ? 'walk'
        : severity === 'serious'
          ? 'stagger'
          : 'crawl',
    legUnusable: severity === 'critical',
    automaticShock,
    shockCheckRequired,
    unstableCheckRequired,
    unstableOnFailureMarginGreaterThan: shockCheckRequired ? 5 : undefined,
    catastrophicAmputationThreshold: severity === 'critical' ? criticalDamage * 2 : undefined,
  };
}

export function resolveDamageToLocation(
  location: HitLocation,
  damage: number,
  thresholds: WoundThresholdProfile,
): InjuryResolution {
  const severity = resolveInjurySeverity(damage, thresholds);

  return {
    location,
    damage,
    severity,
    thresholds,
    penalty: getInjuryPenalty(location, severity, thresholds.critical),
  };
}

export function resolveInstabilityCycle(injuries: InjuryRecord[]): InstabilityResolution {
  const worsened = injuries.map((injury) => ({
    ...injury,
    severity: injury.severity === 'none' ? 'none' : worsenInjurySeverity(injury.severity),
  }));
  const bleedsOut = worsened.some((injury) => injury.severity === 'dead' || injury.severity === 'drt');
  const headCausedUnconsciousness = injuries.some((injury) => injury.location === 'head' && injury.severity !== 'none');

  return {
    injuries: worsened,
    bleedsOut,
    headCausedUnconsciousness,
  };
}

export function getMostSevereInjury(health: CharacterHealthState): InjurySeverity {
  return Object.values(health.injuries).reduce<InjurySeverity>(
    (worst, track) => getWorseInjurySeverity(worst, track.effective),
    'none',
  );
}

export function getDerivedHealthCombatEffects(health: CharacterHealthState): DerivedHealthCombatEffects {
  const tracks = Object.values(health.injuries);
  const headPenalty = tracks
    .filter((track) => track.location === 'head')
    .reduce((penalty, track) => Math.min(penalty, getInjuryPenalty(track.location, track.effective).skillPenalty), 0);
  const torsoPenalty = tracks
    .filter((track) => track.location === 'torso')
    .reduce((penalty, track) => Math.min(penalty, getInjuryPenalty(track.location, track.effective).skillPenalty), 0);
  const legCaps = tracks
    .filter((track) => track.location === 'leftLeg' || track.location === 'rightLeg')
    .map((track) => getInjuryPenalty(track.location, track.effective).movementCap)
    .filter((cap): cap is TacticalMovementRate => cap !== undefined);
  const movementPriority: TacticalMovementRate[] = ['crawl', 'stagger', 'walk', 'trot', 'run', 'sprint'];
  const movementCap = legCaps.length === 0
    ? null
    : legCaps.reduce<TacticalMovementRate>(
      (slowest, current) => (
        movementPriority.indexOf(current) < movementPriority.indexOf(slowest) ? current : slowest
      ),
      legCaps[0],
    );

  return {
    mostSevereInjury: getMostSevereInjury(health),
    allActionsPenalty: headPenalty,
    physicalActionsPenalty: Math.min(headPenalty, torsoPenalty),
    movementCap,
  };
}

export function applyResolvedInjuryToHealth(
  health: CharacterHealthState,
  injury: InjuryResolution,
  options: ApplyInjuryOptions = {},
): CharacterDamageResolution {
  const existingTrack = health.injuries[injury.location] ?? createInjuryTrack(injury.location);
  const updatedTrack = recalculateEffectiveTrack({
    ...existingTrack,
    actual: options.virtual ? existingTrack.actual : getWorseInjurySeverity(existingTrack.actual, injury.severity),
    virtual: options.virtual ? getWorseInjurySeverity(existingTrack.virtual, injury.severity) : existingTrack.virtual,
  });
  const penalty = getInjuryPenalty(injury.location, updatedTrack.effective, injury.thresholds.critical);
  const enteredShock = penalty.automaticShock || (penalty.shockCheckRequired && options.fitnessCheckSucceeded === false);
  const becameUnstable = penalty.unstableCheckRequired
    && options.fitnessCheckSucceeded === false
    && (injury.severity === 'critical'
      || Math.abs(options.fitnessMargin ?? 0) > (penalty.unstableOnFailureMarginGreaterThan ?? Number.POSITIVE_INFINITY));
  const unstable = health.unstable || becameUnstable;
  const unconscious = health.unconscious
    || penalty.unconscious === true
    || (injury.location === 'head' && unstable)
    || updatedTrack.effective === 'drt'
    || updatedTrack.effective === 'dead';
  const dead = health.dead || updatedTrack.effective === 'drt' || updatedTrack.effective === 'dead';
  const nextHealth: CharacterHealthState = {
    ...health,
    injuries: {
      ...health.injuries,
      [injury.location]: updatedTrack,
    },
    inShock: health.inShock || enteredShock,
    unstable,
    unconscious,
    dead,
  };

  return {
    health: nextHealth,
    previousSeverity: existingTrack.effective,
    effectiveSeverity: updatedTrack.effective,
    enteredShock: !health.inShock && nextHealth.inShock,
    becameUnstable: !health.unstable && nextHealth.unstable,
    becameUnconscious: !health.unconscious && nextHealth.unconscious,
    died: !health.dead && nextHealth.dead,
    injury,
  };
}

export function resolveDamageToCharacter(
  character: Pick<CharacterRecord, 'data'> & { health?: CharacterHealthState },
  location: HitLocation,
  damage: number,
  options: ApplyInjuryOptions & { useDeadRightThere?: boolean } = {},
): CharacterDamageResolution {
  const health = ensureCharacterHealthState(character, options.useDeadRightThere ?? false);
  const injury = resolveDamageToLocation(location, damage, health.thresholdsByLocation[location]);

  return applyResolvedInjuryToHealth(health, injury, options);
}

export function setVirtualInjurySeverity(
  health: CharacterHealthState,
  location: HitLocation,
  severity: InjurySeverity,
): CharacterHealthState {
  const updatedTrack = recalculateEffectiveTrack({
    ...(health.injuries[location] ?? createInjuryTrack(location)),
    virtual: severity,
  });

  return {
    ...health,
    injuries: {
      ...health.injuries,
      [location]: updatedTrack,
    },
    unconscious: health.unconscious || (location === 'head' && updatedTrack.effective === 'critical'),
    dead: health.dead || updatedTrack.effective === 'dead' || updatedTrack.effective === 'drt',
  };
}

export function advanceHealthInstability(health: CharacterHealthState): CharacterHealthState {
  if (!health.unstable || health.dead) {
    return health;
  }

  const injuries = Object.fromEntries(
    Object.entries(health.injuries).map(([location, track]) => {
      const worsenedTrack = recalculateEffectiveTrack({
        ...track,
        actual: worsenForInstability(track.actual),
      });

      return [location, worsenedTrack];
    }),
  ) as Record<HitLocation, InjuryTrack>;

  const dead = Object.values(injuries).some((track) => track.actual === 'dead' || track.effective === 'dead');
  const unconscious = dead || health.unconscious || injuries.head.effective === 'critical' || injuries.head.effective === 'dead';

  return {
    ...health,
    injuries,
    unconscious,
    dead,
  };
}

export function isLimbLocation(location: HitLocation): boolean {
  return LIMB_LOCATIONS.includes(location);
}

export function isLessLethalHandledAsNormalAttack(): true {
  return true;
}

export function getEquipmentDurability(material: EquipmentMaterial, bulk: number): EquipmentDurabilityProfile {
  const profile = EQUIPMENT_DURABILITY_BY_MATERIAL[material];

  return {
    armor: profile.armor,
    damageThreshold: bulk + profile.thresholdModifier,
  };
}

export function resolveEquipmentDamage(
  damage: number,
  damageThreshold: number,
  alreadyDisabled = false,
): EquipmentDamageResolution {
  const instantDestroyed = damage >= damageThreshold * 2;

  if (instantDestroyed) {
    return {
      damage,
      threshold: damageThreshold,
      wearGained: 0,
      disabled: true,
      destroyed: true,
      cosmeticOnly: false,
      instantDestroyed: true,
    };
  }

  if (damage < damageThreshold) {
    return {
      damage,
      threshold: damageThreshold,
      wearGained: 0,
      disabled: alreadyDisabled,
      destroyed: false,
      cosmeticOnly: true,
      instantDestroyed: false,
    };
  }

  return {
    damage,
    threshold: damageThreshold,
    wearGained: 1,
    disabled: true,
    destroyed: alreadyDisabled,
    cosmeticOnly: false,
    instantDestroyed: false,
  };
}