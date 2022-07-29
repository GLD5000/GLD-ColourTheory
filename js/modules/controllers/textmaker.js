import {colourObject} from '../utilities/colourobject.js'
import { paletteUi } from './paletteui.js';

export const textMaker = {
    updateText(backgroundColour) {
    const textMode = paletteUi.getTextMode();//Auto or Custom
    const textColour = (textMode === 'custom')? paletteUi.getTextColour(backgroundColour): null;
    const newTextColour = colourObject.getTextColourContrast(textColour, backgroundColour);
    //console.log(`${textColour} of ${newTextColour.name} to ${newTextColour.hex}`)
    paletteUi.setTextColour(newTextColour);
    },
};