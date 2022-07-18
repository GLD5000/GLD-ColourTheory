export const paletteState = new Map([//mutable object to store current state
[primarySwatchHex, undefined],
[customTextHex, undefined],
[autoTextState, undefined],
[smallSwatchCustomStates, undefined],
[smallSwatchCustomHexes, undefined],
[gradientMode, undefined],
[colourSpaceMode, undefined],

//N.B. AutotextColour does not need to be stored as it is generated when colours are made for each swatch background and auto colour rating is made
])