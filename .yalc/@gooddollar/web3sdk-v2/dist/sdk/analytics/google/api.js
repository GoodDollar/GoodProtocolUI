"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const { dataLayer } = window;
class DataLayer {
    constructor(userProperty) {
        this.userProperty = userProperty;
    }
    setDefaultEventParams(params = {}) {
        if ('event' in params) {
            throw new Error('Attempt to send event through setDefaultEventParams(). Use logEvent() instead');
        }
        this.push(params);
    }
    setUserId(id) {
        this.setUserProperties({ id });
    }
    // merges user data between calls
    setUserProperties(props = {}) {
        const self = this;
        const { userProperty } = self;
        dataLayer.push(function () {
            const user = this.get(userProperty) || {};
            const newProps = { ...user, ...props };
            this.set(userProperty, newProps);
            self.push({ [userProperty]: newProps });
        });
    }
    logEvent(event, data = {}) {
        this.push({ event, ...data });
    }
    push(params) {
        dataLayer.push(params);
    }
}
// eslint-disable-next-line @typescript-eslint/no-non-null-assertion
const GoogleAPIFactory = (config) => !dataLayer ? null : new DataLayer(config.userProperty);
exports.default = GoogleAPIFactory;
//# sourceMappingURL=api.js.map