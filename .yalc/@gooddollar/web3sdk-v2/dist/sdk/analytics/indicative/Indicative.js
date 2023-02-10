"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Indicative = void 0;
const lodash_1 = require("lodash");
const utils_1 = require("../utils");
const api_1 = require("./api");
const types_1 = require("./types");
const api = api_1.IndicativeAPIWebSdk && new api_1.IndicativeAPIWebSdk();
class Indicative {
    constructor(config) {
        this.config = (0, lodash_1.defaults)((0, lodash_1.clone)(config), types_1.defaultConfig);
    }
    async initialize(appProps) {
        const { apiKey } = this.config;
        if (!api || !apiKey) {
            return false;
        }
        const initialized = await api.initialize(apiKey);
        if (initialized) {
            api.addProperties((0, lodash_1.omit)(appProps, "$once"));
        }
        return initialized;
    }
    identify(identifier, email, props) {
        const { id, extra } = (0, utils_1.getUserProps)(identifier, email, props);
        const { userProperty } = this.config;
        if (!api) {
            throw new Error('Indicative analytics not initialized!');
        }
        api.setUniqueID(id);
        api.addProperties({ [userProperty]: extra }); // eslint-disable-line @typescript-eslint/no-non-null-assertion
    }
    send(event, data) {
        if (!api) {
            throw new Error('Indicative analytics not initialized!');
        }
        api.buildEvent(event, data);
    }
}
exports.Indicative = Indicative;
//# sourceMappingURL=Indicative.js.map