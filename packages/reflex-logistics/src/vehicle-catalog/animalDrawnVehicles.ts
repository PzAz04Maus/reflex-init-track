import { defineVehicle, movementMode } from "./shared";

const animalDrawn = (fraction: string) =>
  movementMode("animal-team", "Animal Team", "animal-drawn", {
    notes: [
      `Travel speed is ${fraction} of the pulling animal's normal travel speed.`,
      `Combat speed is ${fraction} of the pulling animal's normal combat speed.`,
    ],
    traits: ["vehicle:animal-drawn"],
  });

export const ANIMAL_DRAWN_VEHICLES = [
  defineVehicle({
    id: "vehicle:animal-drawn:carriage",
    name: "Carriage",
    barterValue: "GG250",
    streetPrice: 5000,
    sourcePages: [297],
    tags: ["animal-drawn", "ground", "carriage"],
    description: "A four-wheeled passenger carriage normally drawn by a two-horse team.",
    vehicle: {
      configuration: "standard",
      suspension: "std",
      crew: { crew: 1, passengers: 6 },
      cargoKg: 300,
      weightKg: 1000,
      maintenanceHours: 2,
      movementModes: [animalDrawn("60%")],
      armor: { HF: { rating: 1 }, HS: { rating: 1 }, HR: { rating: 1 }, Susp: { rating: 1 } },
      traits: ["vehicle:soft-skinned", "vehicle:animal-drawn"],
      notes: ["Open-topped carriages reduce side armor to 0."],
    },
  }),
  defineVehicle({
    id: "vehicle:animal-drawn:cart",
    name: "Cart",
    barterValue: "GG50",
    streetPrice: 500,
    sourcePages: [297],
    tags: ["animal-drawn", "ground", "cart"],
    description: "A two-wheeled light cargo cart sized for a single beast of burden.",
    vehicle: {
      configuration: "standard",
      suspension: "or",
      crew: { crew: 1 },
      cargoText: "Dependent on animal: camel 350 kg, donkey/mule 250 kg, elephant 500 kg, horse 300 kg, ox 400 kg.",
      weightKg: 200,
      maintenanceHours: 1,
      movementModes: [animalDrawn("50%")],
      armor: { HF: { rating: 0 }, HS: { rating: 0 }, HR: { rating: 0 }, Susp: { rating: 1 } },
      traits: ["vehicle:soft-skinned", "vehicle:animal-drawn"],
    },
  }),
  defineVehicle({
    id: "vehicle:animal-drawn:wagon",
    name: "Wagon",
    barterValue: "GG300",
    streetPrice: 1500,
    sourcePages: [298],
    tags: ["animal-drawn", "ground", "wagon"],
    description: "A four-wheeled cargo wagon built for a two-animal team or a single elephant.",
    vehicle: {
      configuration: "standard",
      suspension: "or",
      crew: { crew: 1 },
      cargoText: "Dependent on animal: camels 1 ton, elephant 2 tons, horses 1.5 tons, oxen 2.5 tons.",
      weightKg: 200,
      maintenanceHours: 2,
      movementModes: [animalDrawn("40%")],
      armor: { HF: { rating: 0 }, HS: { rating: 0 }, HR: { rating: 0 }, Susp: { rating: 1 } },
      traits: ["vehicle:soft-skinned", "vehicle:animal-drawn"],
      notes: ["One animal reduces cargo and speed by 60%; four animals raise cargo by 60% without increasing speed."],
    },
  }),
];