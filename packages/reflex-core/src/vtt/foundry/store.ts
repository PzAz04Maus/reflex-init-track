import type { CombatState } from '../../types';
// import { createInitialState, setState } from '../../core/selectors/combatSelectors';
import { COMBAT_FLAG, MODULE_ID } from './constants';

export async function getScheduleState(_combat: any): Promise<CombatState | null> {
	// TODO: Implement actual Foundry flag read logic
	return null;
}

export async function setScheduleState(_combat: any, _state: CombatState): Promise<void> {
	// TODO: Implement actual Foundry flag write logic
}
