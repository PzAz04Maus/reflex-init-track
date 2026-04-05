import React, { useEffect, useMemo, useRef, useState } from 'react';
import { create, all } from 'mathjs';
import 'mathlive';
import '../mathlive-jsx';

const math = create(all, {});

type HistoryItem = {
  id: number;
  expression: string;
  result: string;
};

export default function App() {
  const mathFieldRef = useRef<HTMLElement | null>(null);
  const parserRef = useRef(math.parser());
  const [expression, setExpression] = useState('2/3 + sqrt(5)');
  const [result, setResult] = useState('');
  const [error, setError] = useState('');
  const [history, setHistory] = useState<HistoryItem[]>([]);

  const examples = useMemo(
    () => ['2/3 + sqrt(5)', 'sin(pi / 4)^2', '5 cm to inch', 'det([[1, 2], [3, 4]])', 'a = 12', 'a * 3'],
    []
  );

  useEffect(() => {
    const mf = mathFieldRef.current as any;
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
    const mf = mathFieldRef.current as any;
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
    } catch (err) {
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

  const onKeyDown = (event: React.KeyboardEvent) => {
    if (event.key === 'Enter' && !event.shiftKey) {
      event.preventDefault();
      evaluateExpression();
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 p-6 md:p-10">
      <div className="mx-auto grid max-w-6xl gap-6 lg:grid-cols-[1.4fr_0.8fr]">
        <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
          <div className="mb-6 flex items-start justify-between gap-4">
            <div>
              <h1 className="text-3xl font-semibold tracking-tight">MathLive + math.js calculator</h1>
              <p className="mt-2 text-sm text-slate-400">
                Simple calculator mode: type math.js-style expressions directly into the math field.
              </p>
            </div>
            <div className="rounded-2xl border border-slate-700 bg-slate-800 px-3 py-2 text-xs text-slate-300">
              Enter = evaluate
            </div>
          </div>

          <div className="space-y-4">
            <label className="block text-sm font-medium text-slate-300">Expression</label>
            <div className="rounded-2xl border border-slate-700 bg-slate-950 p-4 shadow-inner" onKeyDown={onKeyDown}>
              <math-field
                ref={(node: HTMLElement | null) => {
                  mathFieldRef.current = node;
                }}
                className="block min-h-[72px] w-full rounded-xl bg-transparent text-xl outline-none"
                placeholder="Type a math.js expression like 2/3 + sqrt(5)"
              />
            </div>

            <div className="flex flex-wrap gap-3">
              <button onClick={evaluateExpression} className="rounded-2xl bg-white px-4 py-2 text-sm font-medium text-slate-900 shadow hover:bg-slate-200">
                Evaluate
              </button>
              <button onClick={clearAll} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
                Clear field
              </button>
              <button onClick={resetParser} className="rounded-2xl border border-slate-700 px-4 py-2 text-sm font-medium text-slate-200 hover:bg-slate-800">
                Reset variables
              </button>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Result</div>
                <div className="min-h-[48px] break-words text-lg text-emerald-300">
                  {result || <span className="text-slate-500">No result yet</span>}
                </div>
              </div>

              <div className="rounded-2xl border border-slate-800 bg-slate-950/70 p-4">
                <div className="mb-2 text-xs font-medium uppercase tracking-wide text-slate-500">Error</div>
                <div className="min-h-[48px] break-words text-sm text-rose-300">
                  {error || <span className="text-slate-500">No errors</span>}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="space-y-6">
          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
            <h2 className="text-lg font-semibold">Examples</h2>
            <div className="mt-4 flex flex-wrap gap-2">
              {examples.map((item) => (
                <button
                  key={item}
                  onClick={() => setExpression(item)}
                  className="rounded-full border border-slate-700 bg-slate-800 px-3 py-1.5 text-sm text-slate-200 hover:bg-slate-700"
                >
                  {item}
                </button>
              ))}
            </div>
            <div className="mt-4 space-y-2 text-sm text-slate-400">
              <p>Supports math.js syntax, so this mode is text-first rather than pretty-math parsing.</p>
              <p>Examples: functions, units, matrices, and variable assignments.</p>
            </div>
          </div>

          <div className="rounded-3xl border border-slate-800 bg-slate-900/80 p-6 shadow-2xl">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-lg font-semibold">History</h2>
              <span className="text-xs text-slate-500">Last 12</span>
            </div>
            <div className="mt-4 space-y-3">
              {history.length === 0 ? (
                <div className="rounded-2xl border border-dashed border-slate-700 p-4 text-sm text-slate-500">
                  Evaluated expressions will appear here.
                </div>
              ) : (
                history.map((item) => (
                  <button
                    key={item.id}
                    onClick={() => setExpression(item.expression)}
                    className="block w-full rounded-2xl border border-slate-800 bg-slate-950/70 p-4 text-left hover:bg-slate-800/70"
                  >
                    <div className="truncate text-sm text-slate-300">{item.expression}</div>
                    <div className="mt-1 truncate text-base text-emerald-300">{item.result}</div>
                  </button>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}