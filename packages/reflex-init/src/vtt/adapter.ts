import type { CombatState } from 'reflex-core';

export interface VttAdapter {
  getState(): Promise<CombatState>;
  setState(state: CombatState): Promise<void>;
  openPanel(): Promise<void> | void;
}
