import type { CombatState } from "reflex-shared";
export interface VttActorInput {
    id: string;
    name: string;
    initiative?: number;
}
export declare function fromVttActors(actors: VttActorInput[]): CombatState;
//# sourceMappingURL=adapter.d.ts.map