import { advanceTurn, getNextActors, selectActors } from 'reflex-mechanics';
import { MODULE_ID, getScheduleState, setScheduleState } from 'foundry-system/foundry';
export class ReflexSchedulerPanel extends foundry.applications.api.ApplicationV2 {
    static DEFAULT_OPTIONS = {
        id: `${MODULE_ID}-panel`,
        classes: [MODULE_ID],
        tag: 'section',
        window: {
            title: 'Reflex Scheduler'
        },
        position: {
            width: 760,
            height: 'auto'
        }
    };
    async _prepareContext() {
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
                id: actor.id,
                name: actor.name,
                tick: actor.init.val,
                actionCost: actor.action?.cost ?? 0,
                plannedAction: actor.action?.name ?? '',
                actionCadence: actor.action?.cadence ?? '',
                actionCategory: actor.action?.category ?? '',
                actionSummary: actor.action?.summary ?? '',
                actionDetail: actor.action?.detail ?? '',
                isActive: activeIds.has(actor.id),
                margin: (actor.data?.ooda ?? 0) - rollD20(),
                oodaTN: actor.data?.ooda ?? 0,
                roll: rollD20(),
                aheadOfBang: false,
                onBang: false,
                lateOfBang: false,
                canShoot: false,
                isOwner: !actor.ownerUserId || actor.ownerUserId === game.user?.id || game.user?.isGM
            }))
        };
    }
    async _onRender(_context, _options) {
        const root = this.element;
        if (!root) {
            return;
        }
        root.querySelector('[data-action="advance-turn"]')?.addEventListener('click', async () => {
            const combat = game.combats?.active;
            if (!combat) {
                return;
            }
            const state = await getScheduleState(combat);
            if (!state) {
                return;
            }
            const result = advanceTurn(state);
            await setScheduleState(combat, result.state);
            this.render(true);
        });
    }
}
