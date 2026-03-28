// @ts-ignore: Foundry VTT global
declare function loadTemplates(paths: string[]): Promise<void>;
import { addActor, createInitialState } from 'reflex-shared';
import type { CombatState } from 'reflex-shared';
import { ReflexSchedulerPanel } from './panel.js';
import { ReflexDebugPanel } from './debug-panel.js';
// Register the debug panel template using the new namespaced loadTemplates and module-relative path
Hooks.once('init', () => {
  foundry.applications.handlebars.loadTemplates([
    'modules/reflex/templates/foundry/debug-panel.hbs'
  ]);
});
import { getScheduleState, setScheduleState } from './store.js';

let panel: ReflexSchedulerPanel | null = null;

function randomD20(): number {
  return Math.floor(Math.random() * 20) + 1;
}

// NOTE: This function will need to be updated to use the new AddActorInput structure if the core changes
async function seedFromCombat(combat: any): Promise<CombatState> {
  let state = createInitialState();
  const combatants = Array.from(combat.combatants ?? []) as any[];//placeholder

  for (const combatant of combatants) {
    const actor = combatant.actor;
    const ownerUser = game.users?.find((user: any) => actor?.testUserPermission?.(user, foundry?.CONST?.DOCUMENT_OWNERSHIP_LEVELS?.OWNER ?? 3));

    state = addActor(state, {
      character: {
        id: combatant.id,
        name: combatant.name ?? actor?.name ?? 'Unknown',
        ownerUserId: ownerUser?.id ?? null,
        actorUuid: actor?.uuid ?? null,
        combatantId: combatant.id,
        data: {
          ooda: 10 // Placeholder, adjust as needed
        },
        bio: {}, // Fill with actual bio data if available
        equipment: {}, // Fill with actual equipment if available
        init: {
          base: 4, // Placeholder base initiative
          initial: randomD20(),
          val: 0, // Will be computed elsewhere
          joined: false
        },
        action: null
      },
      state: {
        joined: false
      }
    });
  }

  return state;
}

export function registerReflexScheduler(): void {
// Register the Reflex Scheduler control group at the top level so the hook fires in time
let panel: ReflexSchedulerPanel | null = null;
panel = new ReflexSchedulerPanel();
console.log('Reflex | Registering getSceneControlButtons hook');
Hooks.on('getSceneControlButtons', (controls: any) => {
  const group = {
    name: 'reflex-scheduler',
    title: 'Reflex Scheduler',
    icon: 'fas fa-list-ol',
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
  };
  controls['reflex-scheduler'] = group;
  console.log('Reflex | Added control group:', group);
});
}

registerReflexScheduler();

console.log("Reflex | init.ts loaded");
console.log("Reflex | Foundry ready hook fired");
