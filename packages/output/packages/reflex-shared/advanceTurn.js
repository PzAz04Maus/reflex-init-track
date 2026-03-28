import { selectActors, withActors } from './selectors/combatSelectors';
export function addActor(state, input) {
    const existing = selectActors(state);
    const { character } = input;
    return withActors(state, [...existing, character]);
}
