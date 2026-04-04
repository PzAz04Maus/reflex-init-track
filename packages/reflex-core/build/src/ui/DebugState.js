import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
export function DebugState({ state }) {
    return (_jsxs("div", { children: [_jsx("h2", { children: "Debug State" }), _jsx("pre", { children: JSON.stringify(state, null, 2) })] }));
}
