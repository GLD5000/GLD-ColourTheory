/**
 * Class representing all colours
 * Super-class for single and gradient colours
 * Contains methods for colour classes to use
 * @class
 */
export class Colour {
    _convertHslToString(hue,sat,lum){
      return `hsl(${Math.round(hue)}, ${Math.round(sat)}%, ${Math.round(lum)}%)`;
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
    _adjustHslColourHue(hue, sat, lum, rotation){
      let adjustment = Math.round(hue) + Math.round(rotation);
      if (adjustment > 360) adjustment += -360;
      if (adjustment < 0) adjustment += 360;
      return [adjustment, sat, lum]; 
    }
    _adjustHslColourLuminance(hue, sat, lum, adjustment){
      return [hue, sat, Math.max(0, Math.min(100, lum + adjustment))]; 
    }
    _adjustHslColourSaturation(hue, sat, lum, adjustment){
      return [hue, Math.max(0, Math.min(100, sat + adjustment)), lum]; 
    }
    _setHslColourHue(newHue, sat, lum){
      return [newHue, sat, lum]; 
    }
    _setHslColourSaturation(hue, newSat, lum){
      return [hue, newSat, lum]; 
    }
    _setHslColourLuminance(hue, sat, newLum){
      return [hue, sat, newLum]; 
    }
    _calculateRelativeLuminance(RsRGB, GsRGB, BsRGB){
      const R = (RsRGB <= 0.04045)? RsRGB/12.92: Math.pow((RsRGB+0.055)/1.055, 2.4);
      const G = (GsRGB <= 0.04045)? GsRGB/12.92: Math.pow((GsRGB+0.055)/1.055, 2.4);
      const B = (BsRGB <= 0.04045)? BsRGB/12.92: Math.pow((BsRGB+0.055)/1.055, 2.4);
  
      return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
     }
    _calculateContrastRatio(...args){
      /*A contrast ratio of 3:1 is the minimum level recommended by [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] for standard text and vision. 
      Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
      */
      const relativeLumArr = args.map(x => this._calculateRelativeLuminance(...x)); 
      const L1 = Math.max(...relativeLumArr);
      const L2 = Math.min(...relativeLumArr);
      return (L1 + 0.05) / (L2 + 0.05);
    }
  }
      

  