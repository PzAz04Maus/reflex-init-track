import type { ActionCadence, ActionState, ActionStatus, CharacterId } from './types';

export const COMBAT_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp. 137-142';

export type CombatPhase = 'exchange' | 'pause' | 'ended';
export type PressHoldChoice = 'press' | 'hold';
export type EncumbranceLevel = 'overloaded' | 'heavy' | 'moderate' | 'light' | 'unencumbered';
export type Stance = 'standing' | 'kneeling' | 'sitting' | 'prone';
export type TacticalMovementRate = 'sprint' | 'run' | 'trot' | 'walk' | 'stagger' | 'crawl';

export type CombatActionKey =
  | 'activateEquipment'
  | 'assess'
  | 'attack'
  | 'block'
  | 'changeStance'
  | 'communicateSimple'
  | 'ditchItem'
  | 'move'
  | 'readyOrStowItem'
  | 'reload'
  | 'wait'
  | 'communicateComplex'
  | 'donOrDoffClothing'
  | 'fieldRepair'
  | 'keepWatch'
  | 'renderAid'
  | 'resetWeapons'
  | 'setHastyAmbush'
  | 'useEquipment'
  | 'withdraw'
  | 'pauseMovement';

export interface CombatActionDefinition {
  key: CombatActionKey;
  name: string;
  cadence: ActionCadence;
  category: string;
  defaultCost: number;
  costLabel: string;
  summary: string;
  detail?: string;
  tags: string[];
  source: string;
}

export interface CreateCombatActionOptions {
  id?: string;
  name?: string;
  cost?: number;
  summary?: string;
  detail?: string;
  status?: ActionStatus;
  declaredTick?: number | null;
  resolvedTick?: number | null;
  tags?: string[];
  metadata?: ActionState['metadata'];
}

export interface InitiativeComputation {
  baseInitiative: number;
  pressBonus: number;
  roll: number;
  target: number;
  margin: number;
  succeeded: boolean;
  initiative: number;
}

export interface ExchangeParticipantInput {
  actorId: CharacterId;
  encumbrance: EncumbranceLevel;
  ooda: number;
  roll: number;
  pressed?: boolean;
}

export interface ExchangeParticipantState extends InitiativeComputation {
  actorId: CharacterId;
}

export interface ExchangeStartResult {
  startingTick: number;
  participants: ExchangeParticipantState[];
}

export interface ExchangeContinuationChoice {
  actorId: CharacterId;
  choice: PressHoldChoice;
  broken?: boolean;
}

export interface ExchangeContinuationResult {
  nextPhase: CombatPhase;
  pressBonusByActorId: Record<CharacterId, number>;
  normalizedChoices: Array<ExchangeContinuationChoice & { finalChoice: PressHoldChoice }>;
}

export interface PauseContinuationChoice {
  actorId: CharacterId;
  choice: PressHoldChoice;
  cuf: number;
  roll?: number;
  broken?: boolean;
}

export interface PauseContinuationOutcome {
  actorId: CharacterId;
  declaredChoice: PressHoldChoice;
  finalChoice: PressHoldChoice;
  cufPenalty: number;
  forcedToPress: boolean;
  pressBonus: number;
  margin: number | null;
  succeeded: boolean | null;
}

export interface PauseContinuationResult {
  nextPhase: CombatPhase;
  outcomes: PauseContinuationOutcome[];
}

export const ENCUMBRANCE_BASE_INITIATIVE: Record<EncumbranceLevel, number> = {
  overloaded: 5,
  heavy: 7,
  moderate: 9,
  light: 12,
  unencumbered: 15,
};

export const WAIT_TICK_COST_BY_OODA: ReadonlyArray<{ min: number; cost: number }> = [
  { min: 15, cost: 1 },
  { min: 13, cost: 2 },
  { min: 10, cost: 3 },
  { min: 7, cost: 4 },
  { min: 4, cost: 5 },
  { min: 1, cost: 6 },
];

