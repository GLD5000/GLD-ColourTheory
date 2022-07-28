export const paletteData = {
    paletteState: {gradientMode: 1, prefixMode: 'SCSS', textMode: 'Auto', colourMode: 'Hex'},
    backgroundColours: new Map(),
    customColours: new Map(),
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

}