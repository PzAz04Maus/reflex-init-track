import { createItemDefinition } from "./inventory";
import type { ItemDefinition } from "./types";

type SmallArmsAmmoCategory = "pistol-cartridge" | "rifle-cartridge" | "shotgun-shell";
type SmallArmsSpecialAmmoCode = "AP" | "HP" | "T";

type AmmunitionRow = {
	caliber: string;
	category: SmallArmsAmmoCategory;
	weightKgPer100Rounds: number;
	barterValue: string;
	streetPrice: number;
	availableSpecialTypes: SmallArmsSpecialAmmoCode[];
	magazineWeightNotes?: string[];
};

type SmallArmsAmmunitionDefinition = {
	id: string;
	caliber: string;
	category: SmallArmsAmmoCategory;
	weightKgPer100Rounds: number;
	barterValue: string;
	streetPrice: number;
	availableSpecialTypes: SmallArmsSpecialAmmoCode[];
	magazineWeightNotes: string[];
	ball?: ItemDefinition;
	slug?: ItemDefinition;
	armorPiercing?: ItemDefinition;
	hollowpoint?: ItemDefinition;
	tracer?: ItemDefinition;
	buckshot?: ItemDefinition;
};

const SPECIAL_AMMO_MULTIPLIERS: Record<SmallArmsSpecialAmmoCode, number> = {
	AP: 5,
	HP: 2,
	T: 4,
};

const SPECIAL_AMMO_LABELS: Record<SmallArmsSpecialAmmoCode, string> = {
	AP: "Armor-Piercing",
	HP: "Hollowpoint",
	T: "Tracer",
};

export const SMALL_ARMS_AMMUNITION_RULES = {
	defaultLoading: "Unless otherwise noted, listed ammunition weights and prices are for default ball/FMJ loads in 100-round lots.",
	armorPiercing: [
		"Armor-piercing ammunition uses a hard metal core or tip to enhance armor penetration at the cost of overpenetration through soft targets.",
		"AP ammunition has a Damage rating 1 lower than normal and a Penetration rating one step better than normal.",
		"AP ammunition costs 5x the base value for that caliber.",
	],
	hollowpoint: [
		"Hollowpoint ammunition exposes part of the lead core, improving expansion in soft tissue but reducing retained structural integrity on impact.",
		"HP ammunition has a Damage rating 2 greater than normal and a Penetration rating one step worse than normal.",
		"HP ammunition costs 2x the base value for that caliber.",
		"HP ammunition is commonly issued to military police and security personnel rather than line troops.",
	],
	tracer: [
		"Tracer ammunition uses a small incendiary charge at the base of the bullet to produce a visible streak in flight.",
		"Tracer has the same damage characteristics as default ball/FMJ ammunition of the same caliber.",
		"When used in belts or mixed into ammunition at roughly a 1:4 ratio, tracer provides an additional +1 bonus to burst attacks.",
		"Tracer ammunition costs 4x the base value for that caliber and may start fires at the GM's discretion.",
	],
	buckshot: [
		"Shotgun weapon data assumes slug ammunition by default.",
		"When firing buckshot, halve the weapon's base Damage, reduce Penetration to Nil, and grant a +2 attack bonus.",
		"The attacker's margin of success is doubled for purposes of determining final Damage when firing buckshot.",
		"Buckshot costs the same as slug ammunition.",
	],
} as const;

function slugify(value: string): string {
	return value
		.toLowerCase()
		.replace(/[^a-z0-9]+/g, "-")
		.replace(/^-+|-+$/g, "");
}

function parseBarterValue(value: string): number {
	return Number(value.replace(/^GG/, "").replace(/,/g, ""));
}

function formatBarterValue(value: number): string {
	const rounded = Math.round(value * 100) / 100;
	const fixed = rounded.toFixed(2).replace(/\.00$/, "").replace(/(\.\d)0$/, "$1");
	const [wholePart, fractionalPart] = fixed.split(".");
	const withGrouping = Number(wholePart).toLocaleString("en-US");
	return fractionalPart ? `GG${withGrouping}.${fractionalPart}` : `GG${withGrouping}`;
}

