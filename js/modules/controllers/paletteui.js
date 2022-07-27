import { userObjects } from "../view/userobjects.js";
/**
 * add on input
 * add throttle debounce
 * add colourspace conversion
 * interface with data store
 * trigger update on gradient maker etc
 */
export const paletteUi = {
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
    _addPrimaryColour(newColour){
        const {hue, sat, lum, red, green, blue, hex, name} = newColour;
        const selectColourObject = {
            'hex': [hue, sat, lum],
            'hsl': [hue, sat, lum],
            'rgb': [red, green, blue],
        };
        userObjects.sliders.forEach((x,i) => x.value = selectColourObject[userObjects.buttons['colourspace-selector'].innerHTML.toLowerCase()][i]);
        //[userObjects.sliders['slider-a'].value, userObjects.sliders['slider-b'].value, userObjects.sliders['slider-c'].value] = selectColourObject[userObjects.buttons['colourspace-selector'].innerHTML.toLowerCase()];
        userObjects.pickers['primary-picker'].value = newColour.hex;
    },
    addColour(newColour){
        if (newColour.name === 'primary') {
            this._addPrimaryColour(newColour);
            return;
        }
        userObjects.pickers[newColour.name + '-picker'].value = newColour.hex;
    },
    getSliderColourObject(){
        const selectColourObject = {
            'hex': ['hue', 'sat', 'lum'],
            'hsl': ['hue', 'sat', 'lum'],
            'rgb': ['red', 'green', 'blue'],
        };
        const keysArray = selectColourObject[userObjects.buttons['colourspace-selector'].innerHTML.toLowerCase()];
        return {
            name: 'primary',
            [keysArray[0]]: userObjects.sliders['slider-a'].value,
            [keysArray[1]]: userObjects.sliders['slider-b'].value,
            [keysArray[2]]: userObjects.sliders['slider-c'].value,
        }
    }
}