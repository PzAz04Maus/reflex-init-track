import { registerReflexDebugPanel, ReflexSchedulerPanel } from 'reflex-ui/foundry';

Hooks.once('init', () => {
  foundry.applications.handlebars.loadTemplates([
    'modules/reflex/templates/foundry/debug-panel.hbs'
  ]);
});

const schedulerPanel = new ReflexSchedulerPanel();

export function registerReflexScheduler(): void {
  registerReflexDebugPanel();

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
          onClick: () => schedulerPanel.render(true)
        },
        {
          name: 'import-combatants',
          title: 'Import Combatants',
          icon: 'fas fa-user-plus',
          button: true,
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