export const PAUSE_MOVEMENT_MULTIPLIER = 10;
export const MOVE_TACTICAL_TICK_COST = 5;

export const STANCE_EFFECTS: Record<Stance, string[]> = {
  standing: [
    'Default stance.',
    'No movement restriction.',
    'Standard target profile.',
  ],
  kneeling: [
    'Ranged attacks against the character suffer -1.',
    'Close combat attacks against the character gain +1.',
    'Movement is limited to walk or stagger.',
    'Movement penalties to actions are doubled.',
    'Gain +1 Muscle for resisting recoil.',
  ],
  sitting: [
    'The character may not move.',
    'If not in a vehicle or mounted, the character counts as a stationary target.',
    'Gain +2 Muscle for resisting recoil.',
  ],
  prone: [
    'Effective visual range against the character increases by one range band.',
    'Close combat attacks against the character gain +2.',
    'Movement is limited to crawl.',
    'Ranged attacks to side or rear have doubled tick cost.',
    'Double Muscle for resisting recoil.',
  ],
};

export const TACTICAL_MOVEMENT_EFFECTS: Record<TacticalMovementRate, string[]> = {
  sprint: [
    'Requires unencumbered status and no leg injury.',
    'Fine motor control actions suffer -5.',
    'Ranged attacks against the mover suffer -3.',
  ],
  run: [
    'Requires no leg injury worse than slight and no more than light encumbrance.',
    'Fine motor control actions suffer -3.',
    'Ranged attacks against the mover suffer -2.',
  ],
  trot: [
    'Requires no leg injury worse than slight and no more than moderate encumbrance.',
    'Fine motor control actions suffer -2.',
    'Ranged attacks against the mover suffer -1.',
  ],
  walk: [
    'Used when moderately injured or heavily encumbered.',
    'Fine motor control actions suffer -1.',
  ],
  stagger: [
    'Used when seriously injured, kneeling, or overloaded.',
    'Fine motor control actions suffer -1.',
  ],
  crawl: [
    'Used when prone or unable to stand safely.',
    'Fine motor control actions suffer -4.',
  ],
};

