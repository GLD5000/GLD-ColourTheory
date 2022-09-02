import { colourObject } from "../utilities/colourobject.js";
import { clampRotate} from '../utilities/utilities.js'
// Fix naming of stops on custom pickers

export const gradientMaker = {
    _findMult(start, end, stops) {
        const mult = (end / start) ** (1 / stops);
        return mult;
    },
        _satStart: 0.35,
        _satEnd: 0.75,
        _lumStart: 0.35,
        _lumEnd: 0.78,
    _multiplierStopsAbsolute(stops, multiplier, start, offset) {
        return [...Array(stops)].map((x, i, arr) => arr[i] = offset + (100 * start * (multiplier ** (i + 1 ))));
        },

    _multiplierStops(stops, multiplier) {
        const halfStops = 0.5 * stops;
        let even = (stops % 2 === 0)? 1: 0;
        return [...Array(stops)].map((x, i, arr) => arr[i] = multiplier ** (((i + 1 > halfStops)? even: 0) + i - Math.floor(halfStops)));
        },
    _suffixise(arr) {
        return arr.map(x => `-${x}`);
        },
    _suffixStops(stops) {
        this._stops = Math.min(Math.max(2, stops), 10);
        this._names = {
            2: ['light','dark'],
            3: ['light','medium','dark'],
            4: ['lighter','light','dark','darker'],
            5: ['lighter','light','medium','dark','darker'],
            6: ['lightest','lighter','light','dark','darker','darkest'],
            7: ['lightest','lighter','light','medium','dark','darker','darkest'],
            8: ['100','200','300','400','500','600','700','800'],
            9: ['100','200','300','400','500','600','700','800','900'],
            10: ['50','100','200','300','400','500','600','700','800','900'],
            
        }
        return this._suffixise(this._names[this._stops]);
    },
    _makeGradient(mainColour, stops) {

        if (stops < 2) {
            this._gradientString = mainColour.hex;
            this._gradientColours = null;
        } else {
            const isPrimary = (mainColour.name === 'primary');
            const satOffset = clampRotate.clamp(mainColour.sat - 50, -30, 25);
            const lumOffset = clampRotate.clamp(mainColour.lum - 50, -15, 15);
            const satMult = this._findMult(this._satStart, this._satEnd, stops)//0.98; 
            const lumMult = this._findMult(this._lumStart, this._lumEnd, stops)//1.04;
            const suffixes = this._suffixStops(stops);
            const satMultStops  = this._multiplierStopsAbsolute(stops, satMult, this._satStart, satOffset);
            const lumMultStops  = this._multiplierStopsAbsolute(stops, lumMult, this._lumStart, lumOffset);
            this._gradientColours = []; 
            const gap = getComputedStyle(document.querySelector('.slider-container')).gap;
            const gradientStringStart = (isPrimary)? `linear-gradient(to left`: `linear-gradient(to top, #000 ${gap}, ${mainColour.hex} ${gap}, ${mainColour.hex}) 0% 0% / 100% 70% no-repeat, linear-gradient(to left`; 
            this._gradientString = gradientStringStart;
            const stopWidth = 100 / stops;
            const customName = mainColour.customName || mainColour.name;
            suffixes.forEach((suffix, i) => {
                const newColour = colourObject.assign(mainColour, {name: customName + suffix, lum: lumMultStops[i], sat: (mainColour.name === 'neutral')? 0 : satMultStops[i], operation: 'replace'});
                this._gradientColours.push(newColour);
                this._gradientString += `, ${colourObject.hsl(newColour)} ${i * stopWidth}% ${stopWidth + (i * stopWidth)}%`
            });
            this._gradientString += (isPrimary)?`)`:`) 0% 50% / 100% 30%`;
        } 
    },
    updateGradient(colour, stops) {
        this._makeGradient(colour, stops);
        return [this._gradientString, this._gradientColours];
    }
}

