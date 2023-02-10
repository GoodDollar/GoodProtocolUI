"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Amplitude = void 0;
const lodash_1 = require("lodash");
const api_1 = require("./api");
const utils_1 = require("../utils");
class Amplitude {
    constructor(config) {
        this.config = config;
    }
    async initialize(appProps) {
        const { apiKey } = this.config;
        if (!apiKey) {
            return false;
        }
        // eslint-disable-next-line @typescript-eslint/await-thenable
        await (0, api_1.init)(apiKey);
        const { env, version, osVersion, $once = {}, ...tags } = appProps;
        const allTags = { env, version, os_version: osVersion, ...tags };
        const identity = this.identifyFromProps(allTags);
        (0, lodash_1.forOwn)($once, (value, key) => identity.setOnce(key, value));
        (0, api_1.identify)(identity);
        return true;
    }
    identify(identifier, email, props) {
        const { id, extra } = (0, utils_1.getUserProps)(identifier, email, props);
        const identity = this.identifyFromProps(extra);
        (0, api_1.setUserId)(id);
        (0, api_1.identify)(identity);
    }
    send(event, data) {
        const eventData = data || {};
        (0, api_1.logEvent)(event, eventData);
    }
    capture(exception, fingerprint, tags, extra) {
        const { errorEvent } = this.config;
        const { name, message } = exception;
        const data = { error: message, reason: name };
        if (!errorEvent) {
            return;
        }
        if (fingerprint) {
            data.unique = fingerprint.join(" ");
        }
        (0, lodash_1.assign)(data, ...(0, lodash_1.filter)([tags, extra]));
        this.send(errorEvent, data);
    }
    // todo-fix: add proper-typing
    identifyFromProps(props) {
        const identity = new api_1.Identify();
        (0, lodash_1.forOwn)(props, (value, key) => identity.append(key, value));
        return identity;
    }
}
exports.Amplitude = Amplitude;
//# sourceMappingURL=Amplitude.js.map