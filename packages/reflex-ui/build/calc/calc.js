import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { useEffect, useMemo, useRef, useState } from 'react';
import { create, all } from 'mathjs';
import 'mathlive';
import '../mathlive-jsx';
const math = create(all, {});
export default function App() {
    const mathFieldRef = useRef(null);
    const parserRef = useRef(math.parser());
    const [expression, setExpression] = useState('2/3 + sqrt(5)');
    const [result, setResult] = useState('');
    const [error, setError] = useState('');
    const [history, setHistory] = useState([]);
    const examples = useMemo(() => ['2/3 + sqrt(5)', 'sin(pi / 4)^2', '5 cm to inch', 'det([[1, 2], [3, 4]])', 'a = 12', 'a * 3'], []);
    useEffect(() => {
        const mf = mathFieldRef.current;
        if (!mf) {
            return;
        }
        mf.setOptions?.({
            virtualKeyboardMode: 'onfocus',
            smartMode: false,
        });
        mf.value = expression;
        const onInput = () => {
            const next = String(mf.value ?? '');
            setExpression(next);
        };
        mf.addEventListener('input', onInput);
        return () => mf.removeEventListener('input', onInput);
    }, []);
    useEffect(() => {
        const mf = mathFieldRef.current;
        if (!mf) {
            return;
        }
        if (String(mf.value ?? '') !== expression) {
            mf.value = expression;
        }
    }, [expression]);
    const evaluateExpression = () => {
        const trimmed = expression.trim();
        if (!trimmed) {
            setError('Enter an expression.');
            setResult('');
            return;
        }
        try {
            const value = parserRef.current.evaluate(trimmed);
            const formatted = typeof value === 'string' ? value : math.format(value, { precision: 14 });
            setResult(formatted);
            setError('');
            setHistory((prev) => [
                {
                    id: Date.now(),
                    expression: trimmed,
                    result: formatted,
                },
                ...prev,
            ].slice(0, 12));
        }
        catch (err) {
            const message = err instanceof Error ? err.message : 'Evaluation error';
            setError(message);
            setResult('');
        }
    };
    const clearAll = () => {
        setExpression('');
        setResult('');
        setError('');
    };
    const resetParser = () => {
        parserRef.current.clear();
        setResult('');
        setError('');
        setHistory([]);
    };
    const onKeyDown = (event) => {
        if (event.key === 'Enter' && !event.shiftKey) {
            event.preventDefault();
            evaluateExpression();
        }
    };
    return (_jsx("div", { className: "min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10", children: _jsxs("div", { className: "mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.4fr_0.8fr]", children: [_jsxs("div", { className: "rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl", children: [_jsxs("div", { className: "mb-6 flex items-start justify-between gap-4", children: [_jsxs("div", { children: [_jsx("h1", { className: "text-3xl font-semibold tracking-tight", children: "MathLive + math.js calculator" }), _jsx("p", { className: "mt-2 text-sm text-slate-400", children: "Simple calculator mode: type math.js-style expressions directly into the math field." })] }), _jsx("div", { className: "rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300", children: "Enter = evaluate" })] }), _jsxs("div", { className: "space-y-4", children: [_jsx("label", { className: "block text-sm font-medium text-slate-300", children: "Expression" }), _jsx("div", { className: "rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-inner", onKeyDown: onKeyDown, children: _jsx("math-field", { ref: (node) => {
                                            mathFieldRef.current = node;
                                        }, className: "block min-h-[72px] w-full rounded-xl bg-transparent text-xl outline-none", placeholder: "Type a math.js expression like 2/3 + sqrt(5)" }) }), _jsxs("div", { className: "flex flex-wrap gap-3", children: [_jsx("button", { onClick: evaluateExpression, className: "rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow hover:bg-slate-200", children: "Evaluate" }), _jsx("button", { onClick: clearAll, className: "rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800", children: "Clear field" }), _jsx("button", { onClick: resetParser, className: "rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800", children: "Reset variables" })] }), _jsxs("div", { className: "grid gap-4 md:grid-cols-2", children: [_jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-950/70 p-4", children: [_jsx("div", { className: "mb-2 text-xs font-medium uppercase tracking-wide text-slate-500", children: "Result" }), _jsx("div", { className: "min-h-[48px] break-words text-lg text-emerald-300", children: result || _jsx("span", { className: "text-slate-500", children: "No result yet" }) })] }), _jsxs("div", { className: "rounded-2xl border border-slate-800 bg-slate-950/70 p-4", children: [_jsx("div", { className: "mb-2 text-xs font-medium uppercase tracking-wide text-slate-500", children: "Error" }), _jsx("div", { className: "min-h-[48px] break-words text-sm text-rose-300", children: error || _jsx("span", { className: "text-slate-500", children: "No errors" }) })] })] })] })] }), _jsxs("div", { className: "space-y-6", children: [_jsxs("div", { className: "rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl", children: [_jsx("h2", { className: "text-lg font-semibold", children: "Examples" }), _jsx("div", { className: "mt-4 flex flex-wrap gap-2", children: examples.map((item) => (_jsx("button", { onClick: () => setExpression(item), className: "rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700", children: item }, item))) }), _jsxs("div", { className: "mt-4 space-y-2 text-sm text-slate-400", children: [_jsx("p", { children: "Supports math.js syntax, so this mode is text-first rather than pretty-math parsing." }), _jsx("p", { children: "Examples: functions, units, matrices, and variable assignments." })] })] }), _jsxs("div", { className: "rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl", children: [_jsxs("div", { className: "flex items-center justify-between gap-3", children: [_jsx("h2", { className: "text-lg font-semibold", children: "History" }), _jsx("span", { className: "text-xs text-slate-500", children: "Last 12" })] }), _jsx("div", { className: "mt-4 space-y-3", children: history.length === 0 ? (_jsx("div", { className: "rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-500", children: "Evaluated expressions will appear here." })) : (history.map((item) => (_jsxs("button", { onClick: () => setExpression(item.expression), className: "block w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left hover:bg-slate-800/70", children: [_jsx("div", { className: "truncate text-sm text-slate-300", children: item.expression }), _jsx("div", { className: "mt-1 truncate text-base text-emerald-300", children: item.result })] }, item.id)))) })] })] })] }) }));
}