function getCategoryTags(category: SmallArmsAmmoCategory): string[] {
	switch (category) {
		case "pistol-cartridge":
			return ["ammunition", "small-arms-ammunition", "pistol-ammunition"];
		case "rifle-cartridge":
			return ["ammunition", "small-arms-ammunition", "rifle-ammunition"];
		case "shotgun-shell":
			return ["ammunition", "small-arms-ammunition", "shotgun-ammunition"];
	}
}

function getLotLabel(category: SmallArmsAmmoCategory): string {
	return category === "shotgun-shell" ? "100 shells" : "100 rounds";
}

function getAvailableTypeLabel(types: SmallArmsSpecialAmmoCode[]): string | undefined {
	if (types.length === 0) {
		return undefined;
	}

	return types.map((type) => SPECIAL_AMMO_LABELS[type]).join(", ");
}

function createMagazineWeightNotes(magazineWeightNotes: string[]): string[] {
	return magazineWeightNotes.length > 0
		? [`Loaded magazine weights: ${magazineWeightNotes.join(", ")}.`]
		: [];
}

function createBaseAmmunitionItem(row: AmmunitionRow): ItemDefinition {
	const familyId = `${row.category}:${slugify(row.caliber)}`;
	const isShotgun = row.category === "shotgun-shell";
	const availableTypeLabel = getAvailableTypeLabel(row.availableSpecialTypes);
	const notes = [
		...createMagazineWeightNotes(row.magazineWeightNotes ?? []),
		isShotgun
			? "Default shotgun values assume slug ammunition."
			: "Default weapon values assume ball/FMJ ammunition.",
		...(isShotgun
			? ["Also available as buckshot at the same listed cost and weight."]
			: availableTypeLabel
				? [`Available special loadings: ${availableTypeLabel}.`]
				: []),
	];

	return createItemDefinition({
		id: `ammo:${familyId}:${isShotgun ? "slug" : "ball"}:100`,
		name: `${row.caliber} ${isShotgun ? "shotshells" : "ammunition"} (${isShotgun ? "Slug" : "Ball / FMJ"}, ${getLotLabel(row.category)})`,
		weight: row.weightKgPer100Rounds,
		tags: [
			...getCategoryTags(row.category),
			`caliber:${slugify(row.caliber)}`,
			isShotgun ? "slug" : "ball",
		],
		barterValue: row.barterValue,
		streetPrice: row.streetPrice,
		description: isShotgun
			? `Per-100-shell lot of ${row.caliber} slug shotshells.`
			: `Per-100-round lot of ${row.caliber} ball/FMJ ammunition.`,
		source: notes,
	});
}

function createSpecialAmmunitionItem(row: AmmunitionRow, type: SmallArmsSpecialAmmoCode): ItemDefinition {
	const familyId = `${row.category}:${slugify(row.caliber)}`;
	const multiplier = SPECIAL_AMMO_MULTIPLIERS[type];
	const notesByType: Record<SmallArmsSpecialAmmoCode, string[]> = {
		AP: [
			"Damage is 1 lower than normal for this caliber.",
			"Penetration is one step better than normal for this caliber.",
		],
		HP: [
			"Damage is 2 higher than normal for this caliber.",
			"Penetration is one step worse than normal for this caliber.",
		],
		T: [
			"Damage and penetration match the default ball/FMJ load for this caliber.",
			"Provides an additional +1 bonus to burst attacks when mixed or belted in tracer-heavy ratios.",
			"May start fires at the GM's discretion.",
		],
	};

	return createItemDefinition({
		id: `ammo:${familyId}:${slugify(SPECIAL_AMMO_LABELS[type])}:100`,
		name: `${row.caliber} ammunition (${SPECIAL_AMMO_LABELS[type]}, ${getLotLabel(row.category)})`,
		weight: row.weightKgPer100Rounds,
		tags: [
			...getCategoryTags(row.category),
			`caliber:${slugify(row.caliber)}`,
			slugify(SPECIAL_AMMO_LABELS[type]),
		],
		barterValue: formatBarterValue(parseBarterValue(row.barterValue) * multiplier),
		streetPrice: row.streetPrice * multiplier,
		description: `Per-100-round lot of ${row.caliber} ${SPECIAL_AMMO_LABELS[type].toLowerCase()} ammunition.`,
		source: [
			...createMagazineWeightNotes(row.magazineWeightNotes ?? []),
			...notesByType[type],
		],
	});
}

