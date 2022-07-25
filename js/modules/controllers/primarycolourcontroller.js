import { colourObject } from "./colourobject.js";
import { primaryInputs } from "../view/userobjects.js";
import { throttle } from '../classes/throttledebounce.js';
import {debounceB} from '../classes/throttledebounce.js';
import { paletteData } from "./storeData.js";
/* 
    primaryInputs.hueSlider: document.getElementById('slider-a'),//.value
    primaryInputs.satSlider: document.getElementById('slider-b'),//.value
    primaryInputs.lumSlider: document.getElementById('slider-c'),//.value
    primaryInputs.primaryPicker: document.getElementById('primary-picker'),//.value
    primaryInputs.textPicker: document.getElementById('textColour-picker'),//.value
    primaryInputs.textLabel: document.getElementById('textColour-label'),//.dataset.content
    primaryInputs.randomButton: document.getElementById('randomise-btn'),
    primaryInputs.diceButton: document.getElementById('dice-btn'),
    primaryInputs.dieWrapperA: document.getElementById('dieA'),//.value
    primaryInputs.dieWrapperB: document.getElementById('dieB'),//.value

    primaryInputs
*/

export const primaryColourController = {
    _onInputColour(oldColourObject,colourType){
        //throttled
    },

    _throttle(){
        this._throttledOnInputSlider = throttle(() => this._onInputColour(oldColourObject,colourType),85);
        this._throttledUpdateBackgroundColour = throttle(() => this._updateBackgroundColour(),85);
        this._debouncedUpdateSmallSwatches = debounceB(() => this._updateSmallSwatches(),250);
        this._debounceOnChangeTextPicker = debounceB(() => this._onChangeTextPicker(),250);
      },
    _makeRandomHsl() {
        const hue = parseInt(Math.random() * 360);
        const sat = 48 + parseInt(Math.random() * 40); // 48 - 87
        const lum = 63 + parseInt(Math.random() * 25); // 63 - 88
        return [hue,sat,lum];
    },
    _convertHslToString(hue,sat,lum) {
        return `hsl(${Math.round(hue)},${sat.toFixed(1)}%,${lum.toFixed(1)}%)`//this._convertHslToHex(hue, sat, lum);
    },
    _setRandomDiceColours() {
        this._dieA.style.backgroundColor = this._convertHslToString(...this._makeRandomHsl());    
        this._dieB.style.backgroundColor = this._convertHslToString(...this._makeRandomHsl());    
    },
    _sliderOnInput(){

    },
    _setOnChange() {
        primaryInputs.sliders.forEach((x,i) => x.oninput = (i) => this._sliderOnInput(i));
        primaryInputs.primaryPicker.oninput = () => {this._onchange()};
        primaryInputs.textPicker= () => {this._onchange()};
        primaryInputs.textLabel= () => {this._onchange()};
        primaryInputs.randomButton= () => {this._onchange()};
        primaryInputs.diceButton= () => {this._onchange()};
        primaryInputs.dieWrapperA= () => {this._onchange()};
        primaryInputs.dieWrapperB= () => {this._onchange()};
    }, 
    _updateSmallSwatches(){
        this._smallSwatchesGroup.updateSwatches(this._colourBackground.hex);
        this._smallSwatchesGroup.updateSwatchesText(this._colourText.hex);
      },
    _updateBackgroundColour(hex) {
    this._picker.value = this._colourBackground.hex;
    this._wrapper.style.background = this._colourBackground.backgroundString;
    [this._colourText.hex, this._contrastRatio] = [...this._autoTextColour(this._colourBackground.red, this._colourBackground.green, this._colourBackground.blue)];
    this._wrapper.dataset.content = this._makeContrastRatioString(this._contrastRatio);
    this._wrapper.style.color = this._colourText.hex; 
    this._textWrapper.dataset.content = 'Text: Auto';
    this._updateSliders();    
    this._copyButton.text = this._colourBackground.hex;

    },
    
    init() {
        paletteData.backgroundColours.set('primary', primaryInputs.pickers['primary-picker'].value);
        //this._setOnChange();  
        this._throttle();  
    }
}
