import { contrast } from "../modules/utilities/colourmodules/contrast.js";
import { luminance } from "../modules/utilities/colourmodules/luminance.js";
import { colourObject } from "../modules/utilities/colourobject.js";
test(`Test contrast ratio 0.18791042537119776`, () => {
  const backgroundColour = {
    relativeLuminance: 0.18791042537119776,
  };
  expect(contrast._autoTextColour(backgroundColour, 4.55)[1].toFixed(2)).toBe(
    "4.55"
  );
});
test(`Test contrast ratio #000000`, () => {
  const backgroundColour = { hex: "#000000", relativeLuminance: 0 };
  expect(contrast._autoTextColour(backgroundColour, 4.55)[1].toFixed(2)).toBe(
    "4.55"
  );
});
test(`Test contrast ratio #ffffff`, () => {
  const backgroundColour = { hex: "#ffffff", relativeLuminance: 1 };
  expect(contrast._autoTextColour(backgroundColour, 4.55)[1].toFixed(2)).toBe(
    "4.55"
  );
});
test(`Test contrast ratio 0.28791042537119776`, () => {
  const backgroundColour = {
    relativeLuminance: 0.28791042537119776,
  };
  expect(contrast._autoTextColour(backgroundColour, 8.55)[0]).toBe("#000000");
});
test(`Test contrast ratio 0.1791287847`, () => {
  const backgroundColour = {
    relativeLuminance: 0.1791287847,
  };
  expect(contrast._autoTextColour(backgroundColour, 8.55)[0]).toBe("#ffffff");
});

test(`Test contrast ratio 0.1891287847`, () => {
  const backgroundColour = {
    relativeLuminance: 0.1891287847,
  };
  expect(contrast._autoTextColour(backgroundColour, 8.55)[0]).toBe("#000000");
});

function testLoop() {
  for (let lum = 0.022122; lum < 1; lum += 0.01) {
    test(`Test _autoTextColour contrast ratio ${lum}`, () => {
      const backgroundColour = {
        relativeLuminance: lum,
      };
      expect(contrast._autoTextColour(backgroundColour, 7)[1]).toBeGreaterThan(
        4.58
      );
    });
  }
}
testLoop();
function testLoopB() {
  for (let lum = 0.022122; lum < 1; lum += 0.01) {
    const backgroundColour = {
      relativeLuminance: lum,
    };
    const returnColour = colourObject.fromHex({
      hex: contrast._autoTextColour(backgroundColour, 7)[0],
    });
    const targetContrast = 7;
    const minContrast = 4;
    const returnContrast = contrast._autoTextColour(backgroundColour, 7)[1];
    const luminanceAboveCutoff = contrast._luminanceAboveCutoff(lum);
    test(`Test _autoTextColour return colour object 
      luminanceAboveCutoff: ${luminanceAboveCutoff}
      contrast ratio: ${returnContrast} 
      from lum: ${lum} 
      return text colour: ${returnColour.hex}`, () => {
      expect(
        Math.round(
          contrast.getContrastRatio([
            returnColour.relativeLuminance,
            backgroundColour.relativeLuminance,
          ])
        )
      ).toBeGreaterThan(minContrast);
    });
  }
}
testLoopB();

function testLoopC() {
  for (let lum = 0.022122; lum < 1; lum += 0.01) {
    const hex = contrast._convertLuminanceToHex(lum);
    const returnColour = colourObject.fromHex({ hex: hex });
    test(`Test _convertLuminanceToHex return colour luminance ${lum}`, () => {
      expect(returnColour.relativeLuminance.toFixed(1)).toBe(lum.toFixed(1));
    });
  }
}
testLoopC();

function testLoopD() {
  for (let lum = 0.022122; lum < 1; lum += 0.01) {
    const randomLum = Math.random();
    const contrastIn = contrast.getContrastRatio([lum, randomLum]);
    const hex = contrast._convertLuminanceToHex(lum);
    const returnLum = contrast._calculateTargetLuminance(lum, contrastIn);
    test(`Test _calculateTargetLuminance return contrast ratio ${lum} contrast ${contrastIn} randomLum ${randomLum}`, () => {
      expect(contrast.getContrastRatio([lum, returnLum]).toFixed(5)).toBe(
        contrastIn.toFixed(5)
      );
    });
  }
}
testLoopD();
