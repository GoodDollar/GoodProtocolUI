"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.isMobile = exports.getDevice = void 0;
const bowser_1 = __importDefault(require("bowser"));
function getDevice() {
    const parsed = bowser_1.default.getParser(window.navigator.userAgent);
    const os = parsed.getOS();
    const browser = parsed.getBrowser();
    const { type } = parsed.getPlatform();
    return {
        type: type,
        os: os,
        browser: browser
    };
}
exports.getDevice = getDevice;
function isMobile() {
    const { type } = getDevice();
    return 'desktop' !== type;
}
exports.isMobile = isMobile;
//# sourceMappingURL=platform.js.map