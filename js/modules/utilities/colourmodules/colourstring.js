export const colourString = {
  createStrings(colour) {
    colour.twl = this._convertTwlToString(
      colour.tint,
      colour.warmth,
      colour.lightness
    );
    colour.rgb = this._convertRgbToString(
      colour.red,
      colour.green,
      colour.blue
    );
    colour.hsl = this._convertHslToString(colour.hue, colour.sat, colour.lum);
  },
  _convertHslToString(hue, sat, lum) {
    return `hsl(${Math.round(hue)},${Math.round(sat)}%,${Math.round(lum)}%)`;
  },
  _convertTwlToString(tint, warmth, lightness) {
    return `twl(${Math.round(tint * 100)}%,${Math.round(
      warmth * 100
    )}%,${Math.round(lightness * 100)}%)`;
  },
  _convertRgbToString(red, green, blue) {
    return `rgb(${Math.round(red * 255)},${Math.round(
      green * 255
    )},${Math.round(blue * 255)})`;
  },
};
