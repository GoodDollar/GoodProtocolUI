"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const useAppState_1 = __importDefault(require("./useAppState"));
const useRefreshOrNever = (refresh) => {
    const { active } = (0, useAppState_1.default)();
    return active ? refresh : "never";
};
exports.default = useRefreshOrNever;
//# sourceMappingURL=useRefreshOrNever.js.map