import type { CombatState } from '../core/types';

export interface VttAdapter {
  getState(): Promise<CombatState>;
  setState(state: CombatState): Promise<void>;
  openPanel(): Promise<void> | void;
}
