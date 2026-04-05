export class ReflexItemSheet extends ItemSheet {
    static get defaultOptions() {
        return foundry.utils.mergeObject(super.defaultOptions, {
            classes: ["foundry-system", "sheet", "item"],
            width: 500,
            height: 420
        });
    }
    get template() {
        return `systems/foundry-system/templates/item/item-sheet.hbs`;
    }
    async getData(options) {
        const context = await super.getData(options);
        const item = this.object;
        return {
            ...context,
            item,
            system: item.system,
            editable: this.isEditable
        };
    }
}
