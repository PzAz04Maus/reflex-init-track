export class ReflexItemSheet extends ItemSheet {
  static override get defaultOptions(): ItemSheet.Options {
    return foundry.utils.mergeObject(super.defaultOptions, {
      classes: ["reflex-system", "sheet", "item"],
      width: 500,
      height: 420
    });
  }

  override get template(): string {
    return `systems/reflex-system/templates/item/item-sheet.hbs`;
  }

  override async getData(options?: any): Promise<Record<string, unknown>> {
    const context = await super.getData(options);
    const item = this.object as Item & { system: Record<string, unknown> };

    return {
      ...context,
      item,
      system: item.system,
      editable: this.isEditable
    };
  }
}