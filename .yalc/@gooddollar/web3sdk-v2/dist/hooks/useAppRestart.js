"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const useAppRestart_api_1 = require("./useAppRestart.api");
let isRestarting = false;
function useAppRestart() {
    const restartingRef = (0, react_1.useRef)(isRestarting);
    return (0, react_1.useCallback)((path) => {
        if (restartingRef.current) {
            return;
        }
        restartingRef.current = isRestarting = true;
        (0, useAppRestart_api_1.restart)(path);
    }, []);
}
exports.default = useAppRestart;
//# sourceMappingURL=useAppRestart.js.map