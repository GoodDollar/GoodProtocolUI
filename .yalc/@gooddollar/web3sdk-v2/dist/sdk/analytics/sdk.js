"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Analytics = void 0;
const types_1 = require("./types");
const utils_1 = require("./utils");
const amplitude_1 = require("./amplitude");
const google_1 = require("./google");
const sentry_1 = require("./sentry");
const indicative_1 = require("./indicative");
class Analytics {
    constructor(config) {
        this.config = config;
        this.providers = [];
        this.initialized = false;
    }
    async initialize(appProps) {
        const factories = Object.entries(Analytics.factories);
        if (this.initialized) {
            return true;
        }
        await Promise.all(factories.map(async ([providerType, ProviderClass]) => {
            const config = this.config[providerType];
            if (!config || !config.enabled) {
                return;
            }
            const provider = new ProviderClass(config);
            const initialized = await provider.initialize(appProps); // eslint-disable-line @typescript-eslint/no-non-null-assertion 
            if (!initialized) {
                return;
            }
            this.providers.push(provider);
        }));
        this.initialized = true;
        return true;
    }
    identify(identifier, email, props) {
        if (!this.initialized) {
            return;
        }
        for (const provider of this.providers) {
            // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
            provider.identify(identifier, email, props);
        }
    }
    send(event, data) {
        if (!this.initialized) {
            return;
        }
        for (const provider of this.providers) {
            if (!(0, utils_1.supportsAnalytics)(provider)) {
                continue;
            }
            provider.send(event, data);
        }
    }
    capture(exception, fingerprint, tags, extra) {
        if (!this.initialized) {
            return;
        }
        for (const provider of this.providers) {
            if (!(0, utils_1.supportsMonitoring)(provider)) {
                continue;
            }
            provider.capture(exception, fingerprint, tags, extra);
        }
    }
}
exports.Analytics = Analytics;
Analytics.factories = {
    [types_1.ProviderType.Amplitude]: amplitude_1.Amplitude,
    [types_1.ProviderType.GoogleAnalytics]: google_1.GoogleAnalytics,
    [types_1.ProviderType.Indicative]: indicative_1.Indicative,
    [types_1.ProviderType.Sentry]: sentry_1.Sentry
};
//# sourceMappingURL=sdk.js.map