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
let hexString = "#dd55aa";
//hexString = "#f5a";
const hexStringIsShort = hexString.length === 4 ? true : false;
//const testIterator = hexStringIsShort? hexGeneratorThreeDigit(hexString): hexGeneratorSixDigit(hexString);

const getGenerator = (string) => {
  const convertHexDigitsToSrgb = (digitOne, digitTwo = digitOne) => {
    return `0x${digitOne}${digitTwo}` / 255;
  };

  function* hexGeneratorThreeDigit(string, index = 1) {
    while (index < string.length) {
      const digitOne = string[index];
      const digitTwo = string[index++];
      yield convertHexDigitsToSrgb(digitOne, digitTwo);
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

const hexChunkerConverter = (string) => {
  const convertHexDigitsToSrgb = (digitOne, digitTwo = digitOne) => {
    return `0x${digitOne}${digitTwo}` / 255;
  };
  const firstChar = string[0] === "#" ? 1 : 0;
  const chunkSize = string.length > 5 ? 2 : 1;
  function* stringChunker(
    string,
    { chunkSize = 1, firstChar = 0, callBackFn = null }
  ) {
    let index = firstChar;
    const length = string.length;
    while (index < length) {
      const characters = [];
      for (let i = 1; i <= chunkSize; i++) {
        characters.push(string[index++]);
      }
      yield callBackFn === null ? characters : callBackFn(...characters);
    }
  }
  return stringChunker(string, {
    chunkSize,
    firstChar,
    callBackFn: convertHexDigitsToSrgb,
  });
};
const [, a, b, c, d, e, f] = "#12ff34";
console.log([a, b], [c, d], [e, f]);
const testIterator = hexChunkerConverter(hexString);
console.log(testIterator.next().value);
console.log(testIterator.next().value);
console.log(testIterator.next().value);
