export const paletteData = {
    paletteState: {gradientMode: 1, prefixMode: 'SCSS', textMode: 'Auto', colourspace: 'Hex'},
    backgroundColours: new Map(),
    customColours: new Map(),
    textColours: new Map(),
    addColour(colour){
        this.backgroundColours.set(colour.name, colour);
    }, 
    addCustomColour(name,colour){
        this.customColours.set(name, colour);
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

}
