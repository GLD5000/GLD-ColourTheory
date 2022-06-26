/**
 * Class representing all colours
 * Super-class for single and gradient colours
 * Contains methods for colour classes to use
 * @class
 */
export class ColourFunctions {
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
      

  