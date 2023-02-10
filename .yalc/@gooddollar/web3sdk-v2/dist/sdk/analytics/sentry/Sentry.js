"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.Sentry = void 0;
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
const api_1 = __importDefault(require("./api"));
class Sentry {
    constructor(config) {
        this.config = config;
    }
    async initialize(appProps) {
        const { sentryDSN } = this.config;
        const { env, version, ...tags } = (0, lodash_1.omit)(appProps, 'osVersion', '$once');
        const sentryScope = { appVersion: version, ...tags };
        if (!sentryDSN) {
            return false;
        }
        api_1.default.init({
            dsn: sentryDSN,
            environment: env,
        });
        api_1.default.configureScope((scope) => (0, lodash_1.forOwn)(sentryScope, (value, property) => scope.setTag(property, value)));
        return true;
    }
    identify(identifier, email, props) {
        const { id, extra } = (0, utils_1.getUserProps)(identifier, email, props);
        api_1.default.configureScope((scope) => {
            const user = (0, lodash_1.get)(scope, '_user', {});
            scope.setUser({ ...user, id, email, ...extra });
        });
    }
    capture(exception, fingerprint, tags, extra) {
        api_1.default.configureScope((scope) => {
            // set extra
            (0, lodash_1.forOwn)(extra || {}, (value, key) => scope.setExtra(key, value));
            // set tags
            (0, lodash_1.forOwn)(tags || {}, (value, key) => scope.setTag(key, value));
            if (fingerprint) {
                scope.setFingerprint(fingerprint);
            }
            api_1.default.captureException(exception);
        });
    }
}
exports.Sentry = Sentry;
//# sourceMappingURL=Sentry.js.map