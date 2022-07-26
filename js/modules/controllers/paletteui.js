import { userObjects } from "../view/userobjects.js";

export const paletteUi = {
    const selectColourObject = {
        'hex': [hue, sat, lum],
        'hsl': [hue, sat, lum],
        'rgb': [red, green, blue],
    };

    _addPrimaryColour(newColour){
        const {hue, sat, lum, red, green, blue, hex, name} = newColour;
        const selectColourObject = {
            'hex': [hue, sat, lum],
            'hsl': [hue, sat, lum],
            'rgb': [red, green, blue],
        };
    
        [userObjects.sliders['slider-a'].value, userObjects.sliders['slider-b'].value, userObjects.sliders['slider-c'].value] = selectColourObject[userObjects.buttons['colourspace-selector'].innerHTML.toLowerCase()];
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