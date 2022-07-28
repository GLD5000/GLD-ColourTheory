import { userObjects } from "../view/userobjects.js";
import { colourObject} from '../utilities/colourobject.js';
import { paletteData } from "./storeData.js";
import { throttle } from '../classes/throttledebounce.js';
import { debounceB} from '../classes/throttledebounce.js';
import { variantMaker } from "./variantmaker.js";
import { gradientMaker } from "./gradientmaker.js";

/**
 * add on input
 * add throttle debounce
 * add colourspace conversion
 * interface with data store
 * trigger update on gradient maker etc
 */
export const paletteUi = {

    _clamp(value, min = 0, max = 100) {
        return Math.min(Math.max(min, value),max);
      },
      _rotate(x, min = 0, max = 360) {
        if (x > max) x -= parseInt(x/max)*max;
        if (x < min) x -= parseInt(x/max)*max -max;
        return x;
      },
    
    _init(){
        
        this._updateVariants = debounceB(() => variantMaker.updateVariants(),250);//working
        this._updatePrimaryGradient = throttle(() => this._updateBackgroundColour(),85);
        //this._debounceOnChangeTextPicker = debounceB(() => this._onChangeTextPicker(),250);
        
      },
    
    _getColourspace(){
        return userObjects.buttons['colourspace-selector'].innerHTML.toLowerCase();
    },
    _setSliderValues(args){
        userObjects.sliders.forEach((x,i) => x.value = args[i]);
    },
    _getSliderValues(){
        return userObjects.sliders.map(x => x.value);
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
    updateColour(name){
        const newColour = paletteData.getColourObject(name);
        if (name === 'primary') {
            this._addPrimaryColour(newColour);
            return;
        }
        userObjects.pickers[newColour.name + '-picker'].value = newColour.hex;
    },

    _getSliderColourObject(){
        const selectColourKeys = {
            'hex': ['hue', 'sat', 'lum'],
            'hsl': ['hue', 'sat', 'lum'],
            'rgb': ['red', 'green', 'blue'],
        };        
        const selectColourMethod = {
            'hex': 'fromHsl',
            'hsl': 'fromHsl',
            'rgb': 'fromSrgb',
        };

        const colourspace = this._getColourspace();
        const keysArray = selectColourKeys[colourspace];
        const sliderValuesArray = this._getSliderValues();

        const returnObject = {name: 'primary'};

        keysArray.forEach((x, i) => returnObject[x] = sliderValuesArray[i] );
        return colourObject[selectColourMethod[colourspace]](returnObject);
    },
    _oninputSlider(){
        paletteData.addColour(this._getSliderColourObject());//update data store
        userObjects.pickers['primary-picker'].value = paletteData.getPickerHex('primary');//get hex from data store
        this._updateVariants();//throttled debounced variant update
        //throttled debounced gradient update
        //throttled debounced textColour update
        
    },
    _onclickGradient(){
        paletteData.paletteState.gradientMode = this._rotate(1* paletteData.paletteState.gradientMode + 1, 1 ,10) || 1;
        userObjects.buttons['gradient-selector'].innerHTML = 'Gradient Mode: ' + paletteData.paletteState.gradientMode;
        paletteData.backgroundColours.forEach(x => gradientMaker.updateGradient(x));
        console.log(paletteData);
    },
    _onclickRandom(){
        this._addPrimaryColour(colourObject.makeRandomColour('primary'));
        userObjects.wrappers['dieA'].style.backgroundColor = colourObject.makeRandomHslString();
        userObjects.wrappers['dieB'].style.backgroundColor = colourObject.makeRandomHslString();
    },
    _setOnChange() {
        userObjects.sliders.forEach((x) => x.oninput = () => this._oninputSlider());
        userObjects.buttons['dice-btn'].onclick = () => this._onclickRandom();
        userObjects.buttons['randomise-btn'].onclick = () => this._onclickRandom();
        userObjects.buttons['gradient-selector'].onclick = () => this._onclickGradient();
        //paletteUi.primaryPicker.oninput = () => {this._onchange()};
        //paletteUi.textPicker= () => {this._onchange()};
        //paletteUi.textLabel= () => {this._onchange()};
        //paletteUi.randomButton= () => {this._onchange()};
        //paletteUi.diceButton= () => {this._onchange()};
        //paletteUi.dieWrapperA= () => {this._onchange()};
        //paletteUi.dieWrapperB= () => {this._onchange()};
    }, 
    getStops(){
        return userObjects.buttons['gradient-selector'].innerHTML.toLowerCase();
    }
}

paletteUi._init();
console.log(userObjects);