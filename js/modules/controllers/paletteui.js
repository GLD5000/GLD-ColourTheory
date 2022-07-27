import { userObjects } from "../view/userobjects.js";
import { colourObject} from '../controllers/colourobject.js';
/**
 * add on input
 * add throttle debounce
 * add colourspace conversion
 * interface with data store
 * trigger update on gradient maker etc
 */
export const paletteUi = {
    _getColourspace(){
        return userObjects.buttons['colourspace-selector'].innerHTML.toLowerCase();
    },
    _setSliderValues(args){
        userObjects.sliders.forEach((x,i) => x.value = args[i]);
    },
    _getSliderValues(){
        return userObjects.sliders.map(x => x.value);
    },
    _setOnChange() {
        Object.keys(paletteUi.sliders).forEach((x,i) => x.oninput = (i) => this._sliderOnInput(i));
        paletteUi.primaryPicker.oninput = () => {this._onchange()};
        paletteUi.textPicker= () => {this._onchange()};
        paletteUi.textLabel= () => {this._onchange()};
        paletteUi.randomButton= () => {this._onchange()};
        paletteUi.diceButton= () => {this._onchange()};
        paletteUi.dieWrapperA= () => {this._onchange()};
        paletteUi.dieWrapperB= () => {this._onchange()};
    }, 
    _addPrimaryColour(newColour){
        const {hue, sat, lum, red, green, blue, hex} = newColour;
        const selectColourObject = {
            'hex': [hue, sat, lum],
            'hsl': [hue, sat, lum],
            'rgb': [red, green, blue],
        };
        const colourspace = this._getColourspace();
        this._setSliderValues(selectColourObject[colourspace]);
        userObjects.pickers['primary-picker'].value = hex;
    },
    addColour(newColour){
        if (newColour.name === 'primary') {
            this._addPrimaryColour(newColour);
            return;
        }
        userObjects.pickers[newColour.name + '-picker'].value = newColour.hex;
    },
    getSliderColourObject(){
        const selectColourObject = {
            'hex': ['hue', 'sat', 'lum'],
            'hsl': ['hue', 'sat', 'lum'],
            'rgb': ['red', 'green', 'blue'],
        };
        const colourspace = this._getColourspace();
        const keysArray = selectColourObject[colourspace];
        const sliderValuesArray = this._getSliderValues();

        const returnObject = {name: 'primary'};

        keysArray.forEach((x, i) => returnObject[x] = sliderValuesArray[i] );
        
        return returnObject;
    }
}