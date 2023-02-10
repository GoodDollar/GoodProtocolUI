"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useNativeBalance = void 0;
const core_1 = require("@usedapp/core");
const utils_1 = require("ethers/lib/utils");
const useNativeBalance = () => {
    const { account } = (0, core_1.useEthers)();
    const nativeBalance = (0, core_1.useEtherBalance)(account);
    if (nativeBalance) {
        return (0, utils_1.formatEther)(nativeBalance);
    }
};
exports.useNativeBalance = useNativeBalance;
//# sourceMappingURL=useNativeBalance.js.map