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
    Agriculture: {
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
export {};
