import { colourObject } from "../utilities/colourobject.js";
export const variantMaker = {
  _tetradicSwitchObject: {
    Square: {
      tetradicB: { name: "tetradicB", hue: 90, operation: "add" },
      tetradicC: { name: "tetradicC", hue: 270, operation: "add" },
    },
    "Rectangular A": {
      tetradicB: { name: "tetradicB", hue: 60, operation: "add" },
      tetradicC: { name: "tetradicC", hue: 240, operation: "add" },
    },
    "Rectangular B": {
      tetradicB: { name: "tetradicB", hue: -60, operation: "add" },
      tetradicC: { name: "tetradicC", hue: 120, operation: "add" },
    },
  },
  updateSwatchRecipeMap(tetradicMode) {
    variantMaker._swatchRecipeMap.set(
      "tetradicB",
      this._tetradicSwitchObject[tetradicMode]["tetradicB"]
    );
    variantMaker._swatchRecipeMap.set(
      "tetradicC",
      this._tetradicSwitchObject[tetradicMode]["tetradicC"]
    );
  },
  getUpdatedTetradicColours(tetradicMode, primaryColour) {
    const TetradicKeys = ["tetradicA", "tetradicB", "tetradicC"];
    const returnArray = [];
    this.updateSwatchRecipeMap(tetradicMode);
    TetradicKeys.forEach((key) => {
      const newColourPartial = this._swatchRecipeMap.get(key);
      returnArray.push(colourObject.assign(primaryColour, newColourPartial));
    });
    return returnArray;
  },
  _swatchRecipeMap: new Map([
    ["analogousA", { name: "analogousA", hue: -30, operation: "add" }],
    ["analogousB", { name: "analogousB", hue: 30, operation: "add" }],
    ["triadicA", { name: "triadicA", hue: -120, operation: "add" }],
    ["triadicB", { name: "triadicB", hue: 120, operation: "add" }],
    ["tetradicA", { name: "tetradicA", hue: 180, operation: "add" }],
    ["tetradicB", { name: "tetradicB", hue: 90, operation: "add" }],
    ["tetradicC", { name: "tetradicC", hue: 270, operation: "add" }],
    ["monochromeA", { name: "monochromeA", lum: 15, operation: "add" }],
    ["monochromeB", { name: "monochromeB", lum: -15, operation: "add" }],
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
