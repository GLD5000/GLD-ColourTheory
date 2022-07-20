export const colourMaker= {
  _clamp(value, min = 0, max = 100) {
    return Math.min(Math.max(min, value),max);
  },
  _rotate(x, min = 0, max = 360) {
    if (x > max) x -= parseInt(x/max)*max;
    if (x < min) x -= parseInt(x/max)*max -max;
    return x;
  },
  _convertHexToSrgb(colourObject) {
    const hex = colourObject.hex;
    // 3 digits
    if (hex.length == 4) {
      colourObject.red  = ('0x' + hex[1] + hex[1])/255;
      colourObject.green = ('0x' + hex[2] + hex[2])/255;
      colourObject.blue = ('0x' + hex[3] + hex[3])/255;
    // 6 digits
    } else if (hex.length == 7) {
      colourObject.red = ('0x' + hex[1] + hex[2])/255;
      colourObject.green = ('0x' + hex[3] + hex[4])/255;
      colourObject.blue = ('0x' + hex[5] + hex[6])/255;
    }
    return colourObject;
  },
  _convertSrgbToHsl(colourObject) {
    colourObject.red = this._clamp(colourObject.red, 0, 1);
    colourObject.green = this._clamp(colourObject.green, 0, 1);
    colourObject.blue = this._clamp(colourObject.blue, 0, 1);
    
    let {red, green, blue} = colourObject;


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
    [colourObject.hue, colourObject.sat, colourObject.lum] = [hue, sat, lum];
    return colourObject;
  },
  _convertHslToHex(colourObject) {
    colourObject.hue = this._rotate(colourObject.hue, 0, 360);
    colourObject.sat = this._clamp(colourObject.sat, 0, 100);
    colourObject.lum = this._clamp(colourObject.lum, 0, 100);
    
    let {hue, sat, lum} = colourObject;

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
      colourObject.hex = '#' + red + green + blue;
    return colourObject;
  },
  _convertSrgbToHex(colourObject) {
    return this._convertHslToHex(this._convertSrgbToHsl(colourObject));
  },
  makeColourFromHSL(colourObject){
    this._convertHslToHex(colourObject);
    this._convertHexToSrgb(colourObject);
    return Object.freeze(colourObject);
  },
  makeColourFromHex(colourObject){
    this._convertHexToSrgb(colourObject);
    this._convertSrgbToHsl(colourObject);
    return Object.freeze(colourObject);
  },
  makeColourFromSrgb(colourObject){
    this._convertSrgbToHsl(colourObject);
    this._convertHslToHex(colourObject);
    return Object.freeze(colourObject);
  },
}

