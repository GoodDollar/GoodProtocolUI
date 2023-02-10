"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.decodeBase64Params = exports.encodeBase64Params = exports.openLink = void 0;
const react_native_1 = require("react-native");
const lodash_1 = require("lodash");
const json_1 = require("./json");
const schemeRe = /(.+?:)\/\//;
async function openLink(uri, target = "_blank", options = {}) {
    if (react_native_1.Platform.OS === "web") {
        const args = [new URL(uri, window.location.href).toString(), target];
        const { noopener = false, ...opts } = options || {};
        if (!(0, lodash_1.isEmpty)(options)) {
            const optsList = (0, lodash_1.toPairs)(opts).map(([key, value]) => `${key}: '${value}'`);
            if (noopener) {
                optsList.push("noopener");
            }
            args.push(optsList.join(", "));
        }
        window.open(...args);
        return;
    }
    // need to return original promise for compatibility
    let result;
    try {
        result = await react_native_1.Linking.openURL(uri);
    }
    catch (exception) {
        let error = exception;
        // check does sheme supported to make sure the exception is about this case
        const isSchemeSupported = await react_native_1.Linking.canOpenURL(uri).catch(() => false);
        if (!isSchemeSupported) {
            const [, scheme] = schemeRe.exec(uri);
            error = new Error(`There aren't apps installed can handle '${scheme}' scheme`);
        }
        throw error;
    }
    return result;
}
exports.openLink = openLink;
const encodeBase64Params = (value) => encodeURIComponent(btoa((0, lodash_1.isString)(value) ? value : JSON.stringify(value)));
exports.encodeBase64Params = encodeBase64Params;
const decodeBase64Params = (value) => (0, json_1.tryJson)(atob(decodeURIComponent(value)));
exports.decodeBase64Params = decodeBase64Params;
//# sourceMappingURL=linking.js.map