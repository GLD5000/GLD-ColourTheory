import { colourspace } from "../modules/utilities/colourmodules/colourspace.js";
function sum (...args){
    console.log(args);
    return args[0] + args[1];
}

const testColour = {name:'test colour', tint: Math.random().toFixed(2), warmth: Math.random().toFixed(2), lightness: Math.random().toFixed(2)};
const colourArray = [];//[`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`];
//colourArray.push('_convertTwltoSrgb');
colourspace._convertTwltoSrgb(testColour);
colourArray.push(`t: ${testColour.tint + 0.5} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertSrgbtoTwl');
colourspace._convertSrgbtoTwl(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertTwltoSrgb');
colourspace._convertTwltoSrgb(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
//colourArray.push('_convertSrgbtoTwl');
colourspace._convertSrgbtoTwl(testColour);
colourArray.push(`t: ${testColour.tint} w: ${testColour.warmth} l: ${testColour.lightness} r: ${testColour.red} b: ${testColour.blue} g: ${testColour.green}`);
console.log(colourArray.join('\n'));
test('adds 1 + 2 to equal 3', () => {
    expect(sum(1, 2)).toBe(3);
  });
  test('adds 2 + 2 to equal 3', () => {
    expect(sum(2, 2)).toBe(4);
  });