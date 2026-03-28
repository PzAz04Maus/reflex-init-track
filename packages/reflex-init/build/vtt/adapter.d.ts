import type { CombatState } from 'reflex-shared';
export interface VttAdapter {
    getState(): Promise<CombatState>;
    setState(state: CombatState): Promise<void>;
    openPanel(): Promise<void> | void;
}
//# sourceMappingURL=adapter.d.ts.map