import type {
	ActionState,
} from '../types';
import {
	type CombatActionDefinition,
	type CombatActionKey,
	type CreateCombatActionOptions,
	COMBAT_RULES_SOURCE,
} from './catalogShared';
import {
	MOVE_TACTICAL_TICK_COST,
	STANCE_EFFECTS,
	TACTICAL_COMBAT_ACTIONS,
	TACTICAL_MOVEMENT_EFFECTS,
} from './tactical/catalog';
import {
	OPERATIONAL_COMBAT_ACTIONS,
	PAUSE_MOVEMENT_MULTIPLIER,
} from './operational/catalog';

export type {
	CombatActionDefinition,
	CombatActionKey,
	CreateCombatActionOptions,
	OperationalCombatActionKey,
	TacticalCombatActionKey,
} from './catalogShared';

export {
	COMBAT_RULES_SOURCE,
	MOVE_TACTICAL_TICK_COST,
	OPERATIONAL_COMBAT_ACTIONS,
	PAUSE_MOVEMENT_MULTIPLIER,
	STANCE_EFFECTS,
	TACTICAL_COMBAT_ACTIONS,
	TACTICAL_MOVEMENT_EFFECTS,
};

export const COMBAT_ACTIONS: Record<CombatActionKey, CombatActionDefinition> = {
	...TACTICAL_COMBAT_ACTIONS,
	...OPERATIONAL_COMBAT_ACTIONS,
};

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