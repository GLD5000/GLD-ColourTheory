import {colourObject} from '../utilities/colourobject.js'
import { paletteUi } from './paletteui.js';

export const textMaker = {
    updateText(backgroundColour) {
    
    const textColour = paletteUi.getTextColour(backgroundColour)
    colourObject.getTextColourContrast(textColour, backgroundColour);
    },
};