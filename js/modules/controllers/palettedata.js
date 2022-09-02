import { paletteUi } from "./paletteui.js";

export const paletteData = {
    paletteState: {
        primaryHex: null,
        smallSwatchCustomState: {},
        customColours: {},
        gradientMode: 1,
        prefixMode: 'SCSS',
        prefix: '$',
        textMode: 'auto',
        textColour: null,
        colourspace: 'Hex',
    },
    backgroundColours: new Map(),
    gradientColours: new Map(),
    textColours: new Map(),
    clipboard: [],
    savedPalettes: {},
    getPrimaryHex(hex) {
        return this.paletteState.primaryHex;
    },

    setPrimaryHex(hex) {
        this.paletteState.primaryHex = hex;
    },
    addSmallSwatchCustomState(name, state) {
        this.paletteState.smallSwatchCustomState[name] = state;
    },
    getSmallSwatchCustomState(name) {
        return this.paletteState.smallSwatchCustomState[name];
    },

    setClipboard(newArray) {
        this.clipboard = newArray;
    },
    getClipboard() {
       return this.clipboard;
    },

    setPrefix(prefix) {
        this.paletteState.prefix = prefix;
    },
    getPrefix() {
        return this.paletteState.prefix;
    },
    setPrefixMode(prefixMode) {
        this.paletteState.prefixMode = prefixMode;
    },
    getPrefixMode() {
        return this.paletteState.prefixMode;
    },
    addColour(colour) {
        this.backgroundColours.set(colour.name, colour);
    }, 
    getCustomColourName(name) {
        return this.paletteState.customColours[name]?.customName;
    },
    getCustomColour(name) {
        return this.paletteState.customColours[name];
    },
    clearCustomColours() {
        this.paletteState.customColours = {};
    },
    addCustomColour(name, colour) {
        this.paletteState.customColours[name] = colour;
    }, 
    getCustomColourState(name) {
        return this.paletteState.smallSwatchCustomState[name];
    },
    setCustomColourState(name, state) {
        this.paletteState.smallSwatchCustomState[name] = state;
    },

    clearGradientColours(name) {
        this.gradientColours.set(name, null);
    },
    addGradientColours(name, array) {
        this.gradientColours.set(name, array);
    },
    getGradientColours(name) {
        return this.gradientColours.get(name);
    },
    getPickerHex(name) {
        return this.backgroundColours.get(name).hex;
    },
    getColourObject(name) {
        const returnName = this.backgroundColours.get(name);
        return returnName;
    },
    getTextMode() {
        return this.paletteState.textMode;
    },
    setTextMode(mode) {
        this.paletteState.textMode = mode;
    },
    getTextColour(name) {
        return this.textColours.get(name);
    },
    getTextHex() {
        return this.paletteState.textColour.hex;
    },
    setMainTextColour(textColour) {
        if (textColour.sat === 0) return;
        this.paletteState.textColour = textColour;
    },
    getMainTextColour(textColour) {
        return this.paletteState.textColour;
     },
     getMainTextColourHex(textColour) {
        return this.paletteState.textColour?.hex;
     },
  
    addTextColour(colour) {
        this.textColours.set(colour.name, colour);
    },
    getColourSpace() {
       return this.paletteState.colourspace;
    },
    setColourSpace(colourspace) {
        this.paletteState.colourspace = colourspace;
    },
}

