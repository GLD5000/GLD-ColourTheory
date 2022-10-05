export const contrast = {
  getContrastRatio(args) {
    const maxLum = Math.max(...args);
    const minLum = Math.min(...args);
    return (maxLum + 0.05) / (minLum + 0.05);
  },
  makeContrastRatioString(ratio) {
    const rating = ratio > 4.5 ? (ratio > 7 ? "AAA+" : "AA+") : "Low";
    return `Contrast Ratio: ${ratio.toFixed(2)} ${rating}`;
  },
  makeContrastRating(ratio) {
    return ratio > 4.5 ? (ratio > 7 ? "AAA+" : "AA+") : "Low";
  },
  _getTextColourMaxContrast(backgroundLuminance){
    const backgroundLuminanceCutoff = 0.1791287847;
    const backgroundLuminanceIsAboveCutoff = backgroundLuminance > backgroundLuminanceCutoff;
    const textColour = backgroundLuminanceIsAboveCutoff? "#000000" : "#ffffff";
    const textLuminance = backgroundLuminanceIsAboveCutoff? 0 : 1;
    const textContrast = contrast.getContrastRatio([textLuminance, backgroundLuminance])
    return [textColour, textContrast]
  },
  _autoTextColour(backgroundColour, targetContrast = null) {
    const backgroundLuminance = backgroundColour.relativeLuminance;
    if (targetContrast === null) 
    // const contrastBlack = contrast.getContrastRatio([0, relativeLuminance]);
    // const contrastWhite = contrast.getContrastRatio([1, relativeLuminance]);
    // const autoColour = contrastBlack > contrastWhite ? "#000000" : "#ffffff";
    // const autoContrast = Math.max(contrastBlack, contrastWhite);
    return contrast._getTextColourMaxContrast(backgroundLuminance);
  },
  makeTextColour(textColour = null, backgroundColour = null) {
    if (backgroundColour == null) return "No Background Colour Found"; //if background colour == null return
    if (textColour == null) {
      //auto text
      const returnColour = { name: `${backgroundColour.name}-text` };
      [returnColour.hex, returnColour.contrastRatio] =
        this._autoTextColour(backgroundColour);
      returnColour.rating = contrast.makeContrastRating(
        returnColour.contrastRatio
      );
      returnColour.contrastString = contrast.makeContrastRatioString(
        returnColour.contrastRatio
      );
      return returnColour;
    }
    const returnColour = { name: `${backgroundColour.name}-text` };
    returnColour.hex = textColour.hex;
    returnColour.contrastRatio = contrast.getContrastRatio([
      textColour.relativeLuminance,
      backgroundColour.relativeLuminance,
    ]);
    returnColour.rating = contrast.makeContrastRating(
      returnColour.contrastRatio
    );
    returnColour.contrastString = contrast.makeContrastRatioString(
      returnColour.contrastRatio
    );
    return returnColour;
  },
  
};
