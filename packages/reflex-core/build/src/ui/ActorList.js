import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useMemo, memo } from "react";
// Style constants
const rowBaseStyle = {
    display: "flex",
    alignItems: "center",
    borderBottom: "2px solid #222",
    padding: "8px 10px",
    fontSize: 18,
    marginBottom: 2,
};
const badgeBaseStyle = {
    display: "inline-block",
    width: 22,
    height: 22,
    borderRadius: "50%",
    marginRight: 10,
};
const tickStyle = {
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
const ActorRow = memo(function ActorRow({ actor, isNext, idx, getActorColor }) {
    return (_jsxs("div", { style: {
            ...rowBaseStyle,
            background: isNext ? "#333" : "#888",
            color: isNext ? "#fff" : "#222",
            fontWeight: isNext ? 700 : 500,
            borderRadius: isNext ? 6 : 0,
            boxShadow: isNext ? "0 2px 8px #0008" : undefined,
        }, children: [_jsx("span", { style: {
                    ...badgeBaseStyle,
                    background: getActorColor ? getActorColor(idx) : "#bbb",
                    border: isNext ? "2px solid #fff" : "2px solid #444",
                    boxShadow: isNext ? "0 0 6px #fff" : undefined,
                } }), _jsx("span", { style: { flex: 1 }, children: actor.name }), _jsx("span", { style: tickStyle, children: actor.init.val })] }));
});
export default function ActorList({ actors, nextActorIds, getActorColor, ...handlers }) {
    const sortedActors = useMemo(() => {
        return [...actors].sort((a, b) => b.init.val - a.init.val);
    }, [actors]);
    return (_jsx("div", { children: sortedActors.map((actor, idx) => (_jsx(ActorRow, { actor: actor, isNext: nextActorIds.includes(actor.id), idx: idx, getActorColor: getActorColor }, actor.id))) }));
}
