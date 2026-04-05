
import type { CharacterRecord } from "../types";
import { useMemo } from "react";


interface ActorListProps {
  actors: CharacterRecord[];
  nextActorIds: string[];
  onSetTick: (actorId: string, tick: number) => void;
  onSetActionCost: (actorId: string, actionCost: number) => void;
  onToggleJoined: (actorId: string) => void;
  onRemoveActor: (actorId: string) => void;
  getActorColor?: (idx: number) => string;
}



// Style constants
const rowBaseStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  borderBottom: "2px solid #222",
  padding: "8px 10px",
  fontSize: 18,
  marginBottom: 2,
};

const badgeBaseStyle: React.CSSProperties = {
  display: "inline-block",
  width: 22,
  height: 22,
  borderRadius: "50%",
  marginRight: 10,
};

const tickStyle: React.CSSProperties = {
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
};

// Row for a single actor
function ActorRow({ actor, isNext, idx, getActorColor }: {
  actor: CharacterRecord;
  isNext: boolean;
  idx: number;
  getActorColor?: (idx: number) => string;
}) {
  return (
    <div
      style={{
        ...rowBaseStyle,
        background: isNext ? "#333" : "#888",
        color: isNext ? "#fff" : "#222",
        fontWeight: isNext ? 700 : 500,
        borderRadius: isNext ? 6 : 0,
        boxShadow: isNext ? "0 2px 8px #0008" : undefined,
      }}
    >
      <span
        style={{
          ...badgeBaseStyle,
          background: getActorColor ? getActorColor(idx) : "#bbb",
          border: isNext ? "2px solid #fff" : "2px solid #444",
          boxShadow: isNext ? "0 0 6px #fff" : undefined,
        }}
      />
      <span style={{ flex: 1 }}>{actor.name}</span>
      <span style={tickStyle}>{actor.init.val}</span>
    </div>
  );
}


//
// Main actor list component
export function ActorList({ actors, nextActorIds, getActorColor }: ActorListProps) {
  // Memoize sorted actors for performance
  const sorted = useMemo(() =>
    [...actors].sort(
      (a, b) => a.init.val - b.init.val || a.name.localeCompare(b.name)
    ), [actors]
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