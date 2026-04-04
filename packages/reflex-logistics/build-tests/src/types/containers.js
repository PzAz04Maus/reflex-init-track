"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerInstance = exports.ContainerDefinition = void 0;
class ContainerDefinition {
    id;
    name;
    weight;
    capacityWeight;
    attachmentPointCost;
    itemVoucherRules;
    containerVoucherRules;
    tags;
    barterValue;
    streetPrice;
    voucherDefinitions;
    voucherLimits;
    voucherCost;
    voucherBonus;
    description;
    defaultMode;
    constructor(input) {
        this.id = input.id;
        this.name = input.name;
        this.weight = input.weight;
        this.capacityWeight = input.capacityWeight;
        this.attachmentPointCost = input.attachmentPointCost;
        this.itemVoucherRules = input.itemVoucherRules?.map((rule) => ({
            ...rule,
            acceptedItemTags: [...rule.acceptedItemTags],
        }));
        this.containerVoucherRules = input.containerVoucherRules?.map((rule) => ({
            ...rule,
            acceptedContainerTags: [...rule.acceptedContainerTags],
        }));
        this.tags = input.tags ? [...input.tags] : undefined;
        this.barterValue = input.barterValue;
        this.streetPrice = input.streetPrice;
        this.voucherDefinitions = input.voucherDefinitions?.map((voucher) => ({ ...voucher }));
        this.voucherLimits = input.voucherLimits ? { ...input.voucherLimits } : undefined;
        this.voucherCost = input.voucherCost ? { ...input.voucherCost } : undefined;
        this.voucherBonus = input.voucherBonus ? { ...input.voucherBonus } : undefined;
        this.description = input.description;
        this.defaultMode = input.defaultMode;
    }
    toInit() {
        return {
            id: this.id,
            name: this.name,
            weight: this.weight,
            capacityWeight: this.capacityWeight,
            attachmentPointCost: this.attachmentPointCost,
            itemVoucherRules: this.itemVoucherRules?.map((rule) => ({
                ...rule,
                acceptedItemTags: [...rule.acceptedItemTags],
            })),
            containerVoucherRules: this.containerVoucherRules?.map((rule) => ({
                ...rule,
                acceptedContainerTags: [...rule.acceptedContainerTags],
            })),
            tags: this.tags ? [...this.tags] : undefined,
            barterValue: this.barterValue,
            streetPrice: this.streetPrice,
            voucherDefinitions: this.voucherDefinitions?.map((voucher) => ({ ...voucher })),
            voucherLimits: this.voucherLimits ? { ...this.voucherLimits } : undefined,
            voucherCost: this.voucherCost ? { ...this.voucherCost } : undefined,
            voucherBonus: this.voucherBonus ? { ...this.voucherBonus } : undefined,
            description: this.description,
            defaultMode: this.defaultMode,
        };
    }
    hasTag(tag) {
        return this.tags?.includes(tag) ?? false;
    }
    hasVoucher(key) {
        return Boolean(this.voucherLimits?.[key] ?? this.voucherDefinitions?.some((voucher) => voucher.key === key));
    }
    instantiate(input = {}) {
        return new ContainerInstance({
            ...this.toInit(),
            mode: input.mode,
            location: input.location,
        });
    }
}
exports.ContainerDefinition = ContainerDefinition;
class ContainerInstance extends ContainerDefinition {
    mode;
    location;
    constructor(input) {
        super(input);
        this.mode = input.mode ?? input.defaultMode ?? "bin";
        this.location = input.location ?? { kind: "root" };
    }
    toInstanceInit() {
        return {
            ...this.toInit(),
            mode: this.mode,
            location: this.location,
        };
    }
    isAt(location) {
        if (this.location.kind !== location.kind) {
            return false;
        }
        if (this.location.kind === "root") {
            return true;
        }
        return location.kind === "container" && this.location.containerId === location.containerId;
    }
    withMode(mode) {
        return new ContainerInstance({
            ...this.toInstanceInit(),
            mode,
        });
    }
    withLocation(location) {
        return new ContainerInstance({
            ...this.toInstanceInit(),
            location,
        });
    }
}
exports.ContainerInstance = ContainerInstance;
