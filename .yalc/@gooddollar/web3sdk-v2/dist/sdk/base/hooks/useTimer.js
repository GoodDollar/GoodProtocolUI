"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const react_1 = require("react");
const moment_1 = __importDefault(require("moment"));
require("moment-duration-format");
const useInterval_1 = __importDefault(require("./useInterval"));
const getTimerState = (targetTime) => {
    const duration = moment_1.default.duration((0, moment_1.default)(targetTime).diff((0, moment_1.default)()));
    const isReachedZero = targetTime !== undefined && duration.asSeconds() <= 0;
    const countdown = isReachedZero ? "00:00:00" : duration.format("HH:mm:ss", { trim: false });
    return [countdown, isReachedZero];
};
const useTimer = (tillTime) => {
    const [targetTime, setTargetTime] = (0, react_1.useState)(tillTime);
    const [timerState, setTimerState] = (0, react_1.useState)(() => getTimerState(targetTime));
    const [countdown, isReachedZero] = timerState;
    const onTick = (0, react_1.useCallback)(() => {
        setTimerState(getTimerState(targetTime));
    }, [targetTime, setTimerState]);
    const [start, stop] = (0, useInterval_1.default)(onTick, 1000, false);
    (0, react_1.useEffect)(() => {
        start();
        return stop;
    }, [start, stop, targetTime]);
    (0, react_1.useEffect)(() => {
        if (isReachedZero) {
            stop();
        }
    }, [isReachedZero, stop]);
    return [countdown, isReachedZero, setTargetTime];
};
exports.default = useTimer;
//# sourceMappingURL=useTimer.js.map