export const COMBAT_ACTIONS: Record<CombatActionKey, CombatActionDefinition> = {
  activateEquipment: {
    key: 'activateEquipment',
    name: 'Activate/Deactivate Equipment',
    cadence: 'tactical',
    category: 'equipment',
    defaultCost: 1,
    costLabel: '1 tick',
    summary: 'Toggle simple on/off equipment in the middle of an exchange.',
    tags: ['equipment', 'toggle'],
    source: COMBAT_RULES_SOURCE,
  },
  assess: {
    key: 'assess',
    name: 'Assess',
    cadence: 'tactical',
    category: 'observation',
    defaultCost: 1,
    costLabel: '1 to 6 ticks',
    summary: 'Pause to consciously observe the battlefield and gather detail.',
    detail: 'The acting character may voluntarily spend up to 5 extra ticks for a cumulative bonus.',
    tags: ['awareness', 'observation'],
    source: COMBAT_RULES_SOURCE,
  },
  attack: {
    key: 'attack',
    name: 'Attack',
    cadence: 'tactical',
    category: 'attack',
    defaultCost: 0,
    costLabel: 'weapon speed',
    summary: 'Make a ranged or close combat attack using the selected weapon profile.',
    detail: 'Detailed attack resolution starts in the next subsection and is intentionally left to attack-specific rules.',
    tags: ['combat', 'weapon'],
    source: COMBAT_RULES_SOURCE,
  },
  block: {
    key: 'block',
    name: 'Block',
    cadence: 'tactical',
    category: 'defense',
    defaultCost: 1,
    costLabel: '1 tick + blind strike speed',
    summary: 'Deflect a close combat attack with a weapon or guard.',
    tags: ['close-combat', 'defense'],
    source: COMBAT_RULES_SOURCE,
  },
  changeStance: {
    key: 'changeStance',
    name: 'Change Stance',
    cadence: 'tactical',
    category: 'posture',
    defaultCost: 2,
    costLabel: '2 ticks lower, 4 ticks higher',
    summary: 'Shift between standing, kneeling, sitting, and prone stances.',
    tags: ['stance', 'movement'],
    source: COMBAT_RULES_SOURCE,
  },
  communicateSimple: {
    key: 'communicateSimple',
    name: 'Communicate (Simple)',
    cadence: 'tactical',
    category: 'communication',
    defaultCost: 1,
    costLabel: '1, 3, or 5 ticks',
    summary: 'Deliver a short command or warning while rounds are flying.',
    detail: 'Using a device control such as a radio transmit button adds 1 tick.',
    tags: ['speech', 'teamwork'],
    source: COMBAT_RULES_SOURCE,
  },
  ditchItem: {
    key: 'ditchItem',
    name: 'Ditch Item',
    cadence: 'tactical',
    category: 'equipment',
    defaultCost: 0,
    costLabel: '0 ticks or situational',
    summary: 'Drop or violently shed gear to free hands or remove danger.',
    detail: 'Connected gear uses half the normal ready time, while clothing or rigs may consume the rest of the exchange.',
    tags: ['equipment', 'encumbrance'],
    source: COMBAT_RULES_SOURCE,
  },
  move: {
    key: 'move',
    name: 'Move',
    cadence: 'tactical',
    category: 'movement',
    defaultCost: MOVE_TACTICAL_TICK_COST,
    costLabel: '5 ticks',
    summary: 'Cover tactical distance, reposition, mount, or dismount during an exchange.',
    detail: 'A move can be paired with one additional tactical action costing 5 ticks or less.',
    tags: ['movement', 'positioning'],
    source: COMBAT_RULES_SOURCE,
  },
  readyOrStowItem: {
    key: 'readyOrStowItem',
    name: 'Ready/Stow Item',
    cadence: 'tactical',
    category: 'equipment',
    defaultCost: 1,
    costLabel: 'item bulk, minimum 1',
    summary: 'Bring gear into hand or put it away so it can be used later.',
    detail: 'Secured storage, deep containers, and one-handed handling increase cost.',
    tags: ['equipment', 'inventory'],
    source: COMBAT_RULES_SOURCE,
  },
  reload: {
    key: 'reload',
    name: 'Reload',
    cadence: 'tactical',
    category: 'equipment',
    defaultCost: 1,
    costLabel: 'weapon bulk, minimum 1',
    summary: 'Replenish ammunition during an exchange.',
    detail: 'Internal magazines load 3 rounds per action, while support weapons use slower special handling.',
    tags: ['weapon', 'ammo'],
    source: COMBAT_RULES_SOURCE,
  },
  wait: {
    key: 'wait',
    name: 'Wait',
    cadence: 'tactical',
    category: 'timing',
    defaultCost: 3,
    costLabel: 'based on OODA',
    summary: 'Delay briefly instead of acting immediately on the current tick.',
    tags: ['timing', 'initiative'],
    source: COMBAT_RULES_SOURCE,
  },
  communicateComplex: {
    key: 'communicateComplex',
    name: 'Communicate (Complex)',
    cadence: 'operational',
    category: 'communication',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Negotiate, issue substantial orders, or make a focused radio call during a pause.',
    tags: ['speech', 'teamwork'],
    source: COMBAT_RULES_SOURCE,
  },
  donOrDoffClothing: {
    key: 'donOrDoffClothing',
    name: 'Don/Doff Clothing',
    cadence: 'operational',
    category: 'equipment',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Put on or remove one major clothing or gear grouping with care rather than panic.',
    tags: ['equipment', 'encumbrance'],
    source: COMBAT_RULES_SOURCE,
  },
  fieldRepair: {
    key: 'fieldRepair',
    name: 'Field Repair',
    cadence: 'operational',
    category: 'repair',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Apply emergency repair work to restore disabled gear or vehicle systems temporarily.',
    tags: ['repair', 'equipment'],
    source: COMBAT_RULES_SOURCE,
  },
  keepWatch: {
    key: 'keepWatch',
    name: 'Keep Watch',
    cadence: 'operational',
    category: 'observation',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Hold position and watch the enemy during the lull.',
    tags: ['awareness', 'overwatch'],
    source: COMBAT_RULES_SOURCE,
  },
  renderAid: {
    key: 'renderAid',
    name: 'Render Aid',
    cadence: 'operational',
    category: 'medical',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Attempt emergency medical stabilization or resuscitation.',
    tags: ['medical', 'support'],
    source: COMBAT_RULES_SOURCE,
  },
  resetWeapons: {
    key: 'resetWeapons',
    name: 'Reset Weapons',
    cadence: 'operational',
    category: 'equipment',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Fully reload and normalize personal weapons during a pause.',
    tags: ['weapon', 'ammo'],
    source: COMBAT_RULES_SOURCE,
  },
  setHastyAmbush: {
    key: 'setHastyAmbush',
    name: 'Set Hasty Ambush',
    cadence: 'operational',
    category: 'tactics',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Set up a concealed immediate plan to gain initiative in the next exchange.',
    tags: ['tactics', 'initiative'],
    source: COMBAT_RULES_SOURCE,
  },
  useEquipment: {
    key: 'useEquipment',
    name: 'Use Equipment',
    cadence: 'operational',
    category: 'equipment',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Handle a short technical task such as lockpicking, hot-wiring, or setting charges.',
    tags: ['equipment', 'task'],
    source: COMBAT_RULES_SOURCE,
  },
  withdraw: {
    key: 'withdraw',
    name: 'Withdraw',
    cadence: 'operational',
    category: 'movement',
    defaultCost: 0,
    costLabel: 'entire pause',
    summary: 'Attempt to break contact and leave the fight cleanly.',
    tags: ['movement', 'escape'],
    source: COMBAT_RULES_SOURCE,
  },
  pauseMovement: {
    key: 'pauseMovement',
    name: 'Pause Movement',
    cadence: 'free',
    category: 'movement',
    defaultCost: 0,
    costLabel: 'free during pause',
    summary: 'Move up to ten tactical move distances before the operational action begins.',
    tags: ['movement', 'pause'],
    source: COMBAT_RULES_SOURCE,
  },
};

