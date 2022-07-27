export const paletteData = {
    paletteState: {gradientMode: 'Single', prefixMode: 'SCSS', textMode: 'Auto', colourMode: 'Hex'},
    backgroundColours: new Map(),
    customColours: new Map(),
    addColour(colour){
        this.backgroundColours.set(colour.name, colour);
    },  
    getPickerColour(name){
        return this.backgroundColours.get(name).hex;
    }  
}