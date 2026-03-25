import type { ReflexState } from '../core/types';

export interface VttAdapter {
  getState(): Promise<ReflexState>;
  setState(state: ReflexState): Promise<void>;
  openPanel(): Promise<void> | void;
}
