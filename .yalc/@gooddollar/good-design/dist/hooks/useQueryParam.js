"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useQueryParam = void 0;
const react_1 = require("react");
// @ts-ignore
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const useQueryParam = (param, decode = false) => {
    const { search, hash } = window.location;
    return (0, react_1.useMemo)(() => {
        // in case of hash we have empty search field
        const queryString = search || (hash === null || hash === void 0 ? void 0 : hash.split("?")[1]);
        const params = new URLSearchParams(queryString);
        const result = params.get(param);
        if (result === null || !decode) {
            return result;
        }
        return (0, web3sdk_v2_1.decodeBase64Params)(result);
    }, [param, decode]);
};
exports.useQueryParam = useQueryParam;
//# sourceMappingURL=useQueryParam.js.map