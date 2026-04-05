import type {
	ActionCadence,
	ActionState,
	ActionStatus,
} from '../types';

export const COMBAT_RULES_SOURCE = 'Twilight 2013 Core OEF PDF pp. 137-142';

export type TacticalCombatActionKey =
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
	| 'wait';

export type OperationalCombatActionKey =
	| 'communicateComplex'
	| 'donOrDoffClothing'
	| 'fieldRepair'
	| 'keepWatch'
	| 'pauseMovement'
	| 'renderAid'
	| 'resetWeapons'
	| 'setHastyAmbush'
	| 'useEquipment'
	| 'withdraw';

export type CombatActionKey = TacticalCombatActionKey | OperationalCombatActionKey;

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