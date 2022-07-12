
export const debounce = (callbackFunction,delayTime = 1000) =>{
    let timer; // create timer here for closure so there is only one
    return (...args) => { //create inner function
        clearTimeout(timer); // rest timer each time function is called
        timer  = setTimeout(() => { callbackFunction.apply(this, args); }, delayTime);//which this is applied
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

export const interval = (callbackFunction, delayTime = 1000) => {
    let runFunction = true;
    let oldArgs = 0;
    return (...args) => {
        if (args === oldArgs) callbackFunction(args);

        if (runFunction === true) {
            runFunction = false;
            callbackFunction(args);
            setTimeout(() => {runFunction = true;}, delayTime)
        } else {
            oldArgs = args;
            console.log(oldArgs);
        }
    }
}

