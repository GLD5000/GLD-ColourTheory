//import { userObjects } from "./modules/view/userobjects.js";
//import { userObjectsAll } from "./modules/view/userobjects.js";
//import { variantMaker } from "./modules/controllers/variantmaker.js";
//import { gradientMaker } from "./modules/controllers/gradientmaker.js";
//import { paletteData } from "./modules/controllers/palettedata.js";
import { paletteUi } from "./modules/controllers/paletteui.js";
//import { colourObject } from "./modules/utilities/colourobject.js";
//console.log(paletteData);
paletteUi._init();
/* const testColour = {name:'test colour', tint: Math.random().toFixed(2), warmth: Math.random().toFixed(2), lightness: Math.random().toFixed(2)};
const colourArray = [];//[`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`];
//colourArray.push('_convertTwltoSrgb');
colourObject._convertTwltoSrgb(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertSrgbtoTwl');
colourObject._convertSrgbtoTwl(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertTwltoSrgb');
colourObject._convertTwltoSrgb(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertSrgbtoTwl');
colourObject._convertSrgbtoTwl(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
console.log(colourArray.join('\n'));
 */
//console.log(userObjectsAll);
function* hexGeneratorThreeDigit(string, index = 1) {
  while (index < string.length)
    yield `0x${string[index]}${string[index++]}` / 255;
}
function* hexGeneratorSixDigit(string, index = 1) {
  while (index < string.length)
    yield `0x${string[index++]}${string[index++]}` / 255;
}
const hexString = "#04f";
const hexStringIsShort = hexString.length === 4 ? true : false;
//const testIterator = hexStringIsShort? hexGeneratorThreeDigit(hexString): hexGeneratorSixDigit(hexString);

const getGenerator = (string) => {
  const convertHexDigitsToDecimal = (digitOne, digitTwo) => {
    return `0x${digitOne}${digitTwo}` / 255;
  };

  function* hexGeneratorThreeDigit(string, index = 1) {
    while (index < string.length) {
      const digitOne = string[index];
      const digitTwo = string[index++];
      yield convertHexDigitsToDecimal(digitOne, digitTwo);
    }
  }
  function* hexGeneratorSixDigit(string, index = 1) {
    while (index < string.length)
      yield `0x${string[index++]}${string[index++]}` / 255;
  }
  const hexStringIsShort = hexString.length === 4 ? true : false;
  return hexStringIsShort
    ? hexGeneratorThreeDigit(string)
    : hexGeneratorSixDigit(string);
};
const testIterator = getGenerator(hexString);

console.log(testIterator.next().value);
console.log(testIterator.next().value);
console.log(testIterator.next().value);
