import type { CombatState } from 'reflex-mechanics';
import { COMBAT_FLAG, MODULE_ID } from './constants';

export async function getScheduleState(_combat: any): Promise<CombatState | null> {
  void COMBAT_FLAG;
  void MODULE_ID;
  return null;
}

export async function setScheduleState(_combat: any, _state: CombatState): Promise<void> {}