function createBuckshotItem(row: AmmunitionRow): ItemDefinition {
	const familyId = `${row.category}:${slugify(row.caliber)}`;

	return createItemDefinition({
		id: `ammo:${familyId}:buckshot:100`,
		name: `${row.caliber} shotshells (Buckshot, ${getLotLabel(row.category)})`,
		weight: row.weightKgPer100Rounds,
		tags: [
			...getCategoryTags(row.category),
			`caliber:${slugify(row.caliber)}`,
			"buckshot",
		],
		barterValue: row.barterValue,
		streetPrice: row.streetPrice,
		description: `Per-100-shell lot of ${row.caliber} buckshot shotshells.`,
		source: [
			...createMagazineWeightNotes(row.magazineWeightNotes ?? []),
			...SMALL_ARMS_AMMUNITION_RULES.buckshot,
		],
	});
}

function defineSmallArmsAmmunition(row: AmmunitionRow): SmallArmsAmmunitionDefinition {
	const base = createBaseAmmunitionItem(row);

	return {
		id: `${row.category}:${slugify(row.caliber)}`,
		caliber: row.caliber,
		category: row.category,
		weightKgPer100Rounds: row.weightKgPer100Rounds,
		barterValue: row.barterValue,
		streetPrice: row.streetPrice,
		availableSpecialTypes: [...row.availableSpecialTypes],
		magazineWeightNotes: [...(row.magazineWeightNotes ?? [])],
		ball: row.category === "shotgun-shell" ? undefined : base,
		slug: row.category === "shotgun-shell" ? base : undefined,
		armorPiercing: row.availableSpecialTypes.includes("AP") ? createSpecialAmmunitionItem(row, "AP") : undefined,
		hollowpoint: row.availableSpecialTypes.includes("HP") ? createSpecialAmmunitionItem(row, "HP") : undefined,
		tracer: row.availableSpecialTypes.includes("T") ? createSpecialAmmunitionItem(row, "T") : undefined,
		buckshot: row.category === "shotgun-shell" ? createBuckshotItem(row) : undefined,
	};
}

function collectAmmoItems(definition: SmallArmsAmmunitionDefinition): ItemDefinition[] {
	return [
		definition.ball,
		definition.slug,
		definition.armorPiercing,
		definition.hollowpoint,
		definition.tracer,
		definition.buckshot,
	].filter((item): item is ItemDefinition => Boolean(item));
}

