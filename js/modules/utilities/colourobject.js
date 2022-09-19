//Creates colours
import { luminance } from "./colourmodules/luminance.js";
import { contrast } from "./colourmodules/contrast.js";
import { colourspace } from "./colourmodules/colourspace.js";
import { constraints } from "./colourmodules/constraints.js";
export const colourObject = {
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
  _createStrings(colour) {
    if (colour.name === "primary")
      colour.twl = this._convertTwlToString(
        colour.tint,
        colour.warmth,
        colour.lightness
      );
    colour.rgb = this._convertRgbToString(
      colour.red,
      colour.green,
      colour.blue
    );
    colour.hsl = this._convertHslToString(colour.hue, colour.sat, colour.lum);
  },

  _return(colour) {
    this._createStrings(colour);
    luminance.addLuminanceToObject(colour);
    return Object.freeze(colour);
  },
  fromTwl(colour) {
    colourspace._convertTwltoSrgb(colour);
    colourspace._convertSrgbToHsl(colour);
    colourspace._convertHslToHex(colour);
    return this._return(colour);
  },
  fromHsl(colour) {
    colourspace._convertHslToHex(colour);
    colourspace._convertColourHexToSrgb(colour);
    if (colour.name === "primary") colourspace._convertSrgbtoTwl(colour);
    return this._return(colour);
  },
  fromHex(colour) {
    colourspace._convertColourHexToSrgb(colour);
    colourspace._convertSrgbToHsl(colour);
    if (colour.name === "primary") colourspace._convertSrgbtoTwl(colour);
    return this._return(colour);
  },
  fromSrgb(colour) {
    colourspace._convertSrgbToHsl(colour);
    colourspace._convertHslToHex(colour);
    if (colour.name === "primary") colourspace._convertSrgbtoTwl(colour);
    return this._return(colour);
  },
  _operationsLookup: {
    multiply: (oldVal, newVal) => oldVal * newVal,
    add: (oldVal, newVal) => oldVal + newVal,
    subtract: (oldVal, newVal) => oldVal - newVal,
    divide: (oldVal, newVal) => oldVal / newVal,
    replace: (_, newVal) => newVal,
    keep: (oldVal, _) => oldVal,
  },
  _hslArr: ["hue", "sat", "lum"],
  _rgbArr: ["red", "green", "blue"],

  _makeRandomHsl() {
    const hue = parseInt(Math.random() * 360);
    const sat = 48 + parseInt(Math.random() * 40); // 48 - 87
    const lum = 63 + parseInt(Math.random() * 25); // 63 - 88
    return [hue, sat, lum];
  },
  _makeRandomHslSafer() {
    const hue = parseInt(Math.random() * 360);
    const sat = 28 + parseInt(Math.random() * 5); // 48 - 87
    const lum = 65 + parseInt(Math.random() * 5); // 63 - 88
    return [hue, sat, lum];
  },

  _convertHslToString(hue, sat, lum) {
    return `hsl(${Math.round(hue)},${Math.round(sat)}%,${Math.round(lum)}%)`;
  },
  _convertTwlToString(tint, warmth, lightness) {
    return `twl(${Math.round(tint * 100)}%,${Math.round(
      warmth * 100
    )}%,${Math.round(lightness * 100)}%)`;
  },

  _convertRgbToString(red, green, blue) {
    return `rgb(${Math.round(red * 255)},${Math.round(
      green * 255
    )},${Math.round(blue * 255)})`;
  },
  _convertHslToColourObject(hue, sat, lum, name) {
    return { name: name, hue: hue, sat: sat, lum: lum };
  },
  hsl(colour) {
    return this._convertHslToString(colour.hue, colour.sat, colour.lum);
  },
  rgb(colour) {
    return this._convertRgbToString(colour.red, colour.green, colour.blue);
  },
  makeRandomHslString() {
    return this._convertHslToString(...this._makeRandomHsl());
  },
  makeRandomHslStringSafer() {
    return this._convertHslToString(...this._makeRandomHslSafer());
  },

  makeRandomColour(name = "primary") {
    return this.fromHsl(
      this._convertHslToColourObject(...this._makeRandomHsl(), name)
    );
  },
  assign(oldColour, newColour) {
    //default mode is replace
    if (newColour.hasOwnProperty("hex"))
      return "Error: Hex found in newColour object"; //Exit for Hex
    const colourName = newColour.name || oldColour.name; // set colour name
    let mode, keysArray;
    Object.keys(newColour).forEach((x) => {
      //Loop through object keys of newColour to check for hsl or rgb
      if (this._hslArr.includes(x)) {
        mode = "hsl"; // set mode
        keysArray = this._hslArr; // set keys to hsl
      } else if (this._rgbArr.includes(x)) {
        mode = "rgb"; // set mode
        keysArray = this._rgbArr; // set keys to rgb
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
};
