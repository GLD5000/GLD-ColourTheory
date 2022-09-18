export const contrast = {
    getContrastRatio (args) {
        const maxLum = Math.max(...args);
        const minLum = Math.min(...args);
        return (maxLum + 0.05) / (minLum + 0.05);    
    },
    makeContrastRatioString(ratio) {
        const rating = ratio > 4.5 ? (ratio > 7 ? "AAA+" : "AA+") : "Low";
        return `Contrast Ratio: ${ratio.toFixed(2)} ${rating}`;
      },
    makeContrastRating(ratio) {
    return ratio > 4.5 ? (ratio > 7 ? "AAA+" : "AA+") : "Low";
    },
    

}  