export function getBaseInitiative(encumbrance: EncumbranceLevel): number {
  return ENCUMBRANCE_BASE_INITIATIVE[encumbrance];
}

export function computeMargin(roll: number, target: number): number {
  return target - roll;
}

export function computeOodaAdjustedInit(
  baseInit: number,
  roll: number,
  target: number,
  pressBonus = 0,
): number {
  const margin = computeMargin(roll, target);
  return baseInit + pressBonus + (margin > 0 ? margin * 2 : 0);
}

export function computeInitiative(
  encumbrance: EncumbranceLevel,
  roll: number,
  target: number,
  pressed = false,
): InitiativeComputation {
  const baseInitiative = getBaseInitiative(encumbrance);
  const pressBonus = pressed ? 5 : 0;
  const margin = computeMargin(roll, target);
  const succeeded = margin > 0;
  return {
    baseInitiative,
    pressBonus,
    roll,
    target,
    margin,
    succeeded,
    initiative: computeOodaAdjustedInit(baseInitiative, roll, target, pressBonus),
  };
}

export function startExchange(participants: ExchangeParticipantInput[]): ExchangeStartResult {
  const exchangeParticipants = participants.map((participant) => ({
    actorId: participant.actorId,
    ...computeInitiative(
      participant.encumbrance,
      participant.roll,
      participant.ooda,
      participant.pressed ?? false,
    ),
  }));
  const startingTick = exchangeParticipants.length === 0
    ? 0
    : Math.max(...exchangeParticipants.map((participant) => participant.initiative));
  return { startingTick, participants: exchangeParticipants };
}

export function getWaitTickCost(ooda: number): number {
  const matchingBand = WAIT_TICK_COST_BY_OODA.find((band) => ooda >= band.min);
  return matchingBand?.cost ?? 6;
}

