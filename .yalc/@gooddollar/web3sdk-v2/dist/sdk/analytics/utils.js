"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getUserProps = exports.supportsMonitoring = exports.supportsAnalytics = void 0;
const lodash_1 = require("lodash");
function supportsAnalytics(provider) {
    return 'send' in provider && (0, lodash_1.isFunction)(provider['send']);
}
exports.supportsAnalytics = supportsAnalytics;
function supportsMonitoring(provider) {
    return 'capture' in provider && (0, lodash_1.isFunction)(provider['capture']);
}
exports.supportsMonitoring = supportsMonitoring;
function getUserProps(identifier, email, props) {
    const id = String(identifier || email);
    const extra = (0, lodash_1.assign)((0, lodash_1.pickBy)({ email }), props || {});
    return { id, extra };
}
exports.getUserProps = getUserProps;
//# sourceMappingURL=utils.js.map