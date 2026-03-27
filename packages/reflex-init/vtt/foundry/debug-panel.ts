/**
 * Foundry Application-based debug panel for Reflex Init Tracker
 */
// Use the Foundry VTT ApplicationV2 base and Handlebars mixin
const MixedApplication = HandlebarsApplicationMixin.mixed(ApplicationV2);

export class ReflexDebugPanel extends MixedApplication {
  static DEFAULT_OPTIONS = {
    id: "reflex-debug-panel",
    classes: ["reflex-debug-panel"],
    tag: 'section',
    window: {
      title: 'Reflex Init Debug Panel'
    },
    position: {
      width: 400,
      height: 600
    }
  };

  async _prepareContext(): Promise<Record<string, unknown>> {
    // TODO: Replace with actual state from your tracker
    return {
      actors: game.actors?.contents || [],
      trackerState: game.modules.get("reflex-scheduler")?.api?.getState?.() || {},
    };
  }

  async _renderHTML(context: Record<string, unknown>): Promise<string> {
    return renderTemplate('templates/foundry/debug-panel.hbs', context);
  }

  async _onRender(_context: Record<string, unknown>, _options: Record<string, unknown>): Promise<void> {
    const root = document.querySelector('#reflex-debug-panel');
    if (!root) return;
    root.querySelector('.advance-turn')?.addEventListener('click', () => {
      game.modules.get("reflex-scheduler")?.api?.advanceTurn?.();
      this.render(true);
    });
    // Add more listeners as needed
  }
}

// Register a control button to open the debug panel
Hooks.on("getSceneControlButtons", (controls: any[]) => {
  controls.push({
    name: "reflex-debug",
    title: "Reflex Debug Panel",
    icon: "fas fa-bug",
    button: true,
    onClick: () => {
      new ReflexDebugPanel().render(true);
    },
  });
});
