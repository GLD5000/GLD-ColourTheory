//Creates colours
import { luminance } from "./colourmodules/luminance.js";
import { contrast } from "./colourmodules/contrast.js";
import { colourspace } from "./colourmodules/colourspace.js";
import { constraints } from "./colourmodules/constraints.js";
import { colourString } from "./colourmodules/colourstring.js";
import { randomHsl } from "./colourmodules/randomhsl.js";
export const colourObject = {
  _convertTwlToSrgb(colour) {
    colourspace._convertTwlToSrgb(colour);
    return colour;
  },
  _convertSrgbToTwl(colour) {
    colourspace._convertSrgbToTwl(colour);
    return colour;
  },
  _autoTextColour(backgroundColour) {
    const relativeLuminance = backgroundColour.relativeLuminance;
    const contrastBlack = contrast.getContrastRatio([0, relativeLuminance]);
    const contrastWhite = contrast.getContrastRatio([1, relativeLuminance]);
    const autoColour = contrastBlack > contrastWhite ? "#000000" : "#ffffff";
    const autoContrast = Math.max(contrastBlack, contrastWhite);
    return [autoColour, autoContrast];
  },
  _textColourFromHex(colour) {
    colourspace._convertColourHexToSrgb(colour);
    colourspace._convertSrgbToHsl(colour);
    return this._return(colour);
  },
  makeTextColour(textColour = null, backgroundColour = null) {
    if (backgroundColour == null) return "No Background Colour Found"; //if background colour == null return
    if (textColour == null) {
      //auto text
      const returnColour = { name: `${backgroundColour.name}-text` };
      [returnColour.hex, returnColour.contrastRatio] =
        this._autoTextColour(backgroundColour);
      returnColour.rating = contrast.makeContrastRating(
        returnColour.contrastRatio
      );
      returnColour.contrastString = contrast.makeContrastRatioString(
        returnColour.contrastRatio
      );
      return this._textColourFromHex(returnColour);
    }
    const returnColour = { name: `${backgroundColour.name}-text` };
    returnColour.hex = textColour.hex;
    returnColour.contrastRatio = contrast.getContrastRatio([
      textColour.relativeLuminance,
      backgroundColour.relativeLuminance,
    ]);
    returnColour.rating = contrast.makeContrastRating(
      returnColour.contrastRatio
    );
    returnColour.contrastString = contrast.makeContrastRatioString(
      returnColour.contrastRatio
    );
    return this._textColourFromHex(returnColour);
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
  _convertSliderInput(sliderArray, colourspace) {
    const functionLookup = {
      hex: "_convertTwltoSlider",
      hsl: "_convertHsltoSlider",
      rgb: "_convertSrgbtoSlider",
    };
    return this[functionLookup[colourspace]](sliderArray);
  },
  _convertSliderOutput(sliderArray, colourspace) {
    const functionLookup = {
      hex: "_convertSlidertoTwl",
      hsl: "_convertSlidertoHsl",
      rgb: "_convertSlidertoSrgb",
    };
    return this[functionLookup[colourspace]](sliderArray);
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
    return this.fromHsl(
      randomHsl.makeRandomColourPartial(name)
    );
  },
};
