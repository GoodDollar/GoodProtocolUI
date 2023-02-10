"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const react_native_1 = require("react-native");
const useAppState = () => {
    const [appState, setAppState] = (0, react_1.useState)(react_native_1.AppState.currentState);
    (0, react_1.useEffect)(() => {
        const onChanged = state => void setAppState(state);
        const subscription = react_native_1.AppState.addEventListener("change", onChanged);
        return () => {
            subscription.remove();
        };
    }, [setAppState]);
    return { appState, active: appState === "active" };
};
exports.default = useAppState;
//# sourceMappingURL=useAppState.js.map