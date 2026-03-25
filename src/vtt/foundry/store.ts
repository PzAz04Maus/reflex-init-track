import type { ReflexState } from '../../core/types';
import { createInitialState, setState } from '../../core/state/stateSet';
import { COMBAT_FLAG, MODULE_ID } from './constants';

export async function getScheduleState(combat: CombatLike): Promise<ReflexState> {
  const raw = await combat.getFlag(MODULE_ID, COMBAT_FLAG);
  return setState(createInitialState(), (raw as Partial<ReflexState> | null | undefined) ?? {});
}

export async function setScheduleState(combat: CombatLike, state: ReflexState): Promise<void> {
  await combat.setFlag(MODULE_ID, COMBAT_FLAG, state);
}
