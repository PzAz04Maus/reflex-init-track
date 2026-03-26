import type { CombatState } from '../../core/types';
// import { createInitialState, setState } from '../../core/selectors/combatSelectors';
import { COMBAT_FLAG, MODULE_ID } from './constants';


// File intentionally left blank to disable VTT store due to data model changes.
 // export async function getScheduleState(combat: CombatLike): Promise<CombatState> {
 //   const raw = await combat.getFlag(MODULE_ID, COMBAT_FLAG);
 //   return setState(createInitialState(), (raw as Partial<CombatState> | null | undefined) ?? {});
 // }
 // export async function setScheduleState(combat: CombatLike, state: CombatState): Promise<void> {
 //   await combat.setFlag(MODULE_ID, COMBAT_FLAG, state);
 // }
