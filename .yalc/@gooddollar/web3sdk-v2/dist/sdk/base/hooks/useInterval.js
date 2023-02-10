"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useInterval = (callback, delay = 1000, autoStart = true) => {
    const callbackRef = (0, react_1.useRef)(callback);
    const intervalRef = (0, react_1.useRef)(null);
    const stop = (0, react_1.useCallback)(() => {
        if (!intervalRef.current) {
            return;
        }
        clearInterval(intervalRef.current);
        intervalRef.current = null;
    }, []);
    const start = (0, react_1.useCallback)(() => {
        stop();
        intervalRef.current = setInterval(() => callbackRef.current(), delay);
    }, [stop, delay]);
    (0, react_1.useLayoutEffect)(() => {
        callbackRef.current = callback;
    }, [callback]);
    (0, react_1.useEffect)(() => {
        if (autoStart || intervalRef.current) {
            start();
        }
        return stop;
    }, [autoStart, start, stop]);
    return [start, stop];
};
exports.default = useInterval;
//# sourceMappingURL=useInterval.js.map