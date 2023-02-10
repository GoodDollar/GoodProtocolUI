"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.usePressOrSwitchChain = void 0;
const core_1 = require("@usedapp/core");
const react_1 = require("react");
const Web3Context_1 = require("../contexts/Web3Context");
const usePressOrSwitchChain = (props) => {
    const [trigger, setTrigger] = (0, react_1.useState)(false);
    const { chainId } = (0, core_1.useEthers)();
    const { switchNetwork } = (0, Web3Context_1.useSwitchNetwork)();
    const onPress = (0, react_1.useCallback)(async () => {
        if (props.chainId !== chainId && switchNetwork) {
            await switchNetwork(props.chainId);
            // console.log("switched network?");
            setTrigger(true);
        }
        else {
            props.onPress();
        }
    }, [chainId, props, switchNetwork]);
    (0, react_1.useEffect)(() => {
        if (trigger && chainId === props.chainId) {
            props.onPress();
            setTrigger(false);
        }
    }, [trigger, chainId, props]);
    return onPress;
};
exports.usePressOrSwitchChain = usePressOrSwitchChain;
//# sourceMappingURL=usePressOrSwitchChain.js.map