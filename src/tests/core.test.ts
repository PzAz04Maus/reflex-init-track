import { describe, it, expect } from 'vitest';
import { advanceTurn } from '../core/rules/advanceTurn';
import { getNextActor } from '../core/state/getNextActor';

// Example: advanceTurn pure function test

describe('advanceTurn', () => {
  it('advances to the next actor', () => {
    const state = {
      actors: [
        { id: 'a', name: 'A', tick: 0, actionCost: 4, joined: true },
        { id: 'b', name: 'B', tick: 0, actionCost: 4, joined: true },
      ],
    };
    const newState = advanceTurn(state);
    expect(newState.actors[0].tick).not.toBe(state.actors[0].tick);
  });
});

describe('getNextActor', () => {
  it('returns the next actor', () => {
    const state = {
      actors: [
        { id: 'a', name: 'A', tick: 0, actionCost: 4, joined: true },
        { id: 'b', name: 'B', tick: 1, actionCost: 4, joined: true },
      ],
    };
    const next = getNextActor(state);
    expect(next.id).toBe('a');
  });
});
