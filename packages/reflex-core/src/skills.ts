import { ca } from "zod/v4/locales";




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
const DEFAULT_SKILLS_TW13 =
{
  "Agriculture": { 
    qualifications: [] as const,
 },
  "Animal Husbandry": { 
    qualifications: [] as const, 
  },
  "Aquatics": { 
    qualifications: ["SCUBA"] as const, 
  },
  "Archery": { 
    qualifications: [] as const, 
  },
  "Artillery": { 
    qualifications: ["Guided"] as const, 
  },
  "Artisan": { 
    qualifications: [] as const,
    cascades: [] as const, 
  },
  "Aviation": { 
    qualifications: ["Heavy","Performance","Rotary","Remote"] as const, 
  },
  "Climbing": { 
    qualifications: [] as const, 
  },
  "Command": { 
    qualifications: [] as const, 
  },
  "Computing": { 
    qualifications: ["Programming"] as const, 
  },
  "Construction": { 
    qualifications: ["Demolitions"] as const, 
  },
  "Deception": { 
    qualifications: [] as const, 
  },
  "Driving": { 
    qualifications: ["Heavy","Motorcycle","Remote","Tracked"] as const, 
  },
  "Electronics": { 
    qualifications: [] as const, 
  },
  "Fieldcraft": { 
    qualifications: [] as const, 
  },
  "Forensics": { 
    qualifications: ["Forgery"] as const,
  },
  "Freefall": { 
    qualifications: ["Tactical"] as const, 
  },
  "Gunnery": { 
    qualifications: ["Guided"] as const, 
  },
  "Hand-To-Hand": { 
    qualifications: ["Grappling"] as const, 
  },
  "Hand Weapons": { 
    qualifications: ["Grappling"] as const, 
  },
  "Instruction": { 
    qualifications: [] as const, 
  },
  "Intimidation": { 
    qualifications: [] as const, 
  },
  "Language": { 
    qualifications: [] as const, 
    cascades: [] as const,
 },
  "Longarm": { 
    qualifications: [] as const, 
  },
  "Mechanics": { 
    qualifications: ["Aviation","Industrial","Machinist","Nautical"] as const, 
  },
  "Medicine": { 
    qualifications: ["Surgery","Veterinary"] as const, 
  },
  "Mounts": { 
    qualifications: ["Teamster"] as const, 
  },
  "Performance": { 
    qualifications: [] as const, 
    cascades: [] as const,
  },
  "Persuasion": { 
    qualifications: ["Psychiatry"] as const, 
  },
  "Seamanship": { 
    qualifications: ["Remote","Sailing","Submersible"] as const, 
  },
  "Security": { 
    qualifications: [] as const, 
  },
  "Sidearm": { 
    qualifications: [] as const, 
  },
  "Special Equipment": { 
    qualifications: [] as const, 
    cascades: [] as const,
  },
  "Special Vehicle": { 
    qualifications: [] as const, 
    cascades: [] as const,
  },
  "Streetcraft": { 
    qualifications: [] as const, 
  },
  "Support Weapons": { 
    qualifications: ["Guided"] as const, 
  },
  "Tactics": { 
    qualifications: [] as const, 
  },
};

type SkillKey = keyof typeof DEFAULT_SKILLS_TW13;
type QualificationKey<S extends SkillKey> =
  typeof DEFAULT_SKILLS_TW13[S]["qualifications"][number];

type SkillRating =
  | "Unskilled"
  | "Novice"
  | "Competent"
  | "Professional"
  | "Expert"
  | "Master"
  | "Legendary";

function getSkillRatingFromValue(n: number): { rating: SkillRating; dice: string } {
  if (n <= 0) return { rating: "Unskilled", dice: "2d20H" };

  const tier = Math.min(6, Math.max(1, Math.floor(Math.log2(n))));
  const byTier: Record<number, { rating: SkillRating; dice: string }> = {
    1: { rating: "Novice", dice: "1d20" },
    2: { rating: "Competent", dice: "2d20L" },
    3: { rating: "Professional", dice: "3d20L" },
    4: { rating: "Expert", dice: "4d20L" },
    5: { rating: "Master", dice: "5d20L" },
    6: { rating: "Legendary", dice: "6d20L" },
  };

  return byTier[tier];
}

