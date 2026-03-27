import { rollOoda } from "../dice/rolls";

/** @extends {ActorSheet} */
export class ReflexActorSheet extends ActorSheet {
  static get defaultOptions() /*: ActorSheet.Options*/ {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["reflex-system", "sheet", "actor"],
      width: 650,
      height: 680
    });
  }

  get template(): string {
    return `systems/reflex-system/templates/actor/actor-sheet.hbs`;
  }

  async getData(options?: Partial<DocumentSheet.GetDataOptions>) {
    const context = await super.getData(options);
    return {
      ...context,
      system: this.actor.system,
      editable: this.isEditable
    };
  }

  activateListeners(html: JQuery): void {
    super.activateListeners(html);
    html.find("[data-action='roll-ooda']").on("click", async () => {
      await rollOoda(this.actor);
    });
  }
}
