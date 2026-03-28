export declare class ReflexSchedulerPanel extends foundry.applications.api.ApplicationV2 {
    static get defaultOptions(): any;
    getData(_options?: {}): Promise<{
        hasCombat: boolean;
        round: number;
        actors: {
            isActive: boolean;
            margin: number;
            isOwner: any;
            id: import("reflex-shared").CharacterId;
            name: string;
            ownerUserId?: string | null;
            actorUuid?: string | null;
            combatantId?: string | null;
            data: import("reflex-shared").CharacterData;
            bio: import("reflex-shared").CharacterBio;
            equipment: import("reflex-shared").EquipmentState;
            init: import("reflex-shared").InitiativeState;
            action?: import("reflex-shared").ActionState | null;
        }[];
    }>;
    activateListeners(html: JQuery<HTMLElement>): void;
}
//# sourceMappingURL=panel.d.ts.map