// utils/functionUtils.js

export const debounce = (func: { apply: (arg0: undefined, arg1: any[]) => void; }, delay: number | undefined) => {
    let timeoutId: string | number | NodeJS.Timeout | undefined;
    return (...args: any) => {
        clearTimeout(timeoutId);
        timeoutId = setTimeout(() => func.apply(this, args), delay);
    };
};

export const throttle = (func: { apply: (arg0: undefined, arg1: any[]) => void; }, limit: number) => {
    let lastFunc: string | number | NodeJS.Timeout | undefined;
    let lastRan: number;
    return (...args: any) => {
        if (!lastRan) {
            func.apply(this, args);
            lastRan = Date.now();
        } else {
            clearTimeout(lastFunc);
            lastFunc = setTimeout(() => {
                if (Date.now() - lastRan >= limit) {
                    func.apply(this, args);
                    lastRan = Date.now();
                }
            }, limit - (Date.now() - lastRan));
        }
    };
};
