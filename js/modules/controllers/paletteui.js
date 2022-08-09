import { userObjectsAll } from "../view/userobjects.js";
import { userObjects } from "../view/userobjects.js";
import { colourObject} from '../utilities/colourobject.js';
import { paletteData } from "./palettedata.js";
import { throttleDebounce} from '../utilities/utilities.js';
import { variantMaker } from "./variantmaker.js";
import { gradientMaker } from "./gradientmaker.js";
import { clampRotate } from "../utilities/utilities.js";
//import { callLogger } from "../utilities/utilities.js";
import { textMaker } from "./textmaker.js";

const state = {
    _resetAllCustomStates(){
        userObjects.smallSwatchNamesArray.forEach((name) => {
            paletteData.setCustomColourState(name, 'auto');
            userObjects.wrappers[name + '-wrapper'].dataset.content = name;
        });
    },
    setCustomStatesfromWrappers(){
        const returnObject = {}
        userObjects.smallSwatchNamesArray.forEach((name) => {
        returnObject[name] = (userObjectsAll[name + '-wrapper'].dataset.content[0] === 'c')? 'Custom': 'Auto';//check wrapper for the 'c' word 
        paletteData.paletteState.smallSwatchCustomState = returnObject;
        });
    },
    setCustomStatesfromPaletteData(){
        userObjects.smallSwatchNamesArray.forEach((name) => {
            if (paletteData.getCustomColourState(name) === 'custom'){
                const customColour = paletteData.getCustomColour(name);
                paletteData.addColour(customColour);
                paletteUi.addColour(customColour);
            }// if colour is custom overwrite background colour with custom colour 
        if (paletteData.getTextMode() === 'custom'){
            paletteUi._addTextColour('primary-text', paletteData.getTextHex());
            paletteUi.setTextMode('custom');
        }
        });
    
    },
    deepCopyPaletteState(sourceObject){
        const primitiveAddressArray = [
            'primaryHex',
            'gradientMode',
            'prefixMode',
            'prefix',
            'textMode',
            'textColour',
            'colourspace',
        ];
        const deepCopy = {};
        primitiveAddressArray.forEach((name) => {
            deepCopy[name] = sourceObject[name];
        });
        const objectAddressArray = [
            'smallSwatchCustomState',
            'customColours',
        ];
        objectAddressArray.forEach((name) => {
            deepCopy[name] = {};
            Object.keys(sourceObject[name]).forEach((key) => {
                deepCopy[name][key] = sourceObject[name][key];
            });
        });
        return deepCopy;
    },
    applyStatefromHistoryObject(newState){
        const newColour = colourObject.fromHex({name: 'primary', hex: newState.primaryHex});
        paletteUi.addColour(newColour);
        paletteData.paletteState = newState;
        state.setCustomStatesfromPaletteData();
    },
};
export const paletteUi = {
    // new custom colour functions
    hasCustomColour(colour){
       return paletteData.getCustomColour(colour.name);
    },
    getCustomNameOrName(colour){
        return paletteData.getCustomColour(colour.name).customName || colour.name;
    },
    //isCustomColour?
    //hasCustomColour?
    //addColourToCustomColours
    //addColourToBackgroundColours
    //addColourToGradientMaker
    //addColourArrayToGradientColours
    //UpdateLabels
    //UpdateClipboardContent


// New Custom colour functions
    _getUiObject(id){
        return userObjectsAll[id];
    },
    _debounce(){
        this._updateVariants = throttleDebounce.debounce(() => variantMaker.updateVariants(), 250);
    },
    _clipboardColourspaceLookup: {
        hex: '#ce9178',
        hsl: '#b5cea8',
        rgb: '#DCDCAA',
    },
    _init(){
        this._counter = this._updateClipboard = 0;
        this._debounce();
        this._updatePrimaryGradient = (x) => gradientMaker.updateGradient(...x);
        userObjects.wrappers['dieA'].style.backgroundColor = colourObject.makeRandomHslString();
        userObjects.wrappers['dieB'].style.backgroundColor = colourObject.makeRandomHslString();
        document.querySelector('.header').style.backgroundColor = colourObject.makeRandomHslStringSafer();
        //document.querySelector('.footer').style.backgroundColor = colourObject.makeRandomHslStringSafer();
        this.addColour(colourObject.makeRandomColour('primary'));
        this._setOnChange();
        this.setTextMode('Auto');
        //this._resetSmallWrapperContent();
        state._resetAllCustomStates();
        this._setColourspace('hsl');
        this._setClipboardTextAll();
        state.setCustomStatesfromWrappers();
        state.deepCopyPaletteState(paletteData.paletteState, paletteData.savedState);
        console.log(userObjects);
        console.log(paletteData);

      },
    _splitName(name, separator = '-'){
        return name.split(separator)[0];
    },
    _resetSmallWrapperContent(){
       userObjects.smallSwatchNamesArray.forEach(x => userObjects.wrappers[x + '-wrapper'].dataset.content = x);
    },
    _updateTextColour(backgroundColour) {
        textMaker.updateTextColour(backgroundColour);
    },
    _getColourspace(){
        return userObjects.other['colourspace'].innerHTML.toLowerCase();
    },
    _setColourspace(colourspace){
        userObjects.other['colourspace'].innerHTML = colourspace;
        paletteData.setColourSpace(colourspace);
        this._setSliderStyles(colourspace);
        this._setClipboardTextAll();
        this.getAllSwatchNames().forEach(name => userObjects.copyButtons[name + '-copybtn'].innerHTML = this.getColourObject(name)[colourspace]);
        this._addPrimaryColour(this.getColourObject('primary'));
    },

    _setSliderValues(valuesArray, colourspace){
        const inputArray = colourObject._convertSliderInput(valuesArray, colourspace);
        userObjects.sliders.forEach((x, i) => x.value = inputArray[i]);
    },
    _getSliderValues(colourspace){
        return colourObject._convertSliderOutput(userObjects.sliders.map(x => x.value), colourspace);
    },
    _addPrimaryColour(newColour){
        const colourspace = this._getColourspace();
        const {hue, sat, lum, red, green, blue, hex, tint, warmth, lightness} = newColour;
        const selectColourObject = {
            'hex': [tint, warmth, lightness],
            'hsl': [hue, sat, lum],
            'rgb': [red, green, blue],
        };
        this._setSliderValues(selectColourObject[colourspace], colourspace);
        this._resetSmallWrapperContent();
        userObjects.pickers['primary-picker'].value = hex;
        paletteData.setPrimaryHex(hex);
        userObjects.copyButtons['primary-copybtn'].innerHTML = newColour[colourspace];
        gradientMaker.updateGradient(newColour);
        this.setTextMode('Auto');
        state._resetAllCustomStates();
        this._updateVariants();
        this._updateClipboard = 1;
        this._setClipboardTextAll();
    },
    addColour(newColour){
        paletteData.addColour(newColour);
        if (newColour.name === 'primary') {
            this._addPrimaryColour(newColour);
            textMaker.updateTextColour(newColour);

            return;
        }
        textMaker.updateTextColour(newColour);
        gradientMaker.updateGradient(newColour);
        userObjects.pickers[newColour.name + '-picker'].value = newColour.hex;
        userObjects.copyButtons[newColour.name + '-copybtn'].innerHTML = newColour[this._getColourspace()];
        this._setClipboardTextAll();
    },
    setBackgroundGradient(name, string){
        userObjects.wrappers[name + '-wrapper'].style.background = string;
    },
    _getSliderColourObject(){
        const selectColourKeys = {
            'hex': ['tint', 'warmth', 'lightness'],
            'hsl': ['hue', 'sat', 'lum'],
            'rgb': ['red', 'green', 'blue'],
        };        
        const selectColourMethod = {
            'hex': 'fromTwl',
            'hsl': 'fromHsl',
            'rgb': 'fromSrgb',
        };

        const colourspace = this._getColourspace();
        const keysArray = selectColourKeys[colourspace];
        const sliderValuesArray = this._getSliderValues(colourspace);
        const returnObject = {name: 'primary'};

        keysArray.forEach((x, i) => returnObject[x] = sliderValuesArray[i] );
        return colourObject[selectColourMethod[colourspace]](returnObject);
    },
    _oninputSlider(x){
        this.addColour(this._getSliderColourObject());
    },
    _onclickGradient(){
        paletteData.paletteState.gradientMode = clampRotate.rotate(1* paletteData.paletteState.gradientMode + 1, 1 , 10) || 1;
        let numberTones = parseInt(paletteData.paletteState.gradientMode);
        if (numberTones === 1) numberTones = 0; 
        userObjects.other['gradient'].innerHTML = 'Tones: ' + numberTones;
        console.clear();
        paletteData.backgroundColours.forEach(colour => {gradientMaker.updateGradient(colour);});
        this._setClipboardTextAll();

    },
    _onclickRandom(){
        this.addColour(colourObject.makeRandomColour('primary'));
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
    isCustomColour(name){
        if (name !== 'primary' && this._getWrapperContent(name)[0] === 'c') return paletteData.getCustomColourName(name);
        return null;
    },
    _addCustomColour(name, hex) {
        const customName = paletteData.getCustomColourName(name) || `custom${++this._counter}`;
        paletteData.addCustomColour(name, colourObject.fromHex({name: name, customName: customName, hex: hex}));
        paletteData.setCustomColourState(name, 'custom');
        userObjects.wrappers[name + '-wrapper'].dataset.content = customName;
        return (colourObject.fromHex({name: name, customName: customName, hex: hex}));
    },
    _oninputPicker(x){
        const name = this._splitName(x.target.id);
        const hex = x.target.value;
        if (name === 'textcolour') {
            this.setTextMode('custom');
            this._addTextColour('primary-text', hex);
            return;
        }
        let newColour;
        if (name !== 'primary') {
            newColour = this._addCustomColour(name, hex); 
        } else {
            const newPartial = {hex: hex};
            newPartial.name = name;
            newColour = colourObject.fromHex(newPartial);

        }
        this.addColour(newColour);

    },
    _onclickPickerText(){
        if (paletteData.getMainTextColour() != null) {
            paletteUi._addTextColour('primary-text', paletteData.getMainTextColourHex());
            this.setTextMode('custom');
        }
    },
    _onclickPickerSmall(e){
        const name = this._splitName(e.target.id);

        const customColour = paletteData.getCustomColour(name);
        if (customColour == null) return;
        //this._addCustomColour(customColour.name, customColour.hex);
        this.addColour(customColour);
        const wrapper = userObjects.wrappers[customColour.name + '-wrapper'];
        wrapper.dataset.content = customColour.customName;
        gradientMaker.updateGradient(customColour);
        paletteData.setCustomColourState(name, 'custom');
        this._setClipboardTextAll();
        
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
        
        return [textArray[0], textArray[1], textArray[2]];
    },
    _clipboard: userObjects.clipboard.clipboard,
    _clipboardSecondary: userObjects.clipboard['clipboard-secondary'],
    

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
        
        this._clipboard.innerHTML = textArray[0].join('\n');;
        
        this._clipboardSecondary.innerHTML = textArray[1].join('\n');
        this._clipboardSecondary.style.color = this._clipboardColourspaceLookup[this._getColourspace()];

    },
    _onclickCopyAll(target){
        const copyAllCSS  = userObjects.copyButtons.copyAllCSS;
        const clipboardFlexbox = userObjects.copyButtons['clipboard-flexbox'];
        (target.id === 'copyAllCSS')? this._showCopiedMessage(copyAllCSS, ' All ') : this._showCopiedMessage(clipboardFlexbox, 'All');
        const textArray = paletteData.getClipboard()[2];
        let text = textArray.join('\n');
        navigator.clipboard.writeText(text);
        console.log(`Copied To Clipboard:\n${text}`);
    },
    _showCopiedMessage(target, message = ''){
        target.dataset.content = 'copied '+ message + '✔';
        setTimeout(() => {target.dataset.content = 'copy';}, 1800);
    },
    _onclickCopyButtons(e){
        
        const name = this._splitName(e.target.id);
        if (name === 'copyAllCSS' || name === 'clipboard') {
            this._onclickCopyAll(e.target);
            return;
        }
        const message =  (paletteData.paletteState.gradientMode > 1) ? ' + tones ': '';
        this._showCopiedMessage(e.target, message);
        const text = this._getClipboardTextSingle(name);
        navigator.clipboard.writeText(text);
        console.log(`Copied To Clipboard:\n${text}`);
    
    },
    _setSliderStyles(colourspace){
        const sliderNameArrays = {
            hex: [ 'tint', 'warmth', 'lightness'],
            hsl: [ 'hue', 'sat', 'lum'],
            rgb: [ 'red', 'green', 'blue'],
        }
/*         const sliderGradientArrays = {
            hex: [ 'background:linear-gradient(to right, #d00,#0d0)', 'background:linear-gradient(to left, #dd0,#00d)', 'background:linear-gradient(to left, #fff,#555)'],
            hsl: [ 'linear-gradient(to right, hsl(0,$sat,$lum), hsl(60,$sat,$lum), hsl(120,$sat,$lum), hsl(180,$sat,$lum), hsl(240,$sat,$lum), hsl(300,$sat,$lum), hsl(360,$sat,$lum))', 'linear-gradient(to right, hsl(0, 0%,$lum), hsl(60, 10%,$lum), hsl(120, 20%,$lum), hsl(180, 40%,$lum), hsl(240, 80%,$lum), hsl(300, 100%,$lum), hsl(360, 100%,$lum))', 'background:linear-gradient(to left, #fff,#555)'],
            rgb: [ 'background:linear-gradient(to left, #000,#d00)', 'background:linear-gradient(to left, #000,#0d0)', 'background:linear-gradient(to left, #000,#00d)'],
        }
 */        
        const namesArray = sliderNameArrays[colourspace];
        
        userObjects.sliders.forEach((x, i) => {
            x.name = namesArray[i]; 
        });
    },
    _onclickColourspace(){
        const colourspaceButton = userObjects.other.colourspace.innerHTML;
        const colourspace = this._getColourspace();
        const optionsObject = {rgb: 'hex',hex: 'hsl',hsl: 'rgb'};
        const newColourspace = optionsObject[colourspace];
        this._setColourspace(newColourspace);
        
    },
    _onclickPrefix(){
        const prefix = paletteData.getPrefix();
        const prefixMode = paletteData.getPrefixMode();
        if (prefixMode === 'SCSS'){
            paletteData.setPrefixMode('CSS');
            userObjects.other['prefix'].innerHTML = 'CSS';
            paletteData.setPrefix('--');
            this._setClipboardTextAll();
            return;
        }
        paletteData.setPrefixMode('SCSS');
        userObjects.other['prefix'].innerHTML = 'SCSS';
        paletteData.setPrefix('$');
        this._setClipboardTextAll();
    },
    _loadHistoryObject(event){
        const hex = event.target.innerHTML;
        const newState  = state.deepCopyPaletteState(paletteData.savedPalettes[hex]);
        state.applyStatefromHistoryObject(newState);
    },
    _SaveHistoryObject(){
        const hex = paletteData.getPrimaryHex();
        const copyPaletteState  = state.deepCopyPaletteState(paletteData.paletteState);
        if (paletteData.savedPalettes[hex] === undefined) {
            const li = document.createElement('li');
            li.innerHTML = hex;
            userObjects.history['history-flexbox'].append(li);
        }
        paletteData.savedPalettes[hex] = copyPaletteState;
      },
    _clearHistory(){
    userObjects.history['history-flexbox'].innerHTML = "";
    },

    _setOnChange() {
        userObjects.other['colourspace'].onclick = () => this._onclickColourspace();
        userObjects.other['prefix'].onclick = () => this._onclickPrefix();
        userObjects.other['gradient'].onclick = () => this._onclickGradient();
        userObjects.other['dice-btn'].onclick = () => this._onclickRandom();
        userObjects.other['randomise-btn'].onclick = () => this._onclickRandom();
       // Object.keys(userObjects.copyButtons).forEach(x => userObjects.copyButtons[x].onclick = (e) => this._onclickCopyButtons(e));
        Object.keys(userObjects.copyButtons).forEach(x => userObjects.copyButtons[x].onclick = (e) => this._onclickCopyButtons(e));        
       //Object.keys(userObjects.clipboard).forEach(x => userObjects.clipboard[x].onclick = (e) => this._onclickCopyAll());

        userObjects.sliders.forEach((x) => x.oninput = throttleDebounce.throttle((x) => this._oninputSlider(x), 85));
        Object.keys(userObjects.pickers).forEach((x) => userObjects.pickers[x].oninput = throttleDebounce.throttle((x) => this._oninputPicker(...x), 85) );
        this.getSmallSwatchNames().forEach(x => userObjects.pickers[x + '-picker'].onclick = (e) => this._onclickPickerSmall(e));

        userObjects.pickers['textcolour-picker'].onclick = (e) => this._onclickPickerText(e);
        this._getUiObject('hamburger-toggle').onclick = (x) => {
            this._getUiObject('navbar-list').classList.toggle('active');
        };
        document.querySelector('#history-flexbox').addEventListener('click',this._loadHistoryObject, true);
        this._getUiObject('save-button').addEventListener('click',this._clearHistory,   {
            once: true
        });
        this._getUiObject('save-button').addEventListener('click',this._SaveHistoryObject);
        

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
    _getWrapperContent(name){
        if (name === 'primary') return null;
        return userObjects.wrappers[name + '-wrapper'].dataset.content;
    },

    _setWrapperTextColour(textColour){
        const name = this._splitName(textColour.name)
        const wrapper = this._getWrapper(name);
        wrapper.style.color = textColour.hex || '#000000';
        if (name === 'primary') {
            wrapper.dataset.content = textColour.contrastString;
            
        }
        if (name !== 'primary') wrapper.dataset.rating = textColour.rating;
    },
    setTextColour(textColour){
        if (textColour.name === 'primary-text') paletteData.setMainTextColour(textColour);
        this._setWrapperTextColour(textColour);
        paletteData.addTextColour(textColour);
    },
    getSmallSwatchNames(){
        return userObjects.smallSwatchNamesArray;
    },
    getAllSwatchNames(){
        return ['primary', ...userObjects.smallSwatchNamesArray];
    },

}

