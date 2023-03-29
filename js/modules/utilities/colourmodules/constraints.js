import { clampRotate } from "../utilities.js";

export const constraints = {
  _constraintLookupB: {
    hue: (x) => clampRotate.rotate(x, 0, 360),
    sat: (x) => clampRotate.clamp(x, 0, 100),
    lum: (x) => clampRotate.clamp(x, 0.001, 100),
    red: (x) => clampRotate.clamp(x, 0, 1),
    green: (x) => clampRotate.clamp(x, 0, 1),
    blue: (x) => clampRotate.clamp(x, 0, 1),
    tint: (x) => clampRotate.clamp(x, 0, 1),
    warmth: (x) => clampRotate.clamp(x, 0, 1),
    lightness: (x) => clampRotate.clamp(x, 0.001, 1),
  },
  _operationsLookup: {
    multiply: (oldVal, newVal) => oldVal * newVal,
    add: (oldVal, newVal) => oldVal + newVal,
    subtract: (oldVal, newVal) => oldVal - newVal,
    divide: (oldVal, newVal) => oldVal / newVal,
    replace: (_, newVal) => newVal,
    keep: (oldVal, _) => oldVal,
  },

  _convertSlidertoHsl(sliderArray) {
    return [
      sliderArray[0] * 3.6,
      constraints._constraintLookupB["sat"](sliderArray[1]),
      constraints._constraintLookupB["lum"](sliderArray[2]),
    ];
  },
  _convertSlidertoSrgb(sliderArray) {
    return [
      constraints._constraintLookupB["red"](sliderArray[0] / 100),
      constraints._constraintLookupB["green"](sliderArray[1] / 100),
      constraints._constraintLookupB["blue"](sliderArray[2] / 100),
    ];
  },
  _convertSlidertoTwl(sliderArray) {
    return [
      constraints._constraintLookupB["tint"](sliderArray[0] / 100),
      constraints._constraintLookupB["warmth"](sliderArray[1] / 100),
      constraints._constraintLookupB["lightness"](sliderArray[2] / 100),
    ];
  },
  _convertHsltoSlider(sliderArray) {
    return [sliderArray[0] / 3.6, sliderArray[1], sliderArray[2]];
  },
  _convertSrgbtoSlider(sliderArray) {
    return [sliderArray[0] * 100, sliderArray[1] * 100, sliderArray[2] * 100];
  },
  _convertTwltoSlider(sliderArray) {
    return [sliderArray[0] * 100, sliderArray[1] * 100, sliderArray[2] * 100];
  },
  convertSliderInput(sliderArray, colourspace) {
    const functionLookup = {
      hex: "_convertTwltoSlider",
      hsl: "_convertHsltoSlider",
      rgb: "_convertSrgbtoSlider",
    };
    return constraints[functionLookup[colourspace]](sliderArray);
  },
  convertSliderOutput(sliderArray, colourspace) {
    const functionLookup = {
      hex: "_convertSlidertoTwl",
      hsl: "_convertSlidertoHsl",
      rgb: "_convertSlidertoSrgb",
    };
    return constraints[functionLookup[colourspace]](sliderArray);
  },
  getAssignMode(newColour) {
    const hslArr = ["hue", "sat", "lum"];
    const rgbArr = ["red", "green", "blue"];
    let mode;
    Object.keys(newColour).forEach((x) => {
      if (hslArr.includes(x)) {
        mode = "hsl";
        return;
      }
      if (rgbArr.includes(x)) {
        mode = "rgb";
        return;
      }
    });
    return mode;
  },
  getAssignKeys(mode) {
    const keyLookup = {
      hsl: ["hue", "sat", "lum"],
      rgb: ["red", "green", "blue"],
    };
    return keyLookup[mode];
  },
  getAssignPartial(oldColour, newColour, mode) {
    if (newColour.hasOwnProperty("hex"))
      return "Error: Hex found in newColour object";
    const colourName = newColour.name || oldColour.name;
    const keysArray = constraints.getAssignKeys(mode);
    const returnArray = keysArray.map((x) => [
      x,
      newColour[x] == null
        ? oldColour[x]
        : constraints._constraintLookupB[x](
            this._operationsLookup[
              newColour[`${x}Operation`] || newColour.operation || "replace"
            ](oldColour[x], newColour[x])
          ),
    ]);
    const returnObj = Object.fromEntries([
      ["name", colourName],
      ...returnArray,
    ]);
    return returnObj;
  },
};
