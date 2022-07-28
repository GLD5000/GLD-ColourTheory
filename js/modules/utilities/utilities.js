export const clampRotate = {
    clamp(value, min = 0, max = 100) {
        return Math.min(Math.max(min, value),max);
    },
    rotate(value, min = 0, max = 360) {
        if (value > max) value -= parseInt(value/max)*max;
        if (value < min) value -= parseInt(value/max)*max -max;
        return value;
      },
};

export const throttleDebounce = {
    throttle(callbackFunction, delayTime = 250) {
        let execute = true;
        let waitingArgs;
        const waitHandler = () => {
            if (waitingArgs == null) {
                execute = true;
            } else {
               // callbackFunction(...waitingArgs); 
                callbackFunction(waitingArgs); 
                waitingArgs = null;
                setTimeout(waitHandler, delayTime);
            }
        } 
        return (...args) => {
            if (execute === false) {
                waitingArgs = args; 
                return;
            } // do not run function
    
                callbackFunction(args); // run function
    
                execute = false; // already run
    
                setTimeout(waitHandler, delayTime); // reset
        }
    },
    throttleB(callbackFunction, delayTime = 250) {
        let execute = true;
        let waitingArgs;
        const waitHandler = () => {
            if (waitingArgs == null) {
                execute = true;
            } else {
                callbackFunction(...waitingArgs); 
                //callbackFunction(waitingArgs); 
                waitingArgs = null;
                setTimeout(waitHandler, delayTime);
            }
        } 
        return (...args) => {
            if (execute === false) {
                waitingArgs = args; 
                return;
            } // do not run function
    
                callbackFunction(args); // run function
    
                execute = false; // already run
    
                setTimeout(waitHandler, delayTime); // reset
        }
    },

    debounce(callbackFunction,delayTime = 1000) {//My own version
        let timer; 
        let counter = 0;
        return (...args) => { //create inner function
            if (counter === 0) callbackFunction.apply(this, args);//get first click
            counter = 1;
            clearTimeout(timer); // reset timer each time function is called
            timer  = setTimeout(() => { callbackFunction.apply(this, args); counter = 0;
            }, delayTime);//which this is applied
        };
    },
};
