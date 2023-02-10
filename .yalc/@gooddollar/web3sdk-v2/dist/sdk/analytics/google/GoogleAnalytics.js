"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.GoogleAnalytics = void 0;
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
const api_1 = __importDefault(require("./api"));
const types_1 = require("./types");
class GoogleAnalytics {
    constructor(config) {
        const mergedCfg = (0, lodash_1.defaults)((0, lodash_1.clone)(config), types_1.defaultConfig);
        this.api = (0, api_1.default)(mergedCfg);
    }
    async initialize(appProps) {
        const { api } = this;
        const initialized = !!api;
        if (initialized) {
            api.setDefaultEventParams((0, lodash_1.omit)(appProps, "$once"));
        }
        return initialized;
    }
    identify(identifier, email, props) {
        const { api } = this;
        const { id, extra } = (0, utils_1.getUserProps)(identifier, email, props);
        if (!api) {
            throw new Error('GoogleAnalytics not initialized!');
        }
        api.setUserId(id);
        api.setUserProperties(extra);
    }
    send(event, data) {
        const { api } = this;
        if (!api) {
            throw new Error('GoogleAnalytics not initialized!');
        }
        api.logEvent(event, data);
    }
}
exports.GoogleAnalytics = GoogleAnalytics;
//# sourceMappingURL=GoogleAnalytics.js.map