import { userObjects } from "../view/userobjects.js";

export const paletteUi = {
    
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
}