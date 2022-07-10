/**
 * gradient class accepts this
 * returns array for gradient colours and gradient string
 * holds only methods
 * replace lum / sat mult with lum/sat min/max
 * 
 */
export class Gradient {
    constructor({{stops = 1}}){
        this._satMin = 0.63;
        this._satMax = 0.74;
        this._lumMin = 0.53;
        this._lumMax = 0.84;
        this._satMult

    }
    _findBaseMult(initialValue,finalValue,power){
        // finalValue = initialValue * x ^ power
        // finalValue / initialValue = x ^ power
        // (finalValue / initialValue) ^ 1/power = x
        return (finalValue / initialValue) ** (1/power);
    }
//old methods imported below
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
          this._gradientColours = []; 
          suffixes.forEach((suffix, i) => {
          this._gradientColours.push(this._newCopyHslmult(suffix, {lum: lumMultStops[i], sat: satMultStops[i]}));
          });
          this._gradientString = `linear-gradient(to top, #000 1px, ${this.hex} 1px, ${this.hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to left`;
          const stopWidth = 100 / this._stops;
          this._gradientColours.forEach((x, i)=>{
            this._gradientString += `, ${x.hsl} ${i * stopWidth}% ${stopWidth + (i * stopWidth)}%`
          });
          this._gradientString += `) 0% 50% / 100% 30%`;
        } 
      }
      get backgroundString(){
        this._makeGradient({stops: this._stops});
        return this._gradientString;
      }
  
}