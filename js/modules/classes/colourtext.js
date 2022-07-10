import { ColourSimple } from "./coloursimple";

/**
 * Make text colour module
 * Method for contrast ratio
 * 
 */
export class ColourText {
    constructor(backgroundColour,textColour){
        this._contrastRatio = 1;
        this._colour = new ColourSimple('Text', hex);
    }
}