/**
 * Class representing all colours
 * Super-class for single and gradient colours
 * Contains methods for colour classes to use
 * @class
 */
 export class Colour {
  _initHex() {
    if (this._hex !== undefined) return;
    this._hex = (this._hue !== undefined)? 
    this._convertHslToHex(this._hue, this._sat, this._lum): 
    this._convertSrgbToHex(this._red, this._green, this._blue);
  }
  _initSrgb() {
    if (this._red !== undefined && this._green !== undefined && this._blue !== undefined) return;
    [this._red, this._green, this._blue] = this._convertHexToSrgb(this._hex);
  }
  _initHsl() {
    if (this._hue !== undefined && this._sat !== undefined && this._lum !== undefined) return;
    [this._hue, this._sat, this._lum] = this._convertSrgbToHsl(this._red, this._green, this._blue);
  }
  _initStrings(){
    this._rgb = `rgb(${this._red * 255},${this._green * 255},${this._blue * 255})`
    this._hsl = `hsl(${Math.round(this._hue)},${this._sat.toFixed(1)}%,${this._lum.toFixed(1)}%)`
  }
  _initAll() {
    this._initHex();
    this._initSrgb();
    this._initHsl();
    this._initStrings();
  }
  _convertHexToSrgb(hex) {
    let RsRGB = 0, GsRGB = 0, BsRGB = 0;
    // 3 digits
    if (hex.length == 4) {
      RsRGB  = ('0x' + hex[1] + hex[1])/255;
      GsRGB = ('0x' + hex[2] + hex[2])/255;
      BsRGB = ('0x' + hex[3] + hex[3])/255;
    // 6 digits
    } else if (hex.length == 7) {
      RsRGB = ('0x' + hex[1] + hex[2])/255;
      GsRGB = ('0x' + hex[3] + hex[4])/255;
      BsRGB = ('0x' + hex[5] + hex[6])/255;
    }
    return [RsRGB, GsRGB, BsRGB];
  }
  _convertSrgbToHsl(RsRGB, GsRGB, BsRGB) {

    let cmin = Math.min(RsRGB, GsRGB, BsRGB),
        cmax = Math.max(RsRGB, GsRGB, BsRGB),
        delta = cmax - cmin,
        hue = 0,
        sat = 0,
        lum = 0;
  
    if (delta == 0)
      hue = 0;
    else if (cmax == RsRGB)
      hue = ((GsRGB - BsRGB) / delta) % 6;
    else if (cmax == GsRGB)
      hue = (BsRGB - RsRGB) / delta + 2;
    else
      hue = (RsRGB - GsRGB) / delta + 4;
  
    hue = (hue * 60);//Math.round(hue * 60);
  
    if (hue < 0)
      hue += 360;
  
    lum = (cmax + cmin) / 2;
    sat = delta == 0 ? 0 : delta / (1 - Math.abs(2 * lum - 1));
    sat = +(sat * 100);
    lum = +(lum * 100);
    return [hue, sat, lum];
  }
  _convertHslToHex(hue, sat, lum) {
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
  
    return '#' + red + green + blue;
  }
  _convertSrgbToHex(red, green, blue) {
    return this._convertHslToHex(...this._convertSrgbToHsl(red, green, blue));
  }
  get hsl(){
    return this._hsl;
  }
  get rgb(){
    return this._rgb;
  }

  get hex() {
    return this._hex;
  }
  get hue() {
    return this._hue;
  }
  get sat() {
    return this._sat;
  }
  get lum() {
    return this._lum;
  }
  get red() {
    return this._red;
  }
  get green() {
    return this._green;
  }
  get blue() {
    return this._blue;
  }
  get name() {
    return this._name;
  }
  set hex(x) {
    this._clearHsl();
    this._clearSrgb();
    this._hex = x;
    this._initAll();
  }
  set hue(x) {
    this._clearHex();
    this._clearSrgb();
    this._hue = this._rotateDegrees(x);
    this._initAll();

  }
  set sat(x) {
    this._clearHex();
    this._clearSrgb();
    this._sat = this._clamp(0, x, 100);
    this._initAll();
  }
  set lum(x) {
    this._clearHex();
    this._clearSrgb();
    this._lum = this._clamp(0, x, 100);
    this._initAll();
  }
  set red(x) {
    this._clearHsl();
    this._clearHex();
    this._red = this._clamp(0, x, 1);
    this._initAll();
  }
  set green(x) {
    this._clearHsl();
    this._clearHex();
    this._green = this._clamp(0, x, 1);
    this._initAll();
  }
  set blue(x) {
    this._clearHsl();
    this._clearHex();
    this._blue = this._clamp(0, x, 1);
    this._initAll();
  }
  set name(x) {
    this._name = x;
  }
  _clamp(min, value, max) {
    return Math.min(Math.max(min, value),max);
  }
  _rotateDegrees(x, degrees = 360) {
    if (x > degrees) x -= degrees;
    if (x < 0) x += degrees;
    return x;
  }
  newCopyHslmult(suffix, {lum = 1, hue = 1, sat = 1}){
    return new Colour(this.name + suffix,{hue: this.hue * hue, sat: this.sat * sat, lum: this.lum * lum});
  }
  _clearHex() {
    this._hex = undefined; 
  }
  _clearHsl() {
    this._hue = undefined; 
    this._sat = undefined; 
    this._lum = undefined; 
  }
  _clearSrgb() {
    this._red = undefined; 
    this._green = undefined; 
    this._blue = undefined;
  }
  _adjustHslColourHue(hue, sat, lum, rotation) {
    let adjustment = Math.round(hue) + Math.round(rotation);
    if (adjustment > 360) adjustment += -360;
    if (adjustment < 0) adjustment += 360;
    return [adjustment, sat, lum]; 
  }
  _adjustHslColourLuminance(hue, sat, lum, adjustment) {
    return [hue, sat, Math.max(0, Math.min(100, lum + adjustment))]; 
  }
  _adjustHslColourSaturation(hue, sat, lum, adjustment) {
    return [hue, Math.max(0, Math.min(100, sat + adjustment)), lum]; 
  }
  _setHslColourHue(newHue, sat, lum) {
    return [newHue, sat, lum]; 
  }
  _setHslColourSaturation(hue, newSat, lum) {
    return [hue, newSat, lum]; 
  }
  _setHslColourLuminance(hue, sat, newLum) {
    return [hue, sat, newLum]; 
  }
  randomise() {
    this._hue = parseInt(Math.random() * 360);
    this._sat = 48 + parseInt(Math.random() * 40); // 48 - 87
    this._lum = 53 + parseInt(Math.random() * 35); // 53 - 87
    this._clearHex();
    this._clearSrgb();
    this._initAll();
  }
}


  