import { useReducer, useState, useCallback } from "react";
import { combatReducer } from "../core/reducer/combatReducer";
import { getNextActors } from "../core/state/getNextActor";
import { mockCombatState } from "./mockdata";
import { ActorList } from "./components/ActorList";

// Color palette for actors (cycle through if needed)
const actorColors = ["#FFD600", "#4CAF50", "#2196F3", "#F44336", "#9C27B0", "#FF9800"];

const getActorColor = useCallback((idx: number) => actorColors[idx % actorColors.length], []);

export default function App() {
    const [state, dispatch] = useReducer(combatReducer, mockCombatState);
    const [newName, setNewName] = useState("");

    const nextActors = getNextActors(state);
    const nextActorIds = nextActors.map((actor) => actor.id);

    // Find the current actor (first in nextActors)
    const currentActor = nextActors[0] || state.actors[0];
    const currentIdx = state.actors.findIndex(a => a.id === currentActor?.id);

    // Initiative track bar markers
    const minTick = Math.min(...state.actors.map(a => a.init.val));
    const maxTick = Math.max(...state.actors.map(a => a.init.val));
    const trackRange = maxTick - minTick || 1;

    // Handlers
    const handleAdvanceTurn = useCallback(() => dispatch({ type: "advanceTurn" }), [dispatch]);
    const handleReset = useCallback(() => dispatch({ type: "reset", state: mockCombatState }), [dispatch]);
    const handleAddActor = useCallback(() => {
        const trimmed = newName.trim();
        if (!trimmed) return;
        dispatch({
            type: "addActor",
            actor: {
                id: crypto.randomUUID(),
                name: trimmed,
                data: { ooda: 10 },
                bio: {},
                equipment: {},
                init: { base: minTick, initial: minTick, val: minTick, joined: true },
                action: null
            },
        });
        setNewName("");
    }, [newName, minTick, dispatch]);

    return (
        <div style={{ background: "#111", minHeight: "100vh", color: "#eee", fontFamily: "sans-serif", padding: 0 }}>
            <div style={{ maxWidth: 400, margin: "0 auto", paddingTop: 40 }}>
                {/* Initiative Track Bar */}
                <div style={{ position: "relative", height: 32, marginBottom: 16 }}>
                    <div style={{ height: 6, background: "#888", borderRadius: 3, position: "absolute", top: 13, left: 0, right: 0 }} />
                    {state.actors.map((actor, i) => {
                        const left = ((actor.init.val - minTick) / trackRange) * 100;
                        return (
                            <div key={actor.id} style={{
                                position: "absolute",
                                left: `calc(${left}% - 7px)`,
                                top: 0,
                                width: 14,
                                height: 32,
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                                zIndex: nextActorIds.includes(actor.id) ? 2 : 1,
                            }}>
                                <div style={{
                                    width: 4,
                                    height: 24,
                                    borderRadius: 2,
                                    background: getActorColor(i),
                                    border: nextActorIds.includes(actor.id) ? "2px solid #fff" : undefined,
                                    boxShadow: nextActorIds.includes(actor.id) ? "0 0 6px #fff" : undefined,
                                }} />
                            </div>
                        );
                    })}
                </div>

                {/* Current Actor Panel */}
                <div style={{ background: "#388e3c", color: "#111", borderRadius: 6, boxShadow: "0 2px 8px #0008", padding: 16, marginBottom: 8, position: "relative" }}>
                    <div style={{ fontWeight: 700, fontSize: 24, marginBottom: 4 }}>{currentActor?.name || "-"}</div>
                    <div style={{ fontSize: 13, opacity: 0.8, marginBottom: 8 }}>starting init: {currentActor?.init?.val ?? "-"}</div>
                    <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
                        <div style={{ fontSize: 18, fontWeight: 600, background: "#222", color: "#eee", borderRadius: 4, padding: "2px 10px" }}>{currentActor?.init?.val ?? "-"}</div>
                        <input
                            type="number"
                            value={currentActor?.action?.cost ?? 5}
                            min={1}
                            style={{ width: 40, fontSize: 18, marginLeft: 8, marginRight: 4, borderRadius: 4, border: "1px solid #888", padding: 2 }}
                            onChange={e => dispatch({ type: "setActionCost", actorId: currentActor?.id, actionCost: Number(e.target.value) })}
                        />
                        <button
                            style={{ background: "#00e676", color: "#111", fontWeight: 700, border: "none", borderRadius: 4, padding: "6px 16px", fontSize: 16, marginLeft: 8 }}
                            onClick={handleAdvanceTurn}
                        >Turn</button>
                    </div>
                </div>

                {/* Actor List */}
                <div style={{ background: "#222", borderRadius: 6, boxShadow: "0 2px 8px #0008", padding: 0, marginBottom: 8 }}>
                    <ActorList
                        actors={state.actors}
                        nextActorIds={nextActorIds}
                        onSetTick={(actorId, tick) => dispatch({ type: "setTick", actorId, tick })}
                        onSetActionCost={(actorId, actionCost) => dispatch({ type: "setActionCost", actorId, actionCost })}
                        onToggleJoined={actorId => dispatch({ type: "toggleJoined", actorId })}
                        onRemoveActor={actorId => dispatch({ type: "removeActor", actorId })}
                        getActorColor={getActorColor}
                    />
                </div>

                {/* Add Actor Form */}
                <div style={{ display: "flex", gap: 8, margin: "12px 0" }}>
                    <input
                        placeholder="New actor name"
                        value={newName}
                        onChange={e => setNewName(e.target.value)}
                        style={{ flex: 1, borderRadius: 4, border: "1px solid #888", padding: 6, fontSize: 16 }}
                    />
                    <button onClick={handleAddActor} style={{ borderRadius: 4, background: "#444", color: "#fff", border: "none", padding: "6px 16px", fontSize: 16 }}>Add</button>
                </div>

                {/* Dropdown arrow */}
                <div style={{ textAlign: "center", color: "#888", fontSize: 28, marginTop: 0, marginBottom: 8 }}>
                    <span style={{ userSelect: "none" }}>▼</span>
                </div>

                {/* Reset Button */}
                <div style={{ textAlign: "center", marginBottom: 16 }}>
                    <button onClick={handleReset} style={{ borderRadius: 4, background: "#888", color: "#fff", border: "none", padding: "6px 16px", fontSize: 16 }}>Reset</button>
                </div>
            </div>
        </div>
    );
}