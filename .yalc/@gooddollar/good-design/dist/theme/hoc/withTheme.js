"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.withTheme = void 0;
const react_1 = __importDefault(require("react"));
const native_base_1 = require("native-base");
const withTheme = (options) => (Component) => {
    var _a;
    const { name: defaultName } = Component;
    const id = (_a = options === null || options === void 0 ? void 0 : options.name) !== null && _a !== void 0 ? _a : defaultName;
    if (!id) {
        throw new Error("Theming can not be applied on anonymous function without " +
            "setting component name explicitly in the HoC options: " +
            'useTheme({ name: "MyComponent" })(props => <some jsx>)');
    }
    const Wrapped = ({ children, ...props }) => {
        const themeProps = (0, native_base_1.useThemeProps)(id, props);
        // @ts-ignore
        return react_1.default.createElement(Component, { ...themeProps }, children);
    };
    Wrapped.displayName = `withTheme(${id})`;
    return Wrapped;
};
exports.withTheme = withTheme;
//# sourceMappingURL=withTheme.js.map