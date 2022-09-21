import { paletteUi } from "./modules/controllers/paletteui.js";
import { colourspace } from "./modules/utilities/colourmodules/colourspace.js";
paletteUi._init();

const testColour = {
  name: "test colour",
  tint: Math.random().toFixed(2),
  warmth: Math.random().toFixed(2),
  lightness: Math.random().toFixed(2),
};
const colourArray = []; //[`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`];
//colourArray.push('_convertTwlToSrgb');
colourspace._convertTwlToSrgb(testColour);
colourArray.push(
  `t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`
);
//colourArray.push('_convertSrgbToTwl');
colourspace._convertSrgbToTwl(testColour);
colourArray.push(
  `t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`
);
//colourArray.push('_convertTwlToSrgb');
colourspace._convertTwlToSrgb(testColour);
colourArray.push(
  `t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`
);
//colourArray.push('_convertSrgbToTwl');
colourspace._convertSrgbToTwl(testColour);
colourArray.push(
  `t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`
);
console.log(colourArray.join("\n"));
