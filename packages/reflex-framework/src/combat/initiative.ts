import type { CharacterId, EncumbranceLevel } from '../types';

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
  pressBonus?: number;
}

export interface ExchangeParticipantState extends InitiativeComputation {
  actorId: CharacterId;
}

export interface ExchangeStartResult {
  startingTick: number;
  participants: ExchangeParticipantState[];
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
  pressBonus = pressed ? 5 : 0,
): InitiativeComputation {
  const baseInitiative = getBaseInitiative(encumbrance);
  const effectivePressBonus = pressBonus;
  const margin = computeMargin(roll, target);
  const succeeded = margin > 0;
  return {
    baseInitiative,
    pressBonus: effectivePressBonus,
    roll,
    target,
    margin,
    succeeded,
    initiative: computeOodaAdjustedInit(baseInitiative, roll, target, effectivePressBonus),
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
      participant.pressBonus ?? (participant.pressed ? 5 : 0),
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