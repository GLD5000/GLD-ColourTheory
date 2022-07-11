import{Colour}from './colour.js';
import{ColourSimple}from './coloursimple.js';



export class ColourBackground extends Colour {
    constructor ({
      name = undefined,
      stops = 1,
      satMult = 1,
      lumMult = 1,
      hex = undefined,
      hue = undefined,
      sat = undefined,
      lum = undefined,
      red = undefined,
      green = undefined,
      blue = undefined,
      colourMode = 'hex',
      isCss = true
     }) 
    {
      super();
      this._stops = stops;
      this._satMult = satMult;
      this._lumMult = lumMult;
      this._hex = hex;  
      this._hue = hue;
      this._sat = sat;
      this._lum = lum;
      this._red = red;
      this._green = green;
      this._blue = blue;
      this._name = name;
      this._colourMode = colourMode;
      this._isCss = isCss;
      this._initAll();
      this._makeGradient({stops: this._stops});
    } 
    _newCopyHslmult(suffix, {lum = 1, hue = 1, sat = 1}){
      return new ColourSimple(this.name + suffix,{hue: this.hue * hue, sat: this.sat * sat, lum: this.lum * lum});
    }
    _multiplierStops(stops,multiplier) {
      const halfStops = 0.5 * stops;
      let even = (stops % 2 === 0)? 1: 0;
      return [...Array(stops)].map((x,i,arr) => arr[i] = multiplier ** (((i + 1 > halfStops)? even: 0) + i - Math.floor(halfStops)));
    }
    _suffixise(arr) {
      return arr.map(x => `-${x}`);
    }
    _suffixStops(stops) {
      this._stops = Math.min(Math.max(2, stops),10);
      this._names = {
        2: ['light','dark'],
        3: ['light','normal','dark'],
        4: ['lighter','light','dark','darker'],
        5: ['lighter','light','normal','dark','darker'],
        6: ['lightest','lighter','light','dark','darker','darkest'],
        7: ['lightest','lighter','light','normal','dark','darker','darkest'],
        8: ['100','200','300','400','500','600','700','800'],
        9: ['100','200','300','400','500','600','700','800','900'],
        10: ['50','100','200','300','400','500','600','700','800','900'],
        
      }
      return this._suffixise(this._names[this._stops]);
    }
    _makeGradient({stops = 1, satMult = 0.98, lumMult = 1.04}){
      if (this._stops < 2) {
      this._gradientString = this.hex;
      } else {
        const suffixes = this._suffixStops(this._stops);
        const satMultStops  = this._multiplierStops(this._stops,satMult);
        const lumMultStops  = this._multiplierStops(this._stops,lumMult);
        this._gradientColours = {}; 
        suffixes.forEach((suffix, i) => {
        this._gradientColours[this.name + suffix] = this._newCopyHslmult(suffix, {lum: lumMultStops[i], sat: satMultStops[i]});
        });
        const gap = getComputedStyle(document.querySelector('.slider-container')).gap;
        this._gradientString = `linear-gradient(to top, #000 ${gap}, ${this.hex} ${gap}, ${this.hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to left`;
        const stopWidth = 100 / this._stops;
        Object.keys(this._gradientColours).forEach((x, i)=>{
          this._gradientString += `, ${this._gradientColours[x].hsl} ${i * stopWidth}% ${stopWidth + (i * stopWidth)}%`
        });
        this._gradientString += `) 0% 50% / 100% 30%`;
      } 
    }
    get backgroundString(){
      this._makeGradient({stops: this._stops});
      return this._gradientString;
    }
    get clipboardStringArr(){
      return this._clipboardString;
    }
  }
  