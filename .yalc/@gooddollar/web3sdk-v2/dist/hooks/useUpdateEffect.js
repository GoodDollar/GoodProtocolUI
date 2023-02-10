"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFirstMountState = void 0;
const react_1 = require("react");
// https://github.com/streamich/react-use/blob/master/src/useFirstMountState.ts
function useFirstMountState() {
    const isFirst = (0, react_1.useRef)(true);
    if (isFirst.current) {
        isFirst.current = false;
        return true;
    }
    return isFirst.current;
}
exports.useFirstMountState = useFirstMountState;
// https://github.com/streamich/react-use/blob/master/src/useUpdateEffect.ts
const useUpdateEffect = (effect, deps) => {
    const isFirstMount = useFirstMountState();
    (0, react_1.useEffect)(() => {
        if (!isFirstMount) {
            return effect();
        }
    }, deps);
};
exports.default = useUpdateEffect;
//# sourceMappingURL=useUpdateEffect.js.map