import type { CombatState } from "../../core/types";

export function DebugState({ state }: { state: CombatState }) {
  return (
    <div>
      <h2>Debug State</h2>
      <pre>{JSON.stringify(state, null, 2)}</pre>
    </div>
  );
}