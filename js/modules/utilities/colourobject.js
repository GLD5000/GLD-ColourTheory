//Creates colours
import { clampRotate } from "./utilities.js";

export const colourObject= {
  _autoTextColour(backgroundColour) {
    const {red, green, blue} = backgroundColour;
    const contrastBlack = this._calculateContrastRatio([0,0,0],[red, green, blue]);
    const contrastWhite = this._calculateContrastRatio([1,1,1],[red, green, blue]);
    const autoColour = (contrastBlack > contrastWhite)? '#000000': '#ffffff';
    const autoContrast = Math.max(contrastBlack,contrastWhite);
    return [autoColour, autoContrast];
  },
  _calculateRelativeLuminance(RsRGB, GsRGB, BsRGB) {
    const R = (RsRGB <= 0.04045)? RsRGB/12.92: Math.pow((RsRGB+0.055)/1.055, 2.4);
    const G = (GsRGB <= 0.04045)? GsRGB/12.92: Math.pow((GsRGB+0.055)/1.055, 2.4);
    const B = (BsRGB <= 0.04045)? BsRGB/12.92: Math.pow((BsRGB+0.055)/1.055, 2.4);
    
    return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
  },
  _calculateContrastRatio(...args) {
    /*A contrast ratio of 3:1 is the minimum level recommended by [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] for standard text and vision. 
    Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
    */
    const relativeLumArr = args.map(x => this._calculateRelativeLuminance(...x)); 
    const L1 = Math.max(...relativeLumArr);
    const L2 = Math.min(...relativeLumArr);
    return (L1 + 0.05) / (L2 + 0.05);
  },
  _makeContrastRatioString(ratio) {
    const rating = (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : 'Low';
    return `Contrast Ratio: ${ratio.toFixed(2)} ${rating}`;
  },
  _makeContrastRating(ratio) {
    return (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : 'Low';
  },
  _textColourFromHex(colour){
    this._convertHexToSrgb(colour);
    this._convertSrgbToHsl(colour);
    return this._return(colour);
  },
  getTextColourContrast(textColour = null, backgroundColour = null){
    if (backgroundColour == null) return 'No Background Colour Found';//if background colour == null return
    if (textColour == null) {//auto text
      const returnColour = {name: `${backgroundColour.name}-text`};
      [returnColour.hex, returnColour.contrastRatio] = this._autoTextColour(backgroundColour);
      returnColour.rating = this._makeContrastRating(returnColour.contrastRatio);
      returnColour.contrastString = this._makeContrastRatioString(returnColour.contrastRatio);
      return this._textColourFromHex(returnColour);
    }
    const returnColour = {name: `${backgroundColour.name}-text`};
    returnColour.hex = textColour.hex;
    returnColour.contrastRatio = this._calculateContrastRatio(
      [textColour.red, textColour.green, textColour.blue], 
      [backgroundColour.red, backgroundColour.green, backgroundColour.blue]
    );
    returnColour.rating = this._makeContrastRating(returnColour.contrastRatio);
    returnColour.contrastString = this._makeContrastRatioString(returnColour.contrastRatio);
    return this._textColourFromHex(returnColour);
  },
  _convertDecimaltoHsl(sliderArray){
    return [sliderArray[0] * 3.6, sliderArray[1], sliderArray[2]];
  },
  _convertHsltoDecimal(sliderArray){
    return [sliderArray[0] / 3.6, sliderArray[1], sliderArray[2]];
  },
  _convertSlidertoSrgb(sliderArray){
    return [sliderArray[0] / 100, sliderArray[1] / 100, sliderArray[2] / 100];
  },
  _convertSrgbtoSlider(sliderArray){
    return [sliderArray[0] * 100, sliderArray[1] * 100, sliderArray[2] * 100];
  },
  _convertSliderInput(sliderArray, colourspace){
    const functionLookup = {
      hex: '_convertSrgbtoTwl',
      hsl: '_convertHsltoDecimal',
      rgb: '_convertSlidertoSrgb',
    }
    return this[functionLookup[colourspace]](sliderArray);
  },

  _convertSliderOutput(sliderArray, colourspace){
    const functionLookup = {
      hex: '_convertTwltoSrgb',
      hsl: '_convertDecimaltoHsl',
      rgb: '_convertSlidertoSrgb',
    }
    return this[functionLookup[colourspace]](sliderArray);
  },
  _convertTwltoSrgb([tint, warmth, lum]){
    tint /= 100;
    warmth /= 100;
    lum /= 100;
    const blue = Math.min(1, (2 * (1-warmth))) * lum;
    const green = Math.min(1, (2 * tint)) * Math.min(1, (2 * (warmth))) * lum;
    const red = Math.min(1, (2 * (1-tint))) * Math.min(1, (2 * (warmth))) * lum;

    return [red, green, blue];
  },
  _convertSrgbtoTwl([red, green, blue]){
    const tint = 0.5 * (green / red);
    const warmth = 0.5 * ((Math.max(red, green)) / blue);
    const lum = Math.max(red, green, blue);
    return [tint * 100, warmth * 100, lum * 100];
  },
  _convertHexToSrgb(colour) {
    const hex = colour.hex;
    // 3 digits
    if (hex.length == 4) {
      colour.red  = ('0x' + hex[1] + hex[1])/255;
      colour.green = ('0x' + hex[2] + hex[2])/255;
      colour.blue = ('0x' + hex[3] + hex[3])/255;
    // 6 digits
    } else if (hex.length == 7) {
      colour.red = ('0x' + hex[1] + hex[2])/255;
      colour.green = ('0x' + hex[3] + hex[4])/255;
      colour.blue = ('0x' + hex[5] + hex[6])/255;
    }
    return colour;
  },
  _convertSrgbToHsl(colour) {
    colour.red = clampRotate.clamp(colour.red, 0, 1);
    colour.green = clampRotate.clamp(colour.green, 0, 1);
    colour.blue = clampRotate.clamp(colour.blue, 0, 1);
    
    let {red, green, blue} = colour;


    let cmin = Math.min(red, green, blue),
        cmax = Math.max(red, green, blue),
        delta = cmax - cmin,
        hue = 0,
        sat = 0,
        lum = 0;
  
    if (delta == 0)
      hue = 0;
    else if (cmax == red)
      hue = ((green - blue) / delta) % 6;
    else if (cmax == green)
      hue = (blue - red) / delta + 2;
    else
      hue = (red - green) / delta + 4;
  
    hue = (hue * 60);//Math.round(hue * 60);
  
    if (hue < 0)
      hue += 360;
  
    lum = (cmax + cmin) / 2;
    sat = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lum - 1));
    sat = +(sat * 100);
    lum = +(lum * 100);
    [colour.hue, colour.sat, colour.lum] = [hue, sat, lum];
    return colour;
  },
  _convertHslToHex(colour) {
    colour.hue = clampRotate.rotate(colour.hue, 0, 360);
    colour.sat = clampRotate.clamp(colour.sat, 0, 100);
    colour.lum = clampRotate.clamp(colour.lum, 0, 100);
    
    let {hue, sat, lum} = colour;

    sat /= 100;
    lum /= 100;

    let chroma = (1 - Math.abs(2 * lum - 1)) * sat,
        x = chroma * (1 - Math.abs((hue / 60) % 2 - 1)),
        lightness = lum - chroma/2,
        red = 0,
        green = 0, 
        blue = 0; 
  
    if (0 <= hue && hue < 60) {
      red = chroma; green = x; blue = 0;
    } else if (60 <= hue && hue < 120) {
      red = x; green = chroma; blue = 0;
    } else if (120 <= hue && hue < 180) {
      red = 0; green = chroma; blue = x;
    } else if (180 <= hue && hue < 240) {
      red = 0; green = x; blue = chroma;
    } else if (240 <= hue && hue < 300) {
      red = x; green = 0; blue = chroma;
    } else if (300 <= hue && hue <= 360) {
      red = chroma; green = 0; blue = x;
    }
    // Having obtained RGB, convert channels to hex
    red = Math.round((red + lightness) * 255).toString(16);
    green = Math.round((green + lightness) * 255).toString(16);
    blue = Math.round((blue + lightness) * 255).toString(16);
  
    // Prepend 0s, if necessary
    if (red.length == 1)
      red = '0' + red;
    if (green.length == 1)
      green = '0' + green;
    if (blue.length == 1)
      blue = '0' + blue;
      colour.hex = '#' + red + green + blue;
    return colour;
  },
  _convertSrgbToHex(colour) {
    return this._convertHslToHex(this._convertSrgbToHsl(colour));
  },

  _return(colour) {
    this._addStringsToColourObject(colour);
    return Object.freeze(colour);
  },
  fromHsl(colour){
    this._convertHslToHex(colour);
    this._convertHexToSrgb(colour);
    return this._return(colour);
  },
  fromHex(colour){
    this._convertHexToSrgb(colour);
    this._convertSrgbToHsl(colour);
    return this._return(colour);
  },
  fromSrgb(colour){
    this._convertSrgbToHsl(colour);
    this._convertHslToHex(colour);
    return this._return(colour);
  },
  _createLookupObjects() {
    this._operationsLookup= {
      'multiply': (oldVal, newVal) =>  oldVal * newVal,
      'add': (oldVal, newVal) =>  oldVal + newVal,
      'subtract': (oldVal, newVal) =>  oldVal - newVal,
      'divide': (oldVal, newVal) =>  oldVal / newVal,
      'replace': (_, newVal) =>  newVal,
      'keep': (oldVal, _) =>  oldVal
    };
    this._constraintLookupB= {
      'hue': (x) =>  clampRotate.rotate(x, 0, 360),
      'sat': (x) =>  clampRotate.clamp(x, 0, 100),
      'lum': (x) =>  clampRotate.clamp(x, 0, 100),
      'red': (x) =>  clampRotate.clamp(x, 0, 1),
      'green': (x) =>  clampRotate.clamp(x, 0, 1),
      'blue': (x) =>  clampRotate.clamp(x, 0, 1),
    };
    this._hslArr = ['hue','sat','lum'];
    this._rgbArr = ['red','green','blue'];
  },
  _makeRandomHsl() {
    const hue = parseInt(Math.random() * 360);
    const sat = 48 + parseInt(Math.random() * 40); // 48 - 87
    const lum = 63 + parseInt(Math.random() * 25); // 63 - 88
    return [hue,sat,lum];
  },
  _convertHslToString(hue,sat,lum) {
    return `hsl(${Math.round(hue)},${sat.toFixed(0)}%,${lum.toFixed(0)}%)`//this._convertHslToHex(hue, sat, lum);
  },
  _convertRgbToString(red,green,blue) {
    return `rgb(${Math.round(red * 255)},${Math.round(green * 255)},${Math.round(blue * 255)})`
  },

  _convertHslToColourObject(hue, sat, lum, name){
    return  {'name': name, 'hue': hue, 'sat': sat, 'lum': lum};
  },
  _addStringsToColourObject(colour){
    colour.hsl =  this._convertHslToString(colour.hue,colour.sat,colour.lum);
    colour.rgb =  this._convertRgbToString(colour.red,colour.green,colour.blue);
  },
  hsl(colour){
    return this._convertHslToString(colour.hue,colour.sat,colour.lum);
  },
  rgb(colour){
    return this._convertRgbToString(colour.red,colour.green,colour.blue);
  },
  makeRandomHslString(){
      return this._convertHslToString(...this._makeRandomHsl());
  },
  makeRandomColour(name = 'primary'){
    return this.fromHsl(this._convertHslToColourObject(...this._makeRandomHsl(),name));
  },
  assign(oldColour, newColour) {//default mode is replace
    if (newColour.hasOwnProperty('hex')) return 'Error: Hex found in newColour object';//Exit for Hex
    if (this._operationsLookup == undefined) this._createLookupObjects();//build lookup objects if needed
    const colourName = newColour.name || oldColour.name;// set colour name
    let mode, keysArray;
    Object.keys(newColour).forEach(x =>{//Loop through object keys of newColour to check for hsl or rgb
      if (this._hslArr.includes(x)){
        mode = 'hsl'; // set mode
        keysArray = this._hslArr; // set keys to hsl
      } else if (this._rgbArr.includes(x)){
        mode = 'rgb'; // set mode
        keysArray = this._rgbArr; // set keys to rgb
      }
      if (mode != null) return;//exit outer loop if assignment has been made
    });

    const returnArray = keysArray.map(x => 
      [x, 
        (newColour[x] == null)? 
          oldColour[x]: 
          this._constraintLookupB[x](this._operationsLookup[newColour[`${x}Operation`] || newColour.operation || 'replace'](oldColour[x], newColour[x]))
      ]
    );

    const returnObj = Object.fromEntries([['name', colourName],...returnArray]);

    return (mode === 'hsl')? 
      this.fromHsl({...returnObj}): 
      this.fromSrgb({...returnObj});
  },
 }
 

