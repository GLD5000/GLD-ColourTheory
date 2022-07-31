import { userObjects } from "../view/userobjects.js";
import { colourObject} from '../utilities/colourobject.js';
import { paletteData } from "./palettedata.js";
import { throttleDebounce} from '../utilities/utilities.js';
import { variantMaker } from "./variantmaker.js";
import { gradientMaker } from "./gradientmaker.js";
import { clampRotate } from "../utilities/utilities.js";
//import { callLogger } from "../utilities/utilities.js";
import { textMaker } from "./textmaker.js";

export const paletteUi = {
    _debounce(){
        this._updateVariants = throttleDebounce.debounce(() => variantMaker.updateVariants(),250);//working
    },

    _init(){
        this._updateClipboard = 0;
        this._debounce();
        this._updatePrimaryGradient = (x) => gradientMaker.updateGradient(...x);//not returning

        userObjects.wrappers['dieA'].style.backgroundColor = colourObject.makeRandomHslString();
        userObjects.wrappers['dieB'].style.backgroundColor = colourObject.makeRandomHslString();
       // paletteData.addColour(colourObject.makeRandomColour('primary'));
        this.addColour(colourObject.makeRandomColour('primary'));
        //gradientMaker.updateGradient(paletteData.getColourObject('primary'));
       // this._updatePrimaryGradient = throttleDebounce.throttle((x) => gradientMaker.updateGradient(...x),85);//not returning
        this._setOnChange();
        this.setTextMode('Auto');
        this._initSmallWrapperContent();

        this._counter = 0;
        this._setClipboardTextAll();

        //this._debounceOnChangeTextPicker = debounceB(() => this._onChangeTextPicker(),250);
      },
    _splitName(name, separator = '-'){
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
        this._updateClipboard = 0;
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
        this._updateVariants();
        this._initSmallWrapperContent();
        this.setTextMode('Auto');
        this._updateClipboard = 1;
        this._setClipboardTextAll();
    },
    addColour(newColour){// not working for custom picker or custom text
        paletteData.addColour(newColour);
        gradientMaker.updateGradient(newColour);
        textMaker.updateText(newColour);
        if (newColour.name === 'primary') {
            this._addPrimaryColour(newColour);
            return;
        }
        userObjects.pickers[newColour.name + '-picker'].value = newColour.hex;
        userObjects.copyButtons[newColour.name + '-copybtn'].innerHTML = newColour[this._getColourspace()];
        this._setClipboardTextAll();
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
    },
    _onclickGradient(){
        paletteData.paletteState.gradientMode = clampRotate.rotate(1* paletteData.paletteState.gradientMode + 1, 1 ,10) || 1;
        userObjects.other['gradient'].innerHTML = 'Gradient Mode: ' + paletteData.paletteState.gradientMode;
        paletteData.backgroundColours.forEach(colour => gradientMaker.updateGradient(colour));
        this._setClipboardTextAll();

    },
    _onclickRandom(){
        //paletteData.addColour(colourObject.makeRandomColour('primary'));
        this.addColour(colourObject.makeRandomColour('primary'));
        //gradientMaker.updateGradient(paletteData.getColourObject('primary'));
        userObjects.wrappers['dieA'].style.backgroundColor = colourObject.makeRandomHslString();
        userObjects.wrappers['dieB'].style.backgroundColor = colourObject.makeRandomHslString();
    },
    _addTextColour(name, hex) {
       const textColour = colourObject.fromHex({name: name, hex: hex});
       this.getAllSwatchNames().forEach(key => {
        const backgroundColour = paletteData.getColourObject(this._splitName(key));
        const newTextColour = colourObject.getTextColourContrast(textColour, backgroundColour);
        this.setTextColour(newTextColour);
       });
    },
    _addCustomColour(name, hex) {
        const customName = paletteData.getCustomColourName(name) || `Custom${++this._counter}`;    // for custom colour add as normal but save custom status and update dataset.content
        paletteData.addCustomColour(name, colourObject.fromHex({name: name, customName: customName, hex: hex}));// store custom name with colour under key of swatch location
        userObjects.wrappers[name + '-wrapper'].dataset.content = customName;// update wrapper content
        this._setClipboardTextAll();
    },
    _oninputPicker(x){
        const name = this._splitName(x.target.id);
        const hex = x.target.value;
        if (name === 'textcolour') {
            this.setTextMode('Custom');
            this._addTextColour('customText',hex);
            return;
        }// do not add as normal due to no wrapper thing 
        const newPartial = {hex: hex};
        newPartial.name = name;
        const newColour = colourObject.fromHex(newPartial);
        this.addColour(newColour);
        if (name !== 'primary') this._addCustomColour(name, hex); // custom colour

    },
    _onclickSmallSwatch(e){
        const name = this._splitName(e.target.id);
        const customColour = paletteData.getCustomColourObject(name);
        if (customColour == null) return;
        this.addColour(customColour);
        const wrapper = userObjects.wrappers[customColour.name + '-wrapper'];
        wrapper.dataset.content = customColour.customName;
    },
    _getClipboardTextSingle(name){
        const colourspace = this._getColourspace();
        const prefix = paletteData.getPrefix();
        let customName = paletteData.getCustomColourName(name)|| name;
        const textArray = [`${prefix}${customName}: ${paletteData.getColourObject(name)[colourspace]}`];
        const gradientColours = paletteData.getGradientColours(name);
        if (gradientColours != null) {
            gradientColours.forEach(x => {
                customName = paletteData.getCustomColourName(x.name) ||x.name;
                textArray.push(`${prefix}${customName}: ${x[colourspace]}`)
            });
        }
        return textArray.join('\n');
    },
    _getClipboardTextSingleAsArray(name){
        const colourspace = this._getColourspace();
        const prefix = paletteData.getPrefix();
        let customName = paletteData.getCustomColourName(name) || name;
        console.log(paletteData.getColourObject(name));
        const textArray = [[`${prefix}${customName}: `],
        [`${paletteData.getColourObject(name)[colourspace]}`],
        [`${prefix}${customName}: ${paletteData.getColourObject(name)[colourspace]}`]];
        const gradientColours = paletteData.getGradientColours(name);
        if (gradientColours != null) {
            gradientColours.forEach(x => {
                customName = paletteData.getCustomColourName(x.name) ||x.name;

                textArray[0].push(`${prefix}${customName}: `);
                textArray[1].push(`${x[colourspace]}`);
                textArray[2].push(`${prefix}${customName}: ${x[colourspace]}`);
            });
        }
        //return [textArray[0].join('\n'), textArray[1].join('\n')];
        return [textArray[0], textArray[1], textArray[2]];
    },
    _setClipboardTextAll(){
        if (this._updateClipboard === 0) return;
        const swatchNames = this.getAllSwatchNames();
        const colourspace = this._getColourspace();
        const prefix = paletteData.getPrefix();
        const textArray = [[],[],[]];
        swatchNames.forEach(x => {
            const returnArray = this._getClipboardTextSingleAsArray(x);
            textArray[0].push(...returnArray[0]);
            textArray[1].push(...returnArray[1]);
            textArray[2].push(...returnArray[2]);
        });
        paletteData.setClipboard(textArray);
    },


    _onclickCopyButtons(e){
        const name = this._splitName(e.target.id);
        let text;
        if (name == 'copyAllCSS') {
            const textArray = paletteData.getClipboard()[2];
            console.log(textArray);
            text = textArray.join('\n');
        } else {
            text = this._getClipboardTextSingle(name);
        }
        navigator.clipboard.writeText(text);
        alert(`Copied To Clipboard:\n${text}`);
    
    },
    _setOnChange() {
        userObjects.other['gradient'].onclick = () => this._onclickGradient();
        userObjects.other['dice-btn'].onclick = () => this._onclickRandom();
        userObjects.other['randomise-btn'].onclick = () => this._onclickRandom();
        Object.keys(userObjects.copyButtons).forEach(x => userObjects.copyButtons[x].onclick = (e) => this._onclickCopyButtons(e));//'copyAllCSS'

        userObjects.sliders.forEach((x) => x.oninput = throttleDebounce.throttle((x) => this._oninputSlider(x),85));
        Object.keys(userObjects.pickers).forEach((x) => userObjects.pickers[x].oninput = throttleDebounce.throttle((x) => this._oninputPicker(...x),85) );
        this.getSmallSwatchNames().forEach(x => userObjects.pickers[x + '-picker'].onclick = (e) => this._onclickSmallSwatch(e));
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
        const name = this._splitName(textColour.name)
        const wrapper = this._getWrapper(name);
        wrapper.style.color = textColour.hex || '#000000';
        if (name === 'primary') {
            wrapper.dataset.content = textColour.contrastString;
            //userObjects.pickers['textcolour-picker'].value = textColour.hex;
        }
        if (name !== 'primary') wrapper.dataset.rating = textColour.rating;
    },
    setTextColour(textColour){
        this._setWrapperTextColour(textColour);
        paletteData.setTextColour(textColour);
    },
    getSmallSwatchNames(){
        return userObjects.smallSwatchNamesArray;
    },
    getAllSwatchNames(){
        return ['primary', ...userObjects.smallSwatchNamesArray];
    },

}
