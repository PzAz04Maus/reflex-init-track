import { MODULE_ID } from 'foundry-system/foundry';
const MixedApplication = HandlebarsApplicationMixin.mixed(ApplicationV2);
let hasRegisteredDebugPanel = false;
export class ReflexDebugPanel extends MixedApplication {
    static DEFAULT_OPTIONS = {
        id: 'reflex-debug-panel',
        classes: ['reflex-debug-panel'],
        tag: 'section',
        window: {
            title: 'Reflex Init Debug Panel'
        },
        position: {
            width: 400,
            height: 600
        }
    };
    async _prepareContext() {
        return {
            actors: game.actors?.contents || [],
            trackerState: game.modules.get(MODULE_ID)?.api?.getState?.() || {},
        };
    }
    async _renderHTML(context) {
        return renderTemplate('templates/foundry/debug-panel.hbs', context);
    }
    async _onRender(_context, _options) {
        const root = document.querySelector('#reflex-debug-panel');
        if (!root) {
            return;
        }
        root.querySelector('.advance-turn')?.addEventListener('click', () => {
            game.modules.get(MODULE_ID)?.api?.advanceTurn?.();
            this.render(true);
        });
    }
}
export function registerReflexDebugPanel() {
    if (hasRegisteredDebugPanel) {
        return;
    }
    hasRegisteredDebugPanel = true;
    Hooks.on('getSceneControlButtons', (controls) => {
        controls.push({
            name: 'reflex-debug',
            title: 'Reflex Debug Panel',
            icon: 'fas fa-bug',
            button: true,
            onClick: () => {
                new ReflexDebugPanel().render(true);
            },
        });
    });
}
