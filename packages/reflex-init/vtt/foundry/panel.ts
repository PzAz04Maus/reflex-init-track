import { advanceTurn, updateActorAction, updateActorCost } from '../../core/rules.js';
import { rollD20 } from '../../core/roller/roll.js';
import { getNextActors } from '../../core/state/getNextActor.js';
import { selectActors } from '../../core/selectors/combatSelectors.js';
import { MODULE_ID } from './constants.js';
import { getScheduleState, setScheduleState } from './store.js';

// Use Application directly (remove ApplicationV2)
// Use ApplicationV2 for Foundry VTT v13+
export class ReflexSchedulerPanel extends foundry.applications.api.ApplicationV2 {
  static get defaultOptions() {
    return foundry.utils.mergeObject(super.defaultOptions, {
      id: `${MODULE_ID}-panel`,
      classes: [MODULE_ID],
      title: 'Reflex Scheduler',
      width: 760,
      height: 'auto',
      template: `modules/${MODULE_ID}/templates/foundry/schedule-panel.hbs`,
      resizable: true
    });
  }
  // getData is the V2 context method
  async getData(_options = {}) {
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

  // activateListeners replaces _onRender for DOM events
  activateListeners(html: JQuery<HTMLElement>) {
    super.activateListeners(html);
    html.find('[data-action="advance-turn"]').on('click', async () => {
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
