export class ReflexActorSheet extends ActorSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["foundry-system", "sheet", "actor"],
            width: 650,
            height: 680
        });
    }
    get template() {
        return `systems/foundry-system/templates/actor/actor-sheet.hbs`;
    }
    async getData(options) {
        const context = await super.getData(options);
        return {
            ...context,
            system: this.actor.system,
            editable: this.isEditable
        };
    }
    activateListeners(html) {
        super.activateListeners(html);
        // html.find("[data-action='roll-ooda']").on("click", async () => {
        //   await rollOoda(this.actor);
        // });
    }
}
