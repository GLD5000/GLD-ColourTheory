import { clampRotate } from "../utilities.js"

export const constraints = {
    _constraintLookupB: {
        hue: (x) => clampRotate.rotate(x, 0, 360),
        sat: (x) => clampRotate.clamp(x, 0, 100),
        lum: (x) => clampRotate.clamp(x, 0.001, 100),
        red: (x) => clampRotate.clamp(x, 0, 1),
        green: (x) => clampRotate.clamp(x, 0, 1),
        blue: (x) => clampRotate.clamp(x, 0, 1),
        tint: (x) => clampRotate.clamp(x, 0, 1),
        warmth: (x) => clampRotate.clamp(x, 0, 1),
        lightness: (x) => clampRotate.clamp(x, 0.001, 1),
      },
      _convertSlidertoHsl(sliderArray) {
        return [
          sliderArray[0] * 3.6,
          constraints._constraintLookupB["sat"](sliderArray[1]),
          constraints._constraintLookupB["lum"](sliderArray[2]),
        ];
      },
      _convertSlidertoSrgb(sliderArray) {
        return [
          constraints._constraintLookupB["red"](sliderArray[0] / 100),
          constraints._constraintLookupB["green"](sliderArray[1] / 100),
          constraints._constraintLookupB["blue"](sliderArray[2] / 100),
        ];
      },
      _convertSlidertoTwl(sliderArray) {
        return [
          constraints._constraintLookupB["tint"](sliderArray[0] / 100),
          constraints._constraintLookupB["warmth"](sliderArray[1] / 100),
          constraints._constraintLookupB["lightness"](sliderArray[2] / 100),
        ];
      },
      _convertHsltoSlider(sliderArray) {
        return [sliderArray[0] / 3.6, sliderArray[1], sliderArray[2]];
      },
      _convertSrgbtoSlider(sliderArray) {
        return [sliderArray[0] * 100, sliderArray[1] * 100, sliderArray[2] * 100];
      },
      _convertTwltoSlider(sliderArray) {
        return [sliderArray[0] * 100, sliderArray[1] * 100, sliderArray[2] * 100];
      },
      convertSliderInput(sliderArray, colourspace) {
        const functionLookup = {
          hex: "_convertTwltoSlider",
          hsl: "_convertHsltoSlider",
          rgb: "_convertSrgbtoSlider",
        };
        return constraints[functionLookup[colourspace]](sliderArray);
      },
      convertSliderOutput(sliderArray, colourspace) {
        const functionLookup = {
          hex: "_convertSlidertoTwl",
          hsl: "_convertSlidertoHsl",
          rgb: "_convertSlidertoSrgb",
        };
        return constraints[functionLookup[colourspace]](sliderArray);
      },
    
    }