import { dirxml } from "node:console";

export const RangeBand = 
{
    "Personal": 0,
    "Gunfighting": [1, 7],
    "CQB": [8, 25],
    "Tight": [26, 100],
    "Medium": [101, 200],
    "Open": [201, 400],
    "Sniping": [401, 800],
    "Extreme": [801, 1600]
}

export const RangeBandNames = Object.keys(RangeBand) as (keyof typeof RangeBand)[];
export type RangeBandName = Extract<keyof typeof RangeBand, string>;

const VisionBand = 
{
    "Personal": 0,
    "Gunfighting": 0,
    "CQB": -1,
    "Tight": -2,
    "Medium": -4,
    "Open": -8,
    "Sniping": -16,
    "Extreme": -32
}

const EffectiveRangeSize =
{
    "1/4": {Mod: 2, description: "cat, rifle"},
    "1/2": {Mod: 1, description: "dog, child"},
    "2x": { Mod: -1, description: "horse, sedan"},
    "4x": {Mod: -2, description: "elephant, truck"},
    "8x": {Mod: -3, description: "house, tank"},
    "16x": {Mod: -4,description: ""},
    "32x": {Mod: -5, description: ""}
}

const EnvironmentalConditions = {
    Illumination: {
        "Blinding": {Range: 2, Mod: -4, Task: "other"},
        "Excessive": {Range: 1, Mod: -2, Task: "other"},
        "Adequate": {Range: 0, Mod: 0, Task: "other"},
        "Dim": {Range: 1, Mod: -2, Task: "other"},
        "Minimal": {Range: 2, Mod: -4, Task: "other"},
        "None": {Range: null, Mod: -5, Task: "other"},
        "Chaotic": {Range: 1, Mod: 0, Task: "other"},
    },
    Atmosphere: {
        
        "Precipitation":
        {
            "Mist": {Range: 1},
            "Light Rain": {Range: 1},
            "Snow Flurry": {Range: 1},
            "Rain": {Range: 2},
            "Snowfall": {Range: 2},
            "Heavy Rain": {Range: 3},
            "Blizzard": {Range: 3},
        },
        "Fog":
        {
            "Haze": {Range: 1},
            "Light Fog": {Range: 2},
            "Heavy Fog": {Range: 4},
        },
        "Smoke/Dust/Sand":
        {
            "Light": {Range: 1},
            "Steady": {Range: 2},
            "Dense": {Range: 3},
        }
        
    },

        Wind: {
            //what's the x2 for?
            "Moderate": {Description: "<= 37kph", Beaufort: [0,5], Modifier: -1, Task: ["Shooting", "Driving", "fine manipulation", "aircraft/watercraft x2"]},
            "Strong": {Description: "38-61kph", Beaufort: [6,7], Modifier: -2, Task: ["Shooting", "Driving", "fine manipulation", "aircraft/watercraft x2", "Foot movement"]},
            "Storm": {Description: "62-88kph", Beaufort: [8,9], Modifier: [-3,-10]}
            // "Gale": {Description: "89-117kph", Beaufort: [10,11]},
        },
        Temp: { //PLACEHOLDER
            "Extreme Cold": {Range: null, Mod: -5, Task: "other"},
            "Cold": {Range: 2, Mod: -2, Task: "other"},
            "Mild": {Range: 0, Mod: 0, Task: "other"},
            "Hot": {Range: 2, Mod: -2, Task: "other"},
            "Extreme Heat": {Range: null, Mod: -5, Task: "other"},
        },

        NoiseLevel:{
            "Dead Silence": {
                Decibel: "<= 25dB",
                Description: "",
                samples: ["whispering", "rustling leaves", "ticking clock","pin drop","breathing","insect wings"],
                Effects: [
                    { appliesTo: "Awareness", bonus: 1 },
                    { appliesTo: "prolongedConcentration", bonus: 1 },
               ],
            },
            "Quiet":{
                Decibel: "26-50dB",
                Description: "",
                samples: ["soft conversation", "normal calm or breezy wind", "deserted street", "library","forest"],

                Effects: [],
            },
            "Distracting":{
                Decibel: "51-80dB",
                Description: "",
                samples: ["busy street", "moderate to strong winds", "crowded restaurant", "vacuum cleaner", "alarm clock","car interior"],
                Effects: [
                    { appliesTo: "Awareness", bonus: -1 },
                    { appliesTo: "prolongedConcentration", bonus: -1 },
               ],
            },
            "Loud":{
                Decibel: "81-105dB",
                Description: "",
                samples: ["construction site", "busy traffic", "loud stereo", "factory machinery"],
                Effects: [
                    { reducesBy: 1, per: "10 minutes" },
                    { appliesTo: "Awareness", bonus: -2 },
                    { appliesTo: "prolongedConcentration", bonus: -2 },
               ],
            },
            "Industrial":{
                Decibel: "105-130dB",
                Description: "",
                samples: ["industrial machinery", "heavy construction", "aircraft takeoff", "rock concert"],
                Effects: [
                    { reducesBy: 1, per: "30 minutes" },
                    { appliesTo: "Awareness", bonus: -3 },
                    { appliesTo: "prolongedConcentration", bonus: -3 },
               ],
            }

        }

};