import { colourObject } from "../utilities/colourobject.js";
import { callLogger } from "../utilities/utilities.js";
import { paletteUi } from "./paletteui.js";
export const variantMaker= {

  _swatchRecipeMap: new Map([
    ['analogousA', {name: 'analogousA', hue: -30, operation: 'add'}],
    ['analogousB', {name: 'analogousB', hue: 30, operation: 'add'}],
    ['triadicA', {name: 'triadicA', hue: -120, operation: 'add'}],
    ['triadicB', {name: 'triadicB', hue: 120, operation: 'add'}],
    ['tetradicA', {name: 'tetradicA', hue: 90, operation: 'add'}],
    ['tetradicB', {name: 'tetradicB', hue: 180, operation: 'add'}],
    ['tetradicC', {name: 'tetradicC', hue: 270, operation: 'add'}],
    ['monochromeA', {name: 'monochromeA', lum: -10, operation: 'add'}],
    ['monochromeB', {name: 'monochromeB', lum: 10, operation: 'add'}],
    ['neutral', {name: 'neutral', sat: 0}]
  ]), 
  updateVariants(){
    //callLogger('variantMaker');
    const primaryColour = paletteUi.getColourObject('primary');
    this._swatchRecipeMap.forEach(newColourPartial => { // Create colours for all variations
    paletteUi.addColour(colourObject.assign(primaryColour, newColourPartial));// make variations based on new primary colour
    //paletteUi.updateColour(newColourPartial.name);
    //const newColour = paletteUi.getColourObject(newColourPartial.name);
    //gradientMaker.updateGradient(newColour);
    //textMaker.updateText(newColour);
      //Update Text Colour
    });
  },
}

