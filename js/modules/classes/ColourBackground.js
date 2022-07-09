import{Colour}from './colour.js';


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
  }
  