const PISTOL_CARTRIDGE_ROWS: AmmunitionRow[] = [
	{ caliber: ".22 LR", category: "pistol-cartridge", weightKgPer100Rounds: 0.4, barterValue: "GG0.48", streetPrice: 12, availableSpecialTypes: ["HP"], magazineWeightNotes: ["0.1 kg (10)"] },
	{ caliber: ".25 ACP", category: "pistol-cartridge", weightKgPer100Rounds: 0.6, barterValue: "GG5.4", streetPrice: 54, availableSpecialTypes: ["HP"] },
	{ caliber: "5.7mm FN", category: "pistol-cartridge", weightKgPer100Rounds: 0.7, barterValue: "GG70", streetPrice: 102, availableSpecialTypes: ["AP", "HP"], magazineWeightNotes: ["0.3 kg (20)", "0.6 kg (50)"] },
	{ caliber: ".32 ACP", category: "pistol-cartridge", weightKgPer100Rounds: 0.8, barterValue: "GG6.6", streetPrice: 66, availableSpecialTypes: ["HP"] },
	{ caliber: ".380 ACP", category: "pistol-cartridge", weightKgPer100Rounds: 1.3, barterValue: "GG4.8", streetPrice: 48, availableSpecialTypes: ["HP"], magazineWeightNotes: ["0.2 kg (8)"] },
	{ caliber: ".38 ACP", category: "pistol-cartridge", weightKgPer100Rounds: 1.3, barterValue: "GG6", streetPrice: 60, availableSpecialTypes: ["HP"] },
	{ caliber: ".38 Special", category: "pistol-cartridge", weightKgPer100Rounds: 1.6, barterValue: "GG2.4", streetPrice: 60, availableSpecialTypes: ["HP"] },
	{ caliber: ".38 Super", category: "pistol-cartridge", weightKgPer100Rounds: 1.6, barterValue: "GG22", streetPrice: 64, availableSpecialTypes: ["HP"], magazineWeightNotes: ["0.2 kg (9)"] },
	{ caliber: ".357 SIG", category: "pistol-cartridge", weightKgPer100Rounds: 1.6, barterValue: "GG30", streetPrice: 75, availableSpecialTypes: ["HP"] },
	{ caliber: ".357 Magnum", category: "pistol-cartridge", weightKgPer100Rounds: 1.6, barterValue: "GG2.72", streetPrice: 68, availableSpecialTypes: ["AP", "HP"] },
	{ caliber: "9mm Makarov", category: "pistol-cartridge", weightKgPer100Rounds: 1.3, barterValue: "GG6.8", streetPrice: 68, availableSpecialTypes: ["HP"], magazineWeightNotes: ["0.2 kg (8)", "1.4 kg (64)"] },
	{ caliber: "9mm Parabellum", category: "pistol-cartridge", weightKgPer100Rounds: 1.7, barterValue: "GG5.2", streetPrice: 52, availableSpecialTypes: ["HP"], magazineWeightNotes: ["0.3 kg (15)", "0.7 kg (30)"] },
	{ caliber: ".40 S&W", category: "pistol-cartridge", weightKgPer100Rounds: 1.9, barterValue: "GG12.8", streetPrice: 64, availableSpecialTypes: ["HP"], magazineWeightNotes: ["0.3 kg (13)"] },
	{ caliber: "10mm Auto", category: "pistol-cartridge", weightKgPer100Rounds: 1.9, barterValue: "GG34.8", streetPrice: 87, availableSpecialTypes: ["HP"] },
	{ caliber: ".44 Magnum", category: "pistol-cartridge", weightKgPer100Rounds: 2.4, barterValue: "GG10.8", streetPrice: 108, availableSpecialTypes: ["HP"] },
	{ caliber: ".45 ACP", category: "pistol-cartridge", weightKgPer100Rounds: 2.6, barterValue: "GG34.4", streetPrice: 86, availableSpecialTypes: ["HP"], magazineWeightNotes: ["0.3 kg (7)"] },
	{ caliber: ".454 Casull", category: "pistol-cartridge", weightKgPer100Rounds: 3.4, barterValue: "GG40", streetPrice: 100, availableSpecialTypes: ["HP"] },
];

