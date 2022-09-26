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
}