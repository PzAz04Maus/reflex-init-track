import { advanceTurn, updateActorAction, updateActorCost } from '../../core/rules.js';
import { rollD20 } from '../../core/roller/roll.js';
import { getNextActors } from '../../core/state/getNextActor.js';
import { selectActors } from '../../core/selectors/combatSelectors.js';
import { MODULE_ID } from './constants.js';
import { getScheduleState, setScheduleState } from './store.js';

// Use Application directly (remove ApplicationV2)
export class ReflexSchedulerPanel extends Application {
  static DEFAULT_OPTIONS = {
    // id: `${MODULE_ID}-panel`,
    // classes: [MODULE_ID],
    // tag: 'section',
    // window: {
    //   title: 'Reflex Scheduler'
    // },
    // position: {
    //   width: 760,
    //   height: 'auto'
    // }
  };
 async _prepareContext(): Promise<Record<string, unknown>> {
   const combat = game.combats?.active;
   const state = combat ? await getScheduleState(combat) : null;
   const actors = state ? selectActors(state) : [];
   const activeIds = new Set(state ? getNextActors(state).map((actor) => actor.id) : []);
 
   return {
     hasCombat: Boolean(combat),
     round: state?.round ?? 1,
     actors: actors.map((actor) => ({
       ...actor,
       isActive: activeIds.has(actor.id),
      margin: ((actor.data?.ooda ?? 0) - rollD20()),
       isOwner: !actor.ownerUserId || actor.ownerUserId === game.user?.id || game.user?.isGM
     }))
   };
 }
 
 async _renderHTML(context: Record<string, unknown>): Promise<string> {
   return renderTemplate(`modules/${MODULE_ID}/templates/foundry/schedule-panel.hbs`, context);
 }
 
 async _onRender(_context: Record<string, unknown>, _options: Record<string, unknown>): Promise<void> {
   const root = document.querySelector(`#${MODULE_ID}-panel`);
   if (!root) return;
 
   root.querySelector('[data-action="advance-turn"]')?.addEventListener('click', async () => {
     const combat = game.combats?.active;
     if (!combat) return;
     const state = await getScheduleState(combat);
     if (!state) return;
     const result = advanceTurn(state);
     await setScheduleState(combat, result.state);
     this.render(true);
   });
 }
}
