import { addActor } from '../../core/rules';
import type { ReflexState } from '../../core/types';
import { createInitialState } from '../../core/state/stateGet';
import { ReflexSchedulerPanel } from './panel';
import { getScheduleState, setScheduleState } from './store';

let panel: ReflexSchedulerPanel | null = null;

function randomD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

// NOTE: This function will need to be updated to use the new AddActorInput structure if the core changes
async function seedFromCombat(combat: any): Promise<ReflexState> {
  let state = createInitialState();
  const combatants = Array.from(combat.combatants ?? []);

  for (const combatant of combatants) {
    const actor = combatant.actor;
    const ownerUser = game.users?.find((user: any) => actor?.testUserPermission?.(user, foundry?.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3));

    state = addActor(state, {
      character: {
        id: combatant.id,
        name: combatant.name ?? actor?.name ?? 'Unknown',
        roll: randomD20(),
        oodaTN: 10,
        baseInit: 4,
        ownerUserId: ownerUser?.id ?? null,
        actorUuid: actor?.uuid ?? null,
        combatantId: combatant.id,
      },
      state: {
        joined: false,
        plannedAction: '',
      }
    });
  }

  return state;
}

export function registerReflexScheduler(): void {
  Hooks.once('ready', () => {
    panel = new ReflexSchedulerPanel();

    Hooks.on('getSceneControlButtons', (controls: any[]) => {
      controls.push({
        name: 'reflex-scheduler',
        title: 'Reflex Scheduler',
        icon: 'fas fa-stopwatch',
        layer: 'TokenLayer',
        tools: [
          {
            name: 'open-reflex-scheduler',
            title: 'Open Reflex Scheduler',
            icon: 'fas fa-list-ol',
            button: true,
            onClick: () => panel?.render(true)
          },
          {
            name: 'import-combatants',
            title: 'Import Combatants',
            icon: 'fas fa-user-plus',
            button: true,
            // onClick: () => ...
          }
        ]
      });
    });
  });
}
