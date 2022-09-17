function convertSrgbToLuminance(RsRGB, GsRGB, BsRGB) {
  const R = modifyColourValue(RsRGB);
  const G = modifyColourValue(GsRGB);
  const B = modifyColourValue(BsRGB);
  return sumColourValues(R, G, B);
}
function sumColourValues(R, G, B) {
  const redMult = 0.2126;
  const greenMult = 0.7152;
  const blueMult = 0.0722;
  return redMult * R + greenMult * G + blueMult * B;
}
function modifyColourValue(value) {
  return value <= 0.04045
    ? value / 12.92
    : Math.pow((value + 0.055) / 1.055, 2.4);
}
export const luminance = {
  addLuminanceToObject(colourObj) {
    colourObj.relativeLuminance = convertSrgbToLuminance(
      colourObj.red,
      colourObj.blue,
      colourObj.green
    );
    return colourObj;
  },
};
