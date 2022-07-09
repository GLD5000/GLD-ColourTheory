import{Colour}from './colour.js';
import{ColourSimple}from './ColourSimple.js';



export class ColourBackground extends Colour {
    constructor (name, {hex = undefined, hue = undefined, sat = undefined, lum = undefined, red = undefined, green = undefined, blue = undefined}) {
      super();
      this._hex = hex;
      this._hue = hue;
      this._sat = sat;
      this._lum = lum;
      this._red = red;
      this._green = green;
      this._blue = blue;
      this._name = name;
      this._initAll();
    } 
    newCopyHslmult(suffix, {lum = 1, hue = 1, sat = 1}){
      return new ColourSimple(this.name + suffix,{hue: this.hue * hue, sat: this.sat * sat, lum: this.lum * lum});
    }
  
  }
  