export const colourMaker= {
    swatches: {
        analogousA: {hue: -30, operation: 'add'},
        analogousB: {hue: 30, operation: 'add'},
        triadicA: {hue: -120, operation: 'add'},
        triadicB: {hue: 120, operation: 'add'},
        tetradicA: {hue: 90, operation: 'add'},
        tetradicB: {hue: 180, operation: 'add'},
        tetradicC: {hue: 270, operation: 'add'},
        monochromeA: {lum: -10, operation: 'add'},
        monochromeB: {lum: 10, operation: 'add'},
        neutral: {sat: 0, operation: 'replace'}
      },
      operations: {
        'multiply': (oldVal, newVal) =>  oldVal * newVal,
        'add': (oldVal, newVal) =>  oldVal + newVal,
        'subtract': (oldVal, newVal) =>  oldVal - newVal,
        'divide': (oldVal, newVal) =>  oldVal / newVal,
        'replace': (_, newVal) =>  newVal,
        'keep': (oldVal, _) =>  oldVal
      },
      testOldHsl: {hue: 2, sat: 2, lum: 3},
      testNewHsl: {hue: 500, sat: 500, operation: 'keep'},
      _clamp(value, min = 0, max = 100) {
        return Math.min(Math.max(min, value),max);
      },
      _rotate(x, min = 0, max = 360) {
        if (x > max) x -= parseInt(x/max)*max;
        if (x < min) x -= parseInt(x/max)*max -max;
        return x;
      },
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
      },
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
      },
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
      },
      _convertSrgbToHex(red, green, blue) {
        return this._convertHslToHex(...this._convertSrgbToHsl(red, green, blue));
      },
      _combineHSL ({oldColour, newColour}) {
        return {
          hue: (newColour.hue == null)? oldColour.hue: this._rotate(this.operations[newColour.operation || 'add'](oldColour.hue,newColour.hue)),
          sat: (newColour.sat == null)? oldColour.sat: this._clamp(this.operations[newColour.operation || 'add'](oldColour.sat,newColour.sat)),
          lum: (newColour.lum == null)? oldColour.lum: this._clamp(this.operations[newColour.operation || 'add'](oldColour.lum,newColour.lum)),
        };
      },
      _makeColourFromHSL(hue, sat, lum){
      this._map = new Map();
      },
      //log () {console.log(this._combineHSL({oldColour: this.testOldHsl, newColour: this.testNewHsl}))}
      log () {
        this._makeColourFromHSL();
        console.log(this._map);
      }
}

