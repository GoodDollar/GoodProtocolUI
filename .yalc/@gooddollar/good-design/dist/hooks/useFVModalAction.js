"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useFVModalAction = void 0;
const web3sdk_v2_1 = require("@gooddollar/web3sdk-v2");
const lodash_1 = require("lodash");
const react_1 = require("react");
const useFVModalAction = ({ firstName, method, onClose = lodash_1.noop, redirectUrl }) => {
    const fvlink = (0, web3sdk_v2_1.useFVLink)();
    const [loading, setLoading] = (0, react_1.useState)(false);
    const redirectUri = (0, react_1.useMemo)(() => redirectUrl || document.location.href, [redirectUrl]);
    const verify = (0, react_1.useCallback)(async () => {
        setLoading(true);
        try {
            await (fvlink === null || fvlink === void 0 ? void 0 : fvlink.getLoginSig());
            await (fvlink === null || fvlink === void 0 ? void 0 : fvlink.getFvSig());
        }
        catch (e) {
            return;
        }
        finally {
            setLoading(false);
        }
        onClose();
        switch (method) {
            case "redirect": {
                const link = fvlink === null || fvlink === void 0 ? void 0 : fvlink.getLink(firstName, redirectUri, false);
                if (link) {
                    (0, web3sdk_v2_1.openLink)(link, "_self").catch(lodash_1.noop);
                }
                break;
            }
            case "popup":
            default: {
                const link = fvlink === null || fvlink === void 0 ? void 0 : fvlink.getLink(firstName, undefined, true);
                if (link) {
                    (0, web3sdk_v2_1.openLink)(link, "_blank", { width: "800px", height: "auto" }).catch(lodash_1.noop);
                }
                break;
            }
        }
    }, [fvlink, method, firstName, redirectUrl, onClose]);
    return { loading, verify };
};
exports.useFVModalAction = useFVModalAction;
//# sourceMappingURL=useFVModalAction.js.map