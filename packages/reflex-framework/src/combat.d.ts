import type { ActionCadence, ActionState, ActionStatus, CharacterId } from './types';
export declare const COMBAT_RULES_SOURCE = "Twilight 2013 Core OEF PDF pp. 137-142";
export type CombatPhase = 'exchange' | 'pause' | 'ended';
export type PressHoldChoice = 'press' | 'hold';
export type EncumbranceLevel = 'overloaded' | 'heavy' | 'moderate' | 'light' | 'unencumbered';
export type Stance = 'standing' | 'kneeling' | 'sitting' | 'prone';
export type TacticalMovementRate = 'sprint' | 'run' | 'trot' | 'walk' | 'stagger' | 'crawl';
export type CombatActionKey = 'activateEquipment' | 'assess' | 'attack' | 'block' | 'changeStance' | 'communicateSimple' | 'ditchItem' | 'move' | 'readyOrStowItem' | 'reload' | 'wait' | 'communicateComplex' | 'donOrDoffClothing' | 'fieldRepair' | 'keepWatch' | 'renderAid' | 'resetWeapons' | 'setHastyAmbush' | 'useEquipment' | 'withdraw' | 'pauseMovement';
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
    normalizedChoices: Array<ExchangeContinuationChoice & {
        finalChoice: PressHoldChoice;
    }>;
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
export declare const ENCUMBRANCE_BASE_INITIATIVE: Record<EncumbranceLevel, number>;
export declare const WAIT_TICK_COST_BY_OODA: ReadonlyArray<{
    min: number;
    cost: number;
}>;
export declare const PAUSE_MOVEMENT_MULTIPLIER = 10;
export declare const MOVE_TACTICAL_TICK_COST = 5;
export declare const STANCE_EFFECTS: Record<Stance, string[]>;
export declare const TACTICAL_MOVEMENT_EFFECTS: Record<TacticalMovementRate, string[]>;
export declare const COMBAT_ACTIONS: Record<CombatActionKey, CombatActionDefinition>;
export declare function getBaseInitiative(encumbrance: EncumbranceLevel): number;
export declare function computeMargin(roll: number, target: number): number;
export declare function computeOodaAdjustedInit(baseInit: number, roll: number, target: number, pressBonus?: number): number;
export declare function computeInitiative(encumbrance: EncumbranceLevel, roll: number, target: number, pressed?: boolean): InitiativeComputation;
export declare function startExchange(participants: ExchangeParticipantInput[]): ExchangeStartResult;
export declare function getWaitTickCost(ooda: number): number;
export declare function getChangeStanceTickCost(from: Stance, to: Stance): number;
export declare function getPauseMovementDistance(tacticalMoveDistance: number): number;
export declare function resolveExchangeContinuation(choices: ExchangeContinuationChoice[]): ExchangeContinuationResult;
export declare function resolvePauseContinuation(choices: PauseContinuationChoice[], pausesSinceLastExchange: number): PauseContinuationResult;
export declare function createCombatAction(key: CombatActionKey, options?: CreateCombatActionOptions): ActionState;
export declare function createPendingAction(id: string, name: string, cost: number): ActionState;