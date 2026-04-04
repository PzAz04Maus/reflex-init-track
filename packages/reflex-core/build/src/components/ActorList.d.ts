import type { CharacterRecord } from "reflex-core";
interface ActorListProps {
    actors: CharacterRecord[];
    nextActorIds: string[];
    onSetTick: (actorId: string, tick: number) => void;
    onSetActionCost: (actorId: string, actionCost: number) => void;
    onToggleJoined: (actorId: string) => void;
    onRemoveActor: (actorId: string) => void;
    getActorColor?: (idx: number) => string;
}
export declare function ActorList({ actors, nextActorIds, getActorColor }: ActorListProps): import("react/jsx-runtime").JSX.Element;
export {};
//# sourceMappingURL=ActorList.d.ts.map