export const paletteData = {
    paletteState: {gradientMode: 1, prefixMode: 'SCSS', prefix: '$', textMode: 'Auto', colourspace: 'Hex'},
    backgroundColours: new Map(),
    customColours: new Map(),
    gradientColours: new Map(),
    textColours: new Map(),
    clipboard: [],
    setClipboard(newArray){
        this.clipboard = newArray;
    },
    getClipboard(){
       return this.clipboard;
    },

    setPrefix(prefix){
        this.paletteState.prefix = prefix;
    },
    getPrefix(){
        return this.paletteState.prefix;
    },
    setPrefixMode(prefixMode){
        this.paletteState.prefixMode = prefixMode;
    },
    getPrefixMode(){
        return this.paletteState.prefixMode;
    },

    addColour(colour){
        this.backgroundColours.set(colour.name, colour);
    }, 
    addTextColour(name, colour){
        this.textColours.set(name, colour);
    }, 
    addCustomColour(name, colour){
        this.customColours.set(name, colour);
    }, 
    clearGradientColours(){
        this.gradientColours = new Map();
    },
    addGradientColours(array){
        const name = array[0].name.split('-')[0];
        this.gradientColours.set(name, array);
    },
    getGradientColours(name){
        return this.gradientColours.get(name);
    },
    getCustomColourName(name){
        if (this.customColours.get(name) == null) return null;
        return this.customColours.get(name).customName;
    },
    getCustomColourObject(name){
        if (this.customColours.get(name) == null) return null;
        return this.customColours.get(name);
    },

    getPickerHex(name){
        return this.backgroundColours.get(name).hex;
    },
    getColourObject(name){
        const returnName = this.backgroundColours.get(name);
        return returnName;
    },
    getTextMode(){
        return this.paletteState.textMode;
    },
    setTextMode(mode){
        this.paletteState.textMode = mode;
    },
    getTextColour(backgroundColour){
        const name = backgroundColour.name + '-text';
        return this.textColours.get(name);
    },
    setTextColour(textColour){
        this.textColours.set(textColour.name, textColour);
    },
    setColourSpace(colourspace){
        this.paletteState.colourspace = colourspace;
    },
}
