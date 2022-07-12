
export const debounce = (callbackFunction,delayTime = 1000) =>{
    let timer;
    return (...args) => {
        clearTimeout(timer);
        timer  = setTimeout(() => { callbackFunction.apply(this, args); }, delayTime);
    };
}

export const throttle = (callbackFunction, delayTime = 1000) => {
    let runFunction = true;
    return (...args) => {
        if (runFunction === true) {
            runFunction = false;
            callbackFunction(args);
            setTimeout(() => {runFunction = true;}, delayTime)
        } 
    }
}