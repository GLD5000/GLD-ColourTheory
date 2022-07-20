import { colourObject } from "./colourObject.js";
export const variantMaker= {
  _swatchRecipeMap: new Map([
    ['analogousA', {hue: -30, operation: 'add'}],
    ['analogousB', {hue: 30, operation: 'add'}],
    ['triadicA', {hue: -120, operation: 'add'}],
    ['triadicB', {hue: 120, operation: 'add'}],
    ['tetradicA', {hue: 90, operation: 'add'}],
    ['tetradicB', {hue: 180, operation: 'add'}],
    ['tetradicC', {hue: 270, operation: 'add'}],
    ['monochromeA', {lum: -10, operation: 'add'}],
    ['monochromeB', {lum: 10, operation: 'add'}],
    ['neutral', {sat: 0}]
  ]), 

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
  _updateHSL(oldColour, newColour) {
    return {
    hue: (newColour.hue == null)? oldColour.hue: this._rotate(this._operations[newColour.hueOperation || newColour.operation || 'replace'](oldColour.hue, newColour.hue)),
    sat: (newColour.sat == null)? oldColour.sat: this._clamp(this._operations[newColour.satOperation || newColour.operation || 'replace'](oldColour.sat, newColour.sat)),
    lum: (newColour.lum == null)? oldColour.lum: this._clamp(this._operations[newColour.lumOperation || newColour.operation || 'replace'](oldColour.lum, newColour.lum)),
    };
  },
  _newColourFromHslObjects(oldColour, newColour, name){
    const hslObject = this._updateHSL(oldColour, newColour);
    hslObject.name = name;
    return colourObject.fromHsl(hslObject);
  },
  //newSwatchFromHex(hex){},
  updateSwatchFromHsl(oldColour, newColour){
    const primaryHslObject = this._updateHSL (oldColour, newColour); //Get new HSL from Primary Colour
    primaryHslObject.name = oldColour.name;//Put old name into object
    const primaryColour = colourObject.fromHsl(primaryHslObject);
    const swatchColoursMap = new Map([[primaryHslObject.name, primaryColour]]);//create map and add primary colour
    this._swatchRecipeMap.forEach((value, key) => { // Create colours for all variations
      swatchColoursMap.set(key, this._newColourFromHslObjects(swatchColoursMap.get(primaryHslObject.name), value, key));
    });
    return swatchColoursMap;
  },
}
const mathsChain = {
  startNumber(x){
    this.number = x; 
    return this
  },
  add(y){
    this.number += y;
    return this
  },
  sub(y){this.number -= y
    return this
  },
  answer(){
    return this.number;
  }
}

console.log(mathsChain.startNumber(5).add(2).sub(3).answer());