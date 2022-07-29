import { userObjects } from "../view/userobjects.js";
import { colourObject} from '../utilities/colourobject.js';
import { paletteData } from "./palettedata.js";
import { throttleDebounce} from '../utilities/utilities.js';
import { variantMaker } from "./variantmaker.js";
import { gradientMaker } from "./gradientmaker.js";
import { clampRotate } from "../utilities/utilities.js";
import { textMaker } from "./textmaker.js";

export const paletteUi = {
    _init(){
        userObjects.wrappers['dieA'].style.backgroundColor = colourObject.makeRandomHslString();
        userObjects.wrappers['dieB'].style.backgroundColor = colourObject.makeRandomHslString();
        paletteData.addColour(colourObject.makeRandomColour('primary'));
        this.addColour(paletteData.getColourObject('primary'));
        //gradientMaker.updateGradient(paletteData.getColourObject('primary'));
        variantMaker.updateVariants();
        this._updateVariants = throttleDebounce.debounce(() => variantMaker.updateVariants(),250);//working
        this._updatePrimaryGradient = throttleDebounce.throttle((x) => gradientMaker.updateGradient(...x),85);//not returning
        this._setOnChange();
        this.setTextMode('Auto');
        this._initSmallWrapperContent();

        //this._debounceOnChangeTextPicker = debounceB(() => this._onChangeTextPicker(),250);
      },
    _nameSplit(name, separator = '-'){
        return name.split(separator)[0];
    },
    _initSmallWrapperContent(){
       userObjects.smallSwatchNamesArray.forEach(x => userObjects.wrappers[x + '-wrapper'].dataset.content = x);
    },
    _updateTextColour(backgroundColour) {
        textMaker.updateText(backgroundColour);
    },
    _getColourspace(){
        return userObjects.other['colourspace'].innerHTML.toLowerCase();
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
        userObjects.copyButtons['primary-copybtn'].innerHTML = newColour[this._getColourspace()];

    },
    addColour(newColour){
        paletteData.addColour(newColour);
        gradientMaker.updateGradient(newColour);
        textMaker.updateText(newColour);
        if (newColour.name === 'primary') {
            this._addPrimaryColour(newColour);
            return;
        }
        userObjects.pickers[newColour.name + '-picker'].value = newColour.hex;
        userObjects.copyButtons[newColour.name + '-copybtn'].innerHTML = newColour[this._getColourspace()];
    },
    setBackgroundGradient(name, string){
        userObjects.wrappers[name + '-wrapper'].style.background = string;
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
    _oninputSlider(x){
        this.addColour(this._getSliderColourObject());//update data store
        this._updateVariants();//throttled debounced variant update
        //this._updatePrimaryGradient(paletteData.getColourObject('primary'));//throttled debounced gradient update
        //throttled debounced textColour update
    },
    _onclickGradient(){
        paletteData.paletteState.gradientMode = clampRotate.rotate(1* paletteData.paletteState.gradientMode + 1, 1 ,10) || 1;
        userObjects.other['gradient'].innerHTML = 'Gradient Mode: ' + paletteData.paletteState.gradientMode;
        paletteData.backgroundColours.forEach(x => gradientMaker.updateGradient(x));
    },
    _onclickRandom(){
        paletteData.addColour(colourObject.makeRandomColour('primary'));
        this.addColour(paletteData.getColourObject('primary'));
        //gradientMaker.updateGradient(paletteData.getColourObject('primary'));
        userObjects.wrappers['dieA'].style.backgroundColor = colourObject.makeRandomHslString();
        userObjects.wrappers['dieB'].style.backgroundColor = colourObject.makeRandomHslString();
        this._updateVariants();

    },
    _setOnChange() {
        userObjects.sliders.forEach((x) => x.oninput = (x) => this._oninputSlider(x));
        userObjects.other['dice-btn'].onclick = () => this._onclickRandom();
        userObjects.other['randomise-btn'].onclick = () => this._onclickRandom();
        userObjects.other['gradient'].onclick = () => this._onclickGradient();
        //paletteUi.primaryPicker.oninput = () => {this._onchange()};
        //paletteUi.textPicker= () => {this._onchange()};
        //paletteUi.textLabel= () => {this._onchange()};
        //paletteUi.randomButton= () => {this._onchange()};
        //paletteUi.diceButton= () => {this._onchange()};
        //paletteUi.dieWrapperA= () => {this._onchange()};
        //paletteUi.dieWrapperB= () => {this._onchange()};
    }, 
    getStops(){
        return userObjects.other['gradient'].innerHTML.toLowerCase();
    },
    userObjects(){
        return userObjects;
    },
    getColourObject(name){
        return paletteData.getColourObject(name);
    },
    getTextMode(){
        return paletteData.getTextMode();
    },
    setTextMode(mode){
        paletteData.setTextMode(mode);
        userObjects.other['textmode'].dataset.content = `Text: ${mode}`;
    },
    getTextColour(backgroundColour){
        return paletteData.getTextColour(backgroundColour);
    },
    _getWrapper(name){
        return userObjects.wrappers[name + '-wrapper'];
    },
    _setWrapperTextColour(textColour){
        const name = this._nameSplit(textColour.name)
        const wrapper = this._getWrapper(name);
        wrapper.style.color = textColour.hex || '#000';
        if (name === 'primary') wrapper.dataset.content = textColour.contrastString;
        if (name !== 'primary') wrapper.dataset.rating = textColour.rating;
    },
    setTextColour(textColour){
        this._setWrapperTextColour(textColour);
        paletteData.setTextColour(textColour);
    },
    getSmallSwatchNames(){
        return userObjects.smallSwatchNamesArray;
    },
}
