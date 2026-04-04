// const DEFAULT_SKILLS = {
//   medicine: {
//     qualifications: ["surgery", "psychiatry"] as const,
//   },
//   rangedCombat: {
//     qualifications: ["rifle", "pistol"] as const,
//   },
//   survival: {
//     qualifications: [] as const,
//   },
// } as const;
// Default skills for all TW13 skills, each with a qualifications array or cascade
const DEFAULT_SKILLS_TW13 = {
    "Agriculture": {
        qualifications: [],
    },
    "Animal Husbandry": {
        qualifications: [],
    },
    "Aquatics": {
        qualifications: ["SCUBA"],
    },
    "Archery": {
        qualifications: [],
    },
    "Artillery": {
        qualifications: ["Guided"],
    },
    "Artisan": {
        qualifications: [],
        cascades: [],
    },
    "Aviation": {
        qualifications: ["Heavy", "Performance", "Rotary", "Remote"],
    },
    "Climbing": {
        qualifications: [],
    },
    "Command": {
        qualifications: [],
    },
    "Computing": {
        qualifications: ["Programming"],
    },
    "Construction": {
        qualifications: ["Demolitions"],
    },
    "Deception": {
        qualifications: [],
    },
    "Driving": {
        qualifications: ["Heavy", "Motorcycle", "Remote", "Tracked"],
    },
    "Electronics": {
        qualifications: [],
    },
    "Fieldcraft": {
        qualifications: [],
    },
    "Forensics": {
        qualifications: ["Forgery"],
    },
    "Freefall": {
        qualifications: ["Tactical"],
    },
    "Gunnery": {
        qualifications: ["Guided"],
    },
    "Hand-To-Hand": {
        qualifications: ["Grappling"],
    },
    "Hand Weapons": {
        qualifications: ["Grappling"],
    },
    "Instruction": {
        qualifications: [],
    },
    "Intimidation": {
        qualifications: [],
    },
    "Language": {
        qualifications: [],
        cascades: [],
    },
    "Longarm": {
        qualifications: [],
    },
    "Mechanics": {
        qualifications: ["Aviation", "Industrial", "Machinist", "Nautical"],
    },
    "Medicine": {
        qualifications: ["Surgery", "Veterinary"],
    },
    "Mounts": {
        qualifications: ["Teamster"],
    },
    "Performance": {
        qualifications: [],
        cascades: [],
    },
    "Persuasion": {
        qualifications: ["Psychiatry"],
    },
    "Seamanship": {
        qualifications: ["Remote", "Sailing", "Submersible"],
    },
    "Security": {
        qualifications: [],
    },
    "Sidearm": {
        qualifications: [],
    },
    "Special Equipment": {
        qualifications: [],
        cascades: [],
    },
    "Special Vehicle": {
        qualifications: [],
        cascades: [],
    },
    "Streetcraft": {
        qualifications: [],
    },
    "Support Weapons": {
        qualifications: ["Guided"],
    },
    "Tactics": {
        qualifications: [],
    },
};
function getSkillRatingFromValue(n) {
    if (n <= 0)
        return { rating: "Unskilled", dice: "2d20H" };
    const tier = Math.min(6, Math.max(1, Math.floor(Math.log2(n))));
    const byTier = {
        1: { rating: "Novice", dice: "1d20" },
        2: { rating: "Competent", dice: "2d20L" },
        3: { rating: "Professional", dice: "3d20L" },
        4: { rating: "Expert", dice: "4d20L" },
        5: { rating: "Master", dice: "5d20L" },
        6: { rating: "Legendary", dice: "6d20L" },
    };
    return byTier[tier];
}
export {};
