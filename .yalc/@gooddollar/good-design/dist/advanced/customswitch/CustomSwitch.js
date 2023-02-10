"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.CustomSwitch = void 0;
const react_1 = __importStar(require("react"));
const native_base_1 = require("native-base");
const lodash_1 = require("lodash");
const SelectBox_1 = __importDefault(require("./SelectBox"));
// import SwitchIcon from ' ../../assets/svg/arrow-swap.svg'
const SwitchIcon = () => (react_1.default.createElement("g", { strokeLinecap: "round", strokeLinejoin: "round", strokeWidth: "1.5" },
    react_1.default.createElement("path", { d: "m5 10.0909h14l-5.8396-5.0909", stroke: "#B0B4BB" }),
    react_1.default.createElement("path", { d: "m19 13.9091h-14l5.8396 5.0909", stroke: "#B0B4BB" })));
const SelectListItem = ({ chain, onPress, isListItem, isListOpen, isLeft, }) => {
    const type = isListItem ? "list" : "button";
    const onItemPress = (0, react_1.useCallback)(() => onPress(isLeft, chain !== null && chain !== void 0 ? chain : ''), [chain, onPress]);
    return (react_1.default.createElement(SelectBox_1.default, { variant: type, text: chain !== null && chain !== void 0 ? chain : '', press: onItemPress, isListItem: isListItem, isListOpen: isListOpen }));
};
//todo: add icon list (optional)
const CustomSwitch = ({ list, switchListCb }) => {
    const [showListLeft, setShowListLeft] = (0, react_1.useState)(false);
    const [showListRight, setShowListRight] = (0, react_1.useState)(false);
    const [sourceList, setSourceList] = (0, react_1.useState)(list);
    const [targetList, setTargetList] = (0, react_1.useState)(() => list.slice().reverse());
    const toggleList = (0, react_1.useCallback)((left) => {
        const side = {
            show: left ? showListLeft : showListRight,
            dispatch: left ? setShowListLeft : setShowListRight
        };
        side.dispatch(!side.show);
    }, [showListLeft, showListRight]);
    const switchSelect = () => {
        setSourceList(targetList);
        setTargetList(sourceList);
        switchListCb();
    };
    const selectFromList = (isLeft, chain) => {
        const sides = [sourceList, targetList];
        const selectedSide = isLeft ? sides.splice(0, 1)[0] : sides.splice(1, 1)[0];
        const altSide = sides[0];
        const listNumber = selectedSide.indexOf(chain);
        const selected = selectedSide.splice(listNumber, listNumber)[0];
        selectedSide.unshift(selected);
        if (altSide.indexOf(chain) === 0) {
            const altSelected = altSide.splice(listNumber, listNumber)[0];
            altSide.unshift(altSelected);
        }
        toggleList(isLeft);
        switchListCb(); //Todo: refactor to handle list with more then 2 values
    };
    const onUncheckList = (0, react_1.useCallback)((isLeft) => toggleList(isLeft), [toggleList]);
    const onUncheckItem = (0, react_1.useCallback)((isLeft, chain) => selectFromList(isLeft, chain), [toggleList, selectFromList]);
    return (react_1.default.createElement(native_base_1.View, { height: "16", display: "flex", flexDirection: "row", justifyContent: "flex-start", alignItems: "flex-start" },
        react_1.default.createElement(native_base_1.Box, { display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }, sourceList.map((chain, listNumber) => (react_1.default.createElement(SelectListItem, { key: chain, chain: !listNumber ? (0, lodash_1.first)(sourceList) : chain, isListOpen: showListLeft, isLeft: true, onPress: !listNumber ? onUncheckList : onUncheckItem, isListItem: listNumber !== 0 })))),
        react_1.default.createElement(native_base_1.Box, { w: "100px", height: "64px", pl: "3", pr: "3", display: "flex", justifyContent: "center", alignItems: "center" },
            react_1.default.createElement(native_base_1.Pressable, { onPress: switchSelect },
                react_1.default.createElement(native_base_1.Icon, { minWidth: "8", size: "xl", w: "6", h: "6", display: "flex", alignSelf: "center", justifyItems: "center", pl: "1.5", fill: "none", viewBox: "0 0 24 24" },
                    react_1.default.createElement(SwitchIcon, null)))),
        react_1.default.createElement(native_base_1.Box, { display: "flex", alignItems: "center", justifyContent: "center", flexDirection: "column" }, targetList.map((chain, listNumber) => (react_1.default.createElement(SelectListItem, { key: chain, chain: !listNumber ? (0, lodash_1.first)(targetList) : chain, isListOpen: showListRight, isLeft: false, onPress: !listNumber ? onUncheckList : onUncheckItem, isListItem: !!listNumber }))))));
};
exports.CustomSwitch = CustomSwitch;
//# sourceMappingURL=CustomSwitch.js.map