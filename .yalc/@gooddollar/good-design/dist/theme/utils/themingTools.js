"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.withThemingTools = void 0;
const withThemingTools = (styleFactory) => (baseTools) => {
    const { colorMode } = baseTools;
    const colorModeValue = colorMode === "dark"
        ? (_, darkValue) => darkValue
        : lightValue => lightValue;
    return styleFactory({ ...baseTools, colorModeValue });
};
exports.withThemingTools = withThemingTools;
//# sourceMappingURL=themingTools.js.map