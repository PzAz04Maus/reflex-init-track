import { createContainerDefinition } from "../inventory";
import type { ContainerDefinition, ContainerDefinitionInit, VoucherPool } from "../types";

export type PortableContainerDefinition = ContainerDefinitionInit & {
  id: string;
  name: string;
  weight: number;
};

export function defineContainer(input: PortableContainerDefinition): ContainerDefinition {
  return createContainerDefinition(input);
}

export function createItemRule(key: string, acceptedItemTags: string[], unitsPerItem = 1) {
  return { key, acceptedItemTags, unitsPerItem };
}

export function createContainerRule(
  key: string,
  acceptedContainerTags: string[],
  unitsPerContainer = 1,
) {
  return { key, acceptedContainerTags, unitsPerContainer };
}

export function defineAttachmentContainer(
  input: PortableContainerDefinition & {
    attachmentPointCost?: number;
    beltComponent?: boolean;
  },
): ContainerDefinition {
  const voucherCost: VoucherPool = {
    ...(input.voucherCost ?? {}),
    ...(input.attachmentPointCost !== undefined ? { "mlbe:ap": input.attachmentPointCost } : {}),
    ...(input.attachmentPointCost === undefined
      ? (input.beltComponent ? { "lbe:component": 1, "lbe:belt-component": 1 } : { "lbe:component": 1 })
      : {}),
  };

  return defineContainer({
    ...input,
    attachmentPointCost: input.attachmentPointCost,
    voucherCost,
  });
}

// TODO: capacity weight is used for liters and kilogram carrying capacities.
// Need to figure out how to handle this better, since it's confusing to have a
// weight capacity that isn't actually a weight.