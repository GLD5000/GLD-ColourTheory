import {colourObject} from '../utilities/colourobject.js'
import { paletteUi } from './paletteui.js';

export const textMaker = {
    updateText(backgroundColour) {
    const textMode = paletteUi.getTextMode();//Auto or Custom
    const textColour = (textMode === 'custom')? paletteUi.getTextColour(backgroundColour): null;
    paletteUi.setTextColour(colourObject.getTextColourContrast(textColour, backgroundColour));
    },
};