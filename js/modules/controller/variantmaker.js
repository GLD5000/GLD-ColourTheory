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
  updateSwatchFromHsl(oldColour, newColour){
    newColour.name = newColour.name || oldColour.name;//Put old name into newColour object
    const primaryColour = colourObject.assign(oldColour, newColour);//update primary colour
    const swatchColoursMap = new Map([[newColour.name, primaryColour]]);//create map and add primary colour
    this._swatchRecipeMap.forEach((value, key) => { // Create colours for all variations
      swatchColoursMap.set(key, colourObject.assign(primaryColour, value));// make variations based on new primary colour
    });
    return swatchColoursMap;
  },
}
/* const mathsChain = {
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

console.log(mathsChain.startNumber(5).add(2).sub(3).answer()); */