/*  _convertTwltoSrgb({tint, warmth, lum}){
  const blue = (1 - warmth) * lum;
  const green = tint * warmth * lum;
  const red = (1 - tint) * warmth * lum;

  return {red: red, green: green, blue: blue};
},
_convertSrgbtoTwl({red, green, blue}){
  const lum = red + green + blue / 3;
  const warmth = lum * (blue / (red + green * 0.5));
  const tint = lum * warmth * red / green;
  return {tint: tint, warmth: warmth, lum: lum};
},
 */
/* const testConversion = {tint: 0.31, warmth: 0.58, lum: 0.546};
console.log(testConversion);
console.log(colourObject._convertTwltoSrgb(testConversion));
const blaha = colourObject._convertSrgbtoTwl(colourObject._convertTwltoSrgb(testConversion));
console.log(blaha);
console.log(colourObject._convertTwltoSrgb(blaha));
console.log(colourObject._convertSrgbtoTwl(colourObject._convertTwltoSrgb(blaha))); */




const testConversion = [0.31, 0.58, 0.546];
console.log(testConversion);
console.log(colourObject._convertTwltoSrgb(testConversion));
const blaha = colourObject._convertSrgbtoTwl(colourObject._convertTwltoSrgb(testConversion));
console.log(blaha);
console.log(colourObject._convertTwltoSrgb(blaha));
console.log(colourObject._convertSrgbtoTwl(colourObject._convertTwltoSrgb(blaha)));
