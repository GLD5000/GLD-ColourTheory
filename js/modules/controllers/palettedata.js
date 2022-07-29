export const paletteData = {
    paletteState: {gradientMode: 1, prefixMode: 'SCSS', textMode: 'Auto', colourspace: 'Hex'},
    backgroundColours: new Map(),
    customColours: new Map(),
    textColours: new Map(),
    addColour(colour){
        this.backgroundColours.set(colour.name, colour);
    }, 
     
    getPickerHex(name){
        return this.backgroundColours.get(name).hex;
    },
    getColourObject(name){
        const returnName = this.backgroundColours.get(name);
        //console.log(returnName);
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
