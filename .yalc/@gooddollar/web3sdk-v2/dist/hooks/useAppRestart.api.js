"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restart = void 0;
const restart = (path) => {
    const { location } = window;
    if (!path) {
        location.reload();
        return;
    }
    location.replace(path);
};
exports.restart = restart;
//# sourceMappingURL=useAppRestart.api.js.map