const RIFLE_CARTRIDGE_ROWS: AmmunitionRow[] = [
	{ caliber: "5.45mm Soviet", category: "rifle-cartridge", weightKgPer100Rounds: 1.3, barterValue: "GG5", streetPrice: 50, availableSpecialTypes: ["AP", "HP", "T"], magazineWeightNotes: ["0.5 kg (30)", "0.9 kg (45)"] },
	{ caliber: "5.56x45mm", category: "rifle-cartridge", weightKgPer100Rounds: 1.4, barterValue: "GG5", streetPrice: 50, availableSpecialTypes: ["AP", "HP", "T"], magazineWeightNotes: ["0.6 kg (30)"] },
	{ caliber: "5.8x42mm", category: "rifle-cartridge", weightKgPer100Rounds: 1.4, barterValue: "GG18", streetPrice: 90, availableSpecialTypes: ["AP", "T"], magazineWeightNotes: ["0.7 kg (30)"] },
	{ caliber: "6.5x55mm", category: "rifle-cartridge", weightKgPer100Rounds: 3.1, barterValue: "GG50", streetPrice: 124, availableSpecialTypes: ["HP"] },
	{ caliber: "7mm Remington Magnum", category: "rifle-cartridge", weightKgPer100Rounds: 4, barterValue: "GG47", streetPrice: 117, availableSpecialTypes: ["HP"] },
	{ caliber: "7.62x39mm", category: "rifle-cartridge", weightKgPer100Rounds: 2.2, barterValue: "GG5", streetPrice: 50, availableSpecialTypes: ["AP", "HP", "T"], magazineWeightNotes: ["0.8 kg (30)", "2.2 kg (75)"] },
	{ caliber: "7.62x51mm", category: "rifle-cartridge", weightKgPer100Rounds: 2.7, barterValue: "GG8", streetPrice: 80, availableSpecialTypes: ["AP", "HP", "T"], magazineWeightNotes: ["0.4 kg (10)", "0.8 kg (20)"] },
	{ caliber: "7.62x54mm", category: "rifle-cartridge", weightKgPer100Rounds: 2.9, barterValue: "GG10.5", streetPrice: 105, availableSpecialTypes: ["AP", "HP", "T"], magazineWeightNotes: ["0.4 kg (10)"] },
	{ caliber: ".30 Carbine", category: "rifle-cartridge", weightKgPer100Rounds: 1.7, barterValue: "GG5.5", streetPrice: 55, availableSpecialTypes: [], magazineWeightNotes: ["0.3 kg (15)"] },
	{ caliber: ".30-06", category: "rifle-cartridge", weightKgPer100Rounds: 3.3, barterValue: "GG5.4", streetPrice: 135, availableSpecialTypes: ["AP", "HP"] },
	{ caliber: ".300 Winchester Magnum", category: "rifle-cartridge", weightKgPer100Rounds: 4.1, barterValue: "GG48", streetPrice: 119, availableSpecialTypes: ["HP"] },
	{ caliber: ".303 British", category: "rifle-cartridge", weightKgPer100Rounds: 3.3, barterValue: "GG13.5", streetPrice: 135, availableSpecialTypes: ["HP"] },
	{ caliber: ".338 Lapua", category: "rifle-cartridge", weightKgPer100Rounds: 4.7, barterValue: "GG61", streetPrice: 152, availableSpecialTypes: ["HP"] },
	{ caliber: ".338 Winchester Magnum", category: "rifle-cartridge", weightKgPer100Rounds: 4.7, barterValue: "GG82", streetPrice: 205, availableSpecialTypes: ["HP"] },
	{ caliber: "8mm Mauser", category: "rifle-cartridge", weightKgPer100Rounds: 3.1, barterValue: "GG18", streetPrice: 180, availableSpecialTypes: ["HP"] },
	{ caliber: ".460 Weatherby Magnum", category: "rifle-cartridge", weightKgPer100Rounds: 5, barterValue: "GG144", streetPrice: 360, availableSpecialTypes: ["HP"] },
	{ caliber: ".50 BMG", category: "rifle-cartridge", weightKgPer100Rounds: 13, barterValue: "GG163", streetPrice: 815, availableSpecialTypes: ["AP", "T"], magazineWeightNotes: ["1.9 kg (10)"] },
	{ caliber: "12.7x108mm", category: "rifle-cartridge", weightKgPer100Rounds: 14, barterValue: "GG146", streetPrice: 730, availableSpecialTypes: ["AP", "T"] },
	{ caliber: "14.5x114mm", category: "rifle-cartridge", weightKgPer100Rounds: 20, barterValue: "GG160", streetPrice: 800, availableSpecialTypes: ["AP", "T"] },
];

const SHOTGUN_SHELL_ROWS: AmmunitionRow[] = [
	{ caliber: ".410", category: "shotgun-shell", weightKgPer100Rounds: 1.7, barterValue: "GG6.88", streetPrice: 172, availableSpecialTypes: [] },
	{ caliber: "20 gauge", category: "shotgun-shell", weightKgPer100Rounds: 4, barterValue: "GG5.76", streetPrice: 144, availableSpecialTypes: [] },
	{ caliber: "12 gauge", category: "shotgun-shell", weightKgPer100Rounds: 6, barterValue: "GG2", streetPrice: 200, availableSpecialTypes: [], magazineWeightNotes: ["0.6 kg (8)"] },
	{ caliber: "10 gauge", category: "shotgun-shell", weightKgPer100Rounds: 8.4, barterValue: "GG33.6", streetPrice: 336, availableSpecialTypes: [] },
];

export const PISTOL_CARTRIDGES: SmallArmsAmmunitionDefinition[] = PISTOL_CARTRIDGE_ROWS.map(defineSmallArmsAmmunition);
export const RIFLE_CARTRIDGES: SmallArmsAmmunitionDefinition[] = RIFLE_CARTRIDGE_ROWS.map(defineSmallArmsAmmunition);
export const SHOTGUN_SHELLS: SmallArmsAmmunitionDefinition[] = SHOTGUN_SHELL_ROWS.map(defineSmallArmsAmmunition);

export const SMALL_ARMS_AMMUNITION: SmallArmsAmmunitionDefinition[] = [
	...PISTOL_CARTRIDGES,
	...RIFLE_CARTRIDGES,
	...SHOTGUN_SHELLS,
];

export const SMALL_ARMS_AMMUNITION_ITEMS: ItemDefinition[] = SMALL_ARMS_AMMUNITION.flatMap(collectAmmoItems);
