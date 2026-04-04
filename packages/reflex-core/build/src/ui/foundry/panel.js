import { advanceTurn, getNextActors, selectActors } from 'reflex-core';
import { MODULE_ID } from '../../vtt/foundry/constants.js';
import { getScheduleState, setScheduleState } from '../../vtt/foundry/store.js';
export class ReflexSchedulerPanel extends foundry.applications.api.ApplicationV2 {
    static DEFAULT_OPTIONS = foundry.utils.mergeObject(super.DEFAULT_OPTIONS, {
        id: `${MODULE_ID}-panel`,
        classes: [MODULE_ID],
        title: 'Reflex Scheduler',
        width: 760,
        height: 'auto',
        template: `modules/${MODULE_ID}/templates/foundry/schedule-panel.hbs`,
        resizable: true
    });
    async getData(_options = {}) {
        const combat = game.combats?.active;
        const state = combat ? await getScheduleState(combat) : null;
        const actors = state ? selectActors(state) : [];
        const activeIds = new Set(state ? getNextActors(state).map((actor) => actor.id) : []);
        function rollD20() {
            return Math.floor(Math.random() * 20) + 1;
        }
        return {
            hasCombat: Boolean(combat),
            round: state?.round ?? 1,
            actors: actors.map((actor) => ({
                ...actor,
                isActive: activeIds.has(actor.id),
                margin: (actor.data?.ooda ?? 0) - rollD20(),
                isOwner: !actor.ownerUserId || actor.ownerUserId === game.user?.id || game.user?.isGM
            }))
        };
    }
    activateListeners(html) {
        super.activateListeners(html);
        html.find('[data-action="advance-turn"]').on('click', async () => {
            const combat = game.combats?.active;
            if (!combat)
                return;
            const state = await getScheduleState(combat);
            if (!state)
                return;
            const result = advanceTurn(state);
            await setScheduleState(combat, result.state);
            this.render(true);
        });
    }
}
