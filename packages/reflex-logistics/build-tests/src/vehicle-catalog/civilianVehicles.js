"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.CIVILIAN_VEHICLES = void 0;
const animalDrawnVehicles_1 = require("./animalDrawnVehicles");
const civilianGroundVehicles_1 = require("./civilianGroundVehicles");
const civilianWatercraft_1 = require("./civilianWatercraft");
// Source: Twilight 2013 Core OEF PDF p.284+ (civilian and non-combat vehicle catalog pages in this pass)
exports.CIVILIAN_VEHICLES = [
    ...civilianGroundVehicles_1.CIVILIAN_GROUND_VEHICLES,
    ...civilianWatercraft_1.CIVILIAN_WATERCRAFT,
    ...animalDrawnVehicles_1.ANIMAL_DRAWN_VEHICLES,
];
