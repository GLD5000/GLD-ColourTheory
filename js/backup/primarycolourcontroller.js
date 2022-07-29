import { colourObject } from "../modules/utilities/colourobject.js";
import { paletteUi } from "../modules/controllers/paletteui.js";
import { throttle } from '../classes/throttledebounce.js';
import { debounceB} from '../classes/throttledebounce.js';
import { paletteData } from "../modules/controllers/palettedata.js";
export const primaryColourController = {
    _onInputSlider(){
        const selectColourObject = {
            hex: colourObject.fromHsl(paletteUi.getSliderColourObject()),//working not tested
            hsl: colourObject.fromHsl(paletteUi.getSliderColourObject()),
            rgb: colourObject.fromSrgb(paletteUi.getSliderColourObject()),
        }
        paletteData.backgroundColours.set('primary', selectColourObject[paletteUi.buttons[colourspace]]);

    },
    _throttle(){
        this._throttledOnInputSlider = throttle(() => this._onInputColour(),85);
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
    _convertHslToColourObject(hue,sat,lum){
      return  {'name': 'primary', 'hue': hue, 'sat': sat, 'lum': lum};
    },
    _makeRandomPrimaryColour(){
        return colourObject.fromHsl(this._convertHslToColourObject(...this._makeRandomHsl()));
    },
    _setRandomDiceColours() {
        this._dieA.style.backgroundColor = this._convertHslToString(...this._makeRandomHsl());    
        this._dieB.style.backgroundColor = this._convertHslToString(...this._makeRandomHsl());    
    },
    _sliderOnInput(){
        //(paletteUi.buttons.colourspace.value === 'rgb')?
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
        const newColour = this._makeRandomPrimaryColour();
        paletteData.addColour(newColour);
        paletteUi.addColour(newColour);
        //this._setOnChange();  
        this._throttle();  
    }
}
