import { colourObject } from "../utilities/colourobject.js";
export const variantMaker = {
  _tetradicSwitchObject: {
    square: {
      tetradicB: { name: "tetradicB", hue: 90, operation: "add" },
      tetradicC: { name: "tetradicB", hue: 270, operation: "add" },
    },
    rectangleA: {
      tetradicB: { name: "tetradicB", hue: 60, operation: "add" },
      tetradicC: { name: "tetradicB", hue: 240, operation: "add" },
    },
    rectangleB: {
      tetradicB: { name: "tetradicB", hue: -60, operation: "add" },
      tetradicC: { name: "tetradicB", hue: 120, operation: "add" },
    },
  },
  updateTetradicMode(tetradicMode) {
    variantMaker._swatchRecipeMap.set(
      "tetradicB",
      this._tetradicSwitchObject[tetradicMode]["tetradicB"]
    );
    variantMaker._swatchRecipeMap.set(
      "tetradicC",
      this._tetradicSwitchObject[tetradicMode]["tetradicC"]
    );
  },
  _swatchRecipeMap: new Map([
    ["analogousA", { name: "analogousA", hue: -30, operation: "add" }],
    ["analogousB", { name: "analogousB", hue: 30, operation: "add" }],
    ["triadicA", { name: "triadicA", hue: -120, operation: "add" }],
    ["triadicB", { name: "triadicB", hue: 120, operation: "add" }],
    ["tetradicA", { name: "tetradicA", hue: 180, operation: "add" }],
    ["tetradicB", { name: "tetradicB", hue: 90, operation: "add" }],
    ["tetradicC", { name: "tetradicC", hue: 270, operation: "add" }],
    ["monochromeA", { name: "monochromeA", lum: -10, operation: "add" }],
    ["monochromeB", { name: "monochromeB", lum: 10, operation: "add" }],
    ["neutral", { name: "neutral", sat: 0 }],
    ["splitA", { name: "splitA", hue: 150, operation: "add" }],
    ["splitB", { name: "splitB", hue: 210, operation: "add" }],
  ]),
  addAllColoursToPalette(primaryColour) {
    const returnArray = [];
    this._swatchRecipeMap.forEach((newColourPartial) => {
      // Create colours for all variations
      //paletteUi.addColour(colourObject.assign(primaryColour, newColourPartial));// make variations based on new primary colour
      returnArray.push(colourObject.assign(primaryColour, newColourPartial));
    });
    return returnArray;
  },
};
