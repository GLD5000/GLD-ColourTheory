//Creates colours
import { clampRotate } from "./utilities.js";

export const colourObject= {
  _autoTextColour(backgroundColour) {
    const {red, green, blue} = backgroundColour;
    const contrastBlack = this._calculateContrastRatio([0, 0, 0],[red, green, blue]);
    const contrastWhite = this._calculateContrastRatio([1, 1, 1],[red, green, blue]);
    const autoColour = (contrastBlack > contrastWhite)? '#000000': '#ffffff';
    const autoContrast = Math.max(contrastBlack, contrastWhite);
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
  _convertSlidertoHsl(sliderArray){
    return [sliderArray[0] * 3.6, sliderArray[1], sliderArray[2]];
  },
  _convertHsltoSlider(sliderArray){
    return [sliderArray[0] / 3.6, sliderArray[1], sliderArray[2]];
  },
  _convertSlidertoSrgb(sliderArray){
    return [sliderArray[0] / 100, sliderArray[1] / 100, sliderArray[2] / 100];
  },
  _convertSrgbtoSlider(sliderArray){
    return [sliderArray[0] * 100, sliderArray[1] * 100, sliderArray[2] * 100];
  },
  _convertTwltoSlider(sliderArray){
    return [parseInt(sliderArray[0]) , parseInt(sliderArray[1]), parseInt(sliderArray[2])];
  },
  _convertSliderInput(sliderArray, colourspace){
    const functionLookup = {
      hex: '_convertTwltoSlider',
      hsl: '_convertHsltoSlider',
      rgb: '_convertSrgbtoSlider',
    }
    return this[functionLookup[colourspace]](sliderArray);
  },
  _convertSliderOutput(sliderArray, colourspace){
    const functionLookup = {
      hex: '_convertTwltoSlider',
      hsl: '_convertSlidertoHsl',
      rgb: '_convertSlidertoSrgb',
    }
    return this[functionLookup[colourspace]](sliderArray);
  },
  _createStrings(colour){
    if (colour.name === 'primary') colour.twl =  this._convertTwlToString(colour.tint, colour.warmth, colour.lightness);
    colour.rgb =  this._convertRgbToString(colour.red, colour.green, colour.blue);
    colour.hsl =  this._convertHslToString(colour.hue, colour.sat, colour.lum);
  },
  _convertTwltoSrgb(colour){
    colour.tint = this._constraintLookupB['tint'](colour.tint);
    colour.warmth = this._constraintLookupB['warmth'](colour.warmth);
    colour.lightness = this._constraintLookupB['lightness'](colour.lightness);

    const tinyTint = colour.tint * 0.01;
    const tinyWarmth = colour.warmth * 0.01;
    const tinyLum = colour.lightness * 0.01;
    colour.blue = this._constraintLookupB['blue'](Math.min(1, (2 * (1-tinyWarmth))) * tinyLum);//fix the lum here to match below!!!
    colour.green = this._constraintLookupB['green'](Math.min(1, (2 * tinyTint)) * Math.min(1, (2 * (tinyWarmth))) * tinyLum);
    colour.red = this._constraintLookupB['red'](Math.min(1, (2 * (1-tinyTint))) * Math.min(1, (2 * (tinyWarmth))) * tinyLum);
    return colour;
  },
  _convertSrgbtoTwl(colour){
    colour.red = this._constraintLookupB['red'](colour.red);
    colour.green = this._constraintLookupB['green'](colour.green);
    colour.blue = this._constraintLookupB['blue'](colour.blue);
    colour.tint = this._constraintLookupB['tint'](100 * (0.5 * (colour.green / colour.red)));
    colour.warmth = this._constraintLookupB['warmth'](100 * (0.5 * ((Math.max(colour.red, colour.green)) / colour.blue)));
    colour.lightness = this._constraintLookupB['lightness'](100 * 0.5 * ((colour.red + colour.green + colour.blue) - Math.min(colour.red, colour.green, colour.blue)));//(Math.max(colour.red, colour.green, colour.blue));
    return colour;
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
    colour.red = this._constraintLookupB['red'](colour.red);
    colour.green = this._constraintLookupB['green'](colour.green);
    colour.blue = this._constraintLookupB['blue'](colour.blue);
    
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
  
    hue = (hue * 60);
  
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
    colour.hue = this._constraintLookupB['hue'](colour.hue);
    colour.sat = this._constraintLookupB['sat'](colour.sat);
    colour.lum = this._constraintLookupB['lum'](colour.lum);
    
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
    this._createStrings(colour);
    return Object.freeze(colour);
  },
  fromTwl(colour){
    this._convertTwltoSrgb(colour)
    this._convertSrgbToHsl(colour);
    this._convertHslToHex(colour);
    return this._return(colour);
  },
  fromHsl(colour){
    this._convertHslToHex(colour);
    this._convertHexToSrgb(colour);
    if (colour.name === 'primary') this._convertSrgbtoTwl(colour);
    return this._return(colour);
  },
  fromHex(colour){
    this._convertHexToSrgb(colour);
    this._convertSrgbToHsl(colour);
    if (colour.name === 'primary') this._convertSrgbtoTwl(colour);
    return this._return(colour);
  },
  fromSrgb(colour){
    this._convertSrgbToHsl(colour);
    this._convertHslToHex(colour);
    if (colour.name === 'primary') this._convertSrgbtoTwl(colour);
    return this._return(colour);
  },
    _operationsLookup: {
      'multiply': (oldVal, newVal) =>  oldVal * newVal,
      'add': (oldVal, newVal) =>  oldVal + newVal,
      'subtract': (oldVal, newVal) =>  oldVal - newVal,
      'divide': (oldVal, newVal) =>  oldVal / newVal,
      'replace': (_, newVal) =>  newVal,
      'keep': (oldVal, _) =>  oldVal
    },
    _constraintLookupB: {
      'hue': (x) =>  clampRotate.rotate(x, 0, 360),
      'sat': (x) =>  clampRotate.clamp(x, 10, 100),
      'lum': (x) =>  clampRotate.clamp(x, 15, 95),
      'red': (x) =>  clampRotate.clamp(x, 0, 1),
      'green': (x) =>  clampRotate.clamp(x, 0, 1),
      'blue': (x) =>  clampRotate.clamp(x, 0, 1),
      'tint': (x) =>  clampRotate.clamp(x, 0, 100),
      'warmth': (x) =>  clampRotate.clamp(x, 0, 100),
      'lightness': (x) =>  clampRotate.clamp(x, 20, 95),
    },
    _hslArr: ['hue','sat','lum'],
    _rgbArr: ['red','green','blue'],
  
  _makeRandomHsl() {
    const hue = parseInt(Math.random() * 360);
    const sat = 48 + parseInt(Math.random() * 40); // 48 - 87
    const lum = 63 + parseInt(Math.random() * 25); // 63 - 88
    return [hue, sat, lum];
  },
  _makeRandomHslSafer() {
    const hue = parseInt(Math.random() * 360);
    const sat = 28 + parseInt(Math.random() * 5); // 48 - 87
    const lum = 65 + parseInt(Math.random() * 5); // 63 - 88
    return [hue, sat, lum];
  },


  _convertHslToString(hue, sat, lum) {
    return `hsl(${Math.round(hue)},${sat.toFixed(0)}%,${lum.toFixed(0)}%)`;
  },
  _convertTwlToString(tint, warmth, lightness) {
    return `twl(${Math.round(tint)}%,${warmth.toFixed(0)}%,${lightness.toFixed(0)}%)`;
  },

  _convertRgbToString(red, green, blue) {
    return `rgb(${Math.round(red * 255)},${Math.round(green * 255)},${Math.round(blue * 255)})`
  },
  _convertHslToColourObject(hue, sat, lum, name){
    return  {'name': name, 'hue': hue, 'sat': sat, 'lum': lum};
  },
  hsl(colour){
    return this._convertHslToString(colour.hue, colour.sat, colour.lum);
  },
  rgb(colour){
    return this._convertRgbToString(colour.red, colour.green, colour.blue);
  },
  makeRandomHslString(){
      return this._convertHslToString(...this._makeRandomHsl());
  },
  makeRandomHslStringSafer(){
    return this._convertHslToString(...this._makeRandomHslSafer());
},

  makeRandomColour(name = 'primary'){
    return this.fromHsl(this._convertHslToColourObject(...this._makeRandomHsl(), name));
  },
  assign(oldColour, newColour) {//default mode is replace
    if (newColour.hasOwnProperty('hex')) return 'Error: Hex found in newColour object';//Exit for Hex
    const colourName = newColour.name || oldColour.name;// set colour name
    console.log(colourName);
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
 
