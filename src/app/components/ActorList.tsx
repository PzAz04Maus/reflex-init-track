import type { Actor } from "../../core/types";


interface ActorListProps {
  actors: Actor[];
  nextActorIds: string[];
  onSetTick: (actorId: string, tick: number) => void;
  onSetActionCost: (actorId: string, actionCost: number) => void;
  onToggleJoined: (actorId: string) => void;
  onRemoveActor: (actorId: string) => void;
  getActorColor?: (idx: number) => string;
}


function ActorRow({
  actor,
  isNext,
  idx,
  getActorColor,
}: {
  actor: Actor;
  isNext: boolean;
  idx: number;
  getActorColor?: (idx: number) => string;
}) {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        background: isNext ? "#333" : "#888",
        borderBottom: "2px solid #222",
        padding: "8px 10px",
        fontSize: 18,
        color: isNext ? "#fff" : "#222",
        fontWeight: isNext ? 700 : 500,
        borderRadius: isNext ? 6 : 0,
        marginBottom: 2,
        boxShadow: isNext ? "0 2px 8px #0008" : undefined,
      }}
    >
      <span style={{
        display: "inline-block",
        width: 22,
        height: 22,
        borderRadius: "50%",
        background: getActorColor ? getActorColor(idx) : "#bbb",
        marginRight: 10,
        border: isNext ? "2px solid #fff" : "2px solid #444",
        boxShadow: isNext ? "0 0 6px #fff" : undefined,
      }} />
      <span style={{ flex: 1 }}>{actor.name}</span>
      <span style={{
        background: "#222",
        color: "#fff",
        borderRadius: 4,
        padding: "2px 12px",
        fontWeight: 700,
        fontSize: 20,
        marginLeft: 8,
        minWidth: 36,
        textAlign: "center",
        letterSpacing: 1,
      }}>{actor.tick}</span>
    </div>
  );
}


export function ActorList({
  actors,
  nextActorIds,
  getActorColor,
}: ActorListProps) {
  const sorted = [...actors].sort(
    (a, b) => a.tick - b.tick || a.name.localeCompare(b.name)
  );

  return (
    <div>
      {sorted.map((actor, idx) => (
        <ActorRow
          key={actor.id}
          actor={actor}
          isNext={nextActorIds.includes(actor.id)}
          idx={idx}
          getActorColor={getActorColor}
        />
      ))}
    </div>
  );
}