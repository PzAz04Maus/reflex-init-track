import type {
	ActionState,
	CharacterId,
	CharacterRecord,
	CombatState,
	CombatantState,
	PressHoldChoice,
} from '../types';
import { withActors } from 'reflex-framework';
import { getActionResolutionWindow, resolveSustainedFire } from './advanced';
import { resolveExchangeContinuation, resolvePauseContinuation } from './flow';
import { startExchange } from './initiative';

export interface DeclareActionInStateOptions {
	targetActorId?: CharacterId | null;
	weaponId?: string | null;
	usesTracer?: boolean;
}

export function createCombatantState(overrides: Partial<CombatantState> = {}): CombatantState {
	return {
		encumbrance: 'moderate',
		stance: 'standing',
		tacticalMovementRate: 'walk',
		dominantHand: 'right',
		pressChoice: null,
		lastResolvedChoice: null,
		pressBonus: 0,
		broken: false,
		surprised: false,
		threatLevel: 0,
		moralePenalty: 0,
		initiativeRoll: null,
		initiativeTarget: null,
		lastComputedInitiative: null,
		queuedActionEndsOnTick: null,
		sustainedFireTargetId: null,
		sustainedFireWeaponId: null,
		sustainedFireSequence: 0,
		...overrides,
	};
}

function resetSustainedFire(combatant: CombatantState): CombatantState {
	return {
		...combatant,
		sustainedFireTargetId: null,
		sustainedFireWeaponId: null,
		sustainedFireSequence: 0,
	};
}

function buildActionMetadata(
	action: ActionState,
	options: DeclareActionInStateOptions,
	sustainedFireSequence: number,
	tickCostReduction: number,
	tracerAttackBonus: number,
): ActionState['metadata'] {
	return {
		...(action.metadata ?? {}),
		...(options.targetActorId ? { targetActorId: options.targetActorId } : {}),
		...(options.weaponId ? { weaponId: options.weaponId } : {}),
		sustainedFireSequence,
		sustainedFireTickReduction: tickCostReduction,
		sustainedFireTracerBonus: tracerAttackBonus,
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
				baseInitiativeOverride: combatant.surprised ? 0 : undefined,
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
					surprised: false,
					initiativeRoll: participant.roll,
					initiativeTarget: participant.target,
					lastComputedInitiative: participant.initiative,
				},
			};
		}),
	);
}

export function applyMoraleToCombatantInState(
	state: CombatState,
	actorId: CharacterId,
	threatLevel: number,
	penalty: number,
	broken: boolean,
): CombatState {
	return withCombatantState(state, actorId, {
		threatLevel,
		moralePenalty: penalty,
		broken,
	});
}

export function applySurpriseToCombatantsInState(
	state: CombatState,
	actorIds: readonly CharacterId[],
	surprised = true,
): CombatState {
	const surprisedIds = new Set(actorIds);

	return withActors(
		state,
		state.actors.map((actor) => (
			surprisedIds.has(actor.id)
				? { ...actor, combat: { ...ensureCombatantState(actor), surprised } }
				: actor
		)),
	);
}

export function declareActionInState(
	state: CombatState,
	actorId: CharacterId,
	action: ActionState,
	options: DeclareActionInStateOptions = {},
): CombatState {
	return withActors(
		state,
		state.actors.map((actor) => {
			if (actor.id !== actorId) {
				return actor;
			}

			const combatant = ensureCombatantState(actor);
			const isAttack = action.category === 'attack';
			const sameAttackTrack = isAttack
				&& options.targetActorId !== undefined
				&& options.targetActorId !== null
				&& options.weaponId !== undefined
				&& options.weaponId !== null
				&& combatant.sustainedFireTargetId === options.targetActorId
				&& combatant.sustainedFireWeaponId === options.weaponId;
			const sustainedFireSequence = isAttack ? (sameAttackTrack ? (combatant.sustainedFireSequence ?? 0) + 1 : 1) : 0;
			const sustainedFire = resolveSustainedFire(sustainedFireSequence, options.usesTracer ?? false);
			const adjustedCost = action.cadence === 'tactical'
				? Math.max(1, action.cost - sustainedFire.tickCostReduction)
				: action.cost;
			const resolutionWindow = action.cadence === 'tactical'
				? getActionResolutionWindow(state.currentTick, adjustedCost)
				: null;
			const updatedCombatant = isAttack
				? {
					...combatant,
					queuedActionEndsOnTick: resolutionWindow?.endTick ?? null,
					sustainedFireTargetId: options.targetActorId ?? null,
					sustainedFireWeaponId: options.weaponId ?? null,
					sustainedFireSequence,
				}
				: {
					...resetSustainedFire(combatant),
					queuedActionEndsOnTick: resolutionWindow?.endTick ?? null,
				};

			return {
				...actor,
				action: {
					...action,
					cost: adjustedCost,
					status: 'declared',
					declaredTick: action.cadence === 'tactical' ? state.currentTick : action.declaredTick ?? null,
					resolvedTick: resolutionWindow?.endTick ?? action.resolvedTick ?? null,
					metadata: buildActionMetadata(
						action,
						options,
						sustainedFireSequence,
						sustainedFire.tickCostReduction,
						sustainedFire.tracerAttackBonus,
					),
				},
				combat: updatedCombatant,
			};
		}),
	);
}

export function resolveActionsEndingOnTick(state: CombatState, tick = state.currentTick): CombatState {
	return withActors(
		state,
		state.actors.map((actor) => {
			if (!actor.action || actor.action.resolvedTick !== tick || actor.action.status === 'interrupted') {
				return actor;
			}

			return {
				...actor,
				action: {
					...actor.action,
					status: 'resolved',
				},
				combat: {
					...ensureCombatantState(actor),
					queuedActionEndsOnTick: null,
				},
			};
		}),
	);
}

export function interruptActionInState(
	state: CombatState,
	actorId: CharacterId,
	interruptingResolvedTick: number,
	interruptingActorId?: CharacterId,
): CombatState {
	return withActors(
		state,
		state.actors.map((actor) => {
			if (actor.id !== actorId || !actor.action || actor.action.resolvedTick == null) {
				return actor;
			}

			if (interruptingResolvedTick <= actor.action.resolvedTick) {
				return actor;
			}

			return {
				...actor,
				action: {
					...actor.action,
					status: 'interrupted',
					metadata: {
						...(actor.action.metadata ?? {}),
						...(interruptingActorId ? { interruptedByActorId: interruptingActorId } : {}),
						interruptedAtTick: interruptingResolvedTick,
					},
				},
				combat: {
					...resetSustainedFire(ensureCombatantState(actor)),
					queuedActionEndsOnTick: null,
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