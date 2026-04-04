export class ReflexActorSheet extends ActorSheet {
  static override get defaultOptions(): ActorSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["reflex-system", "sheet", "actor"],
      width: 650,
      height: 680
    });
  }

  override get template(): string {
    return `systems/reflex-system/templates/actor/actor-sheet.hbs`;
  }

  override async getData(options?: any): Promise<Record<string, unknown>> {
    const context = await super.getData(options);
    return {
      ...context,
      system: this.actor.system,
      editable: this.isEditable
    };
  }

  override activateListeners(html: JQuery): void {
    super.activateListeners(html);
    // html.find("[data-action='roll-ooda']").on("click", async () => {
    //   await rollOoda(this.actor);
    // });
  }
}