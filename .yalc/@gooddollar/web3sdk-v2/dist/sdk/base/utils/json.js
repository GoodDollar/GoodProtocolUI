"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.tryJson = void 0;
function tryJson(source) {
    if (source === null) {
        return null;
    }
    try {
        return JSON.parse(source);
    }
    catch {
        return source;
    }
}
exports.tryJson = tryJson;
//# sourceMappingURL=json.js.map