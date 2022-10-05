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
  _luminanceAboveCutoff(luminance) {
    const luminanceCutoff = 0.1791287847;
    return luminance > luminanceCutoff;
  },
  _convertLuminanceToSrgbDecimal(luminance) {
    console.log(`luminance ${luminance}`);

    const luminanceThreshold = 0.04045 / 12.92;
    const luminanceAboveThreshold = luminance > luminanceThreshold;
    if (luminanceAboveThreshold) {
      const srgbDecimal = 1.055 * luminance ** (1 / 2.4) - 0.055;

      return srgbDecimal;
    }
    const srgbDecimal = luminance * 12.92;

    return srgbDecimal;
  },
  _convertSrgbDecimalToHex(srgbDecimal) {
    const hexString =
      "#" +
      Math.round(srgbDecimal * 255)
        .toString(16)
        .repeat(3);
    return hexString;
  },
  _convertLuminanceToHex(luminance) {
    const srgbDecimal = contrast._convertLuminanceToSrgbDecimal(luminance);
    console.log(`srgbDecimal ${srgbDecimal}`);
    const hexString = contrast._convertSrgbDecimalToHex(srgbDecimal);
    return hexString;
  },
  _clampLuminance(luminance) {
    return Math.min(1, Math.max(0, luminance));
  },
  _calculateMinLuminance(maxLuminance, targetContrast) {
    const minLuminance =
      (-0.05 * targetContrast + maxLuminance + 0.05) / targetContrast;
    return contrast._clampLuminance(minLuminance);
  },
  _calculateMaxLuminance(minLuminance, targetContrast) {
    const maxLuminance = targetContrast * (minLuminance + 0.05) - 0.05;
    console.log(`maxLuminance ${maxLuminance}`);

    return contrast._clampLuminance(maxLuminance);
  },
  _calculateTargetLuminance(backgroundLuminance, targetContrast) {
    const backgroundLuminanceIsMax =
      contrast._luminanceAboveCutoff(backgroundLuminance);
    console.log(`backgroundLuminanceIsMax ${backgroundLuminanceIsMax}`);
    const textLuminance = backgroundLuminanceIsMax
      ? contrast._calculateMinLuminance(backgroundLuminance, targetContrast)
      : contrast._calculateMaxLuminance(backgroundLuminance, targetContrast);
    return textLuminance;
  },
  _getTextColourSetContrast(backgroundLuminance, targetContrast) {
    console.clear();
    console.log(`backgroundLuminance ${backgroundLuminance}`);
    console.log(`targetContrast ${targetContrast}`);
    const textLuminance = contrast._calculateTargetLuminance(
      backgroundLuminance,
      targetContrast
    );
    console.log(`textLuminance ${textLuminance}`);

    const textColour = contrast._convertLuminanceToHex(textLuminance);
    console.log(`textColour ${textColour}`);
    const textContrast = contrast.getContrastRatio([
      textLuminance,
      backgroundLuminance,
    ]);
    return [textColour, textContrast];
  },
  _getTextColourMaxContrast(backgroundLuminance) {
    const backgroundLuminanceIsAboveCutoff =
      contrast._luminanceAboveCutoff(backgroundLuminance);
    const textColour = backgroundLuminanceIsAboveCutoff ? "#000000" : "#ffffff";
    const textLuminance = backgroundLuminanceIsAboveCutoff ? 0 : 1;
    const textContrast = contrast.getContrastRatio([
      textLuminance,
      backgroundLuminance,
    ]);
    return [textColour, textContrast];
  },
  _autoTextColour(backgroundColour, targetContrast = null) {
    const backgroundLuminance = backgroundColour.relativeLuminance;
    if (targetContrast === null)
      return contrast._getTextColourMaxContrast(backgroundLuminance);

    return contrast._getTextColourSetContrast(
      backgroundLuminance,
      targetContrast
    );
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
