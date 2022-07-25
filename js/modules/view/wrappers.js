export function makeSecondaryPickersObject(){
    const secondaryPickerList = [
        'analogousA',
        'analogousB',
        'triadicA',
        'triadicB',
        'tetradicA',
        'tetradicB',
        'tetradicC',
        'monochromeA',
        'monochromeB',
        'neutral',
    ];
    const returnObj = {};
    secondaryPickerList.forEach(x => {
        returnObj[x] = document.getElementById(x + '-picker');
    });
}
console.log(makeSecondaryPickersObject());