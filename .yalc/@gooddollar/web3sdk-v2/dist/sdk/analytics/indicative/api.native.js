"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_native_indicative_1 = __importDefault(require("react-native-indicative"));
class IndicativeAPINative {
    async initialize(apiKey) {
        react_native_indicative_1.default.launch(apiKey);
        return true;
    }
    addProperties(props) {
        react_native_indicative_1.default.addCommonProperties(props);
    }
    setUniqueID(id) {
        react_native_indicative_1.default.identifyUser(id);
    }
    buildEvent(eventName, props) {
        if (props) {
            react_native_indicative_1.default.record(eventName);
            return;
        }
        react_native_indicative_1.default.recordWithProperties(eventName, props);
    }
}
exports.default = IndicativeAPINative;
//# sourceMappingURL=api.native.js.map