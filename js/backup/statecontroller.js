// UI on change methods
// Update State object
/**
 * primarySwatchHex:
primaryCustomTextColour:
primaryAutoTextState:
swatchesCustomState:
swatchesCustomHex:
gradientMode:
colourspaceMode:
 */



class PrimarySwatch{
    constructor(name) {
      // init
      this._getElements(name);
      this._smallSwatchesGroup = new SmallSwatchesGroup();
  
      this._setOnChange();
      this._colourBackground = new ColourBackground({stops: 10, name: name, hex: '#e68f75'});
      this._colourBackground.randomise();
      this._colourText = new ColourBackground({name: name + 'Text', hex: '#000'});
      this._updateBackgroundColour(this._colourBackground.hex);
      this._randomDiceColours();
      this._throttle();
      this._updateSmallSwatches();
    }
    get hex() { 
      return this._colourBackground.hex;
    }
    _throttle(){
      this._throttledUpdateBackgroundColour = throttle(() => this._updateBackgroundColour(),85);
      this._debouncedUpdateSmallSwatches = debounceB(() => this._updateSmallSwatches(),250);
      this._debounceOnChangeTextPicker = debounceB(() => this._onChangeTextPicker(),250);
      
    }
    _getElements(name) {
          //elements
          this._hueSlider = document.getElementById('slider-a');
          this._satSlider = document.getElementById('slider-b');
          this._lumSlider = document.getElementById('slider-c');
          this._picker = document.getElementById(name + '-picker');
          this._copyButton = new CopyButton(name);
          this._textPicker = document.getElementById('textcolour-picker');
          this._textWrapper = document.getElementById('textmode');
          this._modeButton = document.getElementById(name + '-mode');
          this._randomButton = document.getElementById('randomise-btn');
          this._diceButton = document.getElementById('dice-btn');
          this._dieA = document.getElementById('dieA');
          this._dieB = document.getElementById('dieB');
          this._wrapper = document.getElementById(name + '-wrapper');
          //Random dice
          [this._textColour, this._contrastRatio] = [...this._autoTextColour(this._picker.value)];
    }
    _updateSmallSwatches(){
      this._smallSwatchesGroup.updateSwatches(this._colourBackground.hex);
      this._smallSwatchesGroup.updateSwatchesText(this._colourText.hex);
    }
    _updateBackgroundColour(hex) {
      this._picker.value = this._colourBackground.hex;
      //console.log(this._colourBackground.backgroundString);
      this._wrapper.style.background = this._colourBackground.backgroundString;
      //console.log(this._wrapper);
  
      [this._colourText.hex, this._contrastRatio] = [...this._autoTextColour(this._colourBackground.red, this._colourBackground.green, this._colourBackground.blue)];
      // update contrast Ratio text
      this._wrapper.dataset.content = this._makeContrastRatioString(this._contrastRatio);
      // set text colour
      this._wrapper.style.color = this._colourText.hex; 
      // Update text picker button text
      this._textWrapper.dataset.content = 'Text: Auto';
      this._updateSliders();    
      this._copyButton.text = this._colourBackground.hex;
  
    }
    _updateSliders(){
      [this._hueSlider.value,this._satSlider.value,this._lumSlider.value] = [this._colourBackground.hue, this._colourBackground.sat, this._colourBackground.lum];
    }
    _setOnChange() {
      this._hueSlider.oninput = () =>{this._onChangeSliderHue()};
      this._satSlider.oninput = () =>{this._onChangeSliderSat()};
      this._lumSlider.oninput = () =>{this._onChangeSliderLum()};
      this._picker.oninput = () =>{this._onChangePicker()};
      this._textPicker.oninput = () =>{this._debounceOnChangeTextPicker()};
      this._modeButton.onchange = () =>{this._onChange()};
      this._randomButton.onclick = () => {this._randomise()};
      this._diceButton.onclick = () => {this._randomise()};
      
    }
    _onChange() {
      console.log('sddodslsldlsd');
    }
    _onChangeSliderHue() {
      this._colourBackground.hue = this._hueSlider.value;
      this._throttledUpdateBackgroundColour();
      this._debouncedUpdateSmallSwatches();
    }
    _onChangeSliderSat() {
      this._colourBackground.sat = this._satSlider.value;
      this._throttledUpdateBackgroundColour();
      this._debouncedUpdateSmallSwatches();
  
    }
    _onChangeSliderLum() {
      this._colourBackground.lum = this._lumSlider.value;
      this._throttledUpdateBackgroundColour();
      this._debouncedUpdateSmallSwatches();
  
    }
    _onChangePicker() {
      this._colourBackground.hex = this._picker.value;
      this._throttledUpdateBackgroundColour();
      this._debouncedUpdateSmallSwatches();
  
    }
    _onChangeTextPicker() {
      this._colourText.hex = this._textPicker.value;
      // update contrast ratio
      this._contrastRatio = this._calculateContrastRatio([this._colourText.red, this._colourText.green, this._colourText.blue],[this._colourBackground.red, this._colourBackground.green, this._colourBackground.blue]);
      // update contrast Ratio text
      this._wrapper.dataset.content = this._makeContrastRatioString(this._contrastRatio);
      // set text colour
      this._wrapper.style.color = this._colourText.hex; 
      // Update text picker button text
      this._textWrapper.dataset.content = 'Text: Custom'//Text: Auto;
      this._smallSwatchesGroup.updateSwatchesText(this._colourText.hex);
  
      
    }
    _autoTextColour(red, green, blue) {
      let contrastBlack = this._calculateContrastRatio([0,0,0],[red, green, blue]);
      let contrastWhite = this._calculateContrastRatio([1,1,1],[red, green, blue]);
      let autoColour = (contrastBlack > contrastWhite)? '#000': '#fff';
      let autoContrast = Math.max(contrastBlack,contrastWhite);
      return [autoColour, autoContrast];
    }
    _calculateRelativeLuminance(RsRGB, GsRGB, BsRGB) {
      const R = (RsRGB <= 0.04045)? RsRGB/12.92: Math.pow((RsRGB+0.055)/1.055, 2.4);
      const G = (GsRGB <= 0.04045)? GsRGB/12.92: Math.pow((GsRGB+0.055)/1.055, 2.4);
      const B = (BsRGB <= 0.04045)? BsRGB/12.92: Math.pow((BsRGB+0.055)/1.055, 2.4);
      
      return (0.2126 * R) + (0.7152 * G) + (0.0722 * B);
    }
    _calculateContrastRatio(...args) {
      /*A contrast ratio of 3:1 is the minimum level recommended by [[ISO-9241-3]] and [[ANSI-HFES-100-1988]] for standard text and vision. 
      Large-scale text and images of large-scale text have a contrast ratio of at least 4.5:1;
      */
      const relativeLumArr = args.map(x => this._calculateRelativeLuminance(...x)); 
      const L1 = Math.max(...relativeLumArr);
      const L2 = Math.min(...relativeLumArr);
      return (L1 + 0.05) / (L2 + 0.05);
    }
    _makeContrastRatioString(ratio) {
      const rating = (ratio > 4.5)? (ratio > 7)? 'AAA+': 'AA+' : 'Low';
      return `Contrast Ratio: ${ratio.toFixed(2)}${rating}`;
    }
    _makeRandomHsl() {
      const hue = parseInt(Math.random() * 360);
      const sat = 48 + parseInt(Math.random() * 40); // 48 - 87
      const lum = 53 + parseInt(Math.random() * 35); // 53 - 87
      return `hsl(${Math.round(hue)},${sat.toFixed(1)}%,${lum.toFixed(1)}%)`//this._convertHslToHex(hue, sat, lum);
    }
    _randomDiceColours() {
      this._dieA.style.backgroundColor = this._makeRandomHsl();    
      this._dieB.style.backgroundColor = this._makeRandomHsl();    
    }
    _randomise() {
      this._colourBackground.randomise();
      this._updateBackgroundColour();
      this._updateSmallSwatches();
  
      this._randomDiceColours();
    }
  }
  

  class Palette{
    constructor() {
      
      this._primaryColourSwatch = new PrimarySwatch('primaryColour');
    }
    
  }
  