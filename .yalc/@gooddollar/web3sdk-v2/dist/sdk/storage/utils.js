"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.stringifyPairs = void 0;
const lodash_1 = require("lodash");
function stringifyPairs(keyValuePairs) {
    if (!(0, lodash_1.isArray)(keyValuePairs) || (0, lodash_1.isEmpty)(keyValuePairs)) {
        return;
    }
    return keyValuePairs.map(([key, value]) => [key, JSON.stringify(value)]);
}
exports.stringifyPairs = stringifyPairs;
//# sourceMappingURL=utils.js.map