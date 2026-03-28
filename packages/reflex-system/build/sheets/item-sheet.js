export class ReflexItemSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["reflex-system", "sheet", "item"],
            width: 500,
            height: 420
        });
    }
    get template() {
        return `systems/reflex-system/templates/item/item-sheet.hbs`;
    }
    async getData(options) {
        const context = await super.getData(options);
        return {
            ...context,
            system: this.item.system,
            editable: this.isEditable
        };
    }
}
