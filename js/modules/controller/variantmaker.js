import { colourMaker } from "./colourmaker.js";
export const variantMaker= {
  _swatchRecipeMap: new Map(
    [analogousA, {hue: -30, operation: 'add'}],
    [analogousB, {hue: 30, operation: 'add'}],
    [triadicA, {hue: -120, operation: 'add'}],
    [triadicB, {hue: 120, operation: 'add'}],
    [tetradicA, {hue: 90, operation: 'add'}],
    [tetradicB, {hue: 180, operation: 'add'}],
    [tetradicC, {hue: 270, operation: 'add'}],
    [monochromeA, {lum: -10, operation: 'add'}],
    [monochromeB, {lum: 10, operation: 'add'}],
    [neutral, {sat: 0, operation: 'replace'}]
  ), 

  _operations: {
    'multiply': (oldVal, newVal) =>  oldVal * newVal,
    'add': (oldVal, newVal) =>  oldVal + newVal,
    'subtract': (oldVal, newVal) =>  oldVal - newVal,
    'divide': (oldVal, newVal) =>  oldVal / newVal,
    'replace': (_, newVal) =>  newVal,
    'keep': (oldVal, _) =>  oldVal
  },
  _clamp(value, min = 0, max = 100) {
    return Math.min(Math.max(min, value),max);
  },
  _rotate(x, min = 0, max = 360) {
    if (x > max) x -= parseInt(x/max)*max;
    if (x < min) x -= parseInt(x/max)*max -max;
    return x;
  },
  _combineHSL(oldColour, newColour) {
    return {
    hue: (newColour.hue == null)? oldColour.hue: this._rotate(this._operations[newColour.hueOperation || newColour.operation || 'add'](oldColour.hue,newColour.hue)),
    sat: (newColour.sat == null)? oldColour.sat: this._clamp(this._operations[newColour.satOperation || newColour.operation || 'add'](oldColour.sat,newColour.sat)),
    lum: (newColour.lum == null)? oldColour.lum: this._clamp(this._operations[newColour.lumOperation || newColour.operation || 'add'](oldColour.lum,newColour.lum)),
    };
  },
  _newColourFromHslObjects (oldColour, newColour){
    const hslObject = this._combineHSL(oldColour, newColour);

  }
  newSwatchFromHex(hex){},
  newSwatchFromHsl(oldColour, newColour){
    const primaryHslObject = this._combineHSL (oldColour, newColour); //Get new HSL from Primary Colour
    primaryHslObject.name = oldColour.name;
    const swatchColoursMap = new Map(oldColour.name, colourMaker.makeColourFromHSL(primaryHslObject));//create map and add primary colour
    this._swatchRecipeMap.forEach((value, key) => { // Create 
            
    });
  },
}
