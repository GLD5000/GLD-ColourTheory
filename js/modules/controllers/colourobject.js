//Creates colours

export const colourObject= {
  _clamp(value, min = 0, max = 100) {
    return Math.min(Math.max(min, value),max);
  },
  _rotate(x, min = 0, max = 360) {
    if (x > max) x -= parseInt(x/max)*max;
    if (x < min) x -= parseInt(x/max)*max -max;
    return x;
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
    colour.red = this._clamp(colour.red, 0, 1);
    colour.green = this._clamp(colour.green, 0, 1);
    colour.blue = this._clamp(colour.blue, 0, 1);
    
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
    colour.hue = this._rotate(colour.hue, 0, 360);
    colour.sat = this._clamp(colour.sat, 0, 100);
    colour.lum = this._clamp(colour.lum, 0, 100);
    
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
      'hue': (x) =>  this._rotate(x, 0, 360),
      'sat': (x) =>  this._clamp(x, 0, 100),
      'lum': (x) =>  this._clamp(x, 0, 100),
      'red': (x) =>  this._clamp(x, 0, 1),
      'green': (x) =>  this._clamp(x, 0, 1),
      'blue': (x) =>  this._clamp(x, 0, 1),
    };
    this._hslArr = ['hue','sat','lum'];
    this._rgbArr = ['red','green','blue'];
  },
  hslString(colour){
    return `hsl(${Math.round(colour.hue)},${colour.sat.toFixed(1)}%,${colour.lum.toFixed(1)}%)`;
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