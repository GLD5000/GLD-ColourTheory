import { paletteData } from "./palettedata.js";
import { colourObject } from "../utilities/colourobject.js";
import { paletteUi } from "./paletteui.js";
// Takes in one colour (map) and outputs a background gradient to its map
export const gradientMaker = {
    _getMultipliers(){//not implemented yet
        this._satMin = 0.63;
        this._satMax = 0.74;
        this._lumMin = 0.53;
        this._lumMax = 0.84;
    },
    _multiplierStops(stops,multiplier) {
        const halfStops = 0.5 * stops;
        let even = (stops % 2 === 0)? 1: 0;
        return [...Array(stops)].map((x,i,arr) => arr[i] = multiplier ** (((i + 1 > halfStops)? even: 0) + i - Math.floor(halfStops)));
        },
    _suffixise(arr) {
        return arr.map(x => `-${x}`);
        },
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
    },
    _makeGradient(mainColour){
        const satMult = 0.98; 
        const lumMult = 1.04;
        this._stops = paletteData.paletteState.gradientMode; //|| 1;    
        if (this._stops < 2) {
        this._gradientString = mainColour.hex;
        } else {
            const suffixes = this._suffixStops(this._stops);
            const satMultStops  = this._multiplierStops(this._stops,satMult);
            const lumMultStops  = this._multiplierStops(this._stops,lumMult);
            this._gradientColours = {}; 
            suffixes.forEach((suffix, i) => {
                this._gradientColours[mainColour.name + suffix] = colourObject.assign(mainColour,{name: mainColour.name + suffix, lum: lumMultStops[i], sat: satMultStops[i], operation: 'multiply'});
            });
            //console.log(this._gradientColours);
            const gap = getComputedStyle(document.querySelector('.slider-container')).gap;
            this._gradientString = `linear-gradient(to top, #000 ${gap}, ${mainColour.hex} ${gap}, ${mainColour.hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to left`;
            const stopWidth = 100 / this._stops;
            Object.keys(this._gradientColours).forEach((x, i)=>{
                this._gradientString += `, ${colourObject.getHslStringfromColour(this._gradientColours[x])} ${i * stopWidth}% ${stopWidth + (i * stopWidth)}%`
            });
            this._gradientString += `) 0% 50% / 100% 30%`;
        } 
     },
    backgroundString(){
        this._makeGradient({stops: this._stops});
        return this._gradientString;
        },
        clipboardStringArr(){
        return this._clipboardString;
    },
    updateGradient(colour){
        this._makeGradient(colour);
        paletteUi.setBackgroundGradient(colour.name, this._gradientString);
    }
}
