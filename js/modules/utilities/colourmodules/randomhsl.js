export const randomHsl = {
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
  _convertHslToColourObject(hue, sat, lum, name) {
    return { name: name, hue: hue, sat: sat, lum: lum };
  },
  makeRandomHslString() {
    return this._convertHslToString(...this._makeRandomHsl());
  },
  makeRandomHslStringSafer() {
    return this._convertHslToString(...this._makeRandomHslSafer());
  },
  makeRandomColourPartial(name) {
    return this._convertHslToColourObject(...this._makeRandomHsl(), name);
  },
};
