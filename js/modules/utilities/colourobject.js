//Creates colours
import { luminance } from "./colourmodules/luminance.js";
import { contrast } from "./colourmodules/contrast.js";
import { colourspace } from "./colourmodules/colourspace.js";
import { constraints } from "./colourmodules/constraints.js";
import { colourString } from "./colourmodules/colourstring.js";
import { randomHsl } from "./colourmodules/randomhsl.js";
export const colourObject = {
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
  assign(oldColour, newColour) {
    const mode = constraints.getAssignMode(newColour);
    const newPartial = constraints.getAssignPartial(oldColour, newColour, mode);
    return mode === "hsl"
      ? this.fromHsl({ ...newPartial })
      : this.fromSrgb({ ...newPartial });
  },
  makeTextColour({textColour = null, backgroundColour = null}) {
    const colour = contrast.makeTextColour(textColour, backgroundColour);
    return colourObject._textColourFromHex(colour);
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
  _textColourFromHex(colour) {
    colourspace._convertColourHexToSrgb(colour);
    colourspace._convertSrgbToHsl(colour);
    return colourObject._return(colour);
  },
};
