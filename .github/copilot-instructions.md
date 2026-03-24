# Reflex Init Track — Copilot Workspace Instructions

## Project Intent
This workspace is for a front-end-first TypeScript tool that prototypes the **Reflex initiative / time-track system** before any VTT integration.

The immediate goal is to build:
- a standalone front-end app for rapid iteration in VS Code
- a pure TypeScript core for rules and state transitions
- a clean adapter boundary so VTT integration can be added later without rewriting the core

## Current Development Priority
Build the project in this order:

1. **Core rules**
   - Define data types for actors, combat state, and actions
   - Implement pure functions for initiative/time-track logic
   - Keep this layer independent from UI and any VTT APIs

2. **Front-end app**
   - Build a local sandbox UI around the core logic
   - Use mock data and scenario presets first
   - Treat the app as a test bench for mechanic flow and usability

3. **VTT adapter**
   - Add integration only after the core rules and front end are stable
   - Keep all VTT-specific code in a separate adapter layer

## Architecture Rules
Use a layered structure:

- `src/core/`
  - Pure TypeScript only
  - No React components
  - No DOM access
  - No VTT API calls
  - No side effects unless clearly isolated

- `src/app/`
  - React UI and local interaction logic
  - Uses the core as a dependency
  - May include mock data, debug panels, and scenario loaders

- `src/vtt/`
  - Future adapter layer for Foundry or another VTT
  - Converts VTT data into internal core types
  - Should be the only place that touches VTT APIs

Dependency direction should always be:

`app -> core`
`vtt -> core`

Never:
- `core -> app`
- `core -> vtt`

## Recommended Starter Structure
```text
src/
  core/
    types.ts
    reducer.ts
    rules/
      advanceTurn.ts
    selectors/
      getNextActors.ts
  app/
    App.tsx
    mockData.ts
    components/
      ActorList.tsx
      DebugState.tsx
  vtt/
    adapter.ts
```

## Coding Conventions
- Use **TypeScript**, not plain JavaScript
- Prefer **strict typing**
- Prefer **small pure functions**
- Prefer **plain objects and reducers** over class-heavy designs
- Keep files focused and short
- Put rule logic in `core`, not in button handlers
- UI components should stay thin and call reducer actions or core functions

## State Management Guidance
The tool is expected to be state-heavy. Prefer a reducer-style approach for combat state.

Examples of likely actions:
- add actor
- remove actor
- advance turn
- change action cost
- mark actor joined / inactive
- reset encounter
- load scenario

Keep state transitions explicit and testable.

## Testing Guidance
As soon as core logic exists:
- add tests for pure rule functions
- cover ties, edge cases, empty states, and late joins
- verify behavior with deterministic mock data

The preferred test target is the `core` layer, not UI snapshots.

## UI Guidance
The first app should be a sandbox, not a polished product.

Useful early UI features:
- add / edit / remove actors
- advance turn
- highlight next actor(s)
- show current ordering
- show raw state for debugging
- load mock scenarios
- reset encounter

A debug JSON panel is useful and encouraged during early development.

## VTT Integration Guidance
Do not build directly against a VTT first.

When VTT integration begins:
- isolate all VTT reads/writes in `src/vtt/`
- convert external actor/combat data into internal `core` types
- keep the internal state model stable even if the VTT model changes

## What Copilot Should Optimize For
When assisting in this repo, prioritize:
- performance
- readability
- separation of concerns
- pure functions
- reducer-driven state changes
- strongly typed interfaces
- small composable modules
- front-end-first local iteration

Avoid suggesting:
- premature VTT coupling
- heavy abstraction without clear need
- mixing UI logic with rules logic
- class hierarchies where simple functions and data structures are enough

## Preferred First Milestone
A good initial milestone is:
- one-page app
- mock combat state
- actor list
- add actor
- edit action cost
- advance turn
- highlight next actor(s)
- raw state/debug display

## Maintenance Notes
As the project matures, update this file with:
- build commands
- test commands
- package manager choice
- lint/format rules
- VTT target details
- any known constraints or pitfalls
