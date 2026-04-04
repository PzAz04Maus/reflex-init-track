"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ContainerInstance = exports.ContainerDefinition = void 0;
class ContainerDefinition {
    id;
    name;
    capacityWeight;
    voucherDefinitions;
    voucherLimits;
    description;
    defaultMode;
    constructor(input) {
        this.id = input.id;
        this.name = input.name;
        this.capacityWeight = input.capacityWeight;
        this.voucherDefinitions = input.voucherDefinitions?.map((voucher) => ({ ...voucher }));
        this.voucherLimits = input.voucherLimits ? { ...input.voucherLimits } : undefined;
        this.description = input.description;
        this.defaultMode = input.defaultMode;
    }
    toInit() {
        return {
            id: this.id,
            name: this.name,
            capacityWeight: this.capacityWeight,
            voucherDefinitions: this.voucherDefinitions?.map((voucher) => ({ ...voucher })),
            voucherLimits: this.voucherLimits ? { ...this.voucherLimits } : undefined,
            description: this.description,
            defaultMode: this.defaultMode,
        };
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
