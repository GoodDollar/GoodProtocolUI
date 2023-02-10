"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const native_base_1 = require("native-base");
const useScreenSize = () => {
    const isLargeScreen = (0, native_base_1.useBreakpointValue)({ base: false, lg: true });
    const isMediumScreen = (0, native_base_1.useBreakpointValue)({ base: false, md: true });
    const isSmallScreen = !isLargeScreen && !isMediumScreen;
    return { isSmallScreen, isLargeScreen, isMediumScreen };
};
exports.default = useScreenSize;
//# sourceMappingURL=useScreenSize.js.map