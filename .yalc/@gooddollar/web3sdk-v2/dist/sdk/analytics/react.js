"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useSendAnalytics = exports.useAnalytics = exports.AnalyticsProvider = exports.AnalyticsContext = void 0;
const jsx_runtime_1 = require("react/jsx-runtime");
const react_1 = require("react");
const lodash_1 = require("lodash");
const sdk_1 = require("./sdk");
/* eslint-disable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
exports.AnalyticsContext = (0, react_1.createContext)({
    identify: (identifier, email, props) => { },
    send: (event, data) => { },
    capture: (exception, fingerprint, tags, extra) => { }
});
/* eslint-enable @typescript-eslint/no-unused-vars, @typescript-eslint/no-empty-function */
const AnalyticsProvider = ({ config, appProps, children }) => {
    const [sdk, setSDK] = (0, react_1.useState)(null);
    const configRef = (0, react_1.useRef)(config);
    const appPropsRef = (0, react_1.useRef)(appProps);
    const send = (0, react_1.useCallback)((event, data) => {
        var _a;
        (_a = sdk === null || sdk === void 0 ? void 0 : sdk.send) === null || _a === void 0 ? void 0 : _a.call(sdk, event, data);
    }, [sdk]);
    const capture = (0, react_1.useCallback)((exception, fingerprint, tags, extra) => {
        var _a;
        (_a = sdk === null || sdk === void 0 ? void 0 : sdk.capture) === null || _a === void 0 ? void 0 : _a.call(sdk, exception, fingerprint, tags, extra);
    }, [sdk]);
    const identify = (0, react_1.useCallback)((identifier, email, props) => {
        var _a;
        (_a = sdk === null || sdk === void 0 ? void 0 : sdk.identify) === null || _a === void 0 ? void 0 : _a.call(sdk, identifier, email, props);
    }, [sdk]);
    (0, react_1.useEffect)(() => {
        const sdk = new sdk_1.Analytics(configRef.current);
        sdk.initialize(appPropsRef.current).then(() => setSDK(sdk)).catch(lodash_1.noop);
    }, [setSDK]);
    return !sdk ? null : ((0, jsx_runtime_1.jsx)(exports.AnalyticsContext.Provider, { value: { send, capture, identify }, children: children }));
};
exports.AnalyticsProvider = AnalyticsProvider;
const useAnalytics = () => (0, react_1.useContext)(exports.AnalyticsContext);
exports.useAnalytics = useAnalytics;
const useSendAnalytics = () => {
    const { send } = (0, exports.useAnalytics)(); // eslint-disable-line @typescript-eslint/unbound-method
    return send;
};
exports.useSendAnalytics = useSendAnalytics;
//# sourceMappingURL=react.js.map