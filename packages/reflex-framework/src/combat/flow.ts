import type { CharacterId, CombatPhase, PressHoldChoice, Stance } from '../types';
import { PAUSE_MOVEMENT_MULTIPLIER } from './catalog';
import { computeMargin } from './initiative';

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