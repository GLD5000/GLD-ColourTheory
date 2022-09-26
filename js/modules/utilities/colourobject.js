//Creates colours
import { luminance } from "./colourmodules/luminance.js";
import { contrast } from "./colourmodules/contrast.js";
import { colourspace } from "./colourmodules/colourspace.js";
import { constraints } from "./colourmodules/constraints.js";
import { colourString } from "./colourmodules/colourstring.js";
import { randomHsl } from "./colourmodules/randomhsl.js";
export const colourObject = {
  convertSliderInput(sliderArray, colourspace) {
    return constraints.convertSliderInput(sliderArray, colourspace);
  },
  convertSliderOutput(sliderArray, colourspace) {
    return constraints.convertSliderOutput(sliderArray, colourspace);
  },
  _return(colour) {
    colourString.createStrings(colour);
    luminance.addLuminanceToObject(colour);
    return Object.freeze(colour);
  },
  fromTwl(colour) {
    colourspace._convertTwlToSrgb(colour);
    colourspace._convertSrgbToHsl(colour);
    colourspace._convertHslToHex(colour);
    return colourObject._return(colour);
  },
  fromHsl(colour) {
    colourspace._convertHslToHex(colour);
    colourspace._convertColourHexToSrgb(colour);
    colourspace._convertSrgbToTwl(colour);
    return colourObject._return(colour);
  },
  fromHex(colour) {
    colourspace._convertColourHexToSrgb(colour);
    colourspace._convertSrgbToHsl(colour);
    colourspace._convertSrgbToTwl(colour);
    return colourObject._return(colour);
  },
  fromSrgb(colour) {
    colourspace._convertSrgbToHsl(colour);
    colourspace._convertHslToHex(colour);
    colourspace._convertSrgbToTwl(colour);
    return colourObject._return(colour);
  },
  _textColourFromHex(colour) {
    colourspace._convertColourHexToSrgb(colour);
    colourspace._convertSrgbToHsl(colour);
    return this._return(colour);
  },
  makeTextColour(textColour = null, backgroundColour = null) {
    const colour = contrast.makeTextColour(textColour, backgroundColour);
    return colourObject._textColourFromHex(colour);
  },
  _operationsLookup: {
    multiply: (oldVal, newVal) => oldVal * newVal,
    add: (oldVal, newVal) => oldVal + newVal,
    subtract: (oldVal, newVal) => oldVal - newVal,
    divide: (oldVal, newVal) => oldVal / newVal,
    replace: (_, newVal) => newVal,
    keep: (oldVal, _) => oldVal,
  },

  assign(oldColour, newColour) {
    const hslArr = ["hue", "sat", "lum"];
    const rgbArr = ["red", "green", "blue"];
    //default mode is replace
    if (newColour.hasOwnProperty("hex"))
      return "Error: Hex found in newColour object"; //Exit for Hex
    const colourName = newColour.name || oldColour.name; // set colour name
    let mode, keysArray;
    Object.keys(newColour).forEach((x) => {
      //Loop through object keys of newColour to check for hsl or rgb
      if (hslArr.includes(x)) {
        mode = "hsl"; // set mode
        keysArray = hslArr; // set keys to hsl
      } else if (rgbArr.includes(x)) {
        mode = "rgb"; // set mode
        keysArray = rgbArr; // set keys to rgb
      }
      if (mode != null) return; //exit outer loop if assignment has been made
    });

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

    return mode === "hsl"
      ? this.fromHsl({ ...returnObj })
      : this.fromSrgb({ ...returnObj });
  },
  makeRandomHslString() {
    return randomHsl.makeRandomHslString();
  },
  makeRandomHslStringSafer() {
    return randomHsl.makeRandomHslStringSafer();
  },
  makeRandomColour(name = "primary") {
    return this.fromHsl(randomHsl.makeRandomColourPartial(name));
  },
};
