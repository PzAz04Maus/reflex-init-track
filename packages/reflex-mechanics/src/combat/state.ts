import type {
	CharacterId,
	CharacterRecord,
	CombatState,
	CombatantState,
	PressHoldChoice,
} from '../types';
import { withActors } from 'reflex-framework';
import { resolveExchangeContinuation, resolvePauseContinuation } from './flow';
import { startExchange } from './initiative';

export function createCombatantState(overrides: Partial<CombatantState> = {}): CombatantState {
	return {
		encumbrance: 'moderate',
		stance: 'standing',
		tacticalMovementRate: 'walk',
		pressChoice: null,
		lastResolvedChoice: null,
		pressBonus: 0,
		broken: false,
		initiativeRoll: null,
		initiativeTarget: null,
		lastComputedInitiative: null,
		...overrides,
	};
}

export function ensureCombatantState(actor: CharacterRecord): CombatantState {
	return actor.combat ?? createCombatantState();
}

export function withCombatantState(
	state: CombatState,
	actorId: CharacterId,
	combat: Partial<CombatantState>,
): CombatState {
	return withActors(
		state,
		state.actors.map((actor) =>
			actor.id === actorId
				? { ...actor, combat: { ...ensureCombatantState(actor), ...combat } }
				: actor,
		),
	);
}

export function withCombatState(
	state: CombatState,
	combat: Partial<Pick<CombatState, 'phase' | 'currentTick' | 'pausesSinceLastExchange'>>,
): CombatState {
	return {
		...state,
		...combat,
	};
}

export function applyExchangeStart(
	state: CombatState,
	rollsByActorId: Record<CharacterId, number>,
): CombatState {
	const participants = state.actors
		.filter((actor) => actor.init.joined)
		.map((actor) => {
			const combatant = ensureCombatantState(actor);
			const roll = rollsByActorId[actor.id] ?? actor.data.ooda;
			return {
				actorId: actor.id,
				encumbrance: combatant.encumbrance,
				ooda: actor.data.ooda,
				roll,
				pressBonus: combatant.pressBonus,
			};
		});

	const exchange = startExchange(participants);
	const participantMap = new Map(exchange.participants.map((participant) => [participant.actorId, participant]));

	return withActors(
		{
			...state,
			phase: 'exchange',
			currentTick: exchange.startingTick,
			pausesSinceLastExchange: 0,
		},
		state.actors.map((actor) => {
			const participant = participantMap.get(actor.id);
			if (!participant) {
				return actor;
			}
			return {
				...actor,
				init: {
					...actor.init,
					base: participant.baseInitiative,
					initial: participant.initiative,
					val: participant.initiative,
				},
				combat: {
					...ensureCombatantState(actor),
					pressChoice: null,
					lastResolvedChoice: null,
					pressBonus: 0,
					initiativeRoll: participant.roll,
					initiativeTarget: participant.target,
					lastComputedInitiative: participant.initiative,
				},
			};
		}),
	);
}

export function resolveExchangeChoicesInState(state: CombatState): CombatState {
	const result = resolveExchangeContinuation(
		state.actors
			.filter((actor) => actor.init.joined)
			.map((actor) => ({
				actorId: actor.id,
				choice: ensureCombatantState(actor).pressChoice ?? ('hold' as PressHoldChoice),
				broken: ensureCombatantState(actor).broken,
			})),
	);

	const choicesByActorId = new Map(result.normalizedChoices.map((choice) => [choice.actorId, choice]));

	return withActors(
		{
			...state,
			phase: result.nextPhase,
			currentTick: result.nextPhase === 'pause' ? 0 : state.currentTick,
			pausesSinceLastExchange: result.nextPhase === 'pause' ? 1 : 0,
		},
		state.actors.map((actor) => {
			const choice = choicesByActorId.get(actor.id);
			if (!choice) {
				return actor;
			}
			return {
				...actor,
				combat: {
					...ensureCombatantState(actor),
					pressChoice: null,
					lastResolvedChoice: choice.finalChoice,
					pressBonus: result.pressBonusByActorId[actor.id] ?? 0,
				},
			};
		}),
	);
}

export function resolvePauseChoicesInState(
	state: CombatState,
	rollsByActorId: Record<CharacterId, number> = {},
): CombatState {
	const result = resolvePauseContinuation(
		state.actors
			.filter((actor) => actor.init.joined)
			.map((actor) => ({
				actorId: actor.id,
				choice: ensureCombatantState(actor).pressChoice ?? ('hold' as PressHoldChoice),
				cuf: actor.data.cuf,
				roll: rollsByActorId[actor.id],
				broken: ensureCombatantState(actor).broken,
			})),
		state.pausesSinceLastExchange,
	);

	const outcomesByActorId = new Map(result.outcomes.map((outcome) => [outcome.actorId, outcome]));

	return withActors(
		{
			...state,
			phase: result.nextPhase,
			currentTick: result.nextPhase === 'pause' ? 0 : state.currentTick,
			pausesSinceLastExchange:
				result.nextPhase === 'pause' ? state.pausesSinceLastExchange + 1 : state.pausesSinceLastExchange,
		},
		state.actors.map((actor) => {
			const outcome = outcomesByActorId.get(actor.id);
			if (!outcome) {
				return actor;
			}
			return {
				...actor,
				combat: {
					...ensureCombatantState(actor),
					pressChoice: null,
					lastResolvedChoice: outcome.finalChoice,
					pressBonus: outcome.pressBonus,
				},
			};
		}),
	);
}