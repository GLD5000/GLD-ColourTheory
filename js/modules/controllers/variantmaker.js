import { colourObject } from "./colourobject.js";
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
  updateVariants(newColour){
    this._swatchRecipeMap.forEach((value, key) => { // Create colours for all variations
      swatchColoursMap.set(key, colourObject.assign(newColour, value));// make variations based on new primary colour
    });
    return swatchColoursMap;
  },
}