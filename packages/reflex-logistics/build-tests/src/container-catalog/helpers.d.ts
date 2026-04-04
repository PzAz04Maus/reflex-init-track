import type { ContainerDefinition, ContainerDefinitionInit } from "../types";
export type PortableContainerDefinition = ContainerDefinitionInit & {
    id: string;
    name: string;
    weight: number;
};
export declare function defineContainer(input: PortableContainerDefinition): ContainerDefinition;
export declare function createItemRule(key: string, acceptedItemTags: string[], unitsPerItem?: number): {
    key: string;
    acceptedItemTags: string[];
    unitsPerItem: number;
};
export declare function createContainerRule(key: string, acceptedContainerTags: string[], unitsPerContainer?: number): {
    key: string;
    acceptedContainerTags: string[];
    unitsPerContainer: number;
};
export declare function defineAttachmentContainer(input: PortableContainerDefinition & {
    attachmentPointCost?: number;
    beltComponent?: boolean;
}): ContainerDefinition;
//# sourceMappingURL=helpers.d.ts.map