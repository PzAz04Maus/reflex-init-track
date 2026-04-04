import type { CombatState, CharacterRecord, CharacterId } from '../types';
export declare function selectActors(state: CombatState): CharacterRecord[];
export declare function selectActorById(state: CombatState, characterId: CharacterId): CharacterRecord | null;
export declare function withActors(state: CombatState, actors: CharacterRecord[]): CombatState;
//# sourceMappingURL=combatSelectors.d.ts.map