export function getChangeStanceTickCost(from: Stance, to: Stance): number {
  if (from === to) {
    return 0;
  }
  const tier: Record<Stance, number> = {
    standing: 0,
    kneeling: 1,
    sitting: 1,
    prone: 2,
  };
  if (tier[to] > tier[from]) {
    return 2 * (tier[to] - tier[from]);
  }
  if (tier[to] < tier[from]) {
    return 4 * (tier[from] - tier[to]);
  }
  return 2;
}

export function getPauseMovementDistance(tacticalMoveDistance: number): number {
  return tacticalMoveDistance * PAUSE_MOVEMENT_MULTIPLIER;
}

export function resolveExchangeContinuation(
  choices: ExchangeContinuationChoice[],
): ExchangeContinuationResult {
  const normalizedChoices = choices.map((choice) => ({
    ...choice,
    finalChoice: choice.broken ? 'hold' : choice.choice,
  }));
  const anyPress = normalizedChoices.some((choice) => choice.finalChoice === 'press');
  return {
    nextPhase: anyPress ? 'exchange' : 'pause',
    pressBonusByActorId: Object.fromEntries(
      normalizedChoices.map((choice) => [choice.actorId, choice.finalChoice === 'press' ? 5 : 0]),
    ),
    normalizedChoices,
  };
}

export function resolvePauseContinuation(
  choices: PauseContinuationChoice[],
  pausesSinceLastExchange: number,
): PauseContinuationResult {
  const outcomes = choices.map((choice) => {
    if (choice.broken) {
      return {
        actorId: choice.actorId,
        declaredChoice: choice.choice,
        finalChoice: 'hold' as PressHoldChoice,
        cufPenalty: pausesSinceLastExchange,
        forcedToPress: false,
        pressBonus: 0,
        margin: null,
        succeeded: null,
      };
    }
    if (choice.choice === 'press') {
      return {
        actorId: choice.actorId,
        declaredChoice: choice.choice,
        finalChoice: 'press' as PressHoldChoice,
        cufPenalty: pausesSinceLastExchange,
        forcedToPress: false,
        pressBonus: 5,
        margin: null,
        succeeded: null,
      };
    }
    const roll = choice.roll ?? choice.cuf + pausesSinceLastExchange + 1;
    const margin = computeMargin(roll, choice.cuf - pausesSinceLastExchange);
    const succeeded = margin > 0;
    return {
      actorId: choice.actorId,
      declaredChoice: choice.choice,
      finalChoice: succeeded ? ('hold' as PressHoldChoice) : ('press' as PressHoldChoice),
      cufPenalty: pausesSinceLastExchange,
      forcedToPress: !succeeded,
      pressBonus: 0,
      margin,
      succeeded,
    };
  });

  return {
    nextPhase: outcomes.some((outcome) => outcome.finalChoice === 'press') ? 'exchange' : 'pause',
    outcomes,
  };
}

export function createCombatAction(
  key: CombatActionKey,
  options: CreateCombatActionOptions = {},
): ActionState {
  const definition = COMBAT_ACTIONS[key];
  return {
    id: options.id ?? key,
    key: definition.key,
    name: options.name ?? definition.name,
    cost: options.cost ?? definition.defaultCost,
    cadence: definition.cadence,
    category: definition.category,
    status: options.status ?? 'declared',
    summary: options.summary ?? definition.summary,
    detail: options.detail ?? definition.detail,
    tags: options.tags ?? definition.tags,
    declaredTick: options.declaredTick ?? null,
    resolvedTick: options.resolvedTick ?? null,
    source: definition.source,
    metadata: options.metadata,
  };
}

export function createPendingAction(id: string, name: string, cost: number): ActionState {
  return {
    id,
    key: 'pending',
    name,
    cost,
    cadence: 'tactical',
    category: 'unmapped',
    status: 'declared',
    summary: 'Declared action pending a specific combat rule mapping.',
    tags: ['displayable', 'placeholder'